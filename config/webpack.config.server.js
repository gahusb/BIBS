const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');
const getClientEnvironment = require('./env');

// 환경 변수 설정
const publicPath = paths.servedPath;
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

module.exports = {
    entry: paths.ssrJs,
    target: 'node', // node 전용으로 번들링한다는 것을 명시
    output: {
        path: paths.ssrBuild,
        filename: 'render.js',
        // Node.js에서 require로 불러올 수 있게 한다.
        libraryTarget: 'commonjs2'
    },
    module: {
        // 각 파일을 불러올 때 설정
        rules: [
            {
                // oneOf는 내부의 모든 로더를 시도해 보고, 해당하는 것이 없다면
                // 맨 아래쪽의 file-loader를 실행시킨다.
                oneOf: [
                    {
                        // 자바스크립트 파일은 베벨을 사용하여 변환
                        test: /\.(js|jsx)$/,
                        include: paths.appSrc,
                        loader: require.resolve('babel-loader'),
                        options: {
                            cacheDirectory: true
                        },
                    },
                    /* css와 scss 파일을 불러올 때는
                        css-loader/locals를 실행하는 것이 중요!
                        파일을 따로 만들어 내지 않기 때문 */
                    {
                        test: /\.css$/,
                        loader: require.resolve('css-loader/locals'),
                    },
                     /* scss는 CSS Module이 제대로 작동하도록
                        production과 동일하게 설정하되
                        여기에서도 css-loader/locals를 적용 */
                    {
                        test: /\.scss$/,
                        use: [
                            {
                                loader: require.resolve('css-loader/locals'),
                                options: {
                                    importLoaders: 1,
                                    modules: true,
                                    localIdentName: '[name]__[local]___[hash:base64:5]'
                                },
                            },
                            {
                                loader: require.resolve('sass-loader'),
                                options: {
                                    includePaths: [paths.globalStyles]
                                }
                            }
                        ]
                    },
                    // 자바스크립트도, 스타일도 아니라면 파일로 취급
                    // 여기에서는 emitFile: false 설정이 중요
                    {
                        loader: require.resolve('file-loader'),
                        exclude: [/\.js$/, /\.html$/, /\.json$/],
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                            // 경로만 만들고, 실제로 파일을 따로 저장하지는 않는다.
                            emitFile: false
                        },
                    }
                ]
            }
            
        ]
    },
    resolve: {
        // NODE_PATH가 제대로 작동하도록 production에서 사용한 설정을 그대로 넣어준다.
        modules: ['node-modules', paths.appNodeModules].concat(
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        )
    },
    // 여기에서는 환경변수 관련 플러그인만 적용해 주면 된다.
    plugins: [
        new webpack.DefinePlugin(env.stringified),
    ],
};