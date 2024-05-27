import request from "@/request";

// 登录
export const login = (data) => {
    return request({
        url: 'login',
        method: 'post',
        data
    });
};

// 退出
export const logout = () => {
    return request({
        url: "logout",
        method: "post"
    })
}
