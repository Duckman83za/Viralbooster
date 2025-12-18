import { GoogleGenerativeAI } from "@google/generative-ai";
export async function generateViralText(prompt, apiKey) {
    if (!apiKey || apiKey === "mock-key") {
        console.log("[AI] Mock generating text for:", prompt);
        return [
            "🚀 Just launched ContentOS! The modular way to go viral. #SaaS #Growth",
            "🔥 Stop manually scheduling posts. ContentOS does it for you. #Productivity",
            "💡 Did you know? Consistency is key to viral growth. Let AI handle it. #Tips"
        ];
    }
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // Enforce structured output via prompt engineering
        const fullPrompt = `${prompt}\n\nGenerate 3 distinct viral LinkedIn/Twitter posts based on this concept. Separate them with "---".`;
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        return text.split("---").map(s => s.trim()).filter(Boolean);
    }
    catch (e) {
        console.error("Gemini Text Gen Error:", e);
        return ["Error generating content. Please check API key."];
    }
}
