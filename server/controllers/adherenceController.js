const supabase = require('../config/supabaseClient');

// GET logs
const getAdherenceLogs = async (req, res) => {
  const { data, error } = await supabase
    .from('adherence_logs')
    .select('*, medications(name, dosage)')
    .eq('user_id', req.user.id)
    .order('taken_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

// CREATE log
const createAdherenceLog = async (req, res) => {
  const { medication_id, status, taken_at, notes } = req.body;

  const { data, error } = await supabase
    .from('adherence_logs')
    .insert([{
      user_id: req.user.id,
      medication_id,
      status,
      taken_at,
      notes
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data[0]);
};

// DELETE
const deleteAdherenceLog = async (req, res) => {
  const { error } = await supabase
    .from('adherence_logs')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Deleted' });
};

// SUMMARY
const getAdherenceSummary = async (req, res) => {
  const { data, error } = await supabase
    .from('adherence_logs')
    .select('status, medication_id');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

module.exports = {
  getAdherenceLogs,
  createAdherenceLog,
  deleteAdherenceLog,
  getAdherenceSummary,
};