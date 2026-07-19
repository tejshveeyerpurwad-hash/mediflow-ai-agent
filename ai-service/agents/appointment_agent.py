from datetime import datetime, timedelta
from agents.base import BaseAgent, AgentResult

class AppointmentAgent(BaseAgent):
    """Schedule, reschedule, and manage healthcare appointments."""

    def get_prompt_template(self):
        return (
            "Schedule a healthcare appointment based on the following requirements.\n\n"
            "Patient Name: {patient_name}\n"
            "Required Specialty: {specialty}\n"
            "Preferred Facility: {facility}\n"
            "Urgency: {urgency}\n"
            "Preferred Days: {preferred_days}\n"
            "Preferred Time: {preferred_time}\n\n"
            "Available Slots:\n{available_slots}\n\n"
            "Respond in JSON:\n"
            "{{\n"
            '  "scheduled": true/false,\n'
            '  "appointment": {{"date": "...", "time": "...", "doctor": "...", "facility": "...", "confirmation_id": "..."}},\n'
            '  "preparation_instructions": ["..."],\n'
            '  "reminder_settings": {{"sms": true, "whatsapp": true, "hours_before": 24}}\n'
            "}}"
        )

    def execute(self, patient_name: str, specialty: str = "General Physician", facility: str = "Primary Health Center", urgency: str = "routine", preferred_days: str = "weekdays", preferred_time: str = "morning", available_slots: str = None, **kwargs) -> AgentResult:
        try:
            default_slots = available_slots or (
                "Mon-Fri: 9:00 AM, 10:00 AM, 11:00 AM, 2:00 PM, 3:00 PM\n"
                "Sat: 9:00 AM, 10:00 AM, 11:00 AM\n"
                "Next available: Tomorrow"
            )
            prompt = self.get_prompt_template().format(
                patient_name=patient_name,
                specialty=specialty,
                facility=facility,
                urgency=urgency,
                preferred_days=preferred_days,
                preferred_time=preferred_time,
                available_slots=default_slots,
            )
            system_prompt = "You are a medical appointment scheduler. Generate appointment details in JSON."
            result = self._generate(prompt, system_prompt, temperature=0.2)
            if result.get("content"):
                import json as j
                parsed = j.loads(result["content"])
                return self._success({"appointment": parsed, "model": result.get("model")})
            tomorrow = datetime.now() + timedelta(days=1)
            return self._success({
                "appointment": {
                    "scheduled": True,
                    "appointment": {
                        "date": tomorrow.strftime("%Y-%m-%d"),
                        "time": "10:00 AM",
                        "doctor": "Duty Doctor",
                        "facility": facility,
                        "confirmation_id": f"APPT-{tomorrow.strftime('%Y%m%d')}-{hash(patient_name) % 1000:03d}",
                    },
                    "preparation_instructions": ["Bring previous medical records", "Report 15 minutes early"],
                    "reminder_settings": {"sms": True, "hours_before": 24},
                },
                "note": "AI scheduling unavailable; created default appointment",
            })
        except Exception as e:
            return self._error(f"Appointment scheduling failed: {str(e)}")
