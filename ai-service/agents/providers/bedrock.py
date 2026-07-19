import os
import json
from agents.providers.base import BaseLLMProvider

class BedrockProvider(BaseLLMProvider):
    def __init__(self):
        self.client = None
        self._init_client()

    def _init_client(self):
        try:
            import boto3
            self.client = boto3.client(
                service_name="bedrock-runtime",
                region_name=os.getenv("AWS_REGION", "us-east-1"),
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            )
        except Exception as e:
            print(f"[Bedrock] Initialization failed: {e}")

    def is_available(self) -> bool:
        return self.client is not None and bool(os.getenv("AWS_ACCESS_KEY_ID"))

    def _call_model(self, model_id: str, prompt: str, system_prompt: str = None, max_tokens: int = 1024, temperature: float = 0.3) -> dict:
        if not self.is_available():
            return {"error": "AWS credentials not configured", "content": None}
        try:
            body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": [{"role": "user", "content": prompt}],
            }
            if system_prompt:
                body["system"] = system_prompt
            response = self.client.invoke_model(
                modelId=model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(body),
            )
            result = json.loads(response["body"].read())
            return {"content": result.get("content", [{}])[0].get("text", ""), "model": model_id, "provider": "bedrock"}
        except Exception as e:
            return {"error": str(e), "content": None}

    def generate(self, prompt: str, system_prompt: str = None, max_tokens: int = 1024, temperature: float = 0.3) -> dict:
        return self._call_model("anthropic.claude-3-sonnet-20240229-v1:0", prompt, system_prompt, max_tokens, temperature)

    def generate_haiku(self, prompt: str, system_prompt: str = None, max_tokens: int = 1024) -> dict:
        return self._call_model("anthropic.claude-3-haiku-20240307-v1:0", prompt, system_prompt, max_tokens, 0.3)
