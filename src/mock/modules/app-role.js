import { roles, users } from "../data";

export function listPage() {
    return {
        url: "app/role/listPage",
        method: "get",
        response: (opts) => {
            const {pageNum, pageSize} = opts.data;
            const totalSize = 20;
            // TODO: 一下可能需要修复
            const content = pageNum * pageSize < totalSize ? `content|${pageSize}` : `content|${totalSize % pageSize}`;
            return {
                code: 200,
                msg: null,
                data: {
                    pageNum,
                    pageSize,
                    totalSize,
                    [content]: [
                        {
                            id: "@increment",
                            name: "@word(4, 5)",
                            'remark|1': ["项目经理", "产品经理", "开发人员", "测试人员", "运维人员"],
                            'createdBy|1': ["admin", "admin2", "master"],
                            createdTime: "@date @time",
                            lastUpdatedBy: ["admin", "admin2", "master"],
                            lastUpdatedTime: "@date @time"
                        }
                    ]
                }
            };
        }
    };
}


// 新增或编辑
export function saveOrUpdate() {
    return {
        url: "app/role/(save|update|remove|bindResource)",
        method: "post",
        response: {
            code: 200,
            msg: '',
            data: null
        }
    };
}


export function listSimple() {
    return {
        url: "app/role/listSimple",
        method: 'get',
        response: {
            code: 200,
            msg: null,
            data: [
                {
                    id: 1,
                    name: "admin"
                },
                {
                    id: 2,
                    name: "dev"
                },
                {
                    id: 3,
                    name: "test"
                },
                {
                    id: 4,
                    name: "mng"
                }
            ]
        }
    };
}