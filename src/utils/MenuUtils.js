
/**
 * 生成菜单路由
 * @param {*} menuItems 
 * @returns 
 */
export function generateRoutes(menuItems) {
    const routes = menuItems.map(item => {
        const route = {
            name: item.name,
            path: item.path,
            meta: {
                title: item.title,
                icon: item.icon
            },
            component: () => import(`@/views/${item.component}.vue`),
            children: item.children ? generateRoutes(item.children) : []
        };
        return route;
    });
    return routes;
}
