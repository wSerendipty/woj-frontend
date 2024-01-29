import {JUDGE_STATUS_ENUM} from "@/common/judge/judgeEnum.js";

export function getJudgeStatusValue(status) {
    switch (status) {
        case JUDGE_STATUS_ENUM.WAITING:
            return '等待中';
        case JUDGE_STATUS_ENUM.JUDGING:
            return '判题中';
        case JUDGE_STATUS_ENUM.SUCCESS:
            return '成功';
        case JUDGE_STATUS_ENUM.FAILED:
            return '失败';
        default:
            return '未知';
    }
}

export function getJudgeStatus(status) {
    switch (status) {
        case "等待中":
            return JUDGE_STATUS_ENUM.WAITING;
        case "判题中":
            return JUDGE_STATUS_ENUM.JUDGING;
        case "成功":
            return JUDGE_STATUS_ENUM.SUCCESS;
        case "失败":
            return JUDGE_STATUS_ENUM.FAILED;
        default:
            return JUDGE_STATUS_ENUM.WAITING;
    }
}



