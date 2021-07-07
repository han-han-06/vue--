// 定义构造函数
class KVue {
  constructor(options) {
    console.log('options',options)
    // 把传过来的options变成自己内部的值
    this.$options = options;
    this.$data = options.data;
    this.observe(this.$data);
    new Compile(options.el,this);
    if(options.created) {
      options.created.call(this)
    }
    // new Watcher(this,'name');
    // console.log('this.name',this.name);// 读一次触发一次依赖收集
    // new Watcher(this,'testObj1.aa');
    // console.log('this.testObj1.aa',this.testObj1.aa)
  } 
  observe(obj){
    if(!obj || typeof obj !=='object'){
      return
    }
    // 遍历对象，对对象中的属性进行数据拦截
    for(let item in obj) {
      this.defineReactive(item,obj[item],obj)
      // 在对象进行遍历的时候把data代理到vue根上
      this.proxyData(item)
    }
    // this.defineReactive()
  }
  // 劫持
  defineReactive(name,value,obj) {
    // 递归遍历整个对象，因为可能有深层次的嵌套
    this.observe(value);
    const dep = new Dep(); // 定义了一个dep。每个dep实例和data中每个key有一对一关系
    Object.defineProperty(obj,name,{
      get() {
        console.log('222name',name)
        // !!! 依赖收集
        dep.target && dep.addDep(dep.target)
        console.log('读数据了')
        return value
      },
      //???? 是个闭包？？？
      set(newVal) {
        console.log('set')
        if(newVal !== value) {
          // 进行赋值
          value = newVal;
          // 通知去更新
          dep.notify();
        }
      }
    })
  }
  // 代理
  proxyData(key) {
    // 对this(KVue)实例进行劫持
    Object.defineProperty(this,key,{
      get() {
        return this.$data[key]
      },
      set(newVal) {
        this.$data[key] = newVal
      }
    })
  }
  // 
}


// 创建dep，用来管理所有的watcher,用来做通知
class Dep {
  constructor() {
    this.deps = []
  }
  // 这里边放所有的监听者
  addDep(dep) {
    this.deps.push(dep)
  }
  // 通知更新
  notify() {
    this.deps.forEach(dep => dep.update())
  }
}


// 保存data中的数值和页面中的挂钩关系
// 1. 可能会做保存某个具体组件的实例（vue实例），相关联的key（data中的哪个值）
class Watcher {
  constructor(vm,key,cb) {
    this.vm = vm;
    this.cb = cb;
    this.key = key;
    Dep.target = this; // vue实例
    this.vm[this.key] // 读取值，触发get也就是触发依赖收集
    Dep.target = null;// 清空，防止别的依赖收集会串台
  }
  update() {
    console.log(342)
    console.log(this.key + '更新了')
    this.cb.call(this.vm,this.vm[this.key])// 更新
  }
}