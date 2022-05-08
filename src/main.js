import { createApp } from 'vue'
import { TroisJSVuePlugin } from 'troisjs';
import App from './App.vue'
import router from './router';

const app = createApp(App);
app.use(router);
app.use(TroisJSVuePlugin);
app.mount('#app');
