import {GET, POST} from "../../utils/axios.js";
import userUrl from "../urls/userUrl.js";

/**
 * 登录
 * @param data
 * @returns {Promise}
 * @constructor
 */
export function LOGIN(data){
    return POST(userUrl.loginUrl,data)
}

/**
 * 注册
 * @param data
 * @returns {Promise}
 * @constructor
 */
export function REGISTER(data){
    return POST(userUrl.registerUrl,data)
}

/**
 * 获取登录用户信息
 * @returns {Promise}
 * @constructor
 */
export function GET_LOGIN_USER(){
    return GET(userUrl.getUserInfoUrl)
}

/**
 * 退出登录
 * @returns {Promise}
 * @constructor
 */
export function LOGOUT(){
    return POST(userUrl.logoutUrl, null)
}