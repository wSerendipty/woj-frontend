import {ACCESS_ENUM} from "@/access/accessEnum.js";
import {GET_LOGIN_USER} from "@/service/api/userApi.js";
import {STATUS_CODE} from "@/common/status.js";


export default {
    state: {
        userInfo: {
            id: "",
            userName: '',
            userAvatar: '',
            userProfile: '',
            createTime: "",
            updateTime: "",
            userRole: ACCESS_ENUM.NOT_LOGIN,
        },
    },
    getters: {
        userInfo: (state) => {
            return state.userInfo
        },
    },
    mutations: {
        set_user(state, payload) {
            state.userInfo = payload
        },
    },
    actions: {
        async getUserInfo({commit}) {
            await GET_LOGIN_USER().then((res) => {
                if (res.code === STATUS_CODE.SUCCESS_CODE) {
                    console.log(res)
                    commit('set_user', res.data)
                } else if (res.code === STATUS_CODE.NOT_LOGIN_CODE) {
                    commit("set_user", {userRole: ACCESS_ENUM.NOT_LOGIN})
                }
            })
        },
    }
}