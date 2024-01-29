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

const route = useRoute()


</script>

<style scoped>
.app {
  height: 100vh;
  width: 100%;
}

</style>
