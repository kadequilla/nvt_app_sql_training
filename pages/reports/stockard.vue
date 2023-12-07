<template>
  <div class="container-body">
    <h3>Reports / Stockard</h3>
    <hr />
    <div class="d-flex">
      <b-form-group class="mr-2">
        <b-form-radio-group
          v-model="selectedFilterType"
          :options="filterTypes"
          button-variant="outline-secondary"
          name="radio-btn-outline"
          buttons
          @change="onChangeRadioFilterStockard()"
        ></b-form-radio-group>
      </b-form-group>

      <b-form-input
        class="w-50"
        v-model="skuCodeFilter"
        placeholder="Filter SKUCODE"
        @input="onSkuCodeFilterChange()"
      />
    </div>
    <b-table
      hover
      :items="stockards"
      :fields="stockardFields"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template #cell(qty_bal)="row">
        <div v-if="row.item.islatest">
          <b>{{ row.item.qty_bal }}</b>
          <br />
          <sub>(current qty balance)</sub>
        </div>
        <div v-else>{{ row.item.qty_bal }}</div>
      </template>

      <template #cell(amount_bal)="row">
        <div v-if="row.item.islatest">
          <b>{{ row.item.amount_bal }}</b>
          <br />
          <sub>(total amount balance)</sub>
        </div>
        <div v-else>{{ row.item.amount_bal }}</div>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" />

    <!-- ALERT -->
    <alert ref="alert" />
  </div>
</template>
<script>
export default {
  layout: "my-layout",
  data() {
    return {
      skuCodeFilter: "",
      selectedFilterType: "history",
      filterTypes: [
        { text: "Latest", value: "latest" },
        { text: "History", value: "history" },
      ],

      stockards: [],
      stockardFields: [],

      perPage: 15,
      currentPage: 1,
    };
  },
  created() {},
  mounted() {
    this.fetchStockards();
  },
  computed: {
    getLatestStockards() {
      return this.$store.state.latestStockards;
    },

    getStockardHistory() {
      return this.$store.state.stockardHistory;
    },

    rows() {
      return this.stockards.length;
    },
  },
  methods: {
    onSkuCodeFilterChange() {
      const isLatest = this.selectedFilterType == "latest";
      const stockards = isLatest ? this.getLatestStockards : this.getStockardHistory;

      if (this.skuCodeFilter.length <= 0) {
        this.stockards = stockards;
      } else {
        this.stockards = stockards.filter(
          function (val) {
            return val.skucode.includes(this.skuCodeFilter.toUpperCase());
          }.bind(this)
        );
      }
    },
    onChangeRadioFilterStockard() {
      this.fetchStockards();
    },

    fetchStockards() {
      const isLatest = this.selectedFilterType == "latest";
      if (isLatest) {
        this.fetchLatestStockard();
      } else {
        this.fetchStockardHistory();
      }
    },

    fetchLatestStockard() {
      this.$store.dispatch("getLatestStockards").then((_) => {
        //set table fields for latest
        this.stockardFields = [
          { key: "skucode", label: "SKUCODE" },
          { key: "product_name", label: "Product Name" },
          { key: "qty_bal", label: "Qty Balance" },
          { key: "amt_bal", label: "Amount Balance" },
          { key: "mac", label: "Moving Average Cost" },
        ];
        //fetch latest stockards
        this.stockards = this.getLatestStockards.filter(
          function (val) {
            return val.skucode.includes(this.skuCodeFilter.toUpperCase());
          }.bind(this)
        );
      });
    },

    fetchStockardHistory() {
      //set table fields for stockard history
      this.stockardFields = [
        { key: "skucode", label: "SKUCODE" },
        { key: "product_name", label: "Product Name" },
        { key: "documentno", label: "Document No." },
        { key: "qty", label: "Qty" },
        { key: "amount", label: "Amount" },
        { key: "qty_bal", label: "Qty Balance" },
        { key: "amount_bal", label: "Amount Balance" },
        { key: "mac", label: "Moving Average Cost" },
        { key: "date_created", label: "Date Created" },
      ];

      this.$store.dispatch("getStockardHistory").then((_) => {
        this.stockards = this.getStockardHistory.filter(
          function (val) {
            return val.skucode.includes(this.skuCodeFilter.toUpperCase());
          }.bind(this)
        );
      });
    },
  },
};
</script>
