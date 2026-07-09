const axios = require('axios');

const SYSTEM_INSTRUCTION = `You are the official SmartGN Assistant, a helpful AI assistant for the SmartGN Digital Grama Niladhari Service Management System.
Your job is to assist residents and officers using the portal.
Here is the key information about the portal and how users can perform various actions:

1. Profile & NIC:
- To edit profile: Go to the 'Profile' tab in the side menu, click 'Edit profile' (top right), update details, and click 'Update'.
- To upload NIC front/back: Go to 'Profile' -> 'Edit profile' -> scroll to the bottom -> upload high-quality front and back images -> click 'Update'.

2. Certificates:
- Income Certificate: Requires specific documents based on income stream.
  * Paddy/Crops: Upload License, Permit, or Grant sheet copy.
  * Business: Upload Business Registration copy and Pradeshiya Sabha tax receipt.
  * Laborer/Other: No upload is mandatory, but must enter daily/monthly income details.
  * Government commission fee: 1.27% of the certified income value is charged.
- Character Certificate: Go to Certificates -> Apply for Character Certificate. Make sure profile has verified NIC uploads. The officer will verify details via the household registry.
- Rejected Certificates: Go to Certificates -> Rejected Certificates. Click on entries to check specific comments/remarks from the GN officer. Correct the fields or upload clear documents and re-apply.

3. Appointments:
- To book an appointment: Go to the 'Appointments' tab, select a date on the calendar, select an available slot, enter the purpose, and click 'Confirm'.
- Officer Hours: Weekdays (Monday - Friday) from 9:00 AM to 4:00 PM.

4. Household/Family Registry:
- To manage registry: Go to the 'Family' tab. Click 'Add Member', enter details (Name, NIC, Relation, DOB), and click 'Save'.

5. Allowances & Welfare:
- To apply: Go to the 'Allowances' tab. Browse active programs (Aswesuma, Samurdhi), complete the digital form, and submit.

6. Disaster Relief:
- To report damage: Go to 'Disaster Relief' in the sidebar, specify the disaster type, estimate damage level, and request aid (medical, food, shelter), then submit.

7. Officer Instructions:
- Officer Portal: Officers can approve/reject certificates (must provide remarks for rejection) and accept/reschedule appointments.

Be concise, friendly, and helpful. Use formatting (bullet points, bold text) to make your instructions easy to follow. If the user asks general questions, answer them politely while relating back to SmartGN services where appropriate.`;

exports.handleChat = async (req, res) => {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not defined in the environment variables.');
    return res.status(500).json({ error: 'Chat service is temporarily unavailable due to missing API key configuration.' });
  }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request: messages array is required.' });
  }

  try {
    // 1. Filter out empty messages
    const rawMessages = messages.filter(msg => msg.text && msg.text.trim());

    // 2. Map role names to 'user' or 'model'
    const mapped = rawMessages.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      text: msg.text.trim()
    }));

    // 3. Combine consecutive messages of the same role
    const combined = [];
    for (const msg of mapped) {
      if (combined.length > 0 && combined[combined.length - 1].role === msg.role) {
        combined[combined.length - 1].text += "\n" + msg.text;
      } else {
        combined.push(msg);
      }
    }

    // 4. Ensure the history starts with a 'user' message
    while (combined.length > 0 && combined[0].role !== 'user') {
      combined.shift();
    }

    // 5. Ensure the history ends with a 'user' message (the latest input to generate content for)
    while (combined.length > 0 && combined[combined.length - 1].role !== 'user') {
      combined.pop();
    }

    if (combined.length === 0) {
      return res.status(400).json({ error: 'Invalid request: no user messages found in history.' });
    }

    // Format messages for Gemini API payload
    const formattedContents = combined.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const payload = {
      contents: formattedContents,
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      }
    };

    const endpoints = [
      { url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, name: 'v1/gemini-1.5-flash' },
      { url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, name: 'v1/gemini-2.5-flash' },
      { url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, name: 'v1/gemini-1.5-pro' },
      { url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${apiKey}`, name: 'v1/gemini-2.5-pro' },
      { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, name: 'v1beta/gemini-1.5-flash' },
      { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, name: 'v1beta/gemini-2.5-flash' },
      { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, name: 'v1beta/gemini-1.5-pro' },
      { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, name: 'v1beta/gemini-2.5-pro' }
    ];

    let lastError = null;
    let reply = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying Gemini endpoint: ${endpoint.name}...`);
        const response = await axios.post(endpoint.url, payload, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout per attempt
        });

        if (
          response.data &&
          response.data.candidates &&
          response.data.candidates.length > 0 &&
          response.data.candidates[0].content &&
          response.data.candidates[0].content.parts &&
          response.data.candidates[0].content.parts.length > 0
        ) {
          reply = response.data.candidates[0].content.parts[0].text;
          console.log(`Successfully generated content using: ${endpoint.name}`);
          break;
        }
      } catch (err) {
        lastError = err.response ? err.response.data : err.message;
        console.error(`Failed with endpoint ${endpoint.name}:`, JSON.stringify(lastError));
      }
    }

    if (reply) {
      return res.json({ reply });
    } else {
      throw new Error(`All Gemini API endpoints failed. Last error: ${JSON.stringify(lastError)}`);
    }
  } catch (error) {
    console.error('Error communicating with Gemini API:', error.message);
    return res.status(500).json({ 
      error: 'Failed to communicate with AI chat service.', 
      details: error.message 
    });
  }
};
