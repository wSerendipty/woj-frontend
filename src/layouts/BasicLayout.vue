<template>
  <div class="basicLayout">
    <a-layout>
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
            <a-menu-item key="/menu/contest">竞赛</a-menu-item>
            <a-menu-item key="/menu/circle">讨论</a-menu-item>
            <a-menu-item key="/admin" v-if="loginUser.userRole === ACCESS_ENUM.ADMIN">管理后台</a-menu-item>
          </a-menu>
          <div class="right">
            <a-input-search class="search" placeholder="搜索"/>
            <!--            <icon-search class="icon"/>-->
            <div v-if="loginUser.userRole !== ACCESS_ENUM.NOT_LOGIN" style="display: flex;align-items: center">
              <icon-notification class="icon"/>
              <a-dropdown @select="handleSelect">
                <a-avatar class="avatar">A</a-avatar>
                <template #content>
                  <a-doption>注销</a-doption>
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
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://github.com/wSerendipty" target="_blank">
          OJ判题系统 by 逢考必过！
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import store from "../store/index.js";
import {ACCESS_ENUM} from "../access/accessEnum.js";
import {LOGOUT} from "../service/api/userApi.js";
import {STATUS_CODE} from "../common/status.js";
import {SUCCESS} from "../utils/message.js";

const router = useRouter();
const loginUser = computed(() => {
  return store.getters.userInfo;
})


const route = useRoute()

const selectKeys = ref([route.path]);

watch(() => route.path, (val) => {
  console.log(val)
  selectKeys.value = [val];
})

const onClick = (key) => {
  router.push({path: key});
}

const handleSelect = (v) => {
  if (v === '注销'){
    LOGOUT().then(res=>{
      if (res.code === STATUS_CODE.SUCCESS_CODE){
        SUCCESS("注销成功")
        store.dispatch('getUserInfo')
      }
    })
  }
}
</script>

<style scoped lang="scss">

.basicLayout {
  width: 100%;
  height: 100vh;
  .header {
    border-bottom: 1px solid #00000014;
    width: 100%;
    height: 50px;
    .nav-bar {
      height: 100%;
      padding-left: 100px;
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
    background: #ffffff;
    min-height: calc(100vh - 100px);
  }

  .footer {
    background: #1A1A1A;
    bottom: 0;
    width: 100%;
    padding: 16px 0;
    text-align: center;

    a {
      text-decoration: none; /* 去除默认的下划线 */
      outline: none; /* 去除旧版浏览器的点击后的外虚线框 */
      color: #ffffff;; /* 去除默认的颜色和点击后变化的颜色 */
    }
  }
}


</style>
