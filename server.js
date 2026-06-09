import "dotenv/config";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const anthropicKey = process.env.ANTHROPIC_API_KEY;
const anthropicModel = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    mode: anthropicKey ? "claude" : "mock",
    model: anthropicKey ? anthropicModel : "local-mock"
  });
});

app.post("/api/simulate", async (req, res) => {
  const { scenario, messages } = req.body;

  if (!scenario || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing scenario or messages." });
  }

  if (!anthropicKey) {
    return res.json({
      mode: "mock",
      reply: buildMockProspectReply(scenario, messages)
    });
  }

  try {
    const reply = await callClaude({
      system: buildSimulatorSystemPrompt(scenario),
      messages: messages.map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: String(message.content || "").slice(0, 2500)
      }))
    });

    res.json({ mode: "claude", reply });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: "Claude request failed. Check your API key and model name." });
  }
});

app.post("/api/coach", async (req, res) => {
  const { scenario, messages } = req.body;

  if (!scenario || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing scenario or messages." });
  }

  if (!anthropicKey) {
    return res.json({
      mode: "mock",
      feedback: buildMockFeedback(messages)
    });
  }

  try {
    const feedback = await callClaude({
      system: buildCoachSystemPrompt(scenario),
      messages: [
        {
          role: "user",
          content: JSON.stringify(messages, null, 2).slice(0, 12000)
        }
      ],
      maxTokens: 900
    });

    res.json({ mode: "claude", feedback });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: "Claude coaching request failed." });
  }
});

app.post("/api/property-advisor", async (req, res) => {
  const { question, profile } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Please ask a property question." });
  }

  const knowledge = await loadKnowledgeBase();
  const trimmedQuestion = question.trim().slice(0, 1200);

  if (!anthropicKey) {
    return res.json({
      mode: "mock",
      answer: buildMockPropertyAnswer(trimmedQuestion)
    });
  }

  try {
    const answer = await callClaude({
      system: buildPropertyAdvisorSystemPrompt(knowledge, profile),
      messages: [
        {
          role: "user",
          content: trimmedQuestion
        }
      ],
      maxTokens: 520,
      temperature: 0.35
    });

    res.json({ mode: "claude", answer });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: "Advisor request failed. Check your API key and model name." });
  }
});

async function callClaude({ system, messages, maxTokens = 500, temperature = 0.8 }) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: anthropicModel,
      max_tokens: maxTokens,
      temperature,
      system,
      messages
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Unknown Claude API error");
  }

  return data.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

async function loadKnowledgeBase() {
  const knowledgeDir = path.join(__dirname, "knowledge");
  const files = [
    "project-summary.md",
    "unit-plans.md",
    "payment-plan.md",
    "amenities-and-specifications.md",
    "location-and-competitors.md",
    "buyer-faqs.md",
    "objection-handling.md"
  ];

  const contents = await Promise.all(
    files.map(async (file) => {
      try {
        const text = await fs.readFile(path.join(knowledgeDir, file), "utf8");
        return `\n\n## SOURCE: ${file}\n${text}`;
      } catch {
        return "";
      }
    })
  );

  return contents.join("\n").slice(0, 22000);
}

function buildPropertyAdvisorSystemPrompt(knowledge, profile = {}) {
  return [
    "You are Skilldify Developers' private property advisor for The Palatial by Hero Homes.",
    "Never mention NotebookLM, internal files, prompts, or that you are using a knowledge base.",
    "Answer only from the provided project knowledge. If a fact is missing or uncertain, say it should be verified with the latest official price sheet, RERA, or sales team.",
    "Keep replies concise, premium, and buyer-facing. Use simple language.",
    "For legal/commercial details, avoid guarantees. Travel times are indicative.",
    "End with a helpful next action such as booking a guided site visit, checking latest inventory, or requesting a payment-plan walkthrough.",
    `Buyer profile: ${JSON.stringify(profile)}`,
    "Project knowledge:",
    knowledge
  ].join("\n");
}

