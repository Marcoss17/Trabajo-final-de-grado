import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const usuario = ref(null)
  const token = ref(null)
  const planId = ref(null)

  // Carga token y usuario guardados al iniciar la app
  const cargarDesdeLocalStorage = () => {
    if (typeof localStorage !== 'undefined') {
      const tokenGuardado = localStorage.getItem('token')
      const usuarioGuardado = localStorage.getItem('usuario')

      if (tokenGuardado) {
        token.value = tokenGuardado
        isLoggedIn.value = true
      }
      if (usuarioGuardado) {
        try {
          usuario.value = JSON.parse(usuarioGuardado)
          planId.value = usuario.value?.planSeleccionado || null
        } catch {
          usuario.value = null
          planId.value = null
        }
      }
    }
  }

  // Set usuario y guardar en localStorage
  const setUsuario = (userData) => {
    usuario.value = userData
    isLoggedIn.value = true
    planId.value = userData.planSeleccionado || null
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('usuario', JSON.stringify(userData))
    }
  }

  // Set token y guardar en localStorage
  const setToken = (newToken) => {
    token.value = newToken
    isLoggedIn.value = !!newToken
    if (typeof localStorage !== 'undefined') {
      if (newToken) {
        localStorage.setItem('token', newToken)
      } else {
        localStorage.removeItem('token')
      }
    }
  }

  // Cerrar sesión
  const logout = () => {
    usuario.value = null
    token.value = null
    isLoggedIn.value = false
    planId.value = null
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    }
  }

  // Set plan seleccionado
  const setPlan = (id) => {
    planId.value = id
    if (usuario.value) {
      usuario.value.planSeleccionado = id
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('usuario', JSON.stringify(usuario.value))
      }
    }
  }

  // Subir o actualizar foto de perfil
  const actualizarFotoPerfil = async (archivo) => {
    if (!token.value) throw new Error('No autenticado')

    const formData = new FormData()
    formData.append('foto', archivo)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token.value}`
      }
    }

    const { data } = await axios.put(
      'http://localhost:5000/api/usuario/foto-perfil',
      formData,
      config
    )

    // Actualiza la foto en el usuario y localStorage
    if (usuario.value) {
      usuario.value.fotoPerfil = data.fotoPerfil
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('usuario', JSON.stringify(usuario.value))
      }
    }
  }

  // NUEVO: Función para hacer login
  const login = async (email, password) => {
    const { data } = await axios.post('http://localhost:5000/api/login', { email, password })
    if (data.token && data.usuario) {
      setToken(data.token)
      setUsuario(data.usuario)
    } else {
      throw new Error('Respuesta inválida del servidor')
    }
  }

  return {
    isLoggedIn,
    usuario,
    token,
    planId,
    setUsuario,
    setToken,
    logout,
    setPlan,
    cargarDesdeLocalStorage,
    actualizarFotoPerfil,
    login, // <-- exportamos la función login
  }
}, {
  persist: false
})
