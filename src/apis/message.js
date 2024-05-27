import request from "@/request";

export const list = (data) => {
    const type = data.type;
    delete data.type;
    return request({
        url: `/message/list/${type}`,
        method: 'get',
        data
    });
};

export const read = (data) => {
    const { id, type } = data;
    delete data.id;
    delete data.type;
    return request({
        url: `/message/read/${type}/${id}`,
        method: "post",
        data
    });
};

export const readAll = (data) => {
    const type = data.type;
    delete data.type;
    return request({
        url: `/message/readAll/${type}`,
        method: "post",
        data
    });
};

export const remove = (data) => {
    const { id, type } = data;
    delete data.type;
    delete data.id;
    return request({
        url: `/message/read/${type}/${id}`,
        method: "delete",
        data
    });
};
