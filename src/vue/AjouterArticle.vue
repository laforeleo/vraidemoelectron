<template>
  <div class="page">
    <!-- Header identique aux autres vues -->
    <header class="header">
      <div class="header-left">
        <span class="logo">📰</span>
        <h1 class="title">Articles</h1>
      </div>
      <div class="header-actions">
        <button class="btn-secondary" @click="refresh" :disabled="loading">Rafraîchir</button>
        <button class="btn-primary" @click="logout">Se déconnecter</button>
      </div>
    </header>

    <main class="content">
      <!-- Titre page -->
      <h1 class="page-title">Ajouter un article</h1>

      <section class="form-wrap">
        <form @submit.prevent="createArticle" class="form">
          <div class="field">
            <label for="title">Titre</label>
            <input id="title" v-model="title" type="text" required />
          </div>

          <div class="field">
            <label for="desc">Description</label>
            <input id="desc" v-model="desc" type="text" required />
          </div>

          <div class="field">
            <label for="author">Auteur</label>
            <input id="author" v-model="author" type="text" required />
          </div>

          <div class="field">
            <label for="imgPath">Image (URL)</label>
            <input id="imgPath" v-model="imgPath" type="text" required />
          </div>

          <div class="actions">
            <button type="submit" class="btn" :disabled="loading">
              {{ loading ? 'Création…' : 'Ajouter' }}
            </button>
            <button type="button" class="btn-alt" @click="goBack">
              Annuler
            </button>
          </div>

          <p v-if="error" class="alert error">{{ error }}</p>
          <p v-if="success" class="alert success">{{ success }}</p>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authHeader, clearToken } from '../services/auth'

const API_URL = 'http://localhost:3000'
const router = useRouter()

const title = ref('')
const desc = ref('')
const author = ref('')
const imgPath = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

function refresh() {
  // on “rafraîchit” le formulaire : reset des champs et messages
  title.value = ''
  desc.value = ''
  author.value = ''
  imgPath.value = ''
  error.value = ''
  success.value = ''
}

async function createArticle() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/articles/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({
        title: title.value,
        desc: desc.value,
        author: author.value,
        imgPath: imgPath.value,
      }),
    })
    const json = await res.json()
    if (json?.code === '200') {
      success.value = 'Article ajouté avec succès'
      setTimeout(() => router.push('/accueil'), 700)
    } else {
      throw new Error(json?.message || 'Erreur lors de la création')
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

import '../styles/ajouterarticle.css'

</script>