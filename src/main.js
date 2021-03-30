import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
axios.defaults.withCredentials = true;

Vue.filter("currency", function (n) {
  var intPart = Number(n).toFixed(0);
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
  return "$" + intPartFormat;
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
