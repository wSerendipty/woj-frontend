<template>
  <div class="do-problem">
    <div class="top">
      <a-button class="back" @click="back">
        <template #icon>
          <icon-caret-left/>
        </template>
        返回
      </a-button>
      <div class="operator">
        <a-button class="run" :class="runLoading?'big':''" @click="run" v-if="!submitLoading">
          <template #icon>
            <icon-caret-right v-if="!runLoading"/>
            <icon-refresh v-if="runLoading" spin/>
          </template>
          <span v-if="!runLoading && !submitLoading">运行</span>
          <span v-if="runLoading">运行中</span>
        </a-button>
        <a-button class="submit" :class="submitLoading?'big':''" @click="submit" v-if="!runLoading">
          <template #icon>
            <icon-upload v-if="!submitLoading"/>
            <icon-refresh v-if="submitLoading" spin/>
          </template>
          <span v-if="!submitLoading && !runLoading">提交</span>
          <span v-if="submitLoading">提交中</span>

        </a-button>
      </div>


    </div>
    <div class="bottom">
      <div class="left">
        <div class="top">
          <a-breadcrumb class="breadcrumb" separator="|">
            <a-breadcrumb-item>
              <div class="breadcrumb-item" @click="toPath(0)">
                <icon-bookmark class="icon" :style="currentIndex===0?{color:'#007BFF'}:''"/>
                <span :class="currentIndex===0?'select':''">题目描述</span>
              </div>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
              <div class="breadcrumb-item" @click="toPath(1)">
                <icon-subscribe-add class="icon" :style="currentIndex===1?{color:'#007BFF'}:''"/>
                <span :class="currentIndex===1?'select':''">题解</span>
              </div>

            </a-breadcrumb-item>
            <a-breadcrumb-item>
              <div class="breadcrumb-item" @click="toPath(2)">
                <icon-schedule class="icon" :style="currentIndex===2?{color:'#007BFF'}:''"/>
                <span v-if="currentIndex===2" :style="currentIndex===2?{color:'rgb( 29,33,41 )'}:''">提交记录</span>
                <span v-else :class="currentIndex!==2?'noSelect':''">提交记录</span>
              </div>

            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="other">
          <a-scrollbar style="height:580px;overflow: auto;">
            <!--            <ProblemInfo v-if="route.query.name === 'detail'" :questionInfo="questionInfo"/>-->
            <KeepAlive>
              <component :is="currentComponent"></component>
            </KeepAlive>

          </a-scrollbar>

        </div>
      </div>
      <div class="right">
        <a-split direction="vertical" :style="{height: '100%'}" @moving="onMoving" @move-end="onMoveEnd"
                 :default-size="0.8" :min="0.2" :max="0.80">
          <template #resize-trigger>
            <div class="resize-trigger">
              <icon-minus/>
            </div>
          </template>
          <template #first>
            <a-typography-paragraph>
              <div class="right-top">
                <div class="tip">
                  <icon-code style="color:#01B328; margin-right: 5px;"/>
                  代码
                </div>
                <CodeEditorVue :on-change="changeCode"
                               :on-select="selectLanguage" :height="editorHeight"/>
              </div>

            </a-typography-paragraph>
          </template>
          <template #second>
            <a-typography-paragraph>
              <div class="right-bottom">
                <div class="top">
                  <a-button type="text" class="testCase" @click="changeTabIndex = 0">
                    <icon-check-square class="icon"/>
                    <span :style="changeTabIndex===0?{color:'var(--color-neutral-10)'}:''">测试用例</span>
                  </a-button>
                  <a-button type="text" class="result" @click="changeTabIndex = 1" :disabled="runLoading">
                    <icon-to-right class="icon"/>
                    <span :style="changeTabIndex===1?{color:'var(--color-neutral-10)'}:''">运行结果</span>
                  </a-button>
                </div>
                <div class="content">
                  <div class="testJudgeCase" v-if="changeTabIndex === 0">
                    <div class="tags">
                      <a-tag class="tag"
                             :class="caseIndex===index?'active':''"
                             :closable="runRequest.judgeCase.length!==1" @close="closeCase(index)"
                             @click="chooseCase(index)"
                             :key="item" v-for="(item,index) in runRequest.judgeCase">Case
                        {{ index + 1 }}
                      </a-tag>
                      <a-tag class="plus" @click="addCase">
                        <icon-plus/>
                      </a-tag>
                    </div>
                    <div class="caseDetail">
                      <div class="input">
                        <div class="tip">输入</div>
                        <div class="case" v-for="(item1,index1) in testJudgeCaseInput[caseIndex]">
                          <div class="label">arg{{ index1 + 1 }} =</div>
                          <a-input v-model:model-value="testJudgeCaseInput[caseIndex][index1]"></a-input>
                        </div>
                      </div>
                      <div class="output">
                        <div class="tip">输出</div>
                        <div class="case">
                          <a-input v-model:model-value="runRequest.judgeCase[caseIndex].output"></a-input>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="runResult" v-else>
                    <div class="noResult" v-if="(JSON.stringify(runResult) === JSON.stringify({}))">请先执行代码</div>
                    <div class="resultContent" v-else>
                      <div class="top">
                        <div class="status accept"
                             v-if="runResult.judgeInfo.status === JUDGE_INFO_STATUS_ENUM.ACCEPTED">
                          {{ runResult.judgeInfo.message }}
                        </div>
                        <div class="status wrong"
                             v-if="JUDGE_INFO_STATUS_ENUM.WRONG_ANSWER === runResult.judgeInfo.status">
                          {{ runResult.judgeInfo.message }}
                        </div>
                        <div class="status wrong"
                             v-if="JUDGE_INFO_STATUS_ENUM.RUNTIME_ERROR === runResult.judgeInfo.status">
                          {{ runResult.judgeInfo.message }}
                        </div>
                        <div class="status compile-error"
                             v-if="JUDGE_INFO_STATUS_ENUM.COMPILE_ERROR === runResult.judgeInfo.status">
                          {{ runResult.judgeInfo.message }}
                        </div>
                        <div class="status time-limit-exceed"
                             v-if="JUDGE_INFO_STATUS_ENUM.TIME_LIMIT_EXCEEDED === runResult.judgeInfo.status">
                          {{ runResult.judgeInfo.message }}
                        </div>
                        <div class="time">执行用时:
                          {{ Boolean(runResult.judgeInfo.time) ? runResult.judgeInfo.time : 'NULL' }} ms
                        </div>
                      </div>
                      <div class="bottom" v-if="Boolean(runResult.judgeInfo.input)">
                        <div class="tags">
                          <a-tag class="tag"
                                 :class="judgeCaseIndex===index?'active':''"
                                 @click="chooseJudgeCase(index)"
                                 :key="item"
                                 v-for="(item,index) in runResult.judgeInfo.input">Case
                            {{ index + 1 }}
                          </a-tag>
                        </div>
                        <div class="caseDetail">
                          <div class="input">
                            <div class="tip">输入</div>
                            <div class="case"
                                 v-for="(item1,index1) in runResult.judgeInfo.input[judgeCaseIndex].split('\n')">
                              <div class="label">arg{{ index1 + 1 }} =</div>
                              <a-input disabled
                                       v-model:model-value="runResult.judgeInfo.input[judgeCaseIndex].split('\n')[index1]"></a-input>
                            </div>
                          </div>
                          <div class="output">
                            <div class="tip">输出</div>
                            <div class="case">
                              <a-input disabled
                                       v-model:model-value="runResult.judgeInfo.output[judgeCaseIndex]"></a-input>
                            </div>
                          </div>
                          <div class="expectedOutput">
                            <div class="tip">预期输出</div>
                            <div class="case">
                              <a-input disabled
                                       v-model:model-value="runResult.judgeInfo.expectedOutput[judgeCaseIndex]"></a-input>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </a-typography-paragraph>
          </template>
        </a-split>

      </div>
    </div>
  </div>

