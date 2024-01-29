<template>
  <div class="app">
    <div class="userInfo">
      <div class="top">
        <div class="title">用户信息管理</div>
        <div style="display: flex">
          <div class="query-way">
            <div class="query-item">
              <div class="label">用户ID</div>
              <a-input placeholder="请输入用户ID" v-model:model-value="queryAllRequest.id"/>
            </div>
            <div class="query-item">
              <div class="label">创建时间</div>
              <a-range-picker
                  style="width: 300px;"
                  format="YYYY-MM-DD"
                  @select="select"
              />
            </div>
            <div class="query-item">
              <div class="label">用户权限</div>
              <a-select :style="{width:'220px'}" placeholder="请选择" v-model:model-value="queryAllRequest.userRole">
                <a-option value="user">普通用户</a-option>
                <a-option value="admin">管理员</a-option>
                <a-option value="ban">禁用用户</a-option>
              </a-select>
            </div>
          </div>
          <div style="display: flex;">
            <a-divider direction="vertical"></a-divider>
            <div style="display: flex;flex-direction: column;">
              <a-button type="primary" style="margin-left: 10px;width: 100px;" @click="search">
                <template #icon>
                  <icon-search/>
                </template>
                <template #default>搜索</template>
              </a-button>
              <a-button style="margin-left: 10px; margin-top: 10px; width: 100px;" @click="reSet">
                <template #icon>
                  <icon-refresh/>
                </template>
                <template #default>重置</template>
              </a-button>
            </div>
          </div>
        </div>
      </div>
      <a-divider/>
      <div class="middle">
        <div style="margin-bottom: 10px;">
          <a-button type="primary" style="width: 100px;" @click="visible = true">
            <template #icon>
              <icon-plus/>
            </template>
            <template #default>添加</template>
          </a-button>
        </div>
      </div>
      <div class="bottom">
        <a-table :columns="columns" :data="data" stripe :pagination="pagination">
          <template #userAvatar="{ record }">
            <a-image style="border-radius: 8px"
                     width="80"
                     :src="record.userAvatar"
            />
          </template>
          <template #userRole="{ record }">
            <a-select :style="{width:'120px'}" placeholder="请选择" v-model:model-value="record.userRole" @change="changeRole(record)">
              <a-option value="user">普通用户</a-option>
              <a-option value="admin">管理员</a-option>
              <a-option value="ban">禁用用户</a-option>
            </a-select>
          </template>
          <template #createTime="{ record }">
            {{ formatTime(record.createTime, 0) }}
          </template>
          <template #option="{ record }">
            <a-button status="danger" @click="checkDelete(record.id)">删除</a-button>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal v-model:visible="deleteModel" @ok="deleteUser" @cancel="deleteModel = false" title="提示">
      <div style="text-align: center">是否删除用户：<strong>{{deleteRequest.id}}</strong></div>
    </a-modal>
    <a-modal v-model:visible="roleModel" @ok="updateUser" @cancel="roleModel = false" title="提示">
      <div style="text-align: center">是否修改当前用户角色为：<strong>{{getUseRole(updateUserInfo.userRole)}}</strong></div>
    </a-modal>
    <a-modal v-model:visible="visible" draggable title="新建用户" @cancel="handleCancel" @before-ok="handleBeforeOk">
      <a-form :model="form">
        <a-form-item field="userName" label="用户昵称：">
          <a-input v-model="form.userName" />
        </a-form-item>
        <a-form-item field="userAccount" label="账号：">
          <a-input v-model="form.userAccount" />
        </a-form-item>
        <a-form-item field="userPassword" label="密码：">
          <a-input-password  v-model="form.userPassword" />
        </a-form-item>
        <a-form-item field="userRole" label="角色">
          <a-select v-model="form.userRole">
            <a-option value="user">普通用户</a-option>
            <a-option value="admin">管理员</a-option>
            <a-option value="ban">禁用用户</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {formatTime} from "@/utils/dateParse.js";
