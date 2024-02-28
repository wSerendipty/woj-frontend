<template>
  <div class="userDetail">
    <div class="top">
      <div class="user">
        <div class="avatar">
          <a-avatar :size="90" shape="square">
            <IconUser v-if="!Boolean(user.userAvatar)"/>
            <img
                v-else
                alt="avatar"
                :src="user.userAvatar"
            />
          </a-avatar>
        </div>
        <div class="detail">
          <div class="item username">{{ user.userName }}</div>
          <div class="item account">{{ user.userAccount }}</div>
          <div class="item profile">{{ user.userProfile }}</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <a-button class="profileBtn" type="secondary" status="success" @click="router.push({
          path: '/user/profile',
        })">编辑个人资料</a-button>
      </div>
      <div class="right">
        <div class="choose">
          <div class="item" @click="chooseHandel(item)" :class="chooseLabel===item.key?'active':''"
               v-for="item in chooseList">{{ item.name }}
          </div>
        </div>
        <a-list :bordered="false" :max-height="500" @reachBottom="onBottom" :data="data">
          <template #item="{ item }">
            <a-list-item>
              <a-list-item-meta
              >
                <template #description>
                  <div class="description"
                       @click="toOther(item.id)">
                    <div>{{ item.id }}. {{ item.title }}</div>
                    <div class="createTime">{{ formatTime(item.createTime, 1) }}</div>
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>

        </a-list>
      </div>

    </div>

  </div>

</template>

<script setup>
import store from "@/store/index.js";
import {computed, onMounted, reactive, ref} from "vue";
import {GET_QUESTION_SUBMIT_LIST} from "@/service/api/questionSubmitApi.js";
import {GET_PAGE_FAVOUR_POST_LIST, GET_PAGE_MY_POST_LIST} from "@/service/api/postApi.js";
import {STATUS_CODE} from "@/common/status.js";
import {WARNING} from "@/utils/message.js";
import router from "@/router/index.js";
import {formatTime} from "@/utils/dateParse.js";

const user = computed(() => {
  return store.getters.userInfo
})

const chooseList = ref([
  {name: '提交记录', key: 'submit'},
  {name: '个人题解', key: 'solution'},
  {name: '贴子发布', key: 'post'},
  {name: '帖子收藏', key: 'favour'},
])

const chooseLabel = ref(chooseList.value[0].key)

const chooseHandel = (item) => {
  chooseLabel.value = item.key
  switch (item.key) {
    case 'submit':
      getSubmitRecord(true)
      break
    case 'solution':
      getSolution(true)
      break
    case 'post':
      getPost(true)
      break
    case 'favour':
      getFavour(true)
      break
  }
}

const pageRequest = {
  page: 1,
  pageSize: 10,
  total: 0,
  sortField: "createTime",
  sortOrder: "",
}

const questionSubmitRequest = reactive({
  ...pageRequest,
  userId: "1" //任意值即可，都查询的是登陆用户的提交记录
})

const questionSolutionRequest = reactive({
  ...pageRequest,
  userId: "1" //任意值即可，都查询的是登陆用户的题解
})

const postRequest = reactive({
  ...pageRequest,
})

const favourRequest = reactive({
  ...pageRequest,
})


const data = ref([])

const onBottom = () => {
  switch (chooseLabel.value) {
    case 'submit':
      questionSubmitRequest.page++
      getSubmitRecord(false)
      break
    case 'solution':
      questionSolutionRequest.page++
      getSolution(false)
      break
    case 'post':
      postRequest.page++
      getPost(false)
      break
    case 'favour':
      favourRequest.page++
      getFavour(false)
      break
  }
  console.log("到底了")
}

const toOther = (id) => {
  switch (chooseLabel.value) {
    case 'submit':
      router.push({
        path: '/problem/do',
        query: {
          name: "detail",
          type: "normal",
          id: id
        }
      })
      break
    case 'solution':
      router.push({
        path: '/problem/do',
        query: {
          name: "solution",
          type: "normal",
          id: id
        }
      })
      break
    case 'post':
      router.push({
        path: "/discuss",
        query: {
          id: id
        }
      })
      break
    case 'favour':
      router.push({
        path: "/discuss",
        query: {
          id: id
        }
      })
      break
  }
}


const getUserById = async () => {
  await store.dispatch('getUserById', user.value.id)
}

