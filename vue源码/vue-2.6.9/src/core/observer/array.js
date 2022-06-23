/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'
// arrayProto 数组原型
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto) // 这块存的是数组可以改变元素的七个操作，通过数组原型创建的对象

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
console.log('即使不导入也会走对么')
/**
 * Intercept mutating methods and emit events
 */
// 方法进行遍历
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method] // 原始方法，push啥的
  // 额外的事情，通知更新
  // 做push的时候，额外的执行这个事情
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 如果是新增，把新增的数组项变成响应式的
    if (inserted) ob.observeArray(inserted)
    //!!! notify change 通知更新
    ob.dep.notify()
    return result
  })
})
