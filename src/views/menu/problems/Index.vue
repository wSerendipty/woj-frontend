<template>
  <div class="app">
    <div class="left">
      <div class="top">
        <div class="title">题库</div>
        <div style="display: flex;">
          <div class="query-way">
            <div class="query-item">
              <a-dropdown @select="selectDifficulty" class="dropdown">
                <a-button class="dropdown">难度
                  <icon-down/>
                </a-button>
                <template #content>
                  <a-doption style="width: 120px;">简单</a-doption>
                  <a-doption>中等</a-doption>
                  <a-doption>困难</a-doption>
                </template>
              </a-dropdown>
            </div>
            <div class="query-item">
              <a-dropdown @select="selectTag" >
                <a-button class="dropdown">标签
                  <icon-down/>
                </a-button>
                <template #content>
                  <a-doption style="width: 120px;" v-for="item in tagList">{{item.name}}</a-doption>
                </template>
              </a-dropdown>
            </div>
            <div class="query-item">
              <a-input class="dropdown" style="width: 210px" size="large" placeholder="请输入题目名称"
                       v-model:model-value="queryAllRequest.title">
                <template #prefix>
                  <icon-search/>
                </template>
              </a-input>
            </div>
            <a-button  status="success" style=" margin-left: 20%;width: 100px; border-radius: 6px;"
                      @click="search">
              <template #icon>
                <icon-search/>
              </template>
              <template #default>搜索</template>
            </a-button>
            <a-button style="margin-left: 10px; width: 100px;  border-radius: 6px;" @click="reSet">
              <template #icon>
                <icon-refresh/>
              </template>
              <template #default>重置</template>
            </a-button>
          </div>
        </div>
      </div>
      <div class="middle">
        <a-tag class="tag" color="blue" v-if="queryAllRequest.difficulty.length !== 0" closable @close="queryAllRequest.difficulty = ''">
          {{ queryAllRequest.difficulty }}
        </a-tag>
        <a-tag class="tag"  v-for="item in queryAllRequest.tags" closable :key="item" @close="closeTag(item)">
          {{ item }}
        </a-tag>
      </div>
      <a-divider margin="20"/>
      <div class="bottom">
        <a-table class="table" :columns="columns" :bordered="false" :data="data" stripe :pagination="pagination">
          <template #title="{ record }">
            <div class="title" @click="doQuestion(record.id)">{{ record.id }}. {{ record.title }}</div>
          </template>
          <template #status="{ record }">
            <a-tooltip content="未开始" v-if="record.status === 0">
              <icon-minus class="statusIcon"/>
            </a-tooltip>
            <a-tooltip content="已通过"  v-if="record.status === 1">
              <icon-check-circle class="statusIcon" style="color: #3FC66F"/>
            </a-tooltip>
            <a-tooltip content="尝试过"  v-if="record.status === 2">
              <icon-clock-circle class="statusIcon" style="
              color: #FFB800"/>
            </a-tooltip>
          </template>
          <template #acceptedRate="{record}">
            <a-statistic :value-style="{fontSize:'15px'}"
                         :value="record.submitNum !== 0 ? (record.acceptedNum / record.submitNum)*100 : 0" :precision="2">
              <template #suffix>%</template>
            </a-statistic>
          </template>
          <template #difficulty="{ record }">
            <a-tag color="blue"  v-if="record.difficulty === '简单'">简单</a-tag>
            <a-tag color="orange" v-if="record.difficulty === '中等'">中等</a-tag>
            <a-tag color="red" v-if="record.difficulty === '困难'">困难</a-tag>
          </template>
        </a-table>
      </div>
    </div>
    <div class="right">
      <div class="body">
        <a-empty v-if="store.getters.userInfo.userRole === ACCESS_ENUM.NOT_LOGIN"  description="未登录"/>
        <div class="progress"  v-else >
          <div class="top">
            <icon-sun-fill style="margin-right: 10px; color: rgba(255,161,22, 1); font-size: 20px"/>
            <div>做题进度</div>
          </div>
          <div class="bottom">
            <a-progress type="circle"  :width="90" :status="questionFinish.acNum === questionFinish.totalNum?'success':''"  size="large" :percent="Math.trunc((questionFinish.acNum / questionFinish.totalNum) * 100) / 100" show-text class="progress-item"/>
            <div class="difficult">
              <div class="easy">
                <div class="title">简单</div>
                <div class="num">{{questionFinish.easyNum}}</div>
              </div>
              <div class="medium">
                <div class="title">中等</div>
                <div class="num">{{questionFinish.mediumNum}}</div>
              </div>
              <div class="hard">
                <div class="title">困难</div>
                <div class="num">{{questionFinish.hardNum}}</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {STATUS_CODE} from "@/common/status.js";
import {
  GET_QUESTION_FINISH,
  GET_QUESTION_VO_LIST
} from "@/service/api/questionApi.js";
import {GET_TAG_LIST} from "@/service/api/tagApi.js";
import router from "@/router/index.js";
import {QuestionStatus} from "@/common/question/questionStatusConstant.js";
import store from "@/store/index.js";
import {ACCESS_ENUM} from "@/access/accessEnum.js";
import _ from "lodash";

