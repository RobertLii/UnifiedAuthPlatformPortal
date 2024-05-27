import request from "../request";

export const listPage = (data) => {
    return request({
        url: "sys/user/listPage",
        method: "get",
        data
    })
}

export const save = (data) => {
    return request({
        url: 'sys/user/save',
        method: "post",
        data
    });
}

export const update = (data) => {
    const { id } = data;
    delete data.id;
    return request({
        url: 'sys/user/update/${id}',
        method: "post",
        data
    });
}

export const setPassword = (data) => {
    return request({
        url: 'sys/user/password',
        method: "post",
        data
    });
};

export const remove = (data) => {
    return request({
        url: 'sys/user/remove',
        method: "post",
        data
    });
};

