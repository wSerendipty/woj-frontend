<template>
    <div  >
      <v-md-editor
          :model-value="props.value"
          :autofocus="false"
          :height="props.height+'px'"
          ref="editor"
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
import {UPLOAD_IMAGE} from "@/service/api/fileApi.js";

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: 350
  },
  onChange: {
    type: Function,
    default: (text,html) => {
      console.log(text,html)
    }
  }
})


//左侧工具栏
const leftBar = ref('undo redo clear h bold italic strikethrough quote ul ol table hr link image code ');
//右侧工具栏
const rightBar = ref(' preview sync-scroll fullscreen ');

const change = (text,html) => {
  props.onChange(text,html)
}

//Alt + a 实现上传图片
const handleUploadImage = async (event, insertImage, files) => {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  const formData = new FormData();
  formData.append('file', files[0]);
  formData.append('biz', "md_image")
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


</script>

<style scoped lang="scss">
</style>