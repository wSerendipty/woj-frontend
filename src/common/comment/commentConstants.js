// Desc: 评论状态常量
import {getCommentStatusValue} from "@/common/comment/commentStatus.js";
import {COMMENT_STATUS_ENUM} from "@/common/comment/commentEnum.js";


export const CommentStatus = [
    getCommentStatusValue(COMMENT_STATUS_ENUM.AUDITING),
    getCommentStatusValue(COMMENT_STATUS_ENUM.SUCCESS),
    getCommentStatusValue(COMMENT_STATUS_ENUM.FAILED),
]