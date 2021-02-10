import React, { Component } from 'react';
import ReactDOM from 'react-dom';


var shallowEqual = Object.is

const hoistBlackList = {
  $$typeof: 1,
  render: 1,
  compare: 1,
  type: 1,
  childContextTypes: 1,
  contextType: 1,
  contextTypes: 1,
  defaultProps: 1,
  getDefaultProps: 1,
  getDerivedStateFromError: 1,
  getDerivedStateFromProps: 1,
  mixins: 1,
  propTypes: 1
}

function hoistNonReactStatic(base, target) {
  const protoProps = Object.getOwnPropertyNames(Object.getPrototypeOf(base))
  Object.getOwnPropertyNames(base).forEach(key => {
      if (!hoistBlackList[key] && protoProps.indexOf(key) === -1) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key))
      }
  })
}

const isCompositeComponent = type => typeof type === 'function';
const isReloadableComponent = type => typeof type === 'function' || typeof type === 'object';
const getComponentDisplayName = type => {
  const displayName = type.displayName || type.name;
  return displayName && displayName !== 'ReactComponent' ? displayName : 'Component';
};
const reactLifeCycleMountMethods = ['componentWillMount', 'componentDidMount'];
function isReactClass(Component) {
  return !!(Component.prototype && (React.Component.prototype.isPrototypeOf(Component.prototype) || Component.prototype.isReactComponent || Component.prototype.componentWillMount || Component.prototype.componentWillUnmount || Component.prototype.componentDidMount || Component.prototype.componentDidUnmount || Component.prototype.render));
}
function isReactClassInstance(Component) {
  return Component && isReactClass({
    prototype: Object.getPrototypeOf(Component)
  });
}
const getInternalInstance = instance => instance._reactInternalFiber || instance._reactInternalInstance || null;
const updateInstance = instance => {
  const {
    updater,
    forceUpdate
  } = instance;

  if (typeof forceUpdate === 'function') {
    instance.forceUpdate();
  } else if (updater && typeof updater.enqueueForceUpdate === 'function') {
    updater.enqueueForceUpdate(instance);
  }
};
const isFragmentNode = ({
  type
}) => React.Fragment && type === React.Fragment;
const ContextType = React.createContext ? React.createContext() : null;
const ConsumerType = ContextType && ContextType.Consumer.$$typeof;
const ProviderType = ContextType && ContextType.Provider.$$typeof;
const MemoType = React.memo && React.memo(() => null).$$typeof;
const LazyType = React.lazy && React.lazy(() => null).$$typeof;
const ForwardType = React.forwardRef && React.forwardRef(() => null).$$typeof;
const CONTEXT_CURRENT_VALUE = '_currentValue';
const isContextConsumer = ({
  type
}) => type && typeof type === 'object' && '$$typeof' in type && type.$$typeof === ConsumerType && ConsumerType;
const isContextProvider = ({
  type
}) => type && typeof type === 'object' && '$$typeof' in type && type.$$typeof === ProviderType && ProviderType;
const isMemoType = ({
  type
}) => type && typeof type === 'object' && '$$typeof' in type && type.$$typeof === MemoType && MemoType;
const isLazyType = ({
  type
}) => type && typeof type === 'object' && '$$typeof' in type && type.$$typeof === LazyType && LazyType;
const isForwardType = ({
  type
}) => type && typeof type === 'object' && '$$typeof' in type && type.$$typeof === ForwardType && ForwardType;
const isContextType = type => isContextConsumer(type) || isContextProvider(type);
const getElementType = type => {
  const element = {
    type
  };

  if (isContextConsumer(element)) {
    return 'Consumer';
  }

  if (isContextProvider(element)) {
    return 'Provider';
  }

  if (isLazyType(element)) {
    return 'Lazy';
  }

  if (isMemoType(element)) {
    return 'Memo';
  }

  if (isForwardType(element)) {
    return 'Forward';
  }

  if (isReactClass(type)) {
    return 'Class';
  }

  if (typeof element === 'function') {
    return 'FC';
  }

  return 'unknown';
};
const getContextProvider = type => type && type._context;

const configuration = {
  logLevel: 'error',
  pureSFC: true,
  pureRender: true,
  allowSFC: true,
  reloadHooks: true,
  reloadLifeCycleHooks: false,
  reloadHooksOnBodyChange: true,
  disableHotRenderer: false,
  integratedComparator: false,
  integratedResolver: false,
  disableHotRendererWhenInjected: true,
  showReactDomPatchNotification: true,
  onComponentRegister: false,
  onComponentCreate: false,
  ignoreSFC: false,
  ignoreSFCWhenInjected: true,
  ignoreComponents: false,
  errorReporter: undefined,
  ErrorOverlay: undefined,
  trackTailUpdates: true,
  wrapLazy: true,
  IS_REACT_MERGE_ENABLED: false
};
const internalConfiguration = {
  disableProxyCreation: false
};
const setConfiguration = config => {
  for (const i in config) {
    if (config.hasOwnProperty(i)) {
      configuration[i] = config[i];
    }
  }
};

const logger = {
  debug(...args) {
    if (['debug'].indexOf(configuration.logLevel) !== -1) {
      console.debug(...args);
    }
  },

  log(...args) {
    if (['debug', 'log'].indexOf(configuration.logLevel) !== -1) {
      console.log(...args);
    }
  },

  warn(...args) {
    if (['debug', 'log', 'warn'].indexOf(configuration.logLevel) !== -1) {
      console.warn(...args);
    }
  },

  error(...args) {
    if (['debug', 'log', 'warn', 'error'].indexOf(configuration.logLevel) !== -1) {
      console.error(...args);
    }
  }

};

function safeReactConstructor(Component, lastInstance) {
  try {
    if (lastInstance) {
      return new Component(lastInstance.props, lastInstance.context);
    }

    return new Component({}, {});
  } catch (e) {}

  return null;
}
function isNativeFunction(fn) {
  return typeof fn === 'function' ? fn.toString().indexOf('[native code]') > 0 : false;
}
const identity = a => a;
const indirectEval = eval;
const doesSupportClasses = function () {
  try {
    indirectEval('class Test {}');
    return true;
  } catch (e) {
    return false;
  }
}();

const ES6ProxyComponentFactory = (InitialParent, postConstructionAction) => indirectEval(`
(function(InitialParent, postConstructionAction) {
  return class ${InitialParent.name || 'HotComponent'} extends InitialParent {
    /*
     ! THIS IS NOT YOUR COMPONENT !
     !  THIS IS REACT-HOT-LOADER  !
  
     this is a "${InitialParent.name}" component, patched by React-Hot-Loader
     Sorry, but the real class code was hidden behind this facade
     Please refer to https://github.com/gaearon/react-hot-loader for details...
    */    
    
    constructor(props, context) {
      super(props, context)
      postConstructionAction.call(this)
    }
  }
})
`)(InitialParent, postConstructionAction);

const ES5ProxyComponentFactory = function (InitialParent, postConstructionAction) {
  function ProxyComponent(props, context) {
    InitialParent.call(this, props, context);
    postConstructionAction.call(this);
  }

  ProxyComponent.prototype = Object.create(InitialParent.prototype);
  Object.setPrototypeOf(ProxyComponent, InitialParent);
  return ProxyComponent;
};

const proxyClassCreator = doesSupportClasses ? ES6ProxyComponentFactory : ES5ProxyComponentFactory;
function getOwnKeys(target) {
  return [...Object.getOwnPropertyNames(target), ...Object.getOwnPropertySymbols(target)];
}
function shallowStringsEqual(a, b) {
  for (const key in a) {
    if (String(a[key]) !== String(b[key])) {
      return false;
    }
  }

  return true;
}
function deepPrototypeUpdate(dest, source) {
  const deepDest = Object.getPrototypeOf(dest);
  const deepSrc = Object.getPrototypeOf(source);

  if (deepDest && deepSrc && deepSrc !== deepDest) {
    deepPrototypeUpdate(deepDest, deepSrc);
  }

  if (source.prototype && source.prototype !== dest.prototype) {
    dest.prototype = source.prototype;
  }
}
function safeDefineProperty(target, key, props) {
  try {
    Object.defineProperty(target, key, props);
  } catch (e) {
    logger.warn('Error while wrapping', key, ' -> ', e);
  }
}

const PREFIX = '__reactstandin__';
const PROXY_KEY = `${PREFIX}key`;
const GENERATION = `${PREFIX}proxyGeneration`;
const REGENERATE_METHOD = `${PREFIX}regenerateByEval`;
const UNWRAP_PROXY = `${PREFIX}getCurrent`;
const CACHED_RESULT = `${PREFIX}cachedResult`;
const PROXY_IS_MOUNTED = `${PREFIX}isMounted`;
const RENDERED_GENERATION = 'REACT_HOT_LOADER_RENDERED_GENERATION';

const RESERVED_STATICS = ['length', 'displayName', 'name', 'arguments', 'caller', 'prototype', 'toString', 'valueOf', 'isStatelessFunctionalProxy', PROXY_KEY, UNWRAP_PROXY];

function transferStaticProps(ProxyComponent, savedDescriptors, PreviousComponent, NextComponent) {
  Object.getOwnPropertyNames(ProxyComponent).forEach(key => {
    if (RESERVED_STATICS.indexOf(key) !== -1) {
      return;
    }

    const prevDescriptor = Object.getOwnPropertyDescriptor(ProxyComponent, key);
    const savedDescriptor = savedDescriptors[key];

    if (!shallowEqual(prevDescriptor, savedDescriptor)) {
      safeDefineProperty(NextComponent, key, prevDescriptor);
    }
  });
  Object.getOwnPropertyNames(NextComponent).forEach(key => {
    if (RESERVED_STATICS.indexOf(key) !== -1) {
      return;
    }

    const prevDescriptor = PreviousComponent && Object.getOwnPropertyDescriptor(ProxyComponent, key);
    const savedDescriptor = savedDescriptors[key];

    if (prevDescriptor && savedDescriptor && !shallowEqual(savedDescriptor, prevDescriptor)) {
      safeDefineProperty(NextComponent, key, prevDescriptor);
      return;
    }

    if (prevDescriptor && !savedDescriptor) {
      safeDefineProperty(ProxyComponent, key, prevDescriptor);
      return;
    }

    const nextDescriptor = { ...Object.getOwnPropertyDescriptor(NextComponent, key),
      configurable: true
    };
    savedDescriptors[key] = nextDescriptor;
    safeDefineProperty(ProxyComponent, key, nextDescriptor);
  });
  Object.getOwnPropertyNames(ProxyComponent).forEach(key => {
    if (RESERVED_STATICS.indexOf(key) !== -1) {
      return;
    }

    if (NextComponent.hasOwnProperty(key)) {
      return;
    }

    const proxyDescriptor = Object.getOwnPropertyDescriptor(ProxyComponent, key);

    if (proxyDescriptor && !proxyDescriptor.configurable) {
      return;
    }

    const prevDescriptor = PreviousComponent && Object.getOwnPropertyDescriptor(PreviousComponent, key);
    const savedDescriptor = savedDescriptors[key];

    if (prevDescriptor && savedDescriptor && !shallowEqual(savedDescriptor, prevDescriptor)) {
      return;
    }

    safeDefineProperty(ProxyComponent, key, {
      value: undefined
    });
  });
  return savedDescriptors;
}

