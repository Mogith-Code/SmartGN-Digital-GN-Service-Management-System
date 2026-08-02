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
- To apply: Go to the 'Allowances' tab. Browse active programs (Aswesuma, Samurdhi), complete the digital form, attach supporting document, and submit.

6. Disaster Relief:
- To report damage: Go to 'Disaster Relief' in the sidebar, specify the disaster type, estimate damage level, and request aid (medical, food, shelter), then submit.

7. Officer Instructions:
- Officer Portal: Officers can approve/reject certificates (must provide remarks for rejection), disburse allowance funds, and accept/reschedule appointments.

Be concise, friendly, and helpful.`;

// Local Intelligent Rule Assistant Fallback
const generateLocalAssistantResponse = (userText = "") => {
  const text = userText.toLowerCase();

  if (text.includes("profile") || text.includes("edit") || text.includes("update")) {
    return "To edit your profile:\n\n1. Go to the 'Profile' tab in the sidebar menu.\n2. Click the 'Edit Profile' button.\n3. Update your contact or personal details and click 'Update'.";
  }

  if (text.includes("nic") || text.includes("identity") || text.includes("card")) {
    return "To upload your NIC images:\n\n1. Open your 'Profile' tab.\n2. Click 'Edit Profile'.\n3. Scroll down to upload front and back images of your National Identity Card.\n4. Click 'Update' to save.";
  }

  if (text.includes("income") || text.includes("certificate")) {
    return "For Income Certificate applications:\n\n• Paddy/Crops: Upload License, Permit, or Grant sheet copy.\n• Business: Upload Business Registration and Pradeshiya Sabha tax receipt.\n• Laborer/Other: Enter daily/monthly income details.\n• Note: A 1.27% government commission fee applies.";
  }

  if (text.includes("character")) {
    return "To apply for a Character Certificate:\n\n1. Go to Certificates -> Apply for Character Certificate.\n2. Ensure your profile has verified NIC uploads.\n3. Submit application. Your GN Officer will verify details via the household registry.";
  }

  if (text.includes("appointment") || text.includes("slot") || text.includes("book")) {
    return "To book an appointment:\n\n1. Go to the 'Appointments' tab.\n2. Pick a date on the calendar and select an available time slot.\n3. Enter the visit purpose and click 'Confirm'.\n\nOfficer hours: Weekdays 9:00 AM - 4:00 PM.";
  }

  if (text.includes("allowance") || text.includes("aswesuma") || text.includes("samurdhi")) {
    return "To apply for Welfare Allowances (Aswesuma / Samurdhi):\n\n1. Open the 'Allowances' tab in the sidebar.\n2. Select your allowance program.\n3. Complete monthly income & bank account details.\n4. Attach supporting documents and click 'Confirm Application'.";
  }

  if (text.includes("disaster") || text.includes("relief") || text.includes("flood")) {
    return "To report a disaster incident:\n\n1. Go to the 'Disaster Relief' tab.\n2. Select disaster type, damage level, and required relief (food, medical, shelter).\n3. Click Submit to send urgent alert to GN team.";
  }

  if (text.includes("family") || text.includes("household") || text.includes("member")) {
    return "To manage your Household Registry:\n\n1. Navigate to the 'Family & Household' tab.\n2. Click 'Add Member' to register family members (Name, NIC, Relation, DOB).\n3. View your registered household number and land details.";
  }

  return "Hello! I am your official SmartGN Assistant. You can ask me about:\n\n• How to edit profile & upload NIC\n• Applying for Income & Character certificates\n• Booking appointments & officer hours\n• Applying for Aswesuma & Samurdhi allowances\n• Reporting disaster damage & relief requests";
};

exports.handleChat = async (req, res) => {
  const { messages } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request: messages array is required.' });
  }

  // Extract latest user message text
  const lastUserMsg = messages.slice().reverse().find(m => m.role === 'user' || m.sender === 'user');
  const userQuery = lastUserMsg ? (lastUserMsg.text || '') : '';

  // If no Gemini API key configured, use local intelligent assistant gracefully (200 OK)
  if (!apiKey) {
    console.log('💡 Using SmartGN Local Intelligent Knowledge Assistant (No GEMINI_API_KEY set)');
    const reply = generateLocalAssistantResponse(userQuery);
    return res.status(200).json({ reply });
  }

  try {
    // 1. Filter out empty messages
    const rawMessages = messages.filter(msg => (msg.text && msg.text.trim()));

    // 2. Map role names to 'user' or 'model'
    const mapped = rawMessages.map(msg => ({
      role: (msg.role === 'model' || msg.sender === 'assistant') ? 'model' : 'user',
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

    // 4. Ensure history starts and ends with user
    while (combined.length > 0 && combined[0].role !== 'user') {
      combined.shift();
    }
    while (combined.length > 0 && combined[combined.length - 1].role !== 'user') {
      combined.pop();
    }

    if (combined.length === 0) {
      const reply = generateLocalAssistantResponse(userQuery);
      return res.status(200).json({ reply });
    }

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
      { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, name: 'v1beta/gemini-1.5-flash' }
    ];

    let reply = null;

    for (const endpoint of endpoints) {
      try {
        const response = await axios.post(endpoint.url, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 6000
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
          break;
        }
      } catch (err) {
        console.warn(`Gemini endpoint ${endpoint.name} unavailable, trying fallback...`);
      }
    }

    if (!reply) {
      reply = generateLocalAssistantResponse(userQuery);
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.warn('Gemini chat service exception, using local assistant fallback:', error.message);
    const reply = generateLocalAssistantResponse(userQuery);
    return res.status(200).json({ reply });
  }
};
