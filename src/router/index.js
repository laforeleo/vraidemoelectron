import { createRouter, createWebHashHistory } from 'vue-router';
import Accueil from "../vue/Accueil.vue";
import Login from "../vue/Login.vue";
import Detail from "../vue/Detail.vue";
import Inscription from "../vue/Inscription.vue";
import ModifierArticle from "../vue/ModifierArticle.vue";
import AjouterArticle from "../vue/AjouterArticle.vue";
import { isAuthenticated } from "../services/auth.js";

const routes = [
    { path: '/login', name: 'Login', component: Login, meta: { public: true } },
    { path: '/accueil', name: 'Accueil', component: Accueil, meta: { requiresAuth: true } },
    { path: '/articles/:id', name: 'Detail', component: Detail, meta: { requiresAuth: true } },
    { path: '/articles/:id/edit', name: 'ModifierArticle', component: ModifierArticle },
    { path: '/inscription', name: 'Inscription', component: Inscription, meta: { public: true } },
    { path: '/articles/add', name: 'AjouterArticle', component: AjouterArticle, meta: { public: true } },
    { path: '/', redirect: '/login' }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to) => {
    if (to.meta.public) return true;
    if (to.meta.requiresAuth && !isAuthenticated()) {
        return { name: 'Login', query: { redirect: to.fullPath } };
    }
    return true;
});

export default router;
