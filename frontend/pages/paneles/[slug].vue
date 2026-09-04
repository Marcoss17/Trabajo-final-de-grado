<template>
  <div class="min-h-screen bg-black text-yellow-400 p-8">
    <div class="max-w-3xl mx-auto mt-20">
      <h1 class="text-4xl font-bold mb-4">{{ rutina?.nombre }}</h1>
      <p class="mb-6">{{ rutina?.descripcion }}</p>

      <h2 class="text-2xl font-semibold mb-2">Ejercicios:</h2>
      <ul class="list-disc pl-6">
  <li
    v-for="(ejercicio, i) in rutina?.detalles?.ejercicios || []"
    :key="i"
  >
    <template v-if="ejercicio.videoUrl">
      <a
        :href="ejercicio.videoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="underline hover:text-yellow-500"
      >
        {{ ejercicio.nombre }}
      </a>
    </template>
    <template v-else>
      {{ ejercicio.nombre }}
    </template>
    - {{ ejercicio.series }} series x {{ ejercicio.repeticiones }} repeticiones
  </li>
</ul>


      <div class="mt-8">
        <NuxtLink to="/paneles/rutinas" class="underline hover:text-yellow-500">← Volver a rutinas</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import planes from '~/data/planes.json'

const route = useRoute()
const slug = route.params.slug

let rutina = null

for (const plan of planes) {
  const r = plan.rutinas?.find((rutina) => rutina.slug === slug)
  if (r) {
    rutina = r
    break
  }
}
</script>
