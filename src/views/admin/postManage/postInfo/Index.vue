<template>
  <div class="app">
    <div class="questionInfo">
      <div class="top">
        <div class="title">帖子信息管理</div>
        <div style="display: flex">
          <div class="query-way">
            <div class="query-item">
              <div class="label">帖子标题</div>
              <a-input placeholder="请输入题目标题" v-model:model-value="queryAllRequest.title"/>
            </div>
            <div class="query-item">
              <div class="label">创建者ID</div>
              <a-input placeholder="请输入创建者ID" v-model:model-value="queryAllRequest.userId"/>
            </div>
            <div class="query-item">
              <div class="label">帖子标签</div>
              <a-select :style="{width:'220px'}" placeholder="请选择" multiple
                        v-model:model-value="queryAllRequest.tags">
                <a-option :value="item.name" v-for="item in tagList">{{ item.name }}</a-option>
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
          <a-button type="primary" style="width: 100px;" @click="addModel = true">
            <template #icon>
              <icon-plus/>
            </template>
            <template #default>添加</template>
          </a-button>
        </div>
      </div>
      <div class="bottom">
        <a-table :columns="columns" :data="data" stripe :pagination="pagination">
          <template #tagList="{ record }">
            {{ JSON.stringify(record.tagList) }}
          </template>
          <template #specialTagList="{ record }">
            <a-select :style="{width:'250px'}" placeholder="请选择" multiple v-model:model-value="record.specialTagList"
                      @change="changeSpecialTagList(record)">
              <a-option v-for="item in specialTagList">{{ item }}</a-option>
            </a-select>
          </template>
          <template #createTime="{ record }">
            {{ formatTime(record.createTime, 0) }}
          </template>
          <template #option="{ record,rowIndex }">
            <div style="display: flex">
              <a-button type="primary" @click="checkEdit(record)">编辑</a-button>
              <a-button status="danger" @click="checkDelete(record.id)" style="margin-left: 10px;">删除</a-button>
            </div>

          </template>
        </a-table>
      </div>
    </div>

    <a-modal v-if="addModel" v-model:visible="addModel" fullscreen title="新增帖子" @before-ok="addBeforeOk">
      <div style="margin-bottom: 10px;">
        <div>
          <span class="label" style="margin-right: 10px;">帖子标题:</span>
          <a-input placeholder="请输入标题" style="width: 400px" v-model:model-value="addInfo.title"></a-input>
        </div>
        <div style="margin-top: 10px;">
          <span class="label" style="margin-right: 10px;">特殊标签:</span>
          <a-select :style="{width:'250px'}" placeholder="请选择" multiple v-model:model-value="addInfo.specialTags">
            <a-option v-for="item in specialTagList">{{ item }}</a-option>
          </a-select>
        </div>
        <div style="margin-top: 10px;">
          <span class="label" style="margin-right: 10px;">帖子标签:</span>
          <a-select :style="{width:'250px'}" placeholder="请选择" multiple v-model:model-value="addInfo.tags">
            <a-option v-for="item in tagList">{{ item.name }}</a-option>
          </a-select>
        </div>

      </div>
      <MdEditorContent :on-change="changeAddContent" :height="380"></MdEditorContent>
    </a-modal>
    <a-modal v-model:visible="updateModel" v-if="updateModel" fullscreen @before-ok="updateBeforeOk"
             @cancel="updateModel = false"
             title="更新帖子">
      <div style="margin-bottom: 10px;">
        <div>
          <span class="label" style="margin-right: 10px;">帖子标题:</span>
          <a-input placeholder="请输入标题" style="width: 400px" v-model:model-value="updateInfo.title"></a-input>
        </div>
        <div style="margin-top: 10px;">
          <span class="label" style="margin-right: 10px;">特殊标签:</span>
          <a-select :style="{width:'250px'}" placeholder="请选择" multiple v-model:model-value="updateInfo.specialTags">
            <a-option v-for="item in specialTagList">{{ item }}</a-option>
          </a-select>
        </div>
        <div style="margin-top: 10px;">
          <span class="label" style="margin-right: 10px;">帖子标签:</span>
          <a-select :style="{width:'250px'}" placeholder="请选择" multiple v-model:model-value="updateInfo.tags">
            <a-option v-for="item in tagList">{{ item.name }}</a-option>
          </a-select>
        </div>

      </div>
      <MdEditorContent :value="updateInfo.content" :on-change="changeUpdateContent" :height="380"></MdEditorContent>
    </a-modal>
    <a-modal v-model:visible="deleteModel" @ok="onDelete" @cancel="deleteModel = false" title="提示">
      <div style="text-align: center">是否删除帖子：<strong>{{ deleteRequest.id }}</strong></div>
    </a-modal>
  </div>

</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {formatTime} from "@/utils/dateParse.js";
import {STATUS_CODE} from "@/common/status.js";
import {ERROR, SUCCESS} from "@/utils/message.js";
import {GET_TAG_LIST} from "@/service/api/tagApi.js";
import QuestionCreate from "@/components/question/QuestionCreate.vue";
import QuestionUpdate from "@/components/question/QuestionUpdate.vue";
import {ADD_POST, DELETE_POST, GET_PAGE_POST_LIST, UPDATE_POST} from "@/service/api/postApi.js";
import MdEditorVue from "@/components/mdEditor/MdEditorVue.vue";
import MdEditorContent from "@/components/mdEditor/MdEditorContent.vue";

const tagList = ref([])
const specialTagList = ref([
  "置顶",
  "官方",
  "推荐"
])
const tagQuery = {
  belongType: "post"
}
const queryRequestReSet = {
  sortField: "",
  sortOrder: "",
  tags: [],
  title: "",
  userId: "",
  current: 1,
  pageSize: 10,
}
const queryAllRequest = ref({
  sortField: "",
  sortOrder: "",
  tags: [],
  title: "",
  userId: "",
  current: 1,
  pageSize: 10,
})
const updateInfo = ref({})
const addInfo = ref({})
const deleteRequest = ref({
  id: ""
})
const updateModel = ref(false)
const deleteModel = ref(false)
const addModel = ref(false);

const pagination = reactive({
  current: 1,
  pageSize: queryAllRequest.value.pageSize,
  total: 0,
  showTotal: true,
  onChange: (current) => {
    pagination.current = current
    queryAllRequest.value.current = current
    getPostList()
  },
});

const select = (e) => {
  // 比较时间大小 时间小的放在startTime 时间大的放在endTime 利用三目运算符
  queryAllRequest.value.startTime = e[0] < e[1] ? e[0] : e[1]
  queryAllRequest.value.endTime = e[0] > e[1] ? e[0] : e[1]
}

const columns = [
  {
    title: '帖子ID',
    dataIndex: 'id',
    width: 200
  },
  {
    title: '创建者ID',
    dataIndex: 'userId',
    width: 200
  },
  {
    title: '帖子标题',
    dataIndex: 'title',
    ellipsis: true,
    tooltip: true,
    width: 100
  },
  {
    title: '帖子内容',
    dataIndex: 'content',
    ellipsis: true,
    tooltip: true,
    width: 150
  },
  {
    title: "特殊标签",
    dataIndex: 'specialTagList',
    width: 280,
    slotName: 'specialTagList'
  },
  {
    title: "帖子标签",
    dataIndex: 'tagList',
    ellipsis: true,
    tooltip: true,
    width: 100,
    slotName: 'tagList'
  },
  {
    title: '点赞数',
    dataIndex: 'thumbNum',
    width: 100,
  },
  {
    title: '收藏数',
    dataIndex: 'favourNum',
    width: 100,
  },
  {
    title: '评论数',
    dataIndex: 'commentNum',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 110,
    slotName: 'createTime'
  },
  {
    title: '操做',
    width: 150,
    fixed: 'right',
    slotName: 'option',
    align: 'center'
  },
];
const data = ref([
  {
    id: "1749679286659629058",
    title: "测试标题",
    content: "### 当前代码优化\n1. 先处理菜单项的权限控制和显示隐藏\n\n通过 meta.hideInMenu 和 meta.access 属性控制\n\n2. 管理页面分页问题的修复\n\n可以参考聚合搜索项目的搜索条件改变和 url 状态同步\n核心原理：在分页页号改变时，触发 @page-change 事件，通过改变 searchParams 的值，并且通过 watchEffect 监听 searchParams 的改变（然后执行 loadData 重新加载速度），实现了页号变化时触发数据的重新加载。\n\n3. 修复刷新页面未登录问题\n\n修改 access\\index.ts 中的获取登录用户信息，把登录后的信息更新到 loginUser 变量上",
    thumbNum: 0,
    favourNum: 0,
    commentNum: 0,
    userId: "1743170947961077761",
    createTime: "2024-01-23T06:23:44.000+00:00",
    tagList: [
      "编程"
    ],
    specialTagList: [],
  }
]);


const getPostList = () => {
  GET_PAGE_POST_LIST(queryAllRequest.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      data.value = []
      data.value = res.data.records
      pagination.total = parseInt(res.data.total)
    }
  })
}
const search = () => {
  getPostList()
}

const reSet = () => {
  queryAllRequest.value = {
    ...queryRequestReSet
  }
}

const changeAddContent = (text, html) => {
  addInfo.value.content = text
}

const onAdd = () => {
  console.log(addInfo.value)
  ADD_POST(addInfo.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("添加成功")
      getPostList()
    } else {
      ERROR(res.message)
    }
    addModel.value = false
  })
}

const addBeforeOk = (done) => {
  onAdd()
  reSet()
  getPostList()
  done()
  addModel.value = false
}

const changeUpdateContent = (text,html) => {
  updateInfo.value.content = text
}


const onUpdate = () => {
  UPDATE_POST(updateInfo.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("更新成功")
      getPostList()
    } else {
      ERROR("更新失败")
    }
  })
}

const changeSpecialTagList = (e) => {
  updateInfo.value = {
    id: e.id,
    title: e.title,
    content: e.content,
    specialTags: e.specialTagList.length === 0 ? null : e.specialTagList,
    tags: e.tagList
  }
  onUpdate()
}

const updateBeforeOk = (done) => {
  onUpdate()
  reSet()
  getPostList()
  done()
  updateModel.value = false
}

const checkEdit = (e) => {
  updateInfo.value = {
    id: e.id,
    title: e.title,
    content: e.content,
    specialTags: e.specialTagList,
    tags: e.tagList
  }
  updateModel.value = true
}

const checkDelete = (id) => {
  deleteRequest.value.id = id
  deleteModel.value = true
}

const onDelete = () => {
  DELETE_POST(deleteRequest.value.id).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("删除成功")
      getPostList()
    } else {
      ERROR("删除失败")
    }
    deleteModel.value = false
  })
}


const getTagList = () => {
  GET_TAG_LIST(tagQuery).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      tagList.value = res.data
    }
  })
}

onMounted(() => {
  getPostList()
  getTagList()
})
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
  padding: 15px;

  .questionInfo {
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

    .statistic {
      font-size: 15px;
    }
  }

  .mdEditor {
    width: 800px;
  }

}


</style>
