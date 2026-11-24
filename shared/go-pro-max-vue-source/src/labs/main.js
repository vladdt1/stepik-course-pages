import{createApp,createSSRApp,ref,reactive,computed,watch,onMounted,onUnmounted,defineComponent,h,nextTick}from'vue'
import{createPinia,defineStore}from'pinia'
import{createRouter,createMemoryHistory}from'vue-router'
import Lab from'./Lab.vue'
import'./labs.css'
const app=createApp(Lab);app.use(createPinia());app.mount('#app')