function mergeComponents(ProxyComponent, NextComponent, InitialComponent, lastInstance, injectedMembers) {
  const injectedCode = {};

  try {
    const nextInstance = safeReactConstructor(NextComponent, lastInstance);

    try {
      deepPrototypeUpdate(InitialComponent, NextComponent);
    } catch (e) {}

    const proxyInstance = safeReactConstructor(ProxyComponent, lastInstance);

    if (!nextInstance || !proxyInstance) {
      return injectedCode;
    }

    const mergedAttrs = { ...proxyInstance,
      ...nextInstance
    };
    const hasRegenerate = proxyInstance[REGENERATE_METHOD];
    const ownKeys = getOwnKeys(Object.getPrototypeOf(ProxyComponent.prototype));
    Object.keys(mergedAttrs).forEach(key => {
      if (key.indexOf(PREFIX) === 0) return;
      const nextAttr = nextInstance[key];
      const prevAttr = proxyInstance[key];

      if (nextAttr) {
        if (isNativeFunction(nextAttr) || isNativeFunction(prevAttr)) {
          const isSameArity = nextAttr.length === prevAttr.length;
          const existsInPrototype = ownKeys.indexOf(key) >= 0 || ProxyComponent.prototype[key];

          if ((isSameArity || !prevAttr) && existsInPrototype) {
            if (hasRegenerate) {
              injectedCode[key] = `Object.getPrototypeOf(this)['${key}'].bind(this)`;
            } else {
              logger.warn('React Hot Loader:,', 'Non-controlled class', ProxyComponent.name, 'contains a new native or bound function ', key, nextAttr, '. Unable to reproduce');
            }
          } else {
            logger.warn('React Hot Loader:', 'Updated class ', ProxyComponent.name, 'contains native or bound function ', key, nextAttr, '. Unable to reproduce, use arrow functions instead.', `(arity: ${nextAttr.length}/${prevAttr.length}, proto: ${existsInPrototype ? 'yes' : 'no'}`);
          }

          return;
        }

        const nextString = String(nextAttr);
        const injectedBefore = injectedMembers[key];
        const isArrow = nextString.indexOf('=>') >= 0;
        const isFunction = nextString.indexOf('function') >= 0 || isArrow;
        const referToThis = nextString.indexOf('this') >= 0;

        if (nextString !== String(prevAttr) || injectedBefore && nextString !== String(injectedBefore) || isArrow && referToThis) {
          if (!hasRegenerate) {
            if (!isFunction) {
              injectedCode[key] = nextAttr;
            } else {
              logger.warn('React Hot Loader:', ' Updated class ', ProxyComponent.name, 'had different code for', key, nextAttr, '. Unable to reproduce. Regeneration support needed.');
            }
          } else {
            injectedCode[key] = nextAttr;
          }
        } else {}
      } else {}
    });
  } catch (e) {
    logger.warn('React Hot Loader:', e);
  }

  return injectedCode;
}

function checkLifeCycleMethods(ProxyComponent, NextComponent) {
  try {
    const p1 = Object.getPrototypeOf(ProxyComponent.prototype);
    const p2 = NextComponent.prototype;
    reactLifeCycleMountMethods.forEach(key => {
      const d1 = Object.getOwnPropertyDescriptor(p1, key) || {
        value: p1[key]
      };
      const d2 = Object.getOwnPropertyDescriptor(p2, key) || {
        value: p2[key]
      };

      if (!shallowStringsEqual(d1, d2)) {
        logger.warn('React Hot Loader:', 'You did update', ProxyComponent.name, 's lifecycle method', key, '. Unable to repeat');
      }
    });
  } catch (e) {}
}

function inject(target, currentGeneration, injectedMembers) {
  if (target[GENERATION] !== currentGeneration) {
    const hasRegenerate = !!target[REGENERATE_METHOD];
    Object.keys(injectedMembers).forEach(key => {
      try {
        if (hasRegenerate) {
          const usedThis = String(injectedMembers[key]).match(/_this([\d]+)/gi) || [];
          target[REGENERATE_METHOD](key, `(function REACT_HOT_LOADER_SANDBOX () {
          var _this  = this; // common babel transpile
          ${usedThis.map(name => `var ${name} = this;`)}

          return ${injectedMembers[key]};
          }).call(this)`);
        } else {
          target[key] = injectedMembers[key];
        }
      } catch (e) {
        logger.warn('React Hot Loader: Failed to regenerate method ', key, ' of class ', target);
        logger.warn('got error', e);
      }
    });
    target[GENERATION] = currentGeneration;
  }
}

const has = Object.prototype.hasOwnProperty;
let proxies = new WeakMap();
const resetClassProxies = () => {
  proxies = new WeakMap();
};
const blackListedClassMembers = ['constructor', 'render', 'componentWillMount', 'componentDidMount', 'componentDidCatch', 'componentWillReceiveProps', 'componentWillUnmount', 'hotComponentRender', 'getInitialState', 'getDefaultProps'];
const defaultRenderOptions = {
  componentWillRender: identity,
  componentDidUpdate: result => result,
  componentDidRender: result => result
};

const filteredPrototypeMethods = Proto => Object.getOwnPropertyNames(Proto).filter(prop => {
  const descriptor = Object.getOwnPropertyDescriptor(Proto, prop);
  return descriptor && prop.indexOf(PREFIX) !== 0 && blackListedClassMembers.indexOf(prop) < 0 && typeof descriptor.value === 'function';
});

const defineClassMember = (Class, methodName, methodBody) => safeDefineProperty(Class.prototype, methodName, {
  configurable: true,
  writable: true,
  enumerable: false,
  value: methodBody
});

const defineClassMembers = (Class, methods) => Object.keys(methods).forEach(methodName => defineClassMember(Class, methodName, methods[methodName]));

const setSFPFlag = (component, flag) => safeDefineProperty(component, 'isStatelessFunctionalProxy', {
  configurable: false,
  writable: false,
  enumerable: false,
  value: flag
});

const copyMethodDescriptors = (target, source) => {
  if (source) {
    const keys = Object.getOwnPropertyNames(source);
    keys.forEach(key => safeDefineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)));
    safeDefineProperty(target, 'toString', {
      configurable: true,
      writable: false,
      enumerable: false,
      value: function toString() {
        return String(source);
      }
    });
  }

  return target;
};

const knownClassComponents = [];
const forEachKnownClass = cb => knownClassComponents.forEach(cb);

