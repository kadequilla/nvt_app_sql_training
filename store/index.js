import axios from "axios";

export default {
  state() {
    return {
      users: [],
      modules: [],
      prodGroups: [],
      products: [],
      goodReceives: [],
      grLines: [],
      sales: [],
      salesLines: [],
      latestStockards: [],
      stockardHistory: []
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

    SET_GOOD_RECEIVES(state, data) {
      state.goodReceives = data;
    },
    SET_GRLINES(state, data) {
      state.grLines = data;
    },
    SET_SALES(state, data) {
      state.sales = data;
    },
    SET_SALESLINE(state, data) {
      state.salesLines = data;
    },
    SET_LATEST_STOCKARD(state, data) {
      state.latestStockards = data;
    },
    SET_STOCKARD_HISTORY(state, data) {
      state.stockardHistory = data;
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
    },

    async getAllGrLines({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/gr-lines`,
      }).then(res => {
        commit("SET_GRLINES", res.data);
      }, err => { console.log(err); });
    },

    async getAllSales({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/sales`,
      }).then(res => {
        commit("SET_SALES", res.data);
      }, err => { console.log(err); });
    },

    async getAllSalesLine({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/sales-lines`,
      }).then(res => {
        commit("SET_SALESLINE", res.data);
      }, err => { console.log(err); });
    },

    async getLatestStockards({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/stockards-latest`,
      }).then(res => {
        commit("SET_LATEST_STOCKARD", res.data);
      }, err => { console.log(err); });
    },
    async getStockardHistory({ commit }) {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/stockards-history`,
      }).then(res => {
        commit("SET_STOCKARD_HISTORY", res.data);
      }, err => { console.log(err); });
    },
  }
};