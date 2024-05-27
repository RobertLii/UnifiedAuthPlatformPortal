import { userInfo } from '@/apis/personal';

export default {
    namespaced: true,
    state: {
        token: '',
        userInfo: {}
    },
    getters: {
        isLogin(state) {
            return !!state.token || !!localStorage.getItem('pm_token');
        }
    },
    mutations: {
        setToken(state, token) {
            localStorage.setItem('pm_token', token);
            state.token = token;
        },
        clearToken(state) {
            state.token = '';
            localStorage.removeItem('pm_token');
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo || {};
        },
        clearUserInfo(state) {
            state.userInfo = {};
        }
    },
    actions: {
        refreshInfo({commit}) {
            userInfo().then(res => {
                commit('setUserInfo', res.data)
            })
        }
    }
};