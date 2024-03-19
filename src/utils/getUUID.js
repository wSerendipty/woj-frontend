/**
 * @description: 生成UUID
 * @param {*}
 * @return {*}
 * @author: 王长远
 */
export function getUUID() {
    let result = ''
    const str = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    result = str.replace(/[xy]/gu, c => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
    return result
}