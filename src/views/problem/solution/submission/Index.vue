<template>
  <div class="submission">
    <div class="content">
      <div class="top">
        <div class="top-left">
          <div class="title">
            <span>标题：</span>
            <a-input class="input" v-model:model-value="solution.title" size="large"
                     placeholder="请输入标题" allow-clear/>
          </div>
          <div class="select">
            <span>标签：</span>
            <a-select style="width: 200px;margin-left: 5px;" v-model:model-value="tag" allow-create
                      placeholder="请选择标签"
                      @change="handleChange">
              <a-option v-for="item in searchTagList">{{ item }}</a-option>
            </a-select>
            <a-tag closable v-for="item in chooseTagList" :key="item" style="border-radius: 10px;margin-left: 5px;"
                   @close="handleClose(item)">{{ item }}
            </a-tag>
          </div>
        </div>
        <div class="top-right">
          <a-button status="normal" class="cancel" @click="onCancel">取消</a-button>
          <a-button status="success" class="push" @click="onPush">发布</a-button>
        </div>
      </div>
      <v-md-editor
          class="v-md-editor"
          v-model="form.artContent"
          :autofocus="true"
          height="80%"
          width="100%"
          ref="editor"
          :left-toolbar="leftBar"
          :right-toolbar="rightBar"
          :disabled-menus="[]"
          @change="change"
          @upload-image="handleUploadImage"
          @copy-code-success="handleCopyCodeSuccess"
      ></v-md-editor>
    </div>

  </div>

</template>

<script setup>
import {onMounted, ref} from 'vue';
import {UPLOAD_IMAGE} from "@/service/api/fileApi.js";
import {STATUS_CODE} from "@/common/status.js";
import {ADD_TAG, GET_TAG_LIST} from "@/service/api/tagApi.js";
import {ERROR, SUCCESS, WARNING} from "@/utils/message.js";
import {fileEnum} from "@/common/file/fileEnum.js";
import {ADD_SOLUTION} from "@/service/api/solutionApi.js";
import router from "@/router/index.js";
import {useRoute} from "vue-router";
import path from "path";

const route = useRoute()
const searchTagList = ref([])
const tag = ref("")
const chooseTagList = ref([])
const tagQuery = ref({
  belongType: 'question'
})

const addTagRequest = ref({
  name: '',
  belongType: 'question'
})


const form = ref({
  artContent: ''
})

const solution = ref({
  questionId: route.query.id,
  title: '',
  content: '',
  tags: chooseTagList.value
})

//左侧工具栏
const leftBar = ref('undo redo clear h bold italic strikethrough quote ul ol table hr link image code ');
//右侧工具栏
const rightBar = ref(' preview sync-scroll');


const change = (text, html) => {
  solution.value.content = text
}

//Alt + a 实现上传图片
const handleUploadImage = async (event, insertImage, files) => {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  const formData = new FormData();
  formData.append('file', files[0]);
  formData.append("biz", fileEnum.COMMENT_IMAGE)
  //你自己的上传文件接口
  let res = await UPLOAD_IMAGE(formData);
  insertImage({
    //state.filePreviewUrl 是我本地的预览接口 你可以换成自己的也可以用上传接口给你反的url
    url: res.data,
    desc: res.data,
    width: '200',
    height: '200',
  });
};

const onADD = () => {
  ADD_TAG(addTagRequest.value).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("添加成功")
      chooseTagList.value.push(addTagRequest.value.name)
    } else {
      ERROR(res.message)
    }
  })
}

const handleChange = (e) => {
  if (chooseTagList.value.includes(e)) {
    WARNING("标签已存在")
    return
  }
  if (!searchTagList.value.includes(e)) {
    addTagRequest.value.name = e
    onADD()
  } else {
    chooseTagList.value.push(e)
  }
}

const handleClose = (item) => {
  console.log(item)
  //删除数组中的元素
  chooseTagList.value = chooseTagList.value.filter((tag) => {
        return tag !== item
      }
  )
}
const getTagList = () => {
  GET_TAG_LIST(tagQuery.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      searchTagList.value = []
      res.data.forEach(item => {
        searchTagList.value.push(item.name)
      })
    }
  })
}

const onCancel = () => {
  router.replace({
    path: "/problem/do",
    query: {
      name: "solution",
      type: "normal",
      id: solution.value.questionId
    }
  })
}

const onPush = () => {
  ADD_SOLUTION(solution.value).then(res => {
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("发布成功")
    } else {
      ERROR(res.message)
    }
    console.log(res)
  })
}

const handleCopyCodeSuccess = (code) => {
  SUCCESS("复制成功")
  console.log(code)
}

onMounted(() => {
  console.log(route.query.questionId)
  solution.value.questionId = route.query.questionId
  getTagList()
})


</script>

<style scoped lang="scss">

.submission {
  height: 100vh;
  max-width: 1200px;
  background-color: rgb(247 248 250 / 1);
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  .content {
    padding-top: 10px;
    background: #ffffff;
    --tw-shadow: 0px 1px 3px #0000000a, 0px 2px 8px #00000014;
    --tw-shadow-colored: 0px 1px 3px var(--tw-shadow-color), 0px 2px 8px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-shadow);
    height: 100%;

    .top {
      padding: 10px;
      display: flex;
      justify-content: space-between;

      .top-left {
        display: flex;
        flex-direction: column;

        .title {
          .input {
            width: 400px;
            border-radius: 5px;
            margin-left: 5px;
          }
        }

        .select {
          margin-top: 10px;
          align-items: center;
        }
      }

      .top-right {
        margin-right: 10px;

        .cancel {
          width: 100px;
          border-radius: 6px;
        }

        .push {
          border-radius: 6px;
          width: 100px;
          margin-left: 10px;
        }
      }

    }
  }

}


</style>