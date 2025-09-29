<template>
    <router-view />
</template>

<script setup>
import { computed } from 'vue'
import { clearToken, isAuthenticated } from './services/auth'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const authed = computed(() => isAuthenticated())

function logoutNow() {
  clearToken()
  router.replace('/login')
}
</script>
