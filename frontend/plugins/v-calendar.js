import { setupCalendar, Calendar, DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  setupCalendar(nuxtApp.vueApp) // <- ESTA ES LA CLAVE
  nuxtApp.vueApp.component('VCalendar', Calendar)
  nuxtApp.vueApp.component('VDatePicker', DatePicker)
})
