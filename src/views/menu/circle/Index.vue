<template>
  <div class="app">

    <div class="left">
      <div class="top">
        <div class="contents">
          <div class="content " :class="item.active?'active':''" v-for="(item,index) in studyList"
               @click="choose(index)">
            <div class="text">
              <div class="title">
                {{ item.title }}
              </div>
            </div>
            <img :src="item.img " :alt="item.title"/>
          </div>
        </div>
      </div>
      <div class="tags"
      >
        <div class="tag" v-for="(item,index) in tags"
             :class="index === tagActive?'active':''"
             @click="chooseTag(index)">
          {{ item }}
        </div>
        <a-button type="primary" class="pushBtn" status="success" @click="pushPost">
          <template #icon>
            <icon-pen/>
          </template>
          发起讨论
        </a-button>
      </div>
      <div class="posts">
        <a-empty v-if="posts.length === 0"/>
        <div class="item" v-for="(item) in posts">
          <div class="item-top">
            <a-avatar :size="28">
              <img
                  alt="avatar"
                  :src="item.user.userAvatar"
              />
            </a-avatar>
            <div class="item-top-right">
              <div class="username">
                <div style="display: flex">
                  <div class="title" @click="toDiscuss(item.id)">
                    {{ item.title }}
                  </div>
                  <div style="margin: 0 5px" v-for="special in item.specialTagList">
                    <a-tag color="orangered" v-if="special === '官方'">官方</a-tag>
                    <a-tag color="green" v-if="special ==='推荐'">推荐</a-tag>
                    <a-tag color="arcoblue" v-if="special === '置顶'">置顶</a-tag>
                  </div>


                </div>

                <div style="padding-top: 0.5rem">
                  <a-tag class="post_tag_item" v-for="tag in item.tagList">{{ tag }}</a-tag>
                </div>

              </div>

            </div>

          </div>
          <div class="item-bottom">
            <div class="item-content" @click="toDiscuss(item.id)">
              {{ item.content }}
            </div>
            <div class="icons">
              <div>
                <icon-thumb-up class="icon thumb" v-if="!item.hasThumb" @click="thumb(item.id)"/>
                <icon-thumb-up-fill style="color:rgb(45, 181, 93)" v-if="item.hasThumb" class="icon"
                                    @click="thumb(item.id)"/>
                <span>{{ item.thumbNum }}</span>
              </div>
              <div class="message" @click="toDiscuss(item.id)">
                <icon-message class="icon"/>
                <span>{{ item.commentNum }}</span>
              </div>
              <div class="favour">
                <icon-star class="icon favour" v-if="!item.hasFavour" @click="favour(item.id)"/>
                <icon-star-fill style="color:rgb(255, 161, 22)" v-if="item.hasFavour" class="icon"
                                @click="favour(item.id)"/>
                <span :style="{color:item.hasFavour?'rgb(255, 161, 22)':''}">{{ item.favourNum }}</span>
              </div>
            </div>

          </div>

        </div>
        <a-divider :margin="30" v-if="pageRequest.current > pageRequest.pages && posts.length !== 0">
              <span>
                没有更多啦！
              </span>
        </a-divider>
        <a-skeleton v-if="loading" :animation="loading" style="display: flex;padding-bottom: 20px;">
          <a-skeleton-shape shape="circle" size="small"/>
          <a-space direction="vertical" :style="{width:'100%'}" size="large" style="margin-left: 10px;">
            <a-skeleton-line :rows="4" :widths="['10%','95%','95%','95%']"/>
          </a-space>
        </a-skeleton>

      </div>
    </div>
    <div class="right">
      <div class="body">
        <div class="rank">
          <div class="tip"><icon-fire /> Top 榜</div>
          <div v-for="(item,index) in top10" class="rank-item" @click="toDiscuss(item.id)">
            <div class="rankIndex" :class="index < 3?'top3':''">{{ index + 1 }}</div>
            <div>
              <div class="item-top">
                <a-avatar :size="25">
                  <img
                      alt="avatar"
                      :src="item.user.userAvatar"
                  />
                </a-avatar>
                <div class="item-top-right">
                  <div class="title">
                    {{ item.title }}
                  </div>
                </div>

              </div>
              <div class="content">
                {{ item.content }}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
  <MdEditorVue class="mdEditor" v-show="pushAdd" @EditorEvent="handleChildEvent" :message="'发布'"
               :title-input="true"></MdEditorVue>