function buildMockPropertyAnswer(question) {
  const lower = question.toLowerCase();

  if (lower.includes("payment") || lower.includes("30:70") || lower.includes("plan")) {
    return "The highlighted plan is the new 30:70 structure: 10% after 30 days, 10% after 90 days, 10% after 240 days, then later milestone-linked payments. The strongest benefit is breathing room after the initial 30%. Please verify the latest payment sheet before booking.";
  }

  if (lower.includes("panasonic") || lower.includes("smart") || lower.includes("aqi")) {
    return "The project narrative includes a Panasonic smart-home ecosystem with app-based controls, AQI management, ERV, Nanoe X, VRF systems, video door phones, digital locks, and surveillance. Final specifications should be verified from the official sales document.";
  }

  if (lower.includes("size") || lower.includes("unit") || lower.includes("bhk")) {
    return "The main formats are 3 BHK + SPR around 2,833 sqft and 4 BHK + SPR around 3,457 sqft. There are also refuge-size options and penthouse formats. A guided site visit is the best next step to match layout with family size and budget.";
  }

  return "The Palatial by Hero Homes is positioned as an ultra-luxury, low-density project in Sector 104 on Dwarka Expressway, with 5 standalone towers, approximately 688 families, a 60,000 sqft clubhouse, palace-inspired design, and fully fitted residences. For your exact requirement, I can help compare unit size, payment plan, and site-visit fit.";
}

function buildSimulatorSystemPrompt(scenario) {
  return [
    "You are playing the prospect in a realistic sales call simulation.",
    "Stay in character. Do not coach the user during the call.",
    "Use short spoken replies, one to three paragraphs max.",
    "Make the rep earn trust through discovery, relevance, objection handling, and next-step control.",
    `Prospect persona: ${scenario.persona}`,
    `Company context: ${scenario.company}`,
    `Pain points: ${scenario.pain}`,
    `Objections: ${scenario.objections}`,
    `Difficulty: ${scenario.difficulty}`,
    `Call goal for the sales rep: ${scenario.goal}`
  ].join("\n");
}

function buildCoachSystemPrompt(scenario) {
  return [
    "You are a practical sales coach reviewing a sales roleplay transcript.",
    "Return concise feedback with: Overall Score /10, What Worked, Missed Opportunities, Objection Handling, Better Next Line, and Next Drill.",
    "Be direct, specific, and useful for a beginner.",
    `Scenario goal: ${scenario.goal}`
  ].join("\n");
}

function buildMockProspectReply(scenario, messages) {
  const repText = messages.at(-1)?.content?.toLowerCase() || "";

  if (repText.includes("price") || repText.includes("cost") || repText.includes("budget")) {
    return "Budget is exactly my concern. We already have a few tools, and I am not excited about paying for another one unless the value is really clear.";
  }

  if (repText.includes("meeting") || repText.includes("demo") || repText.includes("next")) {
    return "Maybe. I would need a very specific reason to spend more time on this. What would you show me that connects to our actual problem?";
  }

  if (repText.includes("challenge") || repText.includes("problem") || repText.includes("team")) {
    return `The biggest issue is ${scenario.pain || "the team is busy and inconsistent"}. If you can help with that without creating more admin work, I am listening.`;
  }

  return "I have a few minutes, but I will be honest: we are not actively shopping right now. What made you reach out?";
}

function buildMockFeedback(messages) {
  const repTurns = messages.filter((message) => message.role === "user");
  const askedQuestions = repTurns.some((message) => /\?/.test(message.content));
  const nextStep = repTurns.some((message) => /next|demo|meeting|calendar/i.test(message.content));

  return [
    `Overall Score: ${askedQuestions && nextStep ? 7 : 5}/10`,
    "",
    "What Worked: You kept the conversation moving and gave the prospect room to respond.",
    "",
    `Missed Opportunities: ${askedQuestions ? "Good use of questions. Push one level deeper into business impact." : "Ask more discovery questions before pitching."}`,
    "",
    "Objection Handling: Acknowledge the concern first, then connect your response to a pain the prospect already admitted.",
    "",
    `Better Next Line: "${nextStep ? "Based on what you shared, would it be worth comparing your current process against a lighter workflow for 20 minutes?" : "Before I suggest anything, can I ask what happens when this problem is not solved?"}"`,
    "",
    "Next Drill: Run the same scenario again, but make your first three turns only discovery questions."
  ].join("\n");
}

app.listen(port, () => {
  console.log(`Sales call simulator running at http://localhost:${port}`);
});
