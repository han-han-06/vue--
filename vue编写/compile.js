// 用于遍历dom结构，解析指令和插值表达式（as {{}}）

class Compile {
  //el-带编译模板(id = 'app')，vm-KVue实例
  constructor(el,vm) {
    console.log(345333)
    this.$vm = vm;
    this.$el = document.querySelector(el);
    console.log(' this.$el', this.$el)
    // 把模板中的内容一到片段去进行操作
    this.$fragment = this.node2Fragment(this.$el);
    // 执行编译
    this.compile(this.$fragment);
    this.$el.appendChild(this.$fragment);
  }
  // 把元素放在创建的fragement中去,把dom树放到文档片段中去
  // 参考：https://www.cnblogs.com/xiaohuochai/p/5816048.html
  node2Fragment(el) {
    console.log(11,el,el.firstChild)
    const newFragement = document.createDocumentFragment();// 创建空白片段
    let child;
    // !!! 看不懂
    while(child = el.firstChild) {
      // console.log('child',child)
      // console.log('el.firstChild',el.firstChild)
      // console.log(1111,newFragement)
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
        console.log('编译元素'+node.nodeName)
      }else if(this.isInter(node)) {
        this.compileText(node) // 编译文本
        // 文本节点，只关心{{xxx}}
        console.log('编译插值文本'+node.textContent)
      }
      if(node.children && node.childNodes.length > 0) {
        console.log('222')
        this.compile(node)
      }
    })
  }
  // 编译文本
  compileText(node) {
    // 拿出正则
    const exp = RegExp.$1;// 拿出值
    // 参数三代表当前要做的具体操作。
    this.update(node,exp,'text')
    node.textContent = this.$vm[exp]
  }
  compileElement(node) {

  }
  // 更新函数，对指定的节点进行相应的操作，比如插值，则进行插值的更新
  update(node,exp,dir) {
    // 查分命令
    const undator = this[dir+'Updator'];
    // const value = this.$vm[exp];
    undator && undator(node,this.$vm[exp]);
    // 创建实例，依赖收集完成了
    new Watcher(this.$vm,exp,function(value) {
      undator && undator(node,value);
    })
  }
  textUpdator(node,value) {
    node.textContent = value
  }
  isInter(node) {
    return node.nodeType ===3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
}