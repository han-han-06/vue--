import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
// !!! vue的构造函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
initMixin(Vue) //!!!! 实现上面的_init的初始化方法
stateMixin(Vue)
eventsMixin(Vue)
console.log('int的生命周期')
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
