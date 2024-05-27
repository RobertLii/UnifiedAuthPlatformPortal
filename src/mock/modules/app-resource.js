export function listTree() {
    let respTreeData = {
        code: 200,
        msg: null,
        data: getTreeData
    };

    return {
        url: "app/resource/listTree",
        method: "get",
        response: respTreeData
    };
}

function getTreeData() {
    return [
        {
            id: 1,
            name: "monitor",
            displayName: "系统监控",
            icon: "info",
            type: "0",
            url: null,
            orderNum: 1,
            parentId: null,
            parentName: null,
            level: 0,
            children: [
                {
                    id: 11,
                    name: "summary",
                    displayName: "统计",
                    icon: "warning",
                    type: "1",
                    url: "/monitor/summary",
                    orderNum: 0,
                    parentId: null,
                    parentName: null,
                    level: 1,
                    children: []
                },
                {
                    id: 12,
                    name: "data",
                    displayName: "数据监控",
                    icon: "warning",
                    type: "1",
                    url: "/monitor/data",
                    orderNum: 0,
                    parentId: null,
                    parentName: null,
                    level: 1,
                    children: [
                        {
                            id: 121,
                            name: "view",
                            displayName: "查看",
                            icon: null,
                            type: "2",
                            url: "/monitor/data/view",
                            orderNum: 0,
                            parentId: null,
                            parentName: null,
                            level: 2,
                            children: []
                        }
                    ]
                }
            ]
        }
    ];
}

// 新增或编辑
export function saveOrUpdate() {
    return {
        url: "app/resource/(save|update|remove)",
        method: "post",
        response: {
            code: 200,
            msg: '',
            data: null
        }
    };
}


export function listTreeParents() {
    return {
        url: "app/resource/listParents",
        method: 'get',
        response: () => {
            function filterTree(data) {
                //排除按钮类型的节点
                const newTree = data.filter(v => v.type !== 2);
                newTree.forEach(v => v.children && (v.children = filterTree(v.children)));
                return newTree;
            };
            return {
                code: 200,
                msg: '',
                //TODO: treeData?
                data: filterTree(JSON.parse(JSON.stringify(getTreeData())))
            }
        }
    }
}
