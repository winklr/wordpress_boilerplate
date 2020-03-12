module.exports = {
    extends: [
        'werk85/react',
    ],
    parserOptions: {
        project: ['./tsconfig.json','./src/tsconfig.json'],
        ecmaFeatures: {
            jsx: true
        }
    },
    settings: {
        'import/resolver': 'webpack'
    }
};
