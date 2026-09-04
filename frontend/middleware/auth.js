import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  if (!userStore.isLoggedIn && to.path === '/dashboard') {
    return navigateTo('/auth/login')
  }
})
