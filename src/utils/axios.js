// axios.js
import axios from "axios";
import {ERROR} from "./message";
import store from "../store/index.js";
import {ACCESS_ENUM} from "../access/accessEnum.js";

const baseURL = import.meta.env.VITE_BASE_URL;

// 配置开发环境 和 生成环境 基础地址
axios.defaults.baseURL = baseURL;
// 携带 cookie
axios.defaults.withCredentials = true;

// 默认 post ,put 请求，使用 application/json 形式
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";

const releaseUrl = ["/user/login", "/user/register", "/user/get/login","/post/list/page/vo","/tag/list"]; // 放行路径

// 请求拦截器
axios.interceptors.request.use(
    (config) => {
        if (releaseUrl.indexOf(config.url) === -1) {
            if (store.getters.userInfo.userRole === ACCESS_ENUM.NOT_LOGIN) {
                ERROR("请先登录");
                return Promise.reject(new Error("请先登录"));
            }
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// 响应拦截器
axios.interceptors.response.use(
    (res) => {
        let code = res.data.code;
        // 根据状态码来进行相应的操做，如200：成功 ，404: 页面不存在等...
        if (res.status !== 200) {
            return Promise.reject(res);
        }
        if (code === "ERR_NETWORK") {
            ERROR(res.data.message);
            return Promise.reject(res);
        }


        return res;
    },
    (err) => {
        return Promise.reject(err);
    }
);

/**
 * 封装get方法
 * @param {string} url
 * @param params
 * @returns {Promise}
 */
export function GET(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params,
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

/**
 * 封装post请求
 * @param {string} url
 * @param {{}} data
 * @returns {Promise}
 */
export function POST(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then(
            (response) => {
                resolve(response.data);
            },
            (err) => {
                reject(err);
            }
        );
    });
}


/**
 * 封装post_file请求
 * @param {string} url
 * @param {{}} data
 * @returns {Promise}
 */
export function POST_FILE(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(
            (response) => {
                resolve(response.data);
            },
            (err) => {
                reject(err);
            }
        );
    });
}

/**
 * delete方法
 * @param url
 * @param data
 * @returns {Promise<unknown>}
 * @constructor
 */
export function DELETE(url, data) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {
            params: data
        }).then(
            (response) => {
                resolve(response.data);
            },
            (err) => {
                reject(err);
            }
        );
    });
}