function createClassProxy(InitialComponent, proxyKey, options = {}) {
  const renderOptions = { ...defaultRenderOptions,
    ...options
  };
  const proxyConfig = { ...configuration,
    ...options.proxy
  };
  const existingProxy = proxies.get(InitialComponent);

  if (existingProxy) {
    return existingProxy;
  }

  let CurrentComponent;
  let savedDescriptors = {};
  let injectedMembers = {};
  let proxyGeneration = 0;
  let classUpdatePostponed = null;
  let instancesCount = 0;
  let isFunctionalComponent = !isReactClass(InitialComponent);
  let lastInstance = null;

  function postConstructionAction() {
    this[GENERATION] = 0;
    lastInstance = this;

    if (classUpdatePostponed) {
      const callUpdate = classUpdatePostponed;
      classUpdatePostponed = null;
      callUpdate();
    }

    inject(this, proxyGeneration, injectedMembers);
  }

  function proxiedUpdate() {
    if (this) {
      inject(this, proxyGeneration, injectedMembers);
    }
  }

  function lifeCycleWrapperFactory(wrapperName, sideEffect = identity) {
    return copyMethodDescriptors(function wrappedMethod(...rest) {
      proxiedUpdate.call(this);
      sideEffect(this);
      return !isFunctionalComponent && CurrentComponent.prototype[wrapperName] && CurrentComponent.prototype[wrapperName].apply(this, rest);
    }, InitialComponent.prototype && InitialComponent.prototype[wrapperName]);
  }

  function methodWrapperFactory(wrapperName, realMethod) {
    return copyMethodDescriptors(function wrappedMethod(...rest) {
      return realMethod.apply(this, rest);
    }, realMethod);
  }

  const fakeBasePrototype = Proto => filteredPrototypeMethods(Proto).reduce((acc, key) => {
    acc[key] = methodWrapperFactory(key, Proto[key]);
    return acc;
  }, {});

  const componentDidMount = lifeCycleWrapperFactory('componentDidMount', target => {
    target[PROXY_IS_MOUNTED] = true;
    target[RENDERED_GENERATION] = get();
    instancesCount++;
  });
  const componentDidUpdate = lifeCycleWrapperFactory('componentDidUpdate', renderOptions.componentDidUpdate);
  const componentWillUnmount = lifeCycleWrapperFactory('componentWillUnmount', target => {
    target[PROXY_IS_MOUNTED] = false;
    instancesCount--;
  });

  function hotComponentRender() {
    renderOptions.componentWillRender(this);
    proxiedUpdate.call(this);
    let result;

    if (has.call(this, CACHED_RESULT)) {
      result = this[CACHED_RESULT];
      delete this[CACHED_RESULT];
    } else if (isFunctionalComponent) {
      result = CurrentComponent(this.props, this.context);
    } else {
      const renderMethod = CurrentComponent.prototype.render || this.render;

      if (renderMethod === proxiedRender) {
        throw new Error('React-Hot-Loader: you are trying to render Component without .render method');
      }

      result = renderMethod.apply(this, arguments);
    }

    return renderOptions.componentDidRender.call(this, result);
  }

  function hotComponentUpdate() {
    renderOptions.componentWillRender(this);
    proxiedUpdate.call(this);
  }

  function proxiedRender(...args) {
    renderOptions.componentWillRender(this);
    return hotComponentRender.call(this, ...args);
  }

  const defineProxyMethods = (Proxy, Base = {}) => {
    defineClassMembers(Proxy, { ...fakeBasePrototype(Base),
      ...(proxyConfig.pureRender ? {} : {
        render: proxiedRender
      }),
      hotComponentRender,
      hotComponentUpdate,
      componentDidMount,
      componentDidUpdate,
      componentWillUnmount
    });
  };

  let ProxyFacade;
  let ProxyComponent = null;
  let proxy;

  if (!isFunctionalComponent) {
    ProxyComponent = proxyClassCreator(InitialComponent, postConstructionAction);
    defineProxyMethods(ProxyComponent, InitialComponent.prototype);
    knownClassComponents.push(ProxyComponent);
    ProxyFacade = ProxyComponent;
  } else if (!proxyConfig.allowSFC) {
    proxyConfig.pureRender = false;
    ProxyComponent = proxyClassCreator(Component, postConstructionAction);
    defineProxyMethods(ProxyComponent);
    ProxyFacade = ProxyComponent;
  } else {
    ProxyFacade = function (props, context) {
      const result = CurrentComponent(props, context);

      if (isReactClassInstance(result)) {
        ProxyComponent = null;
        transferStaticProps(ProxyFacade, savedDescriptors, null, CurrentComponent);
        return result;
      }

      if (proxyConfig.pureSFC) {
        if (!CurrentComponent.contextTypes) {
          if (!ProxyFacade.isStatelessFunctionalProxy) {
            setSFPFlag(ProxyFacade, true);
          }

          return renderOptions.componentDidRender(result);
        }
      }

      setSFPFlag(ProxyFacade, false);
      proxyConfig.pureRender = false;
      ProxyComponent = proxyClassCreator(Component, postConstructionAction);
      defineProxyMethods(ProxyComponent);
      const determinateResult = new ProxyComponent(props, context);
      determinateResult[CACHED_RESULT] = result;
      return determinateResult;
    };
  }

  function get$1() {
    return ProxyFacade;
  }

  function getCurrent() {
    return CurrentComponent;
  }

  safeDefineProperty(ProxyFacade, UNWRAP_PROXY, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: getCurrent
  });
  safeDefineProperty(ProxyFacade, PROXY_KEY, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: proxyKey
  });
  safeDefineProperty(ProxyFacade, 'toString', {
    configurable: true,
    writable: false,
    enumerable: false,
    value: function toString() {
      return String(CurrentComponent);
    }
  });

  function update(NextComponent) {
    if (typeof NextComponent !== 'function') {
      throw new Error('Expected a constructor.');
    }

    if (NextComponent === CurrentComponent) {
      return false;
    }

    const existingProxy = proxies.get(NextComponent);

    if (existingProxy) {
      return false;
    }

    isFunctionalComponent = !isReactClass(NextComponent);
    proxies.set(NextComponent, proxy);
    proxyGeneration++;
    const PreviousComponent = CurrentComponent;
    CurrentComponent = NextComponent;
    const displayName = getComponentDisplayName(CurrentComponent);
    safeDefineProperty(ProxyFacade, 'displayName', {
      configurable: true,
      writable: false,
      enumerable: true,
      value: displayName
    });

    if (ProxyComponent) {
      safeDefineProperty(ProxyComponent, 'name', {
        value: displayName
      });
    }

    savedDescriptors = transferStaticProps(ProxyFacade, savedDescriptors, PreviousComponent, NextComponent);

    if (isFunctionalComponent || !ProxyComponent) ; else {
      const classHotReplacement = () => {
        checkLifeCycleMethods(ProxyComponent, NextComponent);

        if (proxyGeneration > 1) {
          getElementCloseHook(ProxyComponent);
          filteredPrototypeMethods(ProxyComponent.prototype).forEach(methodName => {
            if (!has.call(NextComponent.prototype, methodName)) {
              delete ProxyComponent.prototype[methodName];
            }
          });
        }

        Object.setPrototypeOf(ProxyComponent.prototype, NextComponent.prototype);
        defineProxyMethods(ProxyComponent, NextComponent.prototype);

        if (proxyGeneration > 1) {
          injectedMembers = mergeComponents(ProxyComponent, NextComponent, InitialComponent, lastInstance, injectedMembers);
          getElementComparisonHook(ProxyComponent);
        }
      };

      if (instancesCount > 0) {
        classHotReplacement();
      } else {
        classUpdatePostponed = classHotReplacement;
      }
    }

    return true;
  }

  update(InitialComponent);

  const dereference = () => {
    proxies.delete(InitialComponent);
    proxies.delete(ProxyFacade);
    proxies.delete(CurrentComponent);
  };

  proxy = {
    get: get$1,
    update,
    dereference,
    getCurrent: () => CurrentComponent
  };
  proxies.set(InitialComponent, proxy);
  proxies.set(ProxyFacade, proxy);
  safeDefineProperty(proxy, UNWRAP_PROXY, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: getCurrent
  });
  return proxy;
}

let generation = 1;
let hotComparisonCounter = 0;
let hotComparisonRuns = 0;
let hotReplacementGeneration = 0;

const nullFunction = () => ({});

let onHotComparisonOpen = nullFunction;
let onHotComparisonElement = nullFunction;
let onHotComparisonClose = nullFunction;
const setComparisonHooks = (open, element, close) => {
  onHotComparisonOpen = open;
  onHotComparisonElement = element;
  onHotComparisonClose = close;
};
const getElementComparisonHook = component => onHotComparisonElement(component);
const getElementCloseHook = component => onHotComparisonClose(component);
const hotComparisonOpen = () => hotComparisonCounter > 0 && hotComparisonRuns > 0 && hotReplacementGeneration > 0;
const openGeneration = () => forEachKnownClass(onHotComparisonElement);
const closeGeneration = () => forEachKnownClass(onHotComparisonClose);

const incrementHot = () => {
  if (!hotComparisonCounter) {
    openGeneration();
    onHotComparisonOpen();
  }

  hotComparisonCounter++;
};

const decrementHot = () => {
  hotComparisonCounter--;

  if (!hotComparisonCounter) {
    closeGeneration();
    hotComparisonRuns++;
  }
};
const enterHotUpdate = () => {
  Promise.resolve(incrementHot()).then(() => setTimeout(decrementHot, 0));
};
const increment = () => {
  enterHotUpdate();
  return generation++;
};
const get = () => generation;
const incrementHotGeneration = () => hotReplacementGeneration++;
const getHotGeneration = () => hotReplacementGeneration;

const UNDEFINED_NAMES = {
  Unknown: true,
  Component: true
};

const areNamesEqual = (a, b) => a === b || UNDEFINED_NAMES[a] && UNDEFINED_NAMES[b];

const isFunctional = fn => typeof fn === 'function';

const getTypeOf = type => {
  if (isReactClass(type)) return 'ReactComponent';
  if (isFunctional(type)) return 'StatelessFunctional';
  return 'Fragment';
};

function clearStringFast(str) {
  return str.length < 12 ? str : ` ${str}`.slice(1);
}

//was import levenshtein from 'fast-levenshtein';
//const haveTextSimilarity = (a, b) => a === b || levenshtein.get(clearStringFast(a), clearStringFast(b)) < a.length * 0.2;
//this is using https://github.com/ka-weihe/fastest-levenshtein (copy/pasted at the bottom of this file)
const haveTextSimilarity = (a, b) => a === b || distance(clearStringFast(a), clearStringFast(b)) < a.length * 0.2;

const getBaseProto = source => source.prototype.hotComponentRender ? Object.getPrototypeOf(source.prototype) : source.prototype;

const equalClasses = (a, b) => {
  const prototypeA = getBaseProto(a);
  const prototypeB = getBaseProto(b);
  let hits = 0;
  let misses = 0;
  let comparisons = 0;
  Object.getOwnPropertyNames(prototypeA).forEach(key => {
    const descriptorA = Object.getOwnPropertyDescriptor(prototypeA, key);
    const valueA = descriptorA && (descriptorA.value || descriptorA.get || descriptorA.set);
    const descriptorB = Object.getOwnPropertyDescriptor(prototypeB, key);
    const valueB = descriptorB && (descriptorB.value || descriptorB.get || descriptorB.set);

    if (typeof valueA === 'function' && key !== 'constructor') {
      comparisons++;

      if (haveTextSimilarity(String(valueA), String(valueB))) {
        hits++;
      } else {
        misses++;

        if (key === 'render') {
          misses++;
        }
      }
    }
  });
  return hits > 0 && misses <= 1 || comparisons === 0;
};

const areSwappable = (a, b) => {
  if (getIdByType(b) && getIdByType(a) === getIdByType(b)) {
    return true;
  }

  if (getTypeOf(a) !== getTypeOf(b)) {
    return false;
  }

  if (isReactClass(a)) {
    return areNamesEqual(getComponentDisplayName(a), getComponentDisplayName(b)) && equalClasses(a, b);
  }

  if (isFunctional(a)) {
    const nameA = getComponentDisplayName(a);

    if (!areNamesEqual(nameA, getComponentDisplayName(b))) {
      return false;
    }

    return nameA !== 'Component' || haveTextSimilarity(String(a), String(b));
  }

  return false;
};
function merge(...sources) {
  let acc = {};

  for (const source of sources) {
    if (source instanceof Array) {
      if (!(acc instanceof Array)) {
        acc = [];
      }

      acc = [...acc, ...source];
    } else if (source instanceof Object) {
      for (const key of Object.keys(source)) {
        let value = source[key];

        if (value instanceof Object && key in acc) {
          value = merge(acc[key], value);
        }

        acc = { ...acc,
          [key]: value
        };
      }
    }
  }

  return acc;
}

let signatures;
let proxiesByID;
let blackListedProxies;
let registeredComponents;
let idsByType;
let elementCount = 0;
let renderOptions = {};
let componentOptions;

