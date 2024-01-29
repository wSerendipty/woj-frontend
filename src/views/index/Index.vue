<template>
  <div class="app">
    <div class="left">
      <div class="top">
        <div class="tip">
          学习计划
          <icon-right/>
        </div>
        <div class="contents">
          <div class="content" v-for="item in studyList" @click="toStudy(item.href)">
            <img :src="item.img " :alt="item.title"/>
            <div class="text">
              <div class="title">
                {{ item.title }}
              </div>
              <div class="text-content">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tags sticky"
      >
        <div class="tag" v-for="(item,index) in tags"
             :class="index === tagActive?'active':''"
             @click="chooseTag(index)">
          {{ item }}
        </div>
      </div>
      <div class="posts">
        <a-empty v-if="posts.length === 0"/>
        <div class="item" v-for="(item,index) in posts">
          <div class="item-top" @click="toDiscuss(item.id)">
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
              <div class="message">
                <icon-message class="icon" @click="toDiscuss(item.id)"/>
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
      <div class="body">
        <div class="content">
          <div class="top">
            <div style="display: flex;padding: 10px 10px 0 0 ">
              <div v-for="item in weeks" class="weeks" :class="new Date().getDate() === item.date?'today':''">
                <div class="week" :class="['SUN', 'SAT'].includes(item.dayOfWeek)?'relax':''">{{ item.dayOfWeek }}</div>
                <div class="day todayDate" v-if="new Date().getDate() === item.date">今</div>
                <div class="day" v-else>{{ item.date }}</div>
              </div>
            </div>

          </div>
          <div class="middle" @click="router.push({
          path:'/problem/do',
          query:{
            name:'detail',
            type:'daily',
            id:dailyQuestion.id
          }
          })">
            <div class="tip">
              <icon-fire style="margin-right: 3px;"/>
              每日 1 题
            </div>
            <div class="question">{{ dailyQuestion.id }}. {{ dailyQuestion.title }}</div>
          </div>
          <a-divider :margin="15"/>
          <div class="bottom">
            <div class="logout-result" v-if="store.getters.userInfo.userRole === ACCESS_ENUM.NOT_LOGIN">
              <div class="tip"> 欢迎来到-WOJ</div>
              <div class="goButton">
                <a-button class="register" @click="router.push({path:'/user/register'})">注册</a-button>
                <a-button class="login" @click="router.push({path:'/user/login'})">登录</a-button>
              </div>

            </div>
            <div class="itemDays" v-else>
              <svg viewBox="0 0 230.62 107.02">
                <g :transform="`translate(${1+(index1*55)},0)`" :class="'month '+(index1+1)"
                   v-for="(month,index1) in preDays">
                  <g :transform="`translate(${1+(index2 *11)},0)`" :class="'week '+(index2+1)"
                     v-for="(week,index2) in month.weeks">
                    <rect v-for="(item,index3) in week" x="1" :y="11*index3" width="8.86" height="8.86"
                          :fill="questionFinish.includes(item)?'#008024':'var(--fill-tertiary)'" rx="2" ry="2"
                          class="cursor-pointer"
                          :id="'rect-'+index1+'-'+index2+'-'+index3"
                          :data-state="questionFinish.includes(item)"
                          :data-date="item"
                          @mouseover="handleHover"
                          @mouseleave="handleLeave"
                    ></rect>
                  </g>
                </g>
                <text v-for="(month,index) in preDays" :x="10.825+(index*55)" y="96.52" font-size="10px" fill="#AFB4BD"
                      class="font-xs">{{ month.month }}月
                </text>
              </svg>
            </div>

          </div>
        </div>

      </div>
    </div>
    <div v-if="hoverFlag" :style="{top:rectY+'px',left:rectX+'px'}"
         class="tooltip">
      {{ tooltipText }}
    </div>
  </div>
</template>

<script setup>

import {onMounted, onUnmounted, ref} from "vue";
import {FAVOUR_POST, GET_PAGE_POST_LIST, THUMB_POST} from "@/service/api/postApi.js";
import {STATUS_CODE} from "@/common/status.js";
import {ERROR, SUCCESS} from "@/utils/message.js";
import router from "@/router/index.js";
import {getNextWeek, groupDatesByMonthAndWeek} from "@/utils/getDate.js";
import {GET_DAILY_QUESTION, GET_QUESTION_FINISH} from "@/service/api/questionApi.js";
import {PostTags} from "@/common/tag/postTagConstants.js";
import store from "@/store/index.js";
import {ACCESS_ENUM} from "@/access/accessEnum.js";
import {formatTime} from "@/utils/dateParse.js";
import _ from "lodash";


const pageRequest = {
  current: 1,
  pageSize: 10,
  pages: 0,
  tags: ["编程"]
}

