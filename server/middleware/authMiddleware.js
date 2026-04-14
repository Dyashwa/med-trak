const supabase = require('../config/supabaseClient');

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 🔥 Check header
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn('❌ No Authorization header');
            return res.status(401).json({ error: 'Missing or invalid Authorization header' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            console.warn('❌ No token found');
            return res.status(401).json({ error: 'Token missing' });
        }

        // 🔥 Verify token with Supabase
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data?.user) {
            console.warn('❌ Invalid token:', error?.message);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // ✅ Attach user
        req.user = data.user;

        next();
    } catch (err) {
        console.error('🔥 Auth middleware error:', err.message);
        return res.status(500).json({ error: 'Authentication check failed' });
    }
};

module.exports = { protect };