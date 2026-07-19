import express from 'express';
import axios from 'axios';
import { auth } from '../middleware/auth.js';
import { checkRole } from '../middleware/policy.js';
import { logAudit } from '../middleware/audit.js';

const router = express.Router();
const AGENT_TIMEOUT = 15000;

async function proxyToAI(req, res, agentEndpoint, payload = null) {
  const AI_SERVICE_URL = req.app.locals.AI_SERVICE_URL;
  if (!AI_SERVICE_URL) {
    return res.status(503).json({ success: false, error: 'AI service URL not configured' });
  }
  try {
    const { default: axiosLib } = await import('axios');
    const response = await axiosLib.post(
      `${AI_SERVICE_URL}${agentEndpoint}`,
      payload || req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-trace-id': req.traceId,
        },
        timeout: AGENT_TIMEOUT,
      }
    );
    res.json(response.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    res.status(503).json({
      success: false,
      agent: agentEndpoint,
      error: `AI service unavailable: ${err.message}`,
      fallback: true,
      data: generateFallback(agentEndpoint, req.body),
    });
  }
}

function generateFallback(endpoint, body) {
  const fallbacks = {
    '/api/agents/patient-intake': {
      intake: { triage_level: 'P3', recommended_specialty: 'General Physician', care_pathway: 'primary_care' },
    },
    '/api/agents/ocr': { extracted: { patient_name: 'Via OCR', medications_prescribed: [] } },
    '/api/agents/medical-summary': {
      summary: { summary: 'AI summary temporarily unavailable.', key_findings: ['Visit documented'], recommendations: ['Consult healthcare provider'] },
    },
    '/api/agents/medication-check': {
      safety_check: { safety_score: 'caution', interactions: [], requires_physician_review: true },
    },
    '/api/agents/hospital-recommendation': {
      recommendation: { primary_recommendation: { name: 'Nearest PHC', distance_km: 5 } },
    },
    '/api/agents/appointment': {
      appointment: { scheduled: true, appointment: { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '10:00 AM' } },
    },
    '/api/agents/doctor-copilot': {
      copilot_analysis: { differential_diagnosis: [], recommended_tests: ['Basic blood work'], referral_needed: true },
    },
    '/api/agents/emergency': {
      emergency_response: { triage_category: 'YELLOW', ambulance_required: true, ambulance_priority: 'P1' },
    },
    '/api/agents/follow-up': {
      follow_up_plan: { follow_up_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], instructions: ['Complete prescribed medications'] },
    },
  };
  return { agent: endpoint, source: 'backend-fallback', ...(fallbacks[endpoint] || {}) };
}

router.post('/patient-intake', auth, checkRole(['villager', 'ngo', 'admin']), logAudit('agent_call', 'agents'), async (req, res) => {
  await proxyToAI(req, res, '/api/agents/patient-intake');
});

router.post('/ocr', auth, checkRole(['villager', 'ngo', 'admin']), logAudit('agent_call', 'agents'), async (req, res) => {
  await proxyToAI(req, res, '/api/agents/ocr');
});

router.post('/medical-summary', auth, checkRole(['villager', 'ngo', 'admin']), logAudit('agent_call', 'agents'), async (req, res) => {
  await proxyToAI(req, res, '/api/agents/medical-summary');
});

router.post('/medication-check', auth, checkRole(['villager', 'ngo', 'admin']), logAudit('agent_call', 'agents'), async (req, res) => {
  await proxyToAI(req, res, '/api/agents/medication-check');
});

router.post('/hospital-recommendation', auth, checkRole(['villager', 'ngo', 'admin']), logAudit('agent_call', 'agents'), async (req, res) => {
  await proxyToAI(req, res, '/api/agents/hospital-recommendation');
});

router.post('/appointment', auth, checkRole(['villager', 'ngo', 'admin']), logAudit('agent_call', 'agents'), async (req, res) => {
  await proxyToAI(req, res, '/api/agents/appointment');
});

router.post('/doctor-copilot', auth, checkRole(['ngo', 'admin']), logAudit('agent_call', 'agents'), async (req, res) => {
  await proxyToAI(req, res, '/api/agents/doctor-copilot');
});

router.post('/emergency', auth, checkRole(['villager', 'ngo', 'admin']), logAudit('agent_call', 'agents'), async (req, res) => {
  await proxyToAI(req, res, '/api/agents/emergency');
});

router.post('/follow-up', auth, checkRole(['villager', 'ngo', 'admin']), logAudit('agent_call', 'agents'), async (req, res) => {
  await proxyToAI(req, res, '/api/agents/follow-up');
});

router.post('/care-coordinator', auth, checkRole(['ngo', 'admin']), logAudit('agent_call', 'agents'), async (req, res) => {
  await proxyToAI(req, res, '/api/agents/execute', { agent: 'care_coordinator', params: req.body });
});

router.get('/list', auth, async (req, res) => {
  try {
    const AI_SERVICE_URL = req.app.locals.AI_SERVICE_URL;
    const response = await axios.get(`${AI_SERVICE_URL}/api/agents/list`, { timeout: 5000 });
    res.json(response.data);
  } catch (err) {
    res.json({
      agents: ['patient_intake', 'ocr', 'medical_summary', 'medication_safety', 'hospital_recommendation', 'appointment', 'doctor_copilot', 'emergency', 'follow_up', 'care_coordinator'],
      provider: 'fallback',
      count: 10,
    });
  }
});

export default router;
