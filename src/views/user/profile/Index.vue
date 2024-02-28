<template>
  <div class="userProfile">
    <div class="left">
      <a-avatar class="avatar" :size="80" shape="square">
        <IconUser v-if="!Boolean(user.userAvatar)"/>
        <img
            v-else
            alt="avatar"
            :src="user.userAvatar"
        />
      </a-avatar>
      <div class="account">{{ user.userAccount }}</div>
      <a-divider/>
      <div class="user-profile"
           :class="route.query.name !== 'safe' ? 'active' : ''"
           style=""
           @click="router.push({path: '/user/profile',
           replace:true
           })"
      >
        <icon-settings class="icon"/>
        <div class="label">个人简介</div>
      </div>
      <div class="safe"
           :class="route.query.name === 'safe' ? 'active' : ''"
           @click="router.push({
        path: '/user/profile',
        query: {
          name: 'safe'
        },
        replace: true
      })">
        <icon-safe class="icon"/>
        <div class="label">账号安全</div>
      </div>
    </div>
    <div class="right">

      <div v-if="route.query.name === 'safe'" class="safeDetail">
        <div class="password">
          <div class="label">修改密码</div>
          <a-input-password class="input" placeholder="请输入密码" v-model:model-value="passwordRequest.userPassword"/>
        </div>
        <div class="check-password">
          <div class="label">确认密码</div>
          <a-input-password class="input" placeholder="请再次输入密码"
                            v-model:model-value="passwordRequest.checkPassword"/>
        </div>
        <div class="btn">
          <a-button class="save" type="primary" status="success" @click="savePassword">保存</a-button>
        </div>

      </div>

      <div v-else class="profileDetail">
        <div class="top">
          <a-upload class="avatar"
                    :action="fileUrl.uploadImage"
                    ref="uploadRef"
                    :data="{
                  biz: fileEnum.USER_AVATAR
                }"
                    :multiple="false"
                    @change="onUpload"
                    :auto-upload="false"
                    @before-upload="beforeUpload"
                    :with-credentials="true"
                    @progress="onProgress"
                    :show-file-list="false"
                    :image-preview="true"
                    @success="onSuccess"
                    @error="onError"
          >
            <template #upload-button>
              <a-avatar class="avatar" shape="circle" :size="100" trigger-type="mask" object-fit="cover">
                <template #trigger-icon>
                  <IconEdit/>
                </template>
                <IconUser v-if="!Boolean(user.userAvatar)"/>
                <img
                    v-else
                    alt="avatar"
                    :src="user.userAvatar"
                />
              </a-avatar>
            </template>
          </a-upload>

        </div>
        <div class="bottom">
          <div class="top">
            <div class="account">
              <div class="label">账号</div>
              <a-input class="input" placeholder="请输入账号" v-model:model-value="user.userAccount"/>
            </div>
            <div class="userName">
              <div class="label">用户名</div>
              <a-input class="input" placeholder="请输入用户名" v-model:model-value="user.userName"/>
            </div>
          </div>
          <div class="profile">
            <div class="label">个人简介</div>
            <a-input class="input" placeholder="请输入个人简介" v-model:model-value="user.userProfile"/>
          </div>
          <div class="btn">
            <a-button class="save" @click="save" type="primary" status="success">保存</a-button>
          </div>

        </div>
      </div>

    </div>
  </div>

</template>

<script setup>
import store from "@/store/index.js";
import {computed, reactive, ref} from "vue";
import {ERROR, SUCCESS, WARNING} from "@/utils/message.js";
import fileUrl from "@/service/urls/fileUrl.js";
import {fileEnum} from "@/common/file/fileEnum.js";
import {STATUS_CODE} from "@/common/status.js";
import router from "@/router/index.js";
import {useRoute} from "vue-router";
import {EDIT_PASSWORD, LOGOUT} from "@/service/api/userApi.js";

const route = useRoute();

const loginUser = computed(() => store.getters.userInfo);

const user = reactive({
  userName: loginUser.value.userName,
  userAccount: loginUser.value.userAccount,
  userProfile: loginUser.value.userProfile,
  userAvatar: loginUser.value.userAvatar,
});

const file = ref(null);
const uploadRef = ref(null);

const passwordRequest = reactive({
  userPassword: "",
  checkPassword: "",
});


const beforeUpload = (file) => {
  console.log("beforeUpload", file);
  // 判断文件类型是否是图片类型
  const isImage = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg" || file.type === "image/webp";
  if (!isImage) {
    WARNING("只能上传jpeg,jpg,png格式的图片");
    return false;
  }
  return true;
};

const onProgress = (file) => {
  console.log("onProgress", file);
};
const onUpload = (files) => {
  console.log("onUpload", files);
  file.value = files[files.length - 1];

  // 创建将文件转换为base64的对象
  const reader = new FileReader();
  reader.readAsDataURL(files[files.length - 1].file);
  reader.onload = function () {
    // 将base64转换为文件
    user.userAvatar = reader.result;
  };


  console.log("upload");
};

