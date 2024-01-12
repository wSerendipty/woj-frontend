<template>
  <div class="app">

    <div class="left">
      <div class="top">
        <div class="tip">
          学习计划
          <icon-right/>
        </div>
        <div class="contents">
          <a class="content" v-for="item in studyList" target="_blank" href="#">
            <img :src="item.img " :alt="item.title"/>
            <div class="text">
              <div class="title">
                {{ item.title }}
              </div>
              <div class="text-content">
                {{ item.content }}
              </div>
            </div>
          </a>
        </div>
      </div>
      <div class="tags sticky"
      >
        <div class="tag" v-for="(item,index) in tags"
             :class="index === tagActive?'active':''"
             @click="chooseTag(index)">
          {{ item.name }}
        </div>
      </div>
      <div class="posts">
        <div class="item" v-for="(item,index) in posts">
          <div class="item-top"  @click="toDiscuss(item.id)">
            <a-avatar :size="28">
              <img
                  alt="avatar"
                  :src="item.user.userAvatar"
              />
            </a-avatar>
            <div class="item-top-right">
              <div class="username">{{ item.user.userName }}</div>
              <div class="title">
                {{ item.title }}
              </div>
            </div>

          </div  >
          <div class="item-bottom">
            <div class="item-content" >
              {{ item.content }}
            </div>
            <div class="icons">
              <div>
                <icon-thumb-up class="icon thumb" v-if="!item.hasThumb" @click="thumb(item.id)"/>
                <icon-thumb-up-fill style="color:rgb(45, 181, 93)" v-if="item.hasThumb" class="icon"
                                    @click="thumb(item.id)"/>
                <span>{{ item.thumbNum }}</span>
              </div>
              <div class="message">
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
            <a-divider :margin="15" v-if="index !== posts.length-1"/>
            <a-divider :margin="30" v-if="pageRequest.current > pageRequest.pages &&  index === posts.length-1">
          <span>
            没有更多啦！
          </span>
            </a-divider>
          </div>

        </div>
        <a-skeleton v-if="loading" :animation="loading" style="display: flex;padding-bottom: 20px;">
          <a-skeleton-shape shape="circle" size="small"/>
          <a-space direction="vertical" :style="{width:'100%'}" size="large" style="margin-left: 10px;">
            <a-skeleton-line :rows="4" :widths="['10%','95%','95%','95%']"/>
          </a-space>
        </a-skeleton>

      </div>
    </div>
    <div class="right">
      addsadf
    </div>
  </div>
</template>

<script setup>

import {onMounted, onUnmounted, ref} from "vue";
import {FAVOUR_POST, GET_PAGE_POST_LIST, THUMB_POST} from "../../service/api/postApi.js";
import {STATUS_CODE} from "../../common/status.js";
import {ERROR, SUCCESS} from "../../utils/message.js";
import router from "../../router/index.js";
import {GET_TAG_LIST} from "../../service/api/tagApi.js";

const pageRequest = {
  current: 1,
  pageSize: 10,
  pages: 0,
  tags: ["编程"]
}

const studyList = ref([
  {
    title: '学习计划1',
    content: '学习计划1的内容学习计划1的内容学习计划1的内容学习计划1的内容',
    img: "https://assets.leetcode.cn/aliyun-lc-upload/study_plan_v2/top-interview-150/cover",
    href: "学习计划1"
  },
  {
    title: '学习计划2',
    content: '学习计划2的内容',
    img: "https://assets.leetcode.cn/aliyun-lc-upload/study_plan_v2/top-100-liked/cover",
    href: "学习计划2"
  },
  {
    title: '学习计划3',
    content: '学习计划3的内容',
    img: "https://assets.leetcode.cn/aliyun-lc-upload/study_plan_v2/dynamic-programming/cover",
    href: "学习计划3"
  }
])

const posts = ref([
  {
    content: "学习编程的基础知识，包括语法、数据结构和算法。",
    createTime: "2024-01-03T04:34:56.000+00:00",
    favourNum: 0,
    hasFavour: false,
    hasThumb: false,
    id: "1",
    tagList: ['编程', '基础知识', '算法'],
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

const tags = ref([])

const tagQuery = {
  belongType: "post"
}

const tagActive = ref(0)

const chooseTag = (index) => {
  tagActive.value = index
  pageRequest.tags = [tags.value[index].name]
  pageRequest.current = 1;
  pageRequest.pages = 0;
  getPosts(true)
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

const toDiscuss = (id) => {
  router.push({
    path: "/discuss",
    query: {
      id: id
    }
  })
}

const getTags = () => {
  GET_TAG_LIST(tagQuery).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      tags.value = res.data
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
  getTags()
  window.addEventListener('scroll', throttle(onBottom, 200))
})

onUnmounted(() => {
  window.removeEventListener("scroll", throttle(onBottom, 200), false)
})


</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100%;
  padding-right: 24px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  padding-top: 24px;
  position: relative;
  padding-left: 120px;


  .left {
    max-width: 862px;
    flex: 1 1 0;
    margin-right: 0.5rem;


    .top {
      margin-bottom: 1.25rem;

      .tip {
        font-size: 1rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
      }

      .contents {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.75rem;


        .content {
          display: flex;
          background: #F5F5F5;
          padding: 0.5rem;
          border-radius: 5px;
          align-items: flex-start;
          cursor: pointer;
          flex: 1 1 0;
          box-shadow: 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 1px 0 #0000001a, 0 0.5px 5px 0 #0000001a;
          overflow: hidden;
          outline: none;
          color: inherit;
          text-decoration: inherit;

          .text {

            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding-bottom: 0.25rem;
            padding-top: 0.25rem;

            .title {
              color: rgb(26 26 26);
              align-items: flex-start;
              font-weight: 500;
              font-size: 14px;
              -webkit-box-orient: vertical;
              display: -webkit-box;
              overflow: hidden;
              -webkit-line-clamp: 1;
              margin-bottom: 1rem;
            }

            .text-content {
              color: #52525299;
              font-size: 12px;
              line-height: 17px;
              -webkit-box-orient: vertical;
              display: -webkit-box;
              overflow: hidden;
              -webkit-line-clamp: 2;
            }
          }


          img {
            width: 72px;
            height: 72px;
            margin-right: 1rem;
            border-radius: 4px;
          }
        }
      }

    }

    .tags {
      &.sticky {
        position: sticky;
        top: 0;
      }

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
    }

    .posts {
      margin-top: 1rem;

      .item {
        padding-top: 1rem;
        cursor: pointer;

        .item-top {
          display: flex;

          .item-top-right {
            margin-left: 0.5rem;

            a-avatar {
              margin-right: 0.75rem
            }

            .username {
              font-size: .875rem;
              line-height: 1.25rem;
              color: #0000008c;
              overflow: hidden;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              display: -webkit-box;
            }

            .title {
              padding-top: 0.5em;
              font-size: 1rem;
              color: #1A1A1A;
              font-weight: 600;
              overflow: hidden;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              display: -webkit-box;
            }
          }
        }

        .item-bottom {
          padding-top: 0.5rem;
          margin-left: 37px;
          border-color: #00000057;

          .item-content {
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
              font-size: 16px;
              margin-right: 5px;
              color: rgb(140 140 140/1);
            }

            .thumb {
              &:hover {
                color: rgb(45 181 93/1);
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
    background: #00FFFF;
    position: static;
    padding: 0.5rem 0.5rem 1rem;
  }

}


</style>