const generateTypeId = () => `auto-${elementCount++}`;

const getIdByType = type => idsByType.get(type);
const isProxyType = type => type[PROXY_KEY];
const getProxyById = id => proxiesByID[id];
const getProxyByType = type => getProxyById(getIdByType(type));
const registerComponent = type => registeredComponents.set(type, 1);
const isRegisteredComponent = type => registeredComponents.has(type);
const setStandInOptions = options => {
  renderOptions = options;
};
const updateFunctionProxyById = (id, type, updater) => {
  idsByType.set(type, id);
  const proxy = proxiesByID[id];

  if (!proxy) {
    proxiesByID[id] = type;
  }

  updater(proxiesByID[id], type);
  return proxiesByID[id];
};
const updateProxyById = (id, type, options = {}) => {
  if (!id) {
    return null;
  }

  idsByType.set(type, id);

  if (!proxiesByID[id]) {
    proxiesByID[id] = createClassProxy(type, id, merge({}, renderOptions, {
      proxy: componentOptions.get(type) || {}
    }, options));
  } else if (proxiesByID[id].update(type)) {
    incrementHotGeneration();
  }

  return proxiesByID[id];
};
const createProxyForType = (type, options) => getProxyByType(type) || updateProxyById(generateTypeId(), type, options);
const isColdType = type => blackListedProxies.has(type);
const isTypeBlacklisted = type => isColdType(type) || isCompositeComponent(type) && (configuration.ignoreSFC && !isReactClass(type) || configuration.ignoreComponents && isReactClass(type));
const blacklistByType = type => blackListedProxies.set(type, true);
const setComponentOptions = (component, options) => componentOptions.set(component, options);
const addSignature = (type, signature) => signatures.set(type, signature);
const getSignature = type => signatures.get(type);
const resetProxies = () => {
  proxiesByID = {};
  idsByType = new WeakMap();
  blackListedProxies = new WeakMap();
  registeredComponents = new WeakMap();
  componentOptions = new WeakMap();
  signatures = new WeakMap();
  resetClassProxies();
};
resetProxies();

const tune = {
  allowSFC: false
};
const preactAdapter = (instance, resolveType) => {
  const oldHandler = instance.options.vnode;
  setConfiguration(tune);

  instance.options.vnode = vnode => {
    if (vnode.type) {
      vnode.type = resolveType(vnode.type);
    } else if (vnode.nodeName) {
      vnode.nodeName = resolveType(vnode.nodeName);
    }

    if (oldHandler) {
      oldHandler(vnode);
    }
  };
};

const _jsxFileName = "~src\\errorReporter.js";
let lastError = [];
const overlayStyle = {
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  backgroundColor: 'rgba(255,200,200,0.9)',
  color: '#000',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  fontSize: '12px',
  margin: 0,
  padding: '16px',
  maxHeight: '50%',
  overflow: 'auto',
  zIndex: 10000
};
const inlineErrorStyle = {
  backgroundColor: '#FEE'
};
const liCounter = {
  position: 'absolute',
  left: '10px'
};
const listStyle = {};
const EmptyErrorPlaceholder = ({
  component
}) => React.createElement('span', {
  style: inlineErrorStyle,
  role: "img",
  'aria-label': "Rect-Hot-Loader Error",
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 46
  }
}, "⚛️🔥🤕 (", component ? getComponentDisplayName(component.constructor || component) : 'Unknown location', ")", component && component.retryHotLoaderError && React.createElement('button', {
  onClick: () => component.retryHotLoaderError(),
  title: "Retry",
  __self: undefined,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 50
  }
}, "⟳"));

const errorHeader = (component, componentStack) => {
  if (component || componentStack) {
    return React.createElement('span', {
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 60
      }
    }, "(", component ? getComponentDisplayName(component.constructor || component) : 'Unknown location', component && ', ', componentStack && componentStack.split('\n').filter(Boolean)[0], ")");
  }

  return null;
};

const mapError = ({
  error,
  errorInfo,
  component
}) => {
  if (!error) {
    error = {
      message: 'undefined error'
    };
  }

  return React.createElement(React.Fragment, {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 78
    }
  }, React.createElement('p', {
    style: {
      color: 'red'
    },
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 79
    }
  }, errorHeader(component, errorInfo && errorInfo.componentStack), ' ', error.toString ? error.toString() : error && error.message || 'undefined error'), errorInfo && errorInfo.componentStack ? React.createElement('div', {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 84
    }
  }, React.createElement('div', {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 85
    }
  }, "Stack trace:"), React.createElement('ul', {
    style: {
      color: 'red',
      marginTop: '10px'
    },
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 86
    }
  }, error.stack.split('\n').slice(1, 2).map((line, i) => React.createElement('li', {
    key: String(i),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 90
    }
  }, line)), React.createElement('hr', {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 91
    }
  }), errorInfo.componentStack.split('\n').filter(Boolean).map((line, i) => React.createElement('li', {
    key: String(i),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 95
    }
  }, line)))) : error.stack && React.createElement('div', {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    }
  }, React.createElement('div', {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 101
    }
  }, "Stack trace:"), React.createElement('ul', {
    style: {
      color: 'red',
      marginTop: '10px'
    },
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 102
    }
  }, error.stack.split('\n').map((line, i) => React.createElement('li', {
    key: String(i),
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 103
    }
  }, line)))));
};

class ErrorOverlay extends React.Component {
  constructor(...args) {
    super(...args);

    ErrorOverlay.prototype.__init.call(this);

    ErrorOverlay.prototype.__init2.call(this);

    ErrorOverlay.prototype.__init3.call(this);
  }

  __init() {
    this.state = {
      visible: true
    };
  }

  __init2() {
    this.toggle = () => this.setState({
      visible: !this.state.visible
    });
  }

  __init3() {
    this.retry = () => this.setState(() => {
      const {
        errors
      } = this.props;
      enterHotUpdate();
      clearExceptions();
      errors.map(({
        component
      }) => component).filter(Boolean).filter(({
        retryHotLoaderError
      }) => !!retryHotLoaderError).forEach(component => component.retryHotLoaderError());
      return {};
    });
  }

  render() {
    const {
      errors
    } = this.props;

    if (!errors.length) {
      return null;
    }

    const {
      visible
    } = this.state;
    return React.createElement('div', {
      style: overlayStyle,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 140
      }
    }, React.createElement('h2', {
      style: {
        margin: 0
      },
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 141
      }
    }, "⚛️🔥😭: hot update was not successful ", React.createElement('button', {
      onClick: this.toggle,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 142
      }
    }, visible ? 'collapse' : 'expand'), React.createElement('button', {
      onClick: this.retry,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 143
      }
    }, "Retry")), visible && React.createElement('ul', {
      style: listStyle,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 146
      }
    }, errors.map((err, i) => React.createElement('li', {
      key: i,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 148
      }
    }, React.createElement('span', {
      style: liCounter,
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 149
      }
    }, "(", i + 1, "/", errors.length, ")"), mapError(err)))));
  }

}

const initErrorOverlay = () => {
  if (typeof document === 'undefined' || !document.body) {
    return;
  }

  let div = document.querySelector('.react-hot-loader-error-overlay');

  if (!div) {
    div = document.createElement('div');
    div.className = 'react-hot-loader-error-overlay';
    document.body.appendChild(div);
  }

  if (lastError.length) {
    const Overlay = configuration.ErrorOverlay || ErrorOverlay;
    ReactDOM.render(React.createElement(Overlay, {
      errors: lastError,
      __self: undefined,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 174
      }
    }), div);
  } else {
    div.parentNode.removeChild(div);
  }
};

function clearExceptions() {
  if (lastError.length) {
    lastError = [];
    initErrorOverlay();
  }
}
function logException(error, errorInfo, component) {
  console.error(error);
  lastError.push({
    error,
    errorInfo,
    component
  });
  initErrorOverlay();
}

const hotRenderWithHooks = ReactDOM.hotRenderWithHooks || ((fiber, render) => render());

function pushStack(stack, node) {
  stack.type = node.type;
  stack.elementType = node.elementType || node.type;
  stack.children = [];
  stack.instance = typeof node.type === 'function' ? node.stateNode : stack;
  stack.fiber = node;

  if (!stack.instance) {
    stack.instance = {
      SFC_fake: stack.type,
      props: {},
      render: () => hotRenderWithHooks(node, () => stack.type(stack.instance.props))
    };
  }
}

function hydrateFiberStack(node, stack) {
  pushStack(stack, node);

  if (node.child) {
    let {
      child
    } = node;

    do {
      const childStack = {};
      hydrateFiberStack(child, childStack);
      stack.children.push(childStack);
      child = child.sibling;
    } while (child);
  }
}

function pushState(stack, type, instance) {
  stack.type = type;
  stack.elementType = type;
  stack.children = [];
  stack.instance = instance || stack;

  if (typeof type === 'function' && type.isStatelessFunctionalProxy) {
    stack.instance = {
      SFC_fake: type,
      props: {},
      render: () => type(stack.instance.props)
    };
  }
}

function hydrateLegacyStack(node, stack) {
  if (node._currentElement) {
    pushState(stack, node._currentElement.type, node._instance || stack);
  }

  if (node._renderedComponent) {
    const childStack = {};
    hydrateLegacyStack(node._renderedComponent, childStack);
    stack.children.push(childStack);
  } else if (node._renderedChildren) {
    Object.keys(node._renderedChildren).forEach(key => {
      const childStack = {};
      hydrateLegacyStack(node._renderedChildren[key], childStack);
      stack.children.push(childStack);
    });
  }
}

const shouldNotPatchComponent = type => isTypeBlacklisted(type);

