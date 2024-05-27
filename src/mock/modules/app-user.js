import { roles, users } from "../data";

export function listPage() {
    return {
        url: "app/user/listPage",
        method: "get",
        response: (opts) => {
            const { pageNum, pageSize, name } = opts.data;
            let set = users.map(v => {
                const o = { ...v };
                if (v.id <= 4) {
                    o.password = o.name;
                    o.roleNames = roles.find(item => item.name === o.roleId).label;
                    // o.roleNames = Mock.Random.pick(['项目经理', '开发人员'], '测试人员');
                    o.ip = '@ip';
                    o.deptName = '@cword(3, 5)集团 / @province ' + "分公司";
                    // o.roleNames = 'roleTest';
                    o.email = '@email';
                    o.mobile = '@natural(13400000000, 18999999999)';
                    o.visitTime = '@date @time';
                    o.status = '@Boolean';
                }
                return o;
            });

            if (name) {
                set = set.filter(v => v.name === name);
            }

            const totalSize = set.length;
            const totalPages = Math.ceil(totalSize / pageSize);
            let lastIndex = pageNum * pageSize;
            if (lastIndex > totalSize) {
                lastIndex = totalSize;
            }

            let resData = [];
            if (pageNum >= 1 && pageNum <= totalPages) {
                resData = set.slice((pageNum - 1) * pageSize, lastIndex)
            }

            return {
                code: 200,
                msg: null,
                data: {
                    pageNum,
                    pageSize,
                    totalSize,
                    content: resData
                }
            };
        }
    };
}


export function save() {
    return {
        url: "app/user/save",
        method: "post",
        response: (opts) => {
            return {
                code: 200,
                msg: '',
                data: {
                    name: opts.data.name,
                    password: '@word(8, 16)'
                }
            }
        }
    };
}

export function update() {
    return {
        url: "app/user/update",
        method: "post",
        response: {
            code: 200,
            msg: '',
            data: null
        }
    };
}

export function remove() {
    return {
        url: "app/user/remove",
        method: "post",
        response: {
            code: 200,
            msg: '',
            data: null
        }
    };
}
