import request from "../request";

export const listTree = (data) => {
    return request({
        url: "app/dept/listTree",
        method: "get",
        data
    })
};

export const save = (data) => {
    return request({
        url: 'app/dept/save',
        method: "post",
        data
    });
};

export const update = (data) => {
    const { id } = data;
    delete data.id;
    return request({
        url: 'app/dept/update/${id}',
        method: "post",
        data
    });
};

export const listOtherTreeById = (id) => {
    return request({
        url: "app/dept/listOtherTreeById/${id}",
        method: "get"
    })
};

export const remove = (data) => {
    return request({
        url: 'app/dept/remove',
        method: "post",
        data
    });
};