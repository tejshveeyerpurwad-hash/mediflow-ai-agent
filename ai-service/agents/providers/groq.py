import os
from groq import Groq
from agents.providers.base import BaseLLMProvider

class GroqProvider(BaseLLMProvider):
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = Groq(api_key=self.api_key) if self.api_key else None

    def is_available(self) -> bool:
        return self.client is not None and bool(self.api_key)

    def generate(self, prompt: str, system_prompt: str = None, max_tokens: int = 1024, temperature: float = 0.3) -> dict:
        if not self.is_available():
            return {"error": "Groq API key not configured", "content": None}
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        try:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
            )
            return {"content": response.choices[0].message.content, "model": "llama-3.3-70b-versatile", "provider": "groq"}
        except Exception as e:
            return {"error": str(e), "content": None}
