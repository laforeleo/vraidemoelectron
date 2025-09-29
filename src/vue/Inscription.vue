<template>
  <main class="auth-shell">
    <section class="auth-card" role="form" aria-labelledby="register-title">
      <header class="auth-header">
        <div class="brand-circle" aria-hidden="true">📝</div>
        <h1 id="register-title">Inscription</h1>
      </header>

      <form @submit.prevent="onSubmit" class="form">
        <div class="field">
          <label for="pseudo">Pseudo</label>
          <input id="pseudo" v-model="pseudo" type="text" required placeholder="Votre pseudo" />
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input id="email" v-model.trim="email" type="email" autocomplete="email" required placeholder="email@domaine.com" />
        </div>

       <div class="login-field">
        <label for="password">Mot de passe</label>
            <div class="login-password-wrap">
                <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                required
                placeholder="Votre mot de passe"
                />
                <span class="toggle-icon" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" width="22" height="22">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7
                        -1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" width="22" height="22">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7
                        a9.97 9.97 0 012.496-4.338M6.223 6.223A9.956 9.956 0 0112 5
                        c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.338 5.223M15 12a3 3 0 11-6 0
                        3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3l18 18" />
                </svg>
                </span>
            </div>
        </div>

    
        <div class="login-field">
            <label for="passwordConfirm">Confirmer le mot de passe</label>
            <div class="login-password-wrap">
                <input
                id="passwordConfirm"
                :type="showPasswordConfirm ? 'text' : 'password'"
                v-model="passwordConfirm"
                required
                placeholder="Confirmez votre mot de passe"
                />
                <span class="toggle-icon" @click="showPasswordConfirm = !showPasswordConfirm">
                <svg v-if="!showPasswordConfirm" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" width="22" height="22">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7
                        -1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" width="22" height="22">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7
                        a9.97 9.97 0 012.496-4.338M6.223 6.223A9.956 9.956 0 0112 5
                        c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.338 5.223M15 12a3 3 0 11-6 0
                        3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 3l18 18" />
                </svg>
                </span>
            </div>
        </div>

        <div class="field">
          <label for="city">Ville</label>
          <input id="city" v-model="city" type="text" required placeholder="Votre ville" />
        </div>

        <div class="field">
          <label for="cityCode">Code postal</label>
          <input id="cityCode" v-model="cityCode" type="text" required placeholder="44000" />
        </div>

        <div class="field">
          <label for="phone">Téléphone</label>
          <input id="phone" v-model="phone" type="tel" required placeholder="0612345678" />
        </div>

        <button :disabled="loading" type="submit" class="btn">
          {{ loading ? 'Inscription...' : "S'inscrire" }}
        </button>

        <button type="button" class="btn-alt" @click="goLogin">
          Retour à la connexion
        </button>

        <p v-if="error" class="alert error">{{ error }}</p>
        <p v-if="success" class="alert success">{{ success }}</p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const API_URL = 'http://localhost:3000'

const router = useRouter()
const pseudo = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const city = ref('')
const cityCode = ref('')
const phone = ref('')
const showPassword = ref(false)
const showPasswordConfirm = ref(false)

const loading = ref(false)
const error = ref('')
const success = ref('')

async function onSubmit() {
  error.value = ''
  success.value = ''

  if (password.value !== passwordConfirm.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true
  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value,
        pseudo: pseudo.value,
        cityCode: cityCode.value,
        city: city.value,
        phone: phone.value,
      }),
    })

    const json = await res.json()
    if (json?.code === '200') {
      success.value = json.message || 'Inscription réussie'
      setTimeout(() => router.replace('/login'), 1200)
    } else {
      throw new Error(json?.message || 'Erreur lors de l’inscription')
    }
  } catch (e) {
    error.value = e.message || 'Erreur réseau'
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push('/login')
}
import '../styles/inscription.css'
</script>