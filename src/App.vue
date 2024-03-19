<template>
  <div class="app">
    <FullLayout v-if="route.meta.full && route.meta.access !== ACCESS_ENUM.ADMIN"/>
    <BasicLayout v-if="!route.meta.full && route.meta.access !== ACCESS_ENUM.ADMIN"/>
    <AdminLayout v-if="route.meta.access === ACCESS_ENUM.ADMIN"/>
  </div>
</template>

<script setup>
import BasicLayout from "./layouts/BasicLayout.vue";
import FullLayout from "./layouts/FullLayout.vue";
import {useRoute} from "vue-router";
import AdminLayout from "./layouts/AdminLayout.vue";
import {ACCESS_ENUM} from "./access/accessEnum.js";
import {onMounted, ref, watch} from "vue";
import {closeWebSocket, connectWebSocket} from "@/utils/webSocket.js";
import {STATUS_CODE} from "@/common/status.js";
import store from "@/store/index.js";

const route = useRoute()

// websocket 服务 已实现，该项目不用
/*const receive = (e) => {
  console.log("接收消息=>", e)
  if (e.code === STATUS_CODE.NOT_LOGIN_CODE) {
    closeWebSocket()
  }

}

const error = (e) => {
  console.log(e)
}

const loginFlag = ref(store.getters.loginFlag)

watch(()=>store.getters.loginFlag, (_new, oldValue) => {
  console.log("watchLogin=>"+_new)
  if (_new) {
    init()
  } else {
    closeWebSocket()
  }
})

function init() {
  setTimeout(() => {
    connectWebSocket(receive, error)
  }, 1000)
}

onMounted(() => {
  init()
})*/


</script>

<style scoped>
.app {
  height: 100vh;
  width: 100%;
}

</style>
