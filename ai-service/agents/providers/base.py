class BaseLLMProvider:
    def generate(self, prompt: str, system_prompt: str = None, max_tokens: int = 1024, temperature: float = 0.3) -> dict:
        raise NotImplementedError

    def generate_structured(self, prompt: str, output_schema: dict, system_prompt: str = None) -> dict:
        raise NotImplementedError

    def is_available(self) -> bool:
        return False
