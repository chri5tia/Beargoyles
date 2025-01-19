function OilPainting() {

  var canvas;
  var context;

  var width;
  var height;

  var startPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var prevPos = { x: window.innerWidth / 2, y: 0 };
  var dist = { x: 0, y: 0 };
  var colour = getGothicWhimsicalColor(0.15); // Generate initial color with 15% opacity

  this.initialize = function () {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    canvas.addEventListener('mousemove', MouseMove, false);
    canvas.addEventListener('click', MouseDown, false);
    canvas.addEventListener('dblclick', MouseDbl, false);
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

  var MouseMove = function (e) {
    var distance = Math.sqrt(Math.pow(prevPos.x - startPos.x, 2) +
      Math.pow(prevPos.y - startPos.y, 2));

    var size = (Math.random() * (15 * 2)) / distance; // Keep size multiplier

    dist.x = (prevPos.x - startPos.x) * Math.sin(0.5) + startPos.x;
    dist.y = (prevPos.y - startPos.y) * Math.cos(0.5) + startPos.y;

    startPos.x = prevPos.x;
    startPos.y = prevPos.y;

    prevPos.x = (e.layerX);
    prevPos.y = (e.layerY);

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
        prevPos.x, prevPos.y,
        radiusX, radiusY,
        Math.random() * Math.PI, 0, Math.PI * 2
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
    colour = getGothicWhimsicalColor(0.5); // Generate a new random color with 50% opacity
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
