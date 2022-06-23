/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
// !! baseCompile 模板编译的核心函数
export const createCompiler = createCompilerCreator(function baseCompile (   
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 把模板编译成AST抽样语法树 template.trim()去除了前后空格
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    // 优化抽象语法树
    optimize(ast, options)
  }
  // 把优化后的抽象语法树转成字符串形式的js代码
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,// 整个模板生成的字符串形式的代码（是动态的）
    staticRenderFns: code.staticRenderFns// 是静态根节点对应的字符串形式的代码
  }
})