function resolveUtility(type) {
  if (typeof type === 'object') {
    if (configuration.integratedComparator) {
      return type;
    }

    const element = {
      type
    };

    if (isLazyType(element) || isMemoType(element) || isForwardType(element) || isContextType(element)) {
      return getProxyByType(type) || type;
    }
  }

  return undefined;
}
function resolveComponent(type, options = {}) {
  const existingProxy = getProxyByType(type);

  if (shouldNotPatchComponent(type)) {
    return existingProxy ? existingProxy.getCurrent() : type;
  }

  if (!existingProxy && configuration.onComponentCreate) {
    configuration.onComponentCreate(type, getComponentDisplayName(type));

    if (shouldNotPatchComponent(type)) {
      return type;
    }
  }

  const proxy = internalConfiguration.disableProxyCreation ? existingProxy : createProxyForType(type, options);
  return proxy ? proxy.get() : undefined;
}
function resolveProxy(type) {
  if (isProxyType(type)) {
    return type;
  }

  return undefined;
}
function resolveNotComponent(type) {
  if (!isCompositeComponent(type)) {
    return type;
  }

  return undefined;
}
const getLatestTypeVersion = type => {
  const existingProxy = getProxyByType(type);
  return existingProxy && existingProxy.getCurrent && existingProxy.getCurrent();
};
const resolveSimpleType = type => {
  if (!type) {
    return type;
  }

  const simpleResult = resolveProxy(type) || resolveUtility(type) || resolveNotComponent(type);

  if (simpleResult) {
    return simpleResult;
  }

  const lastType = getLatestTypeVersion(type);
  return lastType || type;
};
const resolveType = (type, options = {}) => {
  if (!type) {
    return type;
  }

  return resolveProxy(type) || resolveUtility(type) || resolveNotComponent(type) || resolveComponent(type, options) || type;
};

function getReactStack(instance) {
  const rootNode = getInternalInstance(instance);
  const stack = {};

  if (rootNode) {
    const isFiber = typeof rootNode.tag === 'number';

    if (isFiber) {
      hydrateFiberStack(rootNode, stack);
    } else {
      hydrateLegacyStack(rootNode, stack);
    }
  }

  return stack;
}

const markUpdate = ({
  fiber
}) => {
  if (!fiber || typeof fiber.type === 'string') {
    return;
  }

  const mostResentType = resolveType(fiber.type) || fiber.type;
  fiber.type = mostResentType;
  fiber.expirationTime = 1;

  if (fiber.alternate) {
    fiber.alternate.expirationTime = 1;
    fiber.alternate.type = fiber.type;
  }

  if (fiber.memoizedProps && typeof fiber.memoizedProps === 'object') {
    fiber.memoizedProps = {
      cacheBusterProp: true,
      ...fiber.memoizedProps
    };
  }

  if (fiber.stateNode) ;
};

const cleanupReact = () => {
  if (ReactDOM.hotCleanup) {
    ReactDOM.hotCleanup();
  }
};
const deepMarkUpdate = stack => {
  markUpdate(stack);

  if (stack.children) {
    stack.children.forEach(deepMarkUpdate);
  }
};

let renderStack = [];

const stackReport = () => {
  const rev = renderStack.slice().reverse();
  logger.warn('in', rev[0].name, rev);
};

const emptyMap = new Map();

const stackContext = () => (renderStack[renderStack.length - 1] || {}).context || emptyMap;

const shouldUseRenderMethod = fn => fn && (isReactClassInstance(fn) || fn.SFC_fake);

const getElementType$1 = child => child.type[UNWRAP_PROXY] ? child.type[UNWRAP_PROXY]() : child.type;

const filterNullArray = a => {
  if (!a) return [];
  return a.filter(x => !!x);
};

const unflatten = a => a.reduce((acc, a) => {
  if (Array.isArray(a)) {
    acc.push(...unflatten(a));
  } else {
    acc.push(a);
  }

  return acc;
}, []);

const isArray = fn => Array.isArray(fn);

const asArray = a => isArray(a) ? a : [a];

const render = (component, stack) => {
  if (!component) {
    return [];
  }

  if (component.hotComponentUpdate) {
    component.hotComponentUpdate();
  }

  if (shouldUseRenderMethod(component)) {
    return component.hotComponentRender ? component.hotComponentRender() : component.render();
  }

  if (isForwardType(component)) {
    return hotRenderWithHooks(stack.fiber, () => component.type.render(component.props, null));
  }

  if (isArray(component)) {
    return component.map(render);
  }

  if (component.children) {
    return component.children;
  }

  return [];
};

const NO_CHILDREN = {
  children: []
};

const mapChildren = (children, instances) => ({
  children: children.filter(c => c).map((child, index) => {
    if (typeof child !== 'object' || child.isMerged) {
      return child;
    }

    const instanceLine = instances[index] || {};
    const oldChildren = asArray(instanceLine.children || []);

    if (Array.isArray(child)) {
      return {
        type: null,
        ...mapChildren(child, oldChildren)
      };
    }

    const newChildren = asArray(child.props && child.props.children || child.children || []);
    const nextChildren = child.type !== 'function' && oldChildren.length && mapChildren(newChildren, oldChildren);
    return {
      nextProps: child.props,
      isMerged: true,
      ...instanceLine,
      ...(nextChildren || {}),
      type: child.type
    };
  })
});

const mergeInject = (a, b, instance) => {
  if (a && !Array.isArray(a)) {
    return mergeInject([a], b);
  }

  if (b && !Array.isArray(b)) {
    return mergeInject(a, [b]);
  }

  if (!a || !b) {
    return NO_CHILDREN;
  }

  if (a.length === b.length) {
    return mapChildren(a, b);
  }

  const nonNullA = filterNullArray(a);

  if (nonNullA.length === b.length) {
    return mapChildren(nonNullA, b);
  }

  const flatA = unflatten(nonNullA);
  const flatB = unflatten(b);

  if (flatA.length === flatB.length) {
    return mapChildren(flatA, flatB);
  }

  if (flatB.length === 0 && flatA.length === 1 && typeof flatA[0] !== 'object') ; else if (!configuration.IS_REACT_MERGE_ENABLED) {
    logger.warn(`React-hot-loader: unable to merge `, a, 'and children of ', instance);
    stackReport();
  }

  return NO_CHILDREN;
};

const transformFlowNode = flow => flow.reduce((acc, node) => {
  if (node && isFragmentNode(node)) {
    if (node.props && node.props.children) {
      return [...acc, ...filterNullArray(asArray(node.props.children))];
    }

    if (node.children) {
      return [...acc, ...filterNullArray(asArray(node.children))];
    }
  }

  return [...acc, node];
}, []);

let scheduledUpdates = [];
let scheduledUpdate = 0;
const flushScheduledUpdates = () => {
  const instances = scheduledUpdates;
  scheduledUpdates = [];
  scheduledUpdate = 0;
  instances.forEach(instance => instance[PROXY_IS_MOUNTED] && updateInstance(instance));
};
const unscheduleUpdate = instance => {
  scheduledUpdates = scheduledUpdates.filter(inst => inst !== instance);
};

const scheduleInstanceUpdate = instance => {
  scheduledUpdates.push(instance);

  if (!scheduledUpdate) {
    scheduledUpdate = setTimeout(flushScheduledUpdates, 4);
  }
};

const hotReplacementRender = (instance, stack) => {
  if (isReactClassInstance(instance)) {
    const type = getElementType$1(stack);
    renderStack.push({
      name: getComponentDisplayName(type),
      type,
      props: stack.instance.props,
      context: stackContext()
    });
  }

  try {
    const flow = transformFlowNode(filterNullArray(asArray(render(instance, stack))));
    const {
      children
    } = stack;
    flow.forEach((child, index) => {
      let childType = child.type;
      const stackChild = children[index];

      const next = instance => {
        const realProps = instance.props;
        const nextProps = { ...realProps,
          ...(child.nextProps || {}),
          ...(child.props || {})
        };

        if (isReactClassInstance(instance) && instance.componentWillUpdate) {
          instance.componentWillUpdate({ ...realProps
          }, instance.state);
        }

        instance.props = nextProps;
        hotReplacementRender(instance, stackChild);
        instance.props = realProps;
      };

      if (typeof child !== 'object' || !stackChild || !stackChild.instance) {
        if (stackChild && stackChild.children && stackChild.children.length) {
          logger.error('React-hot-loader: reconciliation failed', 'could not dive into [', child, '] while some elements are still present in the tree.');
          stackReport();
        }

        return;
      }

      if (typeof childType !== typeof stackChild.elementType) {
        if (childType && stackChild.type) {
          logger.warn('React-hot-loader: got ', childType, 'instead of', stackChild.type);
          stackReport();
        }

        return;
      }

      if (isMemoType(child) || isLazyType(child)) {
        if (stackChild.children && stackChild.children[0]) {
          scheduleInstanceUpdate(stackChild.children[0].instance);
        }

        childType = childType.type || childType;
      }

      if (isForwardType(child)) {
        next(stackChild.instance);
      } else if (isContextConsumer(child)) {
        try {
          const contextValue = stackContext().get(getContextProvider(childType));
          next({
            children: (child.props ? child.props.children : child.children[0])(contextValue !== undefined ? contextValue : childType[CONTEXT_CURRENT_VALUE])
          });
        } catch (e) {}
      } else if (typeof childType !== 'function') {
        let childName = childType ? getComponentDisplayName(childType) : 'empty';
        let extraContext = stackContext();

        if (isContextProvider(child)) {
          extraContext = new Map(extraContext);
          extraContext.set(getContextProvider(childType), { ...(child.nextProps || {}),
            ...(child.props || {})
          }.value);
          childName = 'ContextProvider';
        }

        renderStack.push({
          name: childName,
          type: childType,
          props: stack.instance.props,
          context: extraContext
        });
        next(mergeInject(transformFlowNode(asArray(child.props ? child.props.children : child.children)), stackChild.instance.children, stackChild.instance));
        renderStack.pop();
      } else {
        if (childType === stackChild.type) {
          next(stackChild.instance);
        } else {
          let childType = getElementType$1(child);

          if (isMemoType(child)) {
            childType = childType.type || childType;
          }

          if (!stackChild.type[PROXY_KEY]) {
            if (!configuration.IS_REACT_MERGE_ENABLED) {
              if (isTypeBlacklisted(stackChild.type)) {
                logger.warn('React-hot-loader: cold element got updated ', stackChild.type);
              }
            }
          }

          if (isRegisteredComponent(childType) || isRegisteredComponent(stackChild.type)) {
            if (resolveType(childType) === resolveType(stackChild.type)) {
              next(stackChild.instance);
            } else {}
          } else if (areSwappable(childType, stackChild.type)) {
            updateProxyById(stackChild.type[PROXY_KEY] || getIdByType(stackChild.type), childType);
            next(stackChild.instance);
          } else {
            logger.warn(`React-hot-loader: a ${getComponentDisplayName(childType)} was found where a ${getComponentDisplayName(stackChild)} was expected.
          ${childType}`);
            stackReport();
          }
        }

        scheduleInstanceUpdate(stackChild.instance);
      }
    });
  } catch (e) {
    if (e.then) ; else {
      logger.warn('React-hot-loader: run time error during reconciliation', e);
    }
  }

  if (isReactClassInstance(instance)) {
    renderStack.pop();
  }
};

