import React, {Component} from "react";
import {Emitter} from "../raycast/Emitter";
import {CircleOps} from "./CircleOps";
import {BLUE, PURPLE, YELLOW} from "./colors";
import {
  AboutPopup,
  ABOUT_POPUP_ID,
  BottomToolbar,
  Circle,
  CIRCLE_ID_PREFIX,
  CLEAR_BUTTON_ID,
  CLOSE_BUTTON_ID,
  CursorOverlay,
  ExamplePopup,
  EXAMPLE_POPUP_ID,
  GITHUB_BUTTON_ID,
  Logo,
  NEW_BUTTON_ID,
  OPEN_BUTTON_ID,
  STAR_BUTTON_ID,
  Svg,
  TextRotator,
} from "./components";

import "./main.css";

//import './styles/main.less';

const GITHUB_URL = "https://github.com/dkozar/raycast-dom";
const STARS_URL = GITHUB_URL + "/stargazers";

function getCircleId(circleElement) {
  return parseInt(circleElement.id.split("-")[1]);
}

// @see https://github.com/dkozar/edriven-gui/blob/master/eDriven/eDriven.Core/Geom/Point.cs

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  add(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }
  subtract(other) {
    return new Point(this.x - other.x, this.y - other.y);
  }
  toObject() {
    return {
      x: this.x,
      y: this.y,
    };
  }
  static fromObject(obj) {
    return new Point(obj.x, obj.y);
  }
}

export class App extends Component<any, any> {
  canvasRef = React.createRef<any>();
  rootRef = React.createRef<any>();

  //<editor-fold desc="Constructor">
  constructor(props) {
    super(props);

    this.state = {
      circles: [
        {
          x: 150,
          y: 500,
          r: 100,
          color: BLUE,
        },
        {
          x: 700,
          y: 250,
          r: 150,
          color: YELLOW,
        },
        {
          x: 800,
          y: 700,
          r: 80,
          color: PURPLE,
        },
      ],
      hoveredCircleIndex: -1,
      selectedCircleIndex: -1,
      draggedCircleIndex: -1,
      popupVisible: ABOUT_POPUP_ID as string | boolean,
      mousePosition: {
        x: 0,
        y: 0,
      },
      mouseIsDown: false,
      isTouch: false,
      dragOrigin: undefined as any,
      delta: undefined as any
    };

    this.executeCommand = this.executeCommand.bind(this);

    // Raycast Emitter subscription
    Emitter.getInstance().connect({
      onMouseOver: this.onMouseOver.bind(this), // circle mouse over
      onMouseOut: this.onMouseOut.bind(this), // circle mouse out
      onMouseMove: this.onMouseMove.bind(this), // drawing circles with Alt key
      onMouseDown: this.onMouseDown.bind(this), // drawing circles
      onMouseUp: this.onMouseUp.bind(this), // stop drawing circles with Alt key
      onClick: this.onClick.bind(this), // button clicks
      onKeyDown: this.onKeyDown.bind(this), // stop dragging
      onKeyUp: this.onKeyUp.bind(this), // closing dialog
      onTouchStart: this.onTouchStart.bind(this), // new circle
      onTouchEnd: this.onTouchEnd.bind(this),
      onTouchMove: this.onTouchMove.bind(this),
    });
  }

  onMouseOver(ray) {
    var circle = ray.intersectsId(CIRCLE_ID_PREFIX),
      circleId,
      circleIndex;

    if (circle) {
      // circle mouse over
      circleId = circle.id;
      circleIndex = parseInt(circleId.split(CIRCLE_ID_PREFIX)[1]);
      this.setState({
        hoveredCircleIndex: circleIndex,
      });
    }
  }

  onMouseOut(ray) {
    var circle = ray.intersectsId(CIRCLE_ID_PREFIX);

    if (circle) {
      // circle mouse over
      this.setState({
        hoveredCircleIndex: -1,
      });
    }
  }

  //<editor-fold desc="Mouse/touch down">
  handleMouseOrTouchDown(ray, isTouch?) {
    var self = this;
    var circle;
    var circleId;
    var circleIndex;

    this.setState({
      // immediately reset cursor overlay
      mouseIsDown: true,
      isTouch,
    });

    if (this.state.popupVisible) {
      // popup is visible
      if (!ray.intersectsId(EXAMPLE_POPUP_ID) && !ray.intersectsId(ABOUT_POPUP_ID)) {
        // clicked outside the popup
        this.setState({
          popupVisible: false,
        });
      }
      return; // return because popup currently visible
    }

    if (!ray.intersects(this.canvasRef.current)) {
      return; // clicked outside the canvas
    }

    circle = ray.intersectsId(CIRCLE_ID_PREFIX);

    // circle mouse down
    if (circle) {
      circleId = circle.id;
      circleIndex = parseInt(circleId.split(CIRCLE_ID_PREFIX)[1]);
      this.setState(
        {
          selectedCircleIndex: circleIndex,
          draggedCircleIndex: circleIndex,
          dragOrigin: ray.position,
        },
        function() {
          self.executeCommand("bring-to-front");
          self.selectCircleOnTop();
        },
      );
      return;
    }

    // canvas mouse down
    this.setState(
      {
        mousePosition: ray.position,
        selectedCircleIndex: -1,
        draggedCircleIndex: -1,
      },
      function() {
        if (ray.e.shiftKey) {
          // Shift + click = clear screen
          self.executeCommand("clear");
        }
        self.executeCommand("new-circle"); // create new circle
        self.selectCircleOnTop(); // select it
      },
    );
  }

