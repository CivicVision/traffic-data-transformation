module.exports = {
    verbose: true,
    collectCoverageFrom: ['**/*.{js}'],
    testMatch: ['<rootDir>/?(*.)(test).{js}'],
    testURL: 'http://localhost',
    globals: {
        'process.env': {
            NODE_ENV: process.env.NODE_ENV || JSON.stringify('test'),
        },
    },
};
