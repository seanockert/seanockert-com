import Vue from 'vue'
import App from './App.vue'
import Department from './components/Department.vue'

import VueResource from 'vue-resource';
Vue.use(VueResource);

// Drag and drop plugin
import { Vue2Dragula } from 'vue2-dragula'
Vue.use(Vue2Dragula, {
  //copySortSource: true
})

// Keyboard shortcuts
import VueShortkey from 'vue-shortkey'
Vue.use(VueShortkey)

// Init router
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// Set up possible routes
const routes = [
  { path: '/', name: 'home', component: Department }, 
  //{ path: '/', redirect: '/sales' }
  { path: '/:department', name: 'department', component: Department },
]

const router = new VueRouter({
  routes,
  //mode: 'history',
  linkActiveClass: 'active',
  root: '/'
})

// Init app
const app = new Vue({
  router,
  el: '#app',
  render: h => h(App)
})
