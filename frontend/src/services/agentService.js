import api from './api';

const agentService = {
  patientIntake: async (data) => {
    const res = await api.post('/agents/patient-intake', data);
    return res.data;
  },

  ocr: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/agents/ocr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });
    return res.data;
  },

  medicalSummary: async (data) => {
    const res = await api.post('/agents/medical-summary', data);
    return res.data;
  },

  medicationCheck: async (data) => {
    const res = await api.post('/agents/medication-check', data);
    return res.data;
  },

  hospitalRecommendation: async (data) => {
    const res = await api.post('/agents/hospital-recommendation', data);
    return res.data;
  },

  appointment: async (data) => {
    const res = await api.post('/agents/appointment', data);
    return res.data;
  },

  doctorCopilot: async (data) => {
    const res = await api.post('/agents/doctor-copilot', data);
    return res.data;
  },

  emergency: async (data) => {
    const res = await api.post('/agents/emergency', data);
    return res.data;
  },

  followUp: async (data) => {
    const res = await api.post('/agents/follow-up', data);
    return res.data;
  },

  careCoordinator: async (data) => {
    const res = await api.post('/agents/care-coordinator', data);
    return res.data;
  },

  listAgents: async () => {
    const res = await api.get('/agents/list');
    return res.data;
  },
};

export default agentService;
