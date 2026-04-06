// ─── MindSync AI Service (Groq — llama-3.3-70b) ─────────────────────
import { getLatestMood } from "./store";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are MindSync — a warm, empathetic AI wellness companion inside a mindfulness app. Your role:

PERSONALITY:
- Speak like a caring, wise friend — not clinical or robotic
- Use short, digestible paragraphs (2-3 sentences max per paragraph)
- Include occasional emojis naturally (not excessively)
- Be encouraging without being dismissive of real feelings

TECHNIQUES YOU USE:
- Cognitive Behavioral Therapy (CBT) reframing
- Mindfulness grounding (5-4-3-2-1 technique)
- Breathing exercises (box breathing, 4-7-8)
- Gratitude prompts
- Emotion labeling and validation
- Progressive muscle relaxation cues

BOUNDARIES:
- NEVER diagnose mental health conditions
- NEVER prescribe medication
- For serious distress, gently suggest professional help
- Keep responses concise — under 150 words ideally
- Always validate feelings first before offering techniques

CONTEXT: The user's current mood is: {{MOOD}}. Adapt your tone accordingly.
If they seem distressed, lead with empathy. If they seem good, reinforce positive patterns.`;

export async function streamChat(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): Promise<void> {
  const mood = getLatestMood();
  const systemInstruction = SYSTEM_PROMPT.replace("{{MOOD}}", mood);

  const apiMessages = [
    { role: "system", content: systemInstruction },
    ...messages.map((m) => ({
      role: m.role as string,
      content: m.content,
    })),
  ];

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: apiMessages,
        temperature: 0.8,
        max_tokens: 512,
        stream: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      onError(`API Error: ${res.status} — ${errText.slice(0, 120)}`);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      onError("No response stream");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("data: ")) {
          const jsonStr = trimmed.slice(6);
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (delta) {
              onChunk(delta);
            }
          } catch {
            // skip malformed SSE chunks
          }
        }
      }
    }

    onDone();
  } catch (err: any) {
    onError(err?.message || "Network error. Please check your connection.");
  }
}

// Non-streaming for quick single-shot responses
export async function quickChat(prompt: string): Promise<string> {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: "You are a concise wellness coach. Respond in 2-3 bullet points max." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 256,
      }),
    });

    if (!res.ok) return "";
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "";
  } catch {
    return "";
  }
}
