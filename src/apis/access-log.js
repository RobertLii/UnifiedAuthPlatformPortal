import request from "@/request";

export const listPage = (data) => {
    return request({
        url: "logs/access/listPage",
        method: "get",
        data
    });
};