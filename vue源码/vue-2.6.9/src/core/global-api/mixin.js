/* @flow */

import { mergeOptions } from '../util/index'
// 
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // 把mixin传过来的选项拷贝到this.options里面  this指向vue（全局vue）
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
