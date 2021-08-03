import Dep from "./dep.js";

export default class Observer {
  constructor(data) {
    this.traverse(data);
  }

  /**递归遍历data中的所有属性 */
  traverse(data) {
    if (!data || typeof data !== "object") return;

    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }

  /**给传入的数据设置 getter/setter */
  defineReactive(obj, key, val) {
    // TODO 递归遍历
    this.traverse(val);
    const that = this;
    const dep = new Dep();

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        console.log(Dep.target);
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(newValue) {
        if (newValue === val) return;
        val = newValue;

        that.traverse(newValue);
        // 通知water更新视图
        dep.notify();
      },
    });
  }
}
