<template>
  <div class="min-h-screen bg-black text-white p-8 pt-24">
    <!-- Encabezado -->
    <h1 class="text-4xl font-bold text-center mb-12 text-yellow-400">Planes Disponibles</h1>

    <p class="max-w-3xl mx-auto mb-8 text-center text-lg">
      Elige el plan que mejor se adapte a tus necesidades y comienza a transformar tu cuerpo y mente. 
      Nuestros planes están diseñados para ayudarte a alcanzar tus objetivos de forma efectiva y sostenible.
    </p>

    <!-- Beneficios del servicio -->
    <div class="max-w-5xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
      <div class="bg-yellow-400 text-gray-900 rounded-xl p-6 shadow-lg">
        <h3 class="font-bold text-xl mb-2">Soporte Personalizado</h3>
        <p>Accede a asesoramiento y seguimiento para maximizar tus resultados.</p>
      </div>
      <div class="bg-yellow-400 text-gray-900 rounded-xl p-6 shadow-lg">
        <h3 class="font-bold text-xl mb-2">Entrenamientos Adaptados</h3>
        <p>Programas creados según tu nivel, tiempo y objetivos.</p>
      </div>
      <div class="bg-yellow-400 text-gray-900 rounded-xl p-6 shadow-lg">
        <h3 class="font-bold text-xl mb-2">Seguimiento y Progreso</h3>
        <p>Monitorea tu evolución y ajusta tus rutinas para seguir avanzando.</p>
      </div>
    </div>

    <!-- Planes dinámicos -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div
        v-for="plan in planes"
        :key="plan.id"
        class="rounded-2xl shadow-lg p-6 bg-yellow-400 text-gray-900 flex flex-col justify-between hover:scale-105 transition-transform duration-300"
      >
        <div>
          <h2 class="text-2xl font-bold mb-2">{{ plan.nombre }}</h2>
          <p class="text-xl font-semibold mb-4">Precio: {{ plan.precio }}€/mes</p>
          <ul class="mb-4 list-disc list-inside space-y-1">
            <li v-for="(feature, index) in plan.caracteristicas" :key="index">{{ feature }}</li>
          </ul>
        </div>
        <div class="flex flex-col gap-2 mt-auto">
          <button
            @click="seleccionarPlan(plan.id)"
            class="bg-black text-yellow-400 font-semibold px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Seleccionar
          </button>
          <NuxtLink
            :to="`/plan/${plan.slug}`"
            class="text-center underline hover:text-yellow-600 transition"
          >
            Ver más detalles
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Información adicional -->
    <section class="mt-20 max-w-4xl mx-auto text-center text-lg">
      <h2 class="text-3xl font-bold text-yellow-400 mb-4">¿Qué incluye tu suscripción?</h2>
      <p class="mb-4">
        Todos nuestros planes incluyen acceso completo a la plataforma, estadísticas de progreso, 
        rutinas detalladas, y soporte constante por parte de nuestro equipo profesional.
      </p>
      <p class="mb-4">
        Además, podrás cambiar de plan en cualquier momento según tu evolución o tus nuevas metas.
      </p>
      <p class="italic text-yellow-300">
        Tu salud y bienestar es nuestra prioridad. ¡Elige el plan que se alinea con tu estilo de vida!
      </p>
    </section>

    <!-- CTA final -->
    <p class="mt-20 text-center text-lg font-medium">
      ¿Listo para comenzar tu transformación? Selecciona un plan y únete a nuestra comunidad fitness.
    </p>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
import planes from '~/data/planes.json'
import { useToast } from 'vue-toastification'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

async function seleccionarPlan(planId) {
  if (!userStore.isLoggedIn) {
    router.push('/auth/login')
    return
  }

  if (userStore.planId && userStore.planId !== planId) {
    toast.error('Ya tienes un plan seleccionado. No puedes cambiar a otro plan.')
    return
  }

  try {
    await $fetch('http://localhost:5000/api/usuario/plan', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userStore.token}` },
      body: { planId },
    })

    userStore.setPlan(planId)
    toast.success('Plan seleccionado correctamente')
    router.push('/dashboard')
  } catch (error) {
    toast.error(error?.data?.mensaje || 'Hubo un error al seleccionar el plan.')
  }
}
</script>
