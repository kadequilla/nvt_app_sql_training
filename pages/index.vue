<template>
  <div class="d-flex">
    <!-- LEFT PANEL -->
    <div class="left-panel bg-dark w-100 text-white">
      <div class="left-panel__title">
        Inventory Demo App <br />
        Upskill: SQL Training
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="right-panel h-100 w-75">
      <div class="right-panel__login">
        <b-form class="login-form" @submit="doLogin">
          <div class="text-center text_size-lg mb-3">Login</div>
          <b-form-input
            class="mb-2 text_size-md"
            type="text"
            placeholder="Username"
            required
            v-model="username"
          ></b-form-input>
          <b-form-input
            class="mb-2 text_size-md"
            type="password"
            placeholder="Password"
            required
            v-model="password"
          ></b-form-input>
          <b-button class="w-100 text_size-md" type="submit" variant="primary">
            Submit
          </b-button>
        </b-form>
      </div>
    </div>

    <!-- ALERT -->
    <alert ref="alert" />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },

  methods: {
    doLogin(e) {
      e.preventDefault();

      axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/login`,
        data: {
          username: this.username,
          password: this.password,
        },
      }).then(
        (res) => {
          const user = res.data;
          sessionStorage.user_full_name = `${user[0].ret_firstname} ${user[0].ret_lastname}`;
          sessionStorage.isLoggedIn = true;
          sessionStorage.userId = user[0].ret_id;
          this.$router.push({ path: "admin/user" });
        },
        (err) => {
          this.$refs.alert.showAlert({ variant: "danger", message: err.response.data });
        }
      );
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.left-panel {
  height: 100vh;
  &__title {
    font-size: 64px;
    margin: 24% 12% 0 12%;
  }
}

.right-panel {
  &__login {
    margin: 32% 20% 0 20%;
    border: 1px solid #c6c6c6;
  }
}
.login-form {
  padding: 64px;
}
</style>
