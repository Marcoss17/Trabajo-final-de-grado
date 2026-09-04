<template>
  <div class="min-h-screen bg-blackgray-900 text-white p-8 max-w-4xl mx-auto pt-24">
    <h1 class="text-4xl font-bold mb-8 text-yellow-400 text-center">Tus Rutinas</h1>

    <div class=" text-yellow-300 rounded-lg p-4 mb-8 shadow-md border border-yellow-400">
      <p class="text-sm md:text-base text-center font-medium">
        🗓️ <strong>Recomendación:</strong> Te sugerimos realizar <strong>una rutina diferente cada día</strong>, siguiendo el orden indicado. 
        Al completar todas, <strong>descansa un día</strong> para una mejor recuperación. 
        ¡Es la forma más efectiva y segura de progresar como futbolista! ⚽
      </p>
    </div>

    <div v-if="plan.value?.rutinas.length === 0" class="text-center text-xl">
      No tienes rutinas disponibles con tu plan actual.
    </div>

    <div v-else>
      <div
        v-for="rutina in rutinasPlan"
        :key="rutina.slug"
        class="bg-yellow-400 text-gray-900 p-6 rounded-xl shadow-md mb-6 flex justify-between items-center"
      >
        <div>
          <h2 class="text-2xl font-bold mb-2">{{ rutina.nombre }}</h2>
          <p>{{ rutina.descripcion }}</p>
        </div>
        <div class="flex flex-col gap-2">
          <button
            v-if="rutinasActivas.includes(rutina.slug)"
            disabled
            class="bg-black text-yellow-400 font-semibold py-2 px-4 rounded hover:bg-gray-900 transition"
          >
            Seleccionada
          </button>
          <button
            v-else
            @click="seleccionarRutina(rutina.slug)"
            class="bg-black text-yellow-400 font-semibold py-2 px-4 rounded hover:bg-gray-900 transition"
          >
            Seleccionar
          </button>
          <RouterLink
            :to="`/paneles/${rutina.slug}`"
            class="underline hover:text-yellow-300 text-sm text-right"
          >
            Ver más
          </RouterLink>
          <button
            v-if="rutinasActivas.includes(rutina.slug)"
            @click="eliminarRutina(rutina.slug)"
            class="bg-black text-yellow-400 font-semibold py-2 px-4 rounded hover:bg-gray-900 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '~/stores/user'
import planes from '~/data/planes.json'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const rutinasActivas = ref([])
const toast = useToast()

const plan = computed(() => planes.find(p => p.id === Number(userStore.planId)))
const rutinasPlan = computed(() => plan.value?.rutinas || [])

async function cargarRutinasUsuario() {
  try {
    const res = await fetch(`http://localhost:5000/api/usuario/rutinas/${userStore.usuario.id}`);
    const data = await res.json();
    rutinasActivas.value = data.rutinas || [];
  } catch (error) {
    console.error('Error cargando rutinas del usuario:', error);
    toast.error('Error cargando rutinas del usuario');
  }
}

async function seleccionarRutina(slug) {
  try {
    const payload = {
      userId: userStore.usuario.id,
      correo: userStore.usuario.correo,
      rutinaSlug: slug,
    }

    console.log('Enviando datos al backend:', payload)

    const response = await fetch('http://localhost:5000/api/usuario/rutinas/rutinas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.mensaje || 'Error al seleccionar la rutina');
    }

    toast.success(data.mensaje || 'Rutina seleccionada con éxito!');
    await cargarRutinasUsuario();
  } catch (error) {
    toast.error(error.message);
  }
}

async function eliminarRutina(slug) {
  const userId = userStore.usuario?.id
  if (!userId) {
    toast.error('No hay usuario autenticado');
    return;
  }

  toast(
    {
      render() {
        return h('div', [
          h('div', { style: 'margin-bottom: 12px;' }, `¿Seguro que quieres eliminar la rutina "${slug}"?`),
          h('div', { style: 'display: flex; gap: 16px; justify-content: center;' }, [
            h(
              'button',
              {
                style: 'background: none; color: white; border: none; border-radius: 0; padding: 0 12px; cursor: pointer; text-decoration: underline; font-weight: 600;',
                onClick: async () => {
                  try {
                    const response = await fetch(
                      `http://localhost:5000/api/usuario/rutinas/${userId}/${slug}`,
                      {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId }), // Asegura que el userId se envía en el body si tu backend lo requiere
                      }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                      toast.error(data.mensaje || 'Error al eliminar la rutina');
                      return;
                    }

                    toast.success(data.mensaje || 'Rutina eliminada con éxito!');
                    await cargarRutinasUsuario();
                  } catch (error) {
                    toast.error(error.message);
                  }
                  toast.clear();
                }
              },
              'Sí'
            ),
            h(
              'button',
              {
                style: 'background: none; color: white; border: none; border-radius: 0; padding: 0 12px; cursor: pointer; text-decoration: underline; font-weight: 600;',
                onClick: () => toast.clear()
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

onMounted(() => {
  console.log('Usuario en store al montar componente:', userStore.usuario)
  cargarRutinasUsuario();
});
</script>
