
const partial = (func, ...boundArgs) => (...remainingArgs) => func(...boundArgs, ...remainingArgs);

function findLastValue(iterable = new Array(0), predicate) {
    var index = iterable.length
    while (index--) {
      if (predicate(iterable[index])) {
        return iterable[index]
      }
    }
    return undefined
  }

  

const remove = (arr, value) => arr.filter((ele) =>ele != value);


 const BLANK_STRING = ' ';

/**
 * Checks whether the substring is present within element className
 * @param sub Substring to check for
 * @param element DOM element
 * @returns {*|boolean}
 */
export function evaluateClassName(sub, element) {
    var className = BLANK_STRING + element.className + BLANK_STRING;

    sub = BLANK_STRING + sub + BLANK_STRING;
    return className && className.indexOf(sub) > -1;
}

/**
 * Checks whether the element ID is equal to ID
 * @param id ID to check for
 * @param element DOM element
 * @returns {*|boolean}
 */
export function equalID (id: HTMLElement["id"], element: HTMLElement) {
    return id === element.id;
}


class DomUtil {

    static buildPath(parentElement, childElement) {
        var path: Node[] = []
        var node: Node;

        path.push(childElement);

        if (childElement === parentElement) {
            return path;
        }

        node = childElement.parentNode;

        while (node != null) {
            path.push(node);
            if (node === parentElement) {
                return path;
            }
            node = node.parentNode;
        }
        return false; // not a real path
    }
}

export class EmitterBase {
    slots: any[];
    //<editor-fold desc="Constructor">
    constructor() {
        this.slots = [];
    }
    //</editor-fold>

    //<editor-fold desc="Connect/disconnect">
    // TODO: slot v2.0 should contain:
    // slot = {
    //     handlers, // current slot data
    //     elements, // array od elements to check for intersection before emitting a ray
    //     phase, // capture/bubbling phase
    //     useDetachedRays // fire detached rays
    // }
    connect(slot) {
        var len;

        if (this.isConnected(slot)) {
            return;
        }
        len = this.slots.length;
        this.slots.push(slot);
        this.handleSubscription(len, this.slots.length);
    }

    disconnect(slot) {
        var len = this.slots.length;

        remove(this.slots, function(subscriber) {
            return subscriber === slot;
        });
        this.handleSubscription(len, this.slots.length);
    }

    isConnected(slot) {
        return this.slots.some(function(subscriber) {
            return subscriber === slot;
        });
    }
    //</editor-fold>

    //<editor-fold desc="Subscription">
    /**
     * Abstract
     * @param previousCount
     * @param nextCount
     */
    handleSubscription(previousCount, nextCount) {
        // abstract
    }
    //</editor-fold>

    //<editor-fold desc="Emitting">
    createRayAndEmit(handlerName, root, e) {
        var ray;

        e = e || window.event;

        ray = new Ray(e, root, {
            x: e.clientX,
            y: e.clientY
        });

        this.emit(handlerName, ray);
    }

    emit(handlerName, ray) {
        var handler;

        this.slots.forEach(function(slot) {
            if (slot) { // might be undefined because firing some handlers could disconnect others (recursion)
                handler = slot[handlerName];

                // useDetachedRays - a switch *per slot object* (with false as default)
                if (ray && !ray.isAttached() && !slot.useDetachedRays) {
                    console.warn('Ray has been detached', ray.toString());
                    return false;
                }

                // TODO: if slot connected providing the 'elements' array, check for intersections of ray and any of the element. Emit only when intersection exists.
                if (handler) {
                    handler(ray);
                }
            }
        });
    }
    //</editor-fold>
}