var hotReplacementRender$1 = ((instance, stack) => {
  if (configuration.disableHotRenderer) {
    return;
  }

  try {
    internalConfiguration.disableProxyCreation = true;
    renderStack = [];
    hotReplacementRender(instance, stack);
  } catch (e) {
    logger.warn('React-hot-loader: reconcilation failed due to error', e);
  } finally {
    internalConfiguration.disableProxyCreation = false;
  }
});

const reconcileHotReplacement = ReactInstance => {
  const stack = getReactStack(ReactInstance);
  hotReplacementRender$1(ReactInstance, stack);
  cleanupReact();
  deepMarkUpdate(stack);
};

const renderReconciler = (target, force) => {
  const currentGeneration = get();
  const componentGeneration = target[RENDERED_GENERATION];
  target[RENDERED_GENERATION] = currentGeneration;

  if (!internalConfiguration.disableProxyCreation) {
    if ((componentGeneration || force) && componentGeneration !== currentGeneration) {
      enterHotUpdate();
      reconcileHotReplacement(target);
      return true;
    }
  }

  return false;
};

function asyncReconciledRender(target) {
  renderReconciler(target, false);
}

function proxyWrapper(element) {
  if (!internalConfiguration.disableProxyCreation) {
    unscheduleUpdate(this);
  }

  if (!element) {
    return element;
  }

  if (Array.isArray(element)) {
    return element.map(proxyWrapper);
  }

  if (typeof element.type === 'function') {
    const proxy = getProxyByType(element.type);

    if (proxy) {
      return { ...element,
        type: proxy.get()
      };
    }
  }

  return element;
}
const ERROR_STATE = 'react_hot_loader_catched_error';
const ERROR_STATE_PROTO = 'react_hot_loader_catched_error-prototype';
const OLD_RENDER = 'react_hot_loader_original_render';

function componentDidCatch(error, errorInfo) {
  this[ERROR_STATE] = {
    location: 'boundary',
    error,
    errorInfo,
    generation: get()
  };
  Object.getPrototypeOf(this)[ERROR_STATE_PROTO] = this[ERROR_STATE];

  if (!configuration.errorReporter) {
    logException(error, errorInfo, this);
  }

  this.forceUpdate();
}

function componentRender(...args) {
  const {
    error,
    errorInfo,
    generation
  } = this[ERROR_STATE] || {};

  if (error && generation === get()) {
    return React.createElement(configuration.errorReporter || EmptyErrorPlaceholder, {
      error,
      errorInfo,
      component: this
    });
  }

  if (this.hotComponentUpdate) {
    this.hotComponentUpdate();
  }

  try {
    return this[OLD_RENDER].render.call(this, ...args);
  } catch (renderError) {
    this[ERROR_STATE] = {
      location: 'render',
      error: renderError,
      generation: get()
    };

    if (!configuration.errorReporter) {
      logException(renderError, undefined, this);
    }

    return componentRender.call(this);
  }
}

function retryHotLoaderError() {
  delete this[ERROR_STATE];
  this.forceUpdate();
}
setComparisonHooks(() => ({}), component => {
  if (!hotComparisonOpen()) {
    return;
  }

  const {
    prototype
  } = component;

  if (!prototype[OLD_RENDER]) {
    const renderDescriptior = Object.getOwnPropertyDescriptor(prototype, 'render');
    prototype[OLD_RENDER] = {
      descriptor: renderDescriptior ? renderDescriptior.value : undefined,
      render: prototype.render
    };
    prototype.componentDidCatch = componentDidCatch;
    prototype.retryHotLoaderError = retryHotLoaderError;
    prototype.render = componentRender;
  }

  delete prototype[ERROR_STATE];
}, ({
  prototype
}) => {
  if (prototype[OLD_RENDER]) {
    const {
      generation
    } = prototype[ERROR_STATE_PROTO] || {};

    if (generation === get()) ; else {
      delete prototype.componentDidCatch;
      delete prototype.retryHotLoaderError;

      if (prototype.render === componentRender) {
        if (!prototype[OLD_RENDER].descriptor) {
          delete prototype.render;
        } else {
          prototype.render = prototype[OLD_RENDER].descriptor;
        }
      } else {
        console.error('React-Hot-Loader: something unexpectedly mutated Component', prototype);
      }

      delete prototype[ERROR_STATE_PROTO];
      delete prototype[OLD_RENDER];
    }
  }
});
setStandInOptions({
  componentWillRender: asyncReconciledRender,
  componentDidRender: proxyWrapper,
  componentDidUpdate: component => {
    component[RENDERED_GENERATION] = get();
    flushScheduledUpdates();
  }
});

const _jsxFileName$1 = "~src\\AppContainer.dev.js";

class AppContainer extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.generation !== get()) {
      return {
        error: null,
        generation: get()
      };
    }

    return null;
  }

  static __initStatic() {
    this.reactHotLoadable = false;
  }

  constructor(props) {
    super(props);

    if (configuration.showReactDomPatchNotification) {
      configuration.showReactDomPatchNotification = false;
      console.warn('React-Hot-Loader: react-🔥-dom patch is not detected. React 16.6+ features may not work.');
    }

    this.state = {
      error: null,
      errorInfo: null,
      generation: 0
    };
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (prevState.error && this.state.error) {
      return false;
    }

    return true;
  }

  componentDidCatch(error, errorInfo) {
    logger.error(error);

    if (!hotComparisonOpen()) {
      this.setState({});
      throw error;
    }

    const {
      errorReporter = configuration.errorReporter
    } = this.props;

    if (!errorReporter) {
      logException(error, errorInfo, this);
    }

    this.setState({
      error,
      errorInfo
    });
  }

  retryHotLoaderError() {
    this.setState({
      error: null
    }, () => {
      retryHotLoaderError.call(this);
    });
  }

  render() {
    const {
      error,
      errorInfo
    } = this.state;
    const {
      errorReporter: ErrorReporter = configuration.errorReporter || EmptyErrorPlaceholder
    } = this.props;

    if (error && this.props.errorBoundary) {
      return React.createElement(ErrorReporter, {
        error: error,
        errorInfo: errorInfo,
        component: this,
        __self: this,
        __source: {
          fileName: _jsxFileName$1,
          lineNumber: 82
        }
      });
    }

    if (this.hotComponentUpdate) {
      this.hotComponentUpdate();
    } else {
      throw new Error('React-Hot-Loader: AppContainer should be patched');
    }

    return React.Children.only(this.props.children);
  }

}

AppContainer.__initStatic();


AppContainer.defaultProps = {
  errorBoundary: true
};

//const realPolyfill = polyfill || defaultPolyfill;
//realPolyfill(AppContainer);

const _jsxFileName$2 = "~src\\reconciler\\fiberUpdater.js";
const lazyConstructor = '_ctor';

const getLazyConstructor = target => {
  if (target[lazyConstructor]) {
    return target[lazyConstructor];
  }

  if (target._payload) {
    return target._payload._result;
  }

  return null;
};

const setLazyConstructor = (target, replacement) => {
  replacement.isPatchedByReactHotLoader = true;

  if (target[lazyConstructor]) {
    target[lazyConstructor] = replacement;
  } else if (target._payload) {
      target._payload._hotUpdated = true;
      target._payload._result = replacement;
    } else {
      console.error('could not update lazy component');
    }
};

const patched = fn => {
  fn.isPatchedByReactHotLoader = true;
  return fn;
};

const patchLazyConstructor = target => {
  if (configuration.wrapLazy && !getLazyConstructor(target).isPatchedByReactHotLoader) {
    const ctor = getLazyConstructor(target);
    setLazyConstructor(target, () => ctor().then(m => {
      const C = resolveType(m.default);
      enterHotUpdate();

      if (!React.forwardRef) {
        return {
          default: patched(props => React.createElement(AppContainer, {
            __self: undefined,
            __source: {
              fileName: _jsxFileName$2,
              lineNumber: 55
            }
          }, React.createElement(C, { ...props,
            __self: undefined,
            __source: {
              fileName: _jsxFileName$2,
              lineNumber: 56
            }
          })))
        };
      }

      return {
        default: patched(React.forwardRef(function HotLoaderLazyWrapper(props, ref) {
          return React.createElement(AppContainer, {
            __self: this,
            __source: {
              fileName: _jsxFileName$2,
              lineNumber: 66
            }
          }, React.createElement(C, { ...props,
            ref: ref,
            __self: this,
            __source: {
              fileName: _jsxFileName$2,
              lineNumber: 67
            }
          }));
        }))
      };
    }));
  }
};

const updateLazy = (target, type) => {
  const ctor = getLazyConstructor(type);

  if (getLazyConstructor(target) !== ctor) {
    ctor();
  }

  patchLazyConstructor(target);
  patchLazyConstructor(type);
};
const updateMemo = (target, {
  type
}) => {
  target.type = resolveType(type);
};
const updateForward = (target, {
  render
}) => {
  target.render = render;
};
const updateContext = () => {};

const getInnerComponentType = component => {
  const unwrapper = component[UNWRAP_PROXY];
  return unwrapper ? unwrapper() : component;
};

function haveEqualSignatures(prevType, nextType) {
  try {
    const prevSignature = getSignature(prevType);
    const nextSignature = getSignature(nextType);

    if (prevSignature === undefined && nextSignature === undefined) {
      return true;
    }

    if (prevSignature === undefined || nextSignature === undefined) {
      return false;
    }

    if (prevSignature.key !== nextSignature.key) {
      return false;
    }

    const prevCustomHooks = prevSignature.getCustomHooks();
    const nextCustomHooks = nextSignature.getCustomHooks();

    if (prevCustomHooks.length !== nextCustomHooks.length) {
      return false;
    }

    for (let i = 0; i < nextCustomHooks.length; i++) {
      if (!haveEqualSignatures(prevCustomHooks[i], nextCustomHooks[i])) {
        return false;
      }
    }
  } catch (e) {
    logger.error('React-Hot-Loader: error occurred while comparing hook signature', e);
    return false;
  }

  return true;
}

