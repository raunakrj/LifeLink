const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const getAiMatchRecommendations = async (requestDetails, donors) => {
  try {
    const prompt = `You are a medical emergency AI coordinator.
    Patient Request:
    Blood Needed: ${requestDetails.bloodGroup}
    Organ Needed: ${requestDetails.organType || 'None'}
    Urgency: ${requestDetails.urgency}
    Location: ${JSON.stringify(requestDetails.location)}

    Top 5 Candidates Found:
    ${donors.map((d, i) => `
    ${i+1}. Name: ${d.name}, Blood: ${d.bloodGroup}, Distance: ${Math.round(d.distance/1000)}km, Age: ${d.age}
    `).join('')}

    Instructions:
    Task: Re-rank these donors based on:
    1. Distance (Closer is better)
    2. Blood Compatibility (Perfect matches preferred over O- universal)
    3. Age (Younger/Healthier preferred for some cases)
    4. Urgency
    
    Return a JSON array of donor objects with an added field 'aiRecommendation' (a 2-sentence empathetic explanation for the match) and 'score' (1-100).
    
    Format:
    [{ "id": "...", "score": 95, "aiRecommendation": "..." }, ...]`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const result = JSON.parse(response.content[0].text);
    return result;
  } catch (error) {
    console.error('Claude Matching Error:', error);
    return donors.map(d => ({ id: d._id, score: 50, aiRecommendation: "Recommended candidate based on proximity." }));
  }
};

module.exports = { getAiMatchRecommendations };
