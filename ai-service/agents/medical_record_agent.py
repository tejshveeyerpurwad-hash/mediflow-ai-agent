from agents.base import BaseAgent, AgentResult

class MedicalRecordAgent(BaseAgent):
    """Parse and structure medical records into standardized format."""

    def get_prompt_template(self):
        return (
            "Extract structured medical information from the following record.\n\n"
            "Record: {record_text}\n\n"
            "Respond in JSON format:\n"
            "{{\n"
            '  "patient_name": "...",\n'
            '  "date_of_visit": "...",\n'
            '  "diagnosis": "...",\n'
            '  "symptoms": [...],\n'
            '  "medications_prescribed": [{{"name": "...", "dosage": "...", "frequency": "..."}}],\n'
            '  "vitals": {{"bp": "...", "hr": "...", "temp": "...", "spo2": "..."}},\n'
            '  "lab_results": [{{"test": "...", "value": "...", "range": "..."}}],\n'
            '  "doctor_notes": "..."\n'
            "}}"
        )

    def execute(self, record_text: str, **kwargs) -> AgentResult:
        try:
            prompt = self.get_prompt_template().format(record_text=record_text[:3000])
            system_prompt = "You are a medical records specialist. Extract structured data."
            result = self._generate(prompt, system_prompt, temperature=0.1)
            if result.get("content"):
                import json as j
                parsed = j.loads(result["content"])
                return self._success({"structured_record": parsed, "model": result.get("model")})
            return self._success({
                "structured_record": {
                    "diagnosis": "Unable to parse record",
                    "medications_prescribed": [],
                    "lab_results": [],
                },
                "note": "AI parsing unavailable; returned empty structured record",
            })
        except Exception as e:
            return self._error(f"Medical record parsing failed: {str(e)}")
