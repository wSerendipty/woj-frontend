<template>
  <div class="app">
    <div class="questionInfo">
      <div class="top">
        <div class="title">题目模板管理</div>
        <div style="display: flex">
          <div class="query-way">
            <div class="query-item">
              <div class="label">题目ID</div>
              <a-input placeholder="请输入题目ID" v-model:model-value="queryAllRequest.questionId"/>
            </div>
            <div class="query-item">
              <div class="label">创建者ID</div>
              <a-input placeholder="请输入创建者ID" v-model:model-value="queryAllRequest.userId"/>
            </div>
            <div class="query-item">
              <div class="label">模板语言</div>
              <a-select :style="{width:'220px'}" placeholder="请选择"
                        v-model:model-value="queryAllRequest.language">
                <a-option :value="item" v-for="item in languageList">{{ item }}</a-option>
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
      <div style="text-align: center">是否删除模板：<strong>{{ deleteRequest.id }}</strong></div>
    </a-modal>
    <a-modal v-model:visible="updateModel" v-if="updateModel" @before-ok="updateBeforeOk" @cancel="updateModel = false"
             title="更新题目模板">
      <CodeEditorVue :on-change="changeUpdateCode" :on-select="changeUpdateLanguage"
                     :value="updateRequest"></CodeEditorVue>
    </a-modal>
    <a-modal v-if="addModel" v-model:visible="addModel" title="新建题目模板" @cancel="addModel = false"
             body-class="addModel" @before-ok="addBeforeOk">
      <div style="margin-bottom: 10px; background:#ffffff; padding: 10px;border: 1px solid #eeeeee">
        <div class="label">题目ID:</div>
        <a-input v-model:model-value="addRequest.questionId" placeholder="请输入题目ID"/>
      </div>
      <CodeEditorVue :on-change="changeCode" :on-select="changeLanguage"></CodeEditorVue>
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
import {GET_TAG_LIST} from "@/service/api/tagApi.js";
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

const languageList = ref(Languages)
const queryRequestReSet = {
  id: "",
  userId: "",
  sortField: "createTime",
  title: "",
  content: "",
  sortOrder: "",
  language: "",
  current: 1,
  pageSize: 10,

}
const queryAllRequest = ref({
  id: "",
  userId: "",
  sortField: "createTime",
  title: "",
  content: "",
  sortOrder: "",
  language: "",
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
    getQuestionTemplateList()
  },
});

const columns = [
  {
    title: '模板ID',
    dataIndex: 'id',
    width: 160
  },
  {
    title: '模板语言',
    dataIndex: 'language',
    ellipsis: true,
    tooltip: true,
    width: 100
  },
  {
    title: '模板代码',
    dataIndex: 'code',
    ellipsis: true,
    tooltip: true,
    width: 200
  },
  {
    title: '所属题目ID',
    dataIndex: 'questionId',
    ellipsis: true,
    tooltip: true,
    width: 150
  },
  {
    title: '创建者ID',
    dataIndex: 'userId',
    ellipsis: true,
    tooltip: true,
    width: 150
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
    id: "4",
    language: "java",
    code: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World!\");\n    }\n}",
    userId: "1743170947961077761",
    questionId: "1",
    createTime: "2024-01-22T13:23:53.000+00:00",
  },
]);

const getQuestionTemplateList = () => {
  GET_QUESTION_TEMPLATE_LIST(queryAllRequest.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      data.value = []
      data.value = res.data.records
      pagination.total = parseInt(res.data.total)
    }
  })
}
const search = () => {
  getQuestionTemplateList()
}

const reSet = () => {
  queryAllRequest.value ={
    ...queryRequestReSet
  }
}

const changeCode = (e) => {
  addRequest.value.code = e
}

const changeLanguage = (e) => {
  addRequest.value.language = e
}

const onAdd = () => {
  ADD_QUESTION_TEMPLATE(addRequest.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("添加成功")
      getQuestionTemplateList()
    } else {
      ERROR("添加失败")
    }
  })
}

const addBeforeOk = (done) => {
  onAdd()
  reSet()
  getQuestionTemplateList()
  done()
  addModel.value = false
};
const checkEdit = (record) => {
  updateRequest.value = {
    code: record.code,
    language: record.language,
    id: record.id,
  }
  updateModel.value = true
}

const changeUpdateCode = (e) => {
  updateRequest.value.code = e
}

const changeUpdateLanguage = (e) => {
  updateRequest.value.language = e
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
  await getQuestionTemplateList()
  done()
  updateModel.value = false
}

const checkDelete = (id) => {
  deleteRequest.value.id = id
  deleteModel.value = true
}

const onDelete = () => {
  DELETE_QUESTION_TEMPLATE(deleteRequest.value.id).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("删除成功")
      getQuestionTemplateList()
    } else {
      ERROR("删除失败")
    }
    deleteModel.value = false
  })
}

onMounted(() => {
  getQuestionTemplateList()
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
