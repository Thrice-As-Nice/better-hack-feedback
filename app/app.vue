<template>
  <div>
    <h1>Hello from better-hack-feedback!</h1>
    <p>Hash: {{ hash }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const hash = ref("");

onMounted(() => {
  hash.value = window.location.hash;
  console.log("hash", hash);
});
</script>
