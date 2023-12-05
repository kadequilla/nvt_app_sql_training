<template>
  <div class="my-alert">
    <b-alert class="h-100" :show="show" :variant="variant">
      <div class="my-alert__titile text_size-md">
        <font-awesome-icon class="text_size-xl mr-2" :icon="['fas', icon]" />
        {{ message }}
      </div>
    </b-alert>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      variant: null,
      message: null,
      icon: "circle-exclamation",
    };
  },
  methods: {
    showAlert({ variant, message, icon }) {
      this.show = true;
      this.variant = variant;
      this.message = message;
      this.icon = icon ?? "circle-exclamation";

      setTimeout(() => {
        this.show = false;
      }, 5000);
    },
  },
};
</script>
<style lang="scss" scoped>
.my-alert {
  width: 400px;
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 20px;
  margin-right: 20px;
  z-index: 100000;

  &__titile {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
