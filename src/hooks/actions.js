/* eslint-disable no-param-reassign */
const draw = (context, currentColor, lineWidth, lastMousePosition, currentMousePosition) => {
  context.strokeStyle = currentColor.value;
  context.lineWidth = lineWidth.value;
  context.lineCap = 'round';

  context.beginPath();
  context.moveTo(lastMousePosition.x, lastMousePosition.y);
  context.lineTo(currentMousePosition.x, currentMousePosition.y);
  context.stroke();
};

const pushCurrentCanvasToHistory = (canvas, history) => {
  const base64Canvas = canvas.toDataURL();
  history.push(base64Canvas);
  if (history.length > 20) history.shift();
};

const undo = (canvas, context, history, future) => {
  const lastHistoryCanvas = new Image();

  if (history.length <= 1) return;

  future.push(history.pop());
  lastHistoryCanvas.src = history[history.length - 1];

  const renderCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(lastHistoryCanvas, 0, 0);
  };
  lastHistoryCanvas.onload = renderCanvas;
};

const redo = (canvas, context, history, future) => {
  const lastFutureCanvas = new Image();

  if (future.length <= 0) return;

  lastFutureCanvas.src = future[future.length - 1];
  history.push(future.pop());

  const renderCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(lastFutureCanvas, 0, 0);
  };
  lastFutureCanvas.onload = renderCanvas;
};

const saveAsPng = (canvas) => {
  const saveBtn = document.getElementById('save');
  const imageLink = canvas.toDataURL('image/png');

  // 設定 a tag 的 attrs 之後再開啟連結
  saveBtn.setAttribute('href', imageLink);
  saveBtn.setAttribute('download', 'canvas.png');
};

export {
  draw,
  undo,
  redo,
  saveAsPng,
  pushCurrentCanvasToHistory,
};
