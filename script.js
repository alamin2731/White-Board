// Initialize the whiteboard
var whiteboard = document.getElementById("whiteboard");
var context = whiteboard.getContext("2d");
context.lineWidth = 2;
var shapes = [];
var isDrawing = false;
var selectedShapeButton = null;

// Event listeners for drawing
whiteboard.addEventListener("mousedown", startDrawing);
whiteboard.addEventListener("mousemove", draw);
whiteboard.addEventListener("mouseup", stopDrawing);
whiteboard.addEventListener("mouseout", stopDrawing);

// Resize the canvas to match the device window
function resizeCanvasToWindow() {
    whiteboard.width = window.innerWidth;
    whiteboard.height = window.innerHeight;
    redraw();
}

// Attach resize event listener to window
window.addEventListener("resize", resizeCanvasToWindow);

// Call the resize function initially
resizeCanvasToWindow();

function startDrawing(e) {
    isDrawing = true;
    shapes.push({
        shape: selectedShapeButton.id,
        color: document.getElementById("colorSelect").value,
        intensity: getInkIntensity(),
        points: [{ x: e.offsetX, y: e.offsetY }]
    });
}

function draw(e) {
    if (!isDrawing) return;

    var currentShape = shapes[shapes.length - 1];
    currentShape.points.push({ x: e.offsetX, y: e.offsetY });

    redraw();
}

function redraw() {
    context.clearRect(0, 0, whiteboard.width, whiteboard.height);

    shapes.forEach(shape => {
        context.beginPath();

        switch (shape.shape) {
            case "lineBtn":
                // Draw line shape
                context.moveTo(shape.points[0].x, shape.points[0].y);
                context.lineTo(
                    shape.points[shape.points.length - 1].x,
                    shape.points[shape.points.length - 1].y
                );
                break;
            case "circleBtn":
                // Draw circle shape
                var radius = Math.sqrt(
                    Math.pow(shape.points[0].x - shape.points[shape.points.length - 1].x, 2) +
                    Math.pow(shape.points[0].y - shape.points[shape.points.length - 1].y, 2)
                );
                context.arc(shape.points[0].x, shape.points[0].y, radius, 0, Math.PI * 2);
                break;
            case "squareBtn":
                // Draw square shape
                var width = Math.abs(shape.points[0].x - shape.points[shape.points.length - 1].x);
                var height = Math.abs(shape.points[0].y - shape.points[shape.points.length - 1].y);
                context.rect(shape.points[0].x, shape.points[0].y, width, height);
                break;
            case "freeBtn":
                // Draw free writing shape
                context.moveTo(shape.points[0].x, shape.points[0].y);
                for (var i = 1; i < shape.points.length; i++) {
                    context.lineTo(shape.points[i].x, shape.points[i].y);
                }
                break;
            case "triangleBtn":
                // Draw triangle shape
                context.moveTo(shape.points[0].x, shape.points[0].y);
                context.lineTo(
                    shape.points[shape.points.length - 1].x,
                    shape.points[shape.points.length - 1].y
                );
                context.lineTo(shape.points[0].x, shape.points[shape.points.length - 1].y);
                context.closePath();
                break;
        }

        context.strokeStyle = shape.color;
        context.lineWidth = shape.intensity; // Use the stored intensity value for each shape
        context.stroke();
    });
}

function stopDrawing() {
    isDrawing = false;
}

function getInkIntensity() {
    return parseInt(document.getElementById("intensitySlider").value);
}

// Clear the whiteboard
var clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", clearWhiteboard);

function clearWhiteboard() {
    shapes = [];
    redraw();
}

// Save the whiteboard as PNG
var saveBtn = document.getElementById("saveBtn");
saveBtn.addEventListener("click", saveWhiteboard);

function saveWhiteboard() {
    var link = document.createElement("a");
    link.href = whiteboard.toDataURL("image/png");
    link.download = "whiteboard.png";
    link.click();
}

// Load a saved PNG to the whiteboard
var loadBtn = document.getElementById("loadBtn");
loadBtn.addEventListener("change", loadWhiteboard);

function loadWhiteboard() {
    var file = loadBtn.files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            context.clearRect(0, 0, whiteboard.width, whiteboard.height);
            context.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}

// Undo the last drawn shape
var undoBtn = document.getElementById("undoBtn");
undoBtn.addEventListener("click", undoShape);

function undoShape() {
    shapes.pop();
    redraw();
}

// Select a shape button
var shapeButtons = document.querySelectorAll(".shapeButton");
shapeButtons.forEach(button => {
    button.addEventListener("click", selectShape);
});

function selectShape(e) {
    shapeButtons.forEach(button => {
        button.classList.remove("selected");
    });

    selectedShapeButton = e.target.closest(".shapeButton");
    selectedShapeButton.classList.add("selected");
}