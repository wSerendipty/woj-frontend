<template>
  <div class="menu-demo">
    <a-menu
        accordion
        :style="{ width: '200px', height: '100%' }"
        show-collapse-button
        breakpoint="xl"
        v-model:selected-keys="selectedKeys"
        @collapse="onCollapse"
        :collapsed-width="menuWidth"
        class="arco-menu"
    >
      <a-sub-menu key="/admin/userManage">
        <template #icon>
          <icon-user-group/>
        </template>
        <template #title>用户管理</template>
        <a-menu-item key="/admin/userManage/userInfo">用户信息</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="/admin/problemManage">
        <template #icon>
          <icon-bug></icon-bug>
        </template>
        <template #title>题目管理</template>
        <a-menu-item key="/admin/problemManage/problemInfo">题目信息</a-menu-item>
        <a-menu-item key="/admin/problemManage/problemTemplate">题目模板</a-menu-item>
        <a-menu-item key="/admin/problemManage/runManage">运行管理</a-menu-item>
        <a-menu-item key="/admin/problemManage/submitManage">提交管理</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="/admin/postManage">
        <template #icon>
          <icon-book/>
        </template>
        <template #title>帖子管理</template>
        <a-menu-item key="/admin/postManage/postInfo">帖子信息</a-menu-item>
        <a-sub-menu key="/admin/postManage/postComment">
          <template #icon>
            <icon-message/>
          </template>
          <template #title>帖子评论</template>
          <a-menu-item key="/admin/postManage/postComment/commentInfo">评论信息</a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
      <a-menu-item key="/admin/tagManage">
        <template #icon>
          <icon-apps></icon-apps>
        </template>
        标签管理
      </a-menu-item>
      <a-sub-menu key="/admin/contestManage">
        <template #icon>
          <icon-bar-chart/>
        </template>
        <template #title>竞赛管理</template>
        <a-menu-item key="/admin/contestManage/contestInfo">竞赛信息</a-menu-item>
        <a-menu-item key="/admin/contestManage/joinManage">报名管理</a-menu-item>
        <a-sub-menu key="/admin/contestManage/contestProblem">
          <template #icon>
            <icon-bug></icon-bug>
          </template>
          <template #title>竞赛题目</template>
          <a-menu-item key="/admin/contestManage/contestProblem/contestProblemInfo">题目信息</a-menu-item>
          <a-menu-item key="/admin/contestManage/contestProblem/contestProblemSubmit">题目提交</a-menu-item>
        </a-sub-menu>
      </a-sub-menu>

    </a-menu>
  </div>
</template>
<script setup>
import {onMounted, ref, watch} from 'vue';
import {useRoute} from "vue-router";
import router from "@/router";

const menuWidth = ref(60);
const emit = defineEmits(['updateWidth']);
const onCollapse = (val, type) => {
  if (val) {
    emit('updateWidth', menuWidth.value + 'px');
  } else {
    emit('updateWidth', '200px');
  }
}

const selectedKeys = ref(['/admin/userManage/userInfo']);
const route = useRoute()

watch(() => selectedKeys.value, (val) => {
  router.push({path: val[0]});
})


const getDefaultKeys = () => {
  selectedKeys.value = [route.path];
}

onMounted(() => {
  getDefaultKeys()
})


</script>
<style scoped>
.menu-demo {

  //width: 100%; height: 100%;
  background-color: var(--color-neutral-2);

  .arco-menu {
    &:deep(.arco-menu-collapse-button) {
      font-size: 30px;
    }
  }
}

</style>
