from agents.base import BaseAgent, AgentResult

class DoctorCopilotAgent(BaseAgent):
    """Clinical decision support for healthcare providers."""

    def get_prompt_template(self):
        return (
            "You are a clinical decision support assistant. Given the following patient case, "
            "provide evidence-based recommendations.\n\n"
            "Patient Case:\n{case}\n\n"
            "Vitals:\n{vitals}\n\n"
            "Lab Results:\n{labs}\n\n"
            "Current Medications:\n{medications}\n\n"
            "Respond in JSON:\n"
            "{{\n"
            '  "differential_diagnosis": [{{"condition": "...", "likelihood": "high/medium/low", "supporting_evidence": "..."}}],\n'
            '  "recommended_tests": ["..."],\n'
            '  "treatment_options": [{{"option": "...", "evidence_level": "A/B/C/D", "description": "..."}}],\n'
            '  "red_flags": ["..."],\n'
            '  "referral_needed": true/false,\n'
            '  "referral_specialty": "..."\n'
            "}}"
        )

    def execute(self, case: str, vitals: str = "Not available", labs: str = "Not available", medications: str = "Not available", **kwargs) -> AgentResult:
        try:
            prompt = self.get_prompt_template().format(
                case=case[:2000], vitals=vitals[:500], labs=labs[:1000], medications=medications[:500]
            )
            system_prompt = "You are a clinical decision support system. Provide evidence-based recommendations in JSON."
            result = self._generate(prompt, system_prompt, temperature=0.2)
            if result.get("content"):
                import json as j
                parsed = j.loads(result["content"])
                return self._success({"copilot_analysis": parsed, "model": result.get("model")})
            return self._success({
                "copilot_analysis": {
                    "differential_diagnosis": [{"condition": "Unable to analyze", "likelihood": "low"}],
                    "recommended_tests": ["Complete blood count", "Basic metabolic panel"],
                    "treatment_options": [{"option": "Supportive care", "evidence_level": "C"}],
                    "red_flags": [],
                    "referral_needed": True,
                    "referral_specialty": "Internal Medicine",
                },
                "note": "AI copilot unavailable; generated conservative recommendations",
            })
        except Exception as e:
            return self._error(f"Doctor copilot analysis failed: {str(e)}")
