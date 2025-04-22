function OilPainting() {
  var canvas;
  var context;

  var width;
  var height;

  var startPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var prevPos = { x: window.innerWidth / 2, y: 0 };
  var dist = { x: 0, y: 0 };
  var colour = getGothicWhimsicalColor(0.15); // Initial color with 15% opacity

  var mouseTimeout; // To track when the mouse stops moving

  this.initialize = function () {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Pre-populate the background
    prepopulateBackground();

    canvas.addEventListener("mousemove", MouseMove, false);
    canvas.addEventListener("click", MouseDown, false);
    canvas.addEventListener("dblclick", MouseDbl, false);
  };

  // Function to generate a random gothic whimsical color
  function getGothicWhimsicalColor(opacity) {
    var category = Math.random();

    var r, g, b;

    if (category < 0.25) {
      var greyValue = Math.floor(Math.random() * 100); // Black and grey
      r = g = b = greyValue;
    } else if (category < 0.5) {
      var baseValue = Math.floor(Math.random() * 100); // Deep dark colors
      var variation = Math.floor(Math.random() * 50);
      r = baseValue + variation * (Math.random() < 0.33 ? 1 : 0);
      g = baseValue + variation * (Math.random() < 0.33 ? 1 : 0);
      b = baseValue + variation * (Math.random() < 0.33 ? 1 : 0);
    } else {
      r = Math.floor(Math.random() * 256); // Bright colors
      g = Math.floor(Math.random() * 256);
      b = Math.floor(Math.random() * 256);
      if (Math.random() < 0.5) {
        r = Math.min(255, r + 150);
        g = Math.min(255, g + 150);
        b = Math.min(255, b + 150);
      }
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  var prepopulateBackground = function () {
    const totalClusters = 150; // Total number of clusters
    const blackClusters = 20; // Number of black clusters

    // Helper function to draw a cluster
    function drawCluster(clusterX, clusterY, clusterSize, clusterColor) {
      context.fillStyle = clusterColor;
      context.strokeStyle = clusterColor;

      const shapesInCluster = Math.floor(Math.random() * 10) + 1; // 1-10 shapes per cluster

      for (let j = 0; j < shapesInCluster; j++) {
        const offsetX = (Math.random() - 0.5) * clusterSize * 10; // Tight grouping
        const offsetY = (Math.random() - 0.5) * clusterSize * 10;
        const x = clusterX + offsetX;
        const y = clusterY + offsetY;
        const size = Math.random() * clusterSize;

        context.lineWidth = Math.random() * size;

        const shapeType = Math.random();
        context.beginPath();

        if (shapeType < 0.4) {
          // Jagged line
          for (let k = 0; k < 5; k++) {
            context.lineTo(
              x + Math.random() * size * 20 - size * 10,
              y + Math.random() * size * 20 - size * 10
            );
          }
        } else if (shapeType < 0.7) {
          // Distorted circle
          const radiusX = size * 10 * Math.random();
          const radiusY = size * 10 * Math.random();
          context.ellipse(
            x,
            y,
            radiusX,
            radiusY,
            Math.random() * Math.PI,
            0,
            Math.PI * 2
          );
        } else {
          // Small polygon
          const sides = Math.floor(Math.random() * 5) + 3;
          const angleStep = (Math.PI * 2) / sides;
          const radius = size * 10;
          for (let k = 0; k < sides; k++) {
            const angle = k * angleStep;
            context.lineTo(
              x + radius * Math.cos(angle) + Math.random() * size * 2,
              y + radius * Math.sin(angle) + Math.random() * size * 2
            );
          }
        }

        context.closePath();
        context.stroke();
        context.fill();
      }
    }

    // Draw black clusters
    for (let i = 0; i < blackClusters; i++) {
      const clusterX = Math.random() * width;
      const clusterY = Math.random() * height;
      const clusterSize = Math.random() * 15;
      drawCluster(clusterX, clusterY, clusterSize, "rgba(0, 0, 0, 0.5)"); // Semi-transparent black
    }

    // Draw random color clusters
    for (let i = 0; i < totalClusters - blackClusters; i++) {
      const clusterX = Math.random() * width;
      const clusterY = Math.random() * height;
      const clusterSize = Math.random() * 15;
      const clusterColor = getGothicWhimsicalColor(0.3); // Slightly transparent colors
      drawCluster(clusterX, clusterY, clusterSize, clusterColor);
    }
  };

  var MouseMove = function (e) {
    clearTimeout(mouseTimeout); // Reset the timeout each time the mouse moves

    mouseTimeout = setTimeout(() => {
      // Change the color if the mouse stops moving for half a second
      colour = getGothicWhimsicalColor(0.5);
      console.log("Color changed to:", colour);
    }, 500); // 0.5 -second delay

    var distance = Math.sqrt(
      Math.pow(prevPos.x - startPos.x, 2) +
      Math.pow(prevPos.y - startPos.y, 2)
    );

    var size = Math.random() * 15 / distance; // Adjust size based on distance

    dist.x = (prevPos.x - startPos.x) * Math.sin(0.5) + startPos.x;
    dist.y = (prevPos.y - startPos.y) * Math.cos(0.5) + startPos.y;

    startPos.x = prevPos.x;
    startPos.y = prevPos.y;

    prevPos.x = e.layerX;
    prevPos.y = e.layerY;

    // ------- Draw -------
    context.lineWidth = Math.random() * size;
    context.strokeWidth = Math.random() * size;
    context.fillStyle = colour;
    context.strokeStyle = colour;

    // Randomly choose a shape
    var shapeType = Math.random();
    context.beginPath();

    if (shapeType < 0.4) {
      // Draw a jagged line
      for (let i = 0; i < 5; i++) {
        context.lineTo(
          prevPos.x + Math.random() * size * 20 - size * 10,
          prevPos.y + Math.random() * size * 20 - size * 10
        );
      }
    } else if (shapeType < 0.7) {
      // Draw a distorted circle (ellipse)
      var radiusX = size * 10 * Math.random();
      var radiusY = size * 10 * Math.random();
      context.ellipse(
        prevPos.x,
        prevPos.y,
        radiusX,
        radiusY,
        Math.random() * Math.PI,
        0,
        Math.PI * 2
      );
    } else {
      // Draw a small polygon
      var sides = Math.floor(Math.random() * 5) + 3; // Random number of sides (3-7)
      var angleStep = (Math.PI * 2) / sides;
      var radius = size * 10;
      for (let i = 0; i < sides; i++) {
        var angle = i * angleStep;
        context.lineTo(
          prevPos.x + radius * Math.cos(angle) + Math.random() * size * 2,
          prevPos.y + radius * Math.sin(angle) + Math.random() * size * 2
        );
      }
    }

    context.closePath();
    context.stroke();
    context.fill();
  };

  var MouseDown = function (e) {
    e.preventDefault();
    colour = getGothicWhimsicalColor(0.5); // Change color on click
    context.fillStyle = colour;
    context.strokeStyle = colour;
  };

  var MouseDbl = function (e) {
    e.preventDefault();
    context.clearRect(0, 0, width, height);
  };
}

var app = new OilPainting();
app.initialize();
