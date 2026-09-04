<template>
  <div class="min-h-screen bg-black text-white p-8">
    <div class="text-center mt-24">
      <h1 class="text-4xl font-bold mb-4 text-yellow-400">Dashboard</h1>

      <div v-if="!planSeleccionado">
        <p class="text-xl mb-4">No tienes un plan contratado aún.</p>
        <RouterLink
          to="/planes"
          class="text-yellow-400 underline hover:text-yellow-300 transition"
        >
          Ver planes disponibles
        </RouterLink>
      </div>

      <div v-else>
        <p class="text-xl mb-4">
          Plan contratado: <span class="font-semibold">{{ planSeleccionado.nombre }}</span>
        </p>

        <!-- Botón para eliminar plan -->
        <button
          @click="eliminarPlan"
          class="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition mt-4"
        >
          Eliminar plan
        </button>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 max-w-5xl mx-auto">
          <RouterLink to="/paneles/rutinas" class="bg-yellow-400 text-gray-900 p-6 rounded-xl shadow-md hover:scale-105 transition">
            <h2 class="text-xl font-bold mb-2">Rutinas</h2>
            <p>Consulta y gestiona tus rutinas de entrenamiento.</p>
          </RouterLink>

          <RouterLink to="/paneles/progreso" class="bg-yellow-400 text-gray-900 p-6 rounded-xl shadow-md hover:scale-105 transition">
            <h2 class="text-xl font-bold mb-2">Progreso</h2>
            <p>Revisa tu evolución y estadísticas.</p>
          </RouterLink>

          <RouterLink to="/paneles/configuracion" class="bg-yellow-400 text-gray-900 p-6 rounded-xl shadow-md hover:scale-105 transition">
            <h2 class="text-xl font-bold mb-2">Configuración</h2>
            <p>Modifica tus datos personales o preferencias.</p>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useUserStore } from '~/stores/user'
import planes from '~/data/planes.json'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const toast = useToast()

const planSeleccionado = computed(() =>
  planes.find((p) => String(p.id) === String(userStore.planId))
)

async function eliminarPlan() {
  // Toast personalizado con botones Sí y No
  const toastId = toast(
    {
      render() {
        return h('div', [
          h('div', { style: 'margin-bottom: 12px;' }, '¿Estás seguro de que deseas eliminar tu plan actual?'),
          h('div', { style: 'display: flex; gap: 8px; justify-content: center;' }, [
            h(
              'button',
              {
                style: 'background: #FFA500; color: white; border: none; border-radius: 4px; padding: 6px 16px; cursor: pointer; text-decoration: underline;',
                onClick: async () => {
                  toast.dismiss(toastId)
                  try {
                    const response = await fetch('http://localhost:5000/api/usuario/plan', {
                      method: 'DELETE',
                      headers: {
                        Authorization: `Bearer ${userStore.token}`
                      }
                    })
                    const data = await response.json()
                    if (!response.ok) {
                      toast.error(data.mensaje || 'Error al eliminar el plan')
                      throw new Error(data.mensaje || 'Error al eliminar el plan')
                    }
                    toast.success(data.mensaje || 'Plan eliminado con éxito')
                    userStore.planId = null
                  } catch (error) {
                    toast.error(error.message)
                  }
                }
              },
              'Sí'
            ),
            h(
              'button',
              {
                style: 'background: #FFA500; color: white; border: none; border-radius: 4px; padding: 6px 16px; cursor: pointer; text-decoration: underline;',
                onClick: () => toast.dismiss(toastId)
              },
              'No'
            )
          ])
        ])
      }
    },
    {
      timeout: false,
      closeOnClick: false,
      draggable: false,
      position: 'top-center'
    }
  )
}
</script>