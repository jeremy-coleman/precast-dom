!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=7)}([function(e,t,n){e.exports=n(1)()},function(e,t,n){"use strict";var o=n(2);function r(){}function i(){}i.resetWarningCache=r,e.exports=function(){function e(e,t,n,r,i,s){if(s!==o){var a=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw a.name="Invariant Violation",a}}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:i,resetWarningCache:r};return n.PropTypes=n,n}},function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},function(e,t,n){var o=n(4);"string"==typeof o&&(o=[[e.i,o,""]]);var r={insert:"head",singleton:!1};n(6)(o,r);o.locals&&(e.exports=o.locals)},function(e,t,n){(e.exports=n(5)(!1)).push([e.i,"body {\r\n    margin: 0;\r\n    background: #34495e;\r\n  }\r\n  #root a {\r\n    color: #ffcc00;\r\n  }\r\n  #root a:hover,\r\n  #root a:visited {\r\n    color: #ffcc00;\r\n    text-decoration: underline;\r\n  }\r\n  button {\r\n    outline: none;\r\n  }\r\n  .green {\r\n    background-color: #27ae60;\r\n  }\r\n  .red {\r\n    background-color: #e74c3c;\r\n  }\r\n  .purple {\r\n    background-color: #8e44ad;\r\n  }\r\n  .blue {\r\n    background-color: #2980b9;\r\n  }\r\n  .orange {\r\n    background-color: #e67e22;\r\n  }\r\n  .yellow {\r\n    background-color: #f1c40f;\r\n  }\r\n  .container {\r\n    position: absolute;\r\n    width: 100%;\r\n    top: 0;\r\n    bottom: 82px;\r\n    padding: 0;\r\n    margin: 0;\r\n  }\r\n  .flex-parent-centered {\r\n    position: absolute;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    top: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n  }\r\n  .transparent-for-clicks {\r\n    pointer-events: none;\r\n  }\r\n  .wrappy {\r\n    position: absolute;\r\n    display: inline;\r\n    color: #ecf0f1;\r\n    font-size: 12px;\r\n    line-height: 12px;\r\n    top: 20px;\r\n    left: 20px;\r\n    pointer-events: none;\r\n  }\r\n  .logo {\r\n    position: relative;\r\n    z-index: -1;\r\n    display: inline;\r\n    color: #2c3e50;\r\n    pointer-events: none;\r\n    text-align: center;\r\n  }\r\n  .logo-title {\r\n    font-size: 100px;\r\n    line-height: 100px;\r\n  }\r\n  .logo-subtitle {\r\n    font-size: 50px;\r\n    line-height: 50px;\r\n    margin-top: 20px;\r\n  }\r\n  .toolbar {\r\n    left: 0;\r\n    right: 0;\r\n    background-color: #2c3e50;\r\n  }\r\n  .toolbar-bottom {\r\n    position: absolute;\r\n    bottom: 0;\r\n  }\r\n  .toolbar-button {\r\n    color: #ecf0f1;\r\n    background-color: #2c3e50;\r\n    border: 0;\r\n    padding: 20px 25px;\r\n    font-size: 30px;\r\n    transition: background-color 150ms ease-in;\r\n  }\r\n  .toolbar-button-right {\r\n    float: right;\r\n  }\r\n  .toolbar-button-selected {\r\n    background-color: #8e44ad;\r\n    transition: background-color 150ms ease-in;\r\n  }\r\n  .toolbar-button:hover {\r\n    background-color: #8e44ad;\r\n    transition: background-color 150ms ease-in;\r\n  }\r\n  .popup-overlay {\r\n    position: absolute;\r\n    left: 0;\r\n    right: 0;\r\n    top: 0;\r\n    bottom: 0;\r\n    background-color: rgba(52, 73, 94, 0.8);\r\n  }\r\n  .popup-dialog {\r\n    position: relative;\r\n    width: 800px;\r\n    background-color: #2c3e50;\r\n    display: flex;\r\n    flex-direction: column;\r\n    box-shadow: 15px 15px 0 rgba(0, 0, 0, 0.35);\r\n  }\r\n  .popup-dialog-header,\r\n  .popup-dialog-footer {\r\n    display: block;\r\n  }\r\n  .popup-dialog-header {\r\n    color: #ecf0f1;\r\n    background-color: #8e44ad;\r\n    font-size: 30px;\r\n    height: 70px;\r\n    line-height: 30px;\r\n    padding: 20px;\r\n  }\r\n  .popup-dialog-content {\r\n    position: relative;\r\n    display: block;\r\n    color: #ecf0f1;\r\n    font-size: 30px;\r\n    line-height: 45px;\r\n    flex: 1;\r\n    padding: 20px;\r\n    background-color: #2c3e50;\r\n  }\r\n  .popup-dialog-content-quote {\r\n    color: #f1c40f;\r\n  }\r\n  .popup-dialog-footer {\r\n    padding: 0;\r\n  }\r\n  .popup-dialog-footer button {\r\n    float: right;\r\n  }\r\n  .cursor-overlay {\r\n    position: absolute;\r\n    left: 0;\r\n    right: 0;\r\n    top: 0;\r\n    bottom: 0;\r\n    cursor: move;\r\n    /*Use for debugging:*/\r\n  }\r\n  ",""])},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var n=function(e,t){var n=e[1]||"",o=e[3];if(!o)return n;if(t&&"function"==typeof btoa){var r=(s=o,a=btoa(unescape(encodeURIComponent(JSON.stringify(s)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(c," */")),i=o.sources.map(function(e){return"/*# sourceURL=".concat(o.sourceRoot).concat(e," */")});return[n].concat(i).concat([r]).join("\n")}var s,a,c;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2],"{").concat(n,"}"):n}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var o={},r=0;r<this.length;r++){var i=this[r][0];null!=i&&(o[i]=!0)}for(var s=0;s<e.length;s++){var a=e[s];null!=a[0]&&o[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="(".concat(a[2],") and (").concat(n,")")),t.push(a))}},t}},function(e,t,n){"use strict";var o,r={},i=function(){return void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o},s=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}();function a(e,t){for(var n=[],o={},r=0;r<e.length;r++){var i=e[r],s=t.base?i[0]+t.base:i[0],a={css:i[1],media:i[2],sourceMap:i[3]};o[s]?o[s].parts.push(a):n.push(o[s]={id:s,parts:[a]})}return n}function c(e,t){for(var n=0;n<e.length;n++){var o=e[n],i=r[o.id],s=0;if(i){for(i.refs++;s<i.parts.length;s++)i.parts[s](o.parts[s]);for(;s<o.parts.length;s++)i.parts.push(m(o.parts[s],t))}else{for(var a=[];s<o.parts.length;s++)a.push(m(o.parts[s],t));r[o.id]={id:o.id,refs:1,parts:a}}}}function l(e){var t=document.createElement("style");if(void 0===e.attributes.nonce){var o=n.nc;o&&(e.attributes.nonce=o)}if(Object.keys(e.attributes).forEach(function(n){t.setAttribute(n,e.attributes[n])}),"function"==typeof e.insert)e.insert(t);else{var r=s(e.insert||"head");if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");r.appendChild(t)}return t}var u,d=(u=[],function(e,t){return u[e]=t,u.filter(Boolean).join("\n")});function h(e,t,n,o){var r=n?"":o.css;if(e.styleSheet)e.styleSheet.cssText=d(t,r);else{var i=document.createTextNode(r),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(i,s[t]):e.appendChild(i)}}var p=null,f=0;function m(e,t){var n,o,r;if(t.singleton){var i=f++;n=p||(p=l(t)),o=h.bind(null,n,i,!1),r=h.bind(null,n,i,!0)}else n=l(t),o=function(e,t,n){var o=n.css,r=n.media,i=n.sourceMap;if(r&&e.setAttribute("media",r),i&&btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=o;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(o))}}.bind(null,n,t),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else r()}}e.exports=function(e,t){(t=t||{}).attributes="object"==typeof t.attributes?t.attributes:{},t.singleton||"boolean"==typeof t.singleton||(t.singleton=i());var n=a(e,t);return c(n,t),function(e){for(var o=[],i=0;i<n.length;i++){var s=n[i],l=r[s.id];l&&(l.refs--,o.push(l))}e&&c(a(e,t),t);for(var u=0;u<o.length;u++){var d=o[u];if(0===d.refs){for(var h=0;h<d.parts.length;h++)d.parts[h]();delete r[d.id]}}}}},function(e,t,n){"use strict";n.r(t);var o,r,i,s={},a=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;function l(e,t){for(var n in t)e[n]=t[n];return e}function u(e){var t=e.parentNode;t&&t.removeChild(e)}function d(e,t,n){var o,r,i,s,a=arguments;if(t=l({},t),arguments.length>3)for(n=[n],o=3;o<arguments.length;o++)n.push(a[o]);if(null!=n&&(t.children=n),null!=e&&null!=e.defaultProps)for(r in e.defaultProps)void 0===t[r]&&(t[r]=e.defaultProps[r]);return s=t.key,null!=(i=t.ref)&&delete t.ref,null!=s&&delete t.key,h(e,t,s,i)}function h(e,t,n,r){var i={type:e,props:t,key:n,ref:r,__k:null,__p:null,__b:0,__e:null,l:null,__c:null,constructor:void 0};return o.vnode&&o.vnode(i),i}function p(e){return e.children}function f(e){if(null==e||"boolean"==typeof e)return null;if("string"==typeof e||"number"==typeof e)return h(null,e,null,null);if(null!=e.__e||null!=e.__c){var t=h(e.type,e.props,e.key,null);return t.__e=e.__e,t}return e}function m(e,t){this.props=e,this.context=t}function _(e,t){if(null==t)return e.__p?_(e.__p,e.__p.__k.indexOf(e)+1):null;for(var n;t<e.__k.length;t++)if(null!=(n=e.__k[t])&&null!=n.__e)return n.__e;return"function"==typeof e.type?_(e):null}function b(e){!e.__d&&(e.__d=!0)&&1===r.push(e)&&(o.debounceRendering||i)(v)}function v(){var e;for(r.sort(function(e,t){return t.__v.__b-e.__v.__b});e=r.pop();)e.__d&&e.forceUpdate(!1)}function y(e,t,n,o,r,i,c,l){var d,h,p,m,b,v,y,E,x=t.__k||g(t.props.children,t.__k=[],f,!0),O=n&&n.__k||a,k=O.length;for(l==s&&(l=null!=i?i[0]:k?_(n,0):null),h=0;h<x.length;h++)if(null!=(d=x[h]=f(x[h]))){if(d.__p=t,d.__b=t.__b+1,null===(m=O[h])||m&&d.key==m.key&&d.type===m.type)O[h]=void 0;else for(p=0;p<k;p++){if((m=O[p])&&d.key==m.key&&d.type===m.type){O[p]=void 0;break}m=null}if(b=N(e,d,m=m||s,o,r,i,c,null,l),(p=d.ref)&&m.ref!=p&&(E||(E=[])).push(p,d.__c||b,d),null!=b){if(null==y&&(y=b),null!=d.l)b=d.l,d.l=null;else if(i==m||b!=l||null==b.parentNode)e:if(null==l||l.parentNode!==e)e.appendChild(b);else{for(v=l,p=0;(v=v.nextSibling)&&p<k;p+=2)if(v==b)break e;e.insertBefore(b,l)}l=b.nextSibling,"function"==typeof t.type&&(t.l=b)}}if(t.__e=y,null!=i&&"function"!=typeof t.type)for(h=i.length;h--;)null!=i[h]&&u(i[h]);for(h=k;h--;)null!=O[h]&&S(O[h],O[h]);if(E)for(h=0;h<E.length;h++)w(E[h],E[++h],E[++h])}function g(e,t,n,o){if(null==t&&(t=[]),null==e||"boolean"==typeof e)o&&t.push(null);else if(Array.isArray(e))for(var r=0;r<e.length;r++)g(e[r],t,n,o);else t.push(n?n(e):e);return t}function E(e,t,n){"-"===t[0]?e.setProperty(t,n):e[t]="number"==typeof n&&!1===c.test(t)?n+"px":n}function x(e,t,n,o,r){var i,s,a,c,l;if("key"===(t=r?"className"===t?"class":t:"class"===t?"className":t)||"children"===t);else if("style"===t)if(i=e.style,"string"==typeof n)i.cssText=n;else{if("string"==typeof o&&(i.cssText="",o=null),o)for(s in o)n&&s in n||E(i,s,"");if(n)for(a in n)o&&n[a]===o[a]||E(i,a,n[a])}else if("o"===t[0]&&"n"===t[1])c=t!==(t=t.replace(/Capture$/,"")),l=t.toLowerCase(),t=(l in e?l:t).slice(2),n?(o||e.addEventListener(t,O,c),(e.u||(e.u={}))[t]=n):e.removeEventListener(t,O,c);else if("list"!==t&&"tagName"!==t&&!r&&t in e)if(e.length&&"value"==t)for(t=e.length;t--;)e.options[t].selected=e.options[t].value==n;else e[t]=null==n?"":n;else"function"!=typeof n&&"dangerouslySetInnerHTML"!==t&&(t!==(t=t.replace(/^xlink:?/,""))?null==n||!1===n?e.removeAttributeNS("http://www.w3.org/1999/xlink",t.toLowerCase()):e.setAttributeNS("http://www.w3.org/1999/xlink",t.toLowerCase(),n):null==n||!1===n?e.removeAttribute(t):e.setAttribute(t,n))}function O(e){return this.u[e.type](o.event?o.event(e):e)}function N(e,t,n,r,i,s,a,c,u){var d,h,_,b,v,E,x,O,N,k,w=t.type;if(void 0!==t.constructor)return null;(d=o.__b)&&d(t);try{e:if("function"==typeof w){if(O=t.props,N=(d=w.contextType)&&r[d.__c],k=d?N?N.props.value:d.__p:r,n.__c?x=(h=t.__c=n.__c).__p=h.__E:(w.prototype&&w.prototype.render?t.__c=h=new w(O,k):(t.__c=h=new m(O,k),h.constructor=w,h.render=M),N&&N.sub(h),h.props=O,h.state||(h.state={}),h.context=k,h.__n=r,_=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=w.getDerivedStateFromProps&&l(h.__s==h.state?h.__s=l({},h.__s):h.__s,w.getDerivedStateFromProps(O,h.__s)),_)null==w.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&a.push(h);else{if(null==w.getDerivedStateFromProps&&null==c&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(O,k),!c&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(O,h.__s,k)){h.props=O,h.state=h.__s,h.__d=!1,h.__v=t,t.__e=n.__e,t.__k=n.__k;break e}null!=h.componentWillUpdate&&h.componentWillUpdate(O,h.__s,k)}for(b=h.props,v=h.state,h.context=k,h.props=O,h.state=h.__s,(d=o.__r)&&d(t),h.__d=!1,h.__v=t,h.__P=e,g(null!=(d=h.render(h.props,h.state,h.context))&&d.type==p&&null==d.key?d.props.children:d,t.__k=[],f,!0),null!=h.getChildContext&&(r=l(l({},r),h.getChildContext())),_||null==h.getSnapshotBeforeUpdate||(E=h.getSnapshotBeforeUpdate(b,v)),y(e,t,n,r,i,s,a,u),h.base=t.__e;d=h.__h.pop();)d.call(h);_||null==b||null==h.componentDidUpdate||h.componentDidUpdate(b,v,E),x&&(h.__E=h.__p=null)}else t.__e=C(n.__e,t,n,r,i,s,a);(d=o.diffed)&&d(t)}catch(e){o.__e(e,t,n)}return t.__e}function k(e,t){for(var n;n=e.pop();)try{n.componentDidMount()}catch(e){o.__e(e,n.__v)}o.__c&&o.__c(t)}function C(e,t,n,o,r,i,c){var l,u,d,h,p=n.props,f=t.props;if(r="svg"===t.type||r,null==e&&null!=i)for(l=0;l<i.length;l++)if(null!=(u=i[l])&&(null===t.type?3===u.nodeType:u.localName===t.type)){e=u,i[l]=null;break}if(null==e){if(null===t.type)return document.createTextNode(f);e=r?document.createElementNS("http://www.w3.org/2000/svg",t.type):document.createElement(t.type),i=null}return null===t.type?p!==f&&(e.data=f):t!==n&&(null!=i&&(i=a.slice.call(e.childNodes)),d=(p=n.props||s).dangerouslySetInnerHTML,h=f.dangerouslySetInnerHTML,null==i&&(h||d)&&(h&&d&&h.__html==d.__html||(e.innerHTML=h&&h.__html||"")),function(e,t,n,o,r){var i;for(i in n)i in t||x(e,i,null,n[i],o);for(i in t)r&&"function"!=typeof t[i]||"value"===i||"checked"===i||n[i]===t[i]||x(e,i,t[i],n[i],o)}(e,f,p,r,null!=i),h||y(e,t,n,o,"foreignObject"!==t.type&&r,i,c,s),null==i&&("value"in f&&void 0!==f.value&&f.value!==e.value&&(e.value=null==f.value?"":f.value),"checked"in f&&void 0!==f.checked&&f.checked!==e.checked&&(e.checked=f.checked))),e}function w(e,t,n){try{"function"==typeof e?e(t):e.current=t}catch(e){o.__e(e,n)}}function S(e,t,n){var r,i,s;if(o.unmount&&o.unmount(e),(r=e.ref)&&w(r,null,t),n||"function"==typeof e.type||(n=null!=(i=e.__e)),e.__e=e.l=null,null!=(r=e.__c)){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(e){o.__e(e,t)}r.base=r.__P=null}if(r=e.__k)for(s=0;s<r.length;s++)r[s]&&S(r[s],t,n);null!=i&&u(i)}function M(e,t,n){return this.constructor(e,n)}function T(e,t,n){var r,i;o.__p&&o.__p(e,t),r=n&&n.__k||t.__k,e=d(p,null,[e]),i=[],N(t,(n||t).__k=e,r||s,s,void 0!==t.ownerSVGElement,n?[n]:r?null:a.slice.call(t.childNodes),i,!1,n||s),k(i,e)}o={},m.prototype.setState=function(e,t){var n=this.__s!==this.state&&this.__s||(this.__s=l({},this.state));("function"!=typeof e||(e=e(n,this.props)))&&l(n,e),null!=e&&this.__v&&(t&&this.__h.push(t),b(this))},m.prototype.forceUpdate=function(e){var t,n,o,r=this.__v,i=this.__v.__e,s=this.__P;s&&(t=!1!==e,n=[],o=N(s,r,l({},r),this.__n,void 0!==s.ownerSVGElement,null,n,t,null==i?_(r):i),k(n,r),o!=i&&function e(t){var n,o;if(null!=(t=t.__p)&&null!=t.__c){for(t.__e=t.__c.base=null,n=0;n<t.__k.length;n++)if(null!=(o=t.__k[n])&&null!=o.__e){t.__e=t.__c.base=o.__e;break}return e(t)}}(r)),e&&e()},m.prototype.render=p,r=[],i="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,o.__e=function(e,t,n){for(var o;t=t.__p;)if((o=t.__c)&&!o.__p)try{if(o.constructor&&null!=o.constructor.getDerivedStateFromError)o.setState(o.constructor.getDerivedStateFromError(e));else{if(null==o.componentDidCatch)continue;o.componentDidCatch(e)}return b(o.__E=o)}catch(t){e=t}throw e};const L=(e,...t)=>(...n)=>e(...t,...n);const R=(e,t)=>e.filter(e=>e!=t),U=" ";function I(e,t){var n=U+t.className+U;return e=U+e+U,n&&n.indexOf(e)>-1}function A(e,t){return e===t.id}class P{static buildPath(e,t){var n,o=[];if(o.push(t),t===e)return o;for(n=t.parentNode;null!=n;){if(o.push(n),n===e)return o;n=n.parentNode}return!1}}class D{constructor(){this.slots=[]}connect(e){var t;this.isConnected(e)||(t=this.slots.length,this.slots.push(e),this.handleSubscription(t,this.slots.length))}disconnect(e){var t=this.slots.length;R(this.slots,function(t){return t===e}),this.handleSubscription(t,this.slots.length)}isConnected(e){return this.slots.some(function(t){return t===e})}handleSubscription(e,t){}createRayAndEmit(e,t,n){var o;n=n||window.event,o=new ue(n,t,{x:n.clientX,y:n.clientY}),this.emit(e,o)}emit(e,t){var n;this.slots.forEach(function(o){if(o){if(n=o[e],t&&!t.isAttached()&&!o.useDetachedRays)return console.warn("Ray has been detached",t.toString()),!1;n&&n(t)}})}}const H=["mouseover","onMouseOver"],j=["mouseout","onMouseOut"],W=["mouseenter","onMouseEnter"],V=["mouseleave","onMouseLeave"],K=["mousedown","onMouseDown"],B=["mouseup","onMouseUp"],z=["mousemove","onMouseMove"],F=["click","onClick"],Y=["doubleclick","onDoubleClick"],G=["contextmenu","onContextMenu"],q=["touchstart","onTouchStart"],X=["touchend","onTouchEnd"],J=["touchmove","onTouchMove"],Z=["touchcancel","onTouchCancel"],$=["change","onChange"],Q=["input","onInput"],ee=["submit","onSubmit"],te=["focus","onFocus"],ne=["blur","onBlur"],oe=["keydown","onKeyDown"],re=["keyup","onKeyUp"],ie=["press","onPress"],se=["wheel","onWheel"],ae=["resize","onResize"],ce=["scroll","onScroll"];function le(e,t){var n=t.id;return n&&0===n.indexOf(e)}class ue{constructor(e,t,n){this.e=e,this.target=e.target,this.root=t||document,this.position=n}_getPath(){return this.path||(this.path=P.buildPath(this.root,this.target)),this.path}getIntersections(e){var t=this._getPath();return e?(this.topDownPath||(this.topDownPath=t.reverse()),this.topDownPath):t}isAttached(){return!!this._getPath()}intersects(e){var t=this._getPath();return t&&t.indexOf(e)>-1}intersectsId(e,t){var n=t?A:le;return this.findNode(L(n,e))||!1}intersectsClass(e){return this.findNode(L(I,e))}findNode(e,t=!1){var n=this._getPath();return t?function(e=new Array(0),t){for(var n=e.length;n--;)if(t(e[n]))return e[n]}(n,e):n.find(e)}preventDefault(){this.e.preventDefault()}toString(){return"Ray("+this._getPath().length+" intersections)"}}var de;class he extends D{constructor(){super(),this[H[1]]=this.createRayAndEmit.bind(this,H[1],document),this[j[1]]=this.createRayAndEmit.bind(this,j[1],document),this[W[1]]=this.createRayAndEmit.bind(this,W[1],document),this[V[1]]=this.createRayAndEmit.bind(this,V[1],document),this[K[1]]=this.createRayAndEmit.bind(this,K[1],document),this[B[1]]=this.createRayAndEmit.bind(this,B[1],document),this[z[1]]=this.createRayAndEmit.bind(this,z[1],document),this[F[1]]=this.createRayAndEmit.bind(this,F[1],document),this[Y[1]]=this.createRayAndEmit.bind(this,Y[1],document),this[G[1]]=this.createRayAndEmit.bind(this,G[1],document),this[q[1]]=this.createRayAndEmit.bind(this,q[1],document),this[X[1]]=this.createRayAndEmit.bind(this,X[1],document),this[J[1]]=this.createRayAndEmit.bind(this,J[1],document),this[Z[1]]=this.createRayAndEmit.bind(this,Z[1],document),this[H[1]]=this.createRayAndEmit.bind(this,H[1],document),this[H[1]]=this.createRayAndEmit.bind(this,H[1],document),this[$[1]]=this.createRayAndEmit.bind(this,$[1],document),this[Q[1]]=this.createRayAndEmit.bind(this,Q[1],document),this[ee[1]]=this.createRayAndEmit.bind(this,ee[1],document),this[te[1]]=this.createRayAndEmit.bind(this,te[1],document),this[ne[1]]=this.createRayAndEmit.bind(this,ne[1],document),this[oe[1]]=this.createRayAndEmit.bind(this,oe[1],document),this[re[1]]=this.createRayAndEmit.bind(this,re[1],document),this[ie[1]]=this.createRayAndEmit.bind(this,ie[1],document),this[se[1]]=this.createRayAndEmit.bind(this,se[1],document),this[ae[1]]=this.createRayAndEmit.bind(this,ae[1],window),this[ce[1]]=this.createRayAndEmit.bind(this,ce[1],window)}static getInstance(){return de||(de=new he),de}handleSubscription(e,t){0===e&&t>=1?this.browserSubscribe():e&&0===t&&this.browserUnsubscribe()}browserSubscribe(){document.body.addEventListener(H[0],this[H[1]],!1),document.body.addEventListener(j[0],this[j[1]],!1),document.body.addEventListener(W[0],this[W[1]],!1),document.body.addEventListener(V[0],this[V[1]],!1),document.body.addEventListener(K[0],this[K[1]],!1),document.body.addEventListener(B[0],this[B[1]],!1),document.body.addEventListener(z[0],this[z[1]],!1),document.body.addEventListener(F[0],this[F[1]],!1),document.body.addEventListener(Y[0],this[Y[1]],!1),document.body.addEventListener(G[0],this[G[1]],!1),document.body.addEventListener(q[0],this[q[1]],!1),document.body.addEventListener(X[0],this[X[1]],!1),document.body.addEventListener(J[0],this[J[1]],!1),document.body.addEventListener(Z[0],this[Z[1]],!1),document.body.addEventListener($[0],this[$[1]],!1),document.body.addEventListener(Q[0],this[Q[1]],!1),document.body.addEventListener(ee[0],this[ee[1]],!1),document.body.addEventListener(te[0],this[te[1]],!1),document.body.addEventListener(ne[0],this[ne[1]],!1),document.body.addEventListener(oe[0],this[oe[1]],!1),document.body.addEventListener(re[0],this[re[1]],!1),document.body.addEventListener(ie[0],this[ie[1]],!1),document.body.addEventListener(se[0],this[se[1]],!1),window.addEventListener(ae[0],this[ae[1]],!1),window.addEventListener(ce[0],this[ce[1]],!1)}browserUnsubscribe(){document.body.removeEventListener(H[0],this[H[1]]),document.body.removeEventListener(j[0],this[j[1]]),document.body.removeEventListener(W[0],this[W[1]]),document.body.removeEventListener(V[0],this[V[1]]),document.body.removeEventListener(K[0],this[K[1]]),document.body.removeEventListener(B[0],this[B[1]]),document.body.removeEventListener(z[0],this[z[1]]),document.body.removeEventListener(F[0],this[F[1]]),document.body.removeEventListener(Y[0],this[Y[1]]),document.body.removeEventListener(G[0],this[G[1]]),document.body.removeEventListener(q[0],this[q[1]]),document.body.removeEventListener(X[0],this[X[1]]),document.body.removeEventListener(J[0],this[J[1]]),document.body.removeEventListener(Z[0],this[Z[1]]),document.body.removeEventListener($[0],this[$[1]]),document.body.removeEventListener(Q[0],this[Q[1]]),document.body.removeEventListener(ee[0],this[ee[1]]),document.body.removeEventListener(te[0],this[te[1]]),document.body.removeEventListener(ne[0],this[ne[1]]),document.body.removeEventListener(oe[0],this[oe[1]]),document.body.removeEventListener(re[0],this[re[1]]),document.body.removeEventListener(ie[0],this[ie[1]]),document.body.removeEventListener(se[0],this[se[1]]),window.removeEventListener(ae[0],this[ae[1]]),window.removeEventListener(ce[0],this[ce[1]])}}he.ON_MOUSE_OVER=H[1],he.ON_MOUSE_OUT=j[1],he.ON_MOUSE_ENTER=W[1],he.ON_MOUSE_LEAVE=V[1],he.ON_TOUCH_START_INSIDE=K[1],he.ON_MOUSE_UP=B[1],he.ON_MOUSE_MOVE=z[1],he.ON_CLICK=F[1],he.ON_DOUBLE_CLICK=Y[1],he.ON_CONTEXT_MENU=G[1],he.ON_TOUCH_START_INSIDE=q[1],he.ON_TOUCH_END=X[1],he.ON_TOUCH_MOVE=J[1],he.ON_TOUCH_CANCEL=Z[1],he.ON_CHANGE=$[1],he.ON_INPUT=Q[1],he.ON_SUBMIT=ee[1],he.ON_FOCUS=te[1],he.ON_BLUR=ne[1],he.ON_KEY_DOWN=oe[1],he.ON_KEY_UP=re[1],he.ON_PRESS=ie[1],he.ON_WHEEL=se[1],he.ON_RESIZE=ae[1],he.ON_SCROLL=ce[1],he.ON_MOUSE_OVER=H[1],he.ON_MOUSE_OUT=j[1],he.ON_MOUSE_ENTER=W[1],he.ON_MOUSE_LEAVE=V[1],he.ON_TOUCH_START_INSIDE=K[1],he.ON_MOUSE_UP=B[1],he.ON_MOUSE_MOVE=z[1],he.ON_CLICK=F[1],he.ON_DOUBLE_CLICK=Y[1],he.ON_CONTEXT_MENU=G[1],he.ON_TOUCH_START_INSIDE=q[1],he.ON_TOUCH_END=X[1],he.ON_TOUCH_MOVE=J[1],he.ON_TOUCH_CANCEL=Z[1],he.ON_CHANGE=$[1],he.ON_INPUT=Q[1],he.ON_SUBMIT=ee[1],he.ON_FOCUS=te[1],he.ON_BLUR=ne[1],he.ON_KEY_DOWN=oe[1],he.ON_KEY_UP=re[1],he.ON_PRESS=ie[1],he.ON_WHEEL=se[1],he.ON_RESIZE=ae[1],he.ON_SCROLL=ce[1];const pe="#8e44ad",fe="#2980b9",me="#f1c40f",_e=[pe,"#e67e22","#e74c3c",fe,me],be=0;class ve{static getRect(){var e=document.documentElement,t=document.body;return{x:0,y:0,width:window.innerWidth||e.clientWidth||t.clientWidth,height:window.innerHeight||e.clientHeight||t.clientHeight}}}class ye{static executeCommand(e,t,n,o){var r=t[n],i=!1;switch(e){case"increase-x":r.x+=10,i=!0;break;case"decrease-x":r.x-=10,i=!0;break;case"increase-y":r.y+=10,i=!0;break;case"decrease-y":r.y-=10,i=!0;break;case"increase-r":r.r+=10,i=!0;break;case"decrease-r":r.r-=10,i=!0;break;case"bring-to-front":!function(e,t,n){e.splice(n,1),e.push(t)}(t,r,n);break;case"send-to-back":!function(e,t,n){e.splice(n,1),e.unshift(t)}(t,r,n);break;case"new-circle":!function(e,t,n){var o=Math.floor(150*Math.random())+50,r=_e[Math.floor(Math.random()*_e.length)],i={x:e.x,y:e.y-n,r:o,color:r};t.push(i)}(o,t,be);break;case"random-circle":!function(e,t){var n=ve.getRect(),o={x:Math.floor(Math.random()*n.width),y:Math.floor(Math.random()*n.height)-t,r:Math.floor(150*Math.random())+50,color:_e[Math.floor(Math.random()*_e.length)]};e.push(o)}(t,be);break;case"remove-circle":!function(e,t){e.splice(t,1)}(t,n);break;case"move":!function(e,t){e.forEach(function(e){e.x+=t.x,e.y+=t.y})}(t,o);break;case"clear":!function(e){e.splice(0,e.length)}(t)}return i&&(r.x=Math.max(r.x,10),r.y=Math.max(r.y,10),r.r=Math.max(r.r,10)),t}}const ge="about-popup",Ee="cancel",xe="github";class Oe extends m{render(){return d("div",null,d("div",{className:"popup-overlay"}),d("div",{className:"flex-parent-centered"},d("div",{id:ge,className:"popup-dialog"},d("span",{className:"popup-dialog-header"},"About"),d("div",{className:"popup-dialog-content"},d("p",null,"This demo was built using ",d("a",{href:"https://facebook.github.io/react/",target:"_blank"},"ReactJS")," and ",d("a",{href:"https://github.com/dkozar/raycast-dom",target:"_blank"},"Raycast"),"."),d("p",null,'It is a proof of concept that one could build relatively complex apps using Raycast, without using any of the "classic" React event handlers.'),d("p",{className:"popup-dialog-content-quote"},"To see the code, please visit the project page on GitHub.")),d("div",{className:"popup-dialog-footer"},d("button",{className:"toolbar-button",id:xe},d("span",{className:"fa fa-github-alt"}),"  Go to GitHub"),d("button",{className:"toolbar-button",id:Ee},d("span",{className:"fa fa-close"}),"  Close")))))}}const Ne="new-circle",ke="clear",Ce="open-popup",we="star";class Se extends m{render(){return d("div",{className:"toolbar toolbar-bottom"},d("button",{id:ke,className:"toolbar-button"},d("i",{className:"fa fa-remove"}),"  Clear"),d("button",{id:Ne,className:"toolbar-button"},d("i",{className:"fa fa-plus-circle"}),"  New circle"),d("button",{id:Ce,className:"toolbar-button"},d("i",{className:"fa fa-info-circle"}),"  Open popup"),d("button",{id:we,className:"toolbar-button toolbar-button-right"},d("i",{className:"fa fa-star"})))}}var Me=n(0),Te=n.n(Me);const Le="circle-";class Re extends m{render(){var e=this.props.hovered,t=e||this.props.selected,n={cx:this.props.x,cy:this.props.y,r:this.props.r,fill:this.props.color,strokeWidth:t?5:0,stroke:e?this.props.strokeColorHovered:this.props.strokeColorSelected};return d("circle",Object.assign({},n,{id:this.props.id}))}}Re.propTypes={id:Te.a.string.isRequired,strokeColorSelected:Te.a.string,strokeColorHovered:Te.a.string,selected:Te.a.bool,hovered:Te.a.bool},Re.defaultProps={strokeColorSelected:"white",strokeColorHovered:"white",selected:!1,hovered:!1};class Ue extends m{render(){return d("div",{className:"cursor-overlay"})}}const Ie="example-popup",Ae="cancel";class Pe extends m{render(){return d("div",null,d("div",{className:"popup-overlay"}),d("div",{className:"flex-parent-centered"},d("div",{id:Ie,className:"popup-dialog"},d("span",{className:"popup-dialog-header"},"Example popup"),d("div",{className:"popup-dialog-content"},d("p",null,"This is the popup."),d("ul",null,d("li",null,"Clicking outside this popup will close it."),d("li",null,"Clicking inside will keep it open.")),d("p",{className:"popup-dialog-content-quote"},"[ with rays, it's easy to test an element against clicking outside ]")),d("div",{className:"popup-dialog-footer"},d("button",{className:"toolbar-button",id:Ae},d("span",{className:"fa fa-close"}),"  Close")))))}}class De extends m{render(){return d("div",{className:"flex-parent-centered transparent-for-clicks"},d("div",{className:"logo"},d("div",{className:"logo-title"},"Raycast demo"),d("div",{className:"logo-subtitle"},"[ touch the screen ]")))}}class He extends m{render(){return d("svg",{x:this.props.top,width:this.props.width,height:this.props.height},this.props.children)}}const je=["Click the circle to bring it to the top.","Click the background to create new circle.","Click and drag the circle to move all the circles.","Shift + click = clear screen","Alt + click + mouse move = new circle",'"Clear" button removes all the circles.','"New circle" button creates the circle at last click position.'];class We extends m{constructor(e){super(e),this.state={index:0,text:je[0]}}render(){return d("span",{className:"wrappy"},je.map(e=>d("p",{key:e},e)))}}n(3);const Ve="https://github.com/dkozar/raycast-dom",Ke=Ve+"/stargazers";class Be{constructor(e,t){this.x=e,this.y=t}add(e){return new Be(this.x+e.x,this.y+e.y)}subtract(e){return new Be(this.x-e.x,this.y-e.y)}toObject(){return{x:this.x,y:this.y}}static fromObject(e){return new Be(e.x,e.y)}}T(d(class extends m{constructor(e){super(e),this.canvasRef={},this.rootRef={},this.state={circles:[{x:150,y:500,r:100,color:fe},{x:700,y:250,r:150,color:me},{x:800,y:700,r:80,color:pe}],hoveredCircleIndex:-1,selectedCircleIndex:-1,draggedCircleIndex:-1,popupVisible:ge,mousePosition:{x:0,y:0}},this.executeCommand=this.executeCommand.bind(this),he.getInstance().connect({onMouseOver:this.onMouseOver.bind(this),onMouseOut:this.onMouseOut.bind(this),onMouseMove:this.onMouseMove.bind(this),onMouseDown:this.onMouseDown.bind(this),onMouseUp:this.onMouseUp.bind(this),onClick:this.onClick.bind(this),onKeyDown:this.onKeyDown.bind(this),onKeyUp:this.onKeyUp.bind(this),onTouchStart:this.onTouchStart.bind(this),onTouchEnd:this.onTouchEnd.bind(this),onTouchMove:this.onTouchMove.bind(this)})}onMouseOver(e){var t,n,o=e.intersectsId(Le);o&&(t=o.id,n=parseInt(t.split(Le)[1]),this.setState({hoveredCircleIndex:n}))}onMouseOut(e){e.intersectsId(Le)&&this.setState({hoveredCircleIndex:-1})}handleMouseOrTouchDown(e,t){var n,o,r,i=this;if(this.setState({mouseIsDown:!0,isTouch:t}),this.state.popupVisible)e.intersectsId(Ie)||e.intersectsId(ge)||this.setState({popupVisible:!1});else if(e.intersects(this.canvasRef.current)){if(n=e.intersectsId(Le))return o=n.id,r=parseInt(o.split(Le)[1]),void this.setState({selectedCircleIndex:r,draggedCircleIndex:r,dragOrigin:e.position},function(){i.executeCommand("bring-to-front"),i.selectCircleOnTop()});this.setState({mousePosition:e.position,selectedCircleIndex:-1,draggedCircleIndex:-1},function(){e.e.shiftKey&&i.executeCommand("clear"),i.executeCommand("new-circle"),i.selectCircleOnTop()})}}onMouseDown(e){this.handleMouseOrTouchDown(e)}onTouchStart(e){var t=e.e.changedTouches[0];e.position={x:t.clientX,y:t.clientY},this.handleMouseOrTouchDown(e,!0)}handleMouseOrTouchUp(e,t){this.state.delta&&ye.executeCommand("move",this.state.circles,null,this.state.delta),this.setState({mouseIsDown:!1,draggedCircleIndex:-1,delta:null})}onMouseUp(e){this.handleMouseOrTouchUp(e)}onTouchEnd(e){this.handleMouseOrTouchUp(e,!0)}handleMouseOrTouchMove(e,t){var n=this,o=e.position;this.state.mouseIsDown&&(!t&&e.e.altKey&&e.intersects(this.rootRef.current)?this.setState({mousePosition:o},function(){n.executeCommand("new-circle")}):this.state.draggedCircleIndex>-1&&this.setState({delta:Be.fromObject(o).subtract(this.state.dragOrigin)}))}onMouseMove(e){this.handleMouseOrTouchMove(e)}onTouchMove(e){var t=e.e.changedTouches[0];e.position={x:t.clientX,y:t.clientY},this.handleMouseOrTouchMove(e,!0),e.preventDefault()}onClick(e){e.intersectsId(Ne)?this.executeCommand("random-circle"):e.intersectsId(ke)?this.executeCommand("clear"):e.intersectsId(Ce)?this.setState({popupVisible:Ie}):e.intersectsId(Ae)?this.setState({popupVisible:!1}):e.intersectsId(xe)?window.open(Ve,"_blank"):e.intersectsId(we)&&window.open(Ke,"_blank")}onKeyDown(e){"Escape"===e.e.key&&this.setState({draggedCircleIndex:-1,delta:null})}onKeyUp(e){"Escape"===e.e.key&&this.setState({popupVisible:!1})}selectCircle(e){this.state.selectedCircleIndex=function(e){return parseInt(e.id.split("-")[1])}(e)}selectCircleOnTop(){this.setState({selectedCircleIndex:this.state.circles.length-1})}executeCommand(e){var t,n;t=this.state.mousePosition,n=ye.executeCommand(e,this.state.circles,this.state.selectedCircleIndex,t),this.setState({circles:n})}render(){var e=this,t=e.state.delta,n=0,o=this.state.circles.map(function(o){var r,i,s=Le+n;return t&&(r=Be.fromObject(o).add(t).toObject()),i=d(Re,Object.assign({},o,r,{id:s,key:s,strokeColor:"white",hovered:e.state.hoveredCircleIndex===n,selected:e.state.selectedCircleIndex===n})),n++,i}),r=this.state.popupVisible===ge&&d(Oe,null)||this.state.popupVisible===Ie&&d(Pe,null),i=this.state.mouseIsDown&&!this.state.isTouch&&this.state.draggedCircleIndex>-1&&d(Ue,null);return d("div",{ref:this.rootRef},d("div",{ref:this.canvasRef,className:"container"},d(De,null),d(He,{width:"100%",height:"100%"},o),d(We,null)),d(Se,null),r,i)}},null),document.getElementById("root"))}]);