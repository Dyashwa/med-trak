import axios from 'axios';
import { supabase } from '../lib/supabase';

// 🔥 IMPORTANT: use full backend URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // ✅ FIXED
    headers: { 'Content-Type': 'application/json' },
});

// 🔥 Attach Supabase JWT properly
api.interceptors.request.use(
    async (config) => {
        try {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Session error:', error.message);
                return config;
            }

            const token = data?.session?.access_token;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                console.warn('No access token found');
            }

            return config;
        } catch (err) {
            console.error('Interceptor error:', err.message);
            return config;
        }
    },
    (error) => Promise.reject(error)
);

// ── Medications ──────────────────────────────────────────────────────────────
export const getMedications = () => api.get('/medications');
export const getMedicationById = (id) => api.get(`/medications/${id}`);
export const createMedication = (data) => api.post('/medications', data);
export const updateMedication = (id, data) => api.put(`/medications/${id}`, data);
export const deleteMedication = (id) => api.delete(`/medications/${id}`);

// ── Adherence ────────────────────────────────────────────────────────────────
export const getAdherenceLogs = (params) => api.get('/adherence', { params });
export const createAdherenceLog = (data) => api.post('/adherence', data);
export const deleteAdherenceLog = (id) => api.delete(`/adherence/${id}`);
export const getAdherenceSummary = () => api.get('/adherence/summary');

// ── Effectiveness ─────────────────────────────────────────────────────────────
export const getEffectivenessLogs = (params) => api.get('/effectiveness', { params });
export const createEffectivenessLog = (data) => api.post('/effectiveness', data);
export const deleteEffectivenessLog = (id) => api.delete(`/effectiveness/${id}`);
export const getEffectivenessTrend = (params) => api.get('/effectiveness/trend', { params });

export default api;