const getSubmitRecord = (reset) => {
  if (reset) {
    questionSubmitRequest.page = 1
    questionSubmitRequest.total = 0
    data.value = []
  }
  if (questionSubmitRequest.total < data.value.length) {
    WARNING("没有更多数据了")
    return
  }
  GET_QUESTION_SUBMIT_LIST(questionSubmitRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      questionSubmitRequest.total = res.data.total
      if (reset) {
        data.value = res.data.records.map(item => {
          return {
            id: item.questionVO.id,
            title: item.questionVO.title,
            createTime: item.createTime
          }
        })
      } else {
        data.value.push(...res.data.records.map(item => {
          return {
            id: item.questionVO.id,
            title: item.questionVO.title,
            createTime: item.createTime
          }
        }))
      }
    }
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
  console.log('提交记录')
}

const getSolution = (reset) => {
  if (reset) {
    questionSolutionRequest.page = 1
    questionSolutionRequest.total = 0
    data.value = []
  }
  if (questionSolutionRequest.total < data.value.length) {
    WARNING("没有更多数据了")
    return
  }
  console.log('个人题解')
}

const getPost = (reset) => {
  if (reset) {
    postRequest.page = 1
    postRequest.total = 0
    data.value = []
  }
  if (postRequest.total < data.value.length) {
    WARNING("没有更多数据了")
    return
  }
  GET_PAGE_MY_POST_LIST(postRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      postRequest.total = res.data.total
      if (reset) {
        data.value = res.data.records.map(item => {
          return {
            id: item.id,
            title: item.title,
            createTime: item.createTime
          }
        })
      } else {
        data.value.push(...res.data.records.map(item => {
          return {
            id: item.id,
            title: item.title,
            createTime: item.createTime
          }
        }))
      }
    }
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
  console.log('贴子发布')
}

const getFavour = (reset) => {
  if (reset) {
    favourRequest.page = 1
    favourRequest.total = 0
    data.value = []
  }
  if (favourRequest.total < data.value.length) {
    WARNING("没有更多数据了")
    return
  }
  GET_PAGE_FAVOUR_POST_LIST(favourRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      favourRequest.total = res.data.total
      if (reset) {
        data.value = res.data.records.map(item => {
          return {
            id: item.id,
            title: item.title,
            createTime: item.createTime
          }
        })
      } else {
        data.value.push(...res.data.records.map(item => {
          return {
            id: item.id,
            title: item.title,
            createTime: item.createTime
          }
        }))
      }
    }
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
  console.log('帖子收藏')
}

onMounted( async () => {
  await getUserById()
  getSubmitRecord(true)
})


</script>

<style lang="scss" scoped>
.userDetail {
  min-height: 100vh;
  padding-left: 120px;
  padding-right: 120px;
  padding-bottom: 50px;
  background: #F7F8FA;

  .top {
    width: 100%;
    padding-top: 40px;

    .user {
      display: flex;
      align-items: center;
      height: 100px;

      .detail {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        height: 100%; /* 确保容器高度填满父容器 */
        justify-content: space-between;
        //.item{
        //  flex: 1;
        //  display: flex;
        //  align-items: center;
        //}
        .username {
          flex: 1;
          font-weight: 600;
          font-size: 1.25rem;
          line-height: 1.75rem;
          word-break: break-all;
          color: #1a1a1a;
        }

        .account {
          flex: 1;
          font-size: 14px;
          color: #3c3c4399;
        }

        .profile {
          flex: 1;
          color: rgb(38 38 38/1);;
          font-size: .875rem;
          line-height: 1.25rem;
          align-items: flex-end;
        }
      }
    }
  }

  .bottom {
    display: flex;
    margin-top: 30px;
    .left {
      border-radius: 6px;
      display: flex;
      padding-top: 20px;
      justify-content: center;
      height: 80px;
      background: #ffffff;
      width: 20%;
      margin-right: 2%;
      .profileBtn{
        width: 90%;
        border-radius: 5px;
      }
    }

    .right {
      padding: 10px;
      border-radius: 6px;
      min-height: 500px;
      width: 75%;
      background: #ffffff;

      .choose {
        display: flex;
        margin-bottom: 10px;

        .item {
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          margin-left: 10px;

          &:hover {
            background: #F7F8FA;
          }

          &.active {
            background: #1890FF;
            color: #fff;
          }
        }
      }

      .description {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        width: 800px;

        &:hover {
          color: #1890FF;
        }

        .createTime {
          color: #3c3c4399;
          font-size: 14px;
        }
      }
    }

  }
}

</style>
