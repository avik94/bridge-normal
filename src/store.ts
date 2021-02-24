import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    baseURL: "http://40.87.7.157:5001",
    companyId: "",
    companyName: "",
    location: ""
  },
  mutations: {
    storeCompanyId(state, data) {
      state.companyId = data
    },
    storeCompanyName(state, data) {
      state.companyName = data
    },
    storeLocation(state, data) {
      state.location = data
    }
  },
  actions: {

  },
});
