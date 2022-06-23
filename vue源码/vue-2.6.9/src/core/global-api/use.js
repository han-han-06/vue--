/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // this 是vue的构造函数 installedPlugins用于记录所有安装的插件
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) { // 已经注册则返回
      return this
    }

    // additional parameters
    // 把数组中的第一个元素去除（第一个参数是plugin，没用） toArray：转数组
    const args = toArray(arguments, 1) 
    // 把this（vue的构造函数）插入第一个元素的位置
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
