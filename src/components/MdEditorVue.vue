<template>
    <div  >
      <a-input class="input" v-if="props.titleInput" v-model:model-value="post.title"  style="width: 100%; padding-left: 10px" size="large" placeholder="请输入标题" allow-clear/>
      <div class="select" v-if="props.titleInput">
        <a-select style="width: 200px; border-radius: 10px;margin-left: 5px;" allow-search placeholder="请选择标签" @change="handleChange">
          <a-option v-for="item in searchTagList">{{ item }}</a-option>
        </a-select>
        <a-tag closable v-for="item in tagList" style="border-radius: 10px;margin-left: 5px;" @close="handleClose(item)">{{item}}</a-tag>
      </div>
      <v-md-editor
          class="v-md-editor"
          v-model="form.artContent"
          :autofocus="true"
          height="350px"
          width="100%"
          ref="editor"
          :toolbar="toolbar"
          :left-toolbar="leftBar"
          :right-toolbar="rightBar"
          :disabled-menus="[]"
          @change="change"
          @upload-image="handleUploadImage"
      ></v-md-editor>
    </div>

</template>

<script setup>
import {ref} from 'vue';
import {UPLOAD_IMAGE} from "../service/api/fileApi.js";
const searchTagList = ref(["编程"])
const tagList = ref([])

const props = defineProps({
  message: {
    type: String,
    default: '发布'
  },
  titleInput:{
    type: Boolean,
    default: false
  }
})

// 定义父组件接收的自定义事件名
const emit = defineEmits(['EditorEvent']);

const emitMessage = {
  cancel: 'cancel',  // 取消
  push: "push",  // 发布
}

// 在子组件内部的方法中触发事件
const handleCancel = () => {
  const message = emitMessage.cancel;
  emit('EditorEvent', message);
}

const handlePush = () => {
  const message ={
    type: emitMessage.push,
    value: post.value
  }
  emit('EditorEvent', message);
}
const form = ref({
  artContent: ''
})
const post = ref({
  title: '',
  content: '',
  tags: tagList.value
})
//左侧工具栏
const leftBar = ref('undo redo clear h bold italic strikethrough quote ul ol table hr link image code |cancelToolbar');
//右侧工具栏
const rightBar = ref(' preview sync-scroll fullscreen | pushToolbar');

const toolbar = {
  cancelToolbar: {
    title: "close",
    text: "关闭",
    action(editor) {
      handleCancel()
    }
  },
  pushToolbar: {
    title: "push",
    text: props.message,
    action(editor) {
      handlePush()
    }
  }
}

const change = (text,html) => {
  // console.log(value)
  post.value.content = html
}

//Alt + a 实现上传图片
const handleUploadImage = async (event, insertImage, files) => {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  const formData = new FormData();
  formData.append('file', files[0]);
  formData.append('biz', "comment_image")
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



const handleChange = (e) => {
  if (tagList.value.includes(e)) {
    return
  }
  tagList.value.push(e)
  console.log(e)
}

const handleClose = (item) => {
  const index = tagList.value.indexOf(item)
  tagList.value.splice(index, 1)
}


</script>

<style scoped lang="scss">

.v-md-editor {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;
  overflow-y: auto;
}

.input{
  position: fixed;
  bottom: 390px;
  width: 100%;
}

.select{
  display: flex;
  align-items: center;
  background: #ffffff;
  height: 40px;
  position: fixed;
  bottom: 350px;
  width: 100%;
}
</style>