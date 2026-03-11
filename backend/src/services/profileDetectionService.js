const Anthropic = require('@anthropic-ai/sdk');
const User = require('../models/User');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const detectFakeProfile = async (userData) => {
  try {
    const prompt = `Analyze the following user profile data for an organ/blood donation platform and detect if it looks suspicious or like a bot/fake profile. 
    Look for:
    - Implausible combinations (e.g., age vs name, or nonsensical strings).
    - Bot-like patterns in email or phone numbers.
    - Duplicate contact signals (if compared to a list, but here just analyze the single profile).
    
    Profile Data:
    Name: ${userData.name}
    Email: ${userData.email}
    Phone: ${userData.phone}
    Age: ${userData.age}
    Location: ${JSON.stringify(userData.location)}
    Blood Group: ${userData.bloodGroup}
    Role: ${userData.role}
    
    Return ONLY a JSON object with this format:
    { "isSuspicious": boolean, "reason": "string explaining why" }`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const resultText = response.content[0].text;
    const result = JSON.parse(resultText);

    if (result.isSuspicious) {
      await User.findByIdAndUpdate(userData._id, { isFlagged: true });
      console.log(`[ALERT] Suspicious profile detected: ${userData.email}. Reason: ${result.reason}`);
    }

    return result;
  } catch (error) {
    console.error('Fake Profile Detection Error:', error);
    // Don't throw, just log. We don't want to block registration if AI fails.
  }
};

module.exports = { detectFakeProfile };
