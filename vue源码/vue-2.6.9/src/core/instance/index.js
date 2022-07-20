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
// !! 没备注
// 下面这些方法 都是初始化vue实例的方法和属性（挂载到vue原型上）
initMixin(Vue) //!!!! 实现上面的_init的初始化方法
stateMixin(Vue) //
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
// renderMixin 函数走完就去注册全局的api 也就是global-api
export default Vue

/* 
vue用构造函数而不用class类的原因：是因为后续需要给vue的实例上挂载一些方法和属性(混入实例成员)，
如果用class类可能形式上不是那么一致。
*/