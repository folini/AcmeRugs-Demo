const path = require('path')

module.exports = {
    entry: './src/acme.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'acme.js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {configFile: 'tsconfig.json'},
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
}