  onMouseDown(ray) {
    this.handleMouseOrTouchDown(ray);
  }

  onTouchStart(ray) {
    var touch = ray.e.changedTouches[0];

    ray.position = {
      x: touch.clientX,
      y: touch.clientY,
    };
    this.handleMouseOrTouchDown(ray, true);
  }
  //</editor-fold>

  //<editor-fold desc="Mouse/touch up">
  handleMouseOrTouchUp(ray, isTouch?) {
    if (this.state.delta) {
      // save positions
      CircleOps.executeCommand("move", this.state.circles, null, this.state.delta);
    }
    this.setState({
      mouseIsDown: false,
      draggedCircleIndex: -1,
      delta: null,
    });
  }

  onMouseUp(ray) {
    this.handleMouseOrTouchUp(ray);
  }

  onTouchEnd(ray) {
    this.handleMouseOrTouchUp(ray, true);
  }
  //</editor-fold>

  //<editor-fold desc="Mouse/touch move">
  handleMouseOrTouchMove(ray, isTouch?) {
    var self = this,
      position = ray.position;

    // nothing to do here
    if (!this.state.mouseIsDown) {
      return;
    }

    // Alt + mouse move = new circle
    if (!isTouch && ray.e.altKey && ray.intersects(this.rootRef.current)) {
      this.setState(
        {
          mousePosition: position,
        },
        function() {
          self.executeCommand("new-circle");
        },
      );
      return;
    }

    // clicking and dragging a single circle moves all the circles
    if (this.state.draggedCircleIndex > -1) {
      this.setState({
        delta: Point.fromObject(position).subtract(this.state.dragOrigin),
      });
    }
  }

  onMouseMove(ray) {
    this.handleMouseOrTouchMove(ray);
  }

  onTouchMove(ray) {
    var touch = ray.e.changedTouches[0];

    ray.position = {
      x: touch.clientX,
      y: touch.clientY,
    };
    this.handleMouseOrTouchMove(ray, true);
    ray.preventDefault(); // don't bounce the screen on iOS
  }
  //</editor-fold>

  onClick(ray) {
    var self = this;

    if (ray.intersectsId(NEW_BUTTON_ID)) {
      self.executeCommand("random-circle");
    } else if (ray.intersectsId(CLEAR_BUTTON_ID)) {
      self.executeCommand("clear");
    } else if (ray.intersectsId(OPEN_BUTTON_ID)) {
      self.setState({
        popupVisible: EXAMPLE_POPUP_ID,
      });
    } else if (ray.intersectsId(CLOSE_BUTTON_ID)) {
      self.setState({
        popupVisible: false,
      });
    } else if (ray.intersectsId(GITHUB_BUTTON_ID)) {
      window.open(GITHUB_URL, "_blank");
    } else if (ray.intersectsId(STAR_BUTTON_ID)) {
      window.open(STARS_URL, "_blank");
    }
  }

  onKeyDown(ray) {
    if (ray.e.key === "Escape") {
      // stop dragging circles
      this.setState({
        draggedCircleIndex: -1,
        delta: null,
      });
    }
  }

  onKeyUp(ray) {
    if (ray.e.key === "Escape") {
      // close the popup
      this.setState({
        popupVisible: false,
      });
    }
  }
  //</editor-fold>

  //<editor-fold desc="Circles & commands">
  selectCircle(circleElement) {
    //@ts-ignore
    this.state.selectedCircleIndex = getCircleId(circleElement);
  }

  selectCircleOnTop() {
    this.setState({
      selectedCircleIndex: this.state.circles.length - 1,
    });
  }

  executeCommand(command) {
    var position, circles;

    position = this.state.mousePosition;
    circles = CircleOps.executeCommand(command, this.state.circles, this.state.selectedCircleIndex, position);
    this.setState({circles});
  }
  //</editor-fold>

  //<editor-fold desc="React">
  render() {
    var self = this,
      delta = self.state.delta,
      index = 0,
      circles = this.state.circles.map(function(item) {
        var id = CIRCLE_ID_PREFIX + index,
          coords,
          circle;

        if (delta) {
          coords = Point.fromObject(item)
            .add(delta)
            .toObject();
        }

        circle = (
          <Circle
            {...item}
            {...coords}
            id={id}
            key={id}
            strokeColor="white"
            hovered={self.state.hoveredCircleIndex === index}
            selected={self.state.selectedCircleIndex === index}
          />
        );

        index++;
        return circle;
      }),
      popup =
        (this.state.popupVisible === ABOUT_POPUP_ID && <AboutPopup />) ||
        (this.state.popupVisible === EXAMPLE_POPUP_ID && <ExamplePopup />),
      cursorOverlay = this.state.mouseIsDown && !this.state.isTouch && this.state.draggedCircleIndex > -1 && <CursorOverlay />;

    return (
      <div ref={this.rootRef}>
        <div ref={this.canvasRef} className="container">
          <Logo />
          <Svg width="100%" height="100%">
            {circles}
          </Svg>
          <TextRotator />
        </div>
        <BottomToolbar />
        {popup}
        {cursorOverlay}
      </div>
    );
  }
}
