const Anthropic = require('@anthropic-ai/sdk');

const anthropic = process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here'
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are LifeLink AI, a compassionate and knowledgeable assistant for the LifeLink blood and organ donation platform.
Your mission is to save lives by providing accurate information and guiding users.

Core Responsibilities:
1. Explain blood donation rules (Age 18+, Weight 50kg+, health conditions).
2. Guide users on organ donation (Kidney, Liver, Heart, Cornea, Lungs) and registration preferences.
3. Help users find donors via the "Find Donors" page.
4. Answer general platform questions (registration, profile management, trust & safety).
5. Assistance in Emergencies: If a user is in an active emergency, remain calm, prioritize actionable steps (contacting hospitals, using LifeLink search), and express empathy.

Style Guidelines:
- Be professional yet empathetic.
- Use clear, simple language.
- For medical advice, always add a disclaimer: "Please consult with a medical professional for clinical decisions."
- If the AI API is unconfigured, inform the user politely that the medical engine is currently in maintenance.`;

/**
 * Intelligent Fallback for unconfigured AI
 */
const streamIntelligentFallback = async (socket, message) => {
  const msg = message.toLowerCase();
  let response = "";

  if (msg.includes('hello') || msg.includes('hi')) {
    response = "Hello! I'm LifeLink AI. I can help you understand blood donation rules, organ donor eligibility, or guide you to finding donors. How can I assist you today?";
  } else if (msg.includes('eligible') || msg.includes('can i donate')) {
    response = "To be eligible for blood donation, you usually need to be at least 18 years old, weigh over 50kg, and be in good general health. Specifically, you shouldn't have active infections, high fever, or be on specific medications. Please check our 'Eligibility' page for a detailed checklist! (Always consult a doctor for clinical advice).";
  } else if (msg.includes('blood') || msg.includes('group')) {
    response = "LifeLink manages all major blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-). O- is the universal donor, and AB+ is the universal recipient. If you need a specific type urgently, you can search for nearby donors in the 'Find Donors' page.";
  } else if (msg.includes('organ')) {
    response = "You can register preferences for Kidney, Liver, Heart, Cornea, and Lungs in your profile under 'Donation Preferences'. LifeLink connects these intentions with those in urgent need, making the process faster and more transparent during critical times.";
  } else if (msg.includes('find') || msg.includes('search') || msg.includes('donor')) {
    response = "To find a donor, navigate to the 'Find Donors' section. You can filter by blood group and we will show you verified donors based on proximity and their AI-verified match score.";
  } else if (msg.includes('emergency') || msg.includes('help') || msg.includes('accident')) {
    response = "I understand this is a stressful situation. First, ensure professional medical help is on the way (call emergency services). Then, use our 'Find Donors' page to search for compatible donors in your immediate area and contact them directly through the platform.";
  } else if (msg.includes('thank')) {
    response = "You're very welcome! Supporting our life-saving community is what I'm here for. Is there anything else you need help with?";
  } else {
    response = "I am the LifeLink medical assistant. While my advanced conversational engine is in maintenance, I can help you with specific queries about donation rules, eligibility, and finding donors. How can I best help you right now?";
  }

  // Simulate streaming response
  const chunks = response.split(' ');
  for (const chunk of chunks) {
    socket.emit('chat-delta', chunk + ' ');
    await new Promise(r => setTimeout(r, 40));
  }
  socket.emit('chat-end');
};

/**
 * Streaming Response for Socket.io
 */
const handleChatStream = async (socket, message, history) => {
  console.log(`[DEBUG] Received chat message from ${socket.id}: "${message}"`);
  
  if (!anthropic) {
    console.warn('[WARN] Anthropic API key missing. Using Intelligent Fallback.');
    await streamIntelligentFallback(socket, message);
    return;
  }

  try {
    console.log('[DEBUG] Calling Claude API for streaming response...');
    const stream = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        ...history,
        { role: "user", content: message }
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        socket.emit('chat-delta', chunk.delta.text);
      }
    }
    
    socket.emit('chat-end');
    console.log('[DEBUG] Chat stream completed for', socket.id);
  } catch (error) {
    console.error('[ERROR] Chat Stream Error:', error.message);
    socket.emit('chat-error', 'I encountered an error while processing your request. Please try again.');
  }
};

/**
 * Standard REST Response (Non-streaming)
 */
const getChatResponse = async (message, history = []) => {
  if (!anthropic) {
    console.warn('[WARN] Anthropic API key missing. Using Intelligent Fallback (REST).');
    const msg = message.toLowerCase();
    if (msg.includes('eligible')) return "Eligibility for donation usually requires being 18+ years old and over 50kg. Check our Eligibility page for details!";
    if (msg.includes('blood')) return "LifeLink supports all blood groups. You can find donors for A, B, AB, and O groups in the 'Find Donors' section.";
    if (msg.includes('organ')) return "We help coordinate Kidney, Liver, Heart, Cornea, and Lung donations. Register your preferences in your profile!";
    return "I am the LifeLink basic assistant. For full AI conversational capabilities, please ensure a valid Anthropic API key is configured in the backend.";
  }

  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      ...history,
      { role: "user", content: message }
    ]
  });

  return response.content[0].text;
};

module.exports = { handleChatStream, getChatResponse };
