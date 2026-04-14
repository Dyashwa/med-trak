const supabase = require('../config/supabaseClient');

// GET logs
const getEffectivenessLogs = async (req, res) => {
    const { data, error } = await supabase
        .from('effectiveness_logs')
        .select('*, medications(name)')
        .eq('user_id', req.user.id)
        .order('logged_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
};

// CREATE log
const createEffectivenessLog = async (req, res) => {
    const { medication_id, rating, symptoms, side_effects, notes, logged_at } = req.body;

    const { data, error } = await supabase
        .from('effectiveness_logs')
        .insert([{
            user_id: req.user.id,
            medication_id,
            rating,
            symptoms,
            side_effects,
            notes,
            logged_at
        }])
        .select();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data[0]);
};

// DELETE
const deleteEffectivenessLog = async (req, res) => {
    const { error } = await supabase
        .from('effectiveness_logs')
        .delete()
        .eq('id', req.params.id)
        .eq('user_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Deleted' });
};

// TREND
const getEffectivenessTrend = async (req, res) => {
    const { data, error } = await supabase
        .from('effectiveness_logs')
        .select('rating, logged_at');

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
};

module.exports = {
    getEffectivenessLogs,
    createEffectivenessLog,
    deleteEffectivenessLog,
    getEffectivenessTrend,
};