import {ADD_USER, DELETE_USER, LIST_USER, UPDATE_USER} from "@/service/api/userApi.js";
import {STATUS_CODE} from "@/common/status.js";
import {getUseRole} from "@/common/user/userRole.js";
import {ERROR, SUCCESS} from "@/utils/message.js";
const queryRequestReSet = {
  id:"",
  startTime:"",
  endTime: "",
  sortField: "createTime",
  sortOrder: "",
  userName: "",
  userRole: "",
  current: 1,
  pageSize: 10,
}
const queryAllRequest = ref({
  id:"",
  startTime:null,
  endTime: null,
  sortField: "createTime",
  sortOrder: "",
  userName: "",
  userRole: "",
  current: 1,
  pageSize: 10,
})
const updateUserInfo = ref({
  id: "",
  userRole: ""
})
const deleteRequest = ref({
  id: ""
})
const roleModel = ref(false)
const deleteModel = ref(false)



const pagination = reactive({
  current: 1,
  pageSize: queryAllRequest.value.pageSize,
  total: 0,
  showTotal: true,
  onChange: (current) => {
    console.log(current)
    pagination.current = current
    queryAllRequest.value.current = current
    getListUser()
  },
});

const select = (e) => {
 // 比较时间大小 时间小的放在startTime 时间大的放在endTime 利用三目运算符
  queryAllRequest.value.startTime = e[0] < e[1] ? e[0] : e[1]
  queryAllRequest.value.endTime = e[0] > e[1] ? e[0] : e[1]

}

const columns = [
  {
    title: '用户ID',
    dataIndex: 'id',
    width: 160
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    ellipsis: true,
    tooltip: true,
    width: 100
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    ellipsis: true,
    tooltip: true,
    width: 100
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
    width: 100,
    slotName: 'userAvatar'
  },
  {
    title: '个人简介',
    dataIndex: 'userProfile',
    ellipsis: true,
    width: 110,
  },
  {
    title: '角色',
    dataIndex: 'userRole',
    width: 120,
    slotName: 'userRole'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 110,
    slotName: 'createTime'
  },
  {
    title: '操做',
    width: 120,
    slotName: 'option'
  },
];
const data = ref([
  {
    id: "1740270573453344770",
    userAccount: "逢考必过",
    userPassword: "b03d227f78c0c79334fca76e7b8eb46a",
    userName: "逢考必过",
    userAvatar: "https://assets.leetcode.cn/aliyun-lc-upload/users/jolly-buckgxm/avatar_1615203125.png",
    userProfile: "这是个懒人，没有简介",
    userRole: "admin",
    createTime: "2023-12-29T09:43:43.000+00:00",
  }
]);

const changeRole = (record) => {
  if (updateUserInfo.value === record.userRole) {
    return
  }
  updateUserInfo.value.id = record.id
  updateUserInfo.value.userRole = record.userRole
  roleModel.value = true
}

const getListUser = () => {
  LIST_USER(queryAllRequest.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      data.value = []
      data.value = res.data.records
      pagination.total = parseInt(res.data.total)
    }
  })
}

const search = () => {
  getListUser()
}

const reSet = () => {
  queryAllRequest.value ={
    ...queryRequestReSet
  }
}

const visible = ref(false);
const form = ref({
  userAccount: '',
  userPassword: '',
  userName: '',
  userAvatar: '',
  userRole: '',
});

const handleBeforeOk = (done) => {
  console.log(form)
  ADD_USER(form.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      done()
      reSet()
      getListUser()
    }
  })
};
const handleCancel = () => {
  form.value = {}
  visible.value = false;
}

const updateUser = () => {
  console.log(updateUserInfo.value)
  UPDATE_USER(updateUserInfo.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("修改成功")
    }else {
      ERROR("修改失败")
    }
    roleModel.value = false
  })
}

const checkDelete = (id) => {
  deleteRequest.value.id = id
  deleteModel.value = true
}

const deleteUser = () => {
  DELETE_USER(deleteRequest.value.id).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("删除成功")
      getListUser()
    }else {
      ERROR("删除失败")
    }
    deleteModel.value = false
  })

}

onMounted(() => {
  getListUser()
})
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
  padding: 15px;

  .userInfo {
    .top {
      .title {
        font-size: 16px;
        flex: 1;
        color: var(--color-text-1);
        font-weight: 500;
      }

      .query-way {
        margin-top: 20px;
        display: flex;

        .query-item {
          .label {
            display: flex;
            width: 80px;
            font-size: 14px;
            color: var(--color-text-2);
            margin-right: 10px;
          }

          display: flex;
          align-items: center;
          width: 300px;

          &:not(:first-child) {
            margin-left: 20px;
          }
        }
      }

    }
  }
}

</style>
