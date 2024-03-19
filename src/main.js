import './style.css'
import {createApp} from 'vue'
import ArcoVue from '@arco-design/web-vue';
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import router from "./router";
import store from "./store";
// 导入权限控制
import "./access"

// 这是预览时引用的
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import createCopyCodePreview from '@kangc/v-md-editor/lib/plugins/copy-code/preview';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

// 这是编辑器
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index';
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';

// highlightjs
import hljs from 'highlight.js';


VueMarkdownEditor.use(githubTheme, {
    Hljs: hljs,
    extend(md) {
        // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
        // md.set(option).use(plugin);
    },
}).use(createHighlightLinesPlugin()).use(createCopyCodePlugin());

//预览的主题
VMdPreview.use(githubTheme, {
    Hljs: hljs,
}).use(createCopyCodePreview());

import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
VMdPreviewHtml.use(createCopyCodePreview());



const app = createApp(App);
app.use(ArcoVue)
    .use(ArcoVueIcon)
    .use(router)
    .use(store)
    .use(VueMarkdownEditor)
    .use(VMdPreview)
    .use(VMdPreviewHtml)
    .mount('#app');

