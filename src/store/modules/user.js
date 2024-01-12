import {ACCESS_ENUM} from "../../access/accessEnum.js";
import {GET_LOGIN_USER} from "../../service/api/userApi.js";
import {STATUS_CODE} from "../../common/status.js";


export default {
    state: {
        userInfo: {
            id: "1740669921274191873",
            userName: '',
            userAvatar: '',
            userProfile: '',
            createTime: "2023-12-29T09:43:43.000+00:00",
            updateTime: "2023-12-29T09:43:43.000+00:00",
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
                    commit('set_user', res.data)
                } else if (res.code === STATUS_CODE.NOT_LOGIN_CODE) {
                    commit("set_user", {userRole: ACCESS_ENUM.NOT_LOGIN})
                }
            })
        },
    }
}