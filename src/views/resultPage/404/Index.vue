<template>
  <a-result status="404" subtitle="未找到该页面-Not Found">
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