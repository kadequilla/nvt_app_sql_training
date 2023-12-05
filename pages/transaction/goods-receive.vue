<template>
  <div class="container-body">
    <h3>Transaction / Goods Receive</h3>
    <hr />
    <div class="d-flex">
      <b-button class="primary-btn mb-4 mr-2" variant="primary" @click="newTrans()">
        New Transaction
      </b-button>

      <b-form-select
        class="tradetype_select"
        v-model="selectedTradeType"
        :options="tradeTypes"
      />
    </div>

    <!-- main table -->
    <b-table
      hover
      :items="goodReceives"
      :fields="goodReceiveFields"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template #cell(actions)="row">
        <b-button
          title="View Transaction"
          class="mb-2"
          variant="info"
          @click="viewTransaction(row.item)"
        >
          <font-awesome-icon :icon="['fas', 'eye']" />
        </b-button>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" />

    <b-modal no-close-on-backdrop hide-footer id="gr_modal" :title="modalTitle" size="xl">
      <div class="d-flex gr_modal">
        <div class="border-right w-25">
          <b-form class="mr-3 h-75" @submit="onProcessTransaction">
            <b-form-group label="Document No:" label-for="docno">
              <b-form-input
                :class="form.docno != null ? 'highlight' : ''"
                id="docno"
                v-model="form.docno"
                type="text"
                placeholder="-- DOCUMENT NO HERE --"
                required
                disabled
              ></b-form-input>
            </b-form-group>

            <b-form-group label="Trade Type:" label-for="tradetype">
              <b-form-select
                id="tradetype"
                v-model="form.tradeType"
                :options="tradeTypes"
                disabled
              ></b-form-select>
            </b-form-group>

            <b-form-group label="Processed By:" label-for="prBy">
              <b-form-input
                id="prBy"
                v-model="form.prBy"
                type="text"
                placeholder="-- PROCESSED BY --"
                required
                disabled
              ></b-form-input>
            </b-form-group>

            <br />

            <div v-show="!isProcessed" class="gr_modal__footer">
              <b-button size="lg" type="submit" variant="primary"> Proccess </b-button>
              <b-button size="lg" variant="secondary" @click="onCloseGrModal()">
                Close
              </b-button>
            </div>
          </b-form>
        </div>

        <div class="w-75 mr-2 ml-2">
          <b-button
            v-show="!isProcessed"
            class="primary-btn mb-4"
            variant="info"
            @click="openProdModal()"
          >
            Add Item
          </b-button>

          <b-table
            class="t_lines"
            sticky-header
            hover
            :items="lines"
            :fields="linesFields"
          >
            <template #cell(qty)="row">
              <b-input
                :disabled="isProcessed"
                @input="onInputQty(row.item)"
                v-model="row.item.qty"
              ></b-input>
            </template>

            <template #cell(actions)="row">
              <b-button
                v-show="!isProcessed"
                class="mb-2"
                variant="danger"
                @click="onRemoveProd(row.index)"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </b-button>
            </template>
          </b-table>
        </div>
      </div>
    </b-modal>

    <b-modal hide-footer id="product_modal" title="PRODUCTS" size="lg">
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
      isOvr: false,
      skuCodeFilterOnSelectProd: "",
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
      form: {
        docno: null,
        tradeType: null,
        prById: null,
        prBy: null,
      },
      lines: [],
      linesFields: [
        { key: "prodName", label: "Product Name", thStyle: { width: "60%" } },
        { key: "qty", label: "Qty", thStyle: { width: "15%" } },
        { key: "amt", label: "Amount", thStyle: { width: "20%" } },
        { key: "actions", label: "Actions" },
      ],
      goodReceives: [],
      goodReceiveFields: [
        { key: "documentno", label: "Document No." },
        { key: "tradetype", label: "Trade Type" },
        { key: "processed_by", label: "Processed By" },
        { key: "date_created", label: "Transaction Date" },
        { key: "actions", label: "Actions" },
      ],
      selectedTradeType: "RETAIL",
      tradeTypes: [
        { value: "RETAIL", text: "RETAIL" },
        { value: "WHOLESALE", text: "WHOLESALE" },
      ],
      modalTitle: null,
      perPage: 8,
      currentPage: 1,
    };
  },
  created() {
    this.fetchGoodReceives();
    this.$store.dispatch("getAllProductPrices");
  },
  computed: {
    isProcessed() {
      return this.isOvr ? false : this.form.docno != null;
    },
    getGrLines() {
      return this.$store.state.grLines;
    },
    getProductPrices() {
      return this.$store.state.prodPrices;
    },
    getAllProducts() {
      let selectedProdIds = this.lines.map((val) => {
        return val.prodId;
      });
      return this.$store.state.products.filter((prod) => {
        return !selectedProdIds.includes(prod.product_id);
      });
    },
    getAllGr() {
      return this.$store.state.goodReceives;
    },
    rows() {
      return this.goodReceives.length;
    },
  },
  methods: {
    viewTransaction(item) {
      this.isOvr = false;
      this.modalTitle = "View Transaction";
      this.$bvModal.show("gr_modal");

      this.form = {
        docno: item.documentno,
        tradeType: item.tradetype,
        prById: item.nvt_user_id,
        prBy: item.processed_by,
      };

      this.fetchGrLinesByTransId(item.gr_id);
    },
    ovrTransaction(item) {
      this.isOvr = true;
      this.modalTitle = "Override Transaction";
      this.$bvModal.show("gr_modal");

      this.form = {
        docno: item.documentno,
        tradeType: item.tradetype,
        prById: item.nvt_user_id,
        prBy: item.processed_by,
      };

      this.fetchGrLinesByTransId(item.gr_id);
    },
    onProcessTransaction(e) {
      e.preventDefault();
      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to PROCESS Goods Receive transaction?`, {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "primary",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
        })
        .then((value) => {
          if (value) {
            this.doProcess();
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    doProcess() {
      //init local method line to push
      let lines = [];

      //set line fields according to api route body
      this.lines.forEach((val) => {
        lines.push({
          prodId: val.prodId,
          qty: val.qty,
          modCode: "GR",
        });
      });

      //post here
      axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/create-transaction`,
        data: {
          userId: sessionStorage.userId,
          moduleCode: "GR",
          tradeType: this.form.tradeType,
          lines,
        },
      }).then(
        (res) => {
          this.fetchGoodReceives().then((_) => {
            //get current processed
            let processedGr = this.goodReceives.filter((val) => {
              return val.gr_id == res.data.result.rows[0].id;
            });

            //set docno to input
            this.form.docno = processedGr[0].documentno;

            this.$refs.alert.showAlert({
              variant: "success",
              message: `Successfully processed! DOCNO: [${this.form.docno}]`,
              icon: "circle-check",
            });
          });
        },
        (err) => {
          console.log(err.response);
          this.$refs.alert.showAlert({
            variant: "danger",
            message: err.response.data.message ?? err.response.data,
          });
        }
      );
    },

    onInputQty(item) {
      item.amt = item.qty * item.price;
    },
    onRemoveProd(index) {
      this.lines.splice(index, 1);
    },
    onSelectProdSkuCodeFilterChange(e) {
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
    fetchProds() {
      this.$store.dispatch("getAllProducts").then((_) => {
        this.products = this.getAllProducts;
      });
    },
    openProdModal() {
      this.$bvModal.show("product_modal");
      this.fetchProds();
    },

    getProdPriceByTradeType(item) {
      return parseFloat(
        this.getProductPrices.filter((val) => {
          return (
            val.product_id == item.product_id && val.tradetype == this.form.tradeType
          );
        })[0]?.price ?? 0.0
      );
    },
    onSelectProd(item) {
      let prodPrice = this.getProdPriceByTradeType(item);

      this.lines.push({
        prodId: item.product_id,
        prodName: `[${item.skucode}] ${item.product_name}`,
        qty: 1,
        amt: prodPrice,
        price: prodPrice,
      });
      this.products = this.getAllProducts;
    },
    newTrans() {
      //show main transaction modal
      this.$bvModal.show("gr_modal");

      //modal header title
      this.modalTitle = "NEW TRANSACTION";

      //reset form data
      this.form = {
        docno: null,
        tradeType: "WHOLESALE",
        prById: sessionStorage.userId,
        prBy: sessionStorage.user_full_name,
      };
      //reset lines
      this.lines = [];
    },
    onCloseGrModal() {
      this.$bvModal.hide("gr_modal");
      this.form = {
        docno: null,
        tradeType: "RETAIL",
        prById: null,
        prBy: null,
      };
    },
    fetchGoodReceives() {
      return this.$store.dispatch("getAllGr").then((_) => {
        this.goodReceives = this.getAllGr;
      });
    },
    fetchGrLinesByTransId(id) {
      return this.$store.dispatch("getAllGrLines").then((_) => {
        this.lines = [];
        this.getGrLines.forEach((val) => {
          if (val.gr_id == id) {
            this.lines.push({
              prodId: val.product_id,
              prodName: `[${val.skucode}] ${val.product_name}`,
              qty: val.qty,
              amt: val.total_amount,
            });
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tradetype_select {
  width: 120px;
}

.border-right {
  border-right: 1px solid #acacac;
}

.gr_modal {
  height: 75vh;

  &__footer {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 20px;
    margin-right: 20px;
  }
}

.t_lines {
  max-height: 75%;
}

.highlight {
  font-weight: bold;
  box-shadow: -3px 2px 40px -9px rgba(0, 255, 73, 0.57);
  -webkit-box-shadow: -3px 2px 40px -9px rgba(0, 255, 73, 0.57);
  -moz-box-shadow: -3px 2px 40px -9px rgba(0, 255, 73, 0.57);
}
</style>