// [event name, event handler name]
const ON_MOUSE_OVER = ['mouseover', 'onMouseOver'],
    ON_MOUSE_OUT = ['mouseout', 'onMouseOut'],
    ON_MOUSE_ENTER = ['mouseenter', 'onMouseEnter'],
    ON_MOUSE_LEAVE = ['mouseleave', 'onMouseLeave'],
    ON_MOUSE_DOWN = ['mousedown', 'onMouseDown'],
    ON_MOUSE_UP = ['mouseup', 'onMouseUp'],
    ON_MOUSE_MOVE = ['mousemove', 'onMouseMove'],
    ON_CLICK = ['click', 'onClick'],
    ON_DOUBLE_CLICK = ['doubleclick', 'onDoubleClick'],
    ON_CONTEXT_MENU = ['contextmenu', 'onContextMenu'],
    ON_TOUCH_START = ['touchstart', 'onTouchStart'],
    ON_TOUCH_END = ['touchend', 'onTouchEnd'],
    ON_TOUCH_MOVE = ['touchmove', 'onTouchMove'],
    ON_TOUCH_CANCEL = ['touchcancel', 'onTouchCancel'],
    ON_CHANGE = ['change', 'onChange'],
    ON_INPUT = ['input', 'onInput'],
    ON_SUBMIT = ['submit', 'onSubmit'],
    ON_FOCUS = ['focus', 'onFocus'],
    ON_BLUR = ['blur', 'onBlur'],
    ON_KEY_DOWN = ['keydown', 'onKeyDown'],
    ON_KEY_UP = ['keyup', 'onKeyUp'],
    ON_PRESS = ['press', 'onPress'],
    ON_WHEEL = ['wheel', 'onWheel'],
    ON_RESIZE = ['resize', 'onResize'],
    ON_SCROLL = ['scroll', 'onScroll'];



// import evaluateID from './lookup/evaluateID';
// import evaluateClassName from './lookup/evaluateClassName';
// import equalID from './lookup/equalID';

/**
 * Checks whether the substring is present within element ID
 * @param sub Substring to check for
 * @param element DOM element
 * @returns {*|boolean}
 */
export function evaluateID(sub, element) {
    var id = element.id;

    return id && id.indexOf(sub) === 0;
}


type MousePosition = {
    x:number,
    y:number
}

/** Ray(Event) emitted by an emitter */
export class Ray {
    e: Event;
    target: EventTarget;
    root: HTMLElement | Document;
    position: {
        x:number
        y:number
    };
    path: Node[] | false;
    topDownPath: Node[];
    
    // e: any;
    // target: any;
    // root: any;
    // position: any;
    // path: any;
    // topDownPath: any;

    /**
     * @param e {Event}
     * @optonal @param root {HTMLElement}  Root element (optional, defaults to document)
     * @optional @param position Position in screen coordinates (optional)
     */
    constructor(
        e: Event,
        root: HTMLElement,
        position?: {x:number,y:number}
    ) {
        this.e = e;
        this.target = e.target;
        this.root = root || document;
        this.position = position;
    }

    /**
     * @Private
     * Gets the reversed (bottom up)
     * @returns {*} Array of DOM nodes
     */
    _getPath() {
        if (!this.path) { // be lazy for performance
            this.path = DomUtil.buildPath(this.root, this.target);
        }
        return this.path as Node[];
    }

    /**
     * Gets intersections (bottom-up)
     * @returns {*} Array of DOM nodes
     */
    getIntersections(topDown) {
        var bottomUpPath = this._getPath();

        if (!topDown) {
            return bottomUpPath;
        }

        if (!this.topDownPath) { // be lazy for performance
            this.topDownPath = bottomUpPath.reverse() //_.reverse(bottomUpPath);
        }

        return this.topDownPath;
    }

    /**
     * Checks if the ray is attached to the DOM
     * @returns {boolean}
     */
    isAttached() {
        var reversed = this._getPath();
        //return reversed && reversed[reversed.length - 1] === this.parentElement;
        return !!reversed;
    }

    //<editor-fold desc="Ray operations">
    /**
     * Returns true if path intersects node
     * @param node
     * @returns {boolean}
     */
    intersects(node) {
        var path = this._getPath();

        return path && path.indexOf(node) > -1;
    }

