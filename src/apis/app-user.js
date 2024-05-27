import request from "../request";

export const listPage = (data) => {
    return request({
        url: "app/user/listPage",
        method: "get",
        data
    })
};

export const save = (data) => {
    return request({
        url: 'app/user/save',
        method: "post",
        data
    });
};

export const update = (data) => {
    const { id } = data;
    delete data.id;
    return request({
        url: 'app/user/update/${id}',
        method: "post",
        data
    });
};


export const remove = (data) => {
    return request({
        url: 'app/user/remove',
        method: "post",
        data
    });
};