const tagList = ref([])
const tagQuery = {
  belongType: "question"
}
const queryRequestReSet = {
  id: "",
  sortField: "",
  title: "",
  difficulty: "",
  content: "",
  sortOrder: "",
  tags: [],
  current: 1,
  pageSize: 15,
}
const queryAllRequest = ref({
  id: "",
  sortField: "",
  title: "",
  difficulty: "",
  content: "",
  sortOrder: "",
  tags: [],
  current: 1,
  pageSize: 15,
})
const pagination = reactive({
  current: 1,
  pageSize: queryAllRequest.value.pageSize,
  total: 0,
  onChange: (current) => {
    pagination.current = current
    queryAllRequest.value.current = current
    getQuestionList()
  },
});
const questionStatusQueryRequest = {
  type: "normal"
}
const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    width: 70,
    slotName: 'status',
    filterable: {
      filters: QuestionStatus.map((item,index) => {
        return {
          text: item,
          value: index
        }
      }),
      filter: (value, record) => parseInt(value) === record.status,
    },
  },
  {
    title: '题目名称',
    dataIndex: 'title',
    ellipsis: true,
    tooltip: true,
    width: 150,
    slotName: 'title'
  },
  {
    title: '题解',
    width: 100,
    dataIndex: 'solutionNum',
  },
  {
    title: '通过率',
    width: 100,
    slotName: 'acceptedRate'
  },
  {
    title: '难度',
    dataIndex: 'difficulty',
    width: 100,
    slotName: 'difficulty',
  }
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
const questionFinish = ref({
  easyNum: 1000,
  mediumNum: 1000,
  hardNum: 1000,
  acNum: 1,
  totalNum: 3
})

const getQuestionList = () => {
  GET_QUESTION_VO_LIST(queryAllRequest.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      data.value = []
      data.value = res.data.records
      pagination.total = parseInt(res.data.total)
    }
  })
}

const search = () => {
  console.log(1)
  debounceGetQuestionList()
}

const reSet = () => {
  queryAllRequest.value = {
    ...queryRequestReSet
  }
}

const selectDifficulty = (e) => {
  queryAllRequest.value.difficulty = e
}


const selectTag = (e) => {
  queryAllRequest.value.tags.push(e)
}

const closeTag = (item) => {
  // 遍历tags 找到item 并删除
  queryAllRequest.value.tags = queryAllRequest.value.tags.filter((value) => {
    return value !== item
  })
}

const doQuestion = (id) => {
  router.push({
    path: '/problem/do',
    query: {
      name:"detail",
      type:"normal",
      id: id
    }
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

const debounceGetQuestionList = _.debounce(getQuestionList,300,{
  'leading': true,
  'trailing': false
})

const getQuestionFinish = () => {
  GET_QUESTION_FINISH(questionStatusQueryRequest).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      questionFinish.value = res.data
    }
  })
}

onMounted(() => {
  getQuestionList()
  getTagList()
  if(store.getters.userInfo.userRole !== ACCESS_ENUM.NOT_LOGIN){
    getQuestionFinish()
  }

})
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100%;
  padding-left: 120px;
  padding-right: 24px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  padding-top: 24px;
  position: relative;
  max-width: 1200px;

  .left {
    max-width: 800px;
    flex: 1 1 0;
    margin-right: 0.5rem;

    .top {
      .title {
        color: #262626bf;
        font-weight: 500;
        font-size: 20px;
      }

      .query-way {
        margin-top: 20px;
        display: flex;

        .query-item {
          display: flex;
          align-items: center;

          .dropdown {
            justify-content: space-between;
            width: 120px;
            border-radius: 6px;
          }

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
    .middle{
      margin-top: 10px;
      display: flex;
      align-items: center;
      .tag{
        display: flex;
        justify-content: space-between;
        width: 80px;
        border-radius: 6px;
        margin-right: 10px;
      }
    }

    .bottom {
      .table {
        .title {
          cursor: pointer;
          color: var(--color-text-1);
          font-size: 13px;

          &:hover {
            color: rgb(0 122 255/1);
          }
        }
        .statusIcon{
          font-size: 20px;
        }
      }
    }

    .statistic {
      font-size: 15px;
    }
  }

  .right {
    position: static;
    padding: 0.5rem 0.5rem 1rem;
    margin-left: 10px;
    .body{
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08);
      user-select: none;
      min-width: 280px;
      padding: 16px 16px 4px;
      .progress{
        min-height: 150px;
        .top{
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
        }
        .bottom{
          display: flex;
          margin-top: 30px;
          align-items: center;
          .progress-item{
            margin-right: 20px;
          }
          .difficult{
            display: flex;
            min-height: 60px;
            background: rgba(255, 255, 255, 1);
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08);
            padding: 16px 16px 4px;
            .easy{
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
              .title{
                font-size: 12px;
                color: #00AF9B;
              }
              .num{
                margin-top: 10px;
                color: #262626bf;
                line-height: 1.625;
                font-weight: 600;
              }
            }
            .medium{
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
              margin-left: 20px;
              .title{
                font-size: 12px;
                color:  #FFB800;;
              }
              .num{
                margin-top: 10px;
                color: #262626bf;
                line-height: 1.625;
                font-weight: 600;
              }
            }
            .hard {
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
              margin-left: 20px;

              .title {
                font-size: 12px;
                color: #FF2D55;
              }

              .num{
                margin-top: 10px;
                color: #262626bf;
                line-height: 1.625;
                font-weight: 600;
              }
            }
          }

        }

      }
    }
  }
}


</style>