    /**
     * Returns node with specified ID if ray intersects it, otherwise false
     * @param id ID to check for
     * @param strict If true, look for exact ID. If false, use substring.
     * @returns {*}
     */
    intersectsId(id: HTMLElement["id"], strict: boolean) {
        var func = strict ? equalID : evaluateID;

        return this.findNode(partial(func, id)) || false;
    }

    /**
     * Returns node with specified className if ray intersects it, otherwise false
     * @param className {string} ID to check for
     * @returns {*}
     */
    intersectsClass(className: HTMLElement["className"]) {
        return this.findNode(partial(evaluateClassName, className));
    }

    /**
     * Finds the node using a predicate
     * @param predicate Function accepting and item and returning boolean (match)
     * @param topDown Should we start from root
     * @returns {*}
     */
    findNode(predicate, topDown = false) {
        var path = this._getPath();
        return topDown ? findLastValue(path, predicate) : path.find(predicate);
    }

    preventDefault() {
        this.e.preventDefault();
    }

    toString() {
        return 'Ray(' + this._getPath().length + ' intersections)';
    }
}


var instance;

/**
 * Subscribes to browser events (click, contextmenu, touchstart, touchend, resize and scroll)
 * Dispatches 3 types of events - used by the menu system - by registering handlers and firing them
 * It basically *converts* browser events to another type of events
 * The choice of triggered handlers depends of:
 * 1. is the menu currently on screen
 * 2. do we click inside or outside of the menu
 * 3. do we click/contextmenu or tap/tap-and-hold
 */
export class Emitter extends EmitterBase {

    static ON_MOUSE_OVER = ON_MOUSE_OVER[1];
    static ON_MOUSE_OUT = ON_MOUSE_OUT[1];
    static ON_MOUSE_ENTER = ON_MOUSE_ENTER[1];
    static ON_MOUSE_LEAVE = ON_MOUSE_LEAVE[1];
    static ON_TOUCH_START_INSIDE = ON_MOUSE_DOWN[1];
    static ON_MOUSE_UP = ON_MOUSE_UP[1];
    static ON_MOUSE_MOVE = ON_MOUSE_MOVE[1];
    static ON_CLICK = ON_CLICK[1];
    static ON_DOUBLE_CLICK = ON_DOUBLE_CLICK[1];
    static ON_CONTEXT_MENU = ON_CONTEXT_MENU[1];
    //@ts-ignore
    static ON_TOUCH_START_INSIDE = ON_TOUCH_START[1];
    static ON_TOUCH_END = ON_TOUCH_END[1];
    static ON_TOUCH_MOVE = ON_TOUCH_MOVE[1];
    static ON_TOUCH_CANCEL = ON_TOUCH_CANCEL[1];
    static ON_CHANGE = ON_CHANGE[1];
    static ON_INPUT = ON_INPUT[1];
    static ON_SUBMIT = ON_SUBMIT[1];
    static ON_FOCUS = ON_FOCUS[1];
    static ON_BLUR = ON_BLUR[1];
    static ON_KEY_DOWN = ON_KEY_DOWN[1];
    static ON_KEY_UP = ON_KEY_UP[1];
    static ON_PRESS = ON_PRESS[1];
    static ON_WHEEL = ON_WHEEL[1];
    static ON_RESIZE = ON_RESIZE[1];
    static ON_SCROLL = ON_SCROLL[1];

    //<editor-fold desc="Singleton">
    static getInstance(): Emitter {
        if (!instance) {
            instance = new Emitter();
        }
        return instance;
    }

