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

app.use(router)
  .use(store)
  .use(ElementPlus)
  .use(i18n)
  .mount('#app')
