<template>
  <div class="app">
    <div class="app-content">
      <div class="left">
        <div class="solution">
          <div class="user">
            <a-avatar shape="circle">
              <IconUser v-if="!Boolean(solution.user.userAvatar)"/>
              <img
                  style="border-radius: 50%;"
                  v-else
                  :src="solution.user.userAvatar"
              />
            </a-avatar>
            <div class="user-info">
              <div class="user-name">{{ solution.title }}</div>
              <div class="user-profile">
                <span>{{ solution.user.userName }}</span>
                <span style="margin-left: 5px;">发起于{{ formatTime(solution.createTime, 0) }}</span>
              </div>
            </div>
          </div>
          <div class="solution-detail">
            <v-md-preview-html :html="xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(solution.content))" preview-class="github-markdown-body"></v-md-preview-html>
            <div class="solution-tag">
              <a-tag v-for="tag in solution.tagList" :key="tag" class="tag-item">{{ tag }}</a-tag>
            </div>
          </div>
          <a-divider></a-divider>
          <div class="operator">
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";;
import {STATUS_CODE} from "@/common/status.js";
import {formatTime} from "@/utils/dateParse.js";
import xss from "@kangc/v-md-editor/es/utils/xss/index.js";
import VueMarkdownEditor from "@kangc/v-md-editor";
import {GET_SOLUTION_BY_ID} from "@/service/api/solutionApi.js";

const route = useRoute()
const queryAllRequest = reactive({
  current: 0,
  pageSize: 2,
  solutionId: route.query.id,
  pages: 0,
  total: 0
})

const specialTagColor = {
  "官方": {
    color: "rgba(255,161,25, 1)",
    bgColor: "rgba(255,236.2,209, 1)"
  },
  "推荐": {
    color: "rgba(90,183,38, 1)",
    bgColor: "rgba(222,240.6,211.6, 1)"
  },
  "置顶": {
    color: "rgba(65,145,255, 1)",
    bgColor: "rgba(217,233,255, 1)"
  }
}

const solution = ref({
  id: "",
  title: "",
  content: "",
  userId: "",
  createTime: "",
  updateTime: "",
  tagList: [],
  user: {
    id: "",
    userName: "",
    userAvatar: "",
    userProfile: "",
    userRole: "",
    createTime: ""
  },
})