</template>

<script setup>

import {onMounted, onUnmounted, ref} from "vue";
import {ADD_POST, FAVOUR_POST, GET_PAGE_POST_LIST, GET_TOP10_BY_THUMB, THUMB_POST} from "@/service/api/postApi.js";
import {STATUS_CODE} from "@/common/status.js";
import {ERROR, NOTIFICATION_WARNING, SUCCESS} from "@/utils/message.js";
import router from "@/router";
import MdEditorVue from "@/components/mdEditor/MdEditorVue.vue";
import {PostTags} from "@/common/tag/postTagConstants.js";
import store from "@/store/index.js";
import {ACCESS_ENUM} from "@/access/accessEnum.js";
import  _ from "lodash";

const pageRequest = {
  current: 1,
  pageSize: 10,
  sortField: "",
  sortOrder: "",
  pages: 0,
  tags: []
}

const studyList = ref([
  {
    title: '技术交流',
    img: "https://static.leetcode.cn/cn-mono-assets/production/assets/interview.b8d34858.png",
    href: "学习计划1",
    active: true
  },
  {
    title: '学习分享',
    img: "https://static.leetcode.cn/cn-mono-assets/production/assets/jobs-promote-active.3c936ab5.png",
    href: "学习计划2",
    active: false
  },
  {
    title: '意见反馈',
    img: "https://static.leetcode.cn/cn-mono-assets/production/assets/general-topic.66326b21.png",
    href: "学习计划3",
    active: false
  }
])

const posts = ref([
  {
    content: "学习编程的基础知识，包括语法、数据结构和算法。",
    createTime: "2024-01-03T04:34:56.000+00:00",
    favourNum: 0,
    hasFavour: false,
    hasThumb: false,
    commentNum: 0,
    id: "1",
    tagList: ['编程', '基础知识', '算法'],
    specialTagList: [],
    thumbNum: 0,
    title: "学习编程基础",
    updateTime: "2024-01-03T04:34:56.000+00:00",
    user: {
      userAvatar: "",
      userName: "",
      userProfile: "",
    },
    userId: "1",
  }
])

const top10 = ref([])

const tags = ref(PostTags)

const tagActive = ref(0)

const pushAdd = ref(false)

const pushPost = () => {
  if(store.getters.userInfo.userRole === ACCESS_ENUM.NOT_LOGIN){
    NOTIFICATION_WARNING("提示","请先登录")
  }else {
    pushAdd.value = true
  }
}

const emitMessage = {
  cancel: 'cancel',  // 取消
  push: "push",  // 发布
}
const handleChildEvent = (msg) => {
  if (msg === emitMessage.cancel) {
    pushAdd.value = false
  } else {
    if (msg.title || msg.title !== "") {
      addPost(msg.value)
    }
  }
}

const addPost = (post) => {
  ADD_POST(post).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("发布成功")
      pushAdd.value = false
    } else {
      ERROR("发布失败")
    }
  })
}

const chooseTag = (index) => {
  tagActive.value = index
  pageRequest.tags = [tags.value[index]]
  pageRequest.current = 1;
  pageRequest.pages = 0;
  getPosts(true)
}

const choose = (index) => {
  studyList.value.forEach(item => {
    item.active = false
  })
  studyList.value[index].active = true
}


const getPosts = async (isChange) => {
  await GET_PAGE_POST_LIST(pageRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      console.log(res.data)
      if (isChange) {
        posts.value = res.data.records
      } else {
        posts.value = [...posts.value, ...res.data.records]
      }
      pageRequest.current++;
      pageRequest.pages = res.data.pages
      loading.value = false
    }
  })
}

const loading = ref(false)

const thumb = (id) => {
  THUMB_POST(id).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      if (res.data === 1) {
        for (let i = 0; i < posts.value.length; i++) {
          if (posts.value[i].id === id) {
            posts.value[i].hasThumb = true
            posts.value[i].thumbNum++
            break
          }
        }
        SUCCESS("点赞成功")
      } else {
        for (let i = 0; i < posts.value.length; i++) {
          if (posts.value[i].id === id) {
            posts.value[i].hasThumb = false
            posts.value[i].thumbNum--
            break
          }
        }
        SUCCESS("取消点赞成功")
      }
    } else {
      ERROR("点赞失败")
    }
  }).catch(err => {

  })
}


