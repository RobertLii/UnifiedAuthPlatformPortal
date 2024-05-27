// 列表显示
export function listPage() {
    return {
        url: "sys/notice/listPage",
        method: "get",
        response: (opts) => {
            const {pageNum, pageSize} = opts.data;
            const totalSize = 4;
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
                            'createdBy|1': ["admin", "admin2"],
                            title: "@ctitle(5, 20)",
                            createdTime: "@date @time",
                            content: "@cparagraph(1, 2)",
                            'publishTime|1': ['', '@date @time']
                        }
                    ]
                }
            }
        }
    };
};

// 新增或编辑
export function saveOrUpdate() {
    return {
        url: "sys/notice/(save|update|remove)",
        method: "post",
        response: {
            code: 200,
            msg: '',
            data: null
        }
    };
}