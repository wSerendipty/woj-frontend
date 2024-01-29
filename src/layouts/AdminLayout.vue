<template>
  <div class="adminLayout">
    <a-layout >
      <a-layout-header class="header">
        <div class="nav-bar">
          <a-menu class="menu" mode="horizontal" :selected-keys="selectKeys"
                  @menu-item-click="onClick">
            <a-menu-item key="0" disabled class="logo-item">
              <div class="logo" @click="router.push({path:'/index'})">
                <img src="../assets/imgs/logo.png" alt="加载失败">
                <div class="title">
                  OJ判题系统
                </div>
              </div>
            </a-menu-item>
            <a-menu-item key="/menu/study">学习</a-menu-item>
            <a-menu-item key="/menu/problems">题库</a-menu-item>
<!--            <a-menu-item key="/menu/contest">竞赛</a-menu-item>-->
            <a-menu-item key="/menu/circle">讨论</a-menu-item>
            <a-menu-item key="/admin/userManage/userInfo" v-if="loginUser.userRole === ACCESS_ENUM.ADMIN">管理后台</a-menu-item>
          </a-menu>
          <div class="right">
            <div v-if="loginUser.userRole !== ACCESS_ENUM.NOT_LOGIN" style="display: flex;align-items: center">
              <a-dropdown @select="handleSelect">
                <a-avatar  class="avatar">
                  <img
                      alt="avatar"
                      :src="loginUser.userAvatar"
                  />
                </a-avatar>
                <template #content>
                  <a-doption value="0">
                    <div class="dropdown-item">
                      <icon-user class="icon"/>
                      用户中心
                    </div>
                  </a-doption>
                  <a-doption value="1">
                    <div class="dropdown-item">
                      <icon-settings class="icon"/>
                      用户设置
                    </div>
                  </a-doption>
                  <a-doption value="2">
                    <div class="dropdown-item">
                      <icon-safe class="icon"/>
                      账号安全
                    </div>
                  </a-doption>
                  <a-doption value="3">
                    <div class="dropdown-item">
                      <icon-export class="icon"/>
                      登出登录
                    </div>
                  </a-doption>

                </template>
              </a-dropdown>

            </div>
            <div v-else style="display: flex;align-items: center">
              <a-button type="text" style="color: var(--color-neutral-8); font-size: 1rem;"
                        @click="router.push({path:'/user/register'})">注册
              </a-button>
              <div style="margin:0 5px">或</div>
              <a-button type="text" style="color: var(--color-neutral-8); font-size: 1rem;"
                        @click="router.push({path:'/user/login'})">登录
              </a-button>
            </div>

          </div>
        </div>
      </a-layout-header>
      <a-layout>
        <a-layout-sider class="side" style="width: v-bind(sideWidth)">
          <SideVue  @updateWidth="updateWidth"></SideVue>
        </a-layout-sider>
        <a-layout-content class="content">
          <a-scrollbar style="height:90vh;overflow: auto;">
            <div >
              <div class="breadcrumb">
                <a-breadcrumb>
                  <a-breadcrumb-item>
                    <icon-apps />
                  </a-breadcrumb-item>
                  <a-breadcrumb-item v-for="item in breadcrumb">{{item}}</a-breadcrumb-item>
                </a-breadcrumb>
              </div>
              <router-view class="router-view"></router-view>
            </div>
          </a-scrollbar>

        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import {ACCESS_ENUM} from "@/access/accessEnum.js";
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref, watch} from "vue";
import store from "@/store/index.js";
import {LOGOUT} from "@/service/api/userApi.js";
import {STATUS_CODE} from "@/common/status.js";
import {SUCCESS} from "@/utils/message.js";
import SideVue from "@/components/SideVue.vue";
const router = useRouter();
const loginUser = computed(() => {
  return store.getters.userInfo;
})
const breadcrumbMap = {
  'userManage': '用户管理',
  'userInfo': '用户信息',
  'problemManage': '题目管理',
  'problemInfo': '题目信息',
  'problemTemplate': '题目模板',
  'runManage': '运行管理',
  'submitManage': '提交管理',
  'postManage': '帖子管理',
  'postInfo': '帖子信息',
  'postThumb': '帖子点赞',
  'postFavour': '帖子收藏',
  'tagManage': '标签管理',
  'postComment': '帖子评论',
  'commentInfo': '评论信息',
  'commentThumb': '评论点赞',
  'contestManage': '竞赛管理',
  'contestInfo': '竞赛信息',
  'joinManage': '报名管理',
  'contestProblem': '竞赛题目',
  'contestProblemInfo': '竞赛题目信息',
  'contestProblemSubmit': '竞赛题目提交',
}
const route = useRoute()
const breadcrumb = ref([])

