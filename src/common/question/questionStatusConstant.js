import {getQuestionStatusValue} from "@/common/question/questionStatus.js";
import {QuestionStatusEnum} from "@/common/question/questionStatusEnum.js";

export const QuestionStatus=[
    getQuestionStatusValue(QuestionStatusEnum.NO_START),
    getQuestionStatusValue(QuestionStatusEnum.ACCEPTED),
    getQuestionStatusValue(QuestionStatusEnum.TRIED),
]
