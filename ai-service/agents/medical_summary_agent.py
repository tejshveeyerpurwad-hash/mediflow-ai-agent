from agents.base import BaseAgent, AgentResult

class MedicalSummaryAgent(BaseAgent):
    """Generate concise AI medical summary from patient records."""

    def get_prompt_template(self):
        return (
            "Generate a concise medical summary for the following patient record. "
            "Use clinical language appropriate for handover to another healthcare provider.\n\n"
            "Patient Record:\n{record}\n\n"
            "Previous Summaries:\n{history}\n\n"
            "Format as JSON:\n"
            "{{\n"
            '  "summary": "2-3 sentence clinical summary",\n'
            '  "key_findings": ["..."],\n'
            '  "active_issues": ["..."],\n'
            '  "medication_changes": ["..."],\n'
            '  "recommendations": ["..."],\n'
            '  "follow_up_required": true/false,\n'
            '  "follow_up_timeline": "..."\n'
            "}}"
        )

    def execute(self, record: str, history: str = "No previous summaries available.", **kwargs) -> AgentResult:
        try:
            prompt = self.get_prompt_template().format(record=record[:3000], history=history[:2000])
            system_prompt = "You are a clinical summarizer. Generate structured medical summaries in JSON."
            result = self._generate(prompt, system_prompt, temperature=0.2)
            if result.get("content"):
                import json as j
                parsed = j.loads(result["content"])
                return self._success({"summary": parsed, "model": result.get("model")})
            return self._success({
                "summary": {
                    "summary": "Patient visit recorded. No AI summary available.",
                    "key_findings": ["Visit documented"],
                    "active_issues": [],
                    "recommendations": ["Consult healthcare provider"],
                    "follow_up_required": False,
                },
                "note": "AI summary unavailable; generated basic summary",
            })
        except Exception as e:
            return self._error(f"Medical summary generation failed: {str(e)}")
