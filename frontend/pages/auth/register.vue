<template>
  <div class="min-h-screen flex items-center justify-center bg-black p-4">
    <form @submit.prevent="handleRegister" class="p-8 rounded-md max-w-md w-full" style="background-color: #FFD700;">
      <h2 class="text-black text-2xl font-bold mb-6 text-center">Registro</h2>

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

      <div class="mb-6">
        <label for="contraseña" class="block mb-2 text-black font-semibold">Contraseña</label>
        <input
          id="contraseña"
          v-model="contraseña"
          type="password"
          placeholder="Introduce tu contraseña"
          class="w-full border-b-2 border-black bg-transparent text-gray-600 placeholder-gray-400 py-2 focus:outline-none focus:text-gray-900"
          required
        />
      </div>

      <div class="mb-6">
        <label for="confirmarContraseña" class="block mb-2 text-black font-semibold">Confirmar contraseña</label>
        <input
          id="confirmarContraseña"
          v-model="confirmarContraseña"
          type="password"
          placeholder="Confirma tu contraseña"
          class="w-full border-b-2 border-black bg-transparent text-gray-600 placeholder-gray-400 py-2 focus:outline-none focus:text-gray-900"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full bg-black text-yellow-400 font-semibold py-2 rounded hover:bg-gray-900 transition"
      >
        Registrarse
      </button>

      <p class="text-black mt-4 text-center">
        ¿Ya tienes cuenta?
        <NuxtLink to="/auth/login" class="underline hover:text-gray-800">Inicia sesión aquí</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useToast } from "vue-toastification";

const nombre = ref("");
const correo = ref("");
const contraseña = ref("");
const confirmarContraseña = ref("");
const router = useRouter();
const toast = useToast();

async function handleRegister() {
  if (contraseña.value !== confirmarContraseña.value) {
    toast.error("Las contraseñas no coinciden");
    return;
  }

  // Validación del formato del correo
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoValido.test(correo.value)) {
    toast.error("Introduce un correo válido (por ejemplo: usuario@ejemplo.com)");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/api/auth/registro", {
      nombre: nombre.value,
      correo: correo.value,
      contraseña: contraseña.value,
    });

    toast.success(response.data.mensaje || "Usuario registrado con éxito");
    router.push("/auth/login");
  } catch (error) {
    console.error("Error en registro:", error);
    toast.error(error.response?.data?.mensaje || "Error al registrar usuario");
  }
}

</script>
