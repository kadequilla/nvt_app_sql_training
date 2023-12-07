<template>
  <div>
    <div class="sidebar">
      <a href="#">
        <div class="brand w-100">
          <b class="text_size-lg"
            >Lou Geh <br />Hardware
            <font-awesome-icon
              class="text_size-lg"
              :icon="['fas', 'screwdriver-wrench']"
            />
          </b>
        </div>
      </a>

      <!-- parent menu -->
      <ul class="pt-2">
        <li class="menu" v-for="menu in menus" @click="onClickParentMenu(menu)">
          <div :class="`menu__title ml-5  ${menu.isLogout ? 'menu_hoverable mt-5' : ''}`">
            {{ menu.menuTitle }}
          </div>
          <!-- child menu admin -->
          <ul class="mt-3">
            <li
              :class="getMenuStyleClass(child)"
              v-for="child in menu.childMenus"
              @click="onClickChildMenu(child)"
            >
              <div class="menu__child__title mb-3">{{ child.childTitle }}</div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <nuxt />
  </div>
</template>
<script>
export default {
  data() {
    return {
      menus: [
        {
          menuTitle: "Admin",
          childMenus: [
            { key: "1", childTitle: "User", active: false, route: "/admin/user" },
            { key: "2", childTitle: "Module", active: false, route: "/admin/module" },
            {
              key: "3",
              childTitle: "Product Group",
              active: false,
              route: "/admin/product-group",
            },
            { key: "4", childTitle: "Product", active: false, route: "/admin/product" },
          ],
        },
        {
          menuTitle: "Transaction",
          childMenus: [
            {
              key: "6",
              childTitle: "Goods Receive",
              active: false,
              route: "/transaction/goods-receive",
            },
            {
              key: "7",
              childTitle: "Sales Invoice",
              active: false,
              route: "/transaction/sales-invoice",
            },
          ],
        },
        {
          menuTitle: "Reports",
          childMenus: [
            {
              key: "8",
              childTitle: "Stockard",
              active: false,
              route: "/reports/stockard",
            },
          ],
        },
        { menuTitle: "Logut", isLogout: true },
      ],
    };
  },

  created() {
    if (!sessionStorage.isLoggedIn || !sessionStorage.userId) {
      this.$router.push({ path: "/" });
      return;
    }

    //on reload set to active selected previous menu
    this.menus.forEach((menu) => {
      menu.childMenus?.forEach((child) => {
        if (child.key == sessionStorage.selectedMenuKey) {
          this.setActiveMenu(child);
        }
      });
    });
  },

  methods: {
    onClickParentMenu(menu) {
      if (menu.isLogout) {
        sessionStorage.clear();
        this.$router.push({ path: "/" });
      }
    },
    onClickChildMenu(childMenu) {
      this.setActiveMenu(childMenu);
      //set to session selected menus
      sessionStorage.selectedMenuKey = childMenu.key;
      this.$router.push({ path: childMenu.route });
    },

    setActiveMenu(childMenu) {
      this.unSelectMenu();
      childMenu.active = true;
      this.getMenuStyleClass(childMenu);
    },
    getMenuStyleClass(childMenu) {
      if (childMenu.active) {
        return "menu__child active-menu";
      } else {
        return "menu__child";
      }
    },
    unSelectMenu() {
      this.menus.forEach((menu) => {
        menu.childMenus?.forEach((child) => {
          child.active = false;
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.sidebar {
  position: absolute;
  top: 0;
  width: 250px;
  border-right: 1px double #d4d4d4;
  height: 100vh;
}
a {
  text-decoration: none;
  color: black;
}
ul {
  list-style-type: none;
}

.brand {
  margin: 50px 5px 16px 38px;
  color: #007bff;
}

.menu {
  cursor: pointer;
  padding: 8px 0 8px 0;
  &__title {
    font-size: 18px;
    font-weight: 500;
  }
  &__child {
    margin-left: 48px;
    &__title {
      font-size: 14px;
    }
    &:hover {
      text-shadow: 4px 4px 7px rgba(0, 0, 0, 0.25);
      font-weight: bold;
    }
  }
}

.menu_hoverable {
  &:hover {
    text-shadow: 4px 4px 7px rgba(0, 0, 0, 0.25);
    font-weight: bold;
  }
}

.active-menu {
  text-shadow: 4px 4px 7px rgba(0, 0, 0, 0.25);
  font-weight: bold;
}
</style>
