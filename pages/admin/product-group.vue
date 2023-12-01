<template>
  <div class="container-body">
    <h3>Admin / Product Group</h3>
    <hr />
    <b-button
      class="primary-btn mb-4"
      variant="primary"
      @click="openProdGroupModal('ADD')"
    >
      Add Product Group
    </b-button>
    <b-table
      hover
      :items="prodGroups"
      :fields="prodGroupFields"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template #cell(action)="row">
        <b-button
          class="mb-2"
          variant="info"
          @click="openProdGroupModal('EDIT', row.item)"
        >
          <font-awesome-icon :icon="['fas', 'pen']" />
        </b-button>

        <b-button class="mb-2" variant="danger" @click="deleteProdGroup(row.item)">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </b-button>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" />

    <b-modal
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      id="prod_group_modal"
      :title="modalTitle"
      size="sm"
    >
      <b-form @submit="onSubmitProdGroupModal">
        <b-form-group label="Group Name:" label-for="grpName">
          <b-form-input
            id="grpName"
            v-model="form.groupName"
            type="text"
            placeholder="Enter Group Name"
            required
          ></b-form-input>
        </b-form-group>

        <hr />

        <b-button type="submit" variant="primary"> Submit </b-button>
        <b-button variant="secondary" @click="closeProdGroupModal()"> Cancel </b-button>
      </b-form>
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
      selectedProdGroupId: null,
      form: {
        groupName: null,
      },
      prodGroups: [],
      prodGroupFields: [
        { key: "group_name", label: "Group Name" },
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
    this.fetchProdGroups();
  },
  computed: {
    getAllProdGroups() {
      return this.$store.state.prodGroups;
    },
    rows() {
      return this.prodGroups.length;
    },
  },
  methods: {
    onSubmitProdGroupModal(e) {
      e.preventDefault();

      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to ${this.action} product group?`, {
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
              this.addProdGroup();
            }
            if (this.action == "EDIT") {
              this.editProdGroup();
            }
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    deleteProdGroup(item) {
      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to DELETE Product Group?`, {
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
              url: `${this.$axios.defaults.baseURL}/delete-product-group/${item.product_group_id}`,
            }).then(
              (res) => {
                this.$refs.alert.showAlert({
                  variant: "success",
                  message: "Successfully deleted Product Group!",
                  icon: "circle-check",
                });
                this.closeProdGroupModal();
                this.fetchProdGroups();
              },
              (err) => {
                console.log(err.response);
                this.$refs.alert.showAlert({
                  variant: "danger",
                  message: err.response.data,
                });
              }
            );
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    addProdGroup() {
      axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/create-product-groups`,
        data: {
          groupName: this.form.groupName,
        },
      }).then(
        (res) => {
          this.$refs.alert.showAlert({
            variant: "success",
            message: "Successfully added Product Group!",
            icon: "circle-check",
          });
          this.closeProdGroupModal();
          this.fetchProdGroups();
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

    editProdGroup() {
      axios({
        method: "PUT",
        url: `${this.$axios.defaults.baseURL}/update-product-group/${this.selectedProdGroupId}`,
        data: {
          groupName: this.form.groupName,
        },
      }).then(
        (res) => {
          this.$refs.alert.showAlert({
            variant: "success",
            message: "Successfully updated product group!",
            icon: "circle-check",
          });
          this.closeProdGroupModal();
          this.fetchProdGroups();
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
    closeProdGroupModal() {
      this.action = null;
      this.$bvModal.hide("prod_group_modal");
      this.form = {
        moduleCode: null,
        moduleName: null,
      };
    },
    openProdGroupModal(action, item) {
      this.action = action;
      this.$bvModal.show("prod_group_modal");

      if (action == "ADD") {
        this.modalTitle = "ADD PRODUCT GROUP";
      }

      if (action == "EDIT") {
        this.modalTitle = "EDIT PRODUCT GROUP";
        this.selectedProdGroupId = item.product_group_id;
        this.form = {
          groupName: item.group_name,
        };
      }
    },
    fetchProdGroups() {
      this.$store.dispatch("getAllProdGroups").then((_) => {
        this.prodGroups = this.getAllProdGroups;
      });
    },
  },
};
</script>
