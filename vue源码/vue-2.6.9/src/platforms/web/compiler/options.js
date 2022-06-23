/* @flow */

import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} from '../util/index'

import modules from './modules/index' 
import directives from './directives/index'
import { genStaticKeys } from 'shared/util'
import { isUnaryTag, canBeLeftOpenTag } from './util'

export const baseOptions: CompilerOptions = {
  expectHTML: true,// html内容
  modules,// 模块（和v-if一起使用的v-model，类样式模块和行内样式模块）
  directives,// 处理模板中的指令（v-text,v-model,v-html）
  isPreTag,// 是否是pre标签
  isUnaryTag,// 是否是自闭和标签
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,// 是否是html中的保留标签
  getTagNamespace,
  staticKeys: genStaticKeys(modules)
}
