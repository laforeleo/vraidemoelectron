<template>
  <h1>Page 1</h1>

  <button class="uk-button uk-button-primary" @click="callAPI">Appeler l'api</button>

  <div v-for="movie in movies" :key="movie.title">
    {{ movie.title }}
  </div>
</template>

<script setup>
import {ref} from 'vue';
const movies = ref([]);

async function callAPI() {
  const res = await fetch('https://raw.githubusercontent.com/Chocolaterie/EniWebService/main/api/movies.json');

  const data = await res.json();

  movies.value = data;
}
</script>