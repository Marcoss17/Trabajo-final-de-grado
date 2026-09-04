<template>
  <div class="min-h-screen bg-black text-white p-8 max-w-6xl mx-auto pt-24">
    <!-- Hero Section -->
    <section class="text-center mb-16">
      <h1 class="text-5xl font-extrabold mb-6 text-yellow-400">Bienvenido a FutTrain</h1>
      <p class="text-xl max-w-3xl mx-auto">
        La plataforma definitiva para planificar tu entrenamiento, seguir tu progreso y alcanzar tus objetivos de forma sencilla y eficaz.
      </p>
      <NuxtLink to="/planes" class="mt-8 inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded hover:bg-yellow-500 transition">
        Consulta nuestros planes
      </NuxtLink>
    </section>

    <!-- Por qué elegirnos -->
    <section class="mb-20">
      <h2 class="text-3xl font-bold mb-6 text-yellow-400 text-center">¿Por qué elegir PlataformaEntrenamiento?</h2>
      <div class="grid md:grid-cols-3 gap-10 text-center">
        <div class="bg-yellow-400 text-black rounded-xl p-6 shadow-lg">
          <h3 class="text-2xl font-semibold mb-3">Planes Personalizados</h3>
          <p>
            Elige entre varios planes diseñados para adaptarse a tus necesidades y objetivos específicos, desde principiantes hasta deportistas avanzados.
          </p>
        </div>
        <div class="bg-yellow-400 text-black rounded-xl p-6 shadow-lg">
          <h3 class="text-2xl font-semibold mb-3">Seguimiento del Progreso</h3>
          <p>
            Lleva un control detallado de tus entrenamientos, mejoras y estadísticas para motivarte y optimizar tu rendimiento.
          </p>
        </div>
        <div class="bg-yellow-400 text-black rounded-xl p-6 shadow-lg">
          <h3 class="text-2xl font-semibold mb-3">Rutinas y Ejercicios</h3>
          <p>
            Accede a una amplia variedad de rutinas y ejercicios creados por expertos para maximizar resultados y prevenir lesiones.
          </p>
        </div>
      </div>
    </section>

    <!-- Cómo funciona -->
    <section class="mb-20">
      <h2 class="text-3xl font-bold mb-6 text-yellow-400 text-center">¿Cómo funciona?</h2>
      <div class="grid md:grid-cols-3 gap-8 text-center">
        <div class="bg-gray-800 p-6 rounded-xl border border-yellow-500">
          <h3 class="text-xl font-semibold mb-3">1. Crea tu cuenta</h3>
          <p>Regístrate en segundos y accede a todas nuestras herramientas desde cualquier dispositivo.</p>
        </div>
        <div class="bg-gray-800 p-6 rounded-xl border border-yellow-500">
          <h3 class="text-xl font-semibold mb-3">2. Elige tu plan</h3>
          <p>Selecciona un plan de entrenamiento adaptado a tu nivel, tiempo y objetivos.</p>
        </div>
        <div class="bg-gray-800 p-6 rounded-xl border border-yellow-500">
          <h3 class="text-xl font-semibold mb-3">3. Empieza a entrenar</h3>
          <p>Sigue tus rutinas, registra tus avances y mantente motivado día a día.</p>
        </div>
      </div>
    </section>

    <!-- Testimonios -->
    <section class="mb-20 bg-gray-900 rounded-xl p-8 text-yellow-400 max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-4 text-center">Testimonios de Usuarios</h2>
      <div class="space-y-6">
        <blockquote class="italic text-center">
          "Gracias a PlataformaEntrenamiento, he logrado mantener mi rutina y mejorar mi condición física de manera consistente."
          <footer class="mt-2 font-semibold">— Ana M.</footer>
        </blockquote>
        <blockquote class="italic text-center">
          "La variedad de planes y el seguimiento de progreso hacen que entrenar sea sencillo y motivador. ¡Totalmente recomendado!"
          <footer class="mt-2 font-semibold">— Carlos P.</footer>
        </blockquote>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="text-center">
      <h2 class="text-3xl font-bold mb-4 text-yellow-400">¿Listo para comenzar?</h2>
      <p class="mb-6 max-w-xl mx-auto">
        Únete hoy mismo y transforma tu manera de entrenar con herramientas profesionales y soporte continuo.
      </p>
      <NuxtLink to="/auth/login" class="inline-block bg-yellow-400 text-black font-bold px-8 py-3 rounded hover:bg-yellow-500 transition">
        Iniciar sesión / Registrarse
      </NuxtLink>
    </section>
  </div>
</template>
