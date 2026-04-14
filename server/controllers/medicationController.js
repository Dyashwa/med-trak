const supabase = require('../config/supabaseClient');

// GET all medications
const getMedications = async (req, res) => {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

// GET single medication
const getMedicationById = async (req, res) => {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (error) return res.status(404).json({ error: 'Medication not found' });

  res.json(data);
};

// CREATE medication
const createMedication = async (req, res) => {
  const { name, dosage, frequency, start_date, end_date, notes } = req.body;

  // 🔥 ADD THIS
  if (!name || !dosage || !frequency) {
    return res.status(400).json({ error: 'name, dosage and frequency are required' });
  }

  const { data, error } = await supabase
    .from('medications')
    .insert([{
      user_id: req.user.id,
      name,
      dosage,
      frequency,
      start_date,
      end_date,
      notes
    }])
    .select();

  if (error) {
    console.error('CREATE ERROR:', error); // 🔥 DEBUG
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
};

// UPDATE
const updateMedication = async (req, res) => {
  const { name, dosage, frequency, start_date, end_date, notes } = req.body;

  const { data, error } = await supabase
    .from('medications')
    .update({ name, dosage, frequency, start_date, end_date, notes })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data[0]);
};

// DELETE
const deleteMedication = async (req, res) => {
  const { error } = await supabase
    .from('medications')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Deleted successfully' });
};

module.exports = {
  getMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  deleteMedication,
};