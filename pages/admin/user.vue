<template>
  <div class="container-body">
    <h3>Admin / User</h3>
    <hr />
    <b-button class="primary-btn mb-4" variant="primary" @click="openUserModal('ADD')">
      Add User
    </b-button>
    <b-table
      hover
      :items="users"
      :fields="userFields"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template #cell(middlename)="row">
        {{ row.item.middlename ?? "-" }}
      </template>
      <template #cell(action)="row">
        <b-button class="mb-2" variant="info" @click="openUserModal('EDIT', row.item)">
          <font-awesome-icon :icon="['fas', 'pen']" />
        </b-button>

        <b-button class="mb-2" variant="danger" @click="deleteUser(row.item)">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </b-button>
      </template>
    </b-table>
    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" />

    <b-modal
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      id="user_modal"
      :title="modalTitle"
      size="sm"
    >
      <b-form @submit="onSubmitUserModal">
        <b-form-group label="Username:" label-for="uname">
          <b-form-input
            id="uname"
            v-model="form.username"
            type="text"
            placeholder="Enter Username"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Password:" label-for="pw">
          <b-form-input
            id="pw"
            v-model="form.pw"
            type="password"
            placeholder="Enter Password"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Firstname:" label-for="fname">
          <b-form-input
            id="fname"
            v-model="form.fname"
            type="text"
            placeholder="Enter Firstname"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Middlename:" label-for="mname">
          <b-form-input
            id="mname"
            v-model="form.mname"
            type="text"
            placeholder="Enter Middlename"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Lastname:" label-for="lname">
          <b-form-input
            id="lname"
            v-model="form.lname"
            type="text"
            placeholder="Enter Middlename"
          ></b-form-input>
        </b-form-group>

        <hr />

        <b-button type="submit" variant="primary"> Submit </b-button>
        <b-button variant="secondary" @click="closeUserModal()"> Cancel </b-button>
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
      selectedUserId: null,
      form: {
        username: null,
        pw: null,
        fname: null,
        mname: null,
        lname: null,
      },
      users: [],
      userFields: [
        { key: "firstname", label: "First Name" },
        { key: "middlename", label: "Middle Name" },
        { key: "lastname", label: "Last Name" },
        { key: "username", label: "Username" },
        { key: "datecreated", label: "Date Created" },
        { key: "action", label: "Actions" },
      ],
      modalTitle: null,
      action: null,
      perPage: 8,
      currentPage: 1,
    };
  },
  created() {
    this.fetchUsers();
  },
  computed: {
    getAllUsers() {
      return this.$store.state.users;
    },
    rows() {
      return this.users.length;
    },
  },
  methods: {
    onSubmitUserModal(e) {
      e.preventDefault();

      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to ${this.action} user?`, {
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
              this.addUser();
            }
            if (this.action == "EDIT") {
              this.editUser();
            }
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    deleteUser(item) {
      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to DELETE user?`, {
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
              url: `${this.$axios.defaults.baseURL}/delete-users/${item.nvt_user_id}`,
            }).then(
              (res) => {
                this.$refs.alert.showAlert({
                  variant: "success",
                  message: "Successfully deleted user!",
                  icon: "circle-check",
                });
                this.closeUserModal();
                this.fetchUsers();
              },
              (err) => {
                console.log(err.response);
                this.$refs.alert.showAlert({
                  variant: "danger",
                  message: err,
                });
              }
            );
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },

    addUser() {
      axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/create-users`,
        data: {
          fname: this.form.fname,
          mname: this.form.mname,
          lname: this.form.lname,
          uname: this.form.username,
          password: this.form.pw,
        },
      }).then(
        (res) => {
          this.$refs.alert.showAlert({
            variant: "success",
            message: "Successfully added user!",
            icon: "circle-check",
          });
          this.closeUserModal();
          this.fetchUsers();
        },
        (err) => {
          console.log(err.response);
        }
      );
    },

    editUser() {
      axios({
        method: "PUT",
        url: `${this.$axios.defaults.baseURL}/update-users/${this.selectedUserId}`,
        data: {
          fname: this.form.fname,
          mname: this.form.mname,
          lname: this.form.lname,
          uname: this.form.username,
          password: this.form.pw,
        },
      }).then(
        (res) => {
          this.$refs.alert.showAlert({
            variant: "success",
            message: "Successfully updated user!",
            icon: "circle-check",
          });
          this.closeUserModal();
          this.fetchUsers();
        },
        (err) => {
          console.log(err.response);
        }
      );
    },
    closeUserModal() {
      this.action = null;
      this.$bvModal.hide("user_modal");
      this.form = {
        username: null,
        pw: null,
        fname: null,
        mname: null,
        lname: null,
      };
    },
    openUserModal(action, item) {
      this.action = action;
      this.$bvModal.show("user_modal");

      if (action == "ADD") {
        this.modalTitle = "ADD USER";
      }

      if (action == "EDIT") {
        this.modalTitle = "EDIT USER";
        this.selectedUserId = item.nvt_user_id;
        this.form = {
          username: item.username,
          pw: item.password,
          fname: item.firstname,
          mname: item.middlename,
          lname: item.lastname,
        };
      }
    },
    fetchUsers() {
      this.$store.dispatch("getAllUsers").then((_) => {
        this.users = this.getAllUsers;
      });
    },
  },
};
</script>
