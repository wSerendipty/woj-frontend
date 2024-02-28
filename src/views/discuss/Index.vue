<template>
  <div class="app">
    <div class="app-content">
      <div class="left">
        <div class="post">
          <div class="user">
            <a-avatar>
              <IconUser v-if="!Boolean(post.user.userAvatar)"/>
              <img
                  v-else
                  alt="avatar"
                  :src="post.user.userAvatar"
              />
            </a-avatar>
            <div class="user-info">
              <div class="user-name">{{ post.title }}</div>
              <div class="user-profile">
                <span>{{ post.user.userName }}</span>
                <span style="margin-left: 5px;">发起于{{ formatTime(post.createTime, 0) }}</span>
              </div>
            </div>
          </div>
          <div class="post-detail">
            <v-md-preview-html :html="xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(post.content))" preview-class="github-markdown-body"></v-md-preview-html>
            <div class="post-tag">
              <a-tag v-for="tag in post.tagList" :key="tag" class="tag-item">{{ tag }}</a-tag>
            </div>
          </div>
          <a-divider></a-divider>
          <div class="operator">
            <div>
              <icon-thumb-up class="icon thumb" v-if="!post.hasThumb" @click="thumb(post.id)"/>
              <icon-thumb-up-fill style="color:rgb(45, 181, 93)" v-if="post.hasThumb" class="icon"
                                  @click="thumb(post.id)"/>
              <span>{{ post.thumbNum }}</span>
            </div>
            <div class="favour">
              <icon-star class="icon favour" v-if="!post.hasFavour" @click="favour(post.id)"/>
              <icon-star-fill style="color:rgb(255, 161, 22)" v-if="post.hasFavour" class="icon"
                              @click="favour(post.id)"/>
              <span :style="{color:post.hasFavour?'rgb(255, 161, 22)':''}">{{ post.favourNum }}</span>
            </div>
            <a-button type="primary" class="pushBtn" status="success" @click="postCommentAdd(null,post.userId)">
              <template #icon>
                <icon-pen/>
              </template>
              回复讨论
            </a-button>

          </div>
        </div>
        <div class="reply">
          <div class="replyNum">
            共{{ post.commentNum }}个回复
          </div>
          <!--          <div class="order"></div>-->
        </div>
        <div class="reply-item" v-for="item in commentList">
          <div class="user">
            <a-avatar>
              <IconUser v-if="!Boolean(item.createUser.userAvatar)"/>
              <img
                  v-else
                  alt="avatar"
                  :src="item.createUser.userAvatar"
              />
            </a-avatar>
            <div class="user-name" style="display: flex">{{ item.createUser.userName }}
              <div v-if="item.userId === post.userId" style="margin-left: 5px;">(楼主)</div>
            </div>
            <div class="createTime">{{ formatTime(item.createTime, 0) }}</div>
          </div>
          <div class="reply-detail">
            <v-md-preview-html :html="xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(item.content))" preview-class="github-markdown-body"></v-md-preview-html>
<!--            <div class="reply-content"-->
<!--                 v-html="xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(item.content))"></div>-->
            <a-divider></a-divider>
            <div class="reply-operator">
              <div>
                <icon-thumb-up class="icon thumb" v-if="!item.hasThumb" @click="thumbComment(item.id)"/>
                <icon-thumb-up-fill style="color:rgb(45, 181, 93)" v-if="item.hasThumb" class="icon"
                                    @click="thumbComment(item.id)"/>
                <span>{{ item.thumbNum }}</span>
              </div>
              <div class="message" v-if="!item.unfold" @click="getChildrenCommentBtn(item.id,item.unfold)">
                <icon-message class="icon"/>
                <span>{{ item.replyNum }}</span>
              </div>
              <div class="message" v-else @click="getChildrenCommentBtn(item.id,item.unfold)">
                <icon-double-up class="icon"/>
                <span>收起 {{ item.replyNum }}</span>
              </div>
              <a-button type="text" class="pushBtn" status="success" @click="commentAdd(item.id,item.userId)">
                <template #icon>
                  <icon-pen/>
                </template>
                添加回复
              </a-button>
            </div>
            <MyTransition mode="out-in" name="expand-fade">

              <div v-if="item.unfold" class="expand">
                <div style="padding-bottom: 16px;">
                  <div class="childrenComment" v-for="children in item.childrenComment">
                    <div class="children-top">
                      <div class="user">
                        <a-avatar :size="22">
                          <IconUser v-if="!Boolean(item.createUser.userAvatar)"/>
                          <img
                              v-else
                              alt="avatar"
                              :src="item.createUser.userAvatar"
                          />
                        </a-avatar>
                        <div class="user-name" style="display: flex">
                          <span>{{ children.createUser.userName }}</span>
                          <span v-if="children.userId === post.userId" style="margin-left: 5px;">(楼主)</span>
                          <icon-caret-right style="margin: 0 10px;"/>
                          <span>{{ children.toUser.userName }}</span>
                          <span v-if="children.toUserId === post.userId" style="margin-left: 5px;">(楼主)</span>
                        </div>
                        <div class="createTime">{{ formatTime(children.createTime, 0) }}</div>
                      </div>
                    </div>
                    <v-md-preview-html :html="xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(children.content))" preview-class="github-markdown-body"></v-md-preview-html>
