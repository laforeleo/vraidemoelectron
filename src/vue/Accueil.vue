<template>
  <div class="page">
    <header class="header">
      <div class="header-left">
        <span class="logo">📰</span>
        <h1 class="title">Articles</h1>
        <button class="btn-add" @click="goAdd"> Ajouter un article</button>
      </div>
      <div class="header-actions">
        <button class="btn-secondary" @click="refresh" :disabled="loading">
          {{ loading ? 'Actualisation…' : 'Rafraîchir' }}
        </button>
        <button class="btn-primary" @click="logout">Se déconnecter</button>
      </div>
    </header>

    <main class="content">  
      <p v-if="apiMessage && !loading && !error" class="api-msg">
        {{ apiMessage }}
      </p>

      <div v-if="loading" class="state">
        <div class="spinner"></div>
        <p>Chargement des articles…</p>
      </div>

      <p v-else-if="error" class="alert error">{{ error }}</p>

      <div v-else-if="articles.length === 0" class="state">
        <p>Aucun article pour le moment.</p>
      </div>

      <ul v-else class="grid">
        <li v-for="a in articles" :key="a.id" class="card">
          <div class="media" @click="goDetail(a.id)">
            <img :src="a.imgPath || placeholder" :alt="a.title" />
          </div>
          <div class="card-content">
            <h2 class="card-title">{{ a.title }}</h2>
            <p class="card-desc">{{ a.desc }}</p>
            <div class="meta">
              <span class="badge">Auteur : {{ a.author }}</span>
            </div>
            <div class="card-actions">
              <button class="btn-edit" @click.stop="goEdit(a.id)">Modifier</button>
              <button class="btn-delete" @click.stop="askDelete(a.id)">Supprimer</button>
            </div>
          </div>
        </li>
      </ul>
    </main>
  </div>

  <div v-if="showDelete" class="lightbox">
  <div class="lightbox-content">
    <h3>Confirmation</h3>
    <p>Êtes-vous sûr de vouloir supprimer cet article ?</p>
    <div class="actions">
      <button class="btn-danger" @click="confirmDelete">Oui</button>
      <button class="btn-alt" @click="cancelDelete">Annuler</button>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authHeader, clearToken } from '../services/auth'

const API_URL = 'http://localhost:3000'
const placeholder =
  'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">\
<rect width="100%" height="100%" fill="#eef2f7"/>\
<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="20">Aperçu</text></svg>'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const apiMessage = ref('')
const articles = ref([])

async function fetchArticles() {
  loading.value = true
  error.value = ''
  apiMessage.value = ''
  try {
    const res = await fetch(`${API_URL}/articles`, {
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    })
    const json = await res.json()
    if (json?.code === '200') {
      articles.value = json.data
    } else {
      throw new Error(json?.message || 'Erreur de récupération')
    }
  } catch (e) {
    error.value = e.message || 'Erreur réseau'
    articles.value = []
  } finally {
    loading.value = false
  }
}

const showDelete = ref(false)
const deleteId = ref(null)

function askDelete(id) {
  deleteId.value = id
  showDelete.value = true
}

function cancelDelete() {
  const box = document.querySelector('.lightbox')
  if (box) {
    box.classList.add('closing')
    setTimeout(() => {
      deleteId.value = null
      showDelete.value = false
    }, 250)
  } else {
    deleteId.value = null
    showDelete.value = false
  }
}


async function confirmDelete() {
  if (!deleteId.value) return
  try {
    const res = await fetch(`${API_URL}/articles/${deleteId.value}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    })
    const json = await res.json()
    if (json?.code === '200') {
      apiMessage.value = 'Article supprimé avec succès'
      fetchArticles()
    } else {
      throw new Error(json?.message || 'Erreur lors de la suppression')
    }
  } catch (e) {
    error.value = e.message || 'Erreur réseau'
  } finally {
    cancelDelete()
  }
}

function refresh() {
  fetchArticles()
}
function logout() {
  clearToken()
  router.replace('/login')
}

function goDetail(id) {
  router.push(`/articles/${id}`)
}

function goEdit(id) {
  router.push(`/articles/${id}/edit`)
}

function goAdd() {
  router.push('/articles/add')
}

onMounted(fetchArticles)

import '../styles/accueil.css'
</script>