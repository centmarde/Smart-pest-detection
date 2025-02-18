import { ref } from "vue";
import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_DEEPSEEK_AI;

if (!apiKey) {
  throw new Error(
    "API key is missing or empty. Please provide a valid API key."
  );
}

const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

function formatResponse(content: string): string {
  return content.replace(/\n/g, "<br>");
}

export function useGroqChat() {
  const chatContent = ref("");

  async function getPestAdvice(pestName: string): Promise<string> {
    chatContent.value = "";
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an agricultural expert. Provide detailed advice about pest control and management."
        },
        {
          role: "user",
          content: `Provide detailed advice about how to handle and treat ${pestName} in crops. Include identification, damage patterns, and treatment methods.`
        }
      ],
      model: "llama-3.2-1b-preview",
      temperature: 0.6,
      max_completion_tokens: 600,
      top_p: 0.95,
      stream: true,
      stop: null,
    });

    let fullResponse = "";
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
      chatContent.value += formatResponse(content);
    }
    
    return fullResponse;
  }

  return {
    chatContent,
    getPestAdvice,
  };
}