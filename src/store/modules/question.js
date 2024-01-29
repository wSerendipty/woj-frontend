import {STATUS_CODE} from "@/common/status.js";
import {GET_QUESTION_BY_ID} from "@/service/api/questionApi.js";


export default {
    state: {
        questionInfo:   {
            id: "",
            title: "",
            content: "",
            tags: [],
            submitNum: 0,
            acceptedNum: 0,
            testJudgeCase: [
                {
                    input: "",
                    output: ""
                }
            ],
            questionTemplates: [],
            thumbNum: 0,
            favourNum: 0,
            userId: "",
            createTime: ""
        },
    },
    getters: {
        questionInfo: (state) => {
            return state.questionInfo
        },
    },
    mutations: {
        set_question(state, payload) {
            state.questionInfo = payload
        },
    },
    actions: {
        async getQuestionInfo({commit},id) {
           const r = await GET_QUESTION_BY_ID(id).then((res) => {
                if (res.code === STATUS_CODE.SUCCESS_CODE) {
                    commit('set_question', res.data)
                }
                return res
            })
            return r
        },
    }
}