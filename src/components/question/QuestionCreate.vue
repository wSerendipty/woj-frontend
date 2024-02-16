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
          <MdEditorContent :height="300" class="editor" :on-change="contentChange"/>
        </a-form-item>
        <a-form-item label="题目答案" :content-flex="false" :merge-props="false">
          <MdEditorContent :height="300" class="editor" :on-change="answerChange"/>
        </a-form-item>
        <a-form-item label="题目模板" :content-flex="false" :merge-props="false">
          <div class="template">
            <div><code>{{ JSON.stringify(form.questionTemplates) }}</code></div>
          </div>
          <div style="display: flex;align-items: end">
            <a-button type="primary" status="success" @click="editModelFlag" style="margin-left: auto;">编辑模板</a-button>
            <a-button type="primary" @click="addModelFlag" style="margin-left: 20px;">添加模板</a-button>
          </div>
          <a-modal v-if="editCodeModel" v-model:visible="editCodeModel" title="添加模板" @ok="editTemplate"
                   @cancel="editCodeModel = false">
            <CodeEditorVue :on-change="editCode" class="editor" :value="updateTemplate"
                           :height="'200px'" ></CodeEditorVue>
          </a-modal>
          <a-modal v-if="codeModel" v-model:visible="codeModel" title="添加模板" @ok="addTemplate"
                   @cancel="codeModel = false">
            <CodeEditorVue :on-change="changeCode" :on-select="changeLanguage" class="editor"
                           :height="'200px'"></CodeEditorVue>
          </a-modal>
        </a-form-item>
        <a-form-item label="判题用例" :content-flex="false" :merge-props="false">
          <div class="template">
            <div><code>{{ form.judgeCase }}</code></div>
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
            <a-button type="primary" @click="addTestCaseModelFlag" style="margin-left: auto;">添加测试用例</a-button>
          </div>
          <a-modal v-if="testCaseModel" v-model:visible="testCaseModel" title="添加测试用例（JSON格式）" @ok="addTestJudgeCase"
                   @cancel="testCaseModel = false">
            <CodeEditorVue :on-change="changeTestCase"  class="editor"
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
import {ADD_QUESTION} from "@/service/api/questionApi.js";
import {STATUS_CODE} from "@/common/status.js";
import {ERROR, SUCCESS} from "@/utils/message.js";
import store from "@/store/index.js";

const editCodeModel = ref(false)
const codeModel = ref(false)
const caseModel = ref(false)
const testCaseModel = ref(false)
const templateTemp = ref({

})
const updateTemplate = ref({})
const judgeCaseTemp = ref({})
const testJudgeCaseTemp = ref({})

const props = defineProps({
  tagList: {
    type: Array,
    default: () => []
  }
})
const form = ref({
  answer: "",
  content: "",
  judgeCase: [],
  judgeConfig: {
    memoryLimit: 0,
    stackLimit: 0,
    timeLimit: 0
  },
  questionTemplates: [],
  tags: [],
  testJudgeCase: [],
  title: ""
})

const contentChange = (text,html) => {
  form.value.content = text
}

const answerChange = (text,html) => {
  form.value.answer = text
}

const addModelFlag = () => {
  templateTemp.value={
    language: "java",
    code: `public class Main {\n" +
      "    public static void main(String[] args) {\n" +
      "        System.out.println(\"Hello World!\");\n" +
      "    }\n" +
      "}`,
  }
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
  console.log(templateTemp.value)
  form.value.questionTemplates.push(templateTemp.value)
  console.log(form.value.questionTemplates)
  codeModel.value = false
}

const editModelFlag = () => {
  updateTemplate.value = {
    language: 'json',
    code: JSON.stringify(form.value.questionTemplates)
  }
  editCodeModel.value = true
}

const editCode = (e) => {
  updateTemplate.value.code = e
}

const editTemplate = () => {
  form.value.questionTemplates = JSON.parse(updateTemplate.value?.code)
  editCodeModel.value = false
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
  ADD_QUESTION(form.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("添加成功")
    } else {
      ERROR("添加失败")
    }
  })
}
onMounted(()=>{
  store.commit('set_question',{
    acceptedNum: 0,
    content: "",
    createTime: "",
    difficulty: "",
    id: 0,
    judgeCase: [],
    judgeConfig: {
      memoryLimit: 0,
      stackLimit: 0,
      timeLimit: 0
    },
    questionTemplates: [
      {
        language: "json",
        code: "",
      },{
        language: "java",
        code: "class Solution {\n" +
            "    public int[]  solution() {\n" +
            "\n" +
            "    }\n" +
            "}",
      },
      {
        language: "python",
        code: "",
      },
      {
        language: "c",
        code: "",
      },
      {
        language: "cpp",
        code: "",
      }
    ],
    solutionNum: 0,
    submitNum: 0,
    tags: [],
    testJudgeCase: [],
    title: ""
  })
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