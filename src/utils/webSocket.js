import {ERROR} from "./message";
import {STATUS_CODE} from "../common/status.js";

let websocket = null;
let messageCallback = null;
let errorCallback = null;
let wsUrl = import.meta.env.VITE_WS_URL;
const ping = 20000 // 心跳时长 20秒
let status = 0 // 连接状态: 0-关闭 1-连接 2-手动关闭
let pingInterval = null // 心跳定时器
const reconnect = 5000 // 重连间隔
const times = 5 // 重连次数

// 心跳消息
const heartCheckMsg = {
    type: 2, // 2 心跳检测
};


/**
 * @description: 心跳机制
 * @return {*}
 * @author: 王长远
 */
const heartHandler = () => {
    pingInterval = setInterval(() => {
        if (status === STATUS_CODE.SUCCESS_CODE) {
            console.log("🚲~~:", heartCheckMsg)
            sendMsg(heartCheckMsg)
        } else {
            clearInterval(pingInterval)
        }
    }, ping)
}


/**
 * 关闭websocket函数
 */
function websocketClose(e) {
    console.error(e)
    status = status === 2 ? status : 0
    console.log(status)
    if (status === 2) {
        websocket = null
        return
    }
    setTimeout(() => {
        if (status === 0) {
            websocket = null
            initWebSocket()
        }
    }, reconnect)
}

/**
 * @description: 主动关闭websocket 主动关闭不会触发重连
 */
export function closeWebSocket() {
    status = 2
    if (websocket) {
        websocket.close()
        ERROR("webSocket关闭")
    }
}

// 初始化websocket
function initWebSocket() {
    if (typeof WebSocket === "undefined") {
        ERROR("您的浏览器不支持WebSocket，无法获取数据");
        return false;
    }

    if (websocket != null && status === 1) {
        return true;
    }
    websocket = new WebSocket(wsUrl);

    websocket.onmessage = function (e) {
        websocketOnmessage(e);
    };
    websocket.onopen = function () {
        status = STATUS_CODE.SUCCESS_CODE
        console.log("websocket连接")
        heartHandler()
    };
    websocket.onerror = function () {
        console.log("ws连接异常，请稍候重试");
        errorCallback();
    };
    websocket.onclose = function (e) {
        websocketClose(e);
    };
}

/**
 * 发送webSocket消息
 * @param {Object} agentData 需要向后台传递的参数数据
 */
export function sendMsg(agentData) {
    // 添加状态判断，当为OPEN时，发送消息
    if (websocket.readyState === websocket.OPEN) {
        // websocket.OPEN = 1
        // 发给后端的数据需要字符串化
        websocket.send(JSON.stringify(agentData));
    }
    if (websocket.readyState === websocket.CLOSED) {
        // websocket.CLOSED = 3
        errorCallback();
    }
}

// 接收ws后端返回的数据
function websocketOnmessage(e) {
    messageCallback(JSON.parse(e.data));
}

/**
 * 设置callback 函数
 * @param {function} successCallback 接收到ws数据，对数据进行处理的回调函数
 * @param {function} errCallback ws连接错误的回调函数
 */
export function connectWebSocket(successCallback, errCallback) {
    initWebSocket();
    messageCallback = successCallback;
    errorCallback = errCallback;
}