const favour = (id) => {
  FAVOUR_POST(id).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      if (res.data === 1) {
        for (let i = 0; i < posts.value.length; i++) {
          if (posts.value[i].id === id) {
            posts.value[i].hasFavour = true
            posts.value[i].favourNum++
            break
          }
        }
        SUCCESS("收藏成功")
      } else {
        for (let i = 0; i < posts.value.length; i++) {
          if (posts.value[i].id === id) {
            posts.value[i].hasFavour = false
            posts.value[i].favourNum--
            break
          }
        }
        SUCCESS("取消收藏成功")
      }

    } else {
      ERROR("收藏失败")
    }
  }).catch(err => {

  })
}

const getTop10 = () => {
  GET_TOP10_BY_THUMB().then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      top10.value = res.data
    }
  })
}

const toDiscuss = (id) => {
  router.push({
    path: "/discuss",
    query: {
      id: id
    }
  })
}


// 节流方法
const throttle = (func, delay) => {
  let timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, arguments);
        timer = null
      }, delay)
    }
  }
}

// 触底相应函数
const onBottom = () => {

  // 获取可视高度
  let clientHeight = document.documentElement.clientHeight;
  // 获取滚动高度
  let scrollTop = document.documentElement.scrollTop
  // 滚动条高度
  let scrollHeight = document.documentElement.scrollHeight
  // 判断是否滚动到底部
  if (clientHeight + scrollTop + 30 > scrollHeight && !loading.value) {
    if (pageRequest.current > pageRequest.pages) {
      return
    }
    loading.value = true
    getPosts(false)
  }
}

onMounted(() => {
  getPosts(true)
  getTop10()
  window.addEventListener('scroll', _.debounce(onBottom, 200))
})

onUnmounted(() => {
  window.removeEventListener("scroll", _.debounce(onBottom, 200), false)
})


