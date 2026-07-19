from agents.base import BaseAgent, AgentResult

class CareCoordinatorAgent(BaseAgent):
    """Orchestrate multi-provider care plans and track patient handoffs."""

    def get_prompt_template(self):
        return (
            "Create a coordinated care plan for this patient based on their medical needs.\n\n"
            "Patient Info:\n{patient_info}\n\n"
            "Current Diagnosis:\n{diagnosis}\n\n"
            "Available Providers:\n{providers}\n\n"
            "Generate JSON:\n"
            "{{\n"
            '  "care_plan": [{{"step": 1, "action": "...", "assigned_to": "...", "timeline": "...", "status": "pending"}}],\n'
            '  "primary_provider": "...",\n'
            '  "specialist_referrals": ["..."],\n'
            '  "coordinator_notes": "...",\n'
            '  "estimated_recovery_timeline": "..."\n'
            "}}"
        )

    def execute(self, patient_info: str, diagnosis: str, providers: str = "Primary PHC, District Hospital", **kwargs) -> AgentResult:
        try:
            prompt = self.get_prompt_template().format(
                patient_info=patient_info[:2000],
                diagnosis=diagnosis[:1000],
                providers=providers[:1000],
            )
            system_prompt = "You are a care coordination specialist. Generate care plans in JSON."
            result = self._generate(prompt, system_prompt, temperature=0.3)
            if result.get("content"):
                import json as j
                parsed = j.loads(result["content"])
                return self._success({"care_plan": parsed, "model": result.get("model")})
            return self._success({
                "care_plan": {
                    "care_plan": [{"step": 1, "action": "Schedule follow-up visit", "assigned_to": "ASHA Worker", "status": "pending"}],
                    "primary_provider": "Primary Health Center",
                },
                "note": "AI care coordination unavailable; created basic care plan",
            })
        except Exception as e:
            return self._error(f"Care coordination failed: {str(e)}")
