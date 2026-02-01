<template>
  <v-app>
    <v-main>
      <Header></Header>
      <router-view v-slot="{ Component }">
        <component :is="Component" :key="route" />
      </router-view>
    </v-main>
  </v-app>
  <Footer></Footer>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

import router from './router';

const route = router.currentRoute
</script>