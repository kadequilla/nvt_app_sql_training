<template>
  <div class="container-body">
    <h3>Transaction / Goods Receive</h3>
    <hr />
    <div class="d-flex">
      <b-button
        class="primary-btn mb-4 mr-2"
        variant="primary"
        @click="openGrModal('NEW TRANSACTION')"
      >
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
        <b-button title="View Transaction" class="mb-2" variant="info" @click="">
          <font-awesome-icon :icon="['fas', 'eye']" />
        </b-button>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" />

    <b-modal
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      id="gr_modal"
      :title="modalTitle"
      size="xl"
    >
      <div class="d-flex">
        <div class="border-right w-25">
          <b-form class="mr-3 h-75" @submit="">
            <b-form-group label="Document No:" label-for="docno">
              <b-form-input
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

            <b-button type="submit" variant="primary"> Proccess </b-button>
            <b-button variant="secondary" @click="onCloseGrModal()"> Close </b-button>
          </b-form>
        </div>

        <div class="w-75"></div>
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
      form: {
        docno: null,
        tradeType: "RETAIL",
        prById: null,
        prBy: null,
      },
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
        { value: "WHOLESALE", text: "WHOLESALE" },
        { value: "RETAIL", text: "RETAIL" },
      ],
      modalTitle: null,
      perPage: 8,
      currentPage: 1,
    };
  },
  created() {
    this.fetchGoodReceives();
  },
  computed: {
    getAllGr() {
      return this.$store.state.goodReceives;
    },
    rows() {
      return this.goodReceives.length;
    },
  },
  methods: {
    openGrModal(action) {
      this.modalTitle = action;
      this.$bvModal.show("gr_modal");
      this.form.prById = sessionStorage.userId;
      this.form.prBy = sessionStorage.user_full_name;
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
      this.$store.dispatch("getAllGr").then((_) => {
        this.goodReceives = this.getAllGr;
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
</style>
