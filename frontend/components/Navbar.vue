<template>
  <nav class="bg-black px-10 py-4 flex justify-between items-center fixed top-0 w-full z-50 text-white">
    <NuxtLink to="/">
      <img src="/public/logo-header.PNG" alt="Logo PlataformaEntrenamiento" class="h-20 w-auto" />
    </NuxtLink>

    <div class="hidden md:flex space-x-10 items-center relative">
      <NuxtLink to="/" class="hover:text-yellow-400 text-xl font-semibold">Inicio</NuxtLink>
      <NuxtLink to="/planes" class="hover:text-yellow-400 text-xl font-semibold">Planes</NuxtLink>

      <NuxtLink
        v-if="!userStore.isLoggedIn"
        to="/auth/login"
        class="hover:text-yellow-400 text-xl font-semibold"
      >
        Iniciar Sesión
      </NuxtLink>

      <NuxtLink
        v-if="userStore.isLoggedIn"
        to="/dashboard"
        class="hover:underline font-semibold text-yellow-500 text-xl"
      >
        Dashboard
      </NuxtLink>

      <!-- FOTO DE PERFIL CON MENÚ -->
      <div v-if="userStore.isLoggedIn" class="relative">
  <img
    :src="fotoPerfilUrl"
    alt="Foto de perfil"
    class="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-yellow-400"
    @click="toggleMenu"
  />
  <div
    v-if="menuAbierto"
    class="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50"
    @click.stop
  >
    <NuxtLink
      to="/paneles/configuracion"
      class="block px-4 py-2 hover:bg-yellow-100"
      @click="cerrarMenu"
    >
      Editar perfil
    </NuxtLink>
    <button
      @click="handleLogout"
      class="block w-full text-left px-4 py-2 hover:bg-yellow-100"
    >
      Cerrar sesión
    </button>
  </div>
</div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

const userStore = useUserStore()
const router = useRouter()
const menuAbierto = ref(false)

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value
}

const cerrarMenu = () => {
  menuAbierto.value = false
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
  cerrarMenu()
}

const fotoPerfilUrl = computed(() => {
  if (userStore.usuario?.fotoPerfil) {
    return `http://localhost:5000${userStore.usuario.fotoPerfil}`
  }
  return '/default-profile.svg' // Imagen por defecto desde /public
})

// Cerrar el menú si se hace clic fuera
onMounted(() => {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      menuAbierto.value = false
    }
  })
})
</script>

<style scoped>
/* Opcionalmente puedes mover estilos personalizados aquí */
</style>