</template>

<script setup>
import {markRaw, onMounted, ref, watch} from "vue";
import CodeEditorVue from "@/components/codeEditor/CodeEditorVue.vue";
import router from "@/router/index.js";
import {useRoute} from "vue-router";
import {GET_QUESTION_BY_ID} from "@/service/api/questionApi.js";
import {STATUS_CODE} from "@/common/status.js";
import {ERROR, NOTIFICATION_ERROR, NOTIFICATION_SUCCESS, SUCCESS} from "@/utils/message.js";
import {GET_QUESTION_RUN_BY_ID, RUN_QUESTION} from "@/service/api/questionRunApi.js";
import {GET_QUESTION_SUBMIT_BY_ID, SUBMIT_QUESTION} from "@/service/api/questionSubmitApi.js";
import {JUDGE_INFO_STATUS_ENUM} from "@/common/judge/judgeInfoStatusEnum.js";
import ProblemInfo from "@/components/question/ProblemInfo.vue";
import ProblemSubmit from "@/components/question/ProblemSubmit.vue";
import ProblemSolution from "@/components/question/ProblemSolution.vue";
import store from "@/store/index.js";


const value = ref('')
const route = useRoute()
const editorHeight = ref('340px')
const currentIndex = ref(0)
const questionInfo = ref({})
const caseIndex = ref(0)
const changeTabIndex = ref(0)
const judgeCaseIndex = ref(0)
const testJudgeCaseInput = ref([])


