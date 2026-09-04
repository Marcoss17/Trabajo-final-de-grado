<template>
  <div class="max-w-4xl mx-auto p-8 text-white min-h-screen bg-blackgray-900 pt-24">
    <h1 class="text-4xl font-bold mb-6 text-yellow-400 text-center">Tu Progreso</h1>

    <div v-if="loading" class="text-center text-xl">Cargando progreso...</div>

    <div v-else-if="progreso.length === 0" class="text-center text-xl">
      No tienes progreso registrado aún.
    </div>

    <div
      v-else
      v-for="item in progreso"
      :key="item.rutinaSlug"
      class="mb-14 p-10 bg-yellow-400 text-gray-900 rounded-2xl shadow-xl transition-transform transform hover:scale-105 duration-300"
    >
      <h2 class="text-3xl font-bold mb-4 capitalize">{{ item.rutinaSlug.replace(/-/g, ' ') }}</h2>
      <p class="text-lg mb-1">Días completados: {{ item.diasCompletados.length }}</p>
      <p class="text-lg mb-1">Porcentaje completado: {{ item.porcentajeCompletado || 0 }}%</p>
      <p class="text-lg mb-4">Total de días en la rutina: {{ item.totalDias }}</p>

      <!-- Calendario -->
      <div class="mt-6">
        <VCalendar
          is-expanded
          :attributes="[{
            key: 'completados',
            highlight: { color: '#000', fillMode: 'solid' },
            dates: item.diasCompletados
          }]"
        />
      </div>

      <!-- Gráfico de barras -->
      <div class="mt-8">
        <Bar :data="getBarChartData(item)" :options="barChartOptions" />
      </div>

      <button
        @click="marcarDia(item.rutinaSlug)"
        class="mt-8 bg-black text-yellow-400 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 transition"
      >
        Marcar día completado
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { format, subDays, isSameDay } from 'date-fns'
import { useToast } from 'vue-toastification'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const userStore = useUserStore()
const progreso = ref([])
const loading = ref(false)
const toast = useToast()

async function fetchProgreso() {
  loading.value = true
  try {
    const res = await fetch(`http://localhost:5000/api/progreso/${userStore.usuario.id}`)
    if (!res.ok) throw new Error('Error cargando progreso')
    const data = await res.json()
    progreso.value = Array.isArray(data.progreso) ? data.progreso : []
  } catch (error) {
    toast.error(error.message || 'Error al cargar el progreso')
    progreso.value = []
  } finally {
    loading.value = false
  }
}

async function marcarDia(rutinaSlug) {
  // Comprobar si el día de hoy ya está marcado antes de llamar a la API
  const rutina = progreso.value.find(r => r.rutinaSlug === rutinaSlug)
  const hoy = new Date()
  const yaMarcado = rutina?.diasCompletados?.some(d => {
    const fecha = new Date(d)
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    )
  })

  if (yaMarcado) {
    toast.error('Ya has marcado el día de hoy para esta rutina.')
    return
  }

  try {
    const res = await fetch('http://localhost:5000/api/progreso/marcar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userStore.usuario.id,
        rutinaSlug,
      }),
    })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.mensaje || 'Error al marcar día completado')
      return
    }
    toast.success('¡Día marcado como completado!')
    await fetchProgreso()
  } catch (error) {
    toast.error(error.message || 'Error al marcar día completado')
  }
}

function getBarChartData(item) {
  const diasAConsiderar = 14
  const hoy = new Date()

  // Crear array con las últimas fechas desde hace 13 días hasta hoy
  const fechas = Array.from({ length: diasAConsiderar }, (_, i) =>
    subDays(hoy, diasAConsiderar - 1 - i)
  )

  // Para cada fecha, ver si está en diasCompletados
  const data = fechas.map(fecha =>
    item.diasCompletados.some(d => isSameDay(new Date(d), fecha)) ? 1 : 0
  )

  return {
    labels: fechas.map(fecha => format(fecha, 'dd/MM')),
    datasets: [
      {
        label: 'Días completados (últimos 14 días)',
        backgroundColor: '#1f2937',
        data,
      }
    ]
  }
}

const barChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Progreso en los últimos 14 días',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 1,
      ticks: {
        stepSize: 1,
        callback: val => (val === 1 ? 'Completado' : 'No'),
      },
    },
    x: {
      ticks: {
        maxRotation: 90,
        minRotation: 45,
      },
    },
  },
}

onMounted(fetchProgreso)
</script>

<style scoped>
div[v-cloak] {
  opacity: 0;
  transition: opacity 0.5s ease-in;
}
</style>