    constructor() {
        super();

        // document
        this[ON_MOUSE_OVER[1]] = this.createRayAndEmit.bind(this, ON_MOUSE_OVER[1], document);
        this[ON_MOUSE_OUT[1]] = this.createRayAndEmit.bind(this, ON_MOUSE_OUT[1], document);
        this[ON_MOUSE_ENTER[1]] = this.createRayAndEmit.bind(this, ON_MOUSE_ENTER[1], document);
        this[ON_MOUSE_LEAVE[1]] = this.createRayAndEmit.bind(this, ON_MOUSE_LEAVE[1], document);
        this[ON_MOUSE_DOWN[1]] = this.createRayAndEmit.bind(this, ON_MOUSE_DOWN[1], document);
        this[ON_MOUSE_UP[1]] = this.createRayAndEmit.bind(this, ON_MOUSE_UP[1], document);
        this[ON_MOUSE_MOVE[1]] = this.createRayAndEmit.bind(this, ON_MOUSE_MOVE[1], document);
        this[ON_CLICK[1]] = this.createRayAndEmit.bind(this, ON_CLICK[1], document);
        this[ON_DOUBLE_CLICK[1]] = this.createRayAndEmit.bind(this, ON_DOUBLE_CLICK[1], document);
        this[ON_CONTEXT_MENU[1]] = this.createRayAndEmit.bind(this, ON_CONTEXT_MENU[1], document);
        this[ON_TOUCH_START[1]] = this.createRayAndEmit.bind(this, ON_TOUCH_START[1], document);
        this[ON_TOUCH_END[1]] = this.createRayAndEmit.bind(this, ON_TOUCH_END[1], document);
        this[ON_TOUCH_MOVE[1]] = this.createRayAndEmit.bind(this, ON_TOUCH_MOVE[1], document);
        this[ON_TOUCH_CANCEL[1]] = this.createRayAndEmit.bind(this, ON_TOUCH_CANCEL[1], document);
        this[ON_MOUSE_OVER[1]] = this.createRayAndEmit.bind(this, ON_MOUSE_OVER[1], document);
        this[ON_MOUSE_OVER[1]] = this.createRayAndEmit.bind(this, ON_MOUSE_OVER[1], document);
        this[ON_CHANGE[1]] = this.createRayAndEmit.bind(this, ON_CHANGE[1], document);
        this[ON_INPUT[1]] = this.createRayAndEmit.bind(this, ON_INPUT[1], document);
        this[ON_SUBMIT[1]] = this.createRayAndEmit.bind(this, ON_SUBMIT[1], document);
        this[ON_FOCUS[1]] = this.createRayAndEmit.bind(this, ON_FOCUS[1], document);
        this[ON_BLUR[1]] = this.createRayAndEmit.bind(this, ON_BLUR[1], document);
        this[ON_KEY_DOWN[1]] = this.createRayAndEmit.bind(this, ON_KEY_DOWN[1], document);
        this[ON_KEY_UP[1]] = this.createRayAndEmit.bind(this, ON_KEY_UP[1], document);
        this[ON_PRESS[1]] = this.createRayAndEmit.bind(this, ON_PRESS[1], document);
        this[ON_WHEEL[1]] = this.createRayAndEmit.bind(this, ON_WHEEL[1], document);

        // window
        this[ON_RESIZE[1]] = this.createRayAndEmit.bind(this, ON_RESIZE[1], window);
        this[ON_SCROLL[1]] = this.createRayAndEmit.bind(this, ON_SCROLL[1], window);
    }


    //<editor-fold desc="Browser event subscription">
    handleSubscription(previousCount, nextCount) {
        if (previousCount === 0 && nextCount >= 1) {
            this.browserSubscribe();
        } else if (previousCount && nextCount === 0) {
            this.browserUnsubscribe();
        }
    }

