myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;

const A = { x: 200, y: 150 };
const B = { x: 150, y: 250 };
const C = { x: 50, y: 100 };
const D = { x: 250, y: 200 };

/** @type {CanvasRenderingContext2D} */
const ctx = myCanvas.getContext("2d");

function drawLine(point1, point2) {
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
}

function drawEndpoint(point, label) {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Label the endpoint
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 14px Arial";
  ctx.fillText(label, point.x, point.y);
}

function drawLineWithEndpoints(point1, point2, label1, label2) {
  drawLine(point1, point2);
  drawEndpoint(point1, label1);
  drawEndpoint(point2, label2);
}

drawLineWithEndpoints(A, B, "A", "B");
drawLineWithEndpoints(C, D, "C", "D");

// // Draw the lines
// drawLine(A, B); // First line
// drawLine(C, D); // Second line

// // Draw the endpoints
// drawEndpoint(A, "A");
// drawEndpoint(B, "B");
// drawEndpoint(C, "C");
// drawEndpoint(D, "D");
