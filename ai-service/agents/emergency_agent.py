from agents.base import BaseAgent, AgentResult

class EmergencyAgent(BaseAgent):
    """Triage emergencies, coordinate dispatch, and provide first-aid guidance."""

    def get_prompt_template(self):
        return (
            "EMERGENCY RESPONSE PROTOCOL\n\n"
            "Emergency Type: {emergency_type}\n"
            "Patient Status: {patient_status}\n"
            "Location: {location}\n"
            "Patient Age: {age}\n"
            "Conscious: {conscious}\n"
            "Breathing: {breathing}\n"
            "Bleeding: {bleeding}\n\n"
            "Respond in JSON:\n"
            "{{\n"
            '  "triage_category": "RED/YELLOW/GREEN/BLACK",\n'
            '  "immediate_actions": ["..."],\n'
            '  "first_aid_instructions": ["..."],\n'
            '  "positioning": "...",\n'
            '  "ambulance_required": true/false,\n'
            '  "ambulance_priority": "P1/P2/P3",\n'
            '  "nearest_hospital": {{"name": "...", "distance": "...", "eta": "..."}},\n'
            '  "pre_arrival_preparation": ["..."],\n'
            '  "things_to_avoid": ["..."]\n'
            "}}"
        )

    def execute(self, emergency_type: str, patient_status: str, location: str, age: str = "unknown", conscious: str = "yes", breathing: str = "yes", bleeding: str = "no", **kwargs) -> AgentResult:
        try:
            prompt = self.get_prompt_template().format(
                emergency_type=emergency_type,
                patient_status=patient_status[:500],
                location=location,
                age=age,
                conscious=conscious,
                breathing=breathing,
                bleeding=bleeding,
            )
            system_prompt = "You are an emergency medical dispatcher. Respond in JSON with triage and dispatch instructions."
            result = self._generate(prompt, system_prompt, temperature=0.1)
            if result.get("content"):
                import json as j
                parsed = j.loads(result["content"])
                return self._success({"emergency_response": parsed, "model": result.get("model")})
            triage = "RED" if "unconscious" in patient_status.lower() or breathing == "no" else "YELLOW"
            return self._success({
                "emergency_response": {
                    "triage_category": triage,
                    "immediate_actions": ["Call 108 ambulance immediately", "Keep airway clear", "Monitor vitals"],
                    "first_aid_instructions": [],
                    "ambulance_required": True,
                    "ambulance_priority": "P1",
                    "nearest_hospital": {"name": "Nearest ER", "distance": "Contact 108"},
                },
                "note": "AI emergency response unavailable; used protocol-based triage",
            })
        except Exception as e:
            return self._error(f"Emergency response failed: {str(e)}")
