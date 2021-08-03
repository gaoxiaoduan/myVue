import Watcher from "./watcher.js";

export default class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.methods = vm.$methods;

    this.compile(vm.$el);
  }

  /**编译模板 */
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      if (this.isTextNode(node)) {
        // 文本节点
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        // 元素节点
        this.compileElement(node);
      }

      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }

  // 编译文本节点
  compileText(node) {
    // {{ msg }}  msg: hello xiaoduan
    const reg = /\{\{(.+?)\}\}/;
    const value = node.textContent; //hello xiaoduan

    if (reg.test(value)) {
      const key = RegExp.$1.trim(); //msg
      node.textContent = value.replace(reg, this.vm[key]);

      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue;
      });
    }
  }

  // 编译元素节点
  compileElement(node) {
    if (node.attributes.length) {
      Array.from(node.attributes).forEach((attr) => {
        // 遍历元素节点所有属性
        const attrName = attr.name; //v-model v-html v-on:click
        if (this.isDirective(attrName)) {
          // 指令名称
          let directiveName =
            attrName.indexOf(":") > -1
              ? attrName.substr(5)
              : attrName.substr(2);
          let key = attr.value; //msg
          // TODO 更新元素节点
          this.update(node, key, directiveName);
        }
      });
    }
  }

  update(node, key, directiveName) {
    // v-model, v-text, v-html, v-on:click
    const updateFn = this[directiveName + "Updater"];
    updateFn && updateFn.call(this, node, this.vm[key], key, directiveName);
  }

  textUpdater(node, value, key) {
    node.textContent = value;
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue;
    });
  }

  /**解析 v-model */
  modelUpdater(node, value, key) {
    node.value = value;
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue;
    });

    node.addEventListener("input", () => {
      this.vm[key] = node.value;
    });
  }

  htmlUpdater(node, value, key) {
    node.innerHTML = value;
    new Watcher(this.vm, key, (newValue) => {
      node.innerHTML = newValue;
    });
  }

  clickUpdater(node, value, key, directiveName) {
    node.addEventListener(directiveName, this.methods[key]);
  }

  /**判断是否为文本节点 */
  isTextNode(node) {
    return node.nodeType === 3;
  }

  /**判断是否为元素节点 */
  isElementNode(node) {
    return node.nodeType === 1;
  }

  /**判断袁术属性是否 为指令 */
  isDirective(attrName) {
    // v-
    return attrName.startsWith("v-");
  }
}
