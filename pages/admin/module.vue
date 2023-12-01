<template>
  <div class="container-body">
    <h3>Admin / Module</h3>
    <hr />
    <b-button class="primary-btn mb-4" variant="primary" @click="openModuleModal('ADD')">
      Add Module
    </b-button>
    <b-table
      hover
      :items="modules"
      :fields="moduleFields"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template #cell(action)="row">
        <b-button class="mb-2" variant="info" @click="openModuleModal('EDIT', row.item)">
          <font-awesome-icon :icon="['fas', 'pen']" />
        </b-button>

        <b-button class="mb-2" variant="danger" @click="deleteModule(row.item)">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </b-button>
      </template>
    </b-table>
    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" />

    <b-modal
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      id="module_modal"
      :title="modalTitle"
      size="sm"
    >
      <b-form @submit="onSubmitModuleModal">
        <b-form-group label="Module Code:" label-for="mcode">
          <b-form-input
            id="mcode"
            v-model="form.moduleCode"
            type="text"
            placeholder="Enter Module Code"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Module Name:" label-for="mname">
          <b-form-input
            id="mname"
            v-model="form.moduleName"
            type="text"
            placeholder="Enter Module Name"
            required
          ></b-form-input>
        </b-form-group>

        <hr />

        <b-button type="submit" variant="primary"> Submit </b-button>
        <b-button variant="secondary" @click="closeModuleModal()"> Cancel </b-button>
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
      selectedModuleId: null,
      form: {
        moduleCode: null,
        moduleName: null,
      },
      modules: [],
      moduleFields: [
        { key: "module_code", label: "Module Code" },
        { key: "module_name", label: "Module Name" },
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
    this.fetchModules();
  },
  computed: {
    getAllModules() {
      return this.$store.state.modules;
    },
    rows() {
      return this.modules.length;
    },
  },
  methods: {
    onSubmitModuleModal(e) {
      e.preventDefault();

      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to ${this.action} module?`, {
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
              this.addModule();
            }
            if (this.action == "EDIT") {
              this.editModule();
            }
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    deleteModule(item) {
      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to DELETE Module?`, {
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
              url: `${this.$axios.defaults.baseURL}/delete-module/${item.module_id}`,
            }).then(
              (res) => {
                this.$refs.alert.showAlert({
                  variant: "success",
                  message: "Successfully deleted MODULE!",
                  icon: "circle-check",
                });
                this.closeModuleModal();
                this.fetchModules();
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

    addModule() {
      axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/create-module`,
        data: {
          modCode: this.form.moduleCode,
          ModName: this.form.moduleName,
        },
      }).then(
        (res) => {
          this.$refs.alert.showAlert({
            variant: "success",
            message: "Successfully added MODULE!",
            icon: "circle-check",
          });
          this.closeModuleModal();
          this.fetchModules();
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

    editModule() {
      axios({
        method: "PUT",
        url: `${this.$axios.defaults.baseURL}/update-module/${this.selectedModuleId}`,
        data: {
          modCode: this.form.moduleCode,
          ModName: this.form.moduleName,
        },
      }).then(
        (res) => {
          this.$refs.alert.showAlert({
            variant: "success",
            message: "Successfully updated module!",
            icon: "circle-check",
          });
          this.closeModuleModal();
          this.fetchModules();
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
    closeModuleModal() {
      this.action = null;
      this.$bvModal.hide("module_modal");
      this.form = {
        moduleCode: null,
        moduleName: null,
      };
    },
    openModuleModal(action, item) {
      this.action = action;
      this.$bvModal.show("module_modal");

      if (action == "ADD") {
        this.modalTitle = "ADD MODULE";
      }

      if (action == "EDIT") {
        this.modalTitle = "EDIT MODULE";
        this.selectedModuleId = item.module_id;
        this.form = {
          moduleCode: item.module_code,
          moduleName: item.module_name,
        };
      }
    },
    fetchModules() {
      this.$store.dispatch("getAllModules").then((_) => {
        this.modules = this.getAllModules;
      });
    },
  },
};
</script>