const onSuccess = (res) => {
  console.log("onSuccess", res);
  if (res.response.code === STATUS_CODE.SUCCESS_CODE) {
    user.userAvatar = res.response.data;
    console.log("save", user);
    store.dispatch("updateUserInfo", user).then(r => {
      console.log("save", r);
      if (r.code === STATUS_CODE.SUCCESS_CODE) {
        SUCCESS("保存成功");
        store.dispatch("getUserInfo");
      }
    });
  } else {
    ERROR(res.response.message);
  }
};

const onError = (err) => {
  console.log("onError", err);
};

const save = () => {
  // 先判断是否有修改
  if (user.userName === loginUser.value.userName && user.userAccount === loginUser.value.userAccount && user.userProfile === loginUser.value.userProfile && user.userAvatar === loginUser.value.userAvatar) {
    WARNING("未做任何修改");
    return;
  }
  // 判断头像是否修改 如果修改了头像则上传头像
  if (user.userAvatar !== loginUser.value.userAvatar) {
    // 利用uploadRef上传头像
    uploadRef.value.submit(file.value);
  } else {
    store.dispatch("updateUserInfo", user).then(r => {
      console.log("save", r);
      if (r.code === STATUS_CODE.SUCCESS_CODE) {
        store.dispatch("getUserInfo");
        SUCCESS("保存成功");
      }
    });
  }
};

const savePassword = () => {
  if (!passwordRequest.userPassword && !passwordRequest.checkPassword) {
    WARNING("信息未填写完整！");
    return;
  }
  if (passwordRequest.userPassword !== passwordRequest.checkPassword) {
    WARNING("两次密码不一致！");
    return;
  }
  if (passwordRequest.userPassword.length < 8) {
    WARNING("密码长度不得小于8位！");
    return;
  }
  EDIT_PASSWORD(passwordRequest).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("修改成功");
      // 退出登录
      store.dispatch("logOut").then(res => {
        if (res.code === STATUS_CODE.SUCCESS_CODE) {
          router.push({path: "/user/login", replace: true});
        }
      });
    } else {
      ERROR(res.message);
    }
  });
};
</script>

<style lang="scss" scoped>
.userProfile {
  min-height: 100vh;
  padding-left: 120px;
  padding-right: 120px;
  padding-bottom: 50px;
  background: #F7F8FA;
  display: flex;


  .left {
    width: 300px;
    border-radius: 5px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-height: 250px;

    .avatar {
      margin: 0 auto;
    }

    .account {
      margin: 10px auto 0;
      font-size: 15px;
      font-weight: 500;
    }

    .user-profile, .safe {
      margin-top: 20px;
      display: flex;
      cursor: pointer;
      color: rgba(140, 140, 140, 1);
      padding: 14px 18px;
      font-size: 14px;
      border-radius: 6px;

      .icon {
        margin-right: 10px;
      }

      &.active {
        background: #f0f0f0;
        color: #1890ff;
        font-weight: 600
      }

      &:hover {
        background: #f0f0f0;

        .icon {
          color: #1890ff;
        }

        .label {
          color: #1890ff;
        }
      }
    }

  }

  .right {
    min-width: 800px;
    margin: 20px auto 0;
    background: #fff;
    padding: 20px;
    border-radius: 5px;

    .safeDetail {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .password, .check-password {
        margin: 10px 0;

        .label {
          font-size: 15px;
          margin-bottom: 10px;
          color: #262626bf;
          font-weight: 600;
        }

        .input {
          border-radius: 5px;
          height: 2.5rem;
        }
      }

      .btn {
        display: flex;
        justify-content: center;

        .save {
          margin-left: auto;
          margin-top: 30px;
          width: 20%;
          height: 2.5rem;
          border-radius: 6px;
        }
      }
    }


    .profileDetail {

      .top {
        display: flex;
        justify-content: center;
        align-items: center;

        .avatar {
          display: flex;
          justify-content: center;
          align-items: center;

          &.arco-upload-wrapper {
            width: unset;
          }
        }
      }

      .bottom {
        max-width: 800px;
        margin: 20px auto 0;
        background: #fff;
        padding: 20px;
        min-height: 250px;
        border-radius: 5px;


        .top {
          display: flex;
          justify-content: space-between;

          .account, .userName {
            width: 47%;

            .label {
              font-size: 15px;
              margin-bottom: 10px;
              color: #262626bf;
              font-weight: 400;
            }

            .input {
              border-radius: 5px;
              height: 2.5rem;
            }

          }
        }

        .profile {
          margin-top: 20px;

          .label {
            font-size: 15px;
            margin-bottom: 10px;
            color: #262626bf;
            font-weight: 400;
          }

          .input {
            border-radius: 5px;
            height: 2.5rem;
          }
        }

        .btn {
          display: flex;
          justify-content: center;

          .save {
            margin-left: auto;
            margin-top: 30px;
            width: 20%;
            height: 2.5rem;
            border-radius: 6px;
          }
        }

      }
    }

  }

}

</style>
