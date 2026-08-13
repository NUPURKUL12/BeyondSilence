import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK on server side
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "BeyondSilence Healthcare API", timestamp: new Date().toISOString() });
});

// Simplify Medical Transcript API
app.post("/api/gemini/simplify", async (req, res) => {
  try {
    const { transcript, userRole } = req.body;
    if (!transcript || typeof transcript !== "string") {
      return res.status(400).json({ error: "Transcript text is required" });
    }

    const ai = getGenAI();
    if (!ai) {
      // Fallback structured response if key is missing or not configured yet
      return res.json({
        simplifiedText: transcript.replace(/hypertension/gi, "high blood pressure")
          .replace(/analgesic/gi, "pain reliever")
          .replace(/myocardial infarction/gi, "heart attack"),
        signGlosses: ["DOCTOR", "TALK", "MEDICINE", "IMPORTANT"],
        keyActionItems: [
          "Take medicine as instructed by doctor",
          "Drink plenty of water",
          "Rest and keep track of symptoms"
        ],
        medicalTerms: [
          { term: "Prescription", explanation: "Medicine ordered by your doctor" }
        ],
        urgencyLevel: "medium",
        isFallback: true
      });
    }

    const prompt = `You are BeyondSilence AI, a specialized healthcare communication assistant for Deaf and Hard of Hearing patients, doctors, and caregivers.

Please analyze the following medical interaction transcript/text and translate it into a structured, highly visual, deaf-accessible format:
"${transcript}"

User Context/Role: ${userRole || "Deaf Patient"}

Requirements:
1. simplifiedText: Convert complex medical terminology into clear, 5th-grade plain language that is easy to read quickly.
2. signGlosses: Provide an array of core ASL/BSL sign language keyword glosses in ALL CAPS representing the primary message (e.g. ["DOCTOR", "NEED", "CHECK", "BLOOD-PRESSURE", "EVERY-DAY"]).
3. keyActionItems: An array of concise, actionable steps for the patient or caregiver.
4. medicalTerms: An array of objects with "term" and simple "explanation" for any complex medical words mentioned.
5. urgencyLevel: String, one of ["low", "medium", "high", "emergency"].`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            simplifiedText: { type: Type.STRING },
            signGlosses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyActionItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            medicalTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ["term", "explanation"],
              },
            },
            urgencyLevel: { type: Type.STRING },
          },
          required: ["simplifiedText", "signGlosses", "keyActionItems", "medicalTerms", "urgencyLevel"],
        },
      },
    });

    const resultText = response.text;
    if (resultText) {
      const parsedData = JSON.parse(resultText);
      return res.json(parsedData);
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error: any) {
    console.error("Error in /api/gemini/simplify:", error);
    res.status(500).json({
      error: "Failed to simplify transcript",
      details: error.message,
    });
  }
});

// Translate Symptom / Pain Matrix into Doctor Note
app.post("/api/gemini/symptom-translator", async (req, res) => {
  try {
    const { bodyPart, severity, descriptors, notes } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        clinicalSummary: `Patient reports ${severity}/10 pain in the ${bodyPart || "body"}. Descriptors: ${descriptors?.join(", ") || "General pain"}. Notes: ${notes || "None"}.`,
        patientSignGloss: ["PAIN", bodyPart ? bodyPart.toUpperCase() : "BODY", "LEVEL", String(severity)],
        recommendedDoctorQuestions: ["When did this pain start?", "Does anything make it better or worse?"],
        isFallback: true
      });
    }

    const prompt = `Convert the following patient symptom inputs into a professional doctor clinical summary and a sign language translation sequence:
- Body Part: ${bodyPart}
- Pain Severity: ${severity}/10
- Descriptors: ${descriptors?.join(", ")}
- Additional Patient Notes: ${notes || "None"}

Return JSON format with:
- clinicalSummary: Clear, objective concise sentence for medical record.
- patientSignGloss: ASL/BSL sign keyword sequence for Deaf communication screen.
- recommendedDoctorQuestions: 3 clear questions the doctor can tap or show to the Deaf patient.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clinicalSummary: { type: Type.STRING },
            patientSignGloss: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendedDoctorQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["clinicalSummary", "patientSignGloss", "recommendedDoctorQuestions"],
        },
      },
    });

    const resultText = response.text;
    if (resultText) {
      return res.json(JSON.parse(resultText));
    }
    throw new Error("Failed to process symptom data");
  } catch (error: any) {
    console.error("Error in /api/gemini/symptom-translator:", error);
    res.status(500).json({ error: error.message });
  }
});

// Multi-Turn Gemini Chatbot Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, systemInstruction, model } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required and must not be empty" });
    }

    const ai = getGenAI();

    // Model selection validation
    const targetModel = model || "gemini-3.5-flash";

    if (!ai) {
      // Fallback message response if key is missing or not configured
      const lastUserMsg = messages[messages.length - 1]?.text || "Hello";
      return res.json({
        reply: `[Demo Mode / Key Required] BeyondSilence Assistant response to: "${lastUserMsg}". Please set your GEMINI_API_KEY to enable live multi-turn AI reasoning with ${targetModel}.`,
        isFallback: true,
      });
    }

    // Format conversation history into contents array for generateContent
    const contents = messages.map((msg: { role: string; text: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: contents,
      config: {
        systemInstruction: systemInstruction || "You are BeyondSilence AI, a helpful communication and sign language assistant for Deaf and Hard of Hearing individuals.",
      },
    });

    const reply = response.text || "No response generated.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/gemini/chat:", error);
    res.status(500).json({
      error: "Failed to generate chat response",
      details: error.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BeyondSilence server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
