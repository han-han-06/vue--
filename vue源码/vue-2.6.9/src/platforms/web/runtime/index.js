/* @flow */
// !!! 平台相关的方法
import Vue from 'core/index' // src 里面的core index去找
import config from 'core/config'
import { extend, noop } from 'shared/util'
import { mountComponent } from 'core/instance/lifecycle'
import { devtools, inBrowser } from 'core/util/index'

import {
  query,
  mustUseProp,
  isReservedTag,
  isReservedAttr,
  getTagNamespace,
  isUnknownElement
} from 'web/util/index'

import { patch } from './patch'
import platformDirectives from './directives/index'
import platformComponents from './components/index'

// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// install platform runtime directives & components
// extend 合并成员
extend(Vue.options.directives, platformDirectives) // 注册全局指令 v-model 和v-show
extend(Vue.options.components, platformComponents) // 注册全局组件 v-Transition。。。

// install platform patch function
// !!!!虚拟dom变成真实dom都在patch里面 通过判断是否存在window来判断是否是浏览器环境
Vue.prototype.__patch__ = inBrowser ? patch : noop

// public mount method
// !!! 实现$mount
// 重写了$mount方法，先重写了$mounte才走了new Vue
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  // !!! mountComponent都干了啥（整个程序的挂载点）
  // 根组件会执行mountComponent ，所有的子组件也会执行mountComponent
  // 在 mountComponent函数中创建了渲染watcher,pushTarget添加了第一个watcher
  return mountComponent(this, el, hydrating)
}

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(() => {
    if (config. devtools) {
      if (devtools) {
        devtools.emit('init', Vue)
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test'
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        )
      }
    }
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        `You are running Vue in development mode.\n` +
        `Make sure to turn on production mode when deploying for production.\n` +
        `See more tips at https://vuejs.org/guide/deployment.html`
      )
    }
  }, 0)
}

export default Vue
