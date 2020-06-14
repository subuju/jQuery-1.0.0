jQuery.fn = jQuery.prototype = {
    jquery: "$Rev: 509 $",

    size: function () {
        return this.length;
    },

    get: function (num) {
        // Watch for when an array (of elements) is passed in
        if (num && num.constructor == Array) {

            // Use a tricky hack to make the jQuery object
            // look and feel like an array
            this.length = 0;
            [].push.apply(this, num);

            return this;
        } else
            return num == undefined ?

                // Return a 'clean' array
                jQuery.map(this, function (a) { return a }) :

                // Return just the object
                this[num];
    },
    each: function (fn, args) {
        console.log('enter each function(fn, args)');
        return jQuery.each(this, fn, args);
    },

    index: function (obj) {
        var pos = -1;
        this.each(function (i) {
            if (this == obj) pos = i;
        });
        return pos;
    },

    attr: function (key, value, type) {
        // Check to see if we're setting style values
        return key.constructor != String || value != undefined ?
            this.each(function () {
                // See if we're setting a hash of styles
                if (value == undefined)
                    // Set all the styles
                    for (var prop in key)
                        jQuery.attr(
                            type ? this.style : this,
                            prop, key[prop]
                        );

                // See if we're setting a single key/value style
                else
                    jQuery.attr(
                        type ? this.style : this,
                        key, value
                    );
            }) :

            // Look for the case where we're accessing a style value
            jQuery[type || "attr"](this[0], key);
    },

    css: function (key, value) {
        return this.attr(key, value, "curCSS");
    },
    text: function (e) {
        e = e || this;
        var t = "";
        for (var j = 0; j < e.length; j++) {
            var r = e[j].childNodes;
            for (var i = 0; i < r.length; i++)
                t += r[i].nodeType != 1 ?
                    r[i].nodeValue : jQuery.fn.text([r[i]]);
        }
        return t;
    },
    wrap: function () {
        // The elements to wrap the target around
        var a = jQuery.clean(arguments);

        // Wrap each of the matched elements individually
        return this.each(function () {
            // Clone the structure that we're using to wrap
            var b = a[0].cloneNode(true);

            // Insert it before the element to be wrapped
            this.parentNode.insertBefore(b, this);

            // Find he deepest point in the wrap structure
            while (b.firstChild)
                b = b.firstChild;

            // Move the matched element to within the wrap structure
            b.appendChild(this);
        });
    },
    append: function () {
        return this.domManip(arguments, true, 1, function (a) {
            this.appendChild(a);
        });
    },
    prepend: function () {
        return this.domManip(arguments, true, -1, function (a) {
            this.insertBefore(a, this.firstChild);
        });
    },
    before: function () {
        return this.domManip(arguments, false, 1, function (a) {
            this.parentNode.insertBefore(a, this);
        });
    },
    after: function () {
        return this.domManip(arguments, false, -1, function (a) {
            this.parentNode.insertBefore(a, this.nextSibling);
        });
    },
    end: function () {
        return this.get(this.stack.pop());
    },
    find: function (t) {
        return this.pushStack(jQuery.map(this, function (a) {
            return jQuery.find(t, a);
        }), arguments);
    },

    clone: function (deep) {
        return this.pushStack(jQuery.map(this, function (a) {
            return a.cloneNode(deep != undefined ? deep : true);
        }), arguments);
    },

    filter: function (t) {
        return this.pushStack(
            t.constructor == Array &&
            jQuery.map(this, function (a) {
                for (var i = 0; i < t.length; i++)
                    if (jQuery.filter(t[i], [a]).r.length)
                        return a;
            }) ||

            t.constructor == Boolean &&
            (t ? this.get() : []) ||

            t.constructor == Function &&
            jQuery.grep(this, t) ||

            jQuery.filter(t, this).r, arguments);
    },

    not: function (t) {
        return this.pushStack(t.constructor == String ?
            jQuery.filter(t, this, false).r :
            jQuery.grep(this, function (a) { return a != t; }), arguments);
    },

    add: function (t) {
        return this.pushStack(jQuery.merge(this, t.constructor == String ?
            jQuery.find(t) : t.constructor == Array ? t : [t]), arguments);
    },
    is: function (expr) {
        return expr ? jQuery.filter(expr, this).r.length > 0 : this.length > 0;
    },
    domManip: function (args, table, dir, fn) {
        var clone = this.size() > 1;
        var a = jQuery.clean(args);

        return this.each(function () {
            var obj = this;

            if (table && this.nodeName == "TABLE" && a[0].nodeName != "THEAD") {
                var tbody = this.getElementsByTagName("tbody");

                if (!tbody.length) {
                    obj = document.createElement("tbody");
                    this.appendChild(obj);
                } else
                    obj = tbody[0];
            }

            for (var i = (dir < 0 ? a.length - 1 : 0);
                i != (dir < 0 ? dir : a.length); i += dir) {
                fn.apply(obj, [clone ? a[i].cloneNode(true) : a[i]]);
            }
        });
    },
    pushStack: function (a, args) {
        var fn = args && args[args.length - 1];

        if (!fn || fn.constructor != Function) {
            if (!this.stack) this.stack = [];
            this.stack.push(this.get());
            this.get(a);
        } else {
            var old = this.get();
            this.get(a);
            if (fn.constructor == Function)
                return this.each(fn);
            this.get(old);
        }

        return this;
    },

    extend = function (obj, prop) {
        if (!prop) {
            prop = obj;
            obj = this;
        }
        for (var i in prop) {
            obj[i] = prop[i];
        }
        return obj;
    },


    /*n="a.parentNode"*/
    parent: function (a) {
        var ret = jQuery.map(this, n);
        if (a && a.constructor == String)
            ret = jQuery.filter(a, ret).r;
        return this.pushStack(ret, arguments);
    },


    /*n=parents: function (elem) {
        var matched = [];
        var cur = elem.parentNode;
        while (cur && cur != document) {
            matched.push(cur);
            cur = cur.parentNode;
        }
        return matched;
    },*/
    ancestors: function (a) {
        var ret = jQuery.map(this, n);
        if (a && a.constructor == String)
            ret = jQuery.filter(a, ret).r;
        return this.pushStack(ret, arguments);
    },


    /*n=parents: function (elem) {
        var matched = [];
        var cur = elem.parentNode;
        while (cur && cur != document) {
            matched.push(cur);
            cur = cur.parentNode;
        }
        return matched;
    },*/
    parents: function (a) {
        var ret = jQuery.map(this, n);
        if (a && a.constructor == String)
            ret = jQuery.filter(a, ret).r;
        return this.pushStack(ret, arguments);
    },

    /*
    n="jQuery.sibling(a).next"
    */
    next: function (a) {
        var ret = jQuery.map(this, n);
        if (a && a.constructor == String)
            ret = jQuery.filter(a, ret).r;
        return this.pushStack(ret, arguments);
    },

    /*
    n="jQuery.sibling(a).prev"
    */
    prev: function (a) {
        var ret = jQuery.map(this, n);
        if (a && a.constructor == String)
            ret = jQuery.filter(a, ret).r;
        return this.pushStack(ret, arguments);
    },

    /*
    n = sibling: function (elem, pos, not) {
        var elems = [];

        var siblings = elem.parentNode.childNodes;
        for (var i = 0; i < siblings.length; i++) {
            if (not === true && siblings[i] == elem) continue;

            if (siblings[i].nodeType == 1)
                elems.push(siblings[i]);
            if (siblings[i] == elem)
                elems.n = elems.length - 1;
        }

        return jQuery.extend(elems, {
            last: elems.n == elems.length - 1,
            cur: pos == "even" && elems.n % 2 == 0 || pos == "odd" && elems.n % 2 || elems[pos] == elem,
            prev: elems[elems.n - 1],
            next: elems[elems.n + 1]
        });
    },
    */
    sibling: function (a) {
        var ret = jQuery.map(this, n);
        if (a && a.constructor == String)
            ret = jQuery.filter(a, ret).r;
        return this.pushStack(ret, arguments);
    },

    /*
    n="a.childNodes"
    */
    children: function (a) {
        var ret = jQuery.map(this, n);
        if (a && a.constructor == String)
            ret = jQuery.filter(a, ret).r;
        return this.pushStack(ret, arguments);
    },


    /*n="append" */
    appendTo: function () {
        var a = arguments;
        return this.each(function () {
            for (var j = 0; j < a.length; j++)
                $(a[j])[n](this);
        });
    },

    /* n = "prepend" */
    prependTo: function () {
        var a = arguments;
        return this.each(function () {
            for (var j = 0; j < a.length; j++)
                $(a[j])[n](this);
        });
    },

    /* n = "before" */
    insertBefore: function () {
        var a = arguments;
        return this.each(function () {
            for (var j = 0; j < a.length; j++)
                $(a[j])[n](this);
        });
    },

    /* n = "after" */
    insertAfter: function () {
        var a = arguments;
        return this.each(function () {
            for (var j = 0; j < a.length; j++)
                $(a[j])[n](this);
        });
    },

    /* n = function (key) {
            this.removeAttribute(key);
        },
    */
    removeAttr: function () {
        return this.each(n, arguments);
    },


    /*n = function () {
            this.style.display = this.oldblock ? this.oldblock : "";
            if (jQuery.css(this, "display") == "none")
                this.style.display = "block";
        }, */
    _show: function () {
        return this.each(n, arguments);
    },

    /* n = function () {
        this.oldblock = this.oldblock || jQuery.css(this, "display");
        if (this.oldblock == "none")
            this.oldblock = "block";
        this.style.display = "none";
    },*/
    _hide: function () {
        return this.each(n, arguments);
    },


    /*
        n = function () {
            $(this)[$(this).is(":hidden") ? "show" : "hide"].apply($(this), arguments);
        },
    */
    toggle: function () {
        return this.each(n, arguments);
    },

    /*
        n=function (c) {
            jQuery.className.add(this, c);
        },

    */
    addClass: function () {
        return this.each(n, arguments);
    },


    /*
    n = function (c) {
        jQuery.className.remove(this, c);
    },
    */
    removeClass: function () {
        return this.each(n, arguments);
    },

    /*
    n =  function (c) {
        jQuery.className[jQuery.className.has(this, c) ? "remove" : "add"](this, c);
    },
    */
    toggleClass: function () {
        return this.each(n, arguments);
    },

    /*
    n = function (a) {
        if (!a || jQuery.filter([this], a).r)
            this.parentNode.removeChild(this);
    },
    */
    remove: function () {
        return this.each(n, arguments);
    },


    /*
    n = function () {
        while (this.firstChild)
            this.removeChild(this.firstChild);
    },

    */
    empty: function () {
        return this.each(n, arguments);
    },


    /*
     n =  function (type, fn) {
        if (fn.constructor == String)
            fn = new Function("e", (!fn.indexOf(".") ? "$(this)" : "return ") + fn);
        jQuery.event.add(this, type, fn);
    },
    */
    bind: function () {
        return this.each(n, arguments);
    },


    /*
     n = function (type, fn) {
        jQuery.event.remove(this, type, fn);
    },
    */
    unbind: function () {
        return this.each(n, arguments);
    },

    /*
        n = function (type, data) {
            jQuery.event.trigger(type, data, this);
        }
    */
    trigger: function () {
        return this.each(n, arguments);
    },

    /*
        n = "eq"
    */
    eq: function (num, fn) {
        return this.filter(":" + n + "(" + num + ")", fn);
    },

    /*
        n = "lt"
    */
    lt: function (num, fn) {
        return this.filter(":" + n + "(" + num + ")", fn);
    },

    /*
        n = "gt"
    */
    gt: function (num, fn) {
        return this.filter(":" + n + "(" + num + ")", fn);
    },

    /*
        n = "contains"
    */
    contains: function (num, fn) {
        return this.filter(":" + n + "(" + num + ")", fn);
    },


    /*
        n = "value"
    */
    val: function (h) {
        return h == undefined ?
            this.length ? this[0][n] : null :
            this.attr(n, h);
    },

    /*
        n = "innerHTML"
    */
    html: function (h) {
        return h == undefined ?
            this.length ? this[0][n] : null :
            this.attr(n, h);
    },

    /*
        n = "id"
    */
    id: function (h) {
        return h == undefined ?
            this.length ? this[0][n] : null :
            this.attr(n, h);
    },


    /*
        n = "title"
    */
    title: function (h) {
        return h == undefined ?
            this.length ? this[0][n] : null :
            this.attr(n, h);
    },

    /*
        n = "name"
    */
    name: function (h) {
        return h == undefined ?
            this.length ? this[0][n] : null :
            this.attr(n, h);
    },


    /*
        n = "href"
    */
    href: function (h) {
        return h == undefined ?
            this.length ? this[0][n] : null :
            this.attr(n, h);
    },


    /*
        n = "src"
    */
    src: function (h) {
        return h == undefined ?
            this.length ? this[0][n] : null :
            this.attr(n, h);
    },



    /*
        n="width"
    */
    width: function (h) {
        return h == undefined ?
            (this.length ? jQuery.css(this[0], n) : null) :
            this.css(n, h);
    },


    /*
        n="height"
    */
    height: function (h) {
        return h == undefined ?
            (this.length ? jQuery.css(this[0], n) : null) :
            this.css(n, h);
    },


    /*
        n="top"
    */
    top: function (h) {
        return h == undefined ?
            (this.length ? jQuery.css(this[0], n) : null) :
            this.css(n, h);
    },



    /*
        n="left"
    */
    left: function (h) {
        return h == undefined ?
            (this.length ? jQuery.css(this[0], n) : null) :
            this.css(n, h);
    },

    /*
            n="position"
        */
    position: function (h) {
        return h == undefined ?
            (this.length ? jQuery.css(this[0], n) : null) :
            this.css(n, h);
    },


    /*
        n="float"
    */
    float: function (h) {
        return h == undefined ?
            (this.length ? jQuery.css(this[0], n) : null) :
            this.css(n, h);
    },


    /*
           n="overflow"
       */
    overflow: function (h) {
        return h == undefined ?
            (this.length ? jQuery.css(this[0], n) : null) :
            this.css(n, h);
    },



    /*
         n="color"
    */
    color: function (h) {
        return h == undefined ?
            (this.length ? jQuery.css(this[0], n) : null) :
            this.css(n, h);
    },

    /*
       n="background"
   */
    background: function (h) {
        return h == undefined ?
            (this.length ? jQuery.css(this[0], n) : null) :
            this.css(n, h);
    },




    // We're overriding the old toggle function, so
    // remember it for later
    _toggle: jQuery.fn.toggle,
    toggle: function (a, b) {
        // If two functions are passed in, we're
        // toggling on a click
        return a && b && a.constructor == Function && b.constructor == Function ? this.click(function (e) {
            // Figure out which function to execute
            this.last = this.last == a ? b : a;

            // Make sure that clicks stop
            e.preventDefault();

            // and execute the function
            return this.last.apply(this, [e]) || false;
        }) :

            // Otherwise, execute the old toggle function
            this._toggle.apply(this, arguments);
    },

    hover: function (f, g) {

        // A private function for haandling mouse 'hovering'
        function handleHover(e) {
            // Check if mouse(over|out) are still within the same parent element
            var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;

            // Traverse up the tree
            while (p && p != this) p = p.parentNode;

            // If we actually just moused on to a sub-element, ignore it
            if (p == this) return false;

            // Execute the right function
            return (e.type == "mouseover" ? f : g).apply(this, [e]);
        }

        // Bind the function to the two event listeners
        return this.mouseover(handleHover).mouseout(handleHover);
    },
    ready: function (f) {
        console.log('ready function with one params');
        // If the DOM is already ready
        if (jQuery.isReady) {
            console.log('jQuery.isReady');
            // Execute the function immediately
            f.apply(document);
        }
        // Otherwise, remember the function for later
        else {
            console.log('jQuery.isReady not');
            // Add the function to the wait list
            jQuery.readyList.push(f);
        }
        return this;
    },

    blur: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    focus: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    load: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    resize: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    scroll: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    unload: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    click: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    dblclick: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    blur: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    mousedown: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    mouseup: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    mousemove: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    mouseover: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    mouseout: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    change: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    reset: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    select: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    submit: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    keydown: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    keypress: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    keyup: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },

    error: function (f) {
        return f ? this.bind(o, f) : this.trigger(o);
    },


    unblur: function (f) {
        return this.unbind(o, f);
    },

    unfocus: function (f) {
        return this.unbind(o, f);
    },

    unload: function (f) {
        return this.unbind(o, f);
    },

    unresize: function (f) {
        return this.unbind(o, f);
    },

    unscroll: function (f) {
        return this.unbind(o, f);
    },

    ununload: function (f) {
        return this.unbind(o, f);
    },

    unclick: function (f) {
        return this.unbind(o, f);
    },

    undblclick: function (f) {
        return this.unbind(o, f);
    },

    unmousedown: function (f) {
        return this.unbind(o, f);
    },

    unmouseup: function (f) {
        return this.unbind(o, f);
    },

    unmousemove: function (f) {
        return this.unbind(o, f);
    },


    unmouseover: function (f) {
        return this.unbind(o, f);
    },

    unmouseout: function (f) {
        return this.unbind(o, f);
    },

    unchange: function (f) {
        return this.unbind(o, f);
    },

    unreset: function (f) {
        return this.unbind(o, f);
    },

    unselect: function (f) {
        return this.unbind(o, f);
    },

    unsubmit: function (f) {
        return this.unbind(o, f);
    },

    unkeydown: function (f) {
        return this.unbind(o, f);
    },

    unkeypress: function (f) {
        return this.unbind(o, f);
    },

    unkeyup: function (f) {
        return this.unbind(o, f);
    },

    unerror: function (f) {
        return this.unbind(o, f);
    },

    onblur: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },


    onefocus: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    oneload: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    oneresize: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onescroll: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },




    oneunload: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    oneclick: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onedblclick: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onemousedown: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onemouseup: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onemousemove: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onemouseover: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onemouseout: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onechange: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onereset: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    oneselect: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onesubmit: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onekeydown: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onekeypress: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    onekeyup: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },
    oneerror: function (f) {
        // Attach the event listener
        return this.each(function () {

            var count = 0;

            // Add the event
            jQuery.event.add(this, o, function (e) {
                // If this function has already been executed, stop
                if (count++) return;

                // And execute the bound function
                return f.apply(this, [e]);
            });
        });
    },

    //_show: jQuery.fn.show,
    show: function (speed, callback) {
        return speed ? this.animate({
            height: "show", width: "show", opacity: "show"
        }, speed, callback) : this._show();
    },

    // Overwrite the old hide method
    //_hide: jQuery.fn.hide,

    hide: function (speed, callback) {
        return speed ? this.animate({
            height: "hide", width: "hide", opacity: "hide"
        }, speed, callback) : this._hide();
    },

    slideDown: function (speed, callback) {
        return this.animate({ height: "show" }, speed, callback);
    },

    slideUp: function (speed, callback) {
        return this.animate({ height: "hide" }, speed, callback);
    },

    slideToggle: function (speed, callback) {
        return this.each(function () {
            var state = $(this).is(":hidden") ? "show" : "hide";
            $(this).animate({ height: state }, speed, callback);
        });
    },

    fadeIn: function (speed, callback) {
        return this.animate({ opacity: "show" }, speed, callback);
    },

    fadeOut: function (speed, callback) {
        return this.animate({ opacity: "hide" }, speed, callback);
    },

    fadeTo: function (speed, to, callback) {
        return this.animate({ opacity: to }, speed, callback);
    },
    animate: function (prop, speed, callback) {
        return this.queue(function () {

            this.curAnim = prop;

            for (var p in prop) {
                var e = new jQuery.fx(this, jQuery.speed(speed, callback), p);
                if (prop[p].constructor == Number)
                    e.custom(e.cur(), prop[p]);
                else
                    e[prop[p]](prop);
            }

        });
    },
    queue: function (type, fn) {
        if (!fn) {
            fn = type;
            type = "fx";
        }

        return this.each(function () {
            if (!this.queue)
                this.queue = {};

            if (!this.queue[type])
                this.queue[type] = [];

            this.queue[type].push(fn);

            if (this.queue[type].length == 1)
                fn.apply(this);
        });
    },

    loadIfModified = function (url, params, callback) {
        this.load(url, params, callback, 1);
    },

    load = function (url, params, callback, ifModified) {
        if (url.constructor == Function)
            return this.bind("load", url);

        callback = callback || function () { };

        // Default to a GET request
        var type = "GET";

        // If the second parameter was provided
        if (params) {
            // If it's a function
            if (params.constructor == Function) {
                // We assume that it's the callback
                callback = params;
                params = null;

                // Otherwise, build a param string
            } else {
                params = jQuery.param(params);
                type = "POST";
            }
        }

        var self = this;

        // Request the remote document
        jQuery.ajax(type, url, params, function (res, status) {

            if (status == "success" || !ifModified && status == "notmodified") {
                // Inject the HTML into all the matched elements
                self.html(res.responseText).each(callback, [res.responseText, status]);

                // Execute all the scripts inside of the newly-injected HTML
                $("script", self).each(function () {
                    if (this.src)
                        $.getScript(this.src);
                    else
                        eval.call(window, this.text || this.textContent || this.innerHTML || "");
                });
            } else
                callback.apply(self, [res.responseText, status]);

        }, ifModified);

        return this;
    },

    ajaxStart = function (f) {
        return this.bind(o, f);
    },

    ajaxStop = function (f) {
        return this.bind(o, f);
    },

    ajaxComplete = function (f) {
        return this.bind(o, f);
    },

    ajaxError = function (f) {
        return this.bind(o, f);
    },

    ajaxSuccess = function (f) {
        return this.bind(o, f);
    },
}