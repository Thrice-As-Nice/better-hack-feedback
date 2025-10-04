<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-8">
        <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          Better Hack Echo
        </div>
        <h1 class="block mt-1 text-lg leading-tight font-medium text-black">
          Hello from Better Hack Echo!
        </h1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  // import { sendInitData } from "tg-mini-auth/client";
  const sendInitData = () => {
    console.log('sendInitData')
  }

  onMounted(() => {
    sendInitData()
  })
</script>
