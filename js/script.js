myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;

/** @type {CanvasRenderingContext2D} */
const ctx = myCanvas.getContext("2d");

const A = { x: 200, y: 150 };
const B = { x: 150, y: 250 };
const C = { x: 50, y: 100 };
const D = { x: 250, y: 200 };

let t = -1;

animate();

function animate() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

  drawLineWithLabelPoints(A, B, "A", "B");
  drawLineWithLabelPoints(C, D, "C", "D");

  const M = { x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t) };
  drawLabelPoint(M, "M", t < 0 || t > 1 ? "red" : "white");

  const N = { x: lerp(C.x, D.x, t), y: lerp(C.y, D.y, t) };
  drawLabelPoint(N, "N", t < 0 || t > 1 ? "red" : "white");

  t += 0.005;
  requestAnimationFrame(animate);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function drawLine(point1, point2) {
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
}

function drawLabelPoint(point, label, color = "white") {
  ctx.beginPath();
  // Draw the point
  ctx.fillStyle = color;
  ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Label the point
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 14px Arial";
  ctx.fillText(label, point.x, point.y);
}

function drawLineWithLabelPoints(point1, point2, label1, label2) {
  drawLine(point1, point2);
  drawLabelPoint(point1, label1);
  drawLabelPoint(point2, label2);
}