const getSolutionById = (id) => {
  GET_SOLUTION_BY_ID(id).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      solution.value = res.data
    }
    console.log(res)
  })
}
onMounted(() => {
  getSolutionById(route.query.id)
})
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  min-height: calc(100vh - 50px);
  background: #F7F8FA;

  .app-content {
    padding-left: 100px;
    padding-right: 24px;
    display: flex;
    padding-top: 24px;
    position: relative;
    max-width: 1200px;

    .left {
      margin-left: auto;
      margin-right: auto;
      width: 70%;
      .solution {
        border-radius: 8px;
        padding: 0 16px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08);
        background: #ffffff;

        .user {
          display: flex;
          align-items: center;
          padding: 16px 0;

          .user-info {
            margin-left: 16px;

            .user-name {
              overflow: hidden;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              display: -webkit-box;
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 6px;
              max-width: 500px;
            }

            .user-profile {
              padding-top: 5px;
              font-size: 12px;
              color: #8c8c8c;
            }
          }
        }

        .solution-detail {
          .solution-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 16px;
          }

          .solution-content {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 16px;
          }

          .solution-tag {
            margin-bottom: 16px;

            .tag-item {
              margin-right: 8px;
            }
          }
        }

        .operator {
          display: flex;
          align-items: center;
          padding: 10px 0 20px 0;
          gap: 1.5rem;

          .icon {
            cursor: pointer;
            font-size: 18px;
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

          .pushBtn {
            border-radius: 10px;
            margin-left: auto;
            margin-right: 0.5rem;
          }
        }
      }

      .reply {
        display: flex;
        align-items: center;
        border-radius: 8px;
        padding: 0 16px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08);
        background: #ffffff;
        margin: 10px 0;
        height: 40px;

        .replyNum {
          font-size: 12px;
          color: rgba(191, 191, 191, 1);
        }
      }

      .reply-item {
        border-radius: 8px;
        padding: 0 16px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08);
        background: #ffffff;

        &:not(:first-child) {
          margin-top: 10px;
        }

        &:last-child {
          margin-bottom: 10px;
        }

        .user {
          display: flex;
          align-items: center;
          padding: 16px 0;

          .user-name {
            font-size: 13px;
            color: rgba(191, 191, 191, 1);
            margin-left: 16px;
          }

          .createTime {
            margin-left: auto;
            font-size: 12px;
            color: rgba(191, 191, 191, 1);
          }

        }

        .reply-operator {
          display: flex;
          align-items: center;
          padding: 10px 0 20px 0;
          gap: 1.5rem;

          .icon {
            cursor: pointer;
            font-size: 18px;
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

          .pushBtn {
            border-radius: 10px;
            margin-left: auto;
            margin-right: 0.5rem;
          }
        }

        .expand {
          /* 默认样式，这里假设内容高度会动态变化 */
          .childrenComment {
            padding: 0 10px 10px 10px;
            background: rgba(247, 247, 247, 1);
            border-radius: 7px;
            margin-bottom: 12px;

            .user {
              display: flex;
              align-items: center;
              padding: 16px 0;

              .user-name {
                align-items: center;
                font-size: 14px;
                color: rgba(140, 140, 140, 1);
                margin-left: 10px;
              }

              .createTime {
                margin-left: auto;
                font-size: 12px;
                color: rgba(191, 191, 191, 1);
              }

            }

            .children-content {
              padding: 10px 0;
            }

            .children-operator {
              display: flex;
              align-items: center;
              padding: 0;
              gap: 1.5rem;

              .icon {
                cursor: pointer;
                font-size: 18px;
                margin-right: 5px;
                color: rgb(140 140 140/1);
              }

              .thumb {
                cursor: pointer;

                &:hover {
                  color: rgb(45 181 93/1);
                }
              }

              .pushBtn {
                border-radius: 10px;
                margin-left: auto;
                margin-right: 0.5rem;
              }
            }
          }
        }


      }

      .pagination {
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
      }
    }

    .right {
      position: static;
      padding: 0.5rem 0.5rem 1rem;

      .body {
        background: rgba(255, 255, 255, 1);
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08);
        user-select: none;
        min-width: 200px;
        padding: 20px 15px;

        .rank {
          .tip {
            font-size: 18px;
            line-height: 20px;
            font-weight: 700;
            font-style: italic;
            color: rgba(255, 161, 22, 1);
            margin-bottom: 10px;
          }

          .rank-item {
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: justify;
            justify-content: space-between;
            line-height: 22px;
            margin-bottom: 15px;

            .label {
              line-height: 18px;
              color: rgba(140, 140, 140, 1);
            }

            .value {
              background: rgba(247, 247, 247, 1);
              color: rgba(38, 38, 38, 1);
              border-radius: 3px;
              padding: 0 8px;
              line-height: 22px;
            }


          }

          .label {
            line-height: 18px;
            color: rgba(140, 140, 140, 1);
          }

          .tags {
            .tag {
              margin-right: 10px;
              user-select: none;
              font-size: 12px;
              line-height: 20px;
              display: inline-flex;
              -webkit-box-align: center;
              align-items: center;
              -webkit-box-pack: center;
              justify-content: center;
              text-decoration: none;
              transition-property: color, background-color;
              transition-duration: 0.3s;
              white-space: nowrap;
              color: rgba(38, 38, 38, 1);
              background-color: rgba(0, 10, 32, 0.05);
              padding: 0 6px;
              min-width: 40px;
              border-radius: 10px;
              margin-top: 10px;
            }
          }
        }
      }

    }
  }


}
</style>
