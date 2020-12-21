<template lang="pug">
Navbar
canvas#canvas
Tools
</template>

<script>
import Tools from '@/components/Tools.vue';
import Navbar from '@/components/Navbar.vue';
import {
  draw,
  undo,
  redo,
  saveAsPng,
  pushCurrentCanvasToHistory,
} from '@/hooks/actions';
import {
  onMounted,
  provide,
  reactive,
  ref,
} from 'vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Tools,
  },
  setup() {
    const lineWidth = ref(10);
    const isMouseDown = ref(false);
    const UsingTool = ref('pen');
    const currentColor = ref('#000');
    const lastMousePosition = reactive({
      x: 0,
      y: 0,
    });
    const currentMousePosition = reactive({
      x: 0,
      y: 0,
    });

    provide('LINE_WIDTH', lineWidth);
    provide('CURRENT_COLOR', currentColor);
    provide('USING_TOOL', UsingTool);

    onMounted(() => {
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');
      const history = [];
      const future = [];
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // 繪畫功能
      canvas.addEventListener('mousedown', (e) => {
        lastMousePosition.x = e.clientX;
        lastMousePosition.y = e.clientY;
        isMouseDown.value = true;
      });

      canvas.addEventListener('mousemove', (e) => {
        if (!isMouseDown.value) return;
        currentMousePosition.x = e.clientX;
        currentMousePosition.y = e.clientY;
        if (UsingTool.value === 'eraser') {
          draw(context, { value: '#E8E8E8' }, lineWidth, lastMousePosition, currentMousePosition, UsingTool);
        } else {
          draw(context, currentColor, lineWidth, lastMousePosition, currentMousePosition, UsingTool);
        }
        lastMousePosition.x = currentMousePosition.x;
        lastMousePosition.y = currentMousePosition.y;
      });

      canvas.addEventListener('mouseup', () => {
        lastMousePosition.x = currentMousePosition.x;
        lastMousePosition.y = currentMousePosition.y;
        isMouseDown.value = false;
        pushCurrentCanvasToHistory(canvas, history);
      });

      // ToolBar 功能 (save, clearAll, undo, redo)
      const clearAllBtn = document.getElementById('clearAll');
      const undoBtn = document.getElementById('undo');
      const redoBtn = document.getElementById('redo');
      const saveBtn = document.getElementById('save');
      document.addEventListener('click', (event) => {
        if (clearAllBtn.contains(event.target)) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          history.length = 0;
          future.length = 0;
          return;
        }

        if (undoBtn.contains(event.target)) {
          undo(canvas, context, history, future);
          return;
        }

        if (redoBtn.contains(event.target)) {
          redo(canvas, context, history, future);
          return;
        }

        if (saveBtn.contains(event.target)) {
          saveAsPng(canvas);
        }
      });
    });
  },
};
</script>

<style lang="scss">
canvas {
  position: absolute;
  background-color:#E8E8E8;
  z-index: 100;
}
</style>
