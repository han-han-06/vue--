/* @flow */

import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index' //!!!所有属性的操作 attrs style transition

// the directive module should be applied last, after all
// built-in modules have been applied.
// !!!! 扩展操作：把通用模块和浏览器中特有模块合并
const modules = platformModules.concat(baseModules)
// !!!! 工厂函数：创建浏览器特有的patch函数，这里主要解决跨平台问题 
// nodeOps里面存放的是所有的dom操作api
export const patch: Function = createPatchFunction({ nodeOps, modules })
