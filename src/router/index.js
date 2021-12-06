import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../components/Home';
import SorveteCrud from '../components/SorveteCrud';
import FornecedorCrud from '../components/FornecedorCrud';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/sorvetes',
    component: SorveteCrud
  },
  {
    path: '/fornecedores',
    component: FornecedorCrud
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
