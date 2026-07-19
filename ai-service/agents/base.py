import json
import logging
from datetime import datetime

logger = logging.getLogger("mediflow.agents")

class AgentResult:
    def __init__(self, success: bool, data: dict = None, error: str = None):
        self.success = success
        self.data = data or {}
        self.error = error
        self.timestamp = datetime.utcnow().isoformat()

    def to_dict(self):
        return {
            "success": self.success,
            "data": self.data,
            "error": self.error,
            "timestamp": self.timestamp,
        }

class BaseAgent:
    def __init__(self, llm_provider):
        self.llm = llm_provider
        self.name = self.__class__.__name__

    def execute(self, **kwargs) -> AgentResult:
        raise NotImplementedError

    def _generate(self, prompt: str, system_prompt: str = None, max_tokens: int = 1024, temperature: float = 0.3) -> dict:
        return self.llm.generate(prompt, system_prompt, max_tokens, temperature)

    def _success(self, data: dict) -> AgentResult:
        return AgentResult(success=True, data=data)

    def _error(self, message: str) -> AgentResult:
        logger.error(f"[{self.name}] {message}")
        return AgentResult(success=False, error=message)

    def get_prompt_template(self) -> str:
        raise NotImplementedError
