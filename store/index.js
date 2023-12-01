import axios from "axios";

export default {
  state() {
    return {
      users: [],
      modules: [],
      prodGroups: [],
      products: [],
      prodPrices: [],
      prodPricesHis: [],
      goodReceives: []
    };
  },

  mutations: {
    SET_USERS(state, data) {
      state.users = data;
    },
    SET_MODULES(state, data) {
      state.modules = data;
    },
    SET_PROD_GROUPS(state, data) {
      state.prodGroups = data;
    },
    SET_PRODUCTS(state, data) {
      state.products = data;
    },
    SET_PRODUCT_PRICES(state, data) {
      state.prodPrices = data;
    },
    SET_PRODUCT_PRICES_HISTORY(state, data) {
      state.prodPricesHis = data;
    },
    SET_GOOD_RECEIVES(state, data) {
      state.goodReceives = data;
    }
  },

  actions: {
    async getAllUsers({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/users`,
      }).then(res => {
        commit("SET_USERS", res.data);
      }, err => { console.log(err); });
    },

    async getAllModules({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/modules`,
      }).then(res => {
        commit("SET_MODULES", res.data);
      }, err => { console.log(err); });
    },

    async getAllProdGroups({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/product-groups`,
      }).then(res => {
        commit("SET_PROD_GROUPS", res.data);
      }, err => { console.log(err); });
    },

    async getAllProducts({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/products`,
      }).then(res => {
        commit("SET_PRODUCTS", res.data);
      }, err => { console.log(err); });
    },

    async getAllProductPrices({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/product-prices`,
      }).then(res => {
        commit("SET_PRODUCT_PRICES", res.data);
      }, err => { console.log(err); });
    },
    async getAllProductPriceHis({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/product-prices-history`,
      }).then(res => {
        commit("SET_PRODUCT_PRICES_HISTORY", res.data);
      }, err => { console.log(err); });
    },

    async getAllGr({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/gr`,
      }).then(res => {
        commit("SET_GOOD_RECEIVES", res.data);
      }, err => { console.log(err); });
    }
  }
};