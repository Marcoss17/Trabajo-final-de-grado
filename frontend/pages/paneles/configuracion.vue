<template>
  <div class="min-h-screen bg-black text-white flex items-start justify-center py-12 px-4">
    <div class="w-full max-w-2xl space-y-6 bg-gray-900 p-8 rounded-2xl shadow-lg">

      <div class="text-center">
        <h1 class="text-3xl font-bold mb-2 text-yellow-400">Panel de Configuración</h1>
        <p class="text-gray-300">Gestiona tu perfil, contraseña y preferencias.</p>
      </div>

      <div class="bg-gray-800 p-6 rounded-xl">
        <h2 class="text-lg font-semibold mb-4 text-yellow-300">Información del perfil</h2>
        <p class="mb-1"><strong>Nombre:</strong> {{ userStore.usuario?.nombre }}</p>
        <p class="mb-1"><strong>Correo:</strong> {{ userStore.usuario?.correo }}</p>
        <p class="mb-4"><strong>Registrado desde:</strong> {{ fechaFormateada }}</p>
        <RouterLink
          to="/paneles/configurar/cambiar-datos"
          class="text-yellow-400 underline hover:text-yellow-300 transition"
        >
          Editar nombre o correo
        </RouterLink>
      </div>

      <div class="bg-gray-800 p-6 rounded-xl">
        <h2 class="text-lg font-semibold mb-4 text-yellow-300">Contraseña</h2>
        <RouterLink
          to="/paneles/configurar/cambiar-password"
          class="text-yellow-400 underline hover:text-yellow-300 transition"
        >
          Cambiar contraseña
        </RouterLink>
      </div>

      <div class="bg-gray-800 p-6 rounded-xl">
        <h2 class="text-lg font-semibold mb-4 text-yellow-300">Foto de perfil</h2>

        <div class="flex items-center gap-4 flex-wrap">
          <img
            :src="fotoPerfilUrl"
            alt="Foto de perfil"
            class="w-24 h-24 rounded-full object-cover border-2 border-yellow-400"
          />

          <div class="flex flex-col gap-2">
            <input type="file" @change="onFileChange" accept="image/*" />
            <button
              @click="subirFoto"
              :disabled="!foto"
              class="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition disabled:opacity-50"
            >
              Cambiar foto
            </button>
            <button
              @click="eliminarFoto"
              :disabled="!userStore.usuario?.fotoPerfil"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
            >
              Eliminar foto
            </button>
          </div>
        </div>
      </div>
        <div class="bg-gray-800 p-6 rounded-xl">
            <h2 class="text-lg font-semibold mb-4 text-yellow-300">Eliminar cuenta</h2>
            <p class="mb-4 text-red-400">Esta acción es irreversible. Tu cuenta será eliminada permanentemente.</p>

            <input
              type="password"
              v-model="contraseñaConfirmacion"
              placeholder="Confirma tu contraseña"
              class="mb-4 px-4 py-2 w-full rounded bg-gray-700 text-white border border-gray-600"
            />

            <button
              @click="eliminarCuenta"
              :disabled="!contraseñaConfirmacion"
              class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
            >
              Eliminar cuenta
            </button>
          </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '~/stores/user'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const foto = ref(null)
const contraseñaConfirmacion = ref("")
const router = useRouter()
const toast = useToast()

const fechaFormateada = computed(() => {
  if (!userStore.usuario?.fechaRegistro) return ''
  return new Date(userStore.usuario.fechaRegistro).toLocaleDateString()
})

const fotoPerfilUrl = computed(() => {
  if (userStore.usuario?.fotoPerfil) {
    return `http://localhost:5000${userStore.usuario.fotoPerfil}`
  }
  return '/default-profile.svg'
})

const onFileChange = (e) => {
  foto.value = e.target.files[0]
}

const subirFoto = async () => {
  if (!foto.value) return
  try {
    await userStore.actualizarFotoPerfil(foto.value)
    toast.success('Foto de perfil actualizada')
    foto.value = null
  } catch (error) {
    toast.error('Error al subir la foto')
  }
}

const eliminarFoto = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/usuario/foto-perfil', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      toast.error(data.mensaje || 'Error al eliminar la foto de perfil')
      return
    }

    // Actualiza el store y UI
    userStore.usuario.fotoPerfil = null
    toast.success('Foto de perfil eliminada con éxito')
  } catch (error) {
    console.error(error)
    toast.error('Error inesperado al eliminar la foto')
  }
}

const eliminarCuenta = async () => {
  if (!contraseñaConfirmacion.value) {
    toast.error('Debes confirmar tu contraseña para eliminar la cuenta.');
    return;
  }

  // Toast personalizado de confirmación
  const toastId = toast(
    {
      render() {
        return h('div', [
          h('div', { style: 'margin-bottom: 12px;' }, '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'),
          h('div', { style: 'display: flex; gap: 16px; justify-content: center;' }, [
            h(
              'button',
              {
                style: 'background: none; color: white; border: none; border-radius: 0; padding: 0 12px; cursor: pointer; text-decoration: underline; font-weight: 600;',
                onClick: async () => {
                  toast.dismiss(toastId)
                  try {
                    const response = await fetch("http://localhost:5000/api/usuario", {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                      },
                      body: JSON.stringify({ contraseña: contraseñaConfirmacion.value })
                    });

                    const data = await response.json();

                    if (!response.ok) {
                      toast.error(data.mensaje || "Error al eliminar la cuenta.");
                      return;
                    }

                    localStorage.removeItem("token");
                    userStore.usuario = null;
                    toast.success("Cuenta eliminada con éxito.");
                    window.location.href = "/";
                  } catch (error) {
                    toast.error("Error inesperado al eliminar la cuenta.");
                  }
                }
              },
              'Sí'
            ),
            h(
              'button',
              {
                style: 'background: none; color: white; border: none; border-radius: 0; padding: 0 12px; cursor: pointer; text-decoration: underline; font-weight: 600;',
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
