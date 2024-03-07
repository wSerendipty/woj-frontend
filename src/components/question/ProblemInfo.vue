<template>
  <div class="questionInfo">

    <a-scrollbar style="height:475px;overflow: auto;">
      <div class="top">
        <div class="title">
          <div>{{ questionInfo.id }}. {{ questionInfo.title }}</div>
        </div>
        <div class="tags">
          <a-tag color="green" class="item" v-if="questionInfo.difficulty === '简单'">{{
              questionInfo.difficulty
            }}
          </a-tag>
          <a-tag color="orange" class="item" v-else-if="questionInfo.difficulty === '中等'">{{ questionInfo.difficulty }}
          </a-tag>
          <a-tag color="magenta" class="item" v-else>{{ questionInfo.difficulty }}</a-tag>
          <a-tag class="item" v-for="item in questionInfo.tags" :key="item">{{ item }}</a-tag>
        </div>
        <v-md-preview-html :html="xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(questionInfo.content))" preview-class="github-markdown-body"></v-md-preview-html>
        <!--      <div class="content"-->
        <!--           v-html="xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(questionInfo.content))">-->
        <!--      </div>-->
        <div class="example">
          <div v-for="(item,index) in questionInfo.testJudgeCase" class="example-item">
            <div class="tip"><strong>示例 {{ index + 1 }}:</strong></div>
            <div class="testCase">
              <div class="input">
                <div class="label">输入:</div>
                <div v-for="(item1,index1) in item.input.split('\n')" :key="index">
                  arg{{index1+1}} = {{item1}}<span v-if="index1 !== item.input.split('\n').length-1">，</span></div>
              </div>
              <div class="output"><div class="label">输出:</div>
                <div>{{ item.output }}</div>
              </div>
            </div>
          </div>
        </div>
        <a-divider/>
        <div class="middle">
          <div class="number">通过次数
            <a-statistic :value-style="{fontSize:'.875rem',fontWeight:'600',color:'rgb(38 38 38/1)'}"
                         :value="questionInfo.acceptedNum / 1000"
                         :precision="1">
              <template #suffix>M</template>
            </a-statistic>
          </div>
          <div class="number">提交次数
            <a-statistic :value-style="{fontSize:'.875rem',fontWeight:'600',color:'rgb(38 38 38/1)'}"
                         :value="questionInfo.submitNum / 1000"
                         :precision="1">
              <template #suffix>M</template>
            </a-statistic>
          </div>
          <div class="number">通过率
            <a-statistic :value-style="{fontSize:'.875rem',fontWeight:'600',color:'rgb(38 38 38/1)'}"
                         :value="questionInfo.submitNum !== 0?(questionInfo.acceptedNum / questionInfo.submitNum)*100:0"
                         :precision="2">
              <template #suffix>%</template>
            </a-statistic>
          </div>
        </div>
      </div>
    </a-scrollbar>


    <div class="bottom">
      <div class="solutionNum">
        <icon-subscribe-add class="icon"/>
        <a-statistic :value-style="{fontSize:'.875rem',color:'rgb(38 38 38/1)'}"
                     :value="questionInfo.solutionNum / 1000"
                     :precision="1">
          <template #suffix>K</template>
        </a-statistic>
      </div>
      <div class="createTime">
        <icon-calendar-clock class="icon"/>
        <span>{{ formatTime(questionInfo.createTime, 0) }}</span></div>
    </div>

  </div>
</template>
<script setup>
import {computed, onMounted} from "vue";
import xss from "@kangc/v-md-editor/es/utils/xss/index.js";
import VueMarkdownEditor from "@kangc/v-md-editor";
import {formatTime} from "@/utils/dateParse.js";
import store from "@/store/index.js";

const questionInfo = computed(() => {
  return store.getters.questionInfo
})

onMounted(() => {
})
</script>
<style scoped lang="scss">
.questionInfo {
  padding-top: 10px;
  //background: #ffc0cb;
  min-height: 500px;
  min-width: 500px;

  .top {
    min-height: 450px;

    .title {
      color: #1a1a1a;
      font-weight: 600;
      font-size: 24px;
      line-height: 32px;
    }

    .tags {
      margin-top: 10px;

      .item {
        border-radius: 5px;
        margin-right: 10px;
      }
    }

    .content {
      margin-top: 10px;
      font-size: 15px;
      line-height: 24px;
    }

    .example {
      margin-top: 10px;

      .example-item {
        margin-bottom: 10px;

        .tip {
          color: #1a1a1a;
          font-weight: 600;
          font-size: 15px;
          line-height: 24px;
        }

        .testCase {
          margin-top: 10px;
          margin-left: 5px;
          border-left: 2px solid #EBEBEB;
          padding-left: 10px;

          .input {
            .label{
              color: #1a1a1a;
              font-weight: 600;
              font-size: 15px;
              line-height: 24px;
              margin-right: 5px;
            }
            color: var(--color-neutral-8);
            display: flex;
            font-size: 13px;
            line-height: 24px;
          }

          .output {
            .label{
              color: #1a1a1a;
              font-weight: 600;
              font-size: 15px;
              line-height: 24px;
              margin-right: 5px;
            }
            color: var(--color-neutral-8);
            display: flex;
            font-size: 13px;
            line-height: 24px;
          }
        }
      }

    }

    .middle {
      display: flex;

      .number {
        margin-right: 20px;
        color: #262626bf;
        font-size: .75rem;
        line-height: 1rem;
      }
    }

  }


  .bottom {
    align-items: center;
    height: 40px;
    position: sticky;
    bottom: 0;
    background: #ffffff;
    padding-top: 10px;
    display: flex;
    font-size: 14px;

    .solutionNum {
      display: flex;
      align-items: center;
      margin-right: 20px;

      .icon {
        color: rgb(var(--arcoblue-6));
        font-size: 16px;
        margin-right: 5px;
      }
    }

    .createTime {
      display: flex;
      align-items: center;

      .icon {
        color: rgb(var(--orange-6));
        font-size: 16px;
        margin-right: 5px;
      }
    }
  }

}

</style>