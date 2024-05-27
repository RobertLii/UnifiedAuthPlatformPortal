import Mock from 'mockjs';
import config from "./config";

// import * as login from './modules/login';
// import * as personal from "./modules/personal";
// import * as accessLog from "./modules/access-log";

const moduleFiles = require.context('./modules', true, /.js$/);
const modules = {};
moduleFiles.keys().forEach(filename => {
    let name = filename.replace('./', '');
    name = name.substring(0, name.length - 3).replace(/-(\w)/g, (L) => L.toUpperCase()).replace(/-/g, '');
    modules[name] = moduleFiles(filename);
});

const { baseURL, timeout } = config;

Mock.setup({ timeout })

const openMock = true;
// TODO: 指定需要模拟的API
//mockAll([login, personal, accessLog], openMock);

mockAll(modules, openMock);

function mockAll(modules, isOpen = true) {
    for (const module in modules) {
        console.log("正在模拟模块[" + module + "]" + "的API");
        mock(modules[module], isOpen);
    }
}

function mock(module, isOpen = true) {
    if (isOpen) {
        for (var key in module) {
            ((res) => {
                if (res.isOpen !== false) {
                    let url = baseURL;
                    if (!url.endsWith("/")) {
                        url = url + "/";
                    }

                    url = url + res.url;
                    console.log("  API: " + url);
                    Mock.mock(new RegExp(url), res.method, (opts) => {
                        opts.data = opts.body ? JSON.parse(opts.body) : null;
                        const resData = Mock.mock(typeof res.response === 'function' ? res.response(opts) : res.response);
                        console.log('%cmock 拦截， 请求： ', 'color:blue', opts);
                        console.log('%cmock 拦截， 响应： ', 'color:blue', resData);
                        return resData;
                    })
                }
            })(module[key]() || {});
        }
    }
}