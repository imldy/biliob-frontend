import "babel-polyfill";
// import "@fortawesome/fontawesome-free/css/all.css";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import Vue from "vue";
import "./echarts";
const App = () => import("./App.vue");
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import axios from "axios";
import VueAxios from "vue-axios";
import VueRouter from "vue-router";
import Vuex from "vuex";

import "./components";

Vue.config.productionTip = false;

// 使用vue-cookies
import VueCookies from "vue-cookies";

import vuetify from "./plugins/vuetify";
Vue.use(VueCookies);

router.afterEach(function(to) {
  let baseTitle = " - BiliOB观测者 - B站历史数据统计分析站点";
  if (to.name == undefined) {
    to.name = "404";
  }
  window.document.title = to.name + baseTitle;
  function saveToLocal(key) {
    let count = window.localStorage.getItem(key);
    if (count == undefined) {
      count = 0;
    }
    window.localStorage.setItem(key, Number(count) + 1);
  }
  function addVideo(aid) {
    let key = `aid:${aid}`;
    saveToLocal(key);
  }
  function addAuthor(mid) {
    let key = `mid:${mid}`;
    saveToLocal(key);
  }
  var videoPatt = /\/author\/[0-9]*\/video\/[0-9]*/;
  var authorPatt = /\/author\/[0-9]*/;
  if (to.path.match(videoPatt)) {
    let list = to.path.split("/");
    addVideo(list[4]);
    addAuthor(list[2]);
  } else if (to.path.match(authorPatt)) {
    let list = to.path.split("/");
    addAuthor(list[2]);
  }
});
Vue.use(VueRouter);

// 使用axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_ROOT;
axios.defaults.headers = {
  "Content-Type": "application/json"
};
Vue.use(VueAxios, axios);
Vue.use(Vuex);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");

// refresh index.html
caches.open("biliob-precache-https://www.biliob.com/").then(c => {
  c.keys().then(k => {
    k.forEach(e => {
      if (e.url === "https://www.biliob.com/index.html") {
        c.delete(e).then(() => {
          console.log("index.html缓存清除成功");
        });
      }
    });
  });
});
