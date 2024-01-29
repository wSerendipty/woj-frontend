<template>
  <div class="basicLayout">
    <a-layout>
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
<!--      <a-layout-footer class="footer">-->
<!--        <a href="https://github.com/wSerendipty" target="_blank">-->
<!--          OJ判题系统 by 逢考必过！-->
<!--        </a>-->
<!--      </a-layout-footer>-->
    </a-layout>
  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";


const router = useRouter();


const route = useRoute()

const selectKeys = ref([route.path]);

watch(() => route.path, (val) => {
  console.log(val)
  selectKeys.value = [val];
})

</script>

<style scoped lang="scss">

.basicLayout {
  width: 100%;
  height: 100vh;

  .content {
    background: #ffffff;
    min-height: calc(100vh - 16 * 3px)
  }

}


</style>