<!--                    <div class="children-content"-->
<!--                         v-html="xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(children.content))"></div>-->
                    <a-divider :margin="15"></a-divider>
                    <div class="children-operator">
                      <div>
                        <icon-thumb-up class="icon thumb" v-if="!children.hasThumb"
                                       @click="thumbCommentChildren(children.id)"/>
                        <icon-thumb-up-fill style="color:rgb(45, 181, 93)" v-if="children.hasThumb" class="icon"
                                            @click="thumbCommentChildren(children.id)"/>
                        <span>{{ children.thumbNum }}</span>
                      </div>
                      <div class="message">
                        <icon-message/>
                        <span>{{ children.replyNum }}</span>
                      </div>
                      <a-button type="text" class="pushBtn" status="warning"
                                @click="commentAdd(children.parentId,children.userId)">
                        <template #icon>
                          <icon-pen/>
                        </template>
                        添加回复
                      </a-button>
                    </div>
                  </div>
                </div>

              </div>
            </MyTransition>

          </div>
        </div>
        <a-pagination class="pagination" @change="onchange" :size="'large'" v-model:page-size="queryAllRequest.pageSize"
                      :total="queryAllRequest.total"/>
      </div>
      <div class="right">
        <div class="body">
          <div class="rank">
            <div class="tip">
              Status
            </div>
            <div class="rank-item">
              <div class="label">
                收藏次数
              </div>
              <div class="value">
                {{ post.favourNum }}
              </div>
            </div>
            <div class="rank-item">
              <div class="label">
                点赞次数
              </div>
              <div class="value">
                {{ post.thumbNum }}
              </div>
            </div>
            <div class="rank-item">
              <div class="label">
                参与人数
              </div>
              <div class="value">
                {{ post.commentNum }}
              </div>
            </div>
            <a-divider/>
            <div class="label">相关标签</div>
            <div class="tags">
              <div class="tag" :style="{color:specialTagColor[special].color,background:specialTagColor[special].bgColor}" v-for="special in post.specialTagList">
                <span> {{ special }}</span>
              </div>
              <div v-for="tag in post.tagList" :key="tag" class="tag">{{ tag }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <transition duration="0.3">
    <KeepAlive>
      <MdEditorVue class="mdEditor" v-if="editorShow" @EditorEvent="handleChildEvent" :message="'回复帖子'"
                   :title-input="false"></MdEditorVue>
    </KeepAlive>
  </transition>

</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {ERROR, NOTIFICATION_WARNING, SUCCESS} from "@/utils/message.js";
import MdEditorVue from "@/components/mdEditor/MdEditorVue.vue";
import {
  ADD_POST_COMMENT,
  GET_CHILDREN_COMMENT_BY_COMMENT_ID,
  GET_TOP_COMMENT_BY_POST_ID,
  THUMB_POST_COMMENT
} from "@/service/api/postCommentApi.js";
import {FAVOUR_POST, GET_POST_BY_ID, THUMB_POST} from "@/service/api/postApi.js";
import {STATUS_CODE} from "@/common/status.js";
import {formatTime} from "@/utils/dateParse.js";
import MyTransition from "@/components/utils/MyTransition.vue";
import xss from "@kangc/v-md-editor/es/utils/xss/index.js";
import VueMarkdownEditor from "@kangc/v-md-editor";
import store from "@/store/index.js";
import {ACCESS_ENUM} from "@/access/accessEnum.js";

const route = useRoute()
const queryAllRequest = reactive({
  current: 0,
  pageSize: 2,
  postId: route.query.id,
  pages: 0,
  total: 0
})

const queryChildrenRequest = reactive({
  current: 0,
  pageSize: 10,
  commentId: 0,
  postId: route.query.id,
  pages: 0
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

const post = ref({
  id: "",
  title: "",
  content: "",
  thumbNum: 0,
  favourNum: 0,
  commentNum: 0,
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
  hasThumb: false,
  hasFavour: false
})

const commentList = ref([
  {
    id: "",
    postId: "1",
    userId: "",
    parentId: null,
    content: "",
    thumbNum: 0,
    replyNum: 0,
    hasThumb: true,
    hasReply: true,
    status: 0,
    createUser: {
      id: "",
      userName: "",
      userAvatar: "",
      userProfile: "",
      userRole: "",
      createTime: ""
    },
    createTime: "",
    updateTime: "",
    unfold: false,
    childrenComment: [
      {
        id: "2",
        postId: "1745363592196186113",
        userId: "1740669921274191873",
        parentId: "1",
        toUserId: "1743170947961077761",
        content: "回复楼主，支持一下",
        thumbNum: 5,
        replyNum: 0,
        hasThumb: false,
        hasReply: false,
        status: 1,
        createUser: {
          id: "1740669921274191873",
          userName: "2251",
          userAvatar: "https://assets.leetcode.cn/liyun-lc-upload/uploaded_files/2021/03/73c9f099-abbe-4d94-853f-f8abffd459cd/leetcode.png?x-oss-process=image%2Fformat%2Cwebp",
          userProfile: "力扣官方",
          userRole: "user",
          createTime: "2023-12-29T09:43:43.000+00:00"
        },
        toUser: {
          id: "1743170947961077761",
          userName: "管理员",
          userAvatar: "https://assets.leetcode.cn/aliyun-lc-upload/users/jolly-buckgxm/avatar_1615203125.png",
          userProfile: "管理员",
          userRole: "admin",
          createTime: "2024-01-05T07:21:55.000+00:00"
        },
        createTime: "2024-01-12T04:46:31.000+00:00",
        updateTime: "2024-01-12T04:47:49.000+00:00"
      }
    ]
  }
])

const postCommentAddRequest = reactive({
  content: "",
  parentId: 0,
  postId: route.query.id,
  toUserId: 0
})

const editorShow = ref(false)


const postCommentAdd = (id, toUserId) => {
  if(store.getters.userInfo.userRole === ACCESS_ENUM.NOT_LOGIN){
    NOTIFICATION_WARNING("提示","请先登录")
  }else {
    postCommentAddRequest.parentId = id
    postCommentAddRequest.toUserId = toUserId
    postCommentAddRequest.postId = post.value.id
    editorShow.value = true
  }
}
const commentAdd = (id, toUserId) => {
  if(store.getters.userInfo.userRole === ACCESS_ENUM.NOT_LOGIN){
    NOTIFICATION_WARNING("提示","请先登录")
  }else {
    postCommentAddRequest.parentId = id
    postCommentAddRequest.toUserId = toUserId
    postCommentAddRequest.postId = post.value.id
    editorShow.value = true
  }

}


const getCommentByPostId = () => {
  if (queryAllRequest.current > queryAllRequest.pages) {
    return
  }
  GET_TOP_COMMENT_BY_POST_ID(queryAllRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      for (let i = 0; i < res.data.records.length; i++) {
        res.data.records[i].unflod = false
      }
      commentList.value = res.data.records
      queryAllRequest.current++;
      queryAllRequest.total = Number(res.data.total)
      queryAllRequest.pages = Number(res.data.pages)
    }
    console.log(res)
  })
}

const onchange = (current) => {
  queryAllRequest.current = current
  getCommentByPostId()
}

const getPostById = (id) => {
  GET_POST_BY_ID(id).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      post.value = res.data
    }
    console.log(res)
  })
}

