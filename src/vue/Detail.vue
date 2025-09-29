<template>
  <div class="page">
    <header class="header">
      <div class="header-left">
        <span class="logo">📄</span>
        <h1 class="title">Détail de l'article</h1>
      </div>
      <div class="header-actions">
        <button class="btn-secondary" @click="refresh" :disabled="loading">
          {{ loading ? 'Actualisation…' : 'Rafraîchir' }}
        </button>
        <button class="btn-primary" @click="logout">Se déconnecter</button>
      </div>
    </header>

    <main class="content">
      <div v-if="loading" class="state">
        <div class="spinner"></div>
        <p>Chargement…</p>
      </div>

      <p v-else-if="error" class="alert error">{{ error }}</p>

      <div v-else-if="article" class="article-detail">
        <div class="detail-layout">
          <img class="detail-img" :src="article.imgPath || placeholder" :alt="article.title" />
          <div class="detail-info">
            <h2>{{ article.title }}</h2>
            <p class="desc">{{ article.desc }}</p>
            <p class="author"><strong>Auteur :</strong> {{ article.author }}</p>
          </div>
        </div><br>

        <div class="back-container">
          <button class="btn-secondary back-btn" @click="goBack">⬅ Retour</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authHeader, clearToken } from '../services/auth'

const API_URL = 'http://localhost:3000'
const placeholder =
  'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">\
<rect width="100%" height="100%" fill="#eef2f7"/>\
<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="20">Aperçu</text></svg>'

const router = useRouter()
const route = useRoute()
const article = ref(null)
const loading = ref(false)
const error = ref('')

async function fetchArticle() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_URL}/articles/${route.params.id}`, {
      headers: { 'Content-Type': 'application/json', ...authHeader() }
    })
    const json = await res.json()
    if (json?.code === '200') {
      article.value = json.data
    } else {
      throw new Error(json?.message || 'Erreur lors de la récupération')
    }
  } catch (e) {
    error.value = e.message || 'Erreur réseau'
  } finally {
    loading.value = false
  }
}

function refresh() {
  fetchArticle()
}
function logout() {
  clearToken()
  router.replace('/login')
}
function goBack() {
  router.push('/accueil')
}

onMounted(fetchArticle)

import '../styles/detail.css'
</script>

