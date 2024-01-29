<template>
  <div class="addQuestion">
    <div class="form">
      <a-form :model="form">
        <a-form-item label="题目标题" :content-flex="false" :merge-props="false">
          <a-input v-model="form.title" placeholder="请输入标题"/>
        </a-form-item>
        <a-form-item field="tags" label="标签">
          <a-select :style="{width:'220px'}" placeholder="请选择标签" allow-create multiple
                    v-model:model-value="form.tags">
            <a-option :value="item.name" v-for="item in props.tagList">{{ item.name }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="difficulty" label="难度">
          <a-select :style="{width:'220px'}" placeholder="请选择难度"
                    v-model:model-value="form.difficulty">
            <a-option >简单</a-option>
            <a-option >中等</a-option>
            <a-option >困难</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="题目内容" :content-flex="false" :merge-props="false">
          <MdEditorContent :height="300" class="editor" :value="form.content" :on-change="contentChange"/>
        </a-form-item>
        <a-form-item label="题目答案" :content-flex="false" :merge-props="false">
          <MdEditorContent :height="300" class="editor" :value="form.answer" :on-change="answerChange"/>
        </a-form-item>
        <a-form-item label="题目模板" :content-flex="false" :merge-props="false">
          <div class="template">
            <div><code>{{ JSON.stringify(form.questionTemplates) }}</code></div>
            <!--            <div>语言：<strong>{{ item.language }}</strong></div>-->
            <!--            <div style="margin-top: 10px;">模板：<code>{{ item.code }}</code></div>-->
          </div>
          <div style="display: flex;align-items: end">
            <a-button type="primary" @click="addModelFlag" style="margin-left: auto;">添加模板</a-button>
          </div>
          <a-modal v-if="codeModel" v-model:visible="codeModel" title="添加模板" @ok="addTemplate"
                   @cancel="codeModel = false">
            <CodeEditorVue :on-change="changeCode" :on-select="changeLanguage" class="editor"
                           :height="'200px'"></CodeEditorVue>
          </a-modal>
        </a-form-item>
        <a-form-item label="判题用例" :content-flex="false" :merge-props="false">
          <div class="template">
            <div><code>{{ JSON.stringify(form.judgeCase) }}</code></div>
          </div>
          <div style="display: flex;align-items: end">
            <a-button type="primary" @click="addCaseModelFlag" style="margin-left: auto;">添加用例</a-button>
          </div>
          <a-modal v-if="caseModel" v-model:visible="caseModel" title="添加用例（JSON格式）" @ok="addJudgeCase"
                   @cancel="caseModel = false">
            <CodeEditorVue :on-change="changeCase" class="editor"
                           :height="'200px'"></CodeEditorVue>
          </a-modal>
        </a-form-item>
        <a-form-item label="测试判题用例" :content-flex="false" :merge-props="false">
          <div class="template">
            <div><code>{{ JSON.stringify(form.testJudgeCase) }}</code></div>
          </div>
          <div style="display: flex;align-items: end">
            <a-button type="primary" @click="addTestCaseModelFlag" style="margin-left: auto;">添加用例</a-button>
          </div>
          <a-modal v-if="testCaseModel" v-model:visible="testCaseModel" title="添加测试用例（JSON格式）" @ok="addTestJudgeCase"
                   @cancel="testCaseModel = false">
            <CodeEditorVue :on-change="changeTestCase" class="editor"
                           :height="'200px'"></CodeEditorVue>
          </a-modal>
        </a-form-item>
        <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
          <div style="display: flex;flex-direction: column;">
            <div>
              <span>时间限制：</span>
              <a-input-number :style="{width:'320px'}" placeholder="请输入时间限制"
                              v-model:model-value="form.judgeConfig.timeLimit" mode="button"
                              style="margin-left: 10px;">
                <template #suffix>
                  <span>ms</span>
                </template>
              </a-input-number>
            </div>
            <div style="margin-top: 10px;">
              <span>内存限制：</span>
              <a-input-number :style="{width:'320px'}" placeholder="请输入内存限制"
                              v-model:model-value="form.judgeConfig.memoryLimit" mode="button"
                              style="margin-left: 10px;">
                <template #suffix>
                  <span>B</span>
                </template>
              </a-input-number>

            </div>
            <div style="margin-top: 10px;">
              <span>堆栈限制：</span>
              <a-input-number :style="{width:'320px'}" placeholder="请输入堆栈限制"
                              v-model:model-value="form.judgeConfig.stackLimit" mode="button"
                              style="margin-left: 10px;">
                <template #suffix>
                  <span>B</span>
                </template>
              </a-input-number>

            </div>
          </div>

        </a-form-item>
        <a-button type="primary" status="success" @click="submit" style="margin-left: auto; border-radius: 6px; width: 150px">提交</a-button>
      </a-form>
    </div>
  </div>

</template>
<script setup>
import {onMounted, ref, watch} from "vue";
import MdEditorContent from "@/components/mdEditor/MdEditorContent.vue";
import CodeEditorVue from "@/components/codeEditor/CodeEditorVue.vue";
import {ADD_QUESTION, GET_QUESTION_BY_ID, UPDATE_QUESTION} from "@/service/api/questionApi.js";
import {STATUS_CODE} from "@/common/status.js";
import {ERROR, SUCCESS} from "@/utils/message.js";

const codeModel = ref(false)
const caseModel = ref(false)
const testCaseModel = ref(false)
const templateTemp = ref({})
const judgeCaseTemp = ref({})
const testJudgeCaseTemp = ref({})

const props = defineProps({
  tagList: {
    type: Array,
    default: () => []
  },
  question: {
    type: Object,
    default: () => {}
  }
})
const form = ref(props.question)


const contentChange = (text,html) => {
  form.value.content = text
}

const answerChange = (text,html) => {
  form.value.answer = text
}

const addModelFlag = () => {
  templateTemp.value = {}
  codeModel.value = true
}

const changeCode = (e) => {
  console.log(e)
  templateTemp.value.code = e
}

const changeLanguage = (e) => {
  console.log(e)
  templateTemp.value.language = e
}

const addTemplate = () => {
  form.value.questionTemplates.push(templateTemp.value)
  codeModel.value = false
}

const addCaseModelFlag = () => {
  judgeCaseTemp.value = {}
  caseModel.value = true
}

const changeCase = (e) => {
  judgeCaseTemp.value = e
}

const addJudgeCase = () => {
  form.value.judgeCase = JSON.parse(judgeCaseTemp.value)
  codeModel.value = false
}

const addTestCaseModelFlag = () => {
  testJudgeCaseTemp.value = {}
  testCaseModel.value = true
}

const changeTestCase = (e) => {
  testJudgeCaseTemp.value = e
}

const addTestJudgeCase = () => {
  form.value.testJudgeCase = JSON.parse(testJudgeCaseTemp.value)
  testCaseModel.value = false
}

const submit = () => {
  UPDATE_QUESTION(form.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("修改成功")
    } else {
      ERROR("修改失败")
    }
  })
}



onMounted(() => {
})

</script>

<style lang="scss" scoped>
.addQuestion {
  padding: unset;
  width: 100%;

  .form {
    margin: 0 auto;
    width: 1000px;

    .editor {
      width: 800px;
    }

    .template {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-bottom: 10px;

      code {
        background-color: #eee;
        padding: 5px;
        border-radius: 5px;
      }

    }
  }

}


</style>