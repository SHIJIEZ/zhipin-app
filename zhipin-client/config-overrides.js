// 按需打包
// const { injectBabelPlugin } = require("react-app-rewired");

// module.exports = function override(config, env) {
//     config = injectBabelPlugin(["import", { libraryName: "antd-mobile", style: "css" }], config);
//     return config;
// }

const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd-mobile",
        libraryDirectory: "es",
        style: true // change importing css to less
        // style: 'css',
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            // "@primary-color": "#1cae82",
            "@brand-primary": "#1cae82", // 正常
            "@brand-primary-tap": "#1DA57A", // 按下
        }
    })
);

