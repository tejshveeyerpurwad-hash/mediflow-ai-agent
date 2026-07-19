from agents.providers.base import BaseLLMProvider

class MockProvider(BaseLLMProvider):
    def __init__(self):
        self.fallback_responses = {
            "ocr": "Extracted: Patient Name: Ramesh Kumar, Date: 2026-07-15, Diagnosis: Upper Respiratory Tract Infection, Medications: Amoxicillin 500mg, Paracetamol 650mg.",
            "summary": "Patient Ramesh Kumar, 32-year-old male from V-101, presented with fever and cough. Diagnosed with URTI. Prescribed amoxicillin and paracetamol. Follow-up recommended in 7 days if symptoms persist.",
            "medication_safety": "Amoxicillin 500mg and Paracetamol 650mg: No known interaction. Standard dosage within safe limits. Contraindications: None identified. Caution: Avoid alcohol while on amoxicillin.",
            "hospital_rec": "Recommended: Sundarnagar PHC (2.3km) for general care. For specialist: District Hospital Pune (28km). Nearest ER: Civil Hospital Varanasi (15km).",
            "appointment": "Appointment scheduled: Dr. Sharma (General Physician) at Sundarnagar PHC on 2026-07-20 at 10:30 AM. Confirmation ID: APPT-2026-07-19-001.",
            "care_coordinator": "Care Plan: 1. Complete 7-day antibiotic course. 2. Follow-up Hb test at PHC. 3. Nutrition counseling referral. 4. ANC visit scheduled for week 24. Assigned ASHA: Priya Sharma.",
            "follow_up": "Follow-up reminder: Patient Ramesh Kumar due for check-up on 2026-07-26. Pre-visit instructions: Bring medication list, fasting blood sugar report.",
            "emergency": "EMERGENCY PROTOCOL: 1. Check ABC (Airway, Breathing, Circulation). 2. Call 108 ambulance. 3. Notify nearest PHC. 4. Start first aid: Control bleeding, immobilize fracture. 5. Monitor vitals every 5 min.",
        }
        self._available = True

    def is_available(self) -> bool:
        return self._available

    def generate(self, prompt: str, system_prompt: str = None, max_tokens: int = 1024, temperature: float = 0.3) -> dict:
        for key, response in self.fallback_responses.items():
            if key in prompt.lower() or (system_prompt and key in system_prompt.lower()):
                return {"content": response, "model": "mock", "provider": "mock"}
        return {
            "content": "AI processing complete. Analysis generated.",
            "model": "mock",
            "provider": "mock",
        }
