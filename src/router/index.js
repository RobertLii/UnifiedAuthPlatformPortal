import { createRouter, createWebHashHistory } from "vue-router";

import Layout from '@/layout/index.vue';
import store from "@/store";
import { menuTree } from "@/apis/personal";

const routes = [
    // {
    //     path: '/',
    //     name: 'Home',
    //     component: () => import('../views/Home.vue')
    // },
    // {
    //     path: '/about',
    //     name: 'About',
    //     component: () => import('../views/About.vue')
    // }
    {
        path: "/",
        name: "Home",
        component: Layout,
        children: [
            {
                path: "login",
                name: "Login",
                component: () => import("@/views/login/index.vue")
            },
            {
                path: "404",
                name: "NotFound",
                component: () => import("@/views/404.vue")
            },
            {
                path: "personal",
                name: "Personal",
                meta: {
                    requireAuth: true
                },
                component: () => import("@/views/personal/index.vue"),
                // component: () => import("@/views/personal"),
                redirect: "/personal/profile",
                children: [
                    {
                        path: "profile",
                        name: "PersonalProfile",
                        meta: {
                            requireAuth: true
                        },
                        component: () => import("@/views/personal/Profile.vue")
                    },
                    {
                        path: "changepsw",
                        name: "PersonalChangePsw",
                        meta: {
                            requireAuth: true
                        },
                        component: () => import("@/views/personal/ChangePsw.vue")
                    },
                    {
                        path: "message",
                        name: "PersonalMessage",
                        meta: {
                            requireAuth: true
                        },
                        component: () => import("@/views/personal/message/index.vue")
                    }
                ]
            },
            // {
            //     path: "app",
            //     name: "App",
            //     meta: {
            //         requireAuth: true
            //     },
            //     component: () => import("@/views/app/index.vue")
            // },
            // {
            //     path: "personal",
            //     name: "Personal",
            //     meta: {
            //         requireAuth: true
            //     },
            //     component: () => import("@/views/personal/index.vue"),
            //     redirect: "/personal/profile",
            //     children: [
            //         {
            //             path: "profile",
            //             name: "PersonalProfile",
            //             meta: {
            //                 requireAuth: true
            //             },
            //             component: () => import("@/views/personal/Profile.vue")
            //         },
            //         {
            //             path: "changepwd",
            //             name: "PersonalChangePwd",
            //             meta: {
            //                 requireAuth
            //             },
            //             component: () => import("@/views/personal/ChangePwd.vue")
            //         },
            //         {
            //             path: "message",
            //             name: "PersonalMessage",
            //             meta: {
            //                 requireAuth: true
            //             },
            //             component: () => import("@/views/personal/message/index.vue")
            //         }
            //     ]
            // }
        ]
    },
    // {
    //     path: "/home",
    //     name: "Home",
    //     component: () => import("@/views/Home.vue")
    // },
    // {
    //     path: "/:pathMatch(.*)*",
    //     name: "404",
    //     redirect: '/404',
    //     component: () => import("@/views/404.vue")
    // }
];

const route404 = {
    path: "/:pathMatch(.*)*",
    name: "404",
    redirect: "/404"
}

const router = createRouter({
    // history: createWebHashHistory(process.env.BASE_URL),
    history: createWebHashHistory(),
    routes
})

// 全局导航守卫，检查认证状态
router.beforeEach(async (to) => {
    const isLogin = store.getters["user/isLogin"];
    if (to.path === "/login") {
        if (isLogin) {
            return { name: "Home" };
        }
        return true;
    }

    if (to.path === "/" && !isLogin) {
        return { name: "Login" };
    }

    if (to.meta.requireAuth) {
        if (!isLogin) {
            return { name: "Login" };
        }
    }

    // 动态添加路由
    await addDynamic();

    if (!to.name && hasRoute(to)) {
        return { ...to };
    }

    if (to.path === "/" && store.state.firstRoute) {
        return store.state.firstRoute;
    }
    return true;

    // const token = localStorage.getItem("pm_token");
    // if (to.meta.requireAuth && !token) {
    //     return {name: 'Login'};
    // }

    // return true;
});

/**
 * 
 * @param {*} to 判断路由是否存在
 * @returns 
 */
function hasRoute(to) {
    const item = router.getRoutes().find((item) => item.path === to.path);
    return !!item;
}

async function addDynamic() {
    if (store.state.routeLoaded) {
        return;
    }

    // 获取菜单数据，然后动态添加路由
    return menuTree().then((res) => {
        if (res.data && res.data.length) {
            addDynamicRoutes(res.data);
        }

        router.addRoute(route404);
        store.commit("setRouteLoaded", true);
        store.commit("setMenuTree", res.data);
    });
}

// TODO: 动态引入views下所有.vue文件（组件）
const modules = require.context('@/views', true, /\.vue$/);



modules.keys().forEach((value, index, array) => {
    console.log("modules的内容有：" + value);
    console.log(modules(value).default);
})

console.log()

/**
 * 根据返回的菜单数据添加路由
 * @param {*} data 菜单数据
 * @param {*} parent 上级菜单
 */
function addDynamicRoutes(data, parent) {
    data.forEach((item, i) => {
        const route = {
            path: item.path,
            name: item.name,
            meta: {
                title: item.title,
                icon: item.icon
            },
            children: []
        }

        if (parent) {
            if (item.parentId !== 0) {
                const compParr = item.path.replace("/", "").split("/");
                const l = compParr.length - 1;
                const compPath = compParr
                    .map((v, i) => {
                        return i === 1 ? v.replace(/\w/, (L) => L.toUpperCase()) + ".vue" : v;
                    })
                    .join("/");

                route.path = compParr[1];
                // TODO
                route.component = modules("./" + compPath).default;  // modules[`../views/${compPath}`];
                parent.children.push(route);
            }
        }
        else {
            if (item.children && item.children.length) {
                route.redirect = item.children[0].path;
                addDynamicRoutes(item.children, route);
            }

            // TODO: 待修复问题
            // 页面组件
            // route.component = PageFrame;
            if (i === 0) {
                store.commit("setFirstRoute", route);
            }

            router.addRoute("Home", route);
        }
    });
}

export default router