import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Modal, Button, Alert, Progress, Icon, Input ,RadioGroup,Radio } from 'view-design';
Vue.component('Modal', Modal);
Vue.component('Button', Button);
Vue.component('Alert', Alert);
Vue.component('Progress', Progress);
Vue.component('Icon', Icon);
Vue.component('Input', Input);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Radio', Radio);

// 引入css
import 'view-design/dist/styles/iview.css'
import '@/assets/css/reset.less'
import '@/assets/icons/iconfont.css'
// 全局变量

Vue.config.productionTip = false
import Clipboard from 'clipboard';
Vue.prototype.Clipboard = Clipboard;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')