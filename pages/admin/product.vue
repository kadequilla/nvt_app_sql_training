<template>
  <div class="container-body">
    <h3>Admin / Product</h3>
    <hr />
    <b-button class="primary-btn mb-4" variant="primary" @click="openProductModal('ADD')">
      Add Product
    </b-button>
    <b-table
      hover
      :items="products"
      :fields="productFields"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template #cell(action)="row">
        <b-button class="mb-2" variant="info" @click="openProductModal('EDIT', row.item)">
          <font-awesome-icon :icon="['fas', 'pen']" />
        </b-button>

        <b-button class="mb-2" variant="danger" @click="deleteProduct(row.item)">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </b-button>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" />

    <b-modal
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      id="product_modal"
      :title="modalTitle"
      size="lg"
    >
      <b-form class="product-modal" @submit="onSubmitProductModal">
        <b-form-group label="Product Group:" label-for="prodGrp">
          <b-input-group>
            <b-form-input
              v-model="form.groupName"
              disabled
              placeholder="Select Product Group"
            />
            <b-input-group-append>
              <b-button
                size="sm"
                text="Button"
                variant="secondary"
                @click="openProdGroupModal()"
              >
                SELECT
                <font-awesome-icon :icon="['fas', 'arrow-turn-down']" />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-form-group label="SKUCODE:" label-for="skucode">
          <b-form-input
            id="skucode"
            v-model="form.skucode"
            type="text"
            placeholder="Enter SKUCODE"
            required
          />
        </b-form-group>

        <b-form-group label="BARCODE:" label-for="barcode">
          <b-form-input
            id="barcode"
            v-model="form.barcode"
            type="text"
            placeholder="Enter BARCODE"
            required
          />
        </b-form-group>

        <b-form-group label="Product Name:" label-for="prodname">
          <b-form-input
            id="prodname"
            v-model="form.prodname"
            type="text"
            placeholder="Enter Product Name"
            required
          />
        </b-form-group>

        <b-form-group label="Unit:" label-for="unit">
          <b-form-input
            id="unit"
            v-model="form.unit"
            type="text"
            placeholder="Enter Unit"
            required
          />
        </b-form-group>

        <hr />

        <b-button type="submit" variant="primary"> Submit </b-button>
        <b-button variant="secondary" @click="closeProductModal()"> Cancel </b-button>
      </b-form>
    </b-modal>

    <b-modal
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      id="product_group_modal"
      title="PRODUCT GROUPS"
      size="sm"
    >
      <b-table hover :items="prodGroups" :fields="prodGroupFields">
        <template #cell(action)="row">
          <b-button class="mb-2" variant="info" @click="onSelectProdGroup(row.item)">
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
      selectedProductId: null,
      form: {
        groupId: null,
        groupName: null,
        skucode: null,
        barcode: null,
        prodname: null,
        unit: null,
      },
      prodGroups: [],
      prodGroupFields: [
        { key: "group_name", label: "Group Name" },
        { key: "date_created", label: "Date Created" },
        { key: "action", label: "Actions" },
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
      perPage: 8,
      currentPage: 1,
    };
  },
  created() {
    this.fetchProducts();
  },
  computed: {
    getAllProdGroups() {
      return this.$store.state.prodGroups;
    },
    getAllProducts() {
      return this.$store.state.products;
    },
    rows() {
      return this.products.length;
    },
  },
  methods: {
    onSelectProdGroup(item) {
      this.form.groupId = item.product_group_id;
      this.form.groupName = item.group_name;
      this.$bvModal.hide("product_group_modal");
    },
    openProdGroupModal() {
      this.$bvModal.show("product_group_modal");
      this.fetchProdGroups();
    },
    onSubmitProductModal(e) {
      e.preventDefault();

      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to ${this.action} product?`, {
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
            if (this.action == "ADD") {
              this.addProduct();
            }
            if (this.action == "EDIT") {
              this.editProduct();
            }
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    deleteProduct(item) {
      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to DELETE Product?`, {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
        })
        .then((value) => {
          if (value) {
            axios({
              method: "DELETE",
              url: `${this.$axios.defaults.baseURL}/delete-product/${item.product_id}`,
            }).then(
              (res) => {
                this.$refs.alert.showAlert({
                  variant: "success",
                  message: "Successfully deleted Product!",
                  icon: "circle-check",
                });
                this.closeProductModal();
                this.fetchProducts();
              },
              (err) => {
                console.log(err.response);
                this.$refs.alert.showAlert({
                  variant: "danger",
                  message: err.response.data,
                  icon: "circle-exclamation",
                });
              }
            );
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    addProduct() {
      axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/create-product`,
        data: {
          groupId: this.form.groupId,
          skucode: this.form.skucode,
          barcode: this.form.barcode,
          prodname: this.form.prodname,
          unit: this.form.unit,
        },
      }).then(
        (res) => {
          this.$refs.alert.showAlert({
            variant: "success",
            message: "Successfully added Product!",
            icon: "circle-check",
          });
          this.closeProductModal();
          this.fetchProducts();
        },
        (err) => {
          console.log(err.response.data.code);
          if (err.response.data?.code == "23505") {
            this.$refs.alert.showAlert({
              variant: "danger",
              message: "SKUCODE Already exists!",
              icon: "circle-exclamation",
            });
            return;
          }

          this.$refs.alert.showAlert({
            variant: "danger",
            message: err.response.data,
            icon: "circle-exclamation",
          });
        }
      );
    },

    editProduct() {
      axios({
        method: "PUT",
        url: `${this.$axios.defaults.baseURL}/update-product/${this.selectedProductId}`,
        data: {
          groupId: this.form.groupId,
          skucode: this.form.skucode,
          barcode: this.form.barcode,
          prodname: this.form.prodname,
          unit: this.form.unit,
        },
      }).then(
        (res) => {
          this.$refs.alert.showAlert({
            variant: "success",
            message: "Successfully updated product!",
            icon: "circle-check",
          });
          this.closeProductModal();
          this.fetchProducts();
        },
        (err) => {
          console.log(err.response);
          this.$refs.alert.showAlert({
            variant: "danger",
            message: err.response.data,
            icon: "circle-exclamation",
          });
        }
      );
    },
    closeProductModal() {
      this.action = null;
      this.$bvModal.hide("product_modal");
      this.form = {
        groupId: null,
        groupName: null,
        skucode: null,
        barcode: null,
        prodname: null,
        unit: null,
      };
    },
    openProductModal(action, item) {
      this.action = action;
      this.$bvModal.show("product_modal");

      if (action == "ADD") {
        this.modalTitle = "ADD PRODUCT";
      }

      if (action == "EDIT") {
        this.modalTitle = "EDIT PRODUCT";
        this.selectedProductId = item.product_id;
        this.form = {
          groupId: item.product_group_id,
          groupName: item.group_name,
          skucode: item.skucode,
          barcode: item.barcode,
          prodname: item.product_name,
          unit: item.unit,
        };
      }
    },
    fetchProducts() {
      this.$store.dispatch("getAllProducts").then((_) => {
        this.products = this.getAllProducts;
      });
    },
    fetchProdGroups() {
      this.$store.dispatch("getAllProdGroups").then((_) => {
        this.prodGroups = this.getAllProdGroups;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.product-modal {
  margin: 0 100px 34px 100px;
}
</style>
