import { users } from "../data";

export function login() {
    return {
        url: "login",
        method: "post",
        response: (opts) => {
            const name = opts.data.account;
            if (users.find((v) => v.name === name && v.password === opts.data.password)) {
                return {
                    code: 200,
                    msg: "",
                    data: {
                        token: "admin@eteseljkkienrmeljl",
                        name
                    }
                };
            }
            
            return {
                code: -1,
                msg: "用户名或密码错误",
                data: null
            };
        }
    };
}

export function logout() {
    return {
        url: "logout",
        method: "post",
        response: {
            code: 200,
            msg: null,
            data: {}
        }
    }
}