import {ACCESS_ENUM} from "@/access/accessEnum.js";
import {EDIT_USER, GET_LOGIN_USER, GET_USER_BY_ID, LOGOUT} from "@/service/api/userApi.js";
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
            userAccount: "",
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
        async getUserById({commit}, data) {
            await GET_USER_BY_ID(data).then((res) => {
                if (res.code === STATUS_CODE.SUCCESS_CODE) {
                    commit('set_user', res.data)
                }
            })
        },
        async updateUserInfo({commit}, data) {
            const res = await EDIT_USER(data)
            if (res.code === STATUS_CODE.SUCCESS_CODE) {
                commit('set_user', res.data)
            }
            return res
        },

        async logOut({commit}) {
            const r = await LOGOUT()
            if (r.code === STATUS_CODE.SUCCESS_CODE) {
                commit('set_user', {userRole: ACCESS_ENUM.NOT_LOGIN})
            }
            return r
        }
    }
}