<template>
  <div class="register">
    <div class="card">
      <div class="title">
<!--        <img src="../../../assets/imgs/logo.png">-->
        OJ判题系统
      </div>
      <div class="label">账号密码注册</div>
      <a-input class="input" :class="errorAccount?'error':''" placeholder="账号" allow-clear error
               v-model:model-value="form.userAccount">
        <template #prefix>
          <icon-user/>
        </template>
      </a-input>
      <div class="tip" v-if="errorAccount">请输入正确的账号</div>
      <a-input-password class="input" :class="errorPassword?'error':''" placeholder="密码" allow-clear
                        v-model:model-value="form.userPassword">
        <template #prefix>
          <icon-safe/>
        </template>
      </a-input-password>
      <div class="tip" v-if="errorPassword">请输入正确的密码</div>
      <a-input-password class="input" :class="errorPassword?'error':''" placeholder="确认密码" allow-clear
                        v-model:model-value="form.checkPassword">
        <template #prefix>
          <icon-safe/>
        </template>
      </a-input-password>
      <div class="tip" v-if="errorCheck">两次输入的密码不一致</div>
      <a-button html-type="submit" class="submit" @click="handleSubmit">注册</a-button>
      <div class="operation">
        <div class="to-register" @click="toLogin">
          前往登录
        </div>
      </div>
      <div class="other">
        <a title="飞书" target="_blank" href="#">
          <icon-lark-color/>
        </a>
        <a title="抖音" href="#" target="_blank">
          <icon-tiktok-color/>
        </a>
        <a title="微信" href="#" target="_blank"> <img class="wx" src="../../../assets/svg/wx.svg" alt=""></a>
        <a title="QQ" href="#" target="_blank"> <img class="qq" src="../../../assets/svg/qq.svg" alt=""></a>


      </div>
      <div class="bottom">
        注册或登录即代表你同意《用户协议》和《隐私协议》
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import {ERROR, SUCCESS, WARNING} from "@/utils/message.js";
import {REGISTER} from "@/service/api/userApi.js";
import {STATUS_CODE} from "@/common/status.js";
import router from "@/router";

const form = reactive({
  userAccount: '',
  userPassword: '',
  checkPassword:''
});
const errorAccount = ref(false)
const errorPassword = ref(false)
const errorCheck = ref(false)
const handleSubmit = () => {
  if (!form.userAccount && !form.userPassword && !form.checkPassword) {
    WARNING("信息未填写完整！")
    errorAccount.value = true;
    errorPassword.value = true;
    errorCheck.value = true
    return
  }
  if (!form.userAccount) {
    errorAccount.value = true
    if (!form.userPassword){
      errorPassword.value = true
      errorCheck.value = true
    }
    return;
  }
  if (!form.userPassword) {
    errorPassword.value = true
    errorAccount.value = false
    errorCheck.value = true
    return;
  }
  if (!form.checkPassword || form.checkPassword !== form.userPassword){
    errorCheck.value = true
    errorPassword.value = false
    errorAccount.value = false
    return;
  }
  errorPassword.value = false
  errorAccount.value = false
  errorCheck.value = false
  REGISTER(JSON.stringify(form)).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("注册成功！")
      router.push({path: "/user/login", replace: true})
    }else {
      ERROR(res.message)
    }
  })
  console.log(form);
};

const toLogin = () => {
  router.push({
    path:"/user/login"
  })
}


</script>

<style scoped lang="scss">
.register {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  //position: relative;

  .card {
    padding: 24px 32px 32px;
    display: flex;
    flex-direction: column;
    margin: 30px 0;
    min-width: 18%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.1);
    border-radius: 21px;
    background: #ffffff;
    z-index: 0;

    .title {
      img {
        width: 30px;
        height: 22px;
        margin-right: 5px;
      }

      font-size: 15px;
      color: rgb(38,38,38,1);
      font-weight: 600;
      display: flex;
      justify-content: center;
    }

    .label {
      margin-top: 32px;
      margin-bottom: 24px;
      color: #000000;
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
    }

    .input {
      margin-bottom: 16px;
      border-radius: 8px !important;
      background: #ffffff;
      border: 1px solid var(--color-neutral-3);
      line-height: 22px;
      height: 39px;

      &:hover {
        border: 1px solid rgb(0, 122, 255, 0.3);
      }
    }

    .tip {
      color: rgb(239, 71, 67, 1);
      font-size: 12px;
      margin-bottom: 15px;
    }

    .error {
      border: 1px solid rgb(239, 71, 67, 1);
      margin-bottom: 5px;
    }

    .submit {
      cursor: pointer;
      color: #ffffff;
      background: #000;
      height: 39px;
      border-radius: 8px;
      margin: 8px 0 16px;
      &:hover{
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), rgb(36, 37, 40);
      };
    }

    .operation {
      display: flex;
      align-items: center;
      color: rgba(38, 38, 38, 0.75);
      font-size: 14px;
      line-height: 22px;
      .to-register{
        cursor: pointer;
        margin-right: auto;
      }
    }

    .other {
      font-size: 25px;
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      justify-content: space-around;
      margin-top: 24px;

      a {
        cursor: pointer;
      }

      .wx {
        width: 30px;
        height: 30px;
      }

      .qq {
        width: 35px;
        height: 35px;
      }
    }

    .bottom {
      text-align: center;
      font-size: 12px;
      margin-top: 42px;
      color: rgba(60, 60, 67, 0.6);
    }


  }
}


</style>
