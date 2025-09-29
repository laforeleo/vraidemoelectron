<template>
  <ul uk-tab>
    <li class="uk-active">
      <router-link to="/page-1">page One</router-link>
    </li>
    <li>
      <router-link to="/page-2">page Two</router-link>
    </li>
  </ul>

  <router-view/>
</template>
<script setup lang="ts">
</script>
