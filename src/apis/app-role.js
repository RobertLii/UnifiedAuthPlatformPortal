import request from "../request";

export const listPage = (data) => {
    return request({
        url: "app/role/listPage",
        method: "get",
        data
    })
}

export const save = (data) => {
    return request({
        url: 'app/role/save',
        method: "post",
        data
    });
};

export const update = (data) => {
    const { id } = data;
    delete data.id;
    return request({
        url: 'app/role/update/${id}',
        method: "post",
        data
    });
};

export const listSimple = () => {
    return request({
        url: "app/role/listSimple",
        method: 'get'
    });
};

export const remove = (data) => {
    return request({
        url: 'app/role/remove',
        method: "post",
        data
    });
};

export const bindResource = (data) => {
    return request({
        url: 'app/role/bindResource',
        method: "post",
        data
    });
};