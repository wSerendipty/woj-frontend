<template>
  <div class="questionSubmit">
    <a-table :columns="columns" :data="data" :sticky-header="100" :pagination="pagination" @page-change="pageChange">
      <template #status="{ record }">
        <span
            :style="record.status===JUDGE_INFO_STATUS_ENUM.ACCEPTED?{color:'green'}:{color:'red'}">{{ record.status }}</span>
      </template>
    </a-table>
  </div>
</template>
<script setup>
import {GET_QUESTION_SUBMIT_LIST} from "@/service/api/questionSubmitApi.js";
import {onMounted, reactive, ref, watch} from "vue";
import {STATUS_CODE} from "@/common/status.js";
import {ERROR} from "@/utils/message.js";
import {Languages} from "@/common/language/languageConstants.js";
import {JudgeInfoStatus} from "@/common/judge/judgeInfoConstants.js";
import {JUDGE_INFO_STATUS_ENUM} from "@/common/judge/judgeInfoStatusEnum.js";
import store from "@/store/index.js";
import {formatTime} from "@/utils/dateParse.js";


const questionSubmitQRequest = ref({
  current: 0,
  pageSize: 10,
  questionId: store.getters.questionInfo.id,
  sortField: "createTime",
  sortOrder: "",
  userId: 1
})

watch(() => store.getters.questionInfo.id, (_newVal, _oldVal) => {
  questionSubmitQRequest.value.questionId = _newVal
})

const columns = [
  {
    title: '所有状态',
    dataIndex: 'status',
    filterable: {
      filters: JudgeInfoStatus.map(item => {
        return {
          text: item,
          value: item
        }
      }),
      filter: (value, record) => record.language.indexOf(value) === 0,
    },
    slotName: 'status',
    width: 150
  },
  {
    title: '所有语言',
    dataIndex: 'language',
    filterable: {
      filters: Languages.map(item => {
        return {
          text: item,
          value: item
        }
      }),
      filter: (value, record) => record.language.indexOf(value) === 0,
    }
  },
  {
    title: '执行用时',
    dataIndex: 'time',
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: '消耗内存',
    dataIndex: 'memory',
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    slotName: 'createTime',
    width: 150
  },
];

const data = ref([]);

const pagination = reactive({total: 0})

const pageChange = (e) => {
  questionSubmitQRequest.value.current = e
  getQuestionSubmit()
}

const getQuestionSubmit = () => {
  GET_QUESTION_SUBMIT_LIST(questionSubmitQRequest.value).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      pagination.total = Number(res.data.total)
      data.value = []
      // 遍历res.data.records 将其转换为data
      res.data.records.map(item => {
        data.value.push({
          language: item.language,
          message: item.judgeInfo.message,
          status: item.judgeInfo.status,
          memory: (item.judgeInfo.memory / 1048576).toFixed(2) + " MB",
          time: item.judgeInfo.time + " ms",
          createTime: formatTime(item.createTime, 7)
        })
      })
      console.log(res.data)
    } else {
      ERROR(res.message)
    }
  })
}

onMounted(() => {
  getQuestionSubmit()
})
</script>
<style scoped lang="scss">
.questionSubmit {
  .top {
    position: sticky;
    top: 0;
    height: 50px;
    background: #fff;
  }
}

</style>