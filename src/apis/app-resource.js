import request from "../request";

export const listTree = (data) => {
    return request({
        url: "app/resource/listTree",
        method: "get",
        data
    })
};

export const save = (data) => {
    return request({
        url: 'app/resource/save',
        method: "post",
        data
    });
};

export const update = (data) => {
    const { id } = data;
    delete data.id;
    return request({
        url: 'app/resource/update/${id}',
        method: "post",
        data
    });
};

export const listTreeParents = (data) => {
    return request({
        url: 'app/resource/listParents',
        method: 'get',
        data
    })
};

export const remove = (data) => {
    return request({
        url: 'app/resource/remove',
        method: "post",
        data
    });
};