    browserSubscribe() {
        // TODO: optimize, so we add listeners only for events actually used by subscribers (keep each event type count)
        // TODO: also, allow specifying the capture/bubble phase per handler
        document.body.addEventListener(ON_MOUSE_OVER[0], this[ON_MOUSE_OVER[1]], false);
        document.body.addEventListener(ON_MOUSE_OUT[0], this[ON_MOUSE_OUT[1]], false);
        document.body.addEventListener(ON_MOUSE_ENTER[0], this[ON_MOUSE_ENTER[1]], false);
        document.body.addEventListener(ON_MOUSE_LEAVE[0], this[ON_MOUSE_LEAVE[1]], false);
        document.body.addEventListener(ON_MOUSE_DOWN[0], this[ON_MOUSE_DOWN[1]], false);
        document.body.addEventListener(ON_MOUSE_UP[0], this[ON_MOUSE_UP[1]], false);
        document.body.addEventListener(ON_MOUSE_MOVE[0], this[ON_MOUSE_MOVE[1]], false);
        document.body.addEventListener(ON_CLICK[0], this[ON_CLICK[1]], false);
        document.body.addEventListener(ON_DOUBLE_CLICK[0], this[ON_DOUBLE_CLICK[1]], false);
        document.body.addEventListener(ON_CONTEXT_MENU[0], this[ON_CONTEXT_MENU[1]], false);
        document.body.addEventListener(ON_TOUCH_START[0], this[ON_TOUCH_START[1]], false);
        document.body.addEventListener(ON_TOUCH_END[0], this[ON_TOUCH_END[1]], false);
        document.body.addEventListener(ON_TOUCH_MOVE[0], this[ON_TOUCH_MOVE[1]], false);
        document.body.addEventListener(ON_TOUCH_CANCEL[0], this[ON_TOUCH_CANCEL[1]], false);
        document.body.addEventListener(ON_CHANGE[0], this[ON_CHANGE[1]], false);
        document.body.addEventListener(ON_INPUT[0], this[ON_INPUT[1]], false);
        document.body.addEventListener(ON_SUBMIT[0], this[ON_SUBMIT[1]], false);
        document.body.addEventListener(ON_FOCUS[0], this[ON_FOCUS[1]], false);
        document.body.addEventListener(ON_BLUR[0], this[ON_BLUR[1]], false);
        document.body.addEventListener(ON_KEY_DOWN[0], this[ON_KEY_DOWN[1]], false);
        document.body.addEventListener(ON_KEY_UP[0], this[ON_KEY_UP[1]], false);
        document.body.addEventListener(ON_PRESS[0], this[ON_PRESS[1]], false);
        document.body.addEventListener(ON_WHEEL[0], this[ON_WHEEL[1]], false);
        window.addEventListener(ON_RESIZE[0], this[ON_RESIZE[1]], false);
        window.addEventListener(ON_SCROLL[0], this[ON_SCROLL[1]], false);
        //console.log('subscribed')
    }

    browserUnsubscribe() {
        document.body.removeEventListener(ON_MOUSE_OVER[0], this[ON_MOUSE_OVER[1]]);
        document.body.removeEventListener(ON_MOUSE_OUT[0], this[ON_MOUSE_OUT[1]]);
        document.body.removeEventListener(ON_MOUSE_ENTER[0], this[ON_MOUSE_ENTER[1]]);
        document.body.removeEventListener(ON_MOUSE_LEAVE[0], this[ON_MOUSE_LEAVE[1]]);
        document.body.removeEventListener(ON_MOUSE_DOWN[0], this[ON_MOUSE_DOWN[1]]);
        document.body.removeEventListener(ON_MOUSE_UP[0], this[ON_MOUSE_UP[1]]);
        document.body.removeEventListener(ON_MOUSE_MOVE[0], this[ON_MOUSE_MOVE[1]]);
        document.body.removeEventListener(ON_CLICK[0], this[ON_CLICK[1]]);
        document.body.removeEventListener(ON_DOUBLE_CLICK[0], this[ON_DOUBLE_CLICK[1]]);
        document.body.removeEventListener(ON_CONTEXT_MENU[0], this[ON_CONTEXT_MENU[1]]);
        document.body.removeEventListener(ON_TOUCH_START[0], this[ON_TOUCH_START[1]]);
        document.body.removeEventListener(ON_TOUCH_END[0], this[ON_TOUCH_END[1]]);
        document.body.removeEventListener(ON_TOUCH_MOVE[0], this[ON_TOUCH_MOVE[1]]);
        document.body.removeEventListener(ON_TOUCH_CANCEL[0], this[ON_TOUCH_CANCEL[1]]);
        document.body.removeEventListener(ON_CHANGE[0], this[ON_CHANGE[1]]);
        document.body.removeEventListener(ON_INPUT[0], this[ON_INPUT[1]]);
        document.body.removeEventListener(ON_SUBMIT[0], this[ON_SUBMIT[1]]);
        document.body.removeEventListener(ON_FOCUS[0], this[ON_FOCUS[1]]);
        document.body.removeEventListener(ON_BLUR[0], this[ON_BLUR[1]]);
        document.body.removeEventListener(ON_KEY_DOWN[0], this[ON_KEY_DOWN[1]]);
        document.body.removeEventListener(ON_KEY_UP[0], this[ON_KEY_UP[1]]);
        document.body.removeEventListener(ON_PRESS[0], this[ON_PRESS[1]]);
        document.body.removeEventListener(ON_WHEEL[0], this[ON_WHEEL[1]]);
        window.removeEventListener(ON_RESIZE[0], this[ON_RESIZE[1]]);
        window.removeEventListener(ON_SCROLL[0], this[ON_SCROLL[1]]);
        //console.log('unsubscribed')
    }
    //</editor-fold>
}

