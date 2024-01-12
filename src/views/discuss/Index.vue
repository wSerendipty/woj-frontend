<template>
  <div class="app">
    这是讨论
    <a-button size="large" type="primary" @click="toPush(route.query.id)">讨论</a-button>
  </div>
  <transition duration="0.3">
    <KeepAlive>
      <MdEditorVue class="mdEditor" v-if="pushId > 0"  @EditorEvent="handleChildEvent" :message="'回复帖子'" :title-input="false"></MdEditorVue>
    </KeepAlive>
  </transition>

</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {SUCCESS} from "../../utils/message.js";
import MdEditorVue from "../../components/MdEditorVue.vue";
const route = useRoute()
const pushId = ref(0)
const toPush = (id) => {
  pushId.value = id
}


const emitMessage = {
  cancel: 'cancel',  // 取消
  push: "push",  // 发布
}
const handleChildEvent = (msg) => {
  if (msg === emitMessage.cancel) {
      pushId.value = 0
      SUCCESS("取消")
  }else {
    SUCCESS("发布")
    console.log(msg)
  }
}

onMounted(() => {
  SUCCESS(route.query.id)
})
</script>

<style lang="scss" scoped>
.mdEditor{

}

</style>
