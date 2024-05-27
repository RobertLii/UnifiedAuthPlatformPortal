import { createStore } from "vuex";
import user from './modules/user'
import menu from "./modules/menu";

export default createStore({
    state: {
        routeLoaded: false,    // 菜单和路由是否已加载
        firstRoute: null,    // 第一个路由，用于进入主页时的redirect
        menuTree: null    // 菜单树
    },
    mutations: {
        setRouteLoaded(state, loaded) {
            state.routeLoaded = loaded;
        },
        setFirstRoute(state, firstRoute) {
            state.firstRoute = firstRoute;
        },
        setMenuTree(state, data) {
            state.menuTree = data;
        }
    },
    modules: {
        user,
        menu
    }
})
