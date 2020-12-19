<template lang="pug">
div.navbar#navbar
  div(class="navbar-btn" @click="toggleNavbar()")
    i(class="fas fa-angle-up" v-if="navbarIsShow")
    i(class="fas fa-angle-down" v-else)
  a.navbar-item#save
    i.fas.fa-save.fa-2x
    span save
  div.navbar-item#clearAll
    i.fas.fa-expand.fa-2x
    span clear all
  div.navbar-item#undo
    i.fas.fa-reply.fa-2x
    span undo
  div.navbar-item#redo
    i.fas.fa-share.fa-2x
    span redo
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const navbarIsShow = ref(true);

    const toggleNavbar = () => {
      const navbar = document.getElementById('navbar');
      navbarIsShow.value = !navbarIsShow.value;
      navbar.classList.toggle('hide');
    };

    return {
      toggleNavbar,
      navbarIsShow,
    };
  },
};
</script>

<style lang="scss">
.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  padding: 16px 0;
  position: absolute;
  top: 0;
  background-color: #fff;
  text-transform: uppercase;
  z-index: 200;
  user-select: none;
  transition: all .6s;
  &.hide {
    top: -70px;
  }
  &-btn {
    position: absolute;
    width: 50px;
    height: 50px;
    bottom: -20px;
    left: 50%;
    padding-top: 3px;
    border-radius: 50%;
    background-color: #fff;
    transform: translateX(-50%);
    z-index: 100;
    cursor: pointer;
    > i {
      font-size: 20px;
      position: absolute;
      left: 50%;
      bottom: 0px;
      transform: translateX(-50%);
    }
  }
  > .navbar-item {
    display: flex;
    align-items: center;

    font-size: 20px;
    z-index: 300;
    cursor: pointer;
    &:nth-of-type(even) {
      margin: 0 43px;
    }
    > i {
      margin-right: 16px;
    }
  }
}

a.navbar-item {
  text-decoration: none;
  color: inherit;
}
</style>
