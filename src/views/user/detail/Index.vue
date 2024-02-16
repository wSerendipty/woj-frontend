<template>
  <div class="userDetail">
    <div class="top">
      <div class="user">
        <div class="avatar">
          <a-avatar :size="90" shape="square">
            <img :src="user.userAvatar" alt="avatar">
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
      <div class="choose">
        <div class="item" @click="chooseHandel(item)" :class="chooseLabel===item.key?'active':''"
             v-for="item in chooseList">{{ item.name }}
        </div>
      </div>
      <a-list :bordered="false" :max-height="600" @reachBottom="onBottom" :data="data">
        <template #item="{ item }">
          <a-list-item >
            <a-list-item-meta
            >
              <template #description>
                <div>{{ item.description }}</div>
              </template>
<!--              <template #avatar>-->
<!--                <a-avatar shape="square">-->
<!--                  <img-->
<!--                      alt="avatar"-->
<!--                      :src="item.avatar"-->
<!--                  />-->
<!--                </a-avatar>-->
<!--              </template>-->
            </a-list-item-meta>
<!--            <template #actions>-->
<!--              <icon-edit/>-->
<!--              <icon-delete/>-->
<!--            </template>-->
          </a-list-item>
        </template>

      </a-list>
    </div>

  </div>

</template>

<script setup>
import store from "@/store/index.js";
import {computed, reactive, ref} from "vue";
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
}

const pageRequest = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const data = ref([
  {
    title: 'Beijing Bytedance Technology Co., Ltd.',
    description: 'Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
  },
  {
    title: 'Beijing Bytedance Technology Co., Ltd.',
    description: 'Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
  },
  {
    title: 'Beijing Bytedance Technology Co., Ltd.',
    description: 'Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
  },
  {
    title: 'Beijing Bytedance Technology Co., Ltd.',
    description: 'Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
  },
  {
    title: 'Beijing Bytedance Technology Co., Ltd.',
    description: 'Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
  },
  {
    title: 'Beijing Bytedance Technology Co., Ltd.',
    description: 'Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
  },
  {
    title: 'Beijing Bytedance Technology Co., Ltd.',
    description: 'Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.',
    avatar: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'
  },
])

const onBottom = () => {
  console.log("到底了")
}



const getUserById = () => {
  console.log(user)
  store.dispatch('getUserById', user.value.id)
}

const getSubmitRecord = () => {
  console.log('提交记录')
}

const getSolution = () => {
  console.log('个人题解')
}

const getPost = () => {
  console.log('贴子发布')
}

const getFavour = () => {
  console.log('帖子收藏')
}


</script>

<style lang="scss" scoped>
.userDetail {
  width: 100%;
  min-height: 100vh;
  max-width: 1200px;
  padding-left: 120px;
  padding-right: 70px;
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
    margin-top: 30px;
    background: #ffffff;
    padding: 10px;
    border-radius: 6px;
    min-height: 600px;

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
  }
}

</style>