</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100%;
  padding-left: 120px;
  padding-right: 24px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  padding-top: 24px;
  position: relative;
  max-width: 1200px;

  .left {
    max-width: 862px;
    flex: 1 1 0;
    margin-right: 0.5rem;

    .top {
      margin-bottom: 1.25rem;

      .contents {
        width: 100%;
        height: 100px;
        margin-bottom: 14px;
        position: relative;
        display: flex;
        flex-wrap: wrap;

        a {
          text-decoration: none;
          color: rgba(var(--blue-5-rgb), 1);
          touch-action: manipulation;
        }

        .content {
          width: 176px;
          height: 100%;
          display: flex;
          padding: 12px 0 0 16px;
          flex-direction: column;
          align-items: flex-start;
          -webkit-box-pack: justify;
          justify-content: space-between;
          border-radius: 8px;
          cursor: pointer;
          user-select: none;
          background-color: #ffffff;
          box-shadow: 0 1px 2px rgba(0, 10, 32, 0.1), 0 2px 8px rgba(0, 10, 32, 0.05), 0 1px 2px rgba(0, 10, 32, 0.1), 0 2px 8px rgba(0, 10, 32, 0.05);
          color: rgb(38, 38, 38, 0.75);

          &:not(:first-child) {
            margin-left: 10px;
          }

          &:first-child {
            &.active {
              background: linear-gradient(rgb(56, 151, 255), rgb(0, 122, 255));
              color: #ffffff;
            }
          }

          &:nth-child(2) {
            &.active {
              background: linear-gradient(rgb(67, 212, 117), rgb(43, 213, 93));
              color: #ffffff;
            }
          }

          &:last-child {
            &.active {
              background: linear-gradient(rgb(204, 103, 255), rgb(175, 82, 222));
              color: #ffffff;
            }
          }
        }

        .text {

          .title {

            font-size: 16px;
            line-height: 22px;
            font-weight: 500;
          }
        }


        img {
          margin-top: -10px;
          height: 68px;
          object-fit: contain;
          align-self: flex-end;
          display: inline-block;
          vertical-align: middle;
          border-style: none;
        }
      }
    }

    .tags {
      &.sticky {
        position: sticky;
        top: 0;
      }

      align-items: center;
      display: flex;
      white-space: nowrap;
      width: 100%;
      height: 40px;
      background-color: rgb(255, 255, 255);
      z-index: 8;


      .tag {
        color: #0000008c;
        font-size: 1rem;
        line-height: 1.5rem;
        padding: 0.5rem 0.75rem;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 0.5rem;

        &.active {
          color: #1A1A1A;
          background-color: #0000000a;
          font-weight: 600;
        }

        &:hover {
          color: #1A1A1A;
        }


      }

      .pushBtn {
        border-radius: 10px;
        margin-left: auto;
        margin-right: 0.5rem;
      }
    }

    .posts {

      margin-top: 1rem;

      .item {
        background: rgba(255, 255, 255, 1);
        padding: 12px;
        box-shadow: 0 1px 8px rgba(0, 10, 32, 0.1), 0 2px 8px rgba(0, 10, 32, 0.05);
        transition: box-shadow 0.3s ease-in-out 0s;
        margin-bottom: 10px;
        border-radius: 8px;

        .item-top {
          display: flex;

          .item-top-right {
            margin-left: 0.5rem;

            a-avatar {
              margin-right: 0.75rem
            }

            .username {
              align-items: center;

              .title {
                cursor: pointer;
                padding-top: 0.25em;
                font-size: 1rem;
                color: #1A1A1A;
                font-weight: 600;
                overflow: hidden;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                display: -webkit-box;
                max-width: 500px;
              }

              .post_tag_item {
                border-radius: 8px;

                &:not(:first-child) {
                  margin-left: 0.5rem;
                }
              }


            }


          }
        }

        .item-bottom {
          padding-top: 0.5rem;
          margin-left: 37px;
          border-color: #00000057;

          .item-content {
            cursor: pointer;
            color: #0000008c;
            font-size: .875rem;
            line-height: 1.25rem;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            overflow: hidden;
          }

          .icons {
            //justify-content: space-between;
            align-items: center;
            display: flex;
            margin-top: 1rem;
            gap: 1.5rem;

            .icon {
              cursor: pointer;
              font-size: 16px;
              margin-right: 5px;
              color: rgb(140 140 140/1);
            }

            .thumb {
              cursor: pointer;

              &:hover {
                color: rgb(45 181 93/1);
              }
            }

            .message {
              cursor: pointer;

              &:hover {
                color: rgb(0 122 255/1);
              }

              .icon {

                &:hover {
                  color: rgb(0 122 255/1);
                }
              }
            }

            .favour {
              &:hover {
                color: rgb(255 193 7/1);
              }
            }
          }

        }
      }

    }

  }

  .right {
    position: static;
    padding: 0.5rem 0.5rem 1rem;
    margin-left: 10px;

    .body {
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08);
      min-width: 200px;
      padding: 16px 16px 4px;

      .rank {
        .tip{
          font-size: 18px;
          line-height: 20px;
          font-weight: 700;
          font-style: italic;
          color: rgba(255,161,22, 1);
          margin-bottom:  10px;
        }
        .rank-item {
          &:hover{
            background: #F7F7F8;
          }
          border-radius: 5px;
          cursor: pointer;
          position: relative;
          z-index: 0;
          display: flex;
          padding: 6px 6px;
          margin-bottom: 4px;

          .rankIndex {
            margin-right: 8px;
            font-size: 14px;
            line-height: 20px;
            min-width: 10px;
            font-style: italic;
            font-weight: 700;
            transform: translateY(1px);
            color: rgba(60,60,67,0.3);
            &.top3{
              color: rgba(255,161,22, 1);
            }
          }

          .item-top {
            display: flex;

            .item-top-right {
              margin-left: 10px;
              font-size: 14px;
              line-height: 20px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              flex: 1 1 auto;
              font-weight: 500;
              color: rgba(38, 38, 38, 1);
            }

          }

          .content {
            max-width: 200px;
            font-size: 12px;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            height: 20px;
            color: rgba(60, 60, 67, 0.3);
            margin-top: 2px;
          }
        }
      }
    }

  }
}

.mdEditor {
}


</style>
