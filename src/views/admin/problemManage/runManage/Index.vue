<template>
  <div class="app">
    <div class="questionInfo">
      <div class="top">
        <div class="title">运行管理</div>
        <div style="display: flex">
          <div class="query-way">
            <div class="query-item">
              <div class="label">题目ID</div>
              <a-input placeholder="请输入题目ID" v-model:model-value="queryAllRequest.questionId"/>
            </div>
            <div class="query-item">
              <div class="label">运行状态</div>
              <a-select :style="{width:'220px'}" placeholder="请选择"
                        v-model:model-value="queryAllRequest.status">
                <a-option :value="getJudgeStatus(item)" v-for="item in JudgeStatus">{{ item }}</a-option>
              </a-select>
            </div>
            <div class="query-item">
              <div class="label">运行语言</div>
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
<!--      <div class="middle">-->
<!--        <div style="margin-bottom: 10px;">-->
<!--          <a-button type="primary" style="width: 100px;" @click="addModel = true">-->
<!--            <template #icon>-->
<!--              <icon-plus/>-->
<!--            </template>-->
<!--            <template #default>添加</template>-->
<!--          </a-button>-->
<!--        </div>-->
<!--      </div>-->
      <div class="bottom">
        <a-table :columns="columns" :data="data" stripe :pagination="pagination">
          <template #status="{ record }">
            {{ getJudgeStatusValue(record.status) }}
          </template>
          <template #judgeInfo="{ record }">
            {{ JSON.stringify(record.judgeInfo) }}
          </template>
          <template #judgeCase="{ record }">
            {{ JSON.stringify(record.judgeCase) }}
          </template>
          <template #createTime="{ record }">
            {{ formatTime(record.createTime, 0) }}
          </template>
          <template #option="{ record,rowIndex }">
            <div style="display: flex">
              <a-button status="danger" @click="checkDelete(record.id)" style="margin-left: 10px;">删除</a-button>
            </div>

          </template>
        </a-table>
      </div>
    </div>
    <a-modal v-model:visible="deleteModel" @ok="onDelete" @cancel="deleteModel = false" title="提示">
      <div style="text-align: center">是否删除运行记录：<strong>{{ deleteRequest.id }}</strong></div>
    </a-modal>
<!--    <a-modal v-if="addModel" v-model:visible="addModel" title="新建题目运行" @cancel="addModel = false"-->
<!--             body-class="addModel" @before-ok="addBeforeOk">-->
<!--      <div style="margin-bottom: 10px; background:#ffffff; padding: 10px;border: 1px solid #eeeeee">-->
<!--        <div class="label">题目ID:</div>-->
<!--        <a-input v-model:model-value="addRequest.questionId" placeholder="请输入题目ID"/>-->
<!--      </div>-->
<!--      <CodeEditorVue :on-change="changeCode" :on-select="changeLanguage"></CodeEditorVue>-->
<!--    </a-modal>-->
  </div>

</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {formatTime} from "@/utils/dateParse.js";
import {STATUS_CODE} from "@/common/status.js";
import {ERROR, SUCCESS} from "@/utils/message.js";
import {
  ADD_QUESTION_TEMPLATE,
} from "@/service/api/questionTemplateApi.js";
import CodeEditorVue from "@/components/codeEditor/CodeEditorVue.vue";
import {Languages} from "@/common/language/languageConstants.js";
import {DELETE_QUESTION_RUN, GET_QUESTION_RUN_LIST} from "@/service/api/questionRunApi.js";
import {getJudgeStatus, getJudgeStatusValue} from "@/common/judge/judgeStatus.js";
import {JudgeStatus} from "@/common/judge/judgeConstants.js";

const languageList = ref(Languages)
const queryRequestReSet = {
  status: "",
  userId: "",
  sortField: "createTime",
  sortOrder: "",
  language: "",
  current: 1,
  pageSize: 10,

}
const queryAllRequest = ref({
  status: "",
  userId: "",
  sortField: "createTime",
  sortOrder: "",
  language: "",
  current: 1,
  pageSize: 10,
})
const deleteRequest = ref({
  id: ""
})
const deleteModel = ref(false)

const pagination = reactive({
  current: 1,
  pageSize: queryAllRequest.value.pageSize,
  total: 0,
  showTotal: true,
  onChange: (current) => {
    pagination.current = current
    queryAllRequest.value.current = current
    getQuestionRunList()
  },
});

const columns = [
  {
    title: '运行ID',
    dataIndex: 'id',
    width: 200
  },
  {
    title: '运行语言',
    dataIndex: 'language',
    ellipsis: true,
    tooltip: true,
    width: 100
  },
  {
    title: '运行代码',
    dataIndex: 'code',
    ellipsis: true,
    tooltip: true,
    width: 200
  },
  {
    title: '运行状态',
    dataIndex: 'status',
    ellipsis: true,
    tooltip: true,
    width: 100,
    slotName: 'status'
  },
  {
    title: '判题结果',
    dataIndex: 'judgeInfo',
    ellipsis: true,
    tooltip: true,
    width: 150,
    slotName: 'judgeInfo'
  },
  {
    title: '判题用例',
    dataIndex: 'judgeCase',
    ellipsis: true,
    tooltip: true,
    width: 150,
    slotName: 'judgeCase'
  },
  {
    title: '所属题目ID',
    dataIndex: 'questionId',
    ellipsis: true,
    tooltip: true,
    width: 100
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
    width: 100,
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

const getQuestionRunList = () => {
  GET_QUESTION_RUN_LIST(queryAllRequest.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      data.value = []
      data.value = res.data.records
      pagination.total = parseInt(res.data.total)
    }
  })
}
const search = () => {
  getQuestionRunList()
}

const reSet = () => {
  queryAllRequest.value ={
    ...queryRequestReSet
  }
}

// const changeCode = (e) => {
//   addRequest.value.code = e
// }
//
// const changeLanguage = (e) => {
//   addRequest.value.language = e
// }

// const onAdd = () => {
//   ADD_QUESTION_TEMPLATE(addRequest.value).then(res => {
//     console.log(res)
//     if (res.code === STATUS_CODE.SUCCESS_CODE) {
//       SUCCESS("添加成功")
//       getQuestionRunList()
//     } else {
//       ERROR("添加失败")
//     }
//   })
// }

// const addBeforeOk = (done) => {
//   onAdd()
//   reSet()
//   getQuestionRunList()
//   done()
//   addModel.value = false
// };

const checkDelete = (id) => {
  deleteRequest.value.id = id
  deleteModel.value = true
}

const onDelete = () => {
  DELETE_QUESTION_RUN(deleteRequest.value.id).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("删除成功")
      getQuestionRunList()
    } else {
      ERROR("删除失败")
    }
    deleteModel.value = false
  })
}

onMounted(() => {
  getQuestionRunList()
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
