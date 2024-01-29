import {QuestionStatusEnum} from "@/common/question/questionStatusEnum.js";
import {JUDGE_STATUS_ENUM} from "@/common/judge/judgeEnum.js";

export function getQuestionStatusValue(status) {
    switch (status) {
        case QuestionStatusEnum.NO_START:
            return '未开始';
        case QuestionStatusEnum.ACCEPTED:
            return '已通过';
        case QuestionStatusEnum.TRIED:
            return '尝试过';
        default:
            return '未知';
    }
}

export function getQuestionStatus(status) {
    switch (status) {
        case "未开始":
            return QuestionStatusEnum.NO_START;
        case "已通过":
            return QuestionStatusEnum.ACCEPTED;
        case "尝试过":
            return QuestionStatusEnum.TRIED;
        default:
            return JUDGE_STATUS_ENUM.WAITING;
    }
}
