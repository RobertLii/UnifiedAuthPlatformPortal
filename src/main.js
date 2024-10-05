import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';

import 'normalize.css/normalize.css'

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

import * as ElIcons from '@element-plus/icons-vue'


import './mock'

import CmTable from "@/components/CmTable.vue";

const app = createApp(App);

for (const name in ElIcons) {
    app.component(name, ElIcons[name])
}

//app.component(CmTable.name, CmTable);

app.component('cm-table', CmTable);

// 防抖： Element-UI 导致问题
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
        func(...args);
      }, delay);
  }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 200);
    super(callback);
  }
}

app.use(router)
  .use(store)
  .use(ElementPlus)
  .use(i18n)
  .mount('#app')
