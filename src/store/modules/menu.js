// src/store/modules/menu.js
const state = () => ({
    menuItems: []
});

const mutations = {
    SET_MENU_ITEMS(state, items) {
        state.menuItems = items;
    }
};

const actions = {
    updateMenuItems({ commit }, items) {
        commit('SET_MENU_ITEMS', items);
    }
};

const getters = {
    menuItems: (state) => state.menuItems
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};  