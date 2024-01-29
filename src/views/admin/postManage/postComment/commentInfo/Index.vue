<template>
  <div class="app">
    <div class="questionInfo">
      <div class="top">
        <div class="title">运行管理</div>
        <div style="display: flex">
          <div class="query-way">
              <div class="query-item">
                <div class="label">帖子ID</div>
                <a-input placeholder="请输入帖子ID" v-model:model-value="queryAllRequest.postId"/>
              </div>
              <div class="query-item">
                <div class="label">帖子状态</div>
                <a-select :style="{width:'220px'}" placeholder="请选择"
                          v-model:model-value="queryAllRequest.status">
                  <a-option :value="getCommentStatus(item)" v-for="item in CommentStatus">{{ item }}</a-option>
                </a-select>
              </div>
              <div class="query-item">
                <div class="label">父评论ID</div>
                <a-input placeholder="请输入父评论ID" v-model:model-value="queryAllRequest.commentId"/>
              </div>
          </div>

          <div style="display: flex;">
            <a-divider direction="vertical"></a-divider>
            <div style="display: flex;flex-direction: column;">
              <a-button type="primary" style="margin-left: 10px;width: 100px;" @click="search">
                <template #icon>
                  <icon-search/>
                </template>
                <template #default>搜索</template>
              </a-button>
              <a-button style="margin-left: 10px; margin-top: 10px; width: 100px;" @click="reSet">
                <template #icon>
                  <icon-refresh/>
                </template>
                <template #default>重置</template>
              </a-button>
            </div>
          </div>
        </div>
      </div>
      <a-divider/>
      <div class="bottom">
        <a-table :columns="columns" :data="data" stripe :pagination="pagination">
          <template #status="{ record }">
            <a-select :style="{width:'120px'}" placeholder="请选择"
                      v-model:model-value="record.status" @change="changeStatus(record)">
              <a-option :value="getCommentStatus(item)" v-for="item in CommentStatus">{{ item }}</a-option>
            </a-select>
          </template>
          <template #createTime="{ record }">
            {{ formatTime(record.createTime, 0) }}
          </template>
          <template #option="{ record,rowIndex }">
            <div style="display: flex">
              <a-button status="danger" @click="checkDelete(record.id)" style="margin-left: 10px;">删除</a-button>
            </div>

          </template>
        </a-table>
      </div>
    </div>
    <a-modal v-model:visible="deleteModel" @ok="onDelete" @cancel="deleteModel = false" title="提示">
      <div style="text-align: center">是否删除评论：<strong>{{ deleteRequest.id }}</strong></div>
    </a-modal>
  </div>

</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {formatTime} from "@/utils/dateParse.js";
import {STATUS_CODE} from "@/common/status.js";
import {ERROR, SUCCESS} from "@/utils/message.js";
import {DELETE_POST_COMMENT, GET_ALL_COMMENT, UPDATE_POST_COMMENT} from "@/service/api/postCommentApi.js";
import {getCommentStatus} from "@/common/comment/commentStatus.js";
import {CommentStatus} from "@/common/comment/commentConstants.js";

const queryRequestReSet = {
  status: "",
  postId: "",
  sortField: "createTime",
  sortOrder: "",
  commentId: "",
  current: 1,
  pageSize: 10,
}
const queryAllRequest = ref({
  status: "",
  postId: "",
  sortField: "createTime",
  sortOrder: "",
  commentId: "",
  current: 1,
  pageSize: 10,
})
const updateRequest = ref({
})
const deleteRequest = ref({
  id: ""
})
const deleteModel = ref(false)

const pagination = reactive({
  current: 1,
  pageSize: queryAllRequest.value.pageSize,
  total: 0,
  showTotal: true,
  onChange: (current) => {
    pagination.current = current
    queryAllRequest.value.current = current
    getCommentList()
  },
});

const columns = [
  {
    title: '评论ID',
    dataIndex: 'id',
    width: 200
  },
  {
    title: '父评论ID',
    dataIndex: 'parentId',
    width: 150,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '帖子ID',
    dataIndex: 'postId',
    ellipsis: true,
    tooltip: true,
    width: 150
  },
  {
    title: '发送者Id',
    dataIndex: 'userId',
    ellipsis: true,
    tooltip: true,
    width: 100
  },
  {
    title: '评论内容',
    dataIndex: 'content',
    ellipsis: true,
    tooltip: true,
    width: 150,
  },
  {
    title: '评论状态',
    dataIndex: 'status',
    ellipsis: true,
    tooltip: true,
    width: 180,
    slotName: 'status'
  },

  {
    title: '点赞数',
    dataIndex: 'thumbNum',
    ellipsis: true,
    tooltip: true,
    width: 150,
  },
  {
    title: '回复数',
    dataIndex: 'replyNum',
    ellipsis: true,
    tooltip: true,
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 110,
    slotName: 'createTime'
  },
  {
    title: '操做',
    width: 100,
    fixed: 'right',
    slotName: 'option',
    align: 'center'
  },
];
const data = ref([
  {
    id: "1746085175697178626",
    postId: "1745363592196186113",
    userId: "1743170947961077761",
    parentId: "1746085102179418113",
    toUserId: "1743170947961077761",
    content: "测试评论",
    thumbNum: 0,
    replyNum: 0,
    status: 1,
    createTime: "2024-01-13T08:22:01.000+00:00",
  },
]);

const getCommentList = () => {
  GET_ALL_COMMENT(queryAllRequest.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      data.value = []
      data.value = res.data.records
      pagination.total = parseInt(res.data.total)
    }
  })
}
const search = () => {
  getCommentList()
}

const reSet = () => {
  queryAllRequest.value ={
    ...queryRequestReSet
  }
}

const onUpdate = () => {
  UPDATE_POST_COMMENT(updateRequest.value).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("修改成功")
    } else {
      ERROR("修改失败")
    }
  })
}

const changeStatus = (comment) => {
  updateRequest.value = {
    id: comment.id,
    status: comment.status
  }
  onUpdate()
}

const checkDelete = (id) => {
  deleteRequest.value.id = id
  deleteModel.value = true
}

const onDelete = () => {
  DELETE_POST_COMMENT(deleteRequest.value.id).then(res => {
    console.log(res)
    if (res.code === STATUS_CODE.SUCCESS_CODE) {
      SUCCESS("删除成功")
      getCommentList()
    } else {
      ERROR("删除失败")
    }
    deleteModel.value = false
  })
}

onMounted(() => {
  getCommentList()
})
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
  padding: 15px;

  .questionInfo {
    .top {
      .title {
        font-size: 16px;
        flex: 1;
        color: var(--color-text-1);
        font-weight: 500;
      }

      .query-way {
        margin-top: 20px;
        display: flex;

        .query-item {
          .label {
            display: flex;
            width: 80px;
            font-size: 14px;
            color: var(--color-text-2);
            margin-right: 10px;
          }

          display: flex;
          align-items: center;
          width: 300px;

          &:not(:first-child) {
            margin-left: 20px;
          }
        }
      }


    }

    .statistic {
      font-size: 15px;
    }
  }
}


</style>
