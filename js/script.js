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

  if (I) {
    drawLabelPoint(I, "I");
  }

  requestAnimationFrame(animate);
}

/**
 * Calculates the intersection point of two line segments defined by points A, B, C, and D.
 *
 * To find the intersection point (Ix, Iy) of line segments AB and CD, we calculate the common denominator:
 *   denominator = (Dy - Cy)(Bx - Ax) - (Dx - Cx)(By - Ay)
 *
 * The formula for the denominator is derived as follows:
 *   1. Start with the system of equations for the intersection point (Ix, Iy):
 *      Ix = Ax + (Bx - Ax)tAB = Cx + (Dx - Cx)tCD
 *      Iy = Ay + (By - Ay)tAB = Cy + (Dy - Cy)tCD
 *   2. Rewrite the equations to isolate tAB and tCD on the left side:
 *      (Bx - Ax)tAB - (Cx - Ax) = (Dx - Cx)tCD
 *      (By - Ay)tAB - (Cy - Ay) = (Dy - Cy)tCD
 *   3. Divide both equations by (Dy - Cy) and (Dx - Cx) respectively:
 *      tAB = ((Bx - Ax)tAB - (Cx - Ax)) / (Dx - Cx)
 *      tCD = ((By - Ay)tAB - (Cy - Ay)) / (Dy - Cy)
 *   4. Combine both equations into a single equation by equating the right sides:
 *      ((Bx - Ax)tAB - (Cx - Ax)) / (Dx - Cx) = ((By - Ay)tAB - (Cy - Ay)) / (Dy - Cy)
 *   5. Cross-multiply to get rid of the denominators:
 *      ((Bx - Ax)tAB - (Cx - Ax))(Dy - Cy) = ((By - Ay)tAB - (Cy - Ay))(Dx - Cx)
 *   6. Expand the expressions:
 *      (Bx - Ax)(Dy - Cy)tAB - (Cx - Ax)(Dy - Cy) = (By - Ay)(Dx - Cx)tAB - (Cy - Ay)(Dx - Cx)
 *   7. Rearrange terms to isolate tAB:
 *      (Bx - Ax)(Dy - Cy)tAB - (By - Ay)(Dx - Cx)tAB = (Cx - Ax)(Dy - Cy) - (Cy - Ay)(Dx - Cx)
 *   8. Factor tAB out:
 *      tAB[(Bx - Ax)(Dy - Cy) - (By - Ay)(Dx - Cx)] = (Cx - Ax)(Dy - Cy) - (Cy - Ay)(Dx - Cx)
 *   9. Finally, divide both sides by [(Bx - Ax)(Dy - Cy) - (By - Ay)(Dx - Cx)] to obtain the denominator:
 *      denominator = (Dy - Cy)(Bx - Ax) - (Dx - Cx)(By - Ay)
 *
 * We also calculate `numeratorAB` (the numerator of tAB) and `numeratorCD` (the numerator of tCD):
 *
 * The formula for `numeratorAB` is derived as follows:
 *   1. Start with the system of equations for the intersection point (Ix, Iy):
 *      Ix = Ax + (Bx - Ax)tAB = Cx + (Dx - Cx)tCD
 *      Iy = Ay + (By - Ay)tAB = Cy + (Dy - Cy)tCD
 *   2. Subtract Cx and Cy from Ix and Iy equations respectively:
 *      Ix - Cx = (Bx - Ax)tAB = (Dx - Cx)tCD
 *      Iy - Cy = (By - Ay)tAB = (Dy - Cy)tCD
 *   3. Isolate tAB in the first equation and tCD in the second equation:
 *      tAB = (Ix - Cx) / (Bx - Ax) = (Dx - Cx)tCD
 *      tCD = (Iy - Cy) / (By - Ay) = (Dy - Cy)tCD
 *   4. Solve for numeratorAB by multiplying both sides by (Bx - Ax):
 *      numeratorAB = (Ix - Cx)(Bx - Ax) = (Dx - Cx)(Ix - Cx)
 *
 * The formula for `numeratorCD` is derived as follows:
 *   1. Start with the same system of equations for the intersection point (Ix, Iy).
 *   2. Subtract Ax and Ay from Ix and Iy equations respectively:
 *      Ix - Ax = (Bx - Ax)tAB = (Cx - Ax)tCD
 *      Iy - Ay = (By - Ay)tAB = (Cy - Ay)tCD
 *   3. Isolate tAB in the first equation and tCD in the second equation:
 *      tAB = (Ix - Ax) / (Bx - Ax) = (Cx - Ax)tCD
 *      tCD = (Iy - Ay) / (By - Ay) = (Cy - Ay)tCD
 *   4. Solve for numeratorCD by multiplying both sides by (Cy - Ay):
 *      numeratorCD = (Iy - Ay)(Cx - Ax) = (By - Ay)(Ix - Ax)
 *
 * If tAB and tCD are within the valid range [0, 1] for line segments and the denominator is not zero, the intersection point is within both line segments.
 *
 * @param {Object} A - The starting point of line segment AB.
 * @param {Object} B - The ending point of line segment AB.
 * @param {Object} C - The starting point of line segment CD.
 * @param {Object} D - The ending point of line segment CD.
 * @returns {Object|null} - The intersection point (Ix, Iy) or null if no intersection.
 */
function getIntersection(A, B, C, D) {
  // Calculate the common denominator
  const denominator = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  // Check if the lines are not parallel (denominator is not zero)
  if (denominator !== 0) {
    // Calculate numeratorAB (numerator of tAB)
    const numeratorAB = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);

    // Calculate numeratorCD (numerator of tCD)
    const numeratorCD = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);

    // Calculate tAB and tCD
    const tAB = numeratorAB / denominator;
    const tCD = numeratorCD / denominator;

    // Check if tAB and tCD are within the valid range [0, 1] for line segments
    if (tAB >= 0 && tAB <= 1 && tCD >= 0 && tCD <= 1) {
      // Calculate the intersection point (Ix, Iy)
      const Ix = A.x + (B.x - A.x) * tAB;
      const Iy = A.y + (B.y - A.y) * tAB;

      return {
        x: Ix,
        y: Iy,
        offset: tAB,
      };
    }
  }

  // If lines do not intersect or are parallel, return null
  return null;
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
