myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;

/** @type {CanvasRenderingContext2D} */
const ctx = myCanvas.getContext("2d");

const A = { x: 200, y: 150 };
const B = { x: 150, y: 250 };
const C = { x: 50, y: 100 };
const D = { x: 250, y: 200 };

const mouse = { x: 0, y: 0 };

let angle = 0;

document.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

animate();

function animate() {
  const radius = 50;
  A.x = mouse.x + Math.cos(angle) * radius;
  A.y = mouse.y - Math.sin(angle) * radius;
  B.x = mouse.x - Math.cos(angle) * radius;
  B.y = mouse.y + Math.sin(angle) * radius;
  angle += 0.02;

  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

  drawLineWithLabelPoints(A, B, "A", "B");
  drawLineWithLabelPoints(C, D, "C", "D");

  const I = getIntersection(A, B, C, D);
  drawLabelPoint(I, "I");

  requestAnimationFrame(animate);
}

function getIntersection(A, B, C, D) {
  /*
    Ix = Ax + (Bx - Ax)t = Cx + (Dx - Cx)u
    Iy = Ay + (By - Ay)t = Cy + (Dy - Cy)u

    Ax + (Bx - Ax)t = Cx + (Dx - Cx)u
    Subtract Cx from both sides to get:
    (Ax - Cx) + (Bx - Ax)t = (Dx - Cx)u
    
    Ay + (By - Ay)t = Cy + (Dy - Cy)u
    Subtract Cy from both sides to get:
    (Ay - Cy) + (By - Ay)t = (Dy - Cy)u
    Multiply both sides by (Dx - Cx) to get:
    (Dx - Cx)(Ay - Cy) + (Dx - Cx)(By - Ay)t = (Dy - Cy)(Dx - Cx)u
    Substitute (Ax - Cx) + (Bx - Ax)t for (Dx - Cx)u, to give:
    (Dx - Cx)(Ay - Cy) + (Dx - Cx)(By - Ay)t = (Dy - Cy)(Ax - Cx) + (Dy - Cy)(Bx - Ax)t
    Subtract (Dy - Cy)(Ax - Cx) and (Dx - Cx)(By - Ay)t, to give:
    (Dx - Cx)(Ay - Cy) - (Dy - Cy)(Ax - Cx) = (Dy - Cy)(Bx - Ax)t - (Dx - Cx)(By - Ay)t
    Factor t, to give:
    (Dx - Cx)(Ay - Cy) - (Dy - Cy)(Ax - Cx) = [(Dy - Cy)(Bx - Ax) - (Dx - Cx)(By - Ay)]t
    Divide by [(Dy - Cy)(Bx - Ax) - (Dx - Cx)(By - Ay)]t, to give:
    t = (Dx - Cx)(Ay - Cy) - (Dy - Cy)(Ax - Cx) / [(Dy - Cy)(Bx - Ax) - (Dx - Cx)(By - Ay)]

    Define t = top / bottom, where bottom != 0 (i.e. lines are parallel):
    top = (Dx - Cx)(Ay - Cy) - (Dy - Cy)(Ax - Cx)
    bottom = (Dy - Cy)(Bx - Ax) - (Dx - Cx)(By - Ay)
  */
  const top = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
  const t = top / bottom;

  return {
    x: lerp(A.x, B.x, t),
    y: lerp(A.y, B.y, t),
  };
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
