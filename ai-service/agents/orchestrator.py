import os
import logging
from agents.providers.groq import GroqProvider
from agents.providers.bedrock import BedrockProvider
from agents.providers.mock import MockProvider

from agents.patient_intake_agent import PatientIntakeAgent
from agents.medical_record_agent import MedicalRecordAgent
from agents.ocr_agent import OcrAgent
from agents.medical_summary_agent import MedicalSummaryAgent
from agents.care_coordinator_agent import CareCoordinatorAgent
from agents.medication_safety_agent import MedicationSafetyAgent
from agents.hospital_rec_agent import HospitalRecommendationAgent
from agents.appointment_agent import AppointmentAgent
from agents.doctor_copilot_agent import DoctorCopilotAgent
from agents.emergency_agent import EmergencyAgent
from agents.follow_up_agent import FollowUpAgent

logger = logging.getLogger("mediflow.orchestrator")

class AgentOrchestrator:
    def __init__(self):
        self.provider = self._resolve_provider()
        self.agents = self._init_agents()

    def _resolve_provider(self):
        bedrock = BedrockProvider()
        if bedrock.is_available():
            logger.info("[Orchestrator] Using Amazon Bedrock provider")
            return bedrock
        groq = GroqProvider()
        if groq.is_available():
            logger.info("[Orchestrator] Using Groq provider")
            return groq
        mock = MockProvider()
        logger.info("[Orchestrator] No LLM credentials found. Using Mock provider.")
        return mock

    def _init_agents(self):
        return {
            "patient_intake": PatientIntakeAgent(self.provider),
            "medical_record": MedicalRecordAgent(self.provider),
            "ocr": OcrAgent(self.provider),
            "medical_summary": MedicalSummaryAgent(self.provider),
            "care_coordinator": CareCoordinatorAgent(self.provider),
            "medication_safety": MedicationSafetyAgent(self.provider),
            "hospital_recommendation": HospitalRecommendationAgent(self.provider),
            "appointment": AppointmentAgent(self.provider),
            "doctor_copilot": DoctorCopilotAgent(self.provider),
            "emergency": EmergencyAgent(self.provider),
            "follow_up": FollowUpAgent(self.provider),
        }

    def get_provider_name(self):
        return self.provider.__class__.__name__.replace("Provider", "").lower()

    def route(self, agent_name: str, **kwargs):
        if agent_name not in self.agents:
            return {"success": False, "error": f"Unknown agent: {agent_name}"}
        agent = self.agents[agent_name]
        try:
            result = agent.execute(**kwargs)
            return {
                "success": result.success,
                "agent": agent_name,
                "provider": self.get_provider_name(),
                "data": result.data if result.success else None,
                "error": result.error if not result.success else None,
                "timestamp": result.timestamp,
            }
        except Exception as e:
            logger.error(f"[Orchestrator] Agent {agent_name} execution error: {e}")
            return {
                "success": False,
                "agent": agent_name,
                "error": str(e),
                "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
            }

    def list_agents(self):
        return {
            "agents": list(self.agents.keys()),
            "provider": self.get_provider_name(),
            "count": len(self.agents),
        }


_orchestrator = None

def get_orchestrator():
    global _orchestrator
    if _orchestrator is None:
        _orchestrator = AgentOrchestrator()
    return _orchestrator
