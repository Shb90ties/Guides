/**
 * Global Functions
 * @type {{methods: {debounce: ((func?, wait?, immediate?))}}}
 */

let debounce = {
    methods: {
        debounce(func, wait, immediate){
            let timeout;
            return function () {
                let context = this, args = arguments;
                let later = function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                let callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }
    }
};

let globalAnimations = {
    methods: {
        animateScroll(elem, style, unit, from, to, time, prop) {
            if (!elem) {
                return;
            }
            var start = new Date().getTime(),
                timer = setInterval(function () {
                    var step = Math.min(1, (new Date().getTime() - start) / time);
                    if (prop) {
                        elem[style] = (from + step * (to - from))+unit;
                    } else {
                        elem.style[style] = (from + step * (to - from))+unit;
                    }
                    if (step === 1) {
                        clearInterval(timer);
                    }
                }, 25);
            if (prop) {
                elem[style] = from+unit;
            } else {
                elem.style[style] = from+unit;
            }
        },
        scrollTop(el, duration=150,to=0) {
            // function added by Ilan 3/12/17
            if (!el || duration < 0 || el.scrollTop <= 0 ) return;
            var frame = 10;
            var perTick = - (el.scrollTop / duration * frame) - 1 ;
                setTimeout(()=> {
                    el.scrollTop += perTick ;
                    this.scrollTop(el, duration );
                }, frame);
        },
    }
};
let windowScrollY =false;

let globalFunctions = {
    methods: {
        // togglePageScrolling(inner, className) {
        //     if(!inner) {
        //         if (document.body.style.overflowY == 'hidden') {
        //             document.body.style.overflowY = 'initial';
        //             document.documentElement.style.overflowY = 'initial';
        //         }
        //         else {
        //             document.body.style.overflowY = 'hidden';
        //             document.documentElement.style.overflowY = 'hidden';
        //         }
        //     } else if (className) {
        //         var elem = document.querySelector('.' + className);
        //         if (elem && elem.style.overflowY != 'hidden') {
        //             elem.style.overflowY = 'hidden';
        //         } else if (elem) {
        //             elem.style.overflowY = 'scroll';
        //         }
        //     } else {
        //         if(inner == 'disable') {
        //             document.body.style.overflowY = 'hidden';
        //             document.documentElement.style.overflowY = 'hidden';
        //         }
        //         else if(inner == 'enable') {
        //             document.body.style.overflowY = 'initial';
        //             document.documentElement.style.overflowY = 'initial';
        //         }
        //     }
        // },
        // ===========LET/PREVENT WINDOW SCROLLING===============
        // TODO: ILAN: refactor after talking to yehudit
        // TODO: check if it works in firefox & make it toggle without passing actionType
        togglePageScrolling(actionType,className){
             if (className) {
                 var elem = document.querySelector('.' + className);
                 if (elem && elem.style.overflowY != 'hidden') {
                     elem.style.overflowY = 'hidden';
                 } else if (elem) {
                     elem.style.overflowY = 'initial';
                 }
             } else {
                 if (document.body.hasAttribute('lock-scroll')) {
                     document.body.removeAttribute('lock-scroll');
                     window.removeEventListener('scroll', this.stopWindowScroll);
                 } else {
                     document.body.setAttribute('lock-scroll', 'true');
                     window.addEventListener('scroll', this.stopWindowScroll);
                 }
                 // if (actionType) {
                 //     (actionType === 'enable') ? this.letWindowScroll() : this.preventWindowScroll();
                 // } else {
                 //     (windowScrollY) ? this.letWindowScroll() : this.preventWindowScroll();
                 // }
             }
        },
        preventWindowScroll(){
            windowScrollY = window.scrollY;
            window.addEventListener('scroll', this.stopWindowScroll);
        },
        letWindowScroll(){
            window.removeEventListener('scroll', this.stopWindowScroll);
            windowScrollY= false;
        },
        stopWindowScroll() {
            var diff = windowScrollY - window.scrollY;
            window.scrollBy(0,diff);
        },
        // ===========END LET/PREVENT WINDOW SCROLLING===============
        getTextFromHtml(htmlString) {
            var wrapper= document.createElement('div');
            wrapper.innerHTML= htmlString;
            var divElem = wrapper.firstChild;
            var outPut = [];
            this.insertTextFromElement(divElem, outPut);
            return outPut;
        },
        insertTextFromElement(node, outPutArray){
            node.childNodes.forEach((element) => {
                if(element.nodeName == '#text'){
                    outPutArray.push(element.nodeValue+' ');
                }
                else{
                    this.insertTextFromElement(element, outPutArray);
                }
            })
        },
        getComponent(rootParent, componentName) {
            /**
             * recursive function, returns the last occurance of the component
             */
            var output = null;
            if (rootParent.$children) {
                for (var childIndex in rootParent.$children) {
                    var child = rootParent.$children[childIndex];
                    if (child.$vnode && child.$vnode.componentOptions && child.$vnode.componentOptions.tag == componentName) {
                        output = child; break;
                    } else {
                        var recursiveResult = this.getComponent(child, componentName);
                        if (recursiveResult) {
                            output = recursiveResult;
                        }
                    }
                }
            }
            return output;
        },
        getEventPath: function(event) {
            var path = [];
            var currentElem = event.target;
            while (currentElem) {
                path.push(currentElem);
                currentElem = currentElem.parentElement;
            }
            if (path.indexOf(window) === -1 && path.indexOf(document) === -1) {
                path.push(document);
            }
            if (path.indexOf(window) === -1) {
                path.push(window);
            }
            return path;
        },
        stopPropagation: function(event) {
            if (!event) { event = window.event; }
            //IE9 & Other Browsers
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            //IE8 and Lower
            else {
                event.cancelBubble = true;
            }
        },
        // TODO: ILAN. change to el instead of targetClass- what if we have more then 1 elements with that class name?
        // user should aim to the specific element he want to toggle
        toggleClassToDisplayNone: function (targetClass, toggleClass, miliseconds = 300, display = 'inline-block') {
            var obj = document.querySelector('.' + targetClass);
            if (obj) {
                if (obj.classList.contains(toggleClass)) {
                    obj.classList.remove(toggleClass);
                    setTimeout(() => {
                        obj.style.display = 'none';
                    }, miliseconds);
                } else {
                    obj.style.display = display;
                    setTimeout(() => {
                        obj.classList.add(toggleClass);
                    }, 10);
                }
            }
        },
        // TODO: ILAN. change to el instead of containerClassName/childSelector- what if we have more then 1 elements with that class name?
        // user should aim to the specific element he want to toggle
        makeItSticky(containerClassName, childSelector, top = 0, zIndex = 10, containerDisplay = 'block', hasPlaceholder = true) {
            // Only after the component is mounted/been rendered, pass container class name and component name
                // childSelector can be "className" or "#id"
            if (document.querySelector('.' + containerClassName)) {
                var parentElem = document.querySelector('.' + containerClassName);
                var childSelector = (childSelector.indexOf('#') != -1) ? childSelector : ' .' + childSelector;
                var elem = document.querySelector('.' + containerClassName + ' ' + childSelector);
                if (!elem) { return; }
                var parentStyle = 'min-height:'+elem.offsetHeight+'px;display:'+containerDisplay+';px;position:relative;z-index:'+zIndex;
                if (hasPlaceholder) {
                    parentElem.style = parentStyle;
                }
                var childStyleOnScroll = 'position:fixed;top:'+top+'px;z-index:'+zIndex+';';
                var isSticky = false;
                window.addEventListener('scroll', () => {
                    if (window.scrollY >= parentElem.offsetTop) {
                        elem.style = childStyleOnScroll;
                        if (hasPlaceholder) {
                            elem.style.width = parentElem.offsetWidth + 'px';
                            elem.style.left = parentElem.offsetLeft + 'px';
                        }
                        isSticky = true;
                    } else {
                        elem.style = '';
                        isSticky = false;
                    }
                });
                if (hasPlaceholder) {
                    window.addEventListener('resize', () => {
                        if (isSticky) {
                            elem.style.width = parentElem.offsetWidth + 'px';
                            elem.style.left = parentElem.offsetLeft + 'px';
                        }
                    });
                }
            }
        },
    }
};

let validations = {
    methods: {
        checkEmailValid: function (emailStr) {
            var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(emailStr);
        },
        checkPhoneValid: function (phoneStr) {
            var phoneRegex = /^0\d([\d]{0,1})([-]{0,1})\d{7}$/;
            return phoneRegex.test(phoneStr);
        }
    }
};

export {debounce, globalAnimations, globalFunctions, validations};