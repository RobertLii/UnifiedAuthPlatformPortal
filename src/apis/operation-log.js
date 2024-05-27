import request from "@/request";

export const listPage = (data) => {
    return request({
        url: "logs/operation/listPage",
        method: "get",
        data
    });
};