const weeks = ref(getNextWeek())
const preDays = ref(groupDatesByMonthAndWeek())
const dailyQuestion = ref({})
const dailyRequest = {
  belongType: "question",
}
const studyList = ref([
  {
    title: '编程学习路线',
    content: '包含 Java、前端、C++、Python、SQL、计算机基础、数据结构和算法、Git & GitHub、Linux、设计模式等多个精心编写的学习路线，帮助程序员快速入门。',
    img: "https://assets.leetcode.cn/aliyun-lc-upload/study_plan_v2/top-interview-150/cover",
    href: "/docs/index.html"
  },
  {
    title: '技术知识分享',
    content: '通过简单的技术知识分享，帮助大家快速学习或复习巩固项目开发中的重点知识，便于把控学习进度、并且持续加深印象。',
    img: "https://assets.leetcode.cn/aliyun-lc-upload/study_plan_v2/top-100-liked/cover",
    href: "/docs/index.html"
  },
  {
    title: '编程干货分享',
    content: '编程学习指南、开发经验、求职经验、职场经验、技术分享、实战教程、项目教程、个人作品、编程资源等，做最接地气的编程干货分享。',
    img: "https://assets.leetcode.cn/aliyun-lc-upload/study_plan_v2/dynamic-programming/cover",
    href: "/docs/index.html"
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
const tags = ref(PostTags)
const rectX = ref(1000);
const rectY = ref(10);
const tooltipText = ref('');

const tagActive = ref(0)

const hoverFlag = ref(false)
const questionFinish = ref([])

const questionStatusQueryRequest = {
  type: "normal"
}

const getQuestionFinish = () => {
  GET_QUESTION_FINISH(questionStatusQueryRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      questionFinish.value = res.data.questionStatusVOList.map(item =>
          formatTime(item.createTime, 0)
      )
    }
  })
}

const handleHover = (e) => {
  const date = e.target.dataset.date
  if (e.target.dataset.state === "true") {
    // 遍历questionFinish 查询有几个该日期
    let count = 0
    for (let i = 0; i < questionFinish.value.length; i++) {
      if (questionFinish.value[i] === date) {
        count++
      }
    }
    tooltipText.value = date + " 提交 " + count + " 次"
  } else {
    tooltipText.value = date + " 未提交"
  }
  const element = document.querySelector(`#${e.target.id}`);
  const rect = element.getBoundingClientRect();
  rectX.value = parseInt(rect.left) - 70;
  rectY.value = parseInt(rect.top) - 80;
  hoverFlag.value = true
}

const handleLeave = (e) => {
  hoverFlag.value = false
  console.log(e.target.dataset.state)
}

const chooseTag = (index) => {
  tagActive.value = index
  pageRequest.tags = [tags.value[index]]
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

const toStudy = (href) => {
  window.open(href)
}

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

const getDailyQuestion = () => {
  GET_DAILY_QUESTION(dailyRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      dailyQuestion.value = res.data
    }
  })
}

onMounted(() => {
  getPosts(true)
  getDailyQuestion()
  if (store.getters.userInfo.userRole !== ACCESS_ENUM.NOT_LOGIN) {
    getQuestionFinish()
  }
  window.addEventListener('scroll', _.debounce(onBottom, 250))
})

onUnmounted(() => {
  console.log("unmount")
  window.removeEventListener("scroll", _.debounce(onBottom,250), false)
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
              max-width: 500px;
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
    position: static;
    padding: 0.5rem 0.5rem 1rem;
    height: 500px;

    .body {
      box-shadow: 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 1px 0 #0000001a, 0 0.5px 5px 0 #0000001a;
      border: 1px solid #eeeeee;
      border-radius: 6px;
      min-height: 240px;
      width: 340px;

      .content {
        width: 95%;
        margin: 0 auto;

        .top {
          .weeks {
            padding: 2px;
            display: flex;
            flex-direction: column;
            border-radius: 6px;
            text-align: center;
            cursor: pointer;
            flex: 1 1 0;

            &.today {
              background: #0000000f;
            }

            .week {
              font-weight: 600;
              font-size: .75rem;
              color: #00000057;
              margin-bottom: 4px;

              &.relax {
                color: rgb(239 71 67/1);;
              }
            }

            .day {
              color: #0000008c;
              font-weight: 600;
              font-size: 13px;

              &.todayDate {
                color: #1A1A1A;
                font-weight: 600;
              }
            }

            &:hover {
              background: #0000000f;
            }
          }
        }

        .middle {
          margin: 10px auto;
          border-radius: 6px;
          padding: 10px;
          background: #F5F5F5;
          cursor: pointer;

          &:hover {
            background: #0000000f;
          }

          .tip {
            color: rgb(27, 163, 255);
            font-size: 12px;
            display: flex;
            align-items: center;
            margin-bottom: .75rem;
          }

          .question {
            color: #1a1a1a;
            font-size: .875rem;
            line-height: 1.25rem;
          }
        }

        .bottom {
          width: 100%;

          .logout-result {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .tip {
              color: #0000008c;
              font-size: .875rem;
              line-height: 1.25rem;
              text-align: center;
            }

            .goButton {
              width: 100%;
              display: flex;
              justify-content: space-between;
              margin-top: 1rem;

              .register {
                border-radius: 6px;
                width: 48%;
                background: #1A1A1A;
                color: #F5F5F5;
                border-color: #1A1A1A;
              }

              .login {
                border-radius: 6px;
                width: 48%;
                background: #1A1A1A;
                color: #F5F5F5;
                border-color: #1A1A1A;
              }
            }
          }

          .itemDays {
            display: flex;

            .cursor-pointer {
              cursor: pointer;
              color: #F5F5F5;
            }

            .itemDay {
              width: 10px;
              height: 10px;
              border-radius: 2px;
              background: #F5F5F5;
              cursor: pointer;

              &:hover {
                background: #0000000f;
              }
            }
          }

          .months {
            .month {

            }
          }

        }
      }


    }
  }

  .tooltip {
    box-shadow: 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 #0000, 0 0 1px 0 #0000001a, 0 0.5px 5px 0 #0000001a;
    border: 1px solid #eeeeee;
    position: absolute;
    background-color: #fff;
    border-radius: 5px;
    padding: 4px 8px;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none; /* 避免遮挡鼠标事件 */
    z-index: 999;
  }

}


</style>
