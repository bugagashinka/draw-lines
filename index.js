const PX_UNITS = "px";
const PERC_UNITS = "%";
const BASE_ELEM = "div";
const LINE_STYLE = "line";

const rootElem = document.getElementById("root");
const params = {
  lines: [
    {
      background: "#03f",
      updateTime: 100,
      elements: [
        {
          background: "#03f",
          width: 25
        },
        {
          background: "#03f",
          width: 50
        },
        {
          background: "#03f",
          width: 25
        }
      ]
    }
  ]
};
function extend(ParentClass, ChildClass) {
  ChildClass.prototype = Object.create(ParentClass.prototype);
  ChildClass.prototype.constructor = ParentClass;
}

function Component(width, height, config) {
  this.width = width;
  this.height = height;
  this.background = config.background;
  this._compNode = document.createElement(BASE_ELEM);
  this._compNode.style.height = this.height;
  this._compNode.style.width = this.width;
  this._compNode.style.background = this.background;
}
Component.prototype.update = function() {};
Component.prototype.getNode = function() {
  return this._compNode;
};
Component.prototype.setColor = function(newColor) {
  this.color = newColor;
  this._compNode.style.background = newColor;
};
Component.prototype.addStyle = function(style) {
  this._compNode.classList.add(style);
};

function Line(width, height, config) {
  Component.call(this, width, height, config);
  this.updateTime = config.updateTime;
  this.subComponents = [];

  const subsHolder = new DocumentFragment();
  config.elements.forEach(compProto => {
    const comp = new Component(
      `${compProto.width}${PERC_UNITS}`,
      this.height,
      compProto
    );
    this.subComponents.push(comp);
    subsHolder.appendChild(comp.getNode());
  });
  this._compNode.appendChild(subsHolder);
  this.addStyle(LINE_STYLE);
}

extend(Component, Line);

Line.prototype.update = function() {
  this.setColor(generateColor());
  this.subComponents.forEach(comp => {
    comp.setColor(generateColor());
  });
};

const drawLines = ({ lines }) => {
  const lineHeight = `${window.innerHeight / lines.length}${PX_UNITS}`;
  const lineWidth = `${window.innerWidth}${PX_UNITS}`;

  const linesHolder = document.createDocumentFragment();

  lines.forEach(lineProto => {
    const line = new Line(lineWidth, lineHeight, lineProto);
    linesHolder.appendChild(line.getNode());
    setInterval(line.update.bind(line), line.updateTime);
  });

  rootElem.appendChild(linesHolder);
};

const generateColor = () =>
  "#" + (((1 << 24) * Math.random()) | 0).toString(16);

drawLines(params);
