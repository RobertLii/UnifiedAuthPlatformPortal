export function listTree() {
    let findTreeData = getTreeData();

    return {
        url: "app/dept/listTree",
        method: "get",
        response: findTreeData
    };
}

function getTreeData() {
    return {
        code: 200,
        msg: null,
        data: [
            {
                id: 1,
                createdBy: "admin",
                createdTime: "@date @time",
                lastUpdatedBy: "admin",
                lastUpdatedTime: "@date @time",
                name: "中国电信股份有限公司",
                parentId: null,
                parentName: null,
                level: 0,
                children: [
                    {
                        id: 5,
                        createdBy: "admin",
                        createdTime: "@date @time",
                        lastUpdatedBy: "admin",
                        lastUpdatedTime: "@date @time",
                        name: "中国电信股份有限公司北京分公司",
                        parentId: 1,
                        level: 1,
                        children: [
                            {
                                id: 50,
                                createdBy: "admin",
                                createdTime: "@date @time",
                                lastUpdatedBy: "admin",
                                lastUpdatedTime: "@date @time",
                                name: "技术部",
                                parentId: 5,
                                parentName: "技术部",
                                level: 2,
                                children: []
                            },
                            {
                                id: 51,
                                createdBy: "admin",
                                createdTime: "@date @time",
                                lastUpdatedBy: "admin",
                                lastUpdatedTime: "@date @time",
                                name: "市场部",
                                parentId: 5,
                                parentName: "市场部",
                                level: 2,
                                children: []
                            }
                        ]
                    },
                    {
                        id: 6,
                        createdBy: "admin",
                        createdTime: "@date @time",
                        lastUpdatedBy: "admin",
                        lastUpdatedTime: "@date @time",
                        name: "中国电信股份有限公司上海分公司",
                        parentId: 1,
                        level: 1,
                        children: [
                            {
                                id: 60,
                                createdBy: "admin",
                                createdTime: "@date @time",
                                lastUpdatedBy: "admin",
                                lastUpdatedTime: "@date @time",
                                name: "技术部",
                                parentId: 5,
                                parentName: "技术部",
                                level: 2,
                                children: []
                            },
                            {
                                id: 60,
                                createdBy: "admin",
                                createdTime: "@date @time",
                                lastUpdatedBy: "admin",
                                lastUpdatedTime: "@date @time",
                                name: "市场部",
                                parentId: 5,
                                parentName: "市场部",
                                level: 2,
                                children: []
                            }
                        ]
                    }
                ]
            }
        ]
    };
}


// 新增或编辑
export function saveOrUpdate() {
    return {
        url: "app/dept/(save|update|remove)",
        method: "post",
        response: {
            code: 200,
            msg: '',
            data: null
        }
    };
}

export function listOtherTreeById(id) {
    return {
        url: "app/dept/listOtherTreeById",
        method: "get",
        response: getTreeData()
    };
}