from datetime import datetime, timedelta
from agents.base import BaseAgent, AgentResult

class FollowUpAgent(BaseAgent):
    """Generate follow-up schedules, reminders, and patient instructions."""

    def get_prompt_template(self):
        return (
            "Generate a follow-up plan for this patient.\n\n"
            "Patient: {patient_name}\n"
            "Diagnosis: {diagnosis}\n"
            "Treatment Given: {treatment}\n"
            "Medications Prescribed: {medications}\n"
            "Follow-up Type: {follow_up_type}\n"
            "Provider Notes: {notes}\n\n"
            "Respond in JSON:\n"
            "{{\n"
            '  "follow_up_date": "...",\n'
            '  "follow_up_type": "in_person/telemedicine/home_visit",\n'
            '  "instructions": ["..."],\n'
            '  "medication_reminder": {{"regimen": "...", "duration_days": ..., "special_instructions": "..."}},\n'
            '  "warning_signs_to_watch": ["..."],\n'
            '  "when_to_return_early": ["..."],\n'
            '  "reminder_schedule": [{{"day": 1, "message": "..."}}, {{"day": 3, "message": "..."}}]\n'
            "}}"
        )

    def execute(self, patient_name: str = "Patient", diagnosis: str = "General checkup", treatment: str = "Symptomatic treatment", medications: str = "None", follow_up_type: str = "standard", notes: str = "No special instructions", **kwargs) -> AgentResult:
        try:
            prompt = self.get_prompt_template().format(
                patient_name=patient_name,
                diagnosis=diagnosis[:500],
                treatment=treatment[:500],
                medications=medications[:500],
                follow_up_type=follow_up_type,
                notes=notes[:500],
            )
            system_prompt = "You are a follow-up care coordinator. Generate follow-up plans in JSON."
            result = self._generate(prompt, system_prompt, temperature=0.3)
            if result.get("content"):
                import json as j
                parsed = j.loads(result["content"])
                return self._success({"follow_up_plan": parsed, "model": result.get("model")})
            follow_up_date = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
            return self._success({
                "follow_up_plan": {
                    "follow_up_date": follow_up_date,
                    "follow_up_type": "in_person",
                    "instructions": ["Complete prescribed medications", "Return for follow-up on " + follow_up_date],
                    "medication_reminder": {"regimen": "As prescribed", "duration_days": 7},
                    "warning_signs_to_watch": ["Worsening symptoms", "High fever", "Difficulty breathing"],
                    "when_to_return_early": ["If symptoms worsen", "If new symptoms develop"],
                    "reminder_schedule": [
                        {"day": 1, "message": "Start your medications today"},
                        {"day": 3, "message": "How are you feeling? Report any side effects"},
                        {"day": 7, "message": "Follow-up appointment tomorrow"},
                    ],
                },
                "note": "AI follow-up unavailable; generated standard follow-up plan",
            })
        except Exception as e:
            return self._error(f"Follow-up plan generation failed: {str(e)}")