const areSignaturesCompatible = (a, b) => {
  if (!haveEqualSignatures(a, b)) {
    logger.warn('⚛️🔥🎣 Hook order change detected: component', a, 'has been remounted');
    return false;
  }

  return true;
};

const compareRegistered = (a, b) => getIdByType(a) === getIdByType(b) && getProxyByType(a) === getProxyByType(b) && areSignaturesCompatible(a, b);

const areDeepSwappable = (oldType, newType) => {
  const type = {
    type: oldType
  };

  if (typeof oldType === 'function') {
    return areSwappable(oldType, newType);
  }

  if (isForwardType(type)) {
    return areDeepSwappable(oldType.render, newType.render);
  }

  if (isMemoType(type)) {
    return areDeepSwappable(oldType.type, newType.type);
  }

  return false;
};

const compareComponents = (oldType, newType, setNewType, baseType) => {
  let defaultResult = oldType === newType;

  if (oldType && !newType || !oldType && newType || typeof oldType !== typeof newType || getElementType(oldType) !== getElementType(newType) || 0) {
    return defaultResult;
  }

  if (getIdByType(newType) || getIdByType(oldType)) {
    if (!compareRegistered(oldType, newType)) {
      return false;
    }

    defaultResult = true;
  }

  if (isForwardType({
    type: oldType
  }) && isForwardType({
    type: newType
  })) {
    if (!compareRegistered(oldType.render, newType.render)) {
      return false;
    }

    if (oldType.render === newType.render || areDeepSwappable(oldType, newType)) {
      setNewType(newType);
      return true;
    }

    return defaultResult;
  }

  if (isMemoType({
    type: oldType
  }) && isMemoType({
    type: newType
  })) {
    if (!compareRegistered(oldType.type, newType.type)) {
      return false;
    }

    if (oldType.type === newType.type || areDeepSwappable(oldType, newType)) {
      if (baseType) {
        if (baseType.$$typeof === newType.$$typeof) {
          setNewType(newType);
        } else {
          setNewType(newType.type);
        }
      } else {
        logger.warn('Please update hot-loader/react-dom');

        if (isReactClass(newType.type)) {
          setNewType(newType);
        } else {
          setNewType(newType.type);
        }
      }

      return true;
    }

    return defaultResult;
  }

  if (isLazyType({
    type: oldType
  })) {
    updateLazy(oldType, newType);
    return defaultResult;
  }

  if (isContextType({
    type: oldType
  })) {
    setNewType(newType);
    return defaultResult;
  }

  if (typeof newType === 'function' && (defaultResult || newType !== oldType && areSignaturesCompatible(newType, oldType) && areSwappable(newType, oldType))) {
    const unwrapFactory = newType[UNWRAP_PROXY];
    const oldProxy = unwrapFactory && getProxyByType(unwrapFactory());

    if (oldProxy) {
      oldProxy.dereference();
      updateProxyById(oldType[PROXY_KEY] || getIdByType(oldType), getInnerComponentType(newType));
    } else {
      setNewType(newType);
    }

    return true;
  }

  return defaultResult;
};

const knownPairs = new WeakMap();
const emptyMap$1 = new WeakMap();

const getKnownPair = (oldType, newType) => {
  const pair = knownPairs.get(oldType) || emptyMap$1;
  return pair.get(newType);
};

const hotComponentCompare = (oldType, preNewType, setNewType, baseType) => {
  const hotActive = hotComparisonOpen();
  const newType = configuration.integratedResolver ? resolveType(preNewType) : preNewType;
  let result = oldType === newType;

  if (hotActive) {
    if (!isReloadableComponent(oldType) || !isReloadableComponent(newType) || isColdType(oldType) || isColdType(oldType) || !oldType || !newType || 0) {
      return result;
    }

    result = compareComponents(oldType, newType, setNewType, baseType);
    const pair = knownPairs.get(oldType) || new WeakMap();
    pair.set(newType, result);
    knownPairs.set(oldType, pair);
    return result;
  }

  return result || getKnownPair(oldType, newType) || false;
};

const forceSimpleSFC = {
  proxy: {
    pureSFC: true
  }
};

const hookWrapper = hook => {
  const wrappedHook = function (cb, deps) {
    if (configuration.reloadHooks && deps) {
      const inputs = [...deps];

      if (configuration.reloadHooksOnBodyChange) {
        inputs.push(String(cb));
      }

      if (deps.length > 0 || configuration.reloadLifeCycleHooks && deps.length === 0) {
        inputs.push(getHotGeneration());
      }

      return hook(cb, inputs);
    }

    return hook(cb, deps);
  };

  wrappedHook.isPatchedByReactHotLoader = true;
  return wrappedHook;
};

const noDeps = () => [];

const reactHotLoader = {
  signature(type, key, getCustomHooks = noDeps) {
    addSignature(type, {
      key,
      getCustomHooks
    });
    return type;
  },

  register(type, uniqueLocalName, fileName, options = {}) {
    const id = `${fileName}#${uniqueLocalName}`;

    if (isCompositeComponent(type) && typeof uniqueLocalName === 'string' && uniqueLocalName && typeof fileName === 'string' && fileName) {
      const proxy = getProxyById(id);

      if (proxy && proxy.getCurrent() !== type) {
        if (!configuration.IS_REACT_MERGE_ENABLED) {
          if (isTypeBlacklisted(type) || isTypeBlacklisted(proxy.getCurrent())) {
            logger.error('React-hot-loader: Cold component', uniqueLocalName, 'at', fileName, 'has been updated');
          }
        }
      }

      if (configuration.onComponentRegister) {
        configuration.onComponentRegister(type, uniqueLocalName, fileName);
      }

      if (configuration.onComponentCreate) {
        configuration.onComponentCreate(type, getComponentDisplayName(type));
      }

      registerComponent(updateProxyById(id, type, options).get());
      registerComponent(type);
      increment();
    }

    if (isContextType({
      type
    })) {
      ['Provider', 'Consumer'].forEach(prop => {
        const descriptor = Object.getOwnPropertyDescriptor(type, prop);

        if (descriptor && descriptor.value) {
          updateFunctionProxyById(`${id}:${prop}`, descriptor.value, updateContext);
        }
      });
      updateFunctionProxyById(id, type, updateContext);
      increment();
    }

    if (isLazyType({
      type
    })) {
      updateFunctionProxyById(id, type, updateLazy);
      increment();
    }

    if (isForwardType({
      type
    })) {
      reactHotLoader.register(type.render, `${uniqueLocalName}:render`, fileName, forceSimpleSFC);
      updateFunctionProxyById(id, type, updateForward);
      increment();
    }

    if (isMemoType({
      type
    })) {
      reactHotLoader.register(type.type, `${uniqueLocalName}:memo`, fileName, forceSimpleSFC);
      updateFunctionProxyById(id, type, updateMemo);
      increment();
    }
  },

  reset() {
    resetProxies();
  },

  preact(instance) {
    preactAdapter(instance, resolveType);
  },

  resolveType(type) {
    return resolveType(type);
  },

  patch(React, ReactDOM) {
    let typeResolver = resolveType;

    if (ReactDOM && !ReactDOM.render) {
      logger.error('React-Hot-Loader: broken state detected, please import React-Hot-Loader before react-dom, see https://github.com/gaearon/react-hot-loader/issues/1315');
    }

    if (ReactDOM && ReactDOM.setHotElementComparator) {
      ReactDOM.setHotElementComparator(hotComponentCompare);
      configuration.disableHotRenderer = configuration.disableHotRendererWhenInjected;
      configuration.ignoreSFC = configuration.ignoreSFCWhenInjected;
      configuration.IS_REACT_MERGE_ENABLED = true;
      configuration.showReactDomPatchNotification = false;
      configuration.integratedComparator = true;

      if (ReactDOM.setHotTypeResolver) {
        configuration.integratedResolver = true;
        typeResolver = resolveSimpleType;
        ReactDOM.setHotTypeResolver(resolveType);
      }
    }

    if (!React.createElement.isPatchedByReactHotLoader) {
      const originalCreateElement = React.createElement;

      React.createElement = (type, ...args) => originalCreateElement(typeResolver(type), ...args);

      React.createElement.isPatchedByReactHotLoader = true;
    }

    if (!React.cloneElement.isPatchedByReactHotLoader) {
      const originalCloneElement = React.cloneElement;

      React.cloneElement = (element, ...args) => {
        const newType = element.type && typeResolver(element.type);

        if (newType && newType !== element.type) {
          return originalCloneElement({ ...element,
            type: newType
          }, ...args);
        }

        return originalCloneElement(element, ...args);
      };

      React.cloneElement.isPatchedByReactHotLoader = true;
    }

    if (!React.createFactory.isPatchedByReactHotLoader) {
      React.createFactory = type => {
        const factory = React.createElement.bind(null, type);
        factory.type = type;
        return factory;
      };

      React.createFactory.isPatchedByReactHotLoader = true;
    }

    if (!React.Children.only.isPatchedByReactHotLoader) {
      const originalChildrenOnly = React.Children.only;

      React.Children.only = children => originalChildrenOnly({ ...children,
        type: typeResolver(children.type)
      });

      React.Children.only.isPatchedByReactHotLoader = true;
    }

    if (React.useEffect && !React.useEffect.isPatchedByReactHotLoader) {
      React.useEffect = hookWrapper(React.useEffect);
      React.useLayoutEffect = hookWrapper(React.useLayoutEffect);
      React.useCallback = hookWrapper(React.useCallback);
      React.useMemo = hookWrapper(React.useMemo);
      const {
        useContext
      } = React;

      React.useContext = (context, ...args) => useContext(typeResolver(context), ...args);
    }
  }

};

const openedModules = {};
let lastModuleOpened = '';
const getLastModuleOpened = () => lastModuleOpened;
const hotModules = {};

const createHotModule = () => ({
  instances: [],
  updateTimeout: 0
});

