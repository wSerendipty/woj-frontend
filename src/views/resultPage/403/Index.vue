<template>
  <div class="result">
    <a-result status="403" subtitle="没有权限-No-AUTHORITY">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="back">Back</a-button>
        </a-space>
      </template>
    </a-result>
  </div>

</template>

<script setup>
import router from "@/router";

const back = () => {
  // 登录成功后从localStorage获取上一个页面路径，并解析为字符串
  const previousRoute = localStorage.getItem('previousRoute');
  const pathToRedirect = previousRoute ? JSON.parse(previousRoute) : '/index'; // 若没有存储则默认跳转首页
  // 清除存储的路径
  localStorage.removeItem('previousRoute');
  router.replace(pathToRedirect)
}

</script>

<style scoped lang="scss">
.result {
  height: 100vh;
}

</style>