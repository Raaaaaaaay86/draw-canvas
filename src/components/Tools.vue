<template lang="pug">
div.tools#toolBar
  div(class="tools-btn" @click="toggleToolbar()")
    i(class=" fas fa-angle-down" v-if="toolbarIsShow")
    i(class=" fas fa-angle-up" v-else)
  div(class="pen" @click="isUsingPen = true" :class="isUsingPen ? 'active' : ''")
    i.fas.fa-paint-brush.fa-2x
  div(class="eraser" @click="useEraser()" :class="isUsingPen ? '' : 'active'")
    i.fas.fa-eraser.fa-2x
  div.size
    span size:
    input(type="number" class="size-input" v-model="LINE_WIDTH")
    span px
  div.colorMenu
    span COLOR:
    template(v-for="colorCode in colorList")
      div(
        class="colorMenu-color"
        :style="'background-color:' + colorCode"
        :class="isDark(colorCode) ? 'dark' : '' "
        @click="changeCurrentColor(colorCode, $event)"
      )
    div(class="colorBtn" @click="this.$refs.colorInput.click()")
    input(type="color" class="colorInput" ref="colorInput" @change="addNewColor($event)")
div(class="penIcon" id="penIcon" @click="toggleToolbar()")
    i.fas.fa-paint-brush.fa-2x
</template>

<script>
import { inject, reactive, ref } from 'vue';

export default {
  setup() {
    const toolbarIsShow = ref(true);
    const isUsingPen = ref(true);
    const CURRENT_COLOR = inject('CURRENT_COLOR');
    const LINE_WIDTH = inject('LINE_WIDTH');
    const colorList = reactive(['#FFFFFF', '#000000', '#9BFFCD', '#00CC99', '#01936F']);

    const toggleToolbar = () => {
      const toolBar = document.getElementById('toolBar');
      const penIcon = document.getElementById('penIcon');
      toolbarIsShow.value = !toolbarIsShow.value;

      if (toolbarIsShow.value) {
        penIcon.classList.toggle('show');
        setTimeout(() => toolBar.classList.toggle('hide'), 100);
        return;
      }

      setTimeout(() => penIcon.classList.toggle('show'), 100);
      toolBar.classList.toggle('hide');
    };

    const addNewColor = (e) => {
      const newColorCode = e.target.value;
      colorList.shift();
      colorList.push(newColorCode);
    };

    const changeCurrentColor = (selectColorCode, event) => {
      const colorMenuList = document.getElementsByClassName('colorMenu-color');
      colorMenuList.forEach((color) => color.classList.remove('active'));
      event.target.classList.add('active');

      isUsingPen.value = true;
      CURRENT_COLOR.value = selectColorCode;
    };

    const useEraser = () => {
      isUsingPen.value = false;
      CURRENT_COLOR.value = '#E8E8E8';
    };

    const isDark = (hexColor) => {
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return brightness < 100;
    };

    return {
      toolbarIsShow,
      toggleToolbar,
      colorList,
      addNewColor,
      changeCurrentColor,
      LINE_WIDTH,
      isUsingPen,
      useEraser,
      isDark,
    };
  },
};
</script>

<style lang="scss">
.penIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: -80px;
  left: 50%;
  width: 56px;
  height: 56px;
  background-color: #fff;
  box-shadow: 0px 4px 16px #00000029;
  border-radius: 50%;
  z-index: 300;
  transform: translateX(-50%);
  transition: all .6s;
  cursor: pointer;
  &.show {
    bottom: 40px;
  }
}

.tools {
  display: flex;
  align-items: center;
  position: fixed;
  left: 50%;
  bottom: 40px;
  padding: 19px 42px;
  background-color: #fff;
  border-radius: 50px;
  font-size: 20px;
  transform: translateX(-50%);
  user-select: none;
  z-index: 200;
  box-shadow: 0px 4px 16px #00000029;
  transition: all .6s;
  &.hide {
    bottom: -100px;
  }
  > div {
    &:nth-last-of-type(even) {
      margin: 0 43px;
    }
  }
  &-btn {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 50px;
    height: 50px;
    top: -20px;
    left: 50%;
    padding-top: 3px;
    border-radius: 50%;
    background-color: #fff;
    transform: translateX(-50%);
    z-index: 100;
    cursor: pointer;
  }
}

.size {
  display: flex;
  align-items: center;
  > span:first-of-type {
    text-transform: uppercase;
  }
  &-input {
    width: 74px;
    height: 48px;
    margin: 0 16px;
    font-size: 20px;
    border-radius: 50px;
    border:none;
    outline: none;
    text-align: center;
    background-color: #E8E8E8;
      &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
  }
}

.colorMenu {
  display: flex;
  align-items: center;
  position: relative;
  > span:first-of-type {
    margin-right: 16px;
  }
  &-color {
    position: relative;
    width: 48px;
    height: 48px;
    background: #cc0099;
    border: 2px solid #000;
    border-radius: 50%;
    cursor: pointer;
    &:nth-of-type(even) {
      margin: 0 8px;
    }
    &.active {
      color: #000;
      &::after {
        content: '✔';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      &.dark {
        color: #fff;
      }
    }
  }

}

.colorBtn {
  position: relative;
  width: 48px;
  height: 48px;
  margin: 0 8px;
  border: 4px solid black;
  border-radius: 50%;
  cursor: pointer;
  &::after {
    content: '+';
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 30px;
    font-weight: 800;
    transform: translate(-50%, -50%);
  }
}

.colorInput {
  visibility: hidden;
  position: absolute;
  right: 0;
}

.pen, .eraser {
  color: #E8E8E8;
  cursor: pointer;
  &.active {
    color: #000;
  }
}
</style>