//<editor-fold desc="Constants">
// make accessible from the outside
Emitter.ON_MOUSE_OVER = ON_MOUSE_OVER[1];
Emitter.ON_MOUSE_OUT = ON_MOUSE_OUT[1];
Emitter.ON_MOUSE_ENTER = ON_MOUSE_ENTER[1];
Emitter.ON_MOUSE_LEAVE = ON_MOUSE_LEAVE[1];
Emitter.ON_TOUCH_START_INSIDE = ON_MOUSE_DOWN[1];
Emitter.ON_MOUSE_UP = ON_MOUSE_UP[1];
Emitter.ON_MOUSE_MOVE = ON_MOUSE_MOVE[1];
Emitter.ON_CLICK = ON_CLICK[1];
Emitter.ON_DOUBLE_CLICK = ON_DOUBLE_CLICK[1];
Emitter.ON_CONTEXT_MENU = ON_CONTEXT_MENU[1];
Emitter.ON_TOUCH_START_INSIDE = ON_TOUCH_START[1];
Emitter.ON_TOUCH_END = ON_TOUCH_END[1];
Emitter.ON_TOUCH_MOVE = ON_TOUCH_MOVE[1];
Emitter.ON_TOUCH_CANCEL = ON_TOUCH_CANCEL[1];
Emitter.ON_CHANGE = ON_CHANGE[1];
Emitter.ON_INPUT = ON_INPUT[1];
Emitter.ON_SUBMIT = ON_SUBMIT[1];
Emitter.ON_FOCUS = ON_FOCUS[1];
Emitter.ON_BLUR = ON_BLUR[1];
Emitter.ON_KEY_DOWN = ON_KEY_DOWN[1];
Emitter.ON_KEY_UP = ON_KEY_UP[1];
Emitter.ON_PRESS = ON_PRESS[1];
Emitter.ON_WHEEL = ON_WHEEL[1];
Emitter.ON_RESIZE = ON_RESIZE[1];
Emitter.ON_SCROLL = ON_SCROLL[1];
//</editor-fold>



export class EmitterPlug extends EmitterBase {
    emitter: Emitter;
    handlers: any;

    constructor() {
        super();
        this.emitter = Emitter.getInstance();
        this.handlers = undefined;
    }


    //<editor-fold desc="Emitter subscription">
    handleSubscription(previousCount, nextCount) {
        if (previousCount === 0 && nextCount >= 1) {
            this.emitter.connect(this.handlers);
        } 
        else if (previousCount && nextCount === 0) {
            this.emitter.disconnect(this.handlers);
        }
    }
}