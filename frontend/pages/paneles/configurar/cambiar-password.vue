<template>
  <div class="min-h-screen flex items-center justify-center bg-black p-4">
    <form @submit.prevent="cambiarPassword" class="p-8 rounded-md max-w-md w-full" style="background-color: #FFD700;">
      <h2 class="text-black text-2xl font-bold mb-6 text-center">Cambiar contraseña</h2>

      <div class="mb-6">
        <label for="actual" class="block mb-2 text-black font-semibold">Contraseña actual</label>
        <input
          id="actual"
          v-model="actual"
          type="password"
          placeholder="Introduce tu contraseña actual"
          class="w-full border-b-2 border-black bg-transparent text-gray-600 placeholder-gray-400 py-2 focus:outline-none focus:text-gray-900"
          required
        />
      </div>

      <div class="mb-6">
        <label for="nueva" class="block mb-2 text-black font-semibold">Nueva contraseña</label>
        <input
          id="nueva"
          v-model="nueva"
          type="password"
          placeholder="Introduce tu nueva contraseña"
          class="w-full border-b-2 border-black bg-transparent text-gray-600 placeholder-gray-400 py-2 focus:outline-none focus:text-gray-900"
          required
        />
      </div>

      <div class="mb-6">
        <label for="confirmar" class="block mb-2 text-black font-semibold">Confirmar nueva contraseña</label>
        <input
          id="confirmar"
          v-model="confirmar"
          type="password"
          placeholder="Confirma tu nueva contraseña"
          class="w-full border-b-2 border-black bg-transparent text-gray-600 placeholder-gray-400 py-2 focus:outline-none focus:text-gray-900"
          required
        />
      </div>

      <button type="submit" class="w-full bg-black text-yellow-400 font-semibold py-2 rounded hover:bg-gray-900 transition">
        Guardar cambios
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '~/stores/user'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const router = useRouter()
const toast = useToast()

const actual = ref('')
const nueva = ref('')
const confirmar = ref('')

const cambiarPassword = async () => {
  if (nueva.value !== confirmar.value) {
    toast.error('Las contraseñas no coinciden.')
    return
  }

  try {
    await $fetch('http://localhost:5000/api/usuario/cambiar-password', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
      body: {
        actual: actual.value,
        nueva: nueva.value,
      },
    })

    toast.success('Contraseña actualizada correctamente.')

    // Limpiar campos
    actual.value = ''
    nueva.value = ''
    confirmar.value = ''

    // Redirigir a configuración
    router.push('/paneles/configuracion')
  } catch (error) {
    console.error(error)
    toast.error(error.data?.mensaje || 'Error al cambiar la contraseña')
  }
}
</script>

