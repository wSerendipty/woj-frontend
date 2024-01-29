<!-- Docs.vue -->
<template>
  <div>
    <iframe :src="docUrl" style="width: 100%; height: 100vh; border: none;"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const docUrl = ref( "localhost:5173/"+ 'docs/index.html'); // 假设VuePress的首页是index.html
</script>