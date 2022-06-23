/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  // 遍历ASSET_TYPES数组，为vue定义相应方法
  // ASSET_TYPES ： directive、component、filter
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {// 没有定义则返回以前的
        return this.options[type + 's'][id]
      } else {// 定义了
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') { 
          validateComponentName(id)
        }
        // isPlainObject 判断是原始对象不
        // vue.component("comp",{template:""})
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          // 把组件配置转换为组件的构造函数   this.options._base：构造函数
          definition = this.options._base.extend(definition)
        }
        // 传递的是构造函数
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // 全局注册，存储资源并赋值
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
