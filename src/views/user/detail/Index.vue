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
        })">编辑个人资料
        </a-button>
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
                    <div v-if="chooseLabel === chooseList[0].key" class="content">{{ item.id }}. {{ item.title }}</div>
                    <div v-else class="content">{{ item.title }}</div>
                    <div class="createTime" >{{ formatTime(item.createTime) }}</div>
                  </div>
                </template>

              </a-list-item-meta>
              <template #actions v-if="chooseLabel==='solution' || chooseLabel === 'post'">
                <icon-delete @click="deleteItem(item)" style="font-size: 16px;color: #ef3939"/>
              </template>
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
import {DELETE_POST, GET_PAGE_FAVOUR_POST_LIST, GET_PAGE_MY_POST_LIST} from "@/service/api/postApi.js";
import {STATUS_CODE} from "@/common/status.js";
import {ERROR, SUCCESS, WARNING} from "@/utils/message.js";
import router from "@/router/index.js";
import {formatTime} from "@/utils/dateParse.js";
import {DELETE_SOLUTION, GET_PAGE_MY_SOLUTION_LIST, GET_PAGE_SOLUTION_LIST} from "@/service/api/solutionApi.js";
import _ from "lodash";
import {Modal} from "@arco-design/web-vue";

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

const pageRequest = reactive({
  pages: 0,
  pageSize: 10,
  total: -1,
  sortField: "createTime",
  sortOrder: "",
  current: 0,
})

const questionSubmitRequest = reactive({
  ...pageRequest,
  userId: "1" //任意值即可，都查询的是登陆用户的提交记录
})

const questionSolutionRequest = reactive({
  ...pageRequest
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
      getSubmitRecord(false)
      break
    case 'solution':
      getSolution(false)
      break
    case 'post':
      getPost(false)
      break
    case 'favour':
      getFavour(false)
      break
  }
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
        path: '/problem/solution',
        query: {
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

const deleteItem = (item) => {
  switch (chooseLabel.value) {
    case 'submit':
      break
    case 'solution':
      Modal.warning({
        hideCancel:false,
        simple:false,
        title:"提示",
        content:"是否删除题解："+item.title+" ？",
        cancelText:"取消",
        okText:"删除",
        cancelButtonProps:{
          status:"normal"
        },
        okButtonProps:{
          status:"danger"
        },
        onOk:()=>{
          DELETE_SOLUTION(item.id).then(res=>{
            if (res.code === STATUS_CODE.SUCCESS_CODE){
              getSolution(true)
              SUCCESS("删除成功！");
            } else {
              ERROR(res.message)
            }
          })
        }
      })

      break
    case 'post':
      Modal.warning({
        hideCancel:false,
        simple:false,
        title:"提示",
        content:"是否删除帖子："+item.title+" ？",
        cancelText:"取消",
        okText:"删除",
        cancelButtonProps:{
          status:"normal"
        },
        okButtonProps:{
          status:"danger"
        },
        onOk:()=>{
          DELETE_POST(item.id).then(res=>{
            if (res.code === STATUS_CODE.SUCCESS_CODE){
              getPost(true)
              SUCCESS("删除成功！");
            } else {
              ERROR(res.message)
            }
          })
        }
      })

      break
    case 'favour':
      break
  }
}
const getUserById = async () => {
  await store.dispatch('getUserById', user.value.id)
}

const getSubmitRecord = (reset) => {
  console.log('提交记录')
  if (reset) {
    questionSubmitRequest.pages = 0
    questionSubmitRequest.current = 0
    data.value = []
  }
  if (Number(questionSubmitRequest.pages) < Number(questionSubmitRequest.current)) {
    // WARNING("没有更多数据了")
    return
  }
  GET_QUESTION_SUBMIT_LIST(questionSubmitRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      questionSubmitRequest.pages = res.data.pages
      questionSubmitRequest.current++
      console.log(res.data)
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
  }).catch(err => {
    console.log(err)
  })
}

const getSolution = (reset) => {
  console.log('个人题解')
  if (reset) {
    questionSolutionRequest.current = 0
    questionSolutionRequest.pages = 0
    data.value.length = 0
  }
  if (Number(questionSolutionRequest.pages) < Number(questionSolutionRequest.current)) {
    // WARNING("没有更多数据了")
    return
  }
  GET_PAGE_MY_SOLUTION_LIST(questionSolutionRequest).then(res => {
        if (res.code === STATUS_CODE.SUCCESS_CODE) {
          questionSolutionRequest.pages = res.data.pages
          questionSolutionRequest.current++
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
      }
  )
}

const getPost = (reset) => {
  console.log('贴子发布')
  if (reset) {
    postRequest.current = 0
    postRequest.pages = 0
    data.value = []
  }
  if (Number(postRequest.pages) < Number(postRequest.current)) {
    // WARNING("没有更多数据了")
    return
  }
  GET_PAGE_MY_POST_LIST(postRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      postRequest.pages = res.data.pages
      postRequest.current++
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
}

const getFavour = (reset) => {
  console.log('帖子收藏')
  if (reset) {
    favourRequest.current = 0
    favourRequest.pages = 0
    data.value = []
  }
  if (Number(favourRequest.total) < Number(favourRequest.pages)) {
    // WARNING("没有更多数据了")
    return
  }
  GET_PAGE_FAVOUR_POST_LIST(favourRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      favourRequest.pages = res.data.pages
      favourRequest.current++
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
}

onMounted(async () => {
  await getUserById()
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

      .profileBtn {
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
        width: 780px;

        &:hover {
          color: #1890FF;
        }

        .content {
          width: 80%;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*禁止换行*/
          text-overflow: ellipsis; /*省略号*/
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
