import router from "@/router/index.js";
import store from "@/store/index.js";
import {checkAccess} from "./checkAccess.js";
import {ACCESS_ENUM} from "./accessEnum.js";

//全局路由前置钩子
router.beforeEach(async (to, from, next) => {
    //to到哪儿 from从哪儿离开 next('跳转路径')跳转 为空就是放行
    let loginUser = store.getters.userInfo
    const needAccess = to.meta?to.meta.access:ACCESS_ENUM.NOT_LOGIN

    if(!loginUser || loginUser.userRole===ACCESS_ENUM.NOT_LOGIN){
        await store.dispatch("getUserInfo");
        loginUser = store.getters.userInfo
    }
    if (needAccess !== ACCESS_ENUM.NOT_LOGIN){
        if(loginUser.userRole === ACCESS_ENUM.NOT_LOGIN){
            // 如果未登录且目标路由需要认证，则保存当前要访问的路由
            localStorage.setItem('previousRoute', JSON.stringify(from.fullPath));
            next({
                path: "/user/login",
                replace:true
            })
            return
        }
        if (!checkAccess(loginUser,needAccess)){
            next("/resultPage/403")
            return
        }
    }
    next()
});