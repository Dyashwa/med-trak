/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // 🔥 enables manual dark/light toggle

    content: ['./index.html', './src/**/*.{js,jsx}'],

    theme: {
        extend: {
            fontFamily: {
                display: ['"Sora"', 'sans-serif'],
                body: ['"Plus Jakarta Sans"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },

            // 🎨 Color system for light/dark
            colors: {
                primary: "#22c55e", // green accent
                darkBg: "#0f172a",
                darkCard: "#1e293b",
                lightBg: "#f8fafc",
            },

            // 🌈 Smooth transitions
            transitionProperty: {
                theme: "background-color, color, border-color",
            },

            // ✨ Soft shadows (premium feel)
            boxShadow: {
                glow: "0 0 20px rgba(34, 197, 94, 0.3)",
                soft: "0 10px 30px rgba(0,0,0,0.15)",
            },

            // 🎯 Animation (for ripple + UI)
            keyframes: {
                ripple: {
                    '0%': { transform: 'scale(0)', opacity: '0.6' },
                    '100%': { transform: 'scale(40)', opacity: '0' },
                },
            },

            animation: {
                ripple: 'ripple 0.6s ease-out forwards',
            },
        },
    },

    plugins: [],
};