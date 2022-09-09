const myCanvas = new fabric.Canvas("demoCanvas", {
  width: window.innerWidth - 200,
  height: window.innerHeight - 100,
  backgroundColor: "white",
  isDrawingMode: false,
});

const toggleDraw = () => {
  myCanvas.set({ isDrawingMode: !myCanvas.get("isDrawingMode") });
};

const createRectangle = () => {
  const rectangle = new fabric.Rect({
    width: 200,
    height: 100,
  });
  myCanvas.add(rectangle);
};

const createSquare = () => {
  const square = new fabric.Rect({
    width: 100,
    height: 100,
  });
  myCanvas.add(square);
};
const createCircle = () => {
  const circle = new fabric.Circle({
    radius: 100,
    fill: "",
    stroke: "red",
    strokeWidth: 3,
    originX: "center",
    originY: "center",
  });
  myCanvas.add(circle);
};
const createTextbox = () => {
  const textbox = new fabric.Textbox("Hello World", {
    width: 400,
  });
  myCanvas.add(textbox);
};

const deleteObject = () => {
  if (myCanvas.getActiveObject()) {
    myCanvas.remove(myCanvas.getActiveObject());
  }
};
