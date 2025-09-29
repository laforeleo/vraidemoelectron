<template>
  <main class="login-shell">
    <section class="login-card" role="form" aria-labelledby="login-title">
      <header class="login-header">
        <div class="login-brand-circle" aria-hidden="true">🔒</div>
        <h1 id="login-title">Connexion</h1>
      </header>

      <form @submit.prevent="onSubmit" class="login-form">
        <div class="login-field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model.trim="email"
            type="email"
            autocomplete="email"
            required
            placeholder="email@domaine.com"
          />
        </div>

        <div class="login-field">
          <label for="password">Mot de passe</label>
          <div class="login-password-wrap">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              autocomplete="current-password"
              required
              placeholder="Votre mot de passe"
            />
            <button type="button" class="login-toggle-icon" @click="showPassword = !showPassword" aria-label="Afficher/masquer le mot de passe">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" width="22" height="22" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7
                     -1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" width="22" height="22" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7
                     a9.97 9.97 0 012.496-4.338M6.223 6.223A9.956 9.956 0 0112 5
                     c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.338 5.223M15 12a3 3 0 11-6 0
                     3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3l18 18" />
              </svg>
            </button>
          </div>
        </div>

        <button :disabled="loading" type="submit" class="login-btn">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>

        <button type="button" class="login-btn-alt" @click="goRegister">
          Inscription
        </button>

        <p v-if="error" class="login-alert login-error">{{ error }}</p>
        <p v-if="success" class="login-alert login-success">{{ success }}</p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '../services/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)

async function onSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true
  const { ok, message } = await login(email.value, password.value)
  loading.value = false
  if (ok) {
    setTimeout(() => router.replace('/accueil'), 100)
  } else {
    error.value = message || 'Identifiants invalides'
  }
}

function goRegister() {
  router.push('/inscription')
}
import '../styles/login.css'
</script>