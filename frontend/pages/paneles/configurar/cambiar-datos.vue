<template>
  <div class="min-h-screen flex items-center justify-center bg-black p-4">
    <form @submit.prevent="actualizarPerfil" class="p-8 rounded-md max-w-md w-full" style="background-color: #FFD700;">
      <h2 class="text-black text-2xl font-bold mb-6 text-center">Editar perfil</h2>

      <div class="mb-6">
        <label for="nombre" class="block mb-2 text-black font-semibold">Nombre</label>
        <input
          id="nombre"
          v-model="nombre"
          type="text"
          placeholder="Introduce tu nombre"
          class="w-full border-b-2 border-black bg-transparent text-gray-600 placeholder-gray-400 py-2 focus:outline-none focus:text-gray-900"
          required
        />
      </div>

      <div class="mb-6">
        <label for="correo" class="block mb-2 text-black font-semibold">Correo electrónico</label>
        <input
          id="correo"
          v-model="correo"
          type="email"
          placeholder="Introduce tu correo"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const router = useRouter()
const toast = useToast()

const nombre = ref('')
const correo = ref('')

onMounted(() => {
  if (userStore.usuario) {
    nombre.value = userStore.usuario.nombre
    correo.value = userStore.usuario.correo
  }
})

const actualizarPerfil = async () => {
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!correoValido.test(correo.value)) {
    toast.error('Correo inválido. Asegúrate de que tenga formato válido (ejemplo@dominio.com)')
    return
  }

  try {
    const response = await $fetch('http://localhost:5000/api/usuario/editar-perfil', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
      body: {
        nombre: nombre.value,
        correo: correo.value,
      },
    })

    userStore.setUsuario(response.usuario)
     toast.success('Perfil actualizado correctamente.')
    router.push('/paneles/configuracion')
  } catch (error) {
    console.error(error)
    toast.error(error.data?.mensaje || 'Error al actualizar el perfil.')
  }
}
</script>
