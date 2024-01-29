<template>
  <div class="app">
    <div class="questionInfo">
      <div class="top">
        <div class="title">题目信息管理</div>
        <div style="display: flex">
          <div class="query-way">
            <div class="query-item">
              <div class="label">题目ID</div>
              <a-input placeholder="请输入题目ID" v-model:model-value="queryAllRequest.id"/>
            </div>
            <div class="query-item">
              <div class="label">题目标题</div>
              <a-input placeholder="请输入题目标题" v-model:model-value="queryAllRequest.title"/>
            </div>
            <div class="query-item">
              <div class="label">题目标签</div>
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
          <template #status="{ record }">
            {{ getQuestionStatusValue(record.status) }}
          </template>
          <template #acceptedRate="{record}">
            <a-statistic :value-style="{fontSize:'15px'}" :value="record.submitNum !== 0?(record.acceptedNum / record.submitNum)*100:0" :precision="2">
              <template #suffix>%</template>
            </a-statistic>
          </template>
          <template #questionTemplates="{ record }">
            {{ JSON.stringify(record.questionTemplates) }}
          </template>
          <template #createTime="{ record }">
            {{ formatTime(record.createTime, 0) }}
          </template>
          <template #option="{ record,rowIndex }">
            <div style="display: flex">
              <a-button type="primary" @click="checkEdit(rowIndex)">编辑</a-button>
              <a-button status="danger" @click="checkDelete(record.id)" style="margin-left: 10px;">删除</a-button>
            </div>

          </template>
        </a-table>
      </div>
    </div>
    <a-modal v-model:visible="deleteModel" @ok="onDelete" @cancel="deleteModel = false" title="提示">
      <div style="text-align: center">是否删除题目：<strong>{{ deleteRequest.id }}</strong></div>
    </a-modal>
    <a-modal v-model:visible="updateModel" v-if="updateModel" fullscreen @ok="onUpdate" @cancel="updateModel = false"
             title="更新题目">
      <QuestionUpdate :question="updateInfo" :tag-list="tagList"></QuestionUpdate>
    </a-modal>
    <a-modal v-if="addModel" v-model:visible="addModel" fullscreen title="新建题目" @cancel="handleCancel"
             body-class="addModel" @before-ok="handleBeforeOk">
      <QuestionCreate :tag-list="tagList"></QuestionCreate>
    </a-modal>
  </div>

</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {formatTime} from "@/utils/dateParse.js";
import {STATUS_CODE} from "@/common/status.js";
import {ERROR, SUCCESS} from "@/utils/message.js";
import { DELETE_QUESTION, GET_QUESTION_LIST} from "@/service/api/questionApi.js";
import {GET_TAG_LIST} from "@/service/api/tagApi.js";
import QuestionCreate from "@/components/question/QuestionCreate.vue";
import QuestionUpdate from "@/components/question/QuestionUpdate.vue";
import {getQuestionStatusValue} from "@/common/question/questionStatus.js";

const tagList = ref([])
const tagQuery = {
  belongType: "question"
}
const queryRequestReSet = {
  id: "",
  sortField: "",
  title: "",
  difficulty:"",
  status:"",
  content: "",
  sortOrder: "",
  tags: [],
  current: 1,
  pageSize: 10,
}
const queryAllRequest = ref({
  id: "",
  sortField: "",
  title: "",
  difficulty:"",
  status:"",
  content: "",
  sortOrder: "",
  tags: [],
  current: 1,
  pageSize: 10,
})
const updateInfo = ref({})
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
    getQuestionList()
  },
});

const select = (e) => {
  // 比较时间大小 时间小的放在startTime 时间大的放在endTime 利用三目运算符
  queryAllRequest.value.startTime = e[0] < e[1] ? e[0] : e[1]
  queryAllRequest.value.endTime = e[0] > e[1] ? e[0] : e[1]

}

