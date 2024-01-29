import {JUDGE_STATUS_ENUM} from "@/common/judge/judgeEnum.js";
import {getJudgeStatusValue} from "@/common/judge/judgeStatus.js";

export const JudgeStatus = [
    getJudgeStatusValue(JUDGE_STATUS_ENUM.WAITING),
    getJudgeStatusValue(JUDGE_STATUS_ENUM.JUDGING),
    getJudgeStatusValue(JUDGE_STATUS_ENUM.SUCCESS),
    getJudgeStatusValue(JUDGE_STATUS_ENUM.FAILED),
]