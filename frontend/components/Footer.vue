<template>
  <footer class="bg-black text-yellow-400 text-center py-6 mt-auto border-t border-yellow-900">
    <div class="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
      <div>
        © {{ new Date().getFullYear() }} PlataformaEntrenamiento. Todos los derechos reservados.
      </div>
      <div class="flex gap-4 text-sm">
        <NuxtLink to="/" class="hover:underline">Inicio</NuxtLink>
        <NuxtLink to="/planes" class="hover:underline">Planes</NuxtLink>
        <NuxtLink to="/contacto" class="hover:underline">Contacto</NuxtLink>
      </div>
    </div>
  </footer>
</template>
<script setup>
</script>