const columns = [
  {
    title: '题目ID',
    dataIndex: 'id',
    width: 160
  },
  {
    title: '题目名称',
    dataIndex: 'title',
    ellipsis: true,
    tooltip: true,
    width: 100
  },
  {
    title: '题目内容',
    dataIndex: 'content',
    ellipsis: true,
    tooltip: true,
    width: 100
  },
  {
    title: '题目答案',
    dataIndex: 'answer',
    ellipsis: true,
    tooltip: true,
    width: 100
  },
  {
    title: '题目标签',
    dataIndex: 'tags',
    ellipsis: true,
    tooltip: true,
    width: 100
  },
  {
    title: '题目难度',
    dataIndex: 'difficulty',
    width: 100
  },
  {
    title: '题目状态',
    dataIndex: 'status',
    width: 100,
    slotName: 'status'
  },
  {
    title: '提交数',
    dataIndex: 'submitNum',
    width: 100,
  },
  {
    title: '通过数',
    dataIndex: 'acceptedNum',
    width: 100,
  },
  {
    title: '通过率',
    width: 100,
    slotName: 'acceptedRate'
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
    title: '判题配置',
    dataIndex: 'judgeConfig',
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '测试用例',
    dataIndex: 'testJudgeCase',
    width: 120,
    ellipsis: true,
    tooltip: true,
  }, {
    title: '判题用例',
    dataIndex: 'judgeCase',
    width: 120,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '题目模板',
    dataIndex: 'questionTemplates',
    width: 120,
    ellipsis: true,
    tooltip: true,
    slotName: 'questionTemplates'
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
    id: "1747874194448855042",
    title: "A+B",
    content: "利用编程代码实现两个数相加求和",
    tags: [
      "编程",
      "基础"
    ],
    submitNum: 0,
    acceptedNum: 0,
    judgeConfig: {
      timeLimit: "1000",
      memoryLimit: "50000000",
      stackLimit: "10000"
    },
    testJudgeCase: [
      {
        input: "1 2",
        output: "3"
      },
      {
        input: "3 4",
        output: "7"
      }
    ],
    questionTemplates: [],
    thumbNum: 0,
    favourNum: 0,
    userId: "1743170947961077761",
    createTime: "2024-01-18T06:50:56.000+00:00"
  }
]);

const getQuestionList = () => {
  GET_QUESTION_LIST(queryAllRequest.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      data.value = []
      data.value = res.data.records
      pagination.total = parseInt(res.data.total)
    }
  })
}
const search = () => {
  getQuestionList()
}

const reSet = () => {
  queryAllRequest.value ={
    ...queryRequestReSet
  }
}

const handleBeforeOk = (done) => {
  reSet()
  getQuestionList()
  done()
};
const handleCancel = () => {
  addModel.value = false;
}

const onUpdate = () => {
  reSet()
  getQuestionList()
  updateModel.value = false
}

const checkEdit = (id) => {
  updateInfo.value = {
    ...data.value[id],
    content: data.value[id].content,
    answer: data.value[id].answer,
    judgeConfig: JSON.parse(data.value[id].judgeConfig),
    testJudgeCase: JSON.parse(data.value[id].testJudgeCase),
    judgeCase: JSON.parse(data.value[id].judgeCase),
    tags: JSON.parse(data.value[id].tags),
  }
  updateModel.value = true
}

const checkDelete = (id) => {
  deleteRequest.value.id = id
  deleteModel.value = true
}

const onDelete = () => {
  DELETE_QUESTION(deleteRequest.value.id).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("删除成功")
      getQuestionList()
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
  getQuestionList()
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
          display: flex;
          align-items: center;
          width: 300px;
          .label {
            display: flex;
            width: 80px;
            font-size: 14px;
            color: var(--color-text-2);
            margin-right: 10px;
          }



          &:not(:first-child) {
            margin-left: 20px;
          }
        }
      }


    }
    .statistic{
      font-size: 15px;
    }
  }
}


</style>