const selectKeys = ref([route.path]);
watch(() => route.path, (val) => {
  selectKeys.value = [val];
  getBreadcrumb()
})

const getBreadcrumb = () =>{
  breadcrumb.value = []
  const pathSplit = route.path.split('/')
// 遍历pathSplit，将每个path对应的中文名字放入breadcrumb中
  for (let i = 2; i < pathSplit.length; i++) {
    breadcrumb.value.push(breadcrumbMap[pathSplit[i]])
  }
}

const onClick = (key) => {
  if (key === '/menu/study') {
    window.open('/docs/index.html')
    return;
  }
  router.push({path: key});
}

const handleSelect = (v) => {

  switch (v){
    case '0':
      router.push({path:'/user/userInfo'})
      break;
    case '1':
      router.push({path:'/user/userSetting'})
      break;
    case '2':
      router.push({path:'/user/accountSecurity'})
      break;
    case '3':
      LOGOUT().then(res => {
        if (res.code === STATUS_CODE.SUCCESS_CODE) {
          SUCCESS("注销成功")
          store.dispatch('getUserInfo')
        }
      })
      break;
    default
    :
      break;
  }
}

const sideWidth = ref('200px')

const updateWidth = (width) => {
  sideWidth.value = width
}

onMounted(() => {
  getBreadcrumb()
})

</script>

<style lang="scss" scoped>
.adminLayout{
  width: 100%;
  height: 100vh;
  .header {
    border-bottom: 1px solid #00000014;
    width: 100%;
    height: 50px;
    .nav-bar {
      height: 100%;
      display: flex;
      position: relative;

      .menu {
        height: 100%;
        width: 60%;

        .logo-item {
          cursor: pointer;

          .logo {
            display: flex;
            align-items: center;

            img {
              width: 28px;
              height: 28px;
              margin-right: 10px;
              vertical-align: middle;
              color: #000;
            }

            .title {
              font-size: 16px;
              font-weight: 600;
              color: #000;
            }
          }


        }
        :deep(.arco-menu-inner) {
          overflow: unset;
        }
        .arco-menu-item {
          color: rgba(0, 0, 0, 0.55);
          line-height: 1.5;
          font-size: 1rem;

          &:hover {
            color: #000;
            background-color: #fff;
          }
        }

        .arco-menu-selected {
          color: #000;

          :deep(.arco-menu-selected-label) {
            background: #000;
            height: 2.5px;
            bottom: -12px;
          }
        }
      }

      .right {
        display: flex;
        align-items: center;
        position: absolute;
        margin-left: 40px;
        right: 8%;
        top: 50%;
        bottom: 50%;

        .search {
          width: 180px;
          border-radius: 8px;
          margin-right: 15px;
        }

        .arco-input-focus {
          border-color: var(--color-neutral-4);
        }

        .icon {
          padding: 5px;
          font-size: 22px;
          border-radius: 5px;
          cursor: pointer;
          color: rgba(0, 0, 0, 0.55);
          margin-left: 5px;

          &:hover {
            color: #000;
            background: #000a200d;

          }
        }

        .avatar {
          margin-left: 10px;
          cursor: pointer;
          width: 30px;
          height: 30px;
        }

      }


    }

  }
  .content {
    background: #F2F3F5;
    min-height: calc(100vh - 51px);
    .breadcrumb{
      margin: 16px auto;
      max-width: 90%;
    }
    .router-view{
      max-height:100%;
      max-width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
  }

}
.dropdown-item {
  display: flex;
  align-items: center;

  .icon {
    margin-right: 8px;
  }
}



</style>
