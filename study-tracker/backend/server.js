require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
    console.error("ERROR: GROQ_API_KEY environment variable is not set!");
}

app.post("/ai", async (req, res) => {
    try {
        const { study, insta, other, score, subject, goal, logs } = req.body;
        
        // Create a more detailed prompt for the AI
        const prompt = `You are an expert study coach. Analyze this student's study session data and provide comprehensive, personalized study advice. Be specific, actionable, and encouraging.

STUDENT DATA:
- Study Hours Today: ${study}
- Instagram/Social Media: ${insta} hours
- Other Distractions: ${other} hours  
- Performance Score: ${score}%
- Subject Focus: ${subject}
- Academic Goal: ${goal}

RECENT STUDY HISTORY:
${JSON.stringify((logs || []).slice(-5))}

Please provide 5 detailed, high-quality study tips that address:
1. Time management and productivity
2. Subject-specific strategies for ${subject}
3. Goal-oriented preparation for ${goal}
4. Distraction management
5. Long-term study habits and improvement

Make each tip specific, actionable, and tailored to their current performance and goals. Be encouraging and realistic.`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const aiResponse = data.choices[0].message.content;
            // Split response into individual tips
            const tips = aiResponse.split('\n')
                .filter(line => line.trim().length > 0)
                .map(line => line.replace(/^\d+\.\s*/, '').trim()) // Remove numbering
                .slice(0, 5);
            
            res.json({ tips });
        } else {
            res.status(500).json({ error: "Invalid AI response" });
        }
    } catch (error) {
        console.error("AI API Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/chat", async (req, res) => {
    try {
        const { message, goal, logs } = req.body;
        
        const chatPrompt = `You are an AI study assistant helping a student with their academic goals. Be helpful, encouraging, and provide specific advice.

Student's Goal: ${goal || 'General academic improvement'}
Recent Study History: ${JSON.stringify((logs || []).slice(-3))}

Student's Message: ${message}

Respond as a knowledgeable study coach. Keep responses conversational but informative. If they ask about study techniques, subjects, or goals, provide specific, actionable advice.`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "user",
                        content: chatPrompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const aiResponse = data.choices[0].message.content;
            res.json({ response: aiResponse });
        } else {
            res.status(500).json({ error: "Invalid AI response" });
        }
    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Fallback to serve index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});