const hotModule = moduleId => {
  if (!hotModules[moduleId]) {
    hotModules[moduleId] = createHotModule();
  }

  return hotModules[moduleId];
};
const isOpened = sourceModule => sourceModule && !!openedModules[sourceModule.id];
const enter = sourceModule => {
  if (sourceModule && sourceModule.id) {
    lastModuleOpened = sourceModule.id;
    openedModules[sourceModule.id] = true;
  } else {
    logger.warn('React-hot-loader: no `module` variable found. Did you shadow a system variable?');
  }
};
const leave = sourceModule => {
  if (sourceModule && sourceModule.id) {
    delete openedModules[sourceModule.id];
  }
};

const createQueue = (runner = a => a()) => {
  let promise;
  let queue = [];

  const runAll = () => {
    const oldQueue = queue;
    oldQueue.forEach(cb => cb());
    queue = [];
  };

  const add = cb => {
    if (queue.length === 0) {
      promise = Promise.resolve().then(() => runner(runAll));
    }

    queue.push(cb);
    return promise;
  };

  return add;
};

const _jsxFileName$3 = "~src\\hot.dev.js";
const requireIndirect = typeof __webpack_require__ !== 'undefined' ? __webpack_require__ : require;

const chargeFailbackTimer = id => setTimeout(() => {
  const error = `hot update failed for module "${id}". Last file processed: "${getLastModuleOpened()}".`;
  logger.error(error);
  logException({
    toString: () => error
  });
}, 100);

const clearFailbackTimer = timerId => clearTimeout(timerId);

const createHoc = (SourceComponent, TargetComponent) => {
  hoistNonReactStatic(TargetComponent, SourceComponent);
  TargetComponent.displayName = `HotExported${getComponentDisplayName(SourceComponent)}`;
  return TargetComponent;
};

const runInRequireQueue = createQueue();
const runInRenderQueue = createQueue(cb => {
  if (ReactDOM.unstable_batchedUpdates) {
    ReactDOM.unstable_batchedUpdates(cb);
  } else {
    cb();
  }
});

const makeHotExport = (sourceModule, moduleId) => {
  const updateInstances = possibleError => {
    if (possibleError && possibleError instanceof Error) {
      console.error(possibleError);
      return;
    }

    const module = hotModule(moduleId);

    const deepUpdate = () => {
      runInRenderQueue(() => {
        enterHotUpdate();
        const gen = getHotGeneration();
        module.instances.forEach(inst => inst.forceUpdate());

        if (configuration.trackTailUpdates) {
          let runLimit = 0;

          const checkTailUpdates = () => {
            setTimeout(() => {
              if (getHotGeneration() !== gen) {
                logger.warn('React-Hot-Loader: some components were updated out-of-bound. Updating your app to reconcile the changes.');
                increment();
                deepUpdate();
              } else if (++runLimit < 5) {
                checkTailUpdates();
              }
            }, 16);
          };

          checkTailUpdates();
        }
      });
    };

    runInRequireQueue(() => {
      try {
        requireIndirect(moduleId);
      } catch (e) {
        console.error('React-Hot-Loader: error detected while loading', moduleId);
        console.error(e);
      }
    }).then(deepUpdate);
  };

  if (sourceModule.hot) {
    sourceModule.hot.accept(updateInstances);

    if (sourceModule.hot.addStatusHandler) {
      if (sourceModule.hot.status() === 'idle') {
        sourceModule.hot.addStatusHandler(status => {
          if (status === 'apply') {
            clearExceptions();
            updateInstances();
          }
        });
      }
    }
  } else {
    logger.warn('React-hot-loader: Hot Module Replacement is not enabled');
  }
};

const hot = sourceModule => {
  if (!sourceModule) {
    throw new Error('React-hot-loader: `hot` was called without any argument provided');
  }

  const moduleId = sourceModule.id || sourceModule.i || sourceModule.filename;

  if (!moduleId) {
    console.error('`module` provided', sourceModule);
    throw new Error('React-hot-loader: `hot` could not find the `name` of the the `module` you have provided');
  }

  const module = hotModule(moduleId);
  makeHotExport(sourceModule, moduleId);
  clearExceptions();
  const failbackTimer = chargeFailbackTimer(moduleId);
  let firstHotRegistered = false;
  return (WrappedComponent, props) => {
    clearFailbackTimer(failbackTimer);

    if (!firstHotRegistered) {
      firstHotRegistered = true;
      reactHotLoader.register(WrappedComponent, getComponentDisplayName(WrappedComponent), `RHL${moduleId}`);
    }

    return createHoc(WrappedComponent, class ExportedComponent extends Component {
      componentDidMount() {
        module.instances.push(this);
      }

      componentWillUnmount() {
        if (isOpened(sourceModule)) {
          const componentName = getComponentDisplayName(WrappedComponent);
          logger.error(`React-hot-loader: Detected AppContainer unmount on module '${moduleId}' update.\n` + `Did you use "hot(${componentName})" and "ReactDOM.render()" in the same file?\n` + `"hot(${componentName})" shall only be used as export.\n` + `Please refer to "Getting Started" (https://github.com/gaearon/react-hot-loader/).`);
        }

        module.instances = module.instances.filter(a => a !== this);
      }

      render() {
        return React.createElement(AppContainer, { ...props,
          __self: this,
          __source: {
            fileName: _jsxFileName$3,
            lineNumber: 170
          }
        }, React.createElement(WrappedComponent, { ...this.props,
          __self: this,
          __source: {
            fileName: _jsxFileName$3,
            lineNumber: 171
          }
        }));
      }

    });
  };
};

reactHotLoader.register(AppContainer, 'AppContainer', 'hot-dev');

const getProxyOrType = type => {
  const proxy = getProxyByType(type);
  return proxy ? proxy.get() : type;
};

const areComponentsEqual = (a, b) => getProxyOrType(a) === getProxyOrType(b);
const compareOrSwap = (oldType, newType) => hotComponentCompare(oldType, newType);
const cold = type => {
  blacklistByType(type);
  return type;
};
const configureComponent = (component, options) => setComponentOptions(component, options);
const setConfig = config => setConfiguration(config);

reactHotLoader.patch(React, ReactDOM);

export default reactHotLoader;
export { AppContainer, areComponentsEqual, cold, compareOrSwap, configureComponent, enter as enterModule, hot, leave as leaveModule, setConfig };



const peq = new Uint32Array(0x10000);

const myers_32 = (a, b) => {
  const n = a.length;
  const m = b.length;
  const lst = 1 << (n - 1);
  let pv = -1;
  let mv = 0;
  let sc = n;
  let i = n;
  while (i--) {
    peq[a.charCodeAt(i)] |= 1 << i;
  }
  for (i = 0; i < m; i++) {
    let eq = peq[b.charCodeAt(i)];
    const xv = eq | mv;
    eq |= ((eq & pv) + pv) ^ pv;
    mv |= ~(eq | pv);
    pv &= eq;
    if (mv & lst) {
      sc++;
    }
    if (pv & lst) {
      sc--;
    }
    mv = (mv << 1) | 1;
    pv = (pv << 1) | ~(xv | mv);
    mv &= xv;
  }
  i = n;
  while (i--) {
    peq[a.charCodeAt(i)] = 0;
  }
  return sc;
};

const myers_x = (b, a) => {
  const n = a.length;
  const m = b.length;
  const mhc = [];
  const phc = [];
  const hsize = Math.ceil(n / 32);
  const vsize = Math.ceil(m / 32);
  for (let i = 0; i < hsize; i++) {
    phc[i] = -1;
    mhc[i] = 0;
  }
  let j = 0;
  for (; j < vsize - 1; j++) {
    let mv = 0;
    let pv = -1;
    const start = j * 32;
    const vlen = Math.min(32, m) + start;
    for (let k = start; k < vlen; k++) {
      peq[b.charCodeAt(k)] |= 1 << k;
    }
    for (let i = 0; i < n; i++) {
      const eq = peq[a.charCodeAt(i)];
      const pb = (phc[(i / 32) | 0] >>> i % 32) & 1;
      const mb = (mhc[(i / 32) | 0] >>> i % 32) & 1;
      const xv = eq | mv;
      const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
      let ph = mv | ~(xh | pv);
      let mh = pv & xh;
      if ((ph >>> 31) ^ pb) {
        phc[(i / 32) | 0] ^= 1 << i % 32;
      }
      if ((mh >>> 31) ^ mb) {
        mhc[(i / 32) | 0] ^= 1 << i % 32;
      }
      ph = (ph << 1) | pb;
      mh = (mh << 1) | mb;
      pv = mh | ~(xv | ph);
      mv = ph & xv;
    }
    for (let k = start; k < vlen; k++) {
      peq[b.charCodeAt(k)] = 0;
    }
  }
  let mv = 0;
  let pv = -1;
  const start = j * 32;
  const vlen = Math.min(32, m - start) + start;
  for (let k = start; k < vlen; k++) {
    peq[b.charCodeAt(k)] |= 1 << k;
  }
  let score = m;
  for (let i = 0; i < n; i++) {
    const eq = peq[a.charCodeAt(i)];
    const pb = (phc[(i / 32) | 0] >>> i % 32) & 1;
    const mb = (mhc[(i / 32) | 0] >>> i % 32) & 1;
    const xv = eq | mv;
    const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
    let ph = mv | ~(xh | pv);
    let mh = pv & xh;
    score += (ph >>> ((m % 32) - 1)) & 1;
    score -= (mh >>> ((m % 32) - 1)) & 1;
    if ((ph >>> 31) ^ pb) {
      phc[(i / 32) | 0] ^= 1 << i % 32;
    }
    if ((mh >>> 31) ^ mb) {
      mhc[(i / 32) | 0] ^= 1 << i % 32;
    }
    ph = (ph << 1) | pb;
    mh = (mh << 1) | mb;
    pv = mh | ~(xv | ph);
    mv = ph & xv;
  }
  for (let k = start; k < vlen; k++) {
    peq[b.charCodeAt(k)] = 0;
  }
  return score;
};

const distance = (a, b) => {
  if (a.length < b.length) {
    [b, a] = [a, b];
  }
  if (b.length === 0) {
    return a.length;
  }
  if (a.length <= 32) {
    return myers_32(a, b);
  }
  return myers_x(a, b);
};

const closest = (str, arr) => {
  let min_distance = Infinity;
  let min_index = 0;
  for (let i = 0; i < arr.length; i++) {
    const dist = distance(str, arr[i]);
    if (dist < min_distance) {
      min_distance = dist;
      min_index = i;
    }
  }
  return arr[min_index];
};