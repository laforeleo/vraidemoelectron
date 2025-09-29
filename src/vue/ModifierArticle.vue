<template>
  <div class="page">
   <header class="header">
      <div class="header-left">
        <span class="logo">📰</span>
        <h1 class="title">Articles</h1>
      </div>
      <div class="header-actions">
        <button class="btn-secondary" @click="refresh" :disabled="loading">
          {{ loading ? 'Actualisation…' : 'Rafraîchir' }}
        </button>
        <button class="btn-primary" @click="logout">Se déconnecter</button>
      </div>
    </header>

    <main class="content">
      <h1 class="page-title">Modifier l’article</h1>

      <section class="form-wrap" v-if="loaded">
        <form @submit.prevent="updateArticle" class="form">
          <div class="field">
            <label for="title">Titre</label>
            <input id="title" v-model="title" type="text" required />
          </div>

          <div class="field">
            <label for="desc">Description</label>
            <textarea id="desc" v-model="desc" required></textarea>
          </div>

          <div class="field">
            <label for="author">Auteur</label>
            <input id="author" v-model="author" type="text" required />
          </div>

          <div class="actions">
            <button type="submit" class="btn" :disabled="loading">
              {{ loading ? 'Mise à jour…' : 'Enregistrer' }}
            </button>
            <button type="button" class="btn-alt" @click="goBack">
              Annuler
            </button>
          </div>

          <p v-if="error" class="alert error">{{ error }}</p>
          <p v-if="success" class="alert success">{{ success }}</p>
        </form>
      </section>

      <p v-else class="state">Chargement…</p>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authHeader, clearToken } from '../services/auth'

const API_URL = 'http://localhost:3000'
const route = useRoute()
const router = useRouter()

const id = route.params.id
const title = ref('')
const desc = ref('')
const author = ref('')
const imgPath = ref('')
const loading = ref(false)
const loaded = ref(false)
const error = ref('')
const success = ref('')

async function fetchArticle() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_URL}/articles/${id}`, {
      headers: { 'Content-Type': 'application/json', ...authHeader() },
    })
    const json = await res.json()
    if (json?.code === '200') {
      const art = json.data
      title.value = art.title
      desc.value = art.desc
      author.value = art.author
      imgPath.value = art.imgPath
      loaded.value = true
    } else {
      throw new Error(json?.message || 'Erreur de récupération')
    }
  } catch (e) {
    error.value = e.message || 'Erreur réseau'
  } finally {
    loading.value = false
  }
}

async function updateArticle() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/articles/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({
        id,
        title: title.value,
        desc: desc.value,
        author: author.value,
      }),
    })

    const json = await res.json()
    if (json?.code === '200') {
      success.value = json.message || 'Article modifié avec succès'
      setTimeout(() => router.push('/accueil'), 1000)
    } else {
      throw new Error(json?.message || 'Erreur lors de la mise à jour')
    }
  } catch (e) {
    error.value = e.message || 'Erreur réseau'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}
function logout() {
  clearToken()
  router.replace('/login')
}
function refresh() {
  fetchArticle()
}

onMounted(fetchArticle)
import '../styles/modifierarticle.css'
</script>
