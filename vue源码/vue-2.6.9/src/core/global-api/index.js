/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'
// !!!全局api
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  // vue静态方法
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods. 公开实效的方法。
  // NOTE: these are not considered part of the public API - avoid relying on 注意:这些不被认为是公共API的一部分-避免依赖
  // them unless you are aware of the risk. 除非你意识到风险。
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 2.6 explicit observable API
  // 让对象是响应式
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }
  {/* options不设置原型，提升性能 */}
  {/* 给options初始化一些空对象  directive、component、filter*/}
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue
{/* extend 把对象的所有属性拷贝到另一个对象上来 */}
{/* 设置 keep-alive组件 */}
  extend(Vue.options.components, builtInComponents)
{/*  注册 vue.use 用来注册插件*/}
  initUse(Vue)
  {/* 注冊混入 */}
  initMixin(Vue)
  {/* 注冊vue.extend 基于传入的option返回一个组件的构造函数 */}
  initExtend(Vue)
  {/* 注册vue.directive()、component()、filter() */}
  initAssetRegisters(Vue)
}
