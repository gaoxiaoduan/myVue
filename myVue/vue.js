import Observer from "./observer.js";
import Compiler from "./compiler.js";

/**
 * vue 构造函数 接受各种配置参数等等
 */
export default class Vue {
  constructor(options = {}) {
    this.$options = options;
    this.$data = options.data;
    this.$methods = options.methods;

    this.initRootElement(options);
    this._proxyDaya(this.$data);

    // 实例化Observe对象，监听数据变化
    new Observer(this.$data);

    // 实例化Compiler对象，解析指令和 模板/差值 表达式 {{ msg }}
    new Compiler(this);
  }

  /**
   * 获取根元素，并存储到vue实例，简单检查一下传入的el是否合规
   */
  initRootElement(options) {
    if (typeof options.el === "string") {
      this.$el = document.querySelector(options.el);
    } else if (options.el instanceof HTMLElement) {
      this.$el = options.el;
    }
    if (!options.el) {
      throw new Error("传入的el不合法,请传入class select 或者 HTMLElemnt!");
    }
  }

  /**
   * 利用Object.difineProperty将data里的属性注入到vue实例中
   */
  _proxyDaya(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          if (data[key] === newValue) {
            return;
          }
          data[key] = newValue;
        },
      });
    });
  }
}
