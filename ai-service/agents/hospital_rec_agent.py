from agents.base import BaseAgent, AgentResult

class HospitalRecommendationAgent(BaseAgent):
    """Match patients to appropriate hospitals based on condition, location, and specialty."""

    def get_prompt_template(self):
        return (
            "Recommend the best hospital/facility for this patient based on their needs.\n\n"
            "Patient Condition: {condition}\n"
            "Required Specialty: {specialty}\n"
            "Location (District/Village): {location}\n"
            "Urgency Level: {urgency}\n"
            "Insurance/Scheme: {insurance}\n\n"
            "Available Facilities:\n{facilities}\n\n"
            "Respond in JSON:\n"
            "{{\n"
            '  "primary_recommendation": {{"name": "...", "distance_km": ..., "specialty_match": "high/medium/low", "reason": "..."}},\n'
            '  "alternatives": [{{"name": "...", "distance_km": ..., "specialty_match": "..."}}],\n'
            '  "estimated_wait_time": "...",\n'
            '  "emergency_route": {{"nearest_er": "...", "ambulance_contact": "..."}},\n'
            '  "transport_options": ["..."]\n'
            "}}"
        )

    def execute(self, condition: str, specialty: str = "General Physician", location: str = "unknown", urgency: str = "P3", insurance: str = "None", facilities: str = None, **kwargs) -> AgentResult:
        try:
            default_facilities = facilities or (
                "1. Sundarnagar PHC - 2.3km - General Medicine, Maternal Health\n"
                "2. District Hospital Pune - 28km - Multi-specialty, Emergency\n"
                "3. Civil Hospital Varanasi - 15km - Emergency, Surgery\n"
                "4. AIIMS Nagpur - 120km - Super-specialty"
            )
            prompt = self.get_prompt_template().format(
                condition=condition[:500],
                specialty=specialty,
                location=location,
                urgency=urgency,
                insurance=insurance,
                facilities=default_facilities,
            )
            system_prompt = "You are a hospital referral specialist. Recommend facilities in JSON."
            result = self._generate(prompt, system_prompt, temperature=0.2)
            if result.get("content"):
                import json as j
                parsed = j.loads(result["content"])
                return self._success({"recommendation": parsed, "model": result.get("model")})
            return self._success({
                "recommendation": {
                    "primary_recommendation": {"name": "Nearest PHC", "distance_km": 5, "specialty_match": "medium"},
                    "alternatives": [],
                    "emergency_route": {"nearest_er": "District Hospital", "ambulance_contact": "108"},
                },
                "note": "AI recommendation unavailable; defaulted to nearest facility",
            })
        except Exception as e:
            return self._error(f"Hospital recommendation failed: {str(e)}")
