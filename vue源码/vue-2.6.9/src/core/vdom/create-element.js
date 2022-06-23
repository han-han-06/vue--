/* @flow */

import config from '../config'
import VNode, { createEmptyVNode } from './vnode'
import { createComponent } from './create-component'
import { traverse } from '../observer/traverse'

import {
  warn,
  isDef,
  isUndef,
  isTrue,
  isObject,
  isPrimitive,
  resolveAsset
} from '../util/index'

import {
  normalizeChildren,
  simpleNormalizeChildren
} from './helpers/index'

const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
// createElement 既可以传两个参数又可以传三个参数
// 2个：data省略
// 3个：data不省略
export function createElement (
  context: Component, // vue的实例
  tag: any,// 标签
  data: any,// 标签的属性
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  // isPrimitive 原始值 
  if (Array.isArray(data) || isPrimitive(data)) { // 没有传入data
    normalizationType = children
    children = data
    data = undefined
  }
  //  用户传入的render normalizationType = 2
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE 
  }
  return _createElement(context, tag, data, children, normalizationType)
}
// 真正创建vnode的方法
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (isDef(data) && isDef((data: any).__ob__)) { // 判断data是否是响应式数据。data不能是响应式数据
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode() // 返回空节点
  }
  // object syntax in v-bind
  // data中是否is属性。有is是动态组件的意思
  if (isDef(data) && isDef(data.is)) { 
    tag = data.is
  }
  if (!tag) {// tag是false相当于把is指令设置为false，则会返回空节点
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  // key 应该为原始值
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }
  // support single function children as default scoped slot
  // 处理作用域插槽
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  // 用户手写的render
  if (normalizationType === ALWAYS_NORMALIZE) {
    // 返回一维数组
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {  // 编译生成的render函数
    // 把二维数组转成一维数组
    
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') { // 
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    // 是否是html的保留标签
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      // context 是vue实例
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {// tag是自定义组件组件
      // Ctor 获取当前的组件
      // component 
      //  创建组件对应的vnode对象
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {// tag不是字符传，则是组件，直接创建vnode对象
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {// 是组件
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) { // vnode已经定义
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {// 返回空的注释节点
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined
    force = true
  }
  if (isDef(vnode.children)) {
    for (let i = 0, l = vnode.children.length; i < l; i++) {
      const child = vnode.children[i]
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force)
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style)
  }
  if (isObject(data.class)) {
    traverse(data.class)
  }
}