const thumb = (id) => {
  THUMB_POST(id).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      if (res.data === 1) {
        post.value.hasThumb = true
        post.value.thumbNum++
        SUCCESS("点赞成功")
      } else {
        post.value.hasThumb = false
        post.value.thumbNum--
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
        post.value.hasFavour = true
        post.value.favourNum++
        SUCCESS("收藏成功")
      } else {
        post.value.hasFavour = false
        post.value.favourNum--
        SUCCESS("取消收藏成功")
      }

    } else {
      ERROR("收藏失败")
    }
  }).catch(err => {

  })
}


const thumbComment = (id) => {
  THUMB_POST_COMMENT(id).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      if (res.data === 1) {
        for (let i = 0; i < commentList.value.length; i++) {
          if (commentList.value[i].id === id) {
            commentList.value[i].hasThumb = true
            commentList.value[i].thumbNum++
            break
          }
        }
        SUCCESS("点赞成功")
      } else {
        for (let i = 0; i < commentList.value.length; i++) {
          if (commentList.value[i].id === id) {
            commentList.value[i].hasThumb = false
            commentList.value[i].thumbNum--
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

const thumbCommentChildren = (id) => {
  THUMB_POST_COMMENT(id).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      if (res.data === 1) {
        for (let i = 0; i < commentList.value.length; i++) {
          if (commentList.value[i].childrenComment) {
            for (let j = 0; j < commentList.value[i].childrenComment.length; j++) {
              if (commentList.value[i].childrenComment[j].id === id) {
                commentList.value[i].childrenComment[j].hasThumb = true
                commentList.value[i].childrenComment[j].thumbNum++
                break
              }
            }
          }
        }
        SUCCESS("点赞成功")
      } else {
        for (let i = 0; i < commentList.value.length; i++) {
          if (commentList.value[i].childrenComment) {
            for (let j = 0; j < commentList.value[i].childrenComment.length; j++) {
              if (commentList.value[i].childrenComment[j].id === id) {
                commentList.value[i].childrenComment[j].hasThumb = false
                commentList.value[i].childrenComment[j].thumbNum--
                break
              }
            }
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

const getChildrenCommentBtn = (id, unfold) => {
  let index = 0
  for (let i = 0; i < commentList.value.length; i++) {
    if (commentList.value[i].id === id) {
      index = i
      break
    }
  }
  if (!commentList.value[index].childrenComment) {
    queryChildrenRequest.current = 0
    queryChildrenRequest.pages = 0
    getChildrenComment(id)
    return
  }

  commentList.value[index].unfold = !unfold

}

const getChildrenComment = (id) => {
  queryChildrenRequest.commentId = id
  GET_CHILDREN_COMMENT_BY_COMMENT_ID(queryChildrenRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      queryChildrenRequest.current = res.data.pages
      queryChildrenRequest.current++
      for (let i = 0; i < commentList.value.length; i++) {
        if (commentList.value[i].id === id) {
          commentList.value[i].unfold = true
          commentList.value[i].childrenComment = [...res.data.records]
          break
        }
      }
      console.log(commentList.value)
    }
  })

}

const addPostComment = () => {
  ADD_POST_COMMENT(postCommentAddRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      queryAllRequest.current = 0
      editorShow.value = false
      SUCCESS("回复成功")
      if (postCommentAddRequest.parentId === null) {
        post.value.commentNum++
      }
      getCommentByPostId()
    } else {
      ERROR(res.message)
    }
  })
}


const emitMessage = {
  cancel: 'cancel',  // 取消
  push: "push",  // 发布
}
const handleChildEvent = (msg) => {
  if (msg === emitMessage.cancel) {
    editorShow.value = false
  } else {
    postCommentAddRequest.content = msg.value.content
    addPostComment()
    console.log(msg)
  }
}

onMounted(() => {
  getPostById(route.query.id)
  getCommentByPostId()
})
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  min-height: calc(100vh - 100px);
  background: #F7F8FA;

  .app-content {
    padding-left: 250px;
    padding-right: 24px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    padding-top: 24px;
    position: relative;
    max-width: 1200px;

    .left {

      width: 60%;
      margin-right: 24px;

      .post {
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

        .post-detail {
          .post-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 16px;
          }

          .post-content {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 16px;
          }

          .post-tag {
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
