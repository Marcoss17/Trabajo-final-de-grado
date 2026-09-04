<template>
  <div class="min-h-screen bg-black text-white flex items-center justify-center p-8">
    <div class="bg-gray-900 rounded-xl shadow-lg p-8 max-w-lg w-full">
      <h1 class="text-3xl font-bold text-yellow-400 mb-6 text-center">Contacto</h1>
      <p class="mb-6 text-center">
        ¿Tienes dudas, sugerencias o necesitas soporte? Rellena el siguiente formulario o escríbenos a
        <a href="mailto:soporte@plataformaentrenamiento.com" class="underline text-yellow-300">soporte@plataformaentrenamiento.com</a>
      </p>
      <form @submit.prevent="enviarMensaje">
        <div class="mb-4">
          <label class="block mb-2 text-yellow-300" for="email">Tu correo</label>
          <input
  id="email"
  v-model="email"
  type="email"
  required
  class="w-full px-4 py-2 rounded bg-black border border-yellow-400 text-white autofill-contacto"
  placeholder="tu@email.com"
/>
        </div>
        <div class="mb-4">
          <label class="block mb-2 text-yellow-300" for="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            v-model="mensaje"
            required
            rows="5"
            class="w-full px-4 py-2 rounded bg-black border border-yellow-400 text-white"
            placeholder="¿En qué podemos ayudarte?"
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-500 transition"
        >
          Enviar mensaje
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const email = ref('')
const mensaje = ref('')
const toast = useToast()

function enviarMensaje() {
  // Aquí puedes integrar el envío real por API/email si lo deseas
  toast.success('¡Mensaje enviado! Te responderemos pronto.')
  email.value = ''
  mensaje.value = ''
}
</script>