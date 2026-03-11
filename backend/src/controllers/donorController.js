const User = require('../models/User');

// Haversine distance calculation not needed because we use MongoDB $geoNear
// but we might need it for ranking if we do it in memory.

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const searchDonors = async (req, res, next) => {
  const { bloodGroup, organType, lat, lng, radius, limit = 10 } = req.query;
  console.log(`[DEBUG] Donor search query: bloodGroup=${bloodGroup}, organType=${organType}, lat=${lat}, lng=${lng}, radius=${radius}`);

  // Corrected compatibility map: Recipient Group -> Possible Donor Groups
  const compatibilityMap = {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
  };

  const compatibleGroups = bloodGroup ? (compatibilityMap[bloodGroup] || [bloodGroup]) : [];
  
  try {
    let donors;
    const query = {
      _id: { $ne: req.user._id },
      role: { $in: ['Donor', 'Both'] },
      isFlagged: false,
      availability: true,
      ...(compatibleGroups.length > 0 && { bloodGroup: { $in: compatibleGroups } }),
      ...(organType && { 'donationPreferences.organs': organType })
    };

    if (lat && lng) {
      const geoNearOptions = {
        near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        distanceField: 'distance',
        spherical: true,
        query
      };

      if (radius) {
        // radius is in km, maxDistance is in meters
        geoNearOptions.maxDistance = parseFloat(radius) * 1000;
      }

      console.log('[DEBUG] Performing geo-spatial search with options:', geoNearOptions);
      donors = await User.aggregate([
        { $geoNear: geoNearOptions },
        { $limit: parseInt(limit) }
      ]);
    } else {
      console.log('[DEBUG] Performing standard query search');
      donors = await User.find(query).limit(parseInt(limit)).lean();
    }

    console.log(`[DEBUG] Found ${donors.length} donors in DB`);

    // AI Ranking Logic
    if (donors.length > 0) {
        if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
            console.warn('[WARN] No valid Anthropic API key, skipping AI ranking');
        } else {
            console.log('[DEBUG] Attempting AI ranking with Claude');
            try {
                const donorSummaries = donors.map(d => ({
                    id: d._id,
                    name: d.name,
                    age: d.age,
                    bloodGroup: d.bloodGroup,
                    distance: d.distance ? Math.round(d.distance / 1000) : 'unknown'
                }));

                const prompt = `Rank the following donors for a ${bloodGroup || 'any'} blood group request. 
                Prioritize by: 
                1. Exact blood group match.
                2. Proximity (distance in km).
                3. Age suitability (healthy young adults 18-45 prioritized).
                
                Donors: ${JSON.stringify(donorSummaries)}
                
                Return ONLY a JSON array of objects: [{ "id": "string", "matchScore": number 0-100, "reason": "short string" }]
                Sorted by score descending.`;

                const response = await anthropic.messages.create({
                    model: "claude-3-haiku-20240307",
                    max_tokens: 1024,
                    messages: [{ role: "user", content: prompt }],
                });

                const rankings = JSON.parse(response.content[0].text);
                
                // Merge rankings back into donor objects
                donors = donors.map(d => {
                    const rank = rankings.find(r => r.id === d._id.toString());
                    return {
                        ...d,
                        matchScore: rank ? rank.matchScore : 50,
                        matchReason: rank ? rank.reason : 'General match'
                    };
                }).sort((a, b) => b.matchScore - a.matchScore);
                console.log('[DEBUG] AI ranking completed successfully');

            } catch (aiError) {
                console.error('[ERROR] AI Ranking failed:', aiError.message);
                // Fallback score if AI fails
                donors = donors.map(d => ({
                    ...d,
                    matchScore: 50,
                    matchReason: 'Fallback matching'
                }));
            }
        }
    }

    res.status(200).json(donors);
  } catch (error) {
    console.error('[ERROR] Donor search error:', error);
    next(error);
  }
};

const getDonorById = async (req, res, next) => {
  try {
    const donor = await User.findById(req.params.id)
      .select('-password -tokens -role');
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.status(200).json(donor);
  } catch (error) {
    console.error('[ERROR] Get donor by ID error:', error);
    next(error);
  }
};

module.exports = { 
  searchDonors,
  getDonorById
};
