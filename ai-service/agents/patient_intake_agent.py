from agents.base import BaseAgent, AgentResult

class PatientIntakeAgent(BaseAgent):
    """Triage patient symptoms and route to appropriate care pathway."""

    def get_prompt_template(self):
        return (
            "You are a medical triage assistant. Given the following patient information, "
            "determine the appropriate care pathway, urgency level (P1-P4), and recommended specialty.\n\n"
            "Patient Info:\n"
            "- Chief Complaint: {symptoms}\n"
            "- Age: {age}\n"
            "- Gender: {gender}\n"
            "- Duration: {duration}\n"
            "- Existing Conditions: {conditions}\n\n"
            "Respond in JSON format:\n"
            "{{\n"
            '  "triage_level": "P1/P2/P3/P4",\n'
            '  "recommended_specialty": "...",\n'
            '  "care_pathway": "emergency/outpatient/primary_care/self_care",\n'
            '  "suggested_tests": [...],\n'
            '  "warning_signs": [...],\n'
            '  "reasoning": "..."\n'
            "}}"
        )

    def execute(self, symptoms: str, age: int = 30, gender: str = "unknown", duration: str = "unknown", conditions: str = "none", **kwargs) -> AgentResult:
        try:
            prompt = self.get_prompt_template().format(
                symptoms=symptoms, age=age, gender=gender, duration=duration, conditions=conditions
            )
            system_prompt = "You are a clinical triage assistant. Respond only with valid JSON."
            result = self._generate(prompt, system_prompt, temperature=0.2)
            if result.get("content"):
                import json as j
                parsed = j.loads(result["content"])
                return self._success({"intake": parsed, "raw_symptoms": symptoms, "model": result.get("model")})
            return self._success({
                "intake": {"triage_level": "P3", "recommended_specialty": "General Physician", "care_pathway": "primary_care"},
                "raw_symptoms": symptoms,
                "note": "AI triage unavailable; defaulted to safe pathway",
            })
        except Exception as e:
            return self._error(f"Patient intake failed: {str(e)}")
