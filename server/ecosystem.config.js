module.exports = {
    apps: [{
        name: 'zylaxapp',
        script: 'dist/app.js',
        watch: '.',
        args: [
            '--color'
        ],
        env: {
            DEBUG_COLORS: true
        }
    }]
};
