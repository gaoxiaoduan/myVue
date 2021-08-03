import Vue from "./myVue/vue.js";

const vm = new Vue({
  el: "#app",
  data: {
    msg: "hello xiaoduan",
    count: "1",
    testHtml: "<ul><li>123</li></ul>",
  },
  methods: {
    handleClick() {
      alert("111");
    },
  },
});

console.log("vm", vm);
