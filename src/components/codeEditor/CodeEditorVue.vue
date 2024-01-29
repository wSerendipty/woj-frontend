<template>
  <div>
    <div class="code">
      <a-select class="select" v-if="props.select" :style="{width:'120px'}" placeholder="请选择语言" :bordered="false" default-value="java"
                v-model:model-value="languageHandle" @change="onSelect">
        <a-option v-for="item in languages">{{ item }}</a-option>
      </a-select>
      <div ref="editorRef" class="codeEditor" :style="{height:props.height}"></div>
    </div>
  </div>
</template>

<script setup>
import * as monaco from 'monaco-editor';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import {onMounted, ref, toRaw, watch} from 'vue';
import {Languages} from "@/common/language/languageConstants.js";

const props = defineProps({
  value: {
    type: Object,
    default: () => {
      return {
        language: 'java',
        code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`
      }
    },
  },
  onChange: {
    type: Function,
    default: () => {
    },
  },
  onSelect: {
    type: Function,
    default: () => {
    },
  },
  select: {
    type: Boolean,
    default: true,
  },
  height: {
    type: String,
    default: '300px',
  }
});

const editorValue = ref(props.value.code);

const editorRef = ref(null);

const codeEditor = ref(null);
const languages = ref(Languages)

const template = ref([
  {
    type: 'java',
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
  },
  {
    type: 'python',
    defaultCode: `print("Hello World!")`,
  },
  {
    type: 'c',
    defaultCode: `#include <stdio.h>
int main() {
    printf("Hello World!");
    return 0;
}`,
  },
  {
    type: 'cpp',
    defaultCode: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello World!";
    return 0;
}`,
  },
  {
    type: 'json',
    defaultCode: `[{"input": "1 2","output": "3"}]`
  }, {
    type: "go",
    defaultCode: `package main
import "fmt"
func main() {
    fmt.Println("Hello World!")
}`
  }
]);

const languageHandle = ref(props.value.language)


watch(() => languageHandle.value, (val) => {
  if (!codeEditor.value) {
    return;
  }
  monaco.editor.setModelLanguage(toRaw(codeEditor.value).getModel(), val);
  toRaw(codeEditor.value).setValue(template.value.find(item => item.type === val).defaultCode || '');
})

// 解决vite Monaco提示错误
self.MonacoEnvironment = {
  getWorker() {
    return new JsonWorker();
  },
};

onMounted(() => {
  if (!editorRef.value) {
    return;
  }
  // 直接创建编辑器实例即可
  codeEditor.value = monaco.editor.create(editorRef.value, {
    value: editorValue.value,
    language: "java",
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    theme: 'vs',
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    scrollbar:{
      verticalScrollbarSize: 4,
      horizontalScrollbarSize: 6,
    },
    tabSize: 2,
  });


  // 编辑 监听内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    props.onChange(toRaw(codeEditor.value).getValue())
  })
});
</script>

<style lang="scss">
.code {
  width: 100%;
  height: 100%;
  background: #ffffff;
  //border: 1px solid #00000014;
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  .select {
    margin-top: auto;
    margin-bottom: auto;
  }

  .codeEditor {
    margin-top: 10px;
    border: 1px solid #00000014;
  }
}
</style>