const runRequest = ref({
  code: "",
  judgeCase: [
    {
      input: "",
      output: ""
    }
  ],
  language: "java",
  questionId: ""
})
const runResult = ref({})
const runId = ref("")
const runLoading = ref(false)
const submitLoading = ref(false)
const submitId = ref("")

const submitRequest = ref({
  code: "",
  language: "java",
  questionId: "",
  type: ""
})

const currentComponent = ref(markRaw(ProblemInfo))


watch(() => route.query.name, async (newVal, oldVal) => {
  if (newVal === 'detail') {
    currentIndex.value = 0
    console.log(0)
    currentComponent.value = markRaw(ProblemInfo)
  } else if (newVal === 'solution') {
    currentIndex.value = 1
    console.log(1)
    currentComponent.value = markRaw(ProblemSolution)
  } else if (newVal === 'submit') {
    currentIndex.value = 2
    console.log(2)
    currentComponent.value = markRaw(ProblemSubmit)
  }
})

const toPath = (id) => {
  if (id === 0) {
    router.push({
      query: {
        name: 'detail',
        type: route.query.type,
        id: route.query.id
      }
    })
  } else if (id === 1) {
    router.push({
      query: {
        name: 'solution',
        type: route.query.type,
        id: route.query.id
      }
    })
  } else if (id === 2) {
    router.push({
      query: {
        name: 'submit',
        type: route.query.type,
        id: route.query.id
      }
    })
  }
}

const selectLanguage = (e) => {
  console.log(e)
  runRequest.value.language = e
  submitRequest.value.language = e
}

const changeCode = (e) => {
  runRequest.value.code = e
  submitRequest.value.code = e
}


const onMoving = (e) => {
  editorHeight.value = e.clientY - 170 + 'px'
}

const onMoveEnd = (e) => {
  editorHeight.value = e.clientY - 170 + 'px'
}

const chooseCase = (index) => {
  caseIndex.value = index
}

const closeCase = (key) => {
  // 遍历数组，删除指定的元素
  runRequest.value.judgeCase = runRequest.value.judgeCase.filter((item, index) =>
      JSON.stringify(item) !== JSON.stringify(runRequest.value.judgeCase[key])
  )
  if (caseIndex.value === key) {
    caseIndex.value = 0
  }
  if (caseIndex.value === runRequest.value.judgeCase.length) {
    caseIndex.value = runRequest.value.judgeCase.length - 1
  }
}

const addCase = () => {
  const judgeCase = {
    input: "",
    output: ""
  }
  testJudgeCaseInput.value.push(testJudgeCaseInput.value.length === 0 ? [] : testJudgeCaseInput.value[testJudgeCaseInput.value.length - 1])
  runRequest.value.judgeCase.push(judgeCase)
  caseIndex.value = runRequest.value.judgeCase.length - 1
}

const chooseJudgeCase = (index) => {
  judgeCaseIndex.value = index
  console.log(index)
  console.log(judgeCaseIndex.value)
}

const back = () => {
  router.push({
    path: '/menu/problems'
  })
}

const run = async () => {
  console.log(runRequest.value)
  console.log(testJudgeCaseInput.value)
  for (let i = 0; i < runRequest.value.judgeCase.length; i++) {
    runRequest.value.judgeCase[i].input = testJudgeCaseInput.value[i].join('\n')
  }
  // console.log(runRequest.value)
  const r = await RUN_QUESTION(runRequest.value)
  if (r.code === STATUS_CODE.SUCCESS_CODE) {
    console.log(r.data)
    runId.value = r.data
    runLoading.value = true
    getQuestionRun()
  } else {
    ERROR(r.message)
  }
}

const submit = async () => {
  const r = await SUBMIT_QUESTION(submitRequest.value)
  if (r.code === STATUS_CODE.SUCCESS_CODE) {
    console.log(r.data)
    submitId.value = r.data
    submitLoading.value = true
    getQuestionSubmit()
  } else {
    ERROR(r.message)
  }
}

const getQuestionRun = () => {
  const intervalId = setInterval(async () => {
    const r = await GET_QUESTION_RUN_BY_ID(runId.value)
    if (r.code === STATUS_CODE.SUCCESS_CODE) {
      console.log(r.data)
      if (r.data.status === 2) {
        NOTIFICATION_SUCCESS("运行成功！")
        runResult.value = r.data
        runLoading.value = false
        changeTabIndex.value = 1
        clearInterval(intervalId)
      }
    } else {
      NOTIFICATION_ERROR(r.message)
      clearInterval(intervalId)
    }
  }, 1000);


}

const getQuestionSubmit = () => {
  const intervalId = setInterval(async () => {
    const r = await GET_QUESTION_SUBMIT_BY_ID(submitId.value)
    if (r.code === STATUS_CODE.SUCCESS_CODE) {
      console.log(r.data)
      if (r.data.status === 2) {
        NOTIFICATION_SUCCESS("提交成功！")
        submitLoading.value = false
        router.push({
          query: {
            name: 'submit',
            id: route.query.id
          }
        })
        clearInterval(intervalId)
      }
    } else {
      NOTIFICATION_ERROR(r.message)
      clearInterval(intervalId)
    }
  }, 1000);
}

const getQuestionInfo = async (id) => {
  console.log(id)
  const res = await store.dispatch('getQuestionInfo', id)
  if (res.code === STATUS_CODE.SUCCESS_CODE) {
    questionInfo.value = res.data
    let judgeCase = []
    res.data.testJudgeCase.forEach(item => {
      judgeCase.push({
        input: item.input,
        output: item.output
      })
      testJudgeCaseInput.value.push(item.input.split('\n'))
    })
    runRequest.value.judgeCase = judgeCase
    runRequest.value.questionId = res.data.id
    submitRequest.value.questionId = res.data.id
  }
}


onMounted(() => {
  getQuestionInfo(route.query.id)
  submitRequest.value.type = route.query.type
  const newVal = route.query.name
  if (newVal === 'detail') {
    currentIndex.value = 0
    console.log(0)
    currentComponent.value = markRaw(ProblemInfo)
  } else if (newVal === 'solution') {
    currentIndex.value = 1
    console.log(1)
    currentComponent.value = markRaw(ProblemSolution)
  } else if (newVal === 'submit') {
    currentIndex.value = 2
    console.log(2)
    currentComponent.value = markRaw(ProblemSubmit)
  }
})


</script>

<style lang="scss" scoped>
.do-problem {
  background: #F0F0F0;
  height: 100vh;

  .top {
    width: 100%;
    height: 4%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding-top: 10px;

    .back {
      margin-left: 20px;
      color: #1a1a1a;
      font-size: 16px;
      font-weight: 500;
      border-radius: 5px;
      width: 120px;
      background: #E7E7E7;

      &:hover {
        background: #BDBBBB80;
      }
    }

    .operator {
      margin-left: 440px;
      display: flex;
      align-items: center;
      justify-content: center;

      .run {
        color: #1a1a1a;
        font-size: 16px;
        font-weight: 500;
        border-radius: 5px;
        margin-right: 10px;
        margin-left: 30px;
        width: 120px;
        background: #E7E7E7;
        animation: .5s;

        &.big {
          width: 220px;
          margin-left: 40px;
        }

        &:hover {
          background: #BDBBBB80;
        }
      }

      .submit {
        font-size: 16px;
        font-weight: 500;
        color: #01B328;
        border-radius: 5px;
        width: 120px;
        background: #E7E7E7;

        &.big {
          width: 220px;
          margin-left: 40px;
        }

        &:hover {
          background: #BDBBBB80;
        }
      }
    }
  }

  .bottom {
    height: 91%;
    display: flex;
    width: 97%;
    margin: 0 auto;
    //background: #ffc0cb;
    .left {
      padding-left: 10px;
      padding-right: 10px;
      border-radius: 5px;
      background: #ffffff;
      width: 50%;

      .top {
        position: sticky;

        .breadcrumb {
          .breadcrumb-item {
            cursor: pointer;

            .icon {
              margin-right: 5px;
              color: #96C7FC;
              font-size: 16px;
            }
            .select {
              color: #3c3c43;
              font-weight: 500;
            }
            .noSelect {
              color: #3c3c43;
              font-weight: normal;
            }
          }
        }


      }

      .other {
        width: 100%;
      }
    }

    .right {
      padding: 10px;
      margin-left: 1%;
      background: #ffffff;
      width: 50%;
      border-radius: 5px;

      .resize-trigger {
        font-size: 30px;
        color: #00000014;
        width: 100%;
        background: #F0F0F0;
        height: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 40px;
        margin-left: -20px;
        border-radius: 10px;
      }

      .tip {
        padding: 10px;
        font-size: 15px;
      }

      .right-top {
        height: 100%;
      }

      .right-bottom {
        min-height: 90px;

        .top {
          display: flex;
          align-items: center;

          .testCase {
            border-radius: 5px;
            padding: 6px;
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: .875rem;
            line-height: 1.25rem;
            color: var(--color-neutral-6);
            font-weight: 400;

            .icon {
              margin-right: 5px;
              color: #01B328;
              font-size: 16px;
            }

            &:hover {
              background: #F2F3F4;
            }
          }

          .result {
            border-radius: 5px;
            padding: 6px;
            color: var(--color-neutral-6);
            margin-left: 10px;
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: .875rem;
            line-height: 1.25rem;

            .icon {
              margin-right: 5px;
              color: #01B328;
              font-size: 16px;
            }

            &:hover {
              background: #F2F3F4;
            }
          }
        }

        .content {
          padding: 10px;

          .testJudgeCase {
            display: flex;
            flex-direction: column;


            .tags {
              display: flex;

              .tag {
                font-size: 12px;
                margin-right: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                width: 70px;
                height: 30px;
                border-radius: 5px;
                background: #ffffff;

                &:hover {
                  background: #E7E7E7;
                }

                &.active {
                  background: #F2F3F4;
                  color: var(--color-neutral-10);
                  font-weight: 600;

                }
              }

              .plus {
                cursor: pointer;
                background: #ffffff;

                &:hover {
                  background: #E7E7E7;
                }
              }
            }

            .caseDetail {
              display: flex;
              flex-direction: column;

              .input {
                .tip {
                  color: #3c3c4399;
                  font-weight: 500;
                  font-size: .75rem;
                  line-height: 1rem;
                }

                .case {
                  margin-bottom: 10px;

                  .label {
                    color: #3c3c4399;
                    font-weight: 500;
                    font-size: .75rem;
                    line-height: 1rem;
                    margin-right: 5px;
                    margin-bottom: 10px;
                  }
                }
              }
            }

            .output {
              .tip {
                color: #3c3c4399;
                font-weight: 500;
                font-size: .75rem;
                line-height: 1rem;
              }

            }
          }
        }

        .runResult {
          .noResult {
            display: flex;
            align-items: center;
            justify-content: center;
            //min-width: 400px;
            font-size: 15px;
            color: #3c3c434d;
            font-weight: 400;
          }

          .resultContent {
            .top {
              .status {
                font-weight: 500;
                font-size: 1.25rem;
                line-height: 1.75rem;

                &.accept {
                  color: rgb(45 181 93/1);
                }

                &.wrong {
                  color: rgb(255 0 0/1);
                }

                &.compile-error {
                  color: rgb(255 0 0/1);
                }

                &.time-limit-exceed {
                  color: rgb(255 0 0/1);
                }

              }

              .time {
                color: #3c3c4399;
                margin-left: 1rem;
              }
            }

            .bottom {
              display: flex;
              flex-direction: column;

              .tags {
                display: flex;

                .tag {
                  margin-right: 10px;
                  margin-bottom: 10px;
                  cursor: pointer;
                  width: 70px;
                  height: 30px;
                  border-radius: 5px;
                  background: #ffffff;

                  &:hover {
                    background: #E7E7E7;
                  }

                  &.active {
                    background: #F2F3F4;
                    font-weight: 600;

                  }
                }

                .plus {
                  cursor: pointer;
                  background: #ffffff;

                  &:hover {
                    background: #E7E7E7;
                  }
                }
              }

              .caseDetail {
                display: flex;
                flex-direction: column;

                .input {
                  .tip {
                    color: #3c3c4399;
                    font-weight: 500;
                    font-size: .75rem;
                    line-height: 1rem;
                  }

                  .case {
                    margin-bottom: 10px;

                    .label {
                      color: #3c3c4399;
                      font-weight: 500;
                      font-size: .75rem;
                      line-height: 1rem;
                      margin-right: 5px;
                      margin-bottom: 10px;
                    }
                  }
                }

                .output {
                  .tip {
                    color: #3c3c4399;
                    font-weight: 500;
                    font-size: .75rem;
                    line-height: 1rem;
                  }

                }

                .expectedOutput {
                  .tip {
                    color: #3c3c4399;
                    font-weight: 500;
                    font-size: .75rem;
                    line-height: 1rem;
                  }

                  .content {
                  }
                }
              }
            }
          }
        }


      }
    }
  }

}

</style>
