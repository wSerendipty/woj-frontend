<template>
  <a-result status="403" subtitle="没有权限-No-AUTHORITY">
    <template #extra>
      <a-space>
        <a-button type="primary" @click="back">Back</a-button>
      </a-space>
    </template>
  </a-result>
</template>

<script setup>

import router from "../../../router/index.js";

const back = () => {
  router.replace({path: "/index"})
}

</script>