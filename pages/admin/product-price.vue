<template>
  <div class="container-body">
    <h3>Admin / Product Price</h3>
    <hr />
    <div class="d-flex">
      <b-button
        class="primary-btn mb-4 mr-2"
        variant="primary"
        @click="openProductPriceModal()"
      >
        Setup Product Price
      </b-button>

      <b-form-group class="mr-2">
        <b-form-radio-group
          v-model="selectedFilterPrice"
          :options="filterPriceList"
          button-variant="outline-secondary"
          name="radio-btn-outline"
          buttons
          @change="onChangeRadioFilterPrice()"
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
      :items="productPrices"
      :fields="productPriceFields"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template #cell(product_name)="row">
        {{ `[${row.item.skucode}] ${row.item.product_name}` }}
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" />

    <b-modal
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      id="product_price_modal"
      :title="modalTitle"
      size="xl"
    >
      <b-form class="product-price-modal" @submit="onSubmitProductPriceModal">
        <b-form-group label="Product:" label-for="prod">
          <b-input-group>
            <b-form-input v-model="form.prodName" disabled placeholder="Select Product" />
            <b-input-group-append>
              <b-button
                id="prod"
                size="sm"
                text="Button"
                variant="secondary"
                @click="openProdModal()"
              >
                SELECT
                <font-awesome-icon :icon="['fas', 'arrow-turn-down']" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-form-group label="Price:" label-for="price">
          <b-form-input
            id="price"
            v-model="form.price"
            type="text"
            placeholder="Enter Price"
            required
          />
        </b-form-group>

        <b-form-group label="Trade Type:" label-for="tradeType">
          <b-form-select id="tradeType" v-model="form.tradeType" :options="tradeTypes" />
        </b-form-group>

        <br />

        <b-button type="submit" variant="primary"> Submit </b-button>
        <b-button variant="secondary" @click="closeProductPriceModal()">
          Cancel
        </b-button>
      </b-form>
    </b-modal>

    <b-modal hide-footer id="product_modal" title="PRODUCTS" size="lg">
      <div class="p-5">
        <b-form-input
          class="mb-2"
          v-model="skuCodeFilterOnSelectProd"
          placeholder="Filter SKUCODE"
          @input="onSelectProdSkuCodeFilterChange()"
        />

        <b-table sticky-header hover :items="products" :fields="productFields">
          <template #cell(action)="row">
            <b-button class="mb-2" variant="info" @click="onSelectProd(row.item)">
              <font-awesome-icon :icon="['fas', 'check']" />
            </b-button>
          </template>
        </b-table>
      </div>
    </b-modal>

    <!-- ALERT -->
    <alert ref="alert" />
  </div>
</template>
<script>
import axios from "axios";

export default {
  layout: "my-layout",
  data() {
    return {
      skuCodeFilter: "",
      skuCodeFilterOnSelectProd: "",
      selectedFilterPrice: "latest",
      filterPriceList: [
        { text: "Latest", value: "latest" },
        { text: "History", value: "history" },
      ],
      tradeTypes: [
        { value: null, text: "--SELECT TRADE TYPE--" },
        { value: "WHOLESALE", text: "WHOLESALE" },
        { value: "RETAIL", text: "RETAIL" },
      ],
      selectedProductId: null,
      form: {
        prodId: null,
        prodName: null,
        price: null,
        tradeType: null,
      },
      productPrices: [],
      productPriceFields: [
        { key: "product_name", label: "Product Name" },
        { key: "tradetype", label: "Trade Type" },
        { key: "price", label: "Price" },
        { key: "date_created", label: "Date Created" },
      ],
      products: [],
      productFields: [
        { key: "group_name", label: "Group Name" },
        { key: "skucode", label: "SKUCODE" },
        { key: "barcode", label: "BARCODE" },
        { key: "product_name", label: "Product Name" },
        { key: "unit", label: "Unit" },
        { key: "date_created", label: "Date Created" },
        { key: "action", label: "Actions" },
      ],
      modalTitle: null,
      action: null,
      perPage: 10,
      currentPage: 1,
    };
  },
  created() {
    this.fetchProductPrices();
  },
  computed: {
    getAllProductPrices() {
      return this.$store.state.prodPrices;
    },
    getAllProductPriceHis() {
      return this.$store.state.prodPricesHis;
    },
    getAllProducts() {
      return this.$store.state.products;
    },
    rows() {
      return this.productPrices.length;
    },
  },
  methods: {
    onSelectProdSkuCodeFilterChange() {
      if (this.skuCodeFilterOnSelectProd.length <= 0) {
        this.products = this.getAllProducts;
      } else {
        this.products = this.getAllProducts.filter(
          function (val) {
            return val.skucode.includes(this.skuCodeFilterOnSelectProd.toUpperCase());
          }.bind(this)
        );
      }
    },

    onSkuCodeFilterChange() {
      const isLatest = this.selectedFilterPrice == "latest";
      const prodPrices = isLatest ? this.getAllProductPrices : this.getAllProductPriceHis;

      if (this.skuCodeFilter.length <= 0) {
        this.productPrices = prodPrices;
      } else {
        this.productPrices = prodPrices.filter(
          function (val) {
            return val.skucode.includes(this.skuCodeFilter.toUpperCase());
          }.bind(this)
        );
      }
    },
    onChangeRadioFilterPrice() {
      this.fetchProductPrices();
    },
    onSelectProd(item) {
      this.form.prodId = item.product_id;
      this.form.prodName = `[${item.skucode}] ${item.product_name}`;
      this.$bvModal.hide("product_modal");
    },
    openProdModal() {
      this.$bvModal.show("product_modal");
      this.fetchProds();
    },
    onSubmitProductPriceModal(e) {
      e.preventDefault();

      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to ADD price?`, {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
        })
        .then((value) => {
          if (value) {
            this.addProductPrice();
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    addProductPrice() {
      axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/create-product-price`,
        data: {
          prodId: this.form.prodId,
          price: this.form.price,
          tradeType: this.form.tradeType,
        },
      }).then(
        (res) => {
          this.$refs.alert.showAlert({
            variant: "success",
            message: "Successfully added Product Price!",
            icon: "circle-check",
          });
          this.closeProductPriceModal();
          this.fetchProductPrices();
        },
        (err) => {
          this.$refs.alert.showAlert({
            variant: "danger",
            message: err.response.data,
            icon: "circle-exclamation",
          });
        }
      );
    },

    closeProductPriceModal() {
      this.$bvModal.hide("product_price_modal");
    },
    openProductPriceModal() {
      this.$bvModal.show("product_price_modal");
      this.modalTitle = "ADD PRODUCT";
      this.form = {
        prodId: null,
        price: null,
        prodName: null,
        tradeType: null,
      };
    },
    fetchProductPrices() {
      const isLatest = this.selectedFilterPrice == "latest";
      if (isLatest) {
        this.$store.dispatch("getAllProductPrices").then((_) => {
          this.productPrices = this.getAllProductPrices.filter(
            function (val) {
              return val.skucode.includes(this.skuCodeFilter.toUpperCase());
            }.bind(this)
          );
        });
      } else {
        this.$store.dispatch("getAllProductPriceHis").then((_) => {
          this.productPrices = this.getAllProductPriceHis.filter(
            function (val) {
              return val.skucode.includes(this.skuCodeFilter.toUpperCase());
            }.bind(this)
          );
        });
      }
    },
    fetchProds() {
      this.$store.dispatch("getAllProducts").then((_) => {
        this.products = this.getAllProducts;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.product-price-modal {
  margin: 20px 100px 100px 100px;
}
</style>
onSkuCodeFilterChange() {
