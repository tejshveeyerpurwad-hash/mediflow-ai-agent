from agents.base import BaseAgent, AgentResult

MEDICATION_KNOWLEDGE_BASE = {
    "amoxicillin": {"class": "antibiotic", "interactions": ["methotrexate", "warfarin"], "contraindications": ["penicillin_allergy"], "max_daily_mg": 3000},
    "paracetamol": {"class": "analgesic", "interactions": ["warfarin", "alcohol"], "contraindications": ["liver_disease"], "max_daily_mg": 4000},
    "ibuprofen": {"class": "nsaid", "interactions": ["aspirin", "warfarin", "lisinopril"], "contraindications": ["kidney_disease", "peptic_ulcer", "pregnancy_3rd_trimester"], "max_daily_mg": 2400},
    "metformin": {"class": "antidiabetic", "interactions": ["contrast_dye", "alcohol"], "contraindications": ["kidney_disease", "liver_disease"], "max_daily_mg": 2550},
    "amlodipine": {"class": "calcium_channel_blocker", "interactions": ["simvastatin", "grapefruit"], "contraindications": ["hypotension"], "max_daily_mg": 10},
}

class MedicationSafetyAgent(BaseAgent):
    """Check for drug interactions, contraindications, and dosage safety."""

    def get_prompt_template(self):
        return (
            "Perform a medication safety check for the following prescription.\n\n"
            "Current Medications: {current_meds}\n"
            "New Prescription: {new_meds}\n"
            "Patient Conditions: {conditions}\n"
            "Allergies: {allergies}\n"
            "Age: {age}\n"
            "Weight: {weight}\n\n"
            "Check for:\n"
            "1. Drug-drug interactions\n"
            "2. Contraindications with patient conditions\n"
            "3. Dosage safety (max daily limits)\n"
            "4. Allergy conflicts\n"
            "5. Age-appropriate dosing\n\n"
            "Respond in JSON:\n"
            "{{\n"
            '  "safety_score": "safe/caution/unsafe",\n'
            '  "interactions": [{{"medications": ["A", "B"], "severity": "high/medium/low", "description": "..."}}],\n'
            '  "contraindications": [...],\n'
            '  "dosage_warnings": [...],\n'
            '  "allergy_alerts": [...],\n'
            '  "recommendations": ["..."],\n'
            '  "requires_physician_review": true/false\n'
            "}}"
        )

    def _check_rule_based(self, new_meds: str, conditions: str, allergies: str) -> dict:
        warnings = []
        new_meds_lower = new_meds.lower()
        for med_name, med_info in MEDICATION_KNOWLEDGE_BASE.items():
            if med_name in new_meds_lower:
                for ci in med_info["contraindications"]:
                    if ci.replace("_", " ") in conditions.lower():
                        warnings.append(f"{med_name.title()} contraindicated for {ci.replace('_', ' ')}")
                for allergy in med_info.get("contraindications", []):
                    if allergy.replace("_", " ") in allergies.lower():
                        warnings.append(f"{med_name.title()} may cause reaction in patients with {allergy.replace('_', ' ')}")
        return {"rule_based_warnings": warnings}

    def execute(self, current_meds: str = "", new_meds: str = "", conditions: str = "", allergies: str = "", age: int = 30, weight: int = 60, **kwargs) -> AgentResult:
        try:
            rule_warnings = self._check_rule_based(new_meds, conditions, allergies)
            prompt = self.get_prompt_template().format(
                current_meds=current_meds or "None",
                new_meds=new_meds,
                conditions=conditions or "None",
                allergies=allergies or "None",
                age=age,
                weight=weight,
            )
            system_prompt = "You are a clinical pharmacist. Perform medication safety checks in JSON."
            result = self._generate(prompt, system_prompt, temperature=0.1)
            if result.get("content"):
                import json as j
                parsed = j.loads(result["content"])
                parsed["rule_based_checks"] = rule_warnings
                return self._success({"safety_check": parsed, "model": result.get("model")})
            return self._success({
                "safety_check": {
                    "safety_score": "caution",
                    "interactions": [],
                    "contraindications": rule_warnings.get("rule_based_warnings", []),
                    "recommendations": ["Consult pharmacist before administering"],
                    "requires_physician_review": bool(rule_warnings.get("rule_based_warnings")),
                },
                "note": "AI safety check unavailable; performed rule-based check only",
            })
        except Exception as e:
            return self._error(f"Medication safety check failed: {str(e)}")
