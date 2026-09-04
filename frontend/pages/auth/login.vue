<template>
  <div class="min-h-screen flex items-center justify-center bg-black p-4">
    <form @submit.prevent="handleLogin" class="p-8 rounded-md max-w-md w-full" style="background-color: #FFD700;">
      <h2 class="text-black text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>

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

      <button type="submit" class="w-full bg-black text-yellow-400 font-semibold py-2 rounded hover:bg-gray-900 transition">
        Iniciar sesión
      </button>

      <p class="text-black mt-4 text-center">
        ¿No tienes cuenta?
        <NuxtLink to="/auth/register" class="underline hover:text-gray-800">Regístrate aquí</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useToast } from "vue-toastification";

const correo = ref("");
const contraseña = ref("");
const router = useRouter();
const userStore = useUserStore();
const toast = useToast();

async function handleLogin() {

  const correoValido = /^[^@]+@[^@]+\.[^@]+$/;
  if (!correoValido.test(correo.value)) {
    toast.error("Introduce un correo válido (por ejemplo: usuario@ejemplo.com)");
    return;
  }
  
  try {
    const response = await $fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      body: {
        correo: correo.value.toLowerCase(),
        contraseña: contraseña.value,
      },
    });

    userStore.setUsuario(response.usuario);
    userStore.setToken(response.token);

    toast.success(response.mensaje || "Inicio de sesión exitoso");
    router.push("/dashboard");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    toast.error(error.data?.mensaje || "Error al iniciar sesión");
  }
}
</script>
