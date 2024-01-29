
import {COMMENT_STATUS_ENUM} from "@/common/comment/commentEnum.js";

export function getCommentStatusValue(status) {
    switch (status) {
        case COMMENT_STATUS_ENUM.AUDITING:
            return '审核中';
        case COMMENT_STATUS_ENUM.SUCCESS:
            return '通过';
        case COMMENT_STATUS_ENUM.FAILED:
            return '未通过';
        default:
            return '未知';
    }
}

export function getCommentStatus(status) {
    switch (status) {
        case "审核中":
            return COMMENT_STATUS_ENUM.AUDITING;
        case "通过":
            return COMMENT_STATUS_ENUM.SUCCESS;
        case "未通过":
            return COMMENT_STATUS_ENUM.FAILED;
        default:
            return COMMENT_STATUS_ENUM.AUDITING;
    }
}
