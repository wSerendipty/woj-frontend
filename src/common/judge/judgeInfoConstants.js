
import {JUDGE_INFO_STATUS_ENUM} from "@/common/judge/judgeInfoStatusEnum.js";

export const JudgeInfoStatus = [
    JUDGE_INFO_STATUS_ENUM.ACCEPTED,
    JUDGE_INFO_STATUS_ENUM.WRONG_ANSWER,
    JUDGE_INFO_STATUS_ENUM.COMPILE_ERROR,
    JUDGE_INFO_STATUS_ENUM.MEMORY_LIMIT_EXCEEDED,
    JUDGE_INFO_STATUS_ENUM.TIME_LIMIT_EXCEEDED,
    JUDGE_INFO_STATUS_ENUM.PRESENTATION_ERROR,
    JUDGE_INFO_STATUS_ENUM.WAITING,
    JUDGE_INFO_STATUS_ENUM.OUTPUT_LIMIT_EXCEEDED,
    JUDGE_INFO_STATUS_ENUM.DANGEROUS_OPERATION,
    JUDGE_INFO_STATUS_ENUM.RUNTIME_ERROR,
    JUDGE_INFO_STATUS_ENUM.SYSTEM_ERROR
]