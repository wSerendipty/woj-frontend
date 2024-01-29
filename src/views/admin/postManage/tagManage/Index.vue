<template>
  <div class="app">
    <div class="questionInfo">
      <div class="top">
        <div class="title">标签管理</div>
        <div style="display: flex">
          <div class="query-way">
            <div class="query-item">
              <div class="label">标签ID</div>
              <a-input placeholder="请输入题目ID" v-model:model-value="queryAllRequest.id"/>
            </div>
            <div class="query-item">
              <div class="label">创建者ID</div>
              <a-input placeholder="请输入创建者ID" v-model:model-value="queryAllRequest.userId"/>
            </div>
            <div class="query-item">
              <div class="label">所属类型</div>
              <a-select :style="{width:'220px'}" placeholder="请选择"
                        v-model:model-value="queryAllRequest.belongType">
                <a-option >question</a-option>
                <a-option >post</a-option>
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
    <a-modal v-model:visible="deleteModel" @ok="onDelete" @cancel="deleteModel = false" title="提示">
      <div style="text-align: center">是否删除标签：<strong>{{ deleteRequest.id }}</strong></div>
    </a-modal>
    <a-modal v-model:visible="updateModel" v-if="updateModel" @before-ok="updateBeforeOk" @cancel="updateModel = false"
             title="更新标签">
      <div style="margin-bottom: 10px; background:#ffffff; padding: 10px;border: 1px solid #eeeeee">
        <div class="label">所属类型</div>
        <a-select :style="{width:'220px'}" placeholder="请选择"
                  v-model:model-value="updateRequest.belongType"  style="margin-top: 10px;">
          <a-option >question</a-option>
          <a-option >post</a-option>
        </a-select>
        <div class="label" style="margin-top: 10px">标签名称:</div>
        <a-input v-model:model-value="updateRequest.name"  style="margin-top: 10px;" placeholder="请输入标签名称"/>
      </div>
    </a-modal>
    <a-modal v-if="addModel" v-model:visible="addModel" title="新建标签" @cancel="addModel = false"
             body-class="addModel" @before-ok="addBeforeOk">
      <div style="margin-bottom: 10px; background:#ffffff; padding: 10px;border: 1px solid #eeeeee">
        <div class="label">所属类型</div>
        <a-select :style="{width:'220px'}" placeholder="请选择"  style="margin-top: 10px;"
                  v-model:model-value="addRequest.belongType">
          <a-option >question</a-option>
          <a-option >post</a-option>
        </a-select>
        <div class="label" style="margin-top: 10px">标签名称:</div>
        <a-input v-model:model-value="addRequest.name"  style="margin-top: 10px;" placeholder="请输入标签名称"/>
      </div>
    </a-modal>
  </div>

</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {formatTime} from "@/utils/dateParse.js";
import {ADD_USER, DELETE_USER, UPDATE_USER} from "@/service/api/userApi.js";
import {STATUS_CODE} from "@/common/status.js";
import {getUseRole} from "@/common/user/userRole.js";
import {ERROR, SUCCESS} from "@/utils/message.js";
import {ADD_QUESTION, DELETE_QUESTION, GET_QUESTION_LIST} from "@/service/api/questionApi.js";
import {ADD_TAG, DELETE_TAG, GET_TAG_LIST, GET_TAG_LIST_BY_PAGE} from "@/service/api/tagApi.js";
import QuestionCreate from "@/components/question/QuestionCreate.vue";
import QuestionUpdate from "@/components/question/QuestionUpdate.vue";
import {
  ADD_QUESTION_TEMPLATE,
  DELETE_QUESTION_TEMPLATE,
  GET_QUESTION_TEMPLATE_LIST, UPDATE_QUESTION_TEMPLATE
} from "@/service/api/questionTemplateApi.js";
import MdEditorContent from "@/components/mdEditor/MdEditorContent.vue";
import CodeEditorVue from "@/components/codeEditor/CodeEditorVue.vue";
import {Languages} from "@/common/language/languageConstants.js";

const queryRequestReSet = {
  id: "",
  userId: "",
  sortField: "createTime",
  belongType: "",
  content: "",
  sortOrder: "",
  name: "",
  current: 1,
  pageSize: 10,
}
const queryAllRequest = ref({
  id: "",
  userId: "",
  sortField: "createTime",
  belongType: "",
  content: "",
  sortOrder: "",
  name: "",
  current: 1,
  pageSize: 10,
})
const updateRequest = ref({
  code: "",
  language: "",
  id: "",
})
const addRequest = ref({
  code: "",
  language: "",
  questionId: "",
})
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
    getTagList()
  },
});

const columns = [
  {
    title: '标签ID',
    dataIndex: 'id',
    width: 100
  },
  {
    title: '标签名',
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
    width: 100
  },
  {
    title: '所属类型',
    dataIndex: 'belongType',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 110,
    slotName: 'createTime'
  },
  {
    title: '操做',
    width: 80,
    fixed: 'right',
    slotName: 'option',
    align: 'center'
  },
];
const data = ref([
  {
    id: "4",
    language: "java",
    code: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World!\");\n    }\n}",
    userId: "1743170947961077761",
    questionId: "1",
    createTime: "2024-01-22T13:23:53.000+00:00",
  },
]);

const getTagList = () => {
  GET_TAG_LIST_BY_PAGE(queryAllRequest.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      data.value = []
      data.value = res.data.records
      pagination.total = parseInt(res.data.total)
    }
  })
}
const search = () => {
  getTagList()
}

const reSet = () => {
  queryAllRequest.value ={
    ...queryRequestReSet
  }
}


const onAdd = () => {
  ADD_TAG(addRequest.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("添加成功")
      getTagList()
    } else {
      ERROR("添加失败")
    }
  })
}

const addBeforeOk = (done) => {
  onAdd()
  reSet()
  getTagList()
  done()
  addModel.value = false
};
const checkEdit = (record) => {
  updateRequest.value = {
    belongType: record.belongType,
    name: record.name,
    id: record.id,
  }
  updateModel.value = true
}

const onUpdate = () => {
  UPDATE_QUESTION_TEMPLATE(updateRequest.value).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("更新成功")
    } else {
      ERROR("更新失败")
    }
  })
}
const updateBeforeOk = async (done) => {
  onUpdate()
  reSet()
  await getTagList()
  done()
  updateModel.value = false
}

const checkDelete = (id) => {
  deleteRequest.value.id = id
  deleteModel.value = true
}

const onDelete = () => {
  DELETE_TAG(deleteRequest.value.id).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("删除成功")
      getTagList()
    } else {
      ERROR("删除失败")
    }
    deleteModel.value = false
  })
}

onMounted(() => {
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
}


</style>
