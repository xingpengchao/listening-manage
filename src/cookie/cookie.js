/**
 * @description 保存cookie
 * @param {Object} json 需要存储cookie的对象
 * @param {Number} days 默认存储多少天
 */
import Cookies from 'js-cookie'
const TokenKey = 'Token'



export function getToken() {

    return Cookies.get(TokenKey)

}



export function setToken(token) {

    return Cookies.set(TokenKey, token,{SameSite:"None"})

}



export function removeToken() {

    return Cookies.remove(TokenKey)

}
