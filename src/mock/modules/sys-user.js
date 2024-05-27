import { roles, users } from "../data";

export function listPage() {
    return {
        url: "sys/user/listPage",
        method: "get",
        response: (opts) => {
            const { pageNum, pageSize, name } = opts.data;
            let set = users.map(v => {
                const o = { ...v };
                if (v.id <= 4) {
                    o.password = o.name;
                    o.roleName = roles.find(item => item.name === o.roleId).label;
                    o.ip = '@ip';
                    o.visitTime = '@date @time';
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
        url: "sys/user/save",
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
        url: "sys/user/update",
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
        url: "sys/user/remove",
        method: "post",
        response: {
            code: 200,
            msg: '',
            data: null
        }
    };
}


export function setPassword() {
    return {
        url: "sys/user/password",
        method: "post",
        response: (opts) => {
            return {
                code: 200,
                msg: '',
                data: {
                    name: opts.data.name,
                    password: '@word(8, 16)'
                }
            };
        }
    };
}

export function getRoles() {
    return {
        url: "sys/user/roles",
        method: "post",
        response: (opts) => {
            return {
                code: 200,
                msg: '',
                data: {
                    name: opts.data.name,
                    password: '@word(8, 16)'
                }
            };
        }
    };
}