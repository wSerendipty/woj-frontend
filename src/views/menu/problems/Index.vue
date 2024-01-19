<template>
  <div class="app">
    这是管理员页面
    <CodeEditorVue :height="'300px'" :width="'800px'" :on-change="handleChange" :value="value"></CodeEditorVue>
  </div>

</template>

<script setup>

import CodeEditorVue from "../../components/CodeEditorVue.vue";
import {ref} from "vue";

const value = ref('')

const handleChange = (v) => {
  console.log(v)
}
</script>

<style lang="scss" scoped>


</style>
