<template>
  <div class="bg-negro min-h-screen text-dorado pt-16 flex flex-col min-h-screen">
    <Navbar />
    <NuxtPage />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
import { useUserStore } from '~/stores/user'

if (process.client) {
  const userStore = useUserStore()
  userStore.cargarDesdeLocalStorage()
}
</script>

<style scoped>
.bg-negro {
  background-color: #000;
}
.text-dorado {
  color: #d4af37;
}
</style>