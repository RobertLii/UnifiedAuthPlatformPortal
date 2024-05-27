import request from "../request";

export const listPage = (data) => {
    return request({
        url: "sys/notice/listPage",
        method: "get",
        data
    })
};

export const save = (data) => {
    return request({
        url: 'sys/notice/save',
        method: "post",
        data
    });
};

export const update = (data) => {
    const { id } = data;
    delete data.id;
    return request({
        url: 'sys/notice/update/${id}',
        method: "post",
        data
    });
};

export const remove = (data) => {
    return request({
        url: 'sys/notice/remove',
        method: "post",
        data
    });
};
