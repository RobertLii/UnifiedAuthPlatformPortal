import request from "@/request";

export const userInfo = (data) => {
    return request({
        url: "personal/userInfo",
        method: "get",
        data
    });
}

export const menuTree = (data) => {
    return request({
        url: "personal/menuTree",
        method: "get",
        data
    });
};

export const changeProfile = (data) => {
    return request({
        url: "personal/changeProfile",
        method: "post",
        data
    });
};

export const changePsw = (data) => {
    return request({
        url: "personal/changepsw",
        method: "post",
        data
    });
};
