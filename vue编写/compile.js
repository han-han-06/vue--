// 用于遍历dom结构，解析指令和插值表达式（as {{}}）

class Compile {
  //el-带编译模板(id = 'app')，vm-KVue实例
  constructor(el,vm) {
    this.$vm = vm; // 拿到this
    this.$el = document.querySelector(el); // 获取元素
    // 把模板中的内容一到片段去进行操作
    this.$fragment = this.node2Fragment(this.$el);
    // 执行编译
    this.compile(this.$fragment);
    this.$el.appendChild(this.$fragment);
  }
  // 把元素放在创建的fragement中去,把dom树放到文档片段中去
  // 参考：https://www.cnblogs.com/xiaohuochai/p/5816048.html
  node2Fragment(el) {
    const newFragement = document.createDocumentFragment();// 创建空白片段
    let child;
    // !!! 看不懂
    while(child = el.firstChild) {
      newFragement.appendChild(child)
    }
    return newFragement
  }
  // 根据片段去进行遍历
  compile(el) {
    // 拿出所有元素
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      if(node.nodeType ==1) {
        // 元素 div span
        this.compileElement(node); // 编译元素
      }else if(this.isInter(node)) {
        this.compileText(node) // 编译文本
        // 文本节点，只关心{{xxx}}
      }
      if(node.children && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }
  // 编译文本，把{{}}变成真正的值
  compileText(node) {
    // 拿出正则
    const exp = RegExp.$1;// 拿出值
    // 参数三代表当前要做的具体操作。
    this.update(node,exp,'text')
    node.textContent = this.$vm[exp] // 读取值
  }
  // 编译元素
  compileElement(node) {
    // this.update(node,exp,'model')
  }
  // 编译v-model
  compileModel(node) {
    this.update(node,exp,'model')
    node.addEventListener("input",e => {
      this.$vm[exp] = e.target.value
    })
  }

  // 更新函数，对指定的节点进行相应的操作，比如插值，则进行插值的更新
  update(node,exp,dir) {
    // 查分命令 dir == text
    const undator = this[dir+'Updator']; // function
    // const value = this.$vm[exp];
    undator && undator(node,this.$vm[exp]); // 首次初始化,把元素和值都给函数穿过去，让他进行更新
    // 创建实例，依赖收集完成了
    new Watcher(this.$vm,exp,function(value) {
      undator && undator(node,value);
    })
  }
  modelUpdater(node,value) {
    node.value = value;
  }
  textUpdator(node,value) {
    node.textContent = value
  }
  isInter(node) {
    return node.nodeType ===3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
}