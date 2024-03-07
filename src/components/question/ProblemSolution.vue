<template>
  <div class="questionSolution">
    <div class="top">
      <a-input-search class="search" @search="getSolutionList(true)" placeholder="输入题解标题搜索"
                      v-model:model-value="pageRequest.title"></a-input-search>
      <a-button status="success" class="push" @click="toPush">发布题解</a-button>
    </div>
    <div class="bottom">
      <a-list :bordered="false" :max-height="475" @reachBottom="onBottom" :scrollbar="true">
        <template #scroll-loading>
          <div v-if="pageRequest.current > pageRequest.pages">没有更多数据</div>
        </template>
        <a-list-item v-for="item in data" :key="item.id" class="list-item" @click="toDetail(item.id)">
          <a-list-item-meta
              :title="item.title"
          >
            <template #description>
              <div class="description">{{ item.content }}</div>
            </template>
            <template #avatar>
              <a-avatar shape="square">
                <img
                    alt="avatar"
                    :src="item.user?.userAvatar"
                />
              </a-avatar>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>
<script setup>
import {useRoute} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {GET_PAGE_SOLUTION_LIST} from "@/service/api/solutionApi.js";
import {STATUS_CODE} from "@/common/status.js";
import MdEditorVue from "@/components/mdEditor/MdEditorVue.vue";
import router from "@/router/index.js";

const route = useRoute()

const pageRequest = reactive({
  current: 1,
  pageSize: 10,
  questionId: "0",
  tags: [],
  title: "",
  total: 0,
  pages: 0
})

const data = ref([])

/**
 * 分页获取题解列表
 */
const getSolutionList = (reset) => {
  if (reset) {
    data.value = []
    pageRequest.pages = 0;
    pageRequest.current = 1;
  }
  GET_PAGE_SOLUTION_LIST(pageRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      pageRequest.current++;
      pageRequest.pages = res.data.pages
      if (reset) {
        data.value = res.data.records
      } else {
        data.value.push(
            ...res.data.records
        )
      }
    }
  })
}

const onBottom = () => {
  if (pageRequest.current > pageRequest.pages) {
    return
  }
  getSolutionList(false)
}

const toPush = () => {
  window.open("/problem/solution/submission?questionId="+pageRequest.questionId)
}

const toDetail = (id) => {
  router.push({
    path:"/problem/solution",
    query:{
      id:id
    }
  })
}

onMounted(() => {
  pageRequest.questionId = route.query.id
  getSolutionList(true)
})
</script>
<style scoped lang="scss">
.questionSolution {
  padding-top: 10px;
  //background: #ffc0cb;
  min-height: 500px;
  min-width: 500px;

  .top {
    padding: 10px;
    position: sticky;
    top: 0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search {
      width: 250px;
      border-radius: 5px;
    }

    .push{
      width: 150px;
      border-radius: 6px;
    }

  }

  .bottom {
    //width: 95%;
    .list-item {
      cursor: pointer;

      .description {
        width: 500px;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*禁止换行*/
        text-overflow: ellipsis; /*省略号*/
      }

      &:hover {
        border-radius: 6px;
        background: #F0F0F0;
      }
    }

  }
}

</style>