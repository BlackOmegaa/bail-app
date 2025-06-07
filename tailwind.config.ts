module.exports = {
    darkMode: 'class', // ✅ obligatoire
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {
            colors: {
                background: 'var(--color-background)',
                foreground: 'var(--color-foreground)',
                primary: 'var(--color-primary)',
                muted: 'var(--color-muted)',
            }
        }
    },
    plugins: []
};
