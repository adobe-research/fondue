require=(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
// nothing to see here... no file methods for the browser

},{}],2:[function(require,module,exports){
(function(){/*!
 * JSHint, by JSHint Community.
 *
 * Licensed under the same slightly modified MIT license that JSLint is.
 * It stops evil-doers everywhere.
 *
 * JSHint is a derivative work of JSLint:
 *
 *   Copyright (c) 2002 Douglas Crockford  (www.JSLint.com)
 *
 *   Permission is hereby granted, free of charge, to any person obtaining
 *   a copy of this software and associated documentation files (the "Software"),
 *   to deal in the Software without restriction, including without limitation
 *   the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *   and/or sell copies of the Software, and to permit persons to whom
 *   the Software is furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included
 *   in all copies or substantial portions of the Software.
 *
 *   The Software shall be used for Good, not Evil.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *   DEALINGS IN THE SOFTWARE.
 *
 * JSHint was forked from 2010-12-16 edition of JSLint.
 *
 */

/*
 JSHINT is a global function. It takes two parameters.

     var myResult = JSHINT(source, option);

 The first parameter is either a string or an array of strings. If it is a
 string, it will be split on '\n' or '\r'. If it is an array of strings, it
 is assumed that each string represents one line. The source can be a
 JavaScript text or a JSON text.

 The second parameter is an optional object of options which control the
 operation of JSHINT. Most of the options are booleans: They are all
 optional and have a default value of false. One of the options, predef,
 can be an array of names, which will be used to declare global variables,
 or an object whose keys are used as global names, with a boolean value
 that determines if they are assignable.

 If it checks out, JSHINT returns true. Otherwise, it returns false.

 If false, you can inspect JSHINT.errors to find out the problems.
 JSHINT.errors is an array of objects containing these members:

 {
     line      : The line (relative to 1) at which the lint was found
     character : The character (relative to 1) at which the lint was found
     reason    : The problem
     evidence  : The text line in which the problem occurred
     raw       : The raw message before the details were inserted
     a         : The first detail
     b         : The second detail
     c         : The third detail
     d         : The fourth detail
 }

 If a fatal error was found, a null will be the last element of the
 JSHINT.errors array.

 You can request a Function Report, which shows all of the functions
 and the parameters and vars that they use. This can be used to find
 implied global variables and other problems. The report is in HTML and
 can be inserted in an HTML <body>.

     var myReport = JSHINT.report(limited);

 If limited is true, then the report will be limited to only errors.

 You can request a data structure which contains JSHint's results.

     var myData = JSHINT.data();

 It returns a structure with this form:

 {
     errors: [
         {
             line: NUMBER,
             character: NUMBER,
             reason: STRING,
             evidence: STRING
         }
     ],
     functions: [
         name: STRING,
         line: NUMBER,
         character: NUMBER,
         last: NUMBER,
         lastcharacter: NUMBER,
         param: [
             STRING
         ],
         closure: [
             STRING
         ],
         var: [
             STRING
         ],
         exception: [
             STRING
         ],
         outer: [
             STRING
         ],
         unused: [
             STRING
         ],
         global: [
             STRING
         ],
         label: [
             STRING
         ]
     ],
     globals: [
         STRING
     ],
     member: {
         STRING: NUMBER
     },
     unused: [
         {
             name: STRING,
             line: NUMBER
         }
     ],
     implieds: [
         {
             name: STRING,
             line: NUMBER
         }
     ],
     urls: [
         STRING
     ],
     json: BOOLEAN
 }

 Empty arrays will not be included.

*/

/*jshint
 evil: true, nomen: false, onevar: false, regexp: false, strict: true, boss: true,
 undef: true, maxlen: 100, indent:4
*/

/*members "\b", "\t", "\n", "\f", "\r", "!=", "!==", "\"", "%", "(begin)",
 "(breakage)", "(character)", "(context)", "(error)", "(global)", "(identifier)", "(last)",
 "(lastcharacter)", "(line)", "(loopage)", "(name)", "(onevar)", "(params)", "(scope)",
 "(statement)", "(verb)", "*", "+", "++", "-", "--", "\/", "<", "<=", "==",
 "===", ">", ">=", $, $$, $A, $F, $H, $R, $break, $continue, $w, Abstract, Ajax,
 __filename, __dirname, ActiveXObject, Array, ArrayBuffer, ArrayBufferView, Audio,
 Autocompleter, Assets, Boolean, Builder, Buffer, Browser, COM, CScript, Canvas,
 CustomAnimation, Class, Control, Chain, Color, Cookie, Core, DataView, Date,
 Debug, Draggable, Draggables, Droppables, Document, DomReady, DOMReady, DOMParser, Drag,
 E, Enumerator, Enumerable, Element, Elements, Error, Effect, EvalError, Event,
 Events, FadeAnimation, Field, Flash, Float32Array, Float64Array, Form,
 FormField, Frame, FormData, Function, Fx, GetObject, Group, Hash, HotKey,
 HTMLElement, HTMLAnchorElement, HTMLBaseElement, HTMLBlockquoteElement,
 HTMLBodyElement, HTMLBRElement, HTMLButtonElement, HTMLCanvasElement, HTMLDirectoryElement,
 HTMLDivElement, HTMLDListElement, HTMLFieldSetElement,
 HTMLFontElement, HTMLFormElement, HTMLFrameElement, HTMLFrameSetElement,
 HTMLHeadElement, HTMLHeadingElement, HTMLHRElement, HTMLHtmlElement,
 HTMLIFrameElement, HTMLImageElement, HTMLInputElement, HTMLIsIndexElement,
 HTMLLabelElement, HTMLLayerElement, HTMLLegendElement, HTMLLIElement,
 HTMLLinkElement, HTMLMapElement, HTMLMenuElement, HTMLMetaElement,
 HTMLModElement, HTMLObjectElement, HTMLOListElement, HTMLOptGroupElement,
 HTMLOptionElement, HTMLParagraphElement, HTMLParamElement, HTMLPreElement,
 HTMLQuoteElement, HTMLScriptElement, HTMLSelectElement, HTMLStyleElement,
 HtmlTable, HTMLTableCaptionElement, HTMLTableCellElement, HTMLTableColElement,
 HTMLTableElement, HTMLTableRowElement, HTMLTableSectionElement,
 HTMLTextAreaElement, HTMLTitleElement, HTMLUListElement, HTMLVideoElement,
 Iframe, IframeShim, Image, Int16Array, Int32Array, Int8Array,
 Insertion, InputValidator, JSON, Keyboard, Locale, LN10, LN2, LOG10E, LOG2E,
 MAX_VALUE, MIN_VALUE, Mask, Math, MenuItem, MessageChannel, MessageEvent, MessagePort,
 MoveAnimation, MooTools, Native, NEGATIVE_INFINITY, Node, NodeFilter, Number, Object, ObjectRange,
 Option, Options, OverText, PI, POSITIVE_INFINITY, PeriodicalExecuter, Point, Position, Prototype,
 RangeError, Rectangle, ReferenceError, RegExp, ResizeAnimation, Request, RotateAnimation,
 SQRT1_2, SQRT2, ScrollBar, ScriptEngine, ScriptEngineBuildVersion,
 ScriptEngineMajorVersion, ScriptEngineMinorVersion, Scriptaculous, Scroller,
 Slick, Slider, Selector, SharedWorker, String, Style, SyntaxError, Sortable, Sortables,
 SortableObserver, Sound, Spinner, System, Swiff, Text, TextArea, Template,
 Timer, Tips, Type, TypeError, Toggle, Try, "use strict", unescape, URI, URIError, URL,
 VBArray, WSH, WScript, XDomainRequest, Web, Window, XMLDOM, XMLHttpRequest, XMLSerializer,
 XPathEvaluator, XPathException, XPathExpression, XPathNamespace, XPathNSResolver, XPathResult,
 "\\", a, addEventListener, address, alert, apply, applicationCache, arguments, arity, asi, atob,
 b, basic, basicToken, bitwise, block, blur, boolOptions, boss, browser, btoa, c, call, callee,
 caller, camelcase, cases, charAt, charCodeAt, character, clearInterval, clearTimeout,
 close, closed, closure, comment, condition, confirm, console, constructor,
 content, couch, create, css, curly, d, data, datalist, dd, debug, decodeURI,
 decodeURIComponent, defaultStatus, defineClass, deserialize, devel, document,
 dojo, dijit, dojox, define, else, emit, encodeURI, encodeURIComponent,
 entityify, eqeq, eqeqeq, eqnull, errors, es5, escape, esnext, eval, event, evidence, evil,
 ex, exception, exec, exps, expr, exports, FileReader, first, floor, focus,
 forin, fragment, frames, from, fromCharCode, fud, funcscope, funct, function, functions,
 g, gc, getComputedStyle, getRow, getter, getterToken, GLOBAL, global, globals, globalstrict,
 hasOwnProperty, help, history, i, id, identifier, immed, implieds, importPackage, include,
 indent, indexOf, init, ins, instanceOf, isAlpha, isApplicationRunning, isArray,
 isDigit, isFinite, isNaN, iterator, java, join, jshint,
 JSHINT, json, jquery, jQuery, keys, label, labelled, last, lastcharacter, lastsemic, laxbreak, 
 laxcomma, latedef, lbp, led, left, length, line, load, loadClass, localStorage, location,
 log, loopfunc, m, match, maxerr, maxlen, member,message, meta, module, moveBy,
 moveTo, mootools, multistr, name, navigator, new, newcap, noarg, node, noempty, nomen,
 nonew, nonstandard, nud, onbeforeunload, onblur, onerror, onevar, onecase, onfocus,
 onload, onresize, onunload, open, openDatabase, openURL, opener, opera, options, outer, param,
 parent, parseFloat, parseInt, passfail, plusplus, predef, print, process, prompt,
 proto, prototype, prototypejs, provides, push, quit, quotmark, range, raw, reach, reason, regexp,
 readFile, readUrl, regexdash, removeEventListener, replace, report, require,
 reserved, resizeBy, resizeTo, resolvePath, resumeUpdates, respond, rhino, right,
 runCommand, scroll, screen, scripturl, scrollBy, scrollTo, scrollbar, search, seal,
 send, serialize, sessionStorage, setInterval, setTimeout, setter, setterToken, shift, slice,
 smarttabs, sort, spawn, split, stack, status, start, strict, sub, substr, supernew, shadow,
 supplant, sum, sync, test, toLowerCase, toString, toUpperCase, toint32, token, top, trailing,
 type, typeOf, Uint16Array, Uint32Array, Uint8Array, undef, undefs, unused, urls, validthis,
 value, valueOf, var, vars, version, WebSocket, withstmt, white, window, windows, Worker, wsh*/

/*global exports: false */

// We build the application inside a function so that we produce only a single
// global variable. That function will be invoked immediately, and its return
// value is the JSHINT function itself.

var JSHINT = (function () {
    "use strict";

    var anonname,       // The guessed name for anonymous functions.

// These are operators that should not be used with the ! operator.

        bang = {
            '<'  : true,
            '<=' : true,
            '==' : true,
            '===': true,
            '!==': true,
            '!=' : true,
            '>'  : true,
            '>=' : true,
            '+'  : true,
            '-'  : true,
            '*'  : true,
            '/'  : true,
            '%'  : true
        },

        // These are the JSHint boolean options.
        boolOptions = {
            asi         : true, // if automatic semicolon insertion should be tolerated
            bitwise     : true, // if bitwise operators should not be allowed
            boss        : true, // if advanced usage of assignments should be allowed
            browser     : true, // if the standard browser globals should be predefined
            camelcase   : true, // if identifiers should be required in camel case
            couch       : true, // if CouchDB globals should be predefined
            curly       : true, // if curly braces around all blocks should be required
            debug       : true, // if debugger statements should be allowed
            devel       : true, // if logging globals should be predefined (console,
                                // alert, etc.)
            dojo        : true, // if Dojo Toolkit globals should be predefined
            eqeqeq      : true, // if === should be required
            eqnull      : true, // if == null comparisons should be tolerated
            es5         : true, // if ES5 syntax should be allowed
            esnext      : true, // if es.next specific syntax should be allowed
            evil        : true, // if eval should be allowed
            expr        : true, // if ExpressionStatement should be allowed as Programs
            forin       : true, // if for in statements must filter
            funcscope   : true, // if only function scope should be used for scope tests
            globalstrict: true, // if global "use strict"; should be allowed (also
                                // enables 'strict')
            immed       : true, // if immediate invocations must be wrapped in parens
            iterator    : true, // if the `__iterator__` property should be allowed
            jquery      : true, // if jQuery globals should be predefined
            lastsemic   : true, // if semicolons may be ommitted for the trailing
                                // statements inside of a one-line blocks.
            latedef     : true, // if the use before definition should not be tolerated
            laxbreak    : true, // if line breaks should not be checked
            laxcomma    : true, // if line breaks should not be checked around commas
            loopfunc    : true, // if functions should be allowed to be defined within
                                // loops
            mootools    : true, // if MooTools globals should be predefined
            multistr    : true, // allow multiline strings
            newcap      : true, // if constructor names must be capitalized
            noarg       : true, // if arguments.caller and arguments.callee should be
                                // disallowed
            node        : true, // if the Node.js environment globals should be
                                // predefined
            noempty     : true, // if empty blocks should be disallowed
            nonew       : true, // if using `new` for side-effects should be disallowed
            nonstandard : true, // if non-standard (but widely adopted) globals should
                                // be predefined
            nomen       : true, // if names should be checked
            onevar      : true, // if only one var statement per function should be
                                // allowed
            onecase     : true, // if one case switch statements should be allowed
            passfail    : true, // if the scan should stop on first error
            plusplus    : true, // if increment/decrement should not be allowed
            proto       : true, // if the `__proto__` property should be allowed
            prototypejs : true, // if Prototype and Scriptaculous globals should be
                                // predefined
            regexdash   : true, // if unescaped first/last dash (-) inside brackets
                                // should be tolerated
            regexp      : true, // if the . should not be allowed in regexp literals
            rhino       : true, // if the Rhino environment globals should be predefined
            undef       : true, // if variables should be declared before used
            scripturl   : true, // if script-targeted URLs should be tolerated
            shadow      : true, // if variable shadowing should be tolerated
            smarttabs   : true, // if smarttabs should be tolerated
                                // (http://www.emacswiki.org/emacs/SmartTabs)
            strict      : true, // require the "use strict"; pragma
            sub         : true, // if all forms of subscript notation are tolerated
            supernew    : true, // if `new function () { ... };` and `new Object;`
                                // should be tolerated
            trailing    : true, // if trailing whitespace rules apply
            validthis   : true, // if 'this' inside a non-constructor function is valid.
                                // This is a function scoped option only.
            withstmt    : true, // if with statements should be allowed
            white       : true, // if strict whitespace rules apply
            wsh         : true  // if the Windows Scripting Host environment globals
                                // should be predefined
        },

        // These are the JSHint options that can take any value
        // (we use this object to detect invalid options)
        valOptions = {
            maxlen: false,
            indent: false,
            maxerr: false,
            predef: false,
            quotmark: false //'single'|'double'|true
        },

        // These are JSHint boolean options which are shared with JSLint
        // where the definition in JSHint is opposite JSLint
        invertedOptions = {
            bitwise     : true,
            forin       : true,
            newcap      : true,
            nomen       : true,
            plusplus    : true,
            regexp      : true,
            undef       : true,
            white       : true,

            // Inverted and renamed, use JSHint name here
            eqeqeq      : true,
            onevar      : true
        },

        // These are JSHint boolean options which are shared with JSLint
        // where the name has been changed but the effect is unchanged
        renamedOptions = {
            eqeq        : "eqeqeq",
            vars        : "onevar",
            windows     : "wsh"
        },


        // browser contains a set of global names which are commonly provided by a
        // web browser environment.
        browser = {
            ArrayBuffer              :  false,
            ArrayBufferView          :  false,
            Audio                    :  false,
            addEventListener         :  false,
            applicationCache         :  false,
            atob                     :  false,
            blur                     :  false,
            btoa                     :  false,
            clearInterval            :  false,
            clearTimeout             :  false,
            close                    :  false,
            closed                   :  false,
            DataView                 :  false,
            DOMParser                :  false,
            defaultStatus            :  false,
            document                 :  false,
            event                    :  false,
            FileReader               :  false,
            Float32Array             :  false,
            Float64Array             :  false,
            FormData                 :  false,
            focus                    :  false,
            frames                   :  false,
            getComputedStyle         :  false,
            HTMLElement              :  false,
            HTMLAnchorElement        :  false,
            HTMLBaseElement          :  false,
            HTMLBlockquoteElement    :  false,
            HTMLBodyElement          :  false,
            HTMLBRElement            :  false,
            HTMLButtonElement        :  false,
            HTMLCanvasElement        :  false,
            HTMLDirectoryElement     :  false,
            HTMLDivElement           :  false,
            HTMLDListElement         :  false,
            HTMLFieldSetElement      :  false,
            HTMLFontElement          :  false,
            HTMLFormElement          :  false,
            HTMLFrameElement         :  false,
            HTMLFrameSetElement      :  false,
            HTMLHeadElement          :  false,
            HTMLHeadingElement       :  false,
            HTMLHRElement            :  false,
            HTMLHtmlElement          :  false,
            HTMLIFrameElement        :  false,
            HTMLImageElement         :  false,
            HTMLInputElement         :  false,
            HTMLIsIndexElement       :  false,
            HTMLLabelElement         :  false,
            HTMLLayerElement         :  false,
            HTMLLegendElement        :  false,
            HTMLLIElement            :  false,
            HTMLLinkElement          :  false,
            HTMLMapElement           :  false,
            HTMLMenuElement          :  false,
            HTMLMetaElement          :  false,
            HTMLModElement           :  false,
            HTMLObjectElement        :  false,
            HTMLOListElement         :  false,
            HTMLOptGroupElement      :  false,
            HTMLOptionElement        :  false,
            HTMLParagraphElement     :  false,
            HTMLParamElement         :  false,
            HTMLPreElement           :  false,
            HTMLQuoteElement         :  false,
            HTMLScriptElement        :  false,
            HTMLSelectElement        :  false,
            HTMLStyleElement         :  false,
            HTMLTableCaptionElement  :  false,
            HTMLTableCellElement     :  false,
            HTMLTableColElement      :  false,
            HTMLTableElement         :  false,
            HTMLTableRowElement      :  false,
            HTMLTableSectionElement  :  false,
            HTMLTextAreaElement      :  false,
            HTMLTitleElement         :  false,
            HTMLUListElement         :  false,
            HTMLVideoElement         :  false,
            history                  :  false,
            Int16Array               :  false,
            Int32Array               :  false,
            Int8Array                :  false,
            Image                    :  false,
            length                   :  false,
            localStorage             :  false,
            location                 :  false,
            MessageChannel           :  false,
            MessageEvent             :  false,
            MessagePort              :  false,
            moveBy                   :  false,
            moveTo                   :  false,
            name                     :  false,
            Node                     :  false,
            NodeFilter               :  false,
            navigator                :  false,
            onbeforeunload           :  true,
            onblur                   :  true,
            onerror                  :  true,
            onfocus                  :  true,
            onload                   :  true,
            onresize                 :  true,
            onunload                 :  true,
            open                     :  false,
            openDatabase             :  false,
            opener                   :  false,
            Option                   :  false,
            parent                   :  false,
            print                    :  false,
            removeEventListener      :  false,
            resizeBy                 :  false,
            resizeTo                 :  false,
            screen                   :  false,
            scroll                   :  false,
            scrollBy                 :  false,
            scrollTo                 :  false,
            sessionStorage           :  false,
            setInterval              :  false,
            setTimeout               :  false,
            SharedWorker             :  false,
            status                   :  false,
            top                      :  false,
            Uint16Array              :  false,
            Uint32Array              :  false,
            Uint8Array               :  false,
            WebSocket                :  false,
            window                   :  false,
            Worker                   :  false,
            XMLHttpRequest           :  false,
            XMLSerializer            :  false,
            XPathEvaluator           :  false,
            XPathException           :  false,
            XPathExpression          :  false,
            XPathNamespace           :  false,
            XPathNSResolver          :  false,
            XPathResult              :  false
        },

        couch = {
            "require" : false,
            respond   : false,
            getRow    : false,
            emit      : false,
            send      : false,
            start     : false,
            sum       : false,
            log       : false,
            exports   : false,
            module    : false,
            provides  : false
        },

        devel = {
            alert   : false,
            confirm : false,
            console : false,
            Debug   : false,
            opera   : false,
            prompt  : false
        },

        dojo = {
            dojo      : false,
            dijit     : false,
            dojox     : false,
            define    : false,
            "require" : false
        },

        escapes = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '/' : '\\/',
            '\\': '\\\\'
        },

        funct,          // The current function

        functionicity = [
            'closure', 'exception', 'global', 'label',
            'outer', 'unused', 'var'
        ],

        functions,      // All of the functions

        global,         // The global scope
        implied,        // Implied globals
        inblock,
        indent,
        jsonmode,

        jquery = {
            '$'    : false,
            jQuery : false
        },

        lines,
        lookahead,
        member,
        membersOnly,

        mootools = {
            '$'             : false,
            '$$'            : false,
            Assets          : false,
            Browser         : false,
            Chain           : false,
            Class           : false,
            Color           : false,
            Cookie          : false,
            Core            : false,
            Document        : false,
            DomReady        : false,
            DOMReady        : false,
            Drag            : false,
            Element         : false,
            Elements        : false,
            Event           : false,
            Events          : false,
            Fx              : false,
            Group           : false,
            Hash            : false,
            HtmlTable       : false,
            Iframe          : false,
            IframeShim      : false,
            InputValidator  : false,
            instanceOf      : false,
            Keyboard        : false,
            Locale          : false,
            Mask            : false,
            MooTools        : false,
            Native          : false,
            Options         : false,
            OverText        : false,
            Request         : false,
            Scroller        : false,
            Slick           : false,
            Slider          : false,
            Sortables       : false,
            Spinner         : false,
            Swiff           : false,
            Tips            : false,
            Type            : false,
            typeOf          : false,
            URI             : false,
            Window          : false
        },

        nexttoken,

        node = {
            __filename    : false,
            __dirname     : false,
            Buffer        : false,
            console       : false,
            exports       : false,
            GLOBAL        : false,
            global        : false,
            module        : false,
            process       : false,
            require       : false,
            setTimeout    : false,
            clearTimeout  : false,
            setInterval   : false,
            clearInterval : false
        },

        noreach,
        option,
        predefined,     // Global variables defined by option
        prereg,
        prevtoken,

        prototypejs = {
            '$'               : false,
            '$$'              : false,
            '$A'              : false,
            '$F'              : false,
            '$H'              : false,
            '$R'              : false,
            '$break'          : false,
            '$continue'       : false,
            '$w'              : false,
            Abstract          : false,
            Ajax              : false,
            Class             : false,
            Enumerable        : false,
            Element           : false,
            Event             : false,
            Field             : false,
            Form              : false,
            Hash              : false,
            Insertion         : false,
            ObjectRange       : false,
            PeriodicalExecuter: false,
            Position          : false,
            Prototype         : false,
            Selector          : false,
            Template          : false,
            Toggle            : false,
            Try               : false,
            Autocompleter     : false,
            Builder           : false,
            Control           : false,
            Draggable         : false,
            Draggables        : false,
            Droppables        : false,
            Effect            : false,
            Sortable          : false,
            SortableObserver  : false,
            Sound             : false,
            Scriptaculous     : false
        },

        quotmark,

        rhino = {
            defineClass  : false,
            deserialize  : false,
            gc           : false,
            help         : false,
            importPackage: false,
            "java"       : false,
            load         : false,
            loadClass    : false,
            print        : false,
            quit         : false,
            readFile     : false,
            readUrl      : false,
            runCommand   : false,
            seal         : false,
            serialize    : false,
            spawn        : false,
            sync         : false,
            toint32      : false,
            version      : false
        },

        scope,      // The current scope
        stack,

        // standard contains the global names that are provided by the
        // ECMAScript standard.
        standard = {
            Array               : false,
            Boolean             : false,
            Date                : false,
            decodeURI           : false,
            decodeURIComponent  : false,
            encodeURI           : false,
            encodeURIComponent  : false,
            Error               : false,
            'eval'              : false,
            EvalError           : false,
            Function            : false,
            hasOwnProperty      : false,
            isFinite            : false,
            isNaN               : false,
            JSON                : false,
            Math                : false,
            Number              : false,
            Object              : false,
            parseInt            : false,
            parseFloat          : false,
            RangeError          : false,
            ReferenceError      : false,
            RegExp              : false,
            String              : false,
            SyntaxError         : false,
            TypeError           : false,
            URIError            : false
        },

        // widely adopted global names that are not part of ECMAScript standard
        nonstandard = {
            escape              : false,
            unescape            : false
        },

        standard_member = {
            E                   : true,
            LN2                 : true,
            LN10                : true,
            LOG2E               : true,
            LOG10E              : true,
            MAX_VALUE           : true,
            MIN_VALUE           : true,
            NEGATIVE_INFINITY   : true,
            PI                  : true,
            POSITIVE_INFINITY   : true,
            SQRT1_2             : true,
            SQRT2               : true
        },

        directive,
        syntax = {},
        tab,
        token,
        urls,
        useESNextSyntax,
        warnings,

        wsh = {
            ActiveXObject             : true,
            Enumerator                : true,
            GetObject                 : true,
            ScriptEngine              : true,
            ScriptEngineBuildVersion  : true,
            ScriptEngineMajorVersion  : true,
            ScriptEngineMinorVersion  : true,
            VBArray                   : true,
            WSH                       : true,
            WScript                   : true,
            XDomainRequest            : true
        };

    // Regular expressions. Some of these are stupidly long.
    var ax, cx, tx, nx, nxg, lx, ix, jx, ft;
    (function () {
        /*jshint maxlen:300 */

        // unsafe comment or string
        ax = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i;

        // unsafe characters that are silently deleted by one or more browsers
        cx = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;

        // token
        tx = /^\s*([(){}\[.,:;'"~\?\]#@]|==?=?|\/(\*(jshint|jslint|members?|global)?|=|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|%=?|&[&=]?|\|[|=]?|>>?>?=?|<([\/=!]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+([xX][0-9a-fA-F]+|\.[0-9]*)?([eE][+\-]?[0-9]+)?)/;

        // characters in strings that need escapement
        nx = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;
        nxg = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

        // star slash
        lx = /\*\/|\/\*/;

        // identifier
        ix = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/;

        // javascript url
        jx = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i;

        // catches /* falls through */ comments
        ft = /^\s*\/\*\s*falls\sthrough\s*\*\/\s*$/;
    }());

    function F() {}     // Used by Object.create

    function is_own(object, name) {

// The object.hasOwnProperty method fails when the property under consideration
// is named 'hasOwnProperty'. So we have to use this more convoluted form.

        return Object.prototype.hasOwnProperty.call(object, name);
    }

    function checkOption(name, t) {
        if (valOptions[name] === undefined && boolOptions[name] === undefined) {
            warning("Bad option: '" + name + "'.", t);
        }
    }

// Provide critical ES5 functions to ES3.

    if (typeof Array.isArray !== 'function') {
        Array.isArray = function (o) {
            return Object.prototype.toString.apply(o) === '[object Array]';
        };
    }

    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            F.prototype = o;
            return new F();
        };
    }

    if (typeof Object.keys !== 'function') {
        Object.keys = function (o) {
            var a = [], k;
            for (k in o) {
                if (is_own(o, k)) {
                    a.push(k);
                }
            }
            return a;
        };
    }

// Non standard methods

    if (typeof String.prototype.entityify !== 'function') {
        String.prototype.entityify = function () {
            return this
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        };
    }

    if (typeof String.prototype.isAlpha !== 'function') {
        String.prototype.isAlpha = function () {
            return (this >= 'a' && this <= 'z\uffff') ||
                (this >= 'A' && this <= 'Z\uffff');
        };
    }

    if (typeof String.prototype.isDigit !== 'function') {
        String.prototype.isDigit = function () {
            return (this >= '0' && this <= '9');
        };
    }

    if (typeof String.prototype.supplant !== 'function') {
        String.prototype.supplant = function (o) {
            return this.replace(/\{([^{}]*)\}/g, function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
        };
    }

    if (typeof String.prototype.name !== 'function') {
        String.prototype.name = function () {

// If the string looks like an identifier, then we can return it as is.
// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can simply slap some quotes around it.
// Otherwise we must also replace the offending characters with safe
// sequences.

            if (ix.test(this)) {
                return this;
            }
            if (nx.test(this)) {
                return '"' + this.replace(nxg, function (a) {
                    var c = escapes[a];
                    if (c) {
                        return c;
                    }
                    return '\\u' + ('0000' + a.charCodeAt().toString(16)).slice(-4);
                }) + '"';
            }
            return '"' + this + '"';
        };
    }


    function combine(t, o) {
        var n;
        for (n in o) {
            if (is_own(o, n)) {
                t[n] = o[n];
            }
        }
    }

    function assume() {
        if (option.couch) {
            combine(predefined, couch);
        }

        if (option.rhino) {
            combine(predefined, rhino);
        }

        if (option.prototypejs) {
            combine(predefined, prototypejs);
        }

        if (option.node) {
            combine(predefined, node);
            option.globalstrict = true;
        }

        if (option.devel) {
            combine(predefined, devel);
        }

        if (option.dojo) {
            combine(predefined, dojo);
        }

        if (option.browser) {
            combine(predefined, browser);
        }

        if (option.nonstandard) {
            combine(predefined, nonstandard);
        }

        if (option.jquery) {
            combine(predefined, jquery);
        }

        if (option.mootools) {
            combine(predefined, mootools);
        }

        if (option.wsh) {
            combine(predefined, wsh);
        }

        if (option.esnext) {
            useESNextSyntax();
        }

        if (option.globalstrict && option.strict !== false) {
            option.strict = true;
        }
    }


    // Produce an error warning.
    function quit(message, line, chr) {
        var percentage = Math.floor((line / lines.length) * 100);

        throw {
            name: 'JSHintError',
            line: line,
            character: chr,
            message: message + " (" + percentage + "% scanned).",
            raw: message
        };
    }

    function isundef(scope, m, t, a) {
        return JSHINT.undefs.push([scope, m, t, a]);
    }

    function warning(m, t, a, b, c, d) {
        var ch, l, w;
        t = t || nexttoken;
        if (t.id === '(end)') {  // `~
            t = token;
        }
        l = t.line || 0;
        ch = t.from || 0;
        w = {
            id: '(error)',
            raw: m,
            evidence: lines[l - 1] || '',
            line: l,
            character: ch,
            a: a,
            b: b,
            c: c,
            d: d
        };
        w.reason = m.supplant(w);
        JSHINT.errors.push(w);
        if (option.passfail) {
            quit('Stopping. ', l, ch);
        }
        warnings += 1;
        if (warnings >= option.maxerr) {
            quit("Too many errors.", l, ch);
        }
        return w;
    }

    function warningAt(m, l, ch, a, b, c, d) {
        return warning(m, {
            line: l,
            from: ch
        }, a, b, c, d);
    }

    function error(m, t, a, b, c, d) {
        var w = warning(m, t, a, b, c, d);
    }

    function errorAt(m, l, ch, a, b, c, d) {
        return error(m, {
            line: l,
            from: ch
        }, a, b, c, d);
    }



// lexical analysis and token construction

    var lex = (function lex() {
        var character, from, line, s;

// Private lex methods

        function nextLine() {
            var at,
                tw; // trailing whitespace check

            if (line >= lines.length)
                return false;

            character = 1;
            s = lines[line];
            line += 1;

            // If smarttabs option is used check for spaces followed by tabs only.
            // Otherwise check for any occurence of mixed tabs and spaces.
            // Tabs and one space followed by block comment is allowed.
            if (option.smarttabs)
                at = s.search(/ \t/);
            else
                at = s.search(/ \t|\t [^\*]/);

            if (at >= 0)
                warningAt("Mixed spaces and tabs.", line, at + 1);

            s = s.replace(/\t/g, tab);
            at = s.search(cx);

            if (at >= 0)
                warningAt("Unsafe character.", line, at);

            if (option.maxlen && option.maxlen < s.length)
                warningAt("Line too long.", line, s.length);

            // Check for trailing whitespaces
            tw = option.trailing && s.match(/^(.*?)\s+$/);
            if (tw && !/^\s+$/.test(s)) {
                warningAt("Trailing whitespace.", line, tw[1].length + 1);
            }
            return true;
        }

// Produce a token object.  The token inherits from a syntax symbol.

        function it(type, value) {
            var i, t;
            if (type === '(color)' || type === '(range)') {
                t = {type: type};
            } else if (type === '(punctuator)' ||
                    (type === '(identifier)' && is_own(syntax, value))) {
                t = syntax[value] || syntax['(error)'];
            } else {
                t = syntax[type];
            }
            t = Object.create(t);
            if (type === '(string)' || type === '(range)') {
                if (!option.scripturl && jx.test(value)) {
                    warningAt("Script URL.", line, from);
                }
            }
            if (type === '(identifier)') {
                t.identifier = true;
                if (value === '__proto__' && !option.proto) {
                    warningAt("The '{a}' property is deprecated.",
                        line, from, value);
                } else if (value === '__iterator__' && !option.iterator) {
                    warningAt("'{a}' is only available in JavaScript 1.7.",
                        line, from, value);
                } else if (option.nomen && (value.charAt(0) === '_' ||
                         value.charAt(value.length - 1) === '_')) {
                    if (!option.node || token.id === '.' ||
                            (value !== '__dirname' && value !== '__filename')) {
                        warningAt("Unexpected {a} in '{b}'.", line, from, "dangling '_'", value);
                    }
                } else if (option.camelcase && value.indexOf('_') > -1 &&
                        !value.match(/^[A-Z0-9_]*$/)) {
                    warningAt("Identifier '{a}' is not in camel case.",
                        line, from, value);
                }
            }
            t.value = value;
            t.line = line;
            t.character = character;
            t.from = from;
            i = t.id;
            if (i !== '(endline)') {
                prereg = i &&
                    (('(,=:[!&|?{};'.indexOf(i.charAt(i.length - 1)) >= 0) ||
                    i === 'return' ||
                    i === 'case');
            }
            return t;
        }

        // Public lex methods
        return {
            init: function (source) {
                if (typeof source === 'string') {
                    lines = source
                        .replace(/\r\n/g, '\n')
                        .replace(/\r/g, '\n')
                        .split('\n');
                } else {
                    lines = source;
                }

                // If the first line is a shebang (#!), make it a blank and move on.
                // Shebangs are used by Node scripts.
                if (lines[0] && lines[0].substr(0, 2) === '#!')
                    lines[0] = '';

                line = 0;
                nextLine();
                from = 1;
            },

            range: function (begin, end) {
                var c, value = '';
                from = character;
                if (s.charAt(0) !== begin) {
                    errorAt("Expected '{a}' and instead saw '{b}'.",
                            line, character, begin, s.charAt(0));
                }
                for (;;) {
                    s = s.slice(1);
                    character += 1;
                    c = s.charAt(0);
                    switch (c) {
                    case '':
                        errorAt("Missing '{a}'.", line, character, c);
                        break;
                    case end:
                        s = s.slice(1);
                        character += 1;
                        return it('(range)', value);
                    case '\\':
                        warningAt("Unexpected '{a}'.", line, character, c);
                    }
                    value += c;
                }

            },


            // token -- this is called by advance to get the next token
            token: function () {
                var b, c, captures, d, depth, high, i, l, low, q, t, isLiteral, isInRange, n;

                function match(x) {
                    var r = x.exec(s), r1;
                    if (r) {
                        l = r[0].length;
                        r1 = r[1];
                        c = r1.charAt(0);
                        s = s.substr(l);
                        from = character + l - r1.length;
                        character += l;
                        return r1;
                    }
                }

                function string(x) {
                    var c, j, r = '', allowNewLine = false;

                    if (jsonmode && x !== '"') {
                        warningAt("Strings must use doublequote.",
                                line, character);
                    }

                    if (option.quotmark) {
                        if (option.quotmark === 'single' && x !== "'") {
                            warningAt("Strings must use singlequote.",
                                    line, character);
                        } else if (option.quotmark === 'double' && x !== '"') {
                            warningAt("Strings must use doublequote.",
                                    line, character);
                        } else if (option.quotmark === true) {
                            quotmark = quotmark || x;
                            if (quotmark !== x) {
                                warningAt("Mixed double and single quotes.",
                                        line, character);
                            }
                        }
                    }

                    function esc(n) {
                        var i = parseInt(s.substr(j + 1, n), 16);
                        j += n;
                        if (i >= 32 && i <= 126 &&
                                i !== 34 && i !== 92 && i !== 39) {
                            warningAt("Unnecessary escapement.", line, character);
                        }
                        character += n;
                        c = String.fromCharCode(i);
                    }
                    j = 0;
unclosedString:     for (;;) {
                        while (j >= s.length) {
                            j = 0;

                            var cl = line, cf = from;
                            if (!nextLine()) {
                                errorAt("Unclosed string.", cl, cf);
                                break unclosedString;
                            }

                            if (allowNewLine) {
                                allowNewLine = false;
                            } else {
                                warningAt("Unclosed string.", cl, cf);
                            }
                        }
                        c = s.charAt(j);
                        if (c === x) {
                            character += 1;
                            s = s.substr(j + 1);
                            return it('(string)', r, x);
                        }
                        if (c < ' ') {
                            if (c === '\n' || c === '\r') {
                                break;
                            }
                            warningAt("Control character in string: {a}.",
                                    line, character + j, s.slice(0, j));
                        } else if (c === '\\') {
                            j += 1;
                            character += 1;
                            c = s.charAt(j);
                            n = s.charAt(j + 1);
                            switch (c) {
                            case '\\':
                            case '"':
                            case '/':
                                break;
                            case '\'':
                                if (jsonmode) {
                                    warningAt("Avoid \\'.", line, character);
                                }
                                break;
                            case 'b':
                                c = '\b';
                                break;
                            case 'f':
                                c = '\f';
                                break;
                            case 'n':
                                c = '\n';
                                break;
                            case 'r':
                                c = '\r';
                                break;
                            case 't':
                                c = '\t';
                                break;
                            case '0':
                                c = '\0';
                                // Octal literals fail in strict mode
                                // check if the number is between 00 and 07
                                // where 'n' is the token next to 'c'
                                if (n >= 0 && n <= 7 && directive["use strict"]) {
                                    warningAt(
                                    "Octal literals are not allowed in strict mode.",
                                    line, character);
                                }
                                break;
                            case 'u':
                                esc(4);
                                break;
                            case 'v':
                                if (jsonmode) {
                                    warningAt("Avoid \\v.", line, character);
                                }
                                c = '\v';
                                break;
                            case 'x':
                                if (jsonmode) {
                                    warningAt("Avoid \\x-.", line, character);
                                }
                                esc(2);
                                break;
                            case '':
                                // last character is escape character
                                // always allow new line if escaped, but show
                                // warning if option is not set
                                allowNewLine = true;
                                if (option.multistr) {
                                    if (jsonmode) {
                                        warningAt("Avoid EOL escapement.", line, character);
                                    }
                                    c = '';
                                    character -= 1;
                                    break;
                                }
                                warningAt("Bad escapement of EOL. Use option multistr if needed.",
                                    line, character);
                                break;
                            default:
                                warningAt("Bad escapement.", line, character);
                            }
                        }
                        r += c;
                        character += 1;
                        j += 1;
                    }
                }

                for (;;) {
                    if (!s) {
                        return it(nextLine() ? '(endline)' : '(end)', '');
                    }
                    t = match(tx);
                    if (!t) {
                        t = '';
                        c = '';
                        while (s && s < '!') {
                            s = s.substr(1);
                        }
                        if (s) {
                            errorAt("Unexpected '{a}'.", line, character, s.substr(0, 1));
                            s = '';
                        }
                    } else {

    //      identifier

                        if (c.isAlpha() || c === '_' || c === '$') {
                            return it('(identifier)', t);
                        }

    //      number

                        if (c.isDigit()) {
                            if (!isFinite(Number(t))) {
                                warningAt("Bad number '{a}'.",
                                    line, character, t);
                            }
                            if (s.substr(0, 1).isAlpha()) {
                                warningAt("Missing space after '{a}'.",
                                        line, character, t);
                            }
                            if (c === '0') {
                                d = t.substr(1, 1);
                                if (d.isDigit()) {
                                    if (token.id !== '.') {
                                        warningAt("Don't use extra leading zeros '{a}'.",
                                            line, character, t);
                                    }
                                } else if (jsonmode && (d === 'x' || d === 'X')) {
                                    warningAt("Avoid 0x-. '{a}'.",
                                            line, character, t);
                                }
                            }
                            if (t.substr(t.length - 1) === '.') {
                                warningAt(
"A trailing decimal point can be confused with a dot '{a}'.", line, character, t);
                            }
                            return it('(number)', t);
                        }
                        switch (t) {

    //      string

                        case '"':
                        case "'":
                            return string(t);

    //      // comment

                        case '//':
                            s = '';
                            token.comment = true;
                            break;

    //      /* comment

                        case '/*':
                            for (;;) {
                                i = s.search(lx);
                                if (i >= 0) {
                                    break;
                                }
                                if (!nextLine()) {
                                    errorAt("Unclosed comment.", line, character);
                                }
                            }
                            character += i + 2;
                            if (s.substr(i, 1) === '/') {
                                errorAt("Nested comment.", line, character);
                            }
                            s = s.substr(i + 2);
                            token.comment = true;
                            break;

    //      /*members /*jshint /*global

                        case '/*members':
                        case '/*member':
                        case '/*jshint':
                        case '/*jslint':
                        case '/*global':
                        case '*/':
                            return {
                                value: t,
                                type: 'special',
                                line: line,
                                character: character,
                                from: from
                            };

                        case '':
                            break;
    //      /
                        case '/':
                            if (token.id === '/=') {
                                errorAt("A regular expression literal can be confused with '/='.",
                                    line, from);
                            }
                            if (prereg) {
                                depth = 0;
                                captures = 0;
                                l = 0;
                                for (;;) {
                                    b = true;
                                    c = s.charAt(l);
                                    l += 1;
                                    switch (c) {
                                    case '':
                                        errorAt("Unclosed regular expression.", line, from);
                                        return quit('Stopping.', line, from);
                                    case '/':
                                        if (depth > 0) {
                                            warningAt("{a} unterminated regular expression " +
                                                "group(s).", line, from + l, depth);
                                        }
                                        c = s.substr(0, l - 1);
                                        q = {
                                            g: true,
                                            i: true,
                                            m: true
                                        };
                                        while (q[s.charAt(l)] === true) {
                                            q[s.charAt(l)] = false;
                                            l += 1;
                                        }
                                        character += l;
                                        s = s.substr(l);
                                        q = s.charAt(0);
                                        if (q === '/' || q === '*') {
                                            errorAt("Confusing regular expression.",
                                                    line, from);
                                        }
                                        return it('(regexp)', c);
                                    case '\\':
                                        c = s.charAt(l);
                                        if (c < ' ') {
                                            warningAt(
"Unexpected control character in regular expression.", line, from + l);
                                        } else if (c === '<') {
                                            warningAt(
"Unexpected escaped character '{a}' in regular expression.", line, from + l, c);
                                        }
                                        l += 1;
                                        break;
                                    case '(':
                                        depth += 1;
                                        b = false;
                                        if (s.charAt(l) === '?') {
                                            l += 1;
                                            switch (s.charAt(l)) {
                                            case ':':
                                            case '=':
                                            case '!':
                                                l += 1;
                                                break;
                                            default:
                                                warningAt(
"Expected '{a}' and instead saw '{b}'.", line, from + l, ':', s.charAt(l));
                                            }
                                        } else {
                                            captures += 1;
                                        }
                                        break;
                                    case '|':
                                        b = false;
                                        break;
                                    case ')':
                                        if (depth === 0) {
                                            warningAt("Unescaped '{a}'.",
                                                    line, from + l, ')');
                                        } else {
                                            depth -= 1;
                                        }
                                        break;
                                    case ' ':
                                        q = 1;
                                        while (s.charAt(l) === ' ') {
                                            l += 1;
                                            q += 1;
                                        }
                                        if (q > 1) {
                                            warningAt(
"Spaces are hard to count. Use {{a}}.", line, from + l, q);
                                        }
                                        break;
                                    case '[':
                                        c = s.charAt(l);
                                        if (c === '^') {
                                            l += 1;
                                            if (option.regexp) {
                                                warningAt("Insecure '{a}'.",
                                                        line, from + l, c);
                                            } else if (s.charAt(l) === ']') {
                                                errorAt("Unescaped '{a}'.",
                                                    line, from + l, '^');
                                            }
                                        }
                                        if (c === ']') {
                                            warningAt("Empty class.", line,
                                                    from + l - 1);
                                        }
                                        isLiteral = false;
                                        isInRange = false;
klass:                                  do {
                                            c = s.charAt(l);
                                            l += 1;
                                            switch (c) {
                                            case '[':
                                            case '^':
                                                warningAt("Unescaped '{a}'.",
                                                        line, from + l, c);
                                                if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                                break;
                                            case '-':
                                                if (isLiteral && !isInRange) {
                                                    isLiteral = false;
                                                    isInRange = true;
                                                } else if (isInRange) {
                                                    isInRange = false;
                                                } else if (s.charAt(l) === ']') {
                                                    isInRange = true;
                                                } else {
                                                    if (option.regexdash !== (l === 2 || (l === 3 &&
                                                        s.charAt(1) === '^'))) {
                                                        warningAt("Unescaped '{a}'.",
                                                            line, from + l - 1, '-');
                                                    }
                                                    isLiteral = true;
                                                }
                                                break;
                                            case ']':
                                                if (isInRange && !option.regexdash) {
                                                    warningAt("Unescaped '{a}'.",
                                                            line, from + l - 1, '-');
                                                }
                                                break klass;
                                            case '\\':
                                                c = s.charAt(l);
                                                if (c < ' ') {
                                                    warningAt(
"Unexpected control character in regular expression.", line, from + l);
                                                } else if (c === '<') {
                                                    warningAt(
"Unexpected escaped character '{a}' in regular expression.", line, from + l, c);
                                                }
                                                l += 1;

                                                // \w, \s and \d are never part of a character range
                                                if (/[wsd]/i.test(c)) {
                                                    if (isInRange) {
                                                        warningAt("Unescaped '{a}'.",
                                                            line, from + l, '-');
                                                        isInRange = false;
                                                    }
                                                    isLiteral = false;
                                                } else if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                                break;
                                            case '/':
                                                warningAt("Unescaped '{a}'.",
                                                        line, from + l - 1, '/');

                                                if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                                break;
                                            case '<':
                                                if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                                break;
                                            default:
                                                if (isInRange) {
                                                    isInRange = false;
                                                } else {
                                                    isLiteral = true;
                                                }
                                            }
                                        } while (c);
                                        break;
                                    case '.':
                                        if (option.regexp) {
                                            warningAt("Insecure '{a}'.", line,
                                                    from + l, c);
                                        }
                                        break;
                                    case ']':
                                    case '?':
                                    case '{':
                                    case '}':
                                    case '+':
                                    case '*':
                                        warningAt("Unescaped '{a}'.", line,
                                                from + l, c);
                                    }
                                    if (b) {
                                        switch (s.charAt(l)) {
                                        case '?':
                                        case '+':
                                        case '*':
                                            l += 1;
                                            if (s.charAt(l) === '?') {
                                                l += 1;
                                            }
                                            break;
                                        case '{':
                                            l += 1;
                                            c = s.charAt(l);
                                            if (c < '0' || c > '9') {
                                                warningAt(
"Expected a number and instead saw '{a}'.", line, from + l, c);
                                            }
                                            l += 1;
                                            low = +c;
                                            for (;;) {
                                                c = s.charAt(l);
                                                if (c < '0' || c > '9') {
                                                    break;
                                                }
                                                l += 1;
                                                low = +c + (low * 10);
                                            }
                                            high = low;
                                            if (c === ',') {
                                                l += 1;
                                                high = Infinity;
                                                c = s.charAt(l);
                                                if (c >= '0' && c <= '9') {
                                                    l += 1;
                                                    high = +c;
                                                    for (;;) {
                                                        c = s.charAt(l);
                                                        if (c < '0' || c > '9') {
                                                            break;
                                                        }
                                                        l += 1;
                                                        high = +c + (high * 10);
                                                    }
                                                }
                                            }
                                            if (s.charAt(l) !== '}') {
                                                warningAt(
"Expected '{a}' and instead saw '{b}'.", line, from + l, '}', c);
                                            } else {
                                                l += 1;
                                            }
                                            if (s.charAt(l) === '?') {
                                                l += 1;
                                            }
                                            if (low > high) {
                                                warningAt(
"'{a}' should not be greater than '{b}'.", line, from + l, low, high);
                                            }
                                        }
                                    }
                                }
                                c = s.substr(0, l - 1);
                                character += l;
                                s = s.substr(l);
                                return it('(regexp)', c);
                            }
                            return it('(punctuator)', t);

    //      punctuator

                        case '#':
                            return it('(punctuator)', t);
                        default:
                            return it('(punctuator)', t);
                        }
                    }
                }
            }
        };
    }());


    function addlabel(t, type) {

        if (t === 'hasOwnProperty') {
            warning("'hasOwnProperty' is a really bad name.");
        }

// Define t in the current function in the current scope.
        if (is_own(funct, t) && !funct['(global)']) {
            if (funct[t] === true) {
                if (option.latedef)
                    warning("'{a}' was used before it was defined.", nexttoken, t);
            } else {
                if (!option.shadow && type !== "exception")
                    warning("'{a}' is already defined.", nexttoken, t);
            }
        }

        funct[t] = type;
        if (funct['(global)']) {
            global[t] = funct;
            if (is_own(implied, t)) {
                if (option.latedef)
                    warning("'{a}' was used before it was defined.", nexttoken, t);
                delete implied[t];
            }
        } else {
            scope[t] = funct;
        }
    }


    function doOption() {
        var b, obj, filter, o = nexttoken.value, t, tn, v;

        switch (o) {
        case '*/':
            error("Unbegun comment.");
            break;
        case '/*members':
        case '/*member':
            o = '/*members';
            if (!membersOnly) {
                membersOnly = {};
            }
            obj = membersOnly;
            break;
        case '/*jshint':
        case '/*jslint':
            obj = option;
            filter = boolOptions;
            break;
        case '/*global':
            obj = predefined;
            break;
        default:
            error("What?");
        }

        t = lex.token();
loop:   for (;;) {
            for (;;) {
                if (t.type === 'special' && t.value === '*/') {
                    break loop;
                }
                if (t.id !== '(endline)' && t.id !== ',') {
                    break;
                }
                t = lex.token();
            }
            if (t.type !== '(string)' && t.type !== '(identifier)' &&
                    o !== '/*members') {
                error("Bad option.", t);
            }

            v = lex.token();
            if (v.id === ':') {
                v = lex.token();

                if (obj === membersOnly) {
                    error("Expected '{a}' and instead saw '{b}'.",
                            t, '*/', ':');
                }

                if (o === '/*jshint') {
                    checkOption(t.value, t);
                }

                if (t.value === 'indent' && (o === '/*jshint' || o === '/*jslint')) {
                    b = +v.value;
                    if (typeof b !== 'number' || !isFinite(b) || b <= 0 ||
                            Math.floor(b) !== b) {
                        error("Expected a small integer and instead saw '{a}'.",
                                v, v.value);
                    }
                    obj.white = true;
                    obj.indent = b;
                } else if (t.value === 'maxerr' && (o === '/*jshint' || o === '/*jslint')) {
                    b = +v.value;
                    if (typeof b !== 'number' || !isFinite(b) || b <= 0 ||
                            Math.floor(b) !== b) {
                        error("Expected a small integer and instead saw '{a}'.",
                                v, v.value);
                    }
                    obj.maxerr = b;
                } else if (t.value === 'maxlen' && (o === '/*jshint' || o === '/*jslint')) {
                    b = +v.value;
                    if (typeof b !== 'number' || !isFinite(b) || b <= 0 ||
                            Math.floor(b) !== b) {
                        error("Expected a small integer and instead saw '{a}'.",
                                v, v.value);
                    }
                    obj.maxlen = b;
                } else if (t.value === 'validthis') {
                    if (funct['(global)']) {
                        error("Option 'validthis' can't be used in a global scope.");
                    } else {
                        if (v.value === 'true' || v.value === 'false')
                            obj[t.value] = v.value === 'true';
                        else
                            error("Bad option value.", v);
                    }
                } else if (v.value === 'true' || v.value === 'false') {
                    if (o === '/*jslint') {
                        tn = renamedOptions[t.value] || t.value;
                        obj[tn] = v.value === 'true';
                        if (invertedOptions[tn] !== undefined) {
                            obj[tn] = !obj[tn];
                        }
                    } else {
                        obj[t.value] = v.value === 'true';
                    }
                } else {
                    error("Bad option value.", v);
                }
                t = lex.token();
            } else {
                if (o === '/*jshint' || o === '/*jslint') {
                    error("Missing option value.", t);
                }
                obj[t.value] = false;
                t = v;
            }
        }
        if (filter) {
            assume();
        }
    }


// We need a peek function. If it has an argument, it peeks that much farther
// ahead. It is used to distinguish
//     for ( var i in ...
// from
//     for ( var i = ...

    function peek(p) {
        var i = p || 0, j = 0, t;

        while (j <= i) {
            t = lookahead[j];
            if (!t) {
                t = lookahead[j] = lex.token();
            }
            j += 1;
        }
        return t;
    }



// Produce the next token. It looks for programming errors.

    function advance(id, t) {
        switch (token.id) {
        case '(number)':
            if (nexttoken.id === '.') {
                warning("A dot following a number can be confused with a decimal point.", token);
            }
            break;
        case '-':
            if (nexttoken.id === '-' || nexttoken.id === '--') {
                warning("Confusing minusses.");
            }
            break;
        case '+':
            if (nexttoken.id === '+' || nexttoken.id === '++') {
                warning("Confusing plusses.");
            }
            break;
        }

        if (token.type === '(string)' || token.identifier) {
            anonname = token.value;
        }

        if (id && nexttoken.id !== id) {
            if (t) {
                if (nexttoken.id === '(end)') {
                    warning("Unmatched '{a}'.", t, t.id);
                } else {
                    warning("Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
                            nexttoken, id, t.id, t.line, nexttoken.value);
                }
            } else if (nexttoken.type !== '(identifier)' ||
                            nexttoken.value !== id) {
                warning("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, id, nexttoken.value);
            }
        }

        prevtoken = token;
        token = nexttoken;
        for (;;) {
            nexttoken = lookahead.shift() || lex.token();
            if (nexttoken.id === '(end)' || nexttoken.id === '(error)') {
                return;
            }
            if (nexttoken.type === 'special') {
                doOption();
            } else {
                if (nexttoken.id !== '(endline)') {
                    break;
                }
            }
        }
    }


// This is the heart of JSHINT, the Pratt parser. In addition to parsing, it
// is looking for ad hoc lint patterns. We add .fud to Pratt's model, which is
// like .nud except that it is only used on the first token of a statement.
// Having .fud makes it much easier to define statement-oriented languages like
// JavaScript. I retained Pratt's nomenclature.

// .nud     Null denotation
// .fud     First null denotation
// .led     Left denotation
//  lbp     Left binding power
//  rbp     Right binding power

// They are elements of the parsing method called Top Down Operator Precedence.

    function expression(rbp, initial) {
        var left, isArray = false, isObject = false;

        if (nexttoken.id === '(end)')
            error("Unexpected early end of program.", token);

        advance();
        if (initial) {
            anonname = 'anonymous';
            funct['(verb)'] = token.value;
        }
        if (initial === true && token.fud) {
            left = token.fud();
        } else {
            if (token.nud) {
                left = token.nud();
            } else {
                if (nexttoken.type === '(number)' && token.id === '.') {
                    warning("A leading decimal point can be confused with a dot: '.{a}'.",
                            token, nexttoken.value);
                    advance();
                    return token;
                } else {
                    error("Expected an identifier and instead saw '{a}'.",
                            token, token.id);
                }
            }
            while (rbp < nexttoken.lbp) {
                isArray = token.value === 'Array';
                isObject = token.value === 'Object';

                // #527, new Foo.Array(), Foo.Array(), new Foo.Object(), Foo.Object()
                // Line breaks in IfStatement heads exist to satisfy the checkJSHint
                // "Line too long." error.
                if (left && (left.value || (left.first && left.first.value))) {
                    // If the left.value is not "new", or the left.first.value is a "."
                    // then safely assume that this is not "new Array()" and possibly
                    // not "new Object()"...
                    if (left.value !== 'new' ||
                      (left.first && left.first.value && left.first.value === '.')) {
                        isArray = false;
                        // ...In the case of Object, if the left.value and token.value
                        // are not equal, then safely assume that this not "new Object()"
                        if (left.value !== token.value) {
                            isObject = false;
                        }
                    }
                }

                advance();
                if (isArray && token.id === '(' && nexttoken.id === ')')
                    warning("Use the array literal notation [].", token);
                if (isObject && token.id === '(' && nexttoken.id === ')')
                    warning("Use the object literal notation {}.", token);
                if (token.led) {
                    left = token.led(left);
                } else {
                    error("Expected an operator and instead saw '{a}'.",
                        token, token.id);
                }
            }
        }
        return left;
    }


// Functions for conformance of style.

    function adjacent(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (option.white) {
            if (left.character !== right.from && left.line === right.line) {
                left.from += (left.character - left.from);
                warning("Unexpected space after '{a}'.", left, left.value);
            }
        }
    }

    function nobreak(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (option.white && (left.character !== right.from || left.line !== right.line)) {
            warning("Unexpected space before '{a}'.", right, right.value);
        }
    }

    function nospace(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (option.white && !left.comment) {
            if (left.line === right.line) {
                adjacent(left, right);
            }
        }
    }

    function nonadjacent(left, right) {
        if (option.white) {
            left = left || token;
            right = right || nexttoken;
            if (left.line === right.line && left.character === right.from) {
                left.from += (left.character - left.from);
                warning("Missing space after '{a}'.",
                        left, left.value);
            }
        }
    }

    function nobreaknonadjacent(left, right) {
        left = left || token;
        right = right || nexttoken;
        if (!option.laxbreak && left.line !== right.line) {
            warning("Bad line breaking before '{a}'.", right, right.id);
        } else if (option.white) {
            left = left || token;
            right = right || nexttoken;
            if (left.character === right.from) {
                left.from += (left.character - left.from);
                warning("Missing space after '{a}'.",
                        left, left.value);
            }
        }
    }

    function indentation(bias) {
        var i;
        if (option.white && nexttoken.id !== '(end)') {
            i = indent + (bias || 0);
            if (nexttoken.from !== i) {
                warning(
"Expected '{a}' to have an indentation at {b} instead at {c}.",
                        nexttoken, nexttoken.value, i, nexttoken.from);
            }
        }
    }

    function nolinebreak(t) {
        t = t || token;
        if (t.line !== nexttoken.line) {
            warning("Line breaking error '{a}'.", t, t.value);
        }
    }


    function comma() {
        if (token.line !== nexttoken.line) {
            if (!option.laxcomma) {
                if (comma.first) {
                    warning("Comma warnings can be turned off with 'laxcomma'");
                    comma.first = false;
                }
                warning("Bad line breaking before '{a}'.", token, nexttoken.id);
            }
        } else if (!token.comment && token.character !== nexttoken.from && option.white) {
            token.from += (token.character - token.from);
            warning("Unexpected space after '{a}'.", token, token.value);
        }
        advance(',');
        nonadjacent(token, nexttoken);
    }


// Functional constructors for making the symbols that will be inherited by
// tokens.

    function symbol(s, p) {
        var x = syntax[s];
        if (!x || typeof x !== 'object') {
            syntax[s] = x = {
                id: s,
                lbp: p,
                value: s
            };
        }
        return x;
    }


    function delim(s) {
        return symbol(s, 0);
    }


    function stmt(s, f) {
        var x = delim(s);
        x.identifier = x.reserved = true;
        x.fud = f;
        return x;
    }


    function blockstmt(s, f) {
        var x = stmt(s, f);
        x.block = true;
        return x;
    }


    function reserveName(x) {
        var c = x.id.charAt(0);
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            x.identifier = x.reserved = true;
        }
        return x;
    }


    function prefix(s, f) {
        var x = symbol(s, 150);
        reserveName(x);
        x.nud = (typeof f === 'function') ? f : function () {
            this.right = expression(150);
            this.arity = 'unary';
            if (this.id === '++' || this.id === '--') {
                if (option.plusplus) {
                    warning("Unexpected use of '{a}'.", this, this.id);
                } else if ((!this.right.identifier || this.right.reserved) &&
                        this.right.id !== '.' && this.right.id !== '[') {
                    warning("Bad operand.", this);
                }
            }
            return this;
        };
        return x;
    }


    function type(s, f) {
        var x = delim(s);
        x.type = s;
        x.nud = f;
        return x;
    }


    function reserve(s, f) {
        var x = type(s, f);
        x.identifier = x.reserved = true;
        return x;
    }


    function reservevar(s, v) {
        return reserve(s, function () {
            if (typeof v === 'function') {
                v(this);
            }
            return this;
        });
    }


    function infix(s, f, p, w) {
        var x = symbol(s, p);
        reserveName(x);
        x.led = function (left) {
            if (!w) {
                nobreaknonadjacent(prevtoken, token);
                nonadjacent(token, nexttoken);
            }
            if (s === "in" && left.id === "!") {
                warning("Confusing use of '{a}'.", left, '!');
            }
            if (typeof f === 'function') {
                return f(left, this);
            } else {
                this.left = left;
                this.right = expression(p);
                return this;
            }
        };
        return x;
    }


    function relation(s, f) {
        var x = symbol(s, 100);
        x.led = function (left) {
            nobreaknonadjacent(prevtoken, token);
            nonadjacent(token, nexttoken);
            var right = expression(100);
            if ((left && left.id === 'NaN') || (right && right.id === 'NaN')) {
                warning("Use the isNaN function to compare with NaN.", this);
            } else if (f) {
                f.apply(this, [left, right]);
            }
            if (left.id === '!') {
                warning("Confusing use of '{a}'.", left, '!');
            }
            if (right.id === '!') {
                warning("Confusing use of '{a}'.", right, '!');
            }
            this.left = left;
            this.right = right;
            return this;
        };
        return x;
    }


    function isPoorRelation(node) {
        return node &&
              ((node.type === '(number)' && +node.value === 0) ||
               (node.type === '(string)' && node.value === '') ||
               (node.type === 'null' && !option.eqnull) ||
                node.type === 'true' ||
                node.type === 'false' ||
                node.type === 'undefined');
    }


    function assignop(s, f) {
        symbol(s, 20).exps = true;
        return infix(s, function (left, that) {
            var l;
            that.left = left;
            if (predefined[left.value] === false &&
                    scope[left.value]['(global)'] === true) {
                warning("Read only.", left);
            } else if (left['function']) {
                warning("'{a}' is a function.", left, left.value);
            }
            if (left) {
                if (option.esnext && funct[left.value] === 'const') {
                    warning("Attempting to override '{a}' which is a constant", left, left.value);
                }
                if (left.id === '.' || left.id === '[') {
                    if (!left.left || left.left.value === 'arguments') {
                        warning('Bad assignment.', that);
                    }
                    that.right = expression(19);
                    return that;
                } else if (left.identifier && !left.reserved) {
                    if (funct[left.value] === 'exception') {
                        warning("Do not assign to the exception parameter.", left);
                    }
                    that.right = expression(19);
                    return that;
                }
                if (left === syntax['function']) {
                    warning(
"Expected an identifier in an assignment and instead saw a function invocation.",
                                token);
                }
            }
            error("Bad assignment.", that);
        }, 20);
    }


    function bitwise(s, f, p) {
        var x = symbol(s, p);
        reserveName(x);
        x.led = (typeof f === 'function') ? f : function (left) {
            if (option.bitwise) {
                warning("Unexpected use of '{a}'.", this, this.id);
            }
            this.left = left;
            this.right = expression(p);
            return this;
        };
        return x;
    }


    function bitwiseassignop(s) {
        symbol(s, 20).exps = true;
        return infix(s, function (left, that) {
            if (option.bitwise) {
                warning("Unexpected use of '{a}'.", that, that.id);
            }
            nonadjacent(prevtoken, token);
            nonadjacent(token, nexttoken);
            if (left) {
                if (left.id === '.' || left.id === '[' ||
                        (left.identifier && !left.reserved)) {
                    expression(19);
                    return that;
                }
                if (left === syntax['function']) {
                    warning(
"Expected an identifier in an assignment, and instead saw a function invocation.",
                                token);
                }
                return that;
            }
            error("Bad assignment.", that);
        }, 20);
    }


    function suffix(s, f) {
        var x = symbol(s, 150);
        x.led = function (left) {
            if (option.plusplus) {
                warning("Unexpected use of '{a}'.", this, this.id);
            } else if ((!left.identifier || left.reserved) &&
                    left.id !== '.' && left.id !== '[') {
                warning("Bad operand.", this);
            }
            this.left = left;
            return this;
        };
        return x;
    }


    // fnparam means that this identifier is being defined as a function
    // argument (see identifier())
    function optionalidentifier(fnparam) {
        if (nexttoken.identifier) {
            advance();
            if (token.reserved && !option.es5) {
                // `undefined` as a function param is a common pattern to protect
                // against the case when somebody does `undefined = true` and
                // help with minification. More info: https://gist.github.com/315916
                if (!fnparam || token.value !== 'undefined') {
                    warning("Expected an identifier and instead saw '{a}' (a reserved word).",
                            token, token.id);
                }
            }
            return token.value;
        }
    }

    // fnparam means that this identifier is being defined as a function
    // argument
    function identifier(fnparam) {
        var i = optionalidentifier(fnparam);
        if (i) {
            return i;
        }
        if (token.id === 'function' && nexttoken.id === '(') {
            warning("Missing name in function declaration.");
        } else {
            error("Expected an identifier and instead saw '{a}'.",
                    nexttoken, nexttoken.value);
        }
    }


    function reachable(s) {
        var i = 0, t;
        if (nexttoken.id !== ';' || noreach) {
            return;
        }
        for (;;) {
            t = peek(i);
            if (t.reach) {
                return;
            }
            if (t.id !== '(endline)') {
                if (t.id === 'function') {
                    if (!option.latedef) {
                        break;
                    }
                    warning(
"Inner functions should be listed at the top of the outer function.", t);
                    break;
                }
                warning("Unreachable '{a}' after '{b}'.", t, t.value, s);
                break;
            }
            i += 1;
        }
    }


    function statement(noindent) {
        var i = indent, r, s = scope, t = nexttoken;

        if (t.id === ";") {
            advance(";");
            return;
        }

// Is this a labelled statement?

        if (t.identifier && !t.reserved && peek().id === ':') {
            advance();
            advance(':');
            scope = Object.create(s);
            addlabel(t.value, 'label');
            if (!nexttoken.labelled) {
                warning("Label '{a}' on {b} statement.",
                        nexttoken, t.value, nexttoken.value);
            }
            if (jx.test(t.value + ':')) {
                warning("Label '{a}' looks like a javascript url.",
                        t, t.value);
            }
            nexttoken.label = t.value;
            t = nexttoken;
        }

// Parse the statement.

        if (!noindent) {
            indentation();
        }
        r = expression(0, true);

        // Look for the final semicolon.
        if (!t.block) {
            if (!option.expr && (!r || !r.exps)) {
                warning("Expected an assignment or function call and instead saw an expression.",
                    token);
            } else if (option.nonew && r.id === '(' && r.left.id === 'new') {
                warning("Do not use 'new' for side effects.");
            }

            if (nexttoken.id === ',') {
                return comma();
            }

            if (nexttoken.id !== ';') {
                if (!option.asi) {
                    // If this is the last statement in a block that ends on
                    // the same line *and* option lastsemic is on, ignore the warning.
                    // Otherwise, complain about missing semicolon.
                    if (!option.lastsemic || nexttoken.id !== '}' ||
                            nexttoken.line !== token.line) {
                        warningAt("Missing semicolon.", token.line, token.character);
                    }
                }
            } else {
                adjacent(token, nexttoken);
                advance(';');
                nonadjacent(token, nexttoken);
            }
        }

// Restore the indentation.

        indent = i;
        scope = s;
        return r;
    }


    function statements(startLine) {
        var a = [], f, p;

        while (!nexttoken.reach && nexttoken.id !== '(end)') {
            if (nexttoken.id === ';') {
                p = peek();
                if (!p || p.id !== "(") {
                    warning("Unnecessary semicolon.");
                }
                advance(';');
            } else {
                a.push(statement(startLine === nexttoken.line));
            }
        }
        return a;
    }


    /*
     * read all directives
     * recognizes a simple form of asi, but always
     * warns, if it is used
     */
    function directives() {
        var i, p, pn;

        for (;;) {
            if (nexttoken.id === "(string)") {
                p = peek(0);
                if (p.id === "(endline)") {
                    i = 1;
                    do {
                        pn = peek(i);
                        i = i + 1;
                    } while (pn.id === "(endline)");

                    if (pn.id !== ";") {
                        if (pn.id !== "(string)" && pn.id !== "(number)" &&
                            pn.id !== "(regexp)" && pn.identifier !== true &&
                            pn.id !== "}") {
                            break;
                        }
                        warning("Missing semicolon.", nexttoken);
                    } else {
                        p = pn;
                    }
                } else if (p.id === "}") {
                    // directive with no other statements, warn about missing semicolon
                    warning("Missing semicolon.", p);
                } else if (p.id !== ";") {
                    break;
                }

                indentation();
                advance();
                if (directive[token.value]) {
                    warning("Unnecessary directive \"{a}\".", token, token.value);
                }

                if (token.value === "use strict") {
                    option.newcap = true;
                    option.undef = true;
                }

                // there's no directive negation, so always set to true
                directive[token.value] = true;

                if (p.id === ";") {
                    advance(";");
                }
                continue;
            }
            break;
        }
    }


    /*
     * Parses a single block. A block is a sequence of statements wrapped in
     * braces.
     *
     * ordinary - true for everything but function bodies and try blocks.
     * stmt     - true if block can be a single statement (e.g. in if/for/while).
     * isfunc   - true if block is a function body
     */
    function block(ordinary, stmt, isfunc) {
        var a,
            b = inblock,
            old_indent = indent,
            m,
            s = scope,
            t,
            line,
            d;

        inblock = ordinary;
        if (!ordinary || !option.funcscope) scope = Object.create(scope);
        nonadjacent(token, nexttoken);
        t = nexttoken;

        if (nexttoken.id === '{') {
            advance('{');
            line = token.line;
            if (nexttoken.id !== '}') {
                indent += option.indent;
                while (!ordinary && nexttoken.from > indent) {
                    indent += option.indent;
                }

                if (isfunc) {
                    m = {};
                    for (d in directive) {
                        if (is_own(directive, d)) {
                            m[d] = directive[d];
                        }
                    }
                    directives();

                    if (option.strict && funct['(context)']['(global)']) {
                        if (!m["use strict"] && !directive["use strict"]) {
                            warning("Missing \"use strict\" statement.");
                        }
                    }
                }

                a = statements(line);

                if (isfunc) {
                    directive = m;
                }

                indent -= option.indent;
                if (line !== nexttoken.line) {
                    indentation();
                }
            } else if (line !== nexttoken.line) {
                indentation();
            }
            advance('}', t);
            indent = old_indent;
        } else if (!ordinary) {
            error("Expected '{a}' and instead saw '{b}'.",
                  nexttoken, '{', nexttoken.value);
        } else {
            if (!stmt || option.curly)
                warning("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, '{', nexttoken.value);

            noreach = true;
            indent += option.indent;
            // test indentation only if statement is in new line
            a = [statement(nexttoken.line === token.line)];
            indent -= option.indent;
            noreach = false;
        }
        funct['(verb)'] = null;
        if (!ordinary || !option.funcscope) scope = s;
        inblock = b;
        if (ordinary && option.noempty && (!a || a.length === 0)) {
            warning("Empty block.");
        }
        return a;
    }


    function countMember(m) {
        if (membersOnly && typeof membersOnly[m] !== 'boolean') {
            warning("Unexpected /*member '{a}'.", token, m);
        }
        if (typeof member[m] === 'number') {
            member[m] += 1;
        } else {
            member[m] = 1;
        }
    }


    function note_implied(token) {
        var name = token.value, line = token.line, a = implied[name];
        if (typeof a === 'function') {
            a = false;
        }

        if (!a) {
            a = [line];
            implied[name] = a;
        } else if (a[a.length - 1] !== line) {
            a.push(line);
        }
    }


    // Build the syntax table by declaring the syntactic elements of the language.

    type('(number)', function () {
        return this;
    });

    type('(string)', function () {
        return this;
    });

    syntax['(identifier)'] = {
        type: '(identifier)',
        lbp: 0,
        identifier: true,
        nud: function () {
            var v = this.value,
                s = scope[v],
                f;

            if (typeof s === 'function') {
                // Protection against accidental inheritance.
                s = undefined;
            } else if (typeof s === 'boolean') {
                f = funct;
                funct = functions[0];
                addlabel(v, 'var');
                s = funct;
                funct = f;
            }

            // The name is in scope and defined in the current function.
            if (funct === s) {
                // Change 'unused' to 'var', and reject labels.
                switch (funct[v]) {
                case 'unused':
                    funct[v] = 'var';
                    break;
                case 'unction':
                    funct[v] = 'function';
                    this['function'] = true;
                    break;
                case 'function':
                    this['function'] = true;
                    break;
                case 'label':
                    warning("'{a}' is a statement label.", token, v);
                    break;
                }
            } else if (funct['(global)']) {
                // The name is not defined in the function.  If we are in the global
                // scope, then we have an undefined variable.
                //
                // Operators typeof and delete do not raise runtime errors even if
                // the base object of a reference is null so no need to display warning
                // if we're inside of typeof or delete.

                if (option.undef && typeof predefined[v] !== 'boolean') {
                    // Attempting to subscript a null reference will throw an
                    // error, even within the typeof and delete operators
                    if (!(anonname === 'typeof' || anonname === 'delete') ||
                        (nexttoken && (nexttoken.value === '.' || nexttoken.value === '['))) {

                        isundef(funct, "'{a}' is not defined.", token, v);
                    }
                }
                note_implied(token);
            } else {
                // If the name is already defined in the current
                // function, but not as outer, then there is a scope error.

                switch (funct[v]) {
                case 'closure':
                case 'function':
                case 'var':
                case 'unused':
                    warning("'{a}' used out of scope.", token, v);
                    break;
                case 'label':
                    warning("'{a}' is a statement label.", token, v);
                    break;
                case 'outer':
                case 'global':
                    break;
                default:
                    // If the name is defined in an outer function, make an outer entry,
                    // and if it was unused, make it var.
                    if (s === true) {
                        funct[v] = true;
                    } else if (s === null) {
                        warning("'{a}' is not allowed.", token, v);
                        note_implied(token);
                    } else if (typeof s !== 'object') {
                        // Operators typeof and delete do not raise runtime errors even
                        // if the base object of a reference is null so no need to
                        // display warning if we're inside of typeof or delete.
                        if (option.undef) {
                            // Attempting to subscript a null reference will throw an
                            // error, even within the typeof and delete operators
                            if (!(anonname === 'typeof' || anonname === 'delete') ||
                                (nexttoken &&
                                    (nexttoken.value === '.' || nexttoken.value === '['))) {

                                isundef(funct, "'{a}' is not defined.", token, v);
                            }
                        }
                        funct[v] = true;
                        note_implied(token);
                    } else {
                        switch (s[v]) {
                        case 'function':
                        case 'unction':
                            this['function'] = true;
                            s[v] = 'closure';
                            funct[v] = s['(global)'] ? 'global' : 'outer';
                            break;
                        case 'var':
                        case 'unused':
                            s[v] = 'closure';
                            funct[v] = s['(global)'] ? 'global' : 'outer';
                            break;
                        case 'closure':
                        case 'parameter':
                            funct[v] = s['(global)'] ? 'global' : 'outer';
                            break;
                        case 'label':
                            warning("'{a}' is a statement label.", token, v);
                        }
                    }
                }
            }
            return this;
        },
        led: function () {
            error("Expected an operator and instead saw '{a}'.",
                nexttoken, nexttoken.value);
        }
    };

    type('(regexp)', function () {
        return this;
    });


// ECMAScript parser

    delim('(endline)');
    delim('(begin)');
    delim('(end)').reach = true;
    delim('</').reach = true;
    delim('<!');
    delim('<!--');
    delim('-->');
    delim('(error)').reach = true;
    delim('}').reach = true;
    delim(')');
    delim(']');
    delim('"').reach = true;
    delim("'").reach = true;
    delim(';');
    delim(':').reach = true;
    delim(',');
    delim('#');
    delim('@');
    reserve('else');
    reserve('case').reach = true;
    reserve('catch');
    reserve('default').reach = true;
    reserve('finally');
    reservevar('arguments', function (x) {
        if (directive['use strict'] && funct['(global)']) {
            warning("Strict violation.", x);
        }
    });
    reservevar('eval');
    reservevar('false');
    reservevar('Infinity');
    reservevar('NaN');
    reservevar('null');
    reservevar('this', function (x) {
        if (directive['use strict'] && !option.validthis && ((funct['(statement)'] &&
                funct['(name)'].charAt(0) > 'Z') || funct['(global)'])) {
            warning("Possible strict violation.", x);
        }
    });
    reservevar('true');
    reservevar('undefined');
    assignop('=', 'assign', 20);
    assignop('+=', 'assignadd', 20);
    assignop('-=', 'assignsub', 20);
    assignop('*=', 'assignmult', 20);
    assignop('/=', 'assigndiv', 20).nud = function () {
        error("A regular expression literal can be confused with '/='.");
    };
    assignop('%=', 'assignmod', 20);
    bitwiseassignop('&=', 'assignbitand', 20);
    bitwiseassignop('|=', 'assignbitor', 20);
    bitwiseassignop('^=', 'assignbitxor', 20);
    bitwiseassignop('<<=', 'assignshiftleft', 20);
    bitwiseassignop('>>=', 'assignshiftright', 20);
    bitwiseassignop('>>>=', 'assignshiftrightunsigned', 20);
    infix('?', function (left, that) {
        that.left = left;
        that.right = expression(10);
        advance(':');
        that['else'] = expression(10);
        return that;
    }, 30);

    infix('||', 'or', 40);
    infix('&&', 'and', 50);
    bitwise('|', 'bitor', 70);
    bitwise('^', 'bitxor', 80);
    bitwise('&', 'bitand', 90);
    relation('==', function (left, right) {
        var eqnull = option.eqnull && (left.value === 'null' || right.value === 'null');

        if (!eqnull && option.eqeqeq)
            warning("Expected '{a}' and instead saw '{b}'.", this, '===', '==');
        else if (isPoorRelation(left))
            warning("Use '{a}' to compare with '{b}'.", this, '===', left.value);
        else if (isPoorRelation(right))
            warning("Use '{a}' to compare with '{b}'.", this, '===', right.value);

        return this;
    });
    relation('===');
    relation('!=', function (left, right) {
        var eqnull = option.eqnull &&
                (left.value === 'null' || right.value === 'null');

        if (!eqnull && option.eqeqeq) {
            warning("Expected '{a}' and instead saw '{b}'.",
                    this, '!==', '!=');
        } else if (isPoorRelation(left)) {
            warning("Use '{a}' to compare with '{b}'.",
                    this, '!==', left.value);
        } else if (isPoorRelation(right)) {
            warning("Use '{a}' to compare with '{b}'.",
                    this, '!==', right.value);
        }
        return this;
    });
    relation('!==');
    relation('<');
    relation('>');
    relation('<=');
    relation('>=');
    bitwise('<<', 'shiftleft', 120);
    bitwise('>>', 'shiftright', 120);
    bitwise('>>>', 'shiftrightunsigned', 120);
    infix('in', 'in', 120);
    infix('instanceof', 'instanceof', 120);
    infix('+', function (left, that) {
        var right = expression(130);
        if (left && right && left.id === '(string)' && right.id === '(string)') {
            left.value += right.value;
            left.character = right.character;
            if (!option.scripturl && jx.test(left.value)) {
                warning("JavaScript URL.", left);
            }
            return left;
        }
        that.left = left;
        that.right = right;
        return that;
    }, 130);
    prefix('+', 'num');
    prefix('+++', function () {
        warning("Confusing pluses.");
        this.right = expression(150);
        this.arity = 'unary';
        return this;
    });
    infix('+++', function (left) {
        warning("Confusing pluses.");
        this.left = left;
        this.right = expression(130);
        return this;
    }, 130);
    infix('-', 'sub', 130);
    prefix('-', 'neg');
    prefix('---', function () {
        warning("Confusing minuses.");
        this.right = expression(150);
        this.arity = 'unary';
        return this;
    });
    infix('---', function (left) {
        warning("Confusing minuses.");
        this.left = left;
        this.right = expression(130);
        return this;
    }, 130);
    infix('*', 'mult', 140);
    infix('/', 'div', 140);
    infix('%', 'mod', 140);

    suffix('++', 'postinc');
    prefix('++', 'preinc');
    syntax['++'].exps = true;

    suffix('--', 'postdec');
    prefix('--', 'predec');
    syntax['--'].exps = true;
    prefix('delete', function () {
        var p = expression(0);
        if (!p || (p.id !== '.' && p.id !== '[')) {
            warning("Variables should not be deleted.");
        }
        this.first = p;
        return this;
    }).exps = true;

    prefix('~', function () {
        if (option.bitwise) {
            warning("Unexpected '{a}'.", this, '~');
        }
        expression(150);
        return this;
    });

    prefix('!', function () {
        this.right = expression(150);
        this.arity = 'unary';
        if (bang[this.right.id] === true) {
            warning("Confusing use of '{a}'.", this, '!');
        }
        return this;
    });
    prefix('typeof', 'typeof');
    prefix('new', function () {
        var c = expression(155), i;
        if (c && c.id !== 'function') {
            if (c.identifier) {
                c['new'] = true;
                switch (c.value) {
                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Math':
                case 'JSON':
                    warning("Do not use {a} as a constructor.", token, c.value);
                    break;
                case 'Function':
                    if (!option.evil) {
                        warning("The Function constructor is eval.");
                    }
                    break;
                case 'Date':
                case 'RegExp':
                    break;
                default:
                    if (c.id !== 'function') {
                        i = c.value.substr(0, 1);
                        if (option.newcap && (i < 'A' || i > 'Z')) {
                            warning("A constructor name should start with an uppercase letter.",
                                token);
                        }
                    }
                }
            } else {
                if (c.id !== '.' && c.id !== '[' && c.id !== '(') {
                    warning("Bad constructor.", token);
                }
            }
        } else {
            if (!option.supernew)
                warning("Weird construction. Delete 'new'.", this);
        }
        adjacent(token, nexttoken);
        if (nexttoken.id !== '(' && !option.supernew) {
            warning("Missing '()' invoking a constructor.");
        }
        this.first = c;
        return this;
    });
    syntax['new'].exps = true;

    prefix('void').exps = true;

    infix('.', function (left, that) {
        adjacent(prevtoken, token);
        nobreak();
        var m = identifier();
        if (typeof m === 'string') {
            countMember(m);
        }
        that.left = left;
        that.right = m;
        if (left && left.value === 'arguments' && (m === 'callee' || m === 'caller')) {
            if (option.noarg)
                warning("Avoid arguments.{a}.", left, m);
            else if (directive['use strict'])
                error('Strict violation.');
        } else if (!option.evil && left && left.value === 'document' &&
                (m === 'write' || m === 'writeln')) {
            warning("document.write can be a form of eval.", left);
        }
        if (!option.evil && (m === 'eval' || m === 'execScript')) {
            warning('eval is evil.');
        }
        return that;
    }, 160, true);

    infix('(', function (left, that) {
        if (prevtoken.id !== '}' && prevtoken.id !== ')') {
            nobreak(prevtoken, token);
        }
        nospace();
        if (option.immed && !left.immed && left.id === 'function') {
            warning("Wrap an immediate function invocation in parentheses " +
                "to assist the reader in understanding that the expression " +
                "is the result of a function, and not the function itself.");
        }
        var n = 0,
            p = [];
        if (left) {
            if (left.type === '(identifier)') {
                if (left.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/)) {
                    if (left.value !== 'Number' && left.value !== 'String' &&
                            left.value !== 'Boolean' &&
                            left.value !== 'Date') {
                        if (left.value === 'Math') {
                            warning("Math is not a function.", left);
                        } else if (option.newcap) {
                            warning(
"Missing 'new' prefix when invoking a constructor.", left);
                        }
                    }
                }
            }
        }
        if (nexttoken.id !== ')') {
            for (;;) {
                p[p.length] = expression(10);
                n += 1;
                if (nexttoken.id !== ',') {
                    break;
                }
                comma();
            }
        }
        advance(')');
        nospace(prevtoken, token);
        if (typeof left === 'object') {
            if (left.value === 'parseInt' && n === 1) {
                warning("Missing radix parameter.", left);
            }
            if (!option.evil) {
                if (left.value === 'eval' || left.value === 'Function' ||
                        left.value === 'execScript') {
                    warning("eval is evil.", left);
                } else if (p[0] && p[0].id === '(string)' &&
                       (left.value === 'setTimeout' ||
                        left.value === 'setInterval')) {
                    warning(
    "Implied eval is evil. Pass a function instead of a string.", left);
                }
            }
            if (!left.identifier && left.id !== '.' && left.id !== '[' &&
                    left.id !== '(' && left.id !== '&&' && left.id !== '||' &&
                    left.id !== '?') {
                warning("Bad invocation.", left);
            }
        }
        that.left = left;
        return that;
    }, 155, true).exps = true;

    prefix('(', function () {
        nospace();
        if (nexttoken.id === 'function') {
            nexttoken.immed = true;
        }
        var v = expression(0);
        advance(')', this);
        nospace(prevtoken, token);
        if (option.immed && v.id === 'function') {
            if (nexttoken.id === '(' ||
              (nexttoken.id === '.' && (peek().value === 'call' || peek().value === 'apply'))) {
                warning(
"Move the invocation into the parens that contain the function.", nexttoken);
            } else {
                warning(
"Do not wrap function literals in parens unless they are to be immediately invoked.",
                        this);
            }
        }
        return v;
    });

    infix('[', function (left, that) {
        nobreak(prevtoken, token);
        nospace();
        var e = expression(0), s;
        if (e && e.type === '(string)') {
            if (!option.evil && (e.value === 'eval' || e.value === 'execScript')) {
                warning("eval is evil.", that);
            }
            countMember(e.value);
            if (!option.sub && ix.test(e.value)) {
                s = syntax[e.value];
                if (!s || !s.reserved) {
                    warning("['{a}'] is better written in dot notation.",
                            e, e.value);
                }
            }
        }
        advance(']', that);
        nospace(prevtoken, token);
        that.left = left;
        that.right = e;
        return that;
    }, 160, true);

    prefix('[', function () {
        var b = token.line !== nexttoken.line;
        this.first = [];
        if (b) {
            indent += option.indent;
            if (nexttoken.from === indent + option.indent) {
                indent += option.indent;
            }
        }
        while (nexttoken.id !== '(end)') {
            while (nexttoken.id === ',') {
                warning("Extra comma.");
                advance(',');
            }
            if (nexttoken.id === ']') {
                break;
            }
            if (b && token.line !== nexttoken.line) {
                indentation();
            }
            this.first.push(expression(10));
            if (nexttoken.id === ',') {
                comma();
                if (nexttoken.id === ']' && !option.es5) {
                    warning("Extra comma.", token);
                    break;
                }
            } else {
                break;
            }
        }
        if (b) {
            indent -= option.indent;
            indentation();
        }
        advance(']', this);
        return this;
    }, 160);


    function property_name() {
        var id = optionalidentifier(true);
        if (!id) {
            if (nexttoken.id === '(string)') {
                id = nexttoken.value;
                advance();
            } else if (nexttoken.id === '(number)') {
                id = nexttoken.value.toString();
                advance();
            }
        }
        return id;
    }


    function functionparams() {
        var i, t = nexttoken, p = [];
        advance('(');
        nospace();
        if (nexttoken.id === ')') {
            advance(')');
            return;
        }
        for (;;) {
            i = identifier(true);
            p.push(i);
            addlabel(i, 'parameter');
            if (nexttoken.id === ',') {
                comma();
            } else {
                advance(')', t);
                nospace(prevtoken, token);
                return p;
            }
        }
    }


    function doFunction(i, statement) {
        var f,
            oldOption = option,
            oldScope  = scope;

        option = Object.create(option);
        scope = Object.create(scope);

        funct = {
            '(name)'     : i || '"' + anonname + '"',
            '(line)'     : nexttoken.line,
            '(character)': nexttoken.character,
            '(context)'  : funct,
            '(breakage)' : 0,
            '(loopage)'  : 0,
            '(scope)'    : scope,
            '(statement)': statement
        };
        f = funct;
        token.funct = funct;
        functions.push(funct);
        if (i) {
            addlabel(i, 'function');
        }
        funct['(params)'] = functionparams();

        block(false, false, true);
        scope = oldScope;
        option = oldOption;
        funct['(last)'] = token.line;
        funct['(lastcharacter)'] = token.character;
        funct = funct['(context)'];
        return f;
    }


    (function (x) {
        x.nud = function () {
            var b, f, i, j, p, t;
            var props = {}; // All properties, including accessors

            function saveProperty(name, token) {
                if (props[name] && is_own(props, name))
                    warning("Duplicate member '{a}'.", nexttoken, i);
                else
                    props[name] = {};

                props[name].basic = true;
                props[name].basicToken = token;
            }

            function saveSetter(name, token) {
                if (props[name] && is_own(props, name)) {
                    if (props[name].basic || props[name].setter)
                        warning("Duplicate member '{a}'.", nexttoken, i);
                } else {
                    props[name] = {};
                }

                props[name].setter = true;
                props[name].setterToken = token;
            }

            function saveGetter(name) {
                if (props[name] && is_own(props, name)) {
                    if (props[name].basic || props[name].getter)
                        warning("Duplicate member '{a}'.", nexttoken, i);
                } else {
                    props[name] = {};
                }

                props[name].getter = true;
                props[name].getterToken = token;
            }

            b = token.line !== nexttoken.line;
            if (b) {
                indent += option.indent;
                if (nexttoken.from === indent + option.indent) {
                    indent += option.indent;
                }
            }
            for (;;) {
                if (nexttoken.id === '}') {
                    break;
                }
                if (b) {
                    indentation();
                }
                if (nexttoken.value === 'get' && peek().id !== ':') {
                    advance('get');
                    if (!option.es5) {
                        error("get/set are ES5 features.");
                    }
                    i = property_name();
                    if (!i) {
                        error("Missing property name.");
                    }
                    saveGetter(i);
                    t = nexttoken;
                    adjacent(token, nexttoken);
                    f = doFunction();
                    p = f['(params)'];
                    if (p) {
                        warning("Unexpected parameter '{a}' in get {b} function.", t, p[0], i);
                    }
                    adjacent(token, nexttoken);
                } else if (nexttoken.value === 'set' && peek().id !== ':') {
                    advance('set');
                    if (!option.es5) {
                        error("get/set are ES5 features.");
                    }
                    i = property_name();
                    if (!i) {
                        error("Missing property name.");
                    }
                    saveSetter(i, nexttoken);
                    t = nexttoken;
                    adjacent(token, nexttoken);
                    f = doFunction();
                    p = f['(params)'];
                    if (!p || p.length !== 1) {
                        warning("Expected a single parameter in set {a} function.", t, i);
                    }
                } else {
                    i = property_name();
                    saveProperty(i, nexttoken);
                    if (typeof i !== 'string') {
                        break;
                    }
                    advance(':');
                    nonadjacent(token, nexttoken);
                    expression(10);
                }

                countMember(i);
                if (nexttoken.id === ',') {
                    comma();
                    if (nexttoken.id === ',') {
                        warning("Extra comma.", token);
                    } else if (nexttoken.id === '}' && !option.es5) {
                        warning("Extra comma.", token);
                    }
                } else {
                    break;
                }
            }
            if (b) {
                indent -= option.indent;
                indentation();
            }
            advance('}', this);

            // Check for lonely setters if in the ES5 mode.
            if (option.es5) {
                for (var name in props) {
                    if (is_own(props, name) && props[name].setter && !props[name].getter) {
                        warning("Setter is defined without getter.", props[name].setterToken);
                    }
                }
            }
            return this;
        };
        x.fud = function () {
            error("Expected to see a statement and instead saw a block.", token);
        };
    }(delim('{')));

// This Function is called when esnext option is set to true
// it adds the `const` statement to JSHINT

    useESNextSyntax = function () {
        var conststatement = stmt('const', function (prefix) {
            var id, name, value;

            this.first = [];
            for (;;) {
                nonadjacent(token, nexttoken);
                id = identifier();
                if (funct[id] === "const") {
                    warning("const '" + id + "' has already been declared");
                }
                if (funct['(global)'] && predefined[id] === false) {
                    warning("Redefinition of '{a}'.", token, id);
                }
                addlabel(id, 'const');
                if (prefix) {
                    break;
                }
                name = token;
                this.first.push(token);

                if (nexttoken.id !== "=") {
                    warning("const " +
                      "'{a}' is initialized to 'undefined'.", token, id);
                }

                if (nexttoken.id === '=') {
                    nonadjacent(token, nexttoken);
                    advance('=');
                    nonadjacent(token, nexttoken);
                    if (nexttoken.id === 'undefined') {
                        warning("It is not necessary to initialize " +
                          "'{a}' to 'undefined'.", token, id);
                    }
                    if (peek(0).id === '=' && nexttoken.identifier) {
                        error("Constant {a} was not declared correctly.",
                                nexttoken, nexttoken.value);
                    }
                    value = expression(0);
                    name.first = value;
                }

                if (nexttoken.id !== ',') {
                    break;
                }
                comma();
            }
            return this;
        });
        conststatement.exps = true;
    };

    var varstatement = stmt('var', function (prefix) {
        // JavaScript does not have block scope. It only has function scope. So,
        // declaring a variable in a block can have unexpected consequences.
        var id, name, value;

        if (funct['(onevar)'] && option.onevar) {
            warning("Too many var statements.");
        } else if (!funct['(global)']) {
            funct['(onevar)'] = true;
        }
        this.first = [];
        for (;;) {
            nonadjacent(token, nexttoken);
            id = identifier();
            if (option.esnext && funct[id] === "const") {
                warning("const '" + id + "' has already been declared");
            }
            if (funct['(global)'] && predefined[id] === false) {
                warning("Redefinition of '{a}'.", token, id);
            }
            addlabel(id, 'unused');
            if (prefix) {
                break;
            }
            name = token;
            this.first.push(token);
            if (nexttoken.id === '=') {
                nonadjacent(token, nexttoken);
                advance('=');
                nonadjacent(token, nexttoken);
                if (nexttoken.id === 'undefined') {
                    warning("It is not necessary to initialize '{a}' to 'undefined'.", token, id);
                }
                if (peek(0).id === '=' && nexttoken.identifier) {
                    error("Variable {a} was not declared correctly.",
                            nexttoken, nexttoken.value);
                }
                value = expression(0);
                name.first = value;
            }
            if (nexttoken.id !== ',') {
                break;
            }
            comma();
        }
        return this;
    });
    varstatement.exps = true;

    blockstmt('function', function () {
        if (inblock) {
            warning("Function declarations should not be placed in blocks. " +
                "Use a function expression or move the statement to the top of " +
                "the outer function.", token);

        }
        var i = identifier();
        if (option.esnext && funct[i] === "const") {
            warning("const '" + i + "' has already been declared");
        }
        adjacent(token, nexttoken);
        addlabel(i, 'unction');
        doFunction(i, true);
        if (nexttoken.id === '(' && nexttoken.line === token.line) {
            error(
"Function declarations are not invocable. Wrap the whole function invocation in parens.");
        }
        return this;
    });

    prefix('function', function () {
        var i = optionalidentifier();
        if (i) {
            adjacent(token, nexttoken);
        } else {
            nonadjacent(token, nexttoken);
        }
        doFunction(i);
        if (!option.loopfunc && funct['(loopage)']) {
            warning("Don't make functions within a loop.");
        }
        return this;
    });

    blockstmt('if', function () {
        var t = nexttoken;
        advance('(');
        nonadjacent(this, t);
        nospace();
        expression(20);
        if (nexttoken.id === '=') {
            if (!option.boss)
                warning("Expected a conditional expression and instead saw an assignment.");
            advance('=');
            expression(20);
        }
        advance(')', t);
        nospace(prevtoken, token);
        block(true, true);
        if (nexttoken.id === 'else') {
            nonadjacent(token, nexttoken);
            advance('else');
            if (nexttoken.id === 'if' || nexttoken.id === 'switch') {
                statement(true);
            } else {
                block(true, true);
            }
        }
        return this;
    });

    blockstmt('try', function () {
        var b, e, s;

        block(false);
        if (nexttoken.id === 'catch') {
            advance('catch');
            nonadjacent(token, nexttoken);
            advance('(');
            s = scope;
            scope = Object.create(s);
            e = nexttoken.value;
            if (nexttoken.type !== '(identifier)') {
                warning("Expected an identifier and instead saw '{a}'.",
                    nexttoken, e);
            } else {
                addlabel(e, 'exception');
            }
            advance();
            advance(')');
            block(false);
            b = true;
            scope = s;
        }
        if (nexttoken.id === 'finally') {
            advance('finally');
            block(false);
            return;
        } else if (!b) {
            error("Expected '{a}' and instead saw '{b}'.",
                    nexttoken, 'catch', nexttoken.value);
        }
        return this;
    });

    blockstmt('while', function () {
        var t = nexttoken;
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        advance('(');
        nonadjacent(this, t);
        nospace();
        expression(20);
        if (nexttoken.id === '=') {
            if (!option.boss)
                warning("Expected a conditional expression and instead saw an assignment.");
            advance('=');
            expression(20);
        }
        advance(')', t);
        nospace(prevtoken, token);
        block(true, true);
        funct['(breakage)'] -= 1;
        funct['(loopage)'] -= 1;
        return this;
    }).labelled = true;

    blockstmt('with', function () {
        var t = nexttoken;
        if (directive['use strict']) {
            error("'with' is not allowed in strict mode.", token);
        } else if (!option.withstmt) {
            warning("Don't use 'with'.", token);
        }

        advance('(');
        nonadjacent(this, t);
        nospace();
        expression(0);
        advance(')', t);
        nospace(prevtoken, token);
        block(true, true);

        return this;
    });

    blockstmt('switch', function () {
        var t = nexttoken,
            g = false;
        funct['(breakage)'] += 1;
        advance('(');
        nonadjacent(this, t);
        nospace();
        this.condition = expression(20);
        advance(')', t);
        nospace(prevtoken, token);
        nonadjacent(token, nexttoken);
        t = nexttoken;
        advance('{');
        nonadjacent(token, nexttoken);
        indent += option.indent;
        this.cases = [];
        for (;;) {
            switch (nexttoken.id) {
            case 'case':
                switch (funct['(verb)']) {
                case 'break':
                case 'case':
                case 'continue':
                case 'return':
                case 'switch':
                case 'throw':
                    break;
                default:
                    // You can tell JSHint that you don't use break intentionally by
                    // adding a comment /* falls through */ on a line just before
                    // the next `case`.
                    if (!ft.test(lines[nexttoken.line - 2])) {
                        warning(
                            "Expected a 'break' statement before 'case'.",
                            token);
                    }
                }
                indentation(-option.indent);
                advance('case');
                this.cases.push(expression(20));
                g = true;
                advance(':');
                funct['(verb)'] = 'case';
                break;
            case 'default':
                switch (funct['(verb)']) {
                case 'break':
                case 'continue':
                case 'return':
                case 'throw':
                    break;
                default:
                    if (!ft.test(lines[nexttoken.line - 2])) {
                        warning(
                            "Expected a 'break' statement before 'default'.",
                            token);
                    }
                }
                indentation(-option.indent);
                advance('default');
                g = true;
                advance(':');
                break;
            case '}':
                indent -= option.indent;
                indentation();
                advance('}', t);
                if (this.cases.length === 1 || this.condition.id === 'true' ||
                        this.condition.id === 'false') {
                    if (!option.onecase)
                        warning("This 'switch' should be an 'if'.", this);
                }
                funct['(breakage)'] -= 1;
                funct['(verb)'] = undefined;
                return;
            case '(end)':
                error("Missing '{a}'.", nexttoken, '}');
                return;
            default:
                if (g) {
                    switch (token.id) {
                    case ',':
                        error("Each value should have its own case label.");
                        return;
                    case ':':
                        g = false;
                        statements();
                        break;
                    default:
                        error("Missing ':' on a case clause.", token);
                        return;
                    }
                } else {
                    if (token.id === ':') {
                        advance(':');
                        error("Unexpected '{a}'.", token, ':');
                        statements();
                    } else {
                        error("Expected '{a}' and instead saw '{b}'.",
                            nexttoken, 'case', nexttoken.value);
                        return;
                    }
                }
            }
        }
    }).labelled = true;

    stmt('debugger', function () {
        if (!option.debug) {
            warning("All 'debugger' statements should be removed.");
        }
        return this;
    }).exps = true;

    (function () {
        var x = stmt('do', function () {
            funct['(breakage)'] += 1;
            funct['(loopage)'] += 1;
            this.first = block(true);
            advance('while');
            var t = nexttoken;
            nonadjacent(token, t);
            advance('(');
            nospace();
            expression(20);
            if (nexttoken.id === '=') {
                if (!option.boss)
                    warning("Expected a conditional expression and instead saw an assignment.");
                advance('=');
                expression(20);
            }
            advance(')', t);
            nospace(prevtoken, token);
            funct['(breakage)'] -= 1;
            funct['(loopage)'] -= 1;
            return this;
        });
        x.labelled = true;
        x.exps = true;
    }());

    blockstmt('for', function () {
        var s, t = nexttoken;
        funct['(breakage)'] += 1;
        funct['(loopage)'] += 1;
        advance('(');
        nonadjacent(this, t);
        nospace();
        if (peek(nexttoken.id === 'var' ? 1 : 0).id === 'in') {
            if (nexttoken.id === 'var') {
                advance('var');
                varstatement.fud.call(varstatement, true);
            } else {
                switch (funct[nexttoken.value]) {
                case 'unused':
                    funct[nexttoken.value] = 'var';
                    break;
                case 'var':
                    break;
                default:
                    warning("Bad for in variable '{a}'.",
                            nexttoken, nexttoken.value);
                }
                advance();
            }
            advance('in');
            expression(20);
            advance(')', t);
            s = block(true, true);
            if (option.forin && s && (s.length > 1 || typeof s[0] !== 'object' ||
                    s[0].value !== 'if')) {
                warning("The body of a for in should be wrapped in an if statement to filter " +
                        "unwanted properties from the prototype.", this);
            }
            funct['(breakage)'] -= 1;
            funct['(loopage)'] -= 1;
            return this;
        } else {
            if (nexttoken.id !== ';') {
                if (nexttoken.id === 'var') {
                    advance('var');
                    varstatement.fud.call(varstatement);
                } else {
                    for (;;) {
                        expression(0, 'for');
                        if (nexttoken.id !== ',') {
                            break;
                        }
                        comma();
                    }
                }
            }
            nolinebreak(token);
            advance(';');
            if (nexttoken.id !== ';') {
                expression(20);
                if (nexttoken.id === '=') {
                    if (!option.boss)
                        warning("Expected a conditional expression and instead saw an assignment.");
                    advance('=');
                    expression(20);
                }
            }
            nolinebreak(token);
            advance(';');
            if (nexttoken.id === ';') {
                error("Expected '{a}' and instead saw '{b}'.",
                        nexttoken, ')', ';');
            }
            if (nexttoken.id !== ')') {
                for (;;) {
                    expression(0, 'for');
                    if (nexttoken.id !== ',') {
                        break;
                    }
                    comma();
                }
            }
            advance(')', t);
            nospace(prevtoken, token);
            block(true, true);
            funct['(breakage)'] -= 1;
            funct['(loopage)'] -= 1;
            return this;
        }
    }).labelled = true;


    stmt('break', function () {
        var v = nexttoken.value;

        if (funct['(breakage)'] === 0)
            warning("Unexpected '{a}'.", nexttoken, this.value);

        if (!option.asi)
            nolinebreak(this);

        if (nexttoken.id !== ';') {
            if (token.line === nexttoken.line) {
                if (funct[v] !== 'label') {
                    warning("'{a}' is not a statement label.", nexttoken, v);
                } else if (scope[v] !== funct) {
                    warning("'{a}' is out of scope.", nexttoken, v);
                }
                this.first = nexttoken;
                advance();
            }
        }
        reachable('break');
        return this;
    }).exps = true;


    stmt('continue', function () {
        var v = nexttoken.value;

        if (funct['(breakage)'] === 0)
            warning("Unexpected '{a}'.", nexttoken, this.value);

        if (!option.asi)
            nolinebreak(this);

        if (nexttoken.id !== ';') {
            if (token.line === nexttoken.line) {
                if (funct[v] !== 'label') {
                    warning("'{a}' is not a statement label.", nexttoken, v);
                } else if (scope[v] !== funct) {
                    warning("'{a}' is out of scope.", nexttoken, v);
                }
                this.first = nexttoken;
                advance();
            }
        } else if (!funct['(loopage)']) {
            warning("Unexpected '{a}'.", nexttoken, this.value);
        }
        reachable('continue');
        return this;
    }).exps = true;


    stmt('return', function () {
        if (this.line === nexttoken.line) {
            if (nexttoken.id === '(regexp)')
                warning("Wrap the /regexp/ literal in parens to disambiguate the slash operator.");

            if (nexttoken.id !== ';' && !nexttoken.reach) {
                nonadjacent(token, nexttoken);
                if (peek().value === "=" && !option.boss) {
                    warningAt("Did you mean to return a conditional instead of an assignment?",
                              token.line, token.character + 1);
                }
                this.first = expression(0);
            }
        } else if (!option.asi) {
            nolinebreak(this); // always warn (Line breaking error)
        }
        reachable('return');
        return this;
    }).exps = true;


    stmt('throw', function () {
        nolinebreak(this);
        nonadjacent(token, nexttoken);
        this.first = expression(20);
        reachable('throw');
        return this;
    }).exps = true;

//  Superfluous reserved words

    reserve('class');
    reserve('const');
    reserve('enum');
    reserve('export');
    reserve('extends');
    reserve('import');
    reserve('super');

    reserve('let');
    reserve('yield');
    reserve('implements');
    reserve('interface');
    reserve('package');
    reserve('private');
    reserve('protected');
    reserve('public');
    reserve('static');


// Parse JSON

    function jsonValue() {

        function jsonObject() {
            var o = {}, t = nexttoken;
            advance('{');
            if (nexttoken.id !== '}') {
                for (;;) {
                    if (nexttoken.id === '(end)') {
                        error("Missing '}' to match '{' from line {a}.",
                                nexttoken, t.line);
                    } else if (nexttoken.id === '}') {
                        warning("Unexpected comma.", token);
                        break;
                    } else if (nexttoken.id === ',') {
                        error("Unexpected comma.", nexttoken);
                    } else if (nexttoken.id !== '(string)') {
                        warning("Expected a string and instead saw {a}.",
                                nexttoken, nexttoken.value);
                    }
                    if (o[nexttoken.value] === true) {
                        warning("Duplicate key '{a}'.",
                                nexttoken, nexttoken.value);
                    } else if ((nexttoken.value === '__proto__' &&
                        !option.proto) || (nexttoken.value === '__iterator__' &&
                        !option.iterator)) {
                        warning("The '{a}' key may produce unexpected results.",
                            nexttoken, nexttoken.value);
                    } else {
                        o[nexttoken.value] = true;
                    }
                    advance();
                    advance(':');
                    jsonValue();
                    if (nexttoken.id !== ',') {
                        break;
                    }
                    advance(',');
                }
            }
            advance('}');
        }

        function jsonArray() {
            var t = nexttoken;
            advance('[');
            if (nexttoken.id !== ']') {
                for (;;) {
                    if (nexttoken.id === '(end)') {
                        error("Missing ']' to match '[' from line {a}.",
                                nexttoken, t.line);
                    } else if (nexttoken.id === ']') {
                        warning("Unexpected comma.", token);
                        break;
                    } else if (nexttoken.id === ',') {
                        error("Unexpected comma.", nexttoken);
                    }
                    jsonValue();
                    if (nexttoken.id !== ',') {
                        break;
                    }
                    advance(',');
                }
            }
            advance(']');
        }

        switch (nexttoken.id) {
        case '{':
            jsonObject();
            break;
        case '[':
            jsonArray();
            break;
        case 'true':
        case 'false':
        case 'null':
        case '(number)':
        case '(string)':
            advance();
            break;
        case '-':
            advance('-');
            if (token.character !== nexttoken.from) {
                warning("Unexpected space after '-'.", token);
            }
            adjacent(token, nexttoken);
            advance('(number)');
            break;
        default:
            error("Expected a JSON value.", nexttoken);
        }
    }


// The actual JSHINT function itself.

    var itself = function (s, o, g) {
        var a, i, k, x,
            optionKeys,
            newOptionObj = {};

        JSHINT.errors = [];
        JSHINT.undefs = [];
        predefined = Object.create(standard);
        combine(predefined, g || {});
        if (o) {
            a = o.predef;
            if (a) {
                if (Array.isArray(a)) {
                    for (i = 0; i < a.length; i += 1) {
                        predefined[a[i]] = true;
                    }
                } else if (typeof a === 'object') {
                    k = Object.keys(a);
                    for (i = 0; i < k.length; i += 1) {
                        predefined[k[i]] = !!a[k[i]];
                    }
                }
            }
            optionKeys = Object.keys(o);
            for (x = 0; x < optionKeys.length; x++) {
                newOptionObj[optionKeys[x]] = o[optionKeys[x]];
            }
        }

        option = newOptionObj;

        option.indent = option.indent || 4;
        option.maxerr = option.maxerr || 50;

        tab = '';
        for (i = 0; i < option.indent; i += 1) {
            tab += ' ';
        }
        indent = 1;
        global = Object.create(predefined);
        scope = global;
        funct = {
            '(global)': true,
            '(name)': '(global)',
            '(scope)': scope,
            '(breakage)': 0,
            '(loopage)': 0
        };
        functions = [funct];
        urls = [];
        stack = null;
        member = {};
        membersOnly = null;
        implied = {};
        inblock = false;
        lookahead = [];
        jsonmode = false;
        warnings = 0;
        lex.init(s);
        prereg = true;
        directive = {};

        prevtoken = token = nexttoken = syntax['(begin)'];

        // Check options
        for (var name in o) {
            if (is_own(o, name)) {
                checkOption(name, token);
            }
        }

        assume();

        // combine the passed globals after we've assumed all our options
        combine(predefined, g || {});

        //reset values
        comma.first = true;
        quotmark = undefined;

        try {
            advance();
            switch (nexttoken.id) {
            case '{':
            case '[':
                option.laxbreak = true;
                jsonmode = true;
                jsonValue();
                break;
            default:
                directives();
                if (directive["use strict"] && !option.globalstrict) {
                    warning("Use the function form of \"use strict\".", prevtoken);
                }

                statements();
            }
            advance((nexttoken && nexttoken.value !== '.')  ? '(end)' : undefined);

            var markDefined = function (name, context) {
                do {
                    if (typeof context[name] === 'string') {
                        // JSHINT marks unused variables as 'unused' and
                        // unused function declaration as 'unction'. This
                        // code changes such instances back 'var' and
                        // 'closure' so that the code in JSHINT.data()
                        // doesn't think they're unused.

                        if (context[name] === 'unused')
                            context[name] = 'var';
                        else if (context[name] === 'unction')
                            context[name] = 'closure';

                        return true;
                    }

                    context = context['(context)'];
                } while (context);

                return false;
            };

            var clearImplied = function (name, line) {
                if (!implied[name])
                    return;

                var newImplied = [];
                for (var i = 0; i < implied[name].length; i += 1) {
                    if (implied[name][i] !== line)
                        newImplied.push(implied[name][i]);
                }

                if (newImplied.length === 0)
                    delete implied[name];
                else
                    implied[name] = newImplied;
            };

            // Check queued 'x is not defined' instances to see if they're still undefined.
            for (i = 0; i < JSHINT.undefs.length; i += 1) {
                k = JSHINT.undefs[i].slice(0);

                if (markDefined(k[2].value, k[0])) {
                    clearImplied(k[2].value, k[2].line);
                } else {
                    warning.apply(warning, k.slice(1));
                }
            }
        } catch (e) {
            if (e) {
                var nt = nexttoken || {};
                JSHINT.errors.push({
                    raw       : e.raw,
                    reason    : e.message,
                    line      : e.line || nt.line,
                    character : e.character || nt.from
                }, null);
            }
        }

        return JSHINT.errors.length === 0;
    };

    // Data summary.
    itself.data = function () {

        var data = { functions: [], options: option }, fu, globals, implieds = [], f, i, j,
            members = [], n, unused = [], v;
        if (itself.errors.length) {
            data.errors = itself.errors;
        }

        if (jsonmode) {
            data.json = true;
        }

        for (n in implied) {
            if (is_own(implied, n)) {
                implieds.push({
                    name: n,
                    line: implied[n]
                });
            }
        }
        if (implieds.length > 0) {
            data.implieds = implieds;
        }

        if (urls.length > 0) {
            data.urls = urls;
        }

        globals = Object.keys(scope);
        if (globals.length > 0) {
            data.globals = globals;
        }
        for (i = 1; i < functions.length; i += 1) {
            f = functions[i];
            fu = {};
            for (j = 0; j < functionicity.length; j += 1) {
                fu[functionicity[j]] = [];
            }
            for (n in f) {
                if (is_own(f, n) && n.charAt(0) !== '(') {
                    v = f[n];
                    if (v === 'unction') {
                        v = 'unused';
                    }
                    if (Array.isArray(fu[v])) {
                        fu[v].push(n);
                        if (v === 'unused') {
                            unused.push({
                                name: n,
                                line: f['(line)'],
                                'function': f['(name)']
                            });
                        }
                    }
                }
            }
            for (j = 0; j < functionicity.length; j += 1) {
                if (fu[functionicity[j]].length === 0) {
                    delete fu[functionicity[j]];
                }
            }
            fu.name = f['(name)'];
            fu.param = f['(params)'];
            fu.line = f['(line)'];
            fu.character = f['(character)'];
            fu.last = f['(last)'];
            fu.lastcharacter = f['(lastcharacter)'];
            data.functions.push(fu);
        }

        if (unused.length > 0) {
            data.unused = unused;
        }

        members = [];
        for (n in member) {
            if (typeof member[n] === 'number') {
                data.member = member;
                break;
            }
        }

        return data;
    };

    itself.report = function (option) {
        var data = itself.data();

        var a = [], c, e, err, f, i, k, l, m = '', n, o = [], s;

        function detail(h, array) {
            var b, i, singularity;
            if (array) {
                o.push('<div><i>' + h + '</i> ');
                array = array.sort();
                for (i = 0; i < array.length; i += 1) {
                    if (array[i] !== singularity) {
                        singularity = array[i];
                        o.push((b ? ', ' : '') + singularity);
                        b = true;
                    }
                }
                o.push('</div>');
            }
        }


        if (data.errors || data.implieds || data.unused) {
            err = true;
            o.push('<div id=errors><i>Error:</i>');
            if (data.errors) {
                for (i = 0; i < data.errors.length; i += 1) {
                    c = data.errors[i];
                    if (c) {
                        e = c.evidence || '';
                        o.push('<p>Problem' + (isFinite(c.line) ? ' at line ' +
                                c.line + ' character ' + c.character : '') +
                                ': ' + c.reason.entityify() +
                                '</p><p class=evidence>' +
                                (e && (e.length > 80 ? e.slice(0, 77) + '...' :
                                e).entityify()) + '</p>');
                    }
                }
            }

            if (data.implieds) {
                s = [];
                for (i = 0; i < data.implieds.length; i += 1) {
                    s[i] = '<code>' + data.implieds[i].name + '</code>&nbsp;<i>' +
                        data.implieds[i].line + '</i>';
                }
                o.push('<p><i>Implied global:</i> ' + s.join(', ') + '</p>');
            }

            if (data.unused) {
                s = [];
                for (i = 0; i < data.unused.length; i += 1) {
                    s[i] = '<code><u>' + data.unused[i].name + '</u></code>&nbsp;<i>' +
                        data.unused[i].line + '</i> <code>' +
                        data.unused[i]['function'] + '</code>';
                }
                o.push('<p><i>Unused variable:</i> ' + s.join(', ') + '</p>');
            }
            if (data.json) {
                o.push('<p>JSON: bad.</p>');
            }
            o.push('</div>');
        }

        if (!option) {

            o.push('<br><div id=functions>');

            if (data.urls) {
                detail("URLs<br>", data.urls, '<br>');
            }

            if (data.json && !err) {
                o.push('<p>JSON: good.</p>');
            } else if (data.globals) {
                o.push('<div><i>Global</i> ' +
                        data.globals.sort().join(', ') + '</div>');
            } else {
                o.push('<div><i>No new global variables introduced.</i></div>');
            }

            for (i = 0; i < data.functions.length; i += 1) {
                f = data.functions[i];

                o.push('<br><div class=function><i>' + f.line + '-' +
                        f.last + '</i> ' + (f.name || '') + '(' +
                        (f.param ? f.param.join(', ') : '') + ')</div>');
                detail('<big><b>Unused</b></big>', f.unused);
                detail('Closure', f.closure);
                detail('Variable', f['var']);
                detail('Exception', f.exception);
                detail('Outer', f.outer);
                detail('Global', f.global);
                detail('Label', f.label);
            }

            if (data.member) {
                a = Object.keys(data.member);
                if (a.length) {
                    a = a.sort();
                    m = '<br><pre id=members>/*members ';
                    l = 10;
                    for (i = 0; i < a.length; i += 1) {
                        k = a[i];
                        n = k.name();
                        if (l + n.length > 72) {
                            o.push(m + '<br>');
                            m = '    ';
                            l = 1;
                        }
                        l += n.length + 2;
                        if (data.member[k] === 1) {
                            n = '<i>' + n + '</i>';
                        }
                        if (i < a.length - 1) {
                            n += ', ';
                        }
                        m += n;
                    }
                    o.push(m + '<br>*/</pre>');
                }
                o.push('</div>');
            }
        }
        return o.join('');
    };

    itself.jshint = itself;

    return itself;
}());

// Make JSHINT a Node module, if possible.
if (typeof exports === 'object' && exports)
    exports.JSHINT = JSHINT;

})()
},{}],3:[function(require,module,exports){
module.exports={
	"name" : "fondue",
	"description" : "rewrites JavaScript code to collect partial execution traces",
	"license" : "MIT",
	"author" : "Tom Lieber <tom@alltom.com>",
	"version" : "0.4.0",
	"main" : "./lib/fondue",
	"repository" : {
		"type" : "git",
		"url" : "https://github.com/adobe-research/fondue.git"
	},
	"dependencies" : {
		"falafel" : "0.1.4"
	},
	"devDependencies" : {
		"tap" : "0.4.x"
	},
	"keywords" : [
		"source",
		"trace",
		"instrumentation"
	],
	"scripts" : {
		"test" : "tap test/*.js",
		"build-browser" : "node lib/build-browser.js"
	}
}

},{}],"fondue":[function(require,module,exports){
module.exports=require('WG6PGP');
},{}],"WG6PGP":[function(require,module,exports){
(function(__dirname){/*
 * Copyright (c) 2012 Massachusetts Institute of Technology, Adobe Systems
 * Incorporated, and other contributors. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

var falafel = require('falafel');
var fs = require('fs');
var JSHINT = require('./jshint').JSHINT;


// adds keys from options to defaultOptions, overwriting on conflicts & returning defaultOptions
function mergeInto(options, defaultOptions) {
	for (var key in options) {
		if (options[key] !== undefined) {
			defaultOptions[key] = options[key];
		}
	}
	return defaultOptions;
}

function template(s, vars) {
	for (var p in vars) {
		s = s.replace(new RegExp('{' + p + '}', 'g'), vars[p]);
	}
	return s;
}

/**
 * options:
 *   name (tracer): name for the global tracer object
 *   nodejs (false): true to enable Node.js-specific functionality
 *   maxInvocationsPerTick (4096): stop collecting trace information for a tick
 *       with more than this many invocations
 **/
function instrumentationPrefix(options) {
	options = mergeInto(options, {
		name: 'tracer',
		nodejs: false,
		maxInvocationsPerTick: 4096,
	});

	// the inline comments below are markers for building the browser version of fondue
	return template("/*\nThe following code was inserted automatically by fondue to collect information\nabout the execution of all the JavaScript on this page or in this program.\n\nhttps://github.com/adobe-research/fondue\n*/\n\n/*\n * Copyright (c) 2012 Massachusetts Institute of Technology, Adobe Systems\n * Incorporated, and other contributors. All rights reserved.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a\n * copy of this software and associated documentation files (the \"Software\"),\n * to deal in the Software without restriction, including without limitation\n * the rights to use, copy, modify, merge, publish, distribute, sublicense,\n * and/or sell copies of the Software, and to permit persons to whom the\n * Software is furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\n * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER\n * DEALINGS IN THE SOFTWARE.\n *\n */\n\n// the contents of this file are to be inserted above instrumented code\n// to collect trace information\n\nif (typeof {name} === 'undefined') {\n{name} = new (function () {\n\tvar TRACER_ID = String(Math.random());\n\n\tvar globalThis = undefined;\n\n\tvar nodes = []; // objects describing functions, branches, call sites, etc\n\tvar nodeById = {}; // id(string) -> node\n\tvar invocationStack = [];\n\tvar invocationById = {}; // id(string) -> invocation\n\tvar extraInvocationInfoById = {}; // id(string) -> extra invocation info (stuff we don't want to send over the wire by default)\n\tvar invocationsByNodeId = {}; // id(string) -> array of invocations\n\tvar exceptionsByNodeId = {}; // nodeId -> array of { exception: ..., invocationId: ... }\n\tvar topLevelInvocations = [];\n\tvar nodeHitCounts = {}; // { query-handle: { nodeId: hit-count } }\n\tvar exceptionCounts = {}; // { query-handle: { nodeId: exception-count } }\n\tvar logEntries = {}; // { query-handle: [invocation id] }\n\tvar anonFuncParentInvocation, lastException; // yucky globals track state between trace* calls\n\tvar nextInvocationId = 0;\n\tvar _hitQueries = [];\n\tvar _exceptionQueries = [];\n\tvar _logQueries = [];\n\n\tvar _connected = false;\n\n\t// epochs\n\tvar _lastEpochID = 0;\n\tvar _lastEmitterID = 0;\n\tvar _epochsById = []; // int -> epoch (only epochs that end up as part of the call graph are saved)\n\tvar _epochsByName = {}; // string -> [epoch] (only epochs that end up as part of the call graph are saved)\n\tvar _topLevelEpochsByName = {}; // string -> [epoch]\n\tvar _epochStack = [];\n\tvar _epochInvocationDepth = []; // stack of how deep into the invocation stack of each epoch we are\n\tvar _topLevelInvocationsByEventName = {};\n\n\t// bail\n\tvar _bailedTick = false;\n\tvar _invocationsThisTick = 0;\n\tvar _invocationStackSize = 0;\n\tvar _explainedBails = false;\n\n\t/*\n\tFetching data from fondue happens by requesting a handle for the data you\n\twant, then calling another function to get the latest data from that handle.\n\tTypically, the first call to that function returns all the historical data\n\tand subsequent calls return the changes since the last call.\n\n\tThe bookkeeping was the same in all the cases. Now this 'base class' handles\n\tit. Just make a new instance and override backfill() and updateSingle().\n\t*/\n\tfunction Tracker(handlePrefix) {\n\t\tthis.lastHandleID = 0;\n\t\tthis.handlePrefix = handlePrefix;\n\t\tthis.queries = {}; // handle -> query\n\t\tthis.data = {}; // handle -> data\n\t}\n\tTracker.prototype = {\n\t\ttrack: function (query) {\n\t\t\tvar handleID = ++this.lastHandleID;\n\t\t\tvar handle = this.handlePrefix + '-' + handleID;\n\t\t\tthis.queries[handle] = query;\n\t\t\tthis.data[handle] = this.backfill(query);\n\t\t\treturn handle;\n\t\t},\n\t\tuntrack: function (handle) {\n\t\t\tthis._checkHandle(handle);\n\n\t\t\tdelete this.queries[handle];\n\t\t\tdelete this.data[handle];\n\t\t},\n\t\t/** return the data to be returned from the first call to delta() */\n\t\tbackfill: function (query) {\n\t\t\t// override this\n\t\t\treturn {};\n\t\t},\n\t\tupdate: function () {\n\t\t\tfor (var handle in this.data) {\n\t\t\t\tvar data = this.data[handle];\n\t\t\t\tvar args = [data].concat(Array.prototype.slice.apply(arguments));\n\t\t\t\tthis.data[handle] = this.updateSingle.apply(this, args);\n\t\t\t}\n\t\t},\n\t\t/**\n\t\tdata: the previous data for this query\n\t\targuments passed to update() will be passed after the data argument.\n\t\t*/\n\t\tupdateSingle: function (data, extraData1, extraData2) {\n\t\t\t// override this\n\t\t\tdata['foo'] = 'bar';\n\t\t\treturn data;\n\t\t},\n\t\tdelta: function (handle) {\n\t\t\tthis._checkHandle(handle);\n\n\t\t\tvar result = this.data[handle];\n\t\t\tthis.data[handle] = this.emptyData(handle);\n\t\t\treturn result;\n\t\t},\n\t\t/** after a call to delta(), the data for a handle is reset to this */\n\t\temptyData: function (handle) {\n\t\t\treturn {};\n\t\t},\n\t\t_checkHandle: function (handle) {\n\t\t\tif (!(handle in this.queries)) {\n\t\t\t\tthrow new Error(\"unrecognized query\");\n\t\t\t}\n\t\t}\n\t}\n\n\tvar nodeTracker = new Tracker('node');\n\tnodeTracker.emptyData = function () {\n\t\treturn [];\n\t};\n\tnodeTracker.backfill = function () {\n\t\treturn nodes.slice();\n\t};\n\tnodeTracker.updateSingle = function (data, newNodes) {\n\t\tdata.push.apply(data, newNodes);\n\t\treturn data;\n\t};\n\n\tvar epochTracker = new Tracker('epoch');\n\tepochTracker.backfill = function () {\n\t\tvar data = {};\n\t\tfor (var epochName in _topLevelEpochsByName) {\n\t\t\tdata[epochName] = { hits: _topLevelEpochsByName[epochName].length };\n\t\t}\n\t\treturn data;\n\t};\n\tepochTracker.updateSingle = function (data, epoch) {\n\t\tif (!(epoch.eventName in data)) {\n\t\t\tdata[epoch.eventName] = { hits: 0 };\n\t\t}\n\t\tdata[epoch.eventName].hits++;\n\t\treturn data;\n\t};\n\n\tfunction _addSpecialNodes() {\n\t\tvar node = {\n\t\t\tpath: \"[built-in]\",\n\t\t\tstart: { line: 0, column: 0 },\n\t\t\tend: { line: 0, column: 0 },\n\t\t\tid: \"log\",\n\t\t\ttype: \"function\",\n\t\t\tchildrenIds: [],\n\t\t\tparentId: undefined,\n\t\t\tname: \"[log]\",\n\t\t\tparams: []\n\t\t};\n\t\tnodes.push(node);\n\t\tnodeById[node.id] = node;\n\t}\n\t_addSpecialNodes();\n\n\n\t// helpers\n\n\t// adds keys from options to defaultOptions, overwriting on conflicts & returning defaultOptions\n\tfunction mergeInto(options, defaultOptions) {\n\t\tfor (var key in options) {\n\t\t\tdefaultOptions[key] = options[key];\n\t\t}\n\t\treturn defaultOptions;\n\t}\n\n\t/**\n\t * calls callback with (item, index, collect) where collect is a function\n\t * whose argument should be one of the strings to be de-duped.\n\t * returns an array where each string appears only once.\n\t */\n\tfunction dedup(collection, callback) {\n\t\tvar o = {};\n\t\tvar collect = function (str) {\n\t\t\to[str] = true;\n\t\t};\n\t\tfor (var i in collection) {\n\t\t\tcallback(collect, collection[i], i);\n\t\t}\n\t\tvar arr = [];\n\t\tfor (var str in o) {\n\t\t\tarr.push(str);\n\t\t}\n\t\treturn arr;\n\t};\n\n\tfunction count(collection, callback) {\n\t\tvar o = {};\n\t\tvar collect = function (str) {\n\t\t\tif (str in o) {\n\t\t\t\to[str]++;\n\t\t\t} else {\n\t\t\t\to[str] = 1;\n\t\t\t}\n\t\t};\n\t\tfor (var i in collection) {\n\t\t\tcallback(collect, collection[i], i);\n\t\t}\n\t\treturn o;\n\t};\n\n\tfunction flattenmap(collection, callback) {\n\t\tvar arr = [];\n\t\tvar collect = function (o) {\n\t\t\tarr.push(o);\n\t\t};\n\t\tfor (var i in collection) {\n\t\t\tcallback(collect, collection[i], i, collection);\n\t\t}\n\t\treturn arr;\n\t};\n\n\t/**\n\t * behaves like de-dup, but collect takes a second, 'value' argument.\n\t * returns an object whose keys are the first arguments to collect,\n\t * and values are arrays of all the values passed with that key\n\t */\n\tfunction cluster(collection, callback) {\n\t\tvar o = {};\n\t\tvar collect = function (key, value) {\n\t\t\tif (key in o) {\n\t\t\t\to[key].push(value);\n\t\t\t} else {\n\t\t\t\to[key] = [value];\n\t\t\t}\n\t\t};\n\t\tfor (var i in collection) {\n\t\t\tcallback(collect, collection[i], i);\n\t\t}\n\t\treturn o;\n\t};\n\n\t/**\n\t * returns a version of an object that's safe to JSON,\n\t * and is very conservative\n\t *\n\t *   undefined -> { type: 'undefined', value: undefined }\n\t *   null -> { type: 'undefined', value: null }\n\t *   true -> { type: 'boolean', value: true }\n\t *   4 -> { type: 'number', value: 4 }\n\t *   \"foo\" -> { type: 'string', value: \"foo\" }\n\t *   (function () { }) -> { type: 'object' }\n\t *   { a: \"b\" } -> { type: 'object' }\n\t */\n\tfunction marshalForTransmission(val, maxDepth) {\n\t\tif (maxDepth === undefined) {\n\t\t\tmaxDepth = 1;\n\t\t}\n\n\t\tvar o = { type: typeof(val) };\n\t\tif ([\"undefined\", \"boolean\", \"number\", \"string\"].indexOf(o.type) !== -1 || val === null) {\n\t\t\tif (typeof(val) === \"undefined\" && val !== undefined) {\n\t\t\t\t// special case: document.all claims to be undefined http://stackoverflow.com/questions/10350142/why-is-document-all-falsy\n\t\t\t\to.type = \"object\";\n\t\t\t\to.preview = \"\" + val;\n\t\t\t} else if (val === null) {\n\t\t\t\to.type = \"null\";\n\t\t\t\to.preview = \"null\";\n\t\t\t} else {\n\t\t\t\to.value = val;\n\t\t\t}\n\t\t} else if (o.type === \"object\") {\n\t\t\tvar newDepth = maxDepth - 1;\n\n\t\t\tif (val instanceof Array) {\n\t\t\t\tvar len = val.length;\n\t\t\t\tif (val.__theseusTruncated && val.__theseusTruncated.length) {\n\t\t\t\t\tlen += val.__theseusTruncated.length;\n\t\t\t\t}\n\t\t\t\to.preview = \"[Array:\" + len + \"]\";\n\t\t\t\tnewDepth = maxDepth - 0.5; // count for half\n\t\t\t} else if (typeof(Buffer) === \"function\" && (val instanceof Buffer)) {\n\t\t\t\tvar len = val.length;\n\t\t\t\tif (val.__theseusTruncated && val.__theseusTruncated.length) {\n\t\t\t\t\tlen += val.__theseusTruncated.length;\n\t\t\t\t}\n\t\t\t\to.preview = \"[Buffer:\" + len + \"]\";\n\t\t\t} else {\n\t\t\t\ttry { o.preview = String(val) } catch (e) { o.preview = \"[Object]\" }\n\t\t\t}\n\n\t\t\tif (maxDepth > 0) {\n\t\t\t\to.ownProperties = {};\n\t\t\t\tfor (var key in val) {\n\t\t\t\t\tif (val.hasOwnProperty(key) && !/^__theseus/.test(key)) {\n\t\t\t\t\t\to.ownProperties[key] = marshalForTransmission(val[key], newDepth);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (\"__theseusTruncated\" in val) {\n\t\t\t\to.truncated = {};\n\t\t\t\tif (\"length\" in val.__theseusTruncated) {\n\t\t\t\t\to.truncated.length = {\n\t\t\t\t\t\tamount: val.__theseusTruncated.length,\n\t\t\t\t\t};\n\t\t\t\t}\n\t\t\t\tif (\"keys\" in val.__theseusTruncated) {\n\t\t\t\t\to.truncated.keys = {\n\t\t\t\t\t\tamount: val.__theseusTruncated.keys,\n\t\t\t\t\t};\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn o;\n\t}\n\n\tfunction scrapeObject(object, depth) {\n\t\tvar MAX_BUFFER_LENGTH = 32;\n\t\tvar MAX_TOTAL_SIZE = 512;\n\n\t\t/**\n\t\tIt's everyone's favorite game: bin packing!\n\n\t\tThere's a big bin: total memory\n\t\tThere's a smaller bin: the memory used by this scraped object\n\t\tThere's smaller bins: the memory used by each child of this scraped object\n\n\t\tOur job is to copy as much useful information we can without overflowing\n\t\tthe big bin (total memory). For now, we pretend that bin is bottomless.\n\n\t\tSo our job is really to copy as much useful information as we can into\n\t\tthe MAX_TOTAL_SIZE \"bytes\" allocated to this scraped object. We do this\n\t\tby performing a deep copy, and any time we encounter an object that's\n\t\tsufficiently large to put us over the limit, we store a reference to it\n\t\tinstead of copying it.\n\n\t\tIn this function, the \"size\" of a copy is approximated by summing the\n\t\tlengths of all strings, the lengths of all keys, and the count of\n\t\tobjects of any other type, ignoring the overhead of array/object storage.\n\t\t**/\n\n\t\t// returns array: [approx size of copy, copy]\n\t\tvar scrape = function (o, depth) {\n\t\t\tif (typeof(o) === \"string\") return [o.length, o]; // don't worry about retaining strings > MAX_TOTAL_SIZE, for now\n\n\t\t\tif (depth <= 0) return [1, o]; // XXX: even if there's a ton there, count it as 1\n\t\t\tif (o === null || typeof(o) !== \"object\") return [1, o];\n\n\t\t\t// return only the first MAX_BUFFER_LENGTH bytes of a Buffer\n\t\t\tif (typeof(Buffer) === \"function\" && (o instanceof Buffer)) {\n\t\t\t\tvar len = Math.min(o.length, MAX_BUFFER_LENGTH);\n\t\t\t\tvar o2 = new Buffer(len);\n\t\t\t\tif (o.length > MAX_BUFFER_LENGTH) {\n\t\t\t\t\to2.__theseusTruncated = { length: o.length - MAX_BUFFER_LENGTH };\n\t\t\t\t}\n\t\t\t\ttry { o.copy(o2, 0, 0, len); } catch (e) { }\n\t\t\t\treturn [len, o2];\n\t\t\t}\n\n\t\t\ttry {\n\t\t\t\tvar size = 0;\n\t\t\t\tvar o2 = (o instanceof Array) ? [] : {};\n\t\t\t\tfor (var key in o) {\n\t\t\t\t\tif ((o.__lookupGetter__ instanceof Function) && o.__lookupGetter__(key))\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\tif (!(o.hasOwnProperty instanceof Function) || !o.hasOwnProperty(key))\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\tvar scraped = scrape(o[key], depth - 1);\n\t\t\t\t\tvar childSize = key.length + scraped[0];\n\t\t\t\t\tif (size + childSize <= MAX_TOTAL_SIZE) {\n\t\t\t\t\t\tsize += childSize;\n\t\t\t\t\t\to2[key] = scraped[1];\n\t\t\t\t\t} else {\n\t\t\t\t\t\t// XXX: if it's an array and this is a numeric key, count it as truncating the length instead\n\t\t\t\t\t\tif (!(\"__theseusTruncated\" in o2)) {\n\t\t\t\t\t\t\to2.__theseusTruncated = { keys: 0 };\n\t\t\t\t\t\t}\n\t\t\t\t\t\to2.__theseusTruncated.keys++;\n\t\t\t\t\t\to2[key] = o[key];\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\treturn [size, o2];\n\t\t\t} catch (e) {\n\t\t\t\tconsole.log(\"couldn't scrape\", o, e);\n\t\t\t\treturn [1, o];\n\t\t\t}\n\t\t};\n\n\t\treturn scrape(object, 1)[1];\n\t}\n\n\tfunction Invocation(info, type) {\n\t\tthis.tick = nextInvocationId++;\n\t\tthis.id = TRACER_ID + \"-\" + this.tick;\n\t\tthis.timestamp = new Date().getTime();\n\t\tthis.type = type;\n\t\tthis.f = nodeById[info.nodeId];\n\t\tthis.childLinks = [];\n\t\tthis.parentLinks = [];\n\t\tthis.returnValue = undefined;\n\t\tthis.exception = undefined;\n\t\tthis.topLevelInvocationId = undefined;\n\t\tthis.epochID = undefined;\n\t\tthis.epochDepth = undefined;\n\n\t\tinvocationById[this.id] = this;\n\t\textraInvocationInfoById[this.id] = {\n\t\t\targuments: info.arguments ? info.arguments.map(function (a) { return scrapeObject(a) }) : undefined,\n\t\t\tthis: (info.this && info.this !== globalThis) ? scrapeObject(info.this) : undefined,\n\t\t};\n\t}\n\tInvocation.prototype.equalToInfo = function (info) {\n\t\treturn this.f.id === info.nodeId;\n\t};\n\tInvocation.prototype.linkToChild = function (child, linkType) {\n\t\tthis.childLinks.push(new InvocationLink(child.id, linkType));\n\t\tchild.parentLinks.push(new InvocationLink(this.id, linkType));\n\t\tif (['call', 'branch-enter'].indexOf(linkType) !== -1) {\n\t\t\tchild.topLevelInvocationId = this.topLevelInvocationId;\n\t\t}\n\t};\n\tInvocation.prototype.addExitVars = function (vars) {\n\t\tthis.extraInfo().exitVars = vars;\n\t};\n\tInvocation.prototype.extraInfo = function () {\n\t\treturn extraInvocationInfoById[this.id];\n\t}\n\tInvocation.prototype.getChildren = function () {\n\t\treturn this.childLinks.map(function (link) { return invocationById[link.id]; });\n\t};\n\tInvocation.prototype.getParents = function () {\n\t\treturn this.parentLinks.map(function (link) { return invocationById[link.id]; });\n\t};\n\tInvocation.prototype.getParentLinks = function () {\n\t\treturn this.parentLinks;\n\t};\n\t/**\n\tcalls iter(invocation) for all children in sub-graph; if iter returns true,\n\ttreats that invocation as a leaf and continues\n\t**/\n\tInvocation.prototype.walk = function (iter) {\n\t\tthis.getChildren().forEach(function (child) {\n\t\t\tif (iter(child) !== true) {\n\t\t\t\tchild.walk(iter);\n\t\t\t}\n\t\t});\n\t};\n\n\tfunction InvocationLink(destId, type) {\n\t\tthis.id = destId;\n\t\tthis.type = type;\n\t}\n\n\tfunction Epoch(id, emitterID, eventName) {\n\t\tthis.id = id;\n\t\tthis.emitterID = emitterID;\n\t\tthis.eventName = eventName;\n\t}\n\n\tfunction nextEpoch(emitterID, eventName) {\n\t\tvar epochID = ++_lastEpochID;\n\t\tvar epoch = new Epoch(epochID, emitterID, eventName);\n\t\treturn epoch;\n\t}\n\n\tfunction hit(invocation) {\n\t\tvar id = invocation.f.id;\n\t\tfor (var handle in nodeHitCounts) {\n\t\t\tvar hits = nodeHitCounts[handle];\n\t\t\thits[id] = (hits[id] || 0) + 1;\n\t\t}\n\n\t\t// if this is console.log, we'll want the call site in a moment\n\t\tvar callSite;\n\t\tif (invocation.f.id === \"log\") {\n\t\t\tcallSite = invocation.getParents().filter(function (inv) { return inv.type === \"callsite\" })[0];\n\t\t}\n\n\t\t// add this invocation to all the relevant log queries\n\t\tfor (var handle in _logQueries) {\n\t\t\tif (_logQueries[handle].logs && invocation.f.id === \"log\") {\n\t\t\t\tif (callSite) {\n\t\t\t\t\tlogEntries[handle].push(callSite.id);\n\t\t\t\t} else {\n\t\t\t\t\tconsole.log(\"no call site! I needed one!\", invocation.getParents())\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (_logQueries[handle].ids && _logQueries[handle].ids.indexOf(id) !== -1) {\n\t\t\t\tlogEntries[handle].push(invocation.id);\n\t\t\t}\n\t\t}\n\t}\n\n\tfunction calculateHitCounts() {\n\t\tvar hits = {};\n\t\tnodes.forEach(function (n) {\n\t\t\tif (n.id in invocationsByNodeId) {\n\t\t\t\thits[n.id] = invocationsByNodeId[n.id].length;\n\t\t\t}\n\t\t});\n\t\treturn hits;\n\t}\n\n\tfunction calculateExceptionCounts() {\n\t\tvar counts = {};\n\t\tnodes.forEach(function (n) {\n\t\t\tif (n.id in exceptionsByNodeId) {\n\t\t\t\tcounts[n.id] = exceptionsByNodeId[n.id].length;\n\t\t\t}\n\t\t});\n\t\treturn counts;\n\t}\n\n\t/** return ordered list of invocation ids for the given log query */\n\tfunction backlog(query) {\n\t\tvar seenIds = {};\n\t\tvar ids = [];\n\n\t\tfunction addIfUnseen(id) {\n\t\t\tif (!(id in seenIds)) {\n\t\t\t\tids.push(id);\n\t\t\t\tseenIds[id] = true;\n\t\t\t}\n\t\t}\n\n\t\tvar getId = function (invocation) { return invocation.id };\n\n\t\tif (query.ids) {\n\t\t\tquery.ids.forEach(function (nodeId) {\n\t\t\t\tvar invocations = (invocationsByNodeId[nodeId] || []);\n\t\t\t\tinvocations.map(getId).forEach(addIfUnseen);\n\n\t\t\t\t// add logs that are called directly from this function\n\t\t\t\tinvocations.forEach(function (invocation) {\n\t\t\t\t\tinvocation.walk(function (child) {\n\t\t\t\t\t\tvar isFunction = child.type === \"function\";\n\t\t\t\t\t\tif (isFunction && child.f.id === \"log\") {\n\t\t\t\t\t\t\tvar callSite = child.getParents().filter(function (inv) { return inv.type === \"callsite\" })[0];\n\t\t\t\t\t\t\tif (callSite) {\n\t\t\t\t\t\t\t\taddIfUnseen(callSite.id);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\treturn isFunction;\n\t\t\t\t\t})\n\t\t\t\t});\n\t\t\t});\n\t\t}\n\n\t\tif (query.eventNames) {\n\t\t\tquery.eventNames.forEach(function (name) {\n\t\t\t\t(_topLevelInvocationsByEventName[name] || []).map(getId).forEach(addIfUnseen);\n\t\t\t});\n\t\t}\n\n\t\tif (query.exceptions) {\n\t\t\tfor (var nodeId in exceptionsByNodeId) {\n\t\t\t\texceptionsByNodeId[nodeId].map(function (o) { return o.invocationId }).forEach(addIfUnseen);\n\t\t\t}\n\t\t}\n\n\t\tif (query.logs) {\n\t\t\t(invocationsByNodeId[\"log\"] || []).forEach(function (invocation) {\n\t\t\t\tvar callSite = invocation.getParents().filter(function (inv) { return inv.type === \"callsite\" })[0];\n\t\t\t\tif (callSite) {\n\t\t\t\t\taddIfUnseen(callSite.id);\n\t\t\t\t}\n\t\t\t});\n\t\t}\n\n\t\tids = ids.sort(function (a, b) { return invocationById[a].tick - invocationById[b].tick });\n\t\treturn ids;\n\t}\n\n\n\t// instrumentation\n\n\tfunction bailThisTick(fromNode) {\n\t\t_bailedTick = true;\n\t\tinvocationStack = [];\n\t\t_epochStack = [];\n\t\t_epochInvocationDepth = [];\n\t\tanonFuncParentInvocation = undefined;\n\t\tlastException = undefined;\n\n\t\tif (fromNode) {\n\t\t\tconsole.log(\"[fondue] bailing from \" + (fromNode.name ? (fromNode.name + \" at \") : \"\") + fromNode.path + \" line \" + fromNode.start.line + \", character \" + fromNode.start.column);\n\t\t} else {\n\t\t\tconsole.log(\"[fondue] bailing! trace collection will resume next tick\");\n\t\t}\n\t\tif (!_explainedBails) {\n\t\t\tconsole.log(\"[fondue] (fondue is set to automatically bail after {maxInvocationsPerTick} invocations within a single tick. If you are using node-theseus, you can use the --theseus-max-invocations-per-tick=XXX option to raise the limit, but it will require more memory)\");\n\t\t\t_explainedBails = true;\n\t\t}\n\t}\n\n\tfunction endBail() {\n\t\t_bailedTick = false;\n\t\t_invocationsThisTick = 0;\n\n\t\tconsole.log('[fondue] resuming trace collection after bailed tick');\n\t}\n\n\tfunction pushNewInvocation(info, type) {\n\t\tif (_bailedTick) {\n\t\t\t_invocationStackSize++;\n\t\t\treturn;\n\t\t}\n\n\t\tvar invocation = new Invocation(info, type);\n\t\tpushInvocation(invocation);\n\t\treturn invocation;\n\t}\n\n\tfunction pushInvocation(invocation) {\n\t\t_invocationStackSize++;\n\n\t\tif (_bailedTick) return;\n\n\t\t_invocationsThisTick++;\n\t\tif (_invocationsThisTick === {maxInvocationsPerTick}) {\n\t\t\tbailThisTick(invocation.f);\n\t\t\treturn;\n\t\t}\n\n\t\t// associate with epoch, if there is one\n\t\tif (_epochStack.length > 0) {\n\t\t\tvar epoch = _epochStack[_epochStack.length - 1];\n\t\t\tvar depth = _epochInvocationDepth[_epochInvocationDepth.length - 1];\n\t\t\tinvocation.epochID = epoch.id;\n\t\t\tinvocation.epochDepth = depth;\n\n\t\t\t_epochInvocationDepth[_epochInvocationDepth.length - 1]++;\n\n\t\t\t// hang on to the epoch now that it's part of the call graph\n\t\t\t_epochsById[epoch.id] = epoch;\n\n\t\t\tif (!(epoch.eventName in _epochsByName)) {\n\t\t\t\t_epochsByName[epoch.eventName] = [];\n\t\t\t}\n\t\t\t_epochsByName[epoch.eventName].push(epoch);\n\n\t\t\tif (depth === 0) {\n\t\t\t\tepochTracker.update(epoch);\n\n\t\t\t\tif (!(epoch.eventName in _topLevelEpochsByName)) {\n\t\t\t\t\t_topLevelEpochsByName[epoch.eventName] = [];\n\t\t\t\t\t_topLevelInvocationsByEventName[epoch.eventName] = [];\n\t\t\t\t}\n\t\t\t\t_topLevelEpochsByName[epoch.eventName].push(epoch);\n\t\t\t\t_topLevelInvocationsByEventName[epoch.eventName].push(invocation);\n\n\t\t\t\tfor (var handle in _logQueries) {\n\t\t\t\t\tvar query = _logQueries[handle];\n\t\t\t\t\tif (query.eventNames && query.eventNames.indexOf(epoch.eventName) !== -1) {\n\t\t\t\t\t\tlogEntries[handle].push(invocation.id);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\t// add to invocationsByNodeId\n\t\tif (!invocationsByNodeId[invocation.f.id]) {\n\t\t\tinvocationsByNodeId[invocation.f.id] = [];\n\t\t}\n\t\tinvocationsByNodeId[invocation.f.id].push(invocation);\n\n\t\t// associate with caller, if there is one; otherwise, save as a top-level invocation\n\t\tvar top = invocationStack[invocationStack.length - 1];\n\t\tif (top) {\n\t\t\ttop.linkToChild(invocation, 'call');\n\t\t} else {\n\t\t\ttopLevelInvocations.push(invocation);\n\t\t\tinvocation.topLevelInvocationId = invocation.id;\n\t\t}\n\n\t\t// associate with the invocation where this anonymous function was created\n\t\tif (anonFuncParentInvocation) {\n\t\t\tanonFuncParentInvocation.linkToChild(invocation, 'async');\n\t\t\tanonFuncParentInvocation = undefined;\n\t\t}\n\n\t\t// update hit counts\n\t\thit(invocation);\n\n\t\tinvocationStack.push(invocation);\n\t}\n\n\tfunction popInvocation(info) {\n\t\t_invocationStackSize--;\n\t\tif (_bailedTick && _invocationStackSize === 0) {\n\t\t\tendBail();\n\t\t\treturn;\n\t\t}\n\n\t\tif (_bailedTick) return;\n\n\t\tif (info) {\n\t\t\tvar top = invocationStack[invocationStack.length - 1];\n\t\t\tif (!top || !top.equalToInfo(info)) {\n\t\t\t\tthrow new Error('exit from a non-matching enter');\n\t\t\t}\n\t\t\ttop.addExitVars(info.vars);\n\t\t}\n\n\t\tinvocationStack.pop();\n\n\t\tif (invocationStack.length === 0) {\n\t\t\t_invocationsThisTick = 0;\n\t\t}\n\n\t\tif (_epochStack.length > 0) {\n\t\t\t_epochInvocationDepth[_epochInvocationDepth.length - 1]--;\n\t\t}\n\t}\n\n\t/**\n\t * called from the top of every script processed by the rewriter\n\t */\n\tthis.add = function (path, options) {\n\t\tnodes.push.apply(nodes, options.nodes);\n\t\toptions.nodes.forEach(function (n) { nodeById[n.id] = n; });\n\n\t\tnodeTracker.update(options.nodes);\n\n\t\t_sendNodes(options.nodes);\n\t};\n\n\tthis.traceFileEntry = function () {\n\t};\n\n\tthis.traceFileExit = function () {\n\t};\n\n\tthis.setGlobal = function (gthis) {\n\t\tglobalThis = gthis;\n\t}\n\n\t/**\n\t * the rewriter wraps every anonymous function in a call to traceFunCreate.\n\t * a new function is returned that's associated with the parent invocation.\n\t */\n\tthis.traceFunCreate = function (f, src) {\n\t\tvar creatorInvocation = invocationStack[invocationStack.length - 1];\n\t\tvar newF;\n\n\t\t// Some code changes its behavior depending on the arity of the callback.\n\t\t// Therefore, we construct a replacement function that has the same arity.\n\t\t// The most direct route seems to be to use eval() (as opposed to\n\t\t// new Function()), so that creatorInvocation can be accessed from the\n\t\t// closure.\n\n\t\tvar arglist = '';\n\t\tfor (var i = 0; i < f.length; i++) {\n\t\t\targlist += (i > 0 ? ', ' : '') + 'v' + i;\n\t\t}\n\n\t\tvar sharedBody = 'return f.apply(this, arguments);';\n\n\t\tif (creatorInvocation) {\n\t\t\t// traceEnter checks anonFuncParentInvocation and creates\n\t\t\t// an edge in the graph from the creator to the new invocation\n\t\t\tvar asyncBody = 'anonFuncParentInvocation = creatorInvocation;';\n\t\t\tvar newSrc = '(function (' + arglist + ') { ' + asyncBody + sharedBody + '})';\n\t\t\tnewF = eval(newSrc);\n\t\t} else {\n\t\t\tvar newSrc = '(function (' + arglist + ') { ' + sharedBody + '})';\n\t\t\tnewF = eval(newSrc);\n\t\t}\n\t\tnewF.toString = function () { return src };\n\t\treturn newF;\n\t};\n\n\t/**\n\t * the rewriter wraps the callee portion of every function call with a call\n\t * to traceFunCall like this:\n\t *\n\t *   a.b('foo') -> (traceFunCall({ this: a, property: 'b', nodeId: '...', vars: {}))('foo')\n\t *   b('foo') -> (traceFunCall({ func: b, nodeId: '...', vars: {}))('foo')\n\t */\n\tvar _traceLogCall = function (info) {\n\t\tvar queryMatchesInvocation = function (handle, invocation) {\n\t\t\tvar query = _logQueries[handle];\n\t\t\tvar epoch = _epochsById[invocation.epochID];\n\t\t\tif (query.logs && invocation.f.id === \"log\") {\n\t\t\t\treturn true;\n\t\t\t} else if (query.exceptions && invocation.exception) {\n\t\t\t\treturn true;\n\t\t\t} else if (query.ids && query.ids.indexOf(invocation.f.id) !== -1) {\n\t\t\t\treturn true;\n\t\t\t} else if (query.eventNames && epoch && query.eventNames.indexOf(epoch.eventName) !== -1) {\n\t\t\t\treturn true;\n\t\t\t}\n\t\t\treturn false;\n\t\t};\n\t\tvar matchingQueryHandles = function (invocation) {\n\t\t\treturn Object.keys(_logQueries).filter(function (handle) {\n\t\t\t\treturn queryMatchesInvocation(handle, invocation);\n\t\t\t});\n\t\t};\n\n\t\treturn function () {\n\t\t\tconsole.log.apply(console, arguments);\n\n\t\t\tvar callerInvocation = invocationStack[invocationStack.length - 1];\n\n\t\t\tinfo.arguments = Array.prototype.slice.apply(arguments); // XXX: mutating info may not be okay, but we want the arguments\n\n\t\t\tvar callSiteInvocation = pushNewInvocation(info, 'callsite');\n\t\t\tpushNewInvocation({ nodeId: \"log\", arguments: info.arguments }, 'function');\n\t\t\tpopInvocation();\n\t\t\tpopInvocation();\n\n\t\t\t// if called directly from an invocation that's in the query, add\n\t\t\t// this log statement invocation as well\n\t\t\t// (callSiteInvocation might be falsy if this tick was bailed)\n\t\t\tif (callerInvocation && callSiteInvocation) {\n\t\t\t\tmatchingQueryHandles(callerInvocation).forEach(function (handle) {\n\t\t\t\t\tlogEntries[handle].push(callSiteInvocation.id);\n\t\t\t\t});\n\t\t\t}\n\t\t}\n\t};\n\tthis.traceFunCall = function (info) {\n\t\tif ('func' in info) {\n\t\t\tvar func = info.func;\n\t\t\tif (!func) return func;\n\t\t\tif (typeof console !== 'undefined' && func === console.log) {\n\t\t\t\treturn _traceLogCall(info);\n\t\t\t}\n\t\t\treturn function () {\n\t\t\t\tinfo.arguments = Array.prototype.slice.apply(arguments); // XXX: mutating info may not be okay, but we want the arguments\n\t\t\t\tpushNewInvocation(info, 'callsite');\n\n\t\t\t\ttry {\n\t\t\t\t\treturn func.apply(this, arguments);\n\t\t\t\t} finally {\n\t\t\t\t\tpopInvocation();\n\t\t\t\t}\n\t\t\t}\n\t\t} else {\n\t\t\tvar fthis = info.this;\n\t\t\tvar func = fthis[info.property];\n\t\t\tif (!func) return func;\n\t\t\tif (typeof console !== 'undefined' && func === console.log) {\n\t\t\t\treturn _traceLogCall(info);\n\t\t\t}\n\t\t\treturn function () {\n\t\t\t\tinfo.arguments = Array.prototype.slice.apply(arguments); // XXX: mutating info may not be okay, but we want the arguments\n\t\t\t\tpushNewInvocation(info, 'callsite');\n\n\t\t\t\ttry {\n\t\t\t\t\treturn func.apply(fthis, arguments);\n\t\t\t\t} finally {\n\t\t\t\t\tpopInvocation();\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t};\n\n\t/**\n\t * the rewriter calls traceEnter from just before the try clause it wraps\n\t * function bodies in. info is an object like:\n\t *\n\t *   {\n\t *     start: { line: ..., column: ... },\n\t *     end: { line: ..., column: ... },\n\t *     vars: { a: a, b: b, ... }\n\t *   }\n\t */\n\tthis.traceEnter = function (info) {\n\t\tpushNewInvocation(info, 'function');\n\t};\n\n\t/**\n\t * the rewriter calls traceExit from the finally clause it wraps function\n\t * bodies in. info is an object like:\n\t *\n\t *   {\n\t *     start: { line: ..., column: ... },\n\t *     end: { line: ..., column: ... }\n\t *   }\n\t *\n\t * in the future, traceExit will be passed an object with all the\n\t * local variables of the instrumented function.\n\t */\n\tthis.traceExit = function (info) {\n\t\tpopInvocation(info);\n\t\tlastException = undefined;\n\t};\n\n\tthis.traceReturnValue = function (value) {\n\t\tif (_bailedTick) return value;\n\n\t\tvar top = invocationStack[invocationStack.length - 1];\n\t\tif (!top) {\n\t\t\tthrow new Error('value returned with nothing on the stack');\n\t\t}\n\t\ttop.returnValue = scrapeObject(value);\n\t\treturn value;\n\t}\n\n\t/**\n\t * the rewriter calls traceExceptionThrown from the catch clause it wraps\n\t * function bodies in. info is an object like:\n\t *\n\t *   {\n\t *     start: { line: ..., column: ... },\n\t *     end: { line: ..., column: ... }\n\t *   }\n\t */\n\tthis.traceExceptionThrown = function (info, exception) {\n\t\tif (_bailedTick) return;\n\n\t\tif (exception === lastException) {\n\t\t\treturn;\n\t\t}\n\n\t\tvar top = invocationStack[invocationStack.length - 1];\n\t\tif (!top || !top.equalToInfo(info)) {\n\t\t\tthrow new Error('exception thrown from a non-matching enter');\n\t\t}\n\t\ttop.exception = exception;\n\t\tlastException = exception;\n\n\t\tif (!exceptionsByNodeId[top.f.id]) {\n\t\t\texceptionsByNodeId[top.f.id] = [];\n\t\t}\n\t\texceptionsByNodeId[top.f.id].push({ exception: exception, invocationId: top.id });\n\n\t\tvar id = top.f.id;\n\t\tfor (var handle in exceptionCounts) {\n\t\t\tvar hits = exceptionCounts[handle];\n\t\t\thits[id] = (hits[id] || 0) + 1;\n\t\t}\n\n\t\tfor (var handle in _logQueries) {\n\t\t\tif (_logQueries[handle].exceptions) {\n\t\t\t\tlogEntries[handle].push(top.id);\n\t\t\t}\n\t\t}\n\t};\n\n\t/** cease collecting trace information until the next tick **/\n\tthis.bailThisTick = bailThisTick;\n\n\tthis.pushEpoch = function (epoch) {\n\t\t_epochStack.push(epoch);\n\t\t_epochInvocationDepth.push(0);\n\t};\n\n\tthis.popEpoch = function () {\n\t\t_epochStack.pop();\n\t\t_epochInvocationDepth.pop();\n\t}\n\n\tif ({nodejs}) {\n\t\t// override EventEmitter.emit() to automatically begin epochs when events are thrown\n\t\tvar EventEmitter = require('events').EventEmitter;\n\t\tvar oldEmit = EventEmitter.prototype.emit;\n\t\tEventEmitter.prototype.emit = function (ev) {\n\t\t\t// give this emitter an identifier if it doesn't already have one\n\t\t\tif (!this._emitterID) {\n\t\t\t\tthis._emitterID = ++_lastEmitterID;\n\t\t\t}\n\n\t\t\t// start an epoch & emit the event\n\t\t\tvar epoch = nextEpoch(this._emitterID, ev);\n\t\t\t{name}.pushEpoch(epoch);\n\t\t\ttry {\n\t\t\t\toldEmit.apply(this, arguments);\n\t\t\t} finally {\n\t\t\t\t{name}.popEpoch();\n\t\t\t}\n\t\t};\n\t}\n\n\n\t// remote prebuggin' (from Brackets)\n\n\tvar _sendNodes = function (nodes) {\n\t\tif (_connected) {\n\t\t\t_sendBracketsMessage('scripts-added', JSON.stringify({ nodes: nodes }));\n\t\t}\n\t};\n\n\tfunction _sendBracketsMessage(name, value) {\n\t\tvar key = \"data-{name}-\" + name;\n\t\tdocument.body.setAttribute(key, value);\n\t\twindow.setTimeout(function () { document.body.removeAttribute(key); });\n\t}\n\n\tthis.version = function () {\n\t\treturn {version};\n\t};\n\n\t// deprecated\n\tthis.connect = function () {\n\t\tif (typeof console !== 'undefined') console.log(\"Opening the Developer Console will break the connection with Brackets!\");\n\t\t_connected = true;\n\t\t_sendNodes(nodes);\n\t\treturn this;\n\t};\n\n\t// accessors\n\n\t// this is mostly here for unit tests, and not necessary or encouraged\n\t// use trackNodes instead\n\tthis.nodes = function () {\n\t\treturn nodes;\n\t};\n\n\tthis.trackNodes = function () {\n\t\treturn nodeTracker.track();\n\t};\n\n\tthis.untrackNodes = function () {\n\t\treturn nodeTracker.untrack();\n\t};\n\n\tthis.newNodes = function (handle) {\n\t\treturn nodeTracker.delta(handle);\n\t};\n\n\tthis.trackHits = function () {\n\t\tvar handle = _hitQueries.push(true) - 1;\n\t\tnodeHitCounts[handle] = calculateHitCounts();\n\t\treturn handle;\n\t};\n\n\tthis.trackExceptions = function () {\n\t\tvar handle = _exceptionQueries.push(true) - 1;\n\t\texceptionCounts[handle] = calculateExceptionCounts();\n\t\treturn handle;\n\t};\n\n\tthis.trackLogs = function (query) {\n\t\tvar handle = _logQueries.push(query) - 1;\n\t\tlogEntries[handle] = backlog(query);\n\t\treturn handle;\n\t};\n\n\tthis.trackEpochs = function () {\n\t\treturn epochTracker.track();\n\t};\n\n\tthis.untrackEpochs = function (handle) {\n\t\treturn epochTracker.untrack(handle);\n\t}\n\n\tthis.hitCountDeltas = function (handle) {\n\t\tif (!(handle in _hitQueries)) {\n\t\t\tthrow new Error(\"unrecognized query\");\n\t\t}\n\t\tvar result = nodeHitCounts[handle];\n\t\tnodeHitCounts[handle] = {};\n\t\treturn result;\n\t};\n\n\tthis.newExceptions = function (handle) {\n\t\tif (!(handle in _exceptionQueries)) {\n\t\t\tthrow new Error(\"unrecognized query\");\n\t\t}\n\t\tvar result = exceptionCounts[handle];\n\t\texceptionCounts[handle] = {};\n\t\treturn { counts: result };\n\t};\n\n\tthis.epochDelta = function (handle) {\n\t\treturn epochTracker.delta(handle);\n\t};\n\n\t// okay, the second argument is kind of a hack\n\tfunction makeLogEntry(invocation, parents) {\n\t\tparents = (parents || []);\n\t\tvar extra = invocation.extraInfo();\n\t\tvar entry = {\n\t\t\ttimestamp: invocation.timestamp,\n\t\t\ttick: invocation.tick,\n\t\t\tinvocationId: invocation.id,\n\t\t\ttopLevelInvocationId: invocation.topLevelInvocationId,\n\t\t\tnodeId: invocation.f.id,\n\t\t};\n\t\tif (invocation.epochID !== undefined) {\n\t\t\tvar epoch = _epochsById[invocation.epochID];\n\t\t\tentry.epoch = {\n\t\t\t\tid: epoch.id,\n\t\t\t\temitterID: epoch.emitterID,\n\t\t\t\teventName: epoch.eventName,\n\t\t\t};\n\t\t\tentry.epochDepth = invocation.epochDepth;\n\t\t}\n\t\tif (invocation.returnValue !== undefined) {\n\t\t\tentry.returnValue = marshalForTransmission(invocation.returnValue);\n\t\t}\n\t\tif (invocation.exception !== undefined) {\n\t\t\tentry.exception = marshalForTransmission(invocation.exception);\n\t\t}\n\t\tif (invocation.f.params || extra.arguments) {\n\t\t\tentry.arguments = [];\n\t\t\tvar params = invocation.f.params || [];\n\t\t\tfor (var i = 0; i < params.length; i++) {\n\t\t\t\tvar param = params[i];\n\t\t\t\tentry.arguments.push({\n\t\t\t\t\tname: param.name,\n\t\t\t\t\tvalue: marshalForTransmission(extra.arguments[i]),\n\t\t\t\t});\n\t\t\t}\n\t\t\tfor (var i = params.length; i < extra.arguments.length; i++) {\n\t\t\t\tentry.arguments.push({\n\t\t\t\t\tvalue: marshalForTransmission(extra.arguments[i]),\n\t\t\t\t});\n\t\t\t}\n\t\t}\n\t\tif (extra.this !== undefined) {\n\t\t\tentry.this = marshalForTransmission(extra.this);\n\t\t}\n\t\tif (parents.length > 0) {\n\t\t\tentry.parents = parents;\n\t\t}\n\t\treturn entry;\n\t}\n\n\tthis.logCount = function (handle) {\n\t\tif (!(handle in _logQueries)) {\n\t\t\tthrow new Error(\"unrecognized query\");\n\t\t}\n\n\t\treturn logEntries[handle].length;\n\t};\n\n\tthis.logDelta = function (handle, maxResults) {\n\t\tif (!(handle in _logQueries)) {\n\t\t\tthrow new Error(\"unrecognized query\");\n\t\t}\n\n\t\tmaxResults = maxResults || 10;\n\n\t\tvar ids = logEntries[handle].splice(0, maxResults);\n\t\tvar results = ids.map(function (invocationId, i) {\n\t\t\tvar invocation = invocationById[invocationId];\n\t\t\treturn makeLogEntry(invocation, findParentsInQuery(invocation, _logQueries[handle]));\n\t\t});\n\t\treturn results;\n\t};\n\n\tthis.backtrace = function (options) {\n\t\toptions = mergeInto(options, {\n\t\t\trange: [0, 10],\n\t\t});\n\n\t\tvar invocation = invocationById[options.invocationId];\n\t\tif (!invocation) {\n\t\t\tthrow new Error(\"invocation not found\");\n\t\t}\n\n\t\tvar stack = [];\n\t\tif (options.range[0] <= 0) {\n\t\t\tstack.push(invocation);\n\t\t}\n\n\t\tfunction search(invocation, depth) {\n\t\t\t// stop if we're too deep\n\t\t\tif (depth+1 >= options.range[1]) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tvar callers = findCallers(invocation);\n\t\t\tvar directCallers = callers.filter(function (c) { return c.type === \"call\" })\n\t\t\tvar caller = directCallers[0];\n\n\t\t\tif (caller) {\n\t\t\t\tvar parent = invocationById[caller.invocationId];\n\t\t\t\tif (options.range[0] <= depth+1) {\n\t\t\t\t\tstack.push(parent);\n\t\t\t\t}\n\t\t\t\tsearch(parent, depth + 1);\n\t\t\t}\n\t\t}\n\t\tsearch(invocation, 0);\n\t\tvar results = stack.map(function (invocation) {\n\t\t\treturn makeLogEntry(invocation);\n\t\t});\n\t\treturn results;\n\t};\n\n\tfunction findParentsInQuery(invocation, query) {\n\t\tif (query.ids.length === 0) {\n\t\t\treturn [];\n\t\t}\n\n\t\tvar matches = {}; // invocation id -> link\n\t\tvar types = ['async', 'call', 'branch-enter']; // in priority order\n\t\tfunction promoteType(type, newType) {\n\t\t\tif (types.indexOf(type) === -1 || types.indexOf(newType) === -1) {\n\t\t\t\tthrow new Exception(\"invocation link type not known\")\n\t\t\t}\n\t\t\tif (types.indexOf(newType) < types.indexOf(type)) {\n\t\t\t\treturn newType;\n\t\t\t}\n\t\t\treturn type;\n\t\t}\n\t\tfunction search(link, type) {\n\t\t\tif (query.ids.indexOf(invocationById[link.id].f.id) !== -1) {\n\t\t\t\tif (link.id in matches) {\n\t\t\t\t\tif (link.type === 'call' && matches[link.id].type === 'async') {\n\t\t\t\t\t\tmatches[link.id] = {\n\t\t\t\t\t\t\tinvocationId: link.id,\n\t\t\t\t\t\t\ttype: type,\n\t\t\t\t\t\t\tinbetween: []\n\t\t\t\t\t\t};\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tmatches[link.id] = {\n\t\t\t\t\t\tinvocationId: link.id,\n\t\t\t\t\t\ttype: type,\n\t\t\t\t\t\tinbetween: []\n\t\t\t\t\t};\n\t\t\t\t}\n\t\t\t\treturn; // search no more down this path\n\t\t\t}\n\t\t\tinvocationById[link.id].getParentLinks().forEach(function (link) { search(link, promoteType(type, link.type)); });\n\t\t}\n\t\tinvocation.getParentLinks().forEach(function (link) { search(link, link.type); });\n\n\t\t// convert matches to an array\n\t\tvar matchesArr = [];\n\t\tfor (var id in matches) {\n\t\t\tmatchesArr.push(matches[id]);\n\t\t}\n\t\treturn matchesArr;\n\t}\n\n\tfunction findCallers(invocation) {\n\t\tvar matches = {}; // invocation id -> link\n\t\tvar types = ['async', 'call', 'branch-enter']; // in priority order\n\t\tfunction promoteType(type, newType) {\n\t\t\tif (types.indexOf(type) === -1 || types.indexOf(newType) === -1) {\n\t\t\t\tthrow new Exception(\"invocation link type not known\")\n\t\t\t}\n\t\t\tif (types.indexOf(newType) < types.indexOf(type)) {\n\t\t\t\treturn newType;\n\t\t\t}\n\t\t\treturn type;\n\t\t}\n\t\tfunction search(link, type) {\n\t\t\tif (invocationById[link.id].f.type === \"function\") {\n\t\t\t\tif (link.id in matches) {\n\t\t\t\t\tif (link.type === 'call' && matches[link.id].type === 'async') {\n\t\t\t\t\t\tmatches[link.id] = {\n\t\t\t\t\t\t\tinvocationId: link.id,\n\t\t\t\t\t\t\ttype: type,\n\t\t\t\t\t\t};\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tmatches[link.id] = {\n\t\t\t\t\t\tinvocationId: link.id,\n\t\t\t\t\t\ttype: type,\n\t\t\t\t\t};\n\t\t\t\t}\n\t\t\t\treturn; // search no more down this path\n\t\t\t}\n\t\t\tinvocationById[link.id].getParentLinks().forEach(function (link) { search(link, promoteType(type, link.type)); });\n\t\t}\n\t\tinvocation.getParentLinks().forEach(function (link) { search(link, link.type); });\n\n\t\t// convert matches to an array\n\t\tvar matchesArr = [];\n\t\tfor (var id in matches) {\n\t\t\tmatchesArr.push(matches[id]);\n\t\t}\n\t\treturn matchesArr;\n\t}\n});\n}\n(function () { {name}.setGlobal(this); })();\n", {
		name: options.name,
		version: JSON.stringify(require('../package.json').version),
		nodejs: options.nodejs,
		maxInvocationsPerTick: options.maxInvocationsPerTick,
	});
}

/**
 * options:
 *   path (<anonymous>): path of the source being instrumented
 *       (should be unique if multiple instrumented files are to be run together)
 *   include_prefix (true): include the instrumentation thunk
 *   tracer_name (tracer): name for the global tracer object
 *   nodejs (false): true to enable Node.js-specific functionality
 *   maxInvocationsPerTick (4096): stop collecting trace information for a tick
 *       with more than this many invocations
 **/
function instrument(src, options) {
	var defaultOptions = {
		include_prefix: true,
		tracer_name: 'tracer',
	};
	options = mergeInto(options, defaultOptions);

	var output = '';

	if (options.include_prefix) {
		output += instrumentationPrefix({
			name: options.tracer_name,
			nodejs: options.nodejs,
			maxInvocationsPerTick: options.maxInvocationsPerTick,
		});
	}

	if (src.indexOf("/*theseus instrument: false */") !== -1) {
		output += src;
	} else {
		output += traceFilter(src, {
			path: options.path,
			tracer_name: options.tracer_name
		});
	}

	return output;
}









/** comparator for positions in the form { line: XXX, column: YYY } */
var comparePositions = function (a, b) {
	if (a.line !== b.line) {
		return a.line < b.line ? -1 : 1;
	}
	if (a.column !== b.column) {
		return a.column < b.column ? -1 : 1;
	}
	return 0;
};

function contains(start, end, pos) {
	var startsBefore = comparePositions(start, pos) <= 0;
	var endsAfter    = comparePositions(end,   pos) >= 0;
	if (startsBefore && endsAfter) {
		return true;
	}
}


/**
 * returns all functions containing the given line/column, in order of
 * appearance in the file
 */
var findContainingFunctions = function (functions, line, column) {
	/** comparator for functions, sorts by their starting position */
	var compareFunctionsByPosition = function (a, b) {
		return comparePositions(a.start, b.start);
	};

	var funcs = [];
	for (var i in functions) {
		var startsBefore = comparePositions(functions[i].start, { line: line, column: column }) <= 0;
		var endsAfter    = comparePositions(functions[i].end,   { line: line, column: column }) >= 0;
		if (startsBefore && endsAfter) {
			funcs.push(functions[i]);
		}
	}

	// sort functions by appearance (i.e. by nesting level)
	funcs.sort(compareFunctionsByPosition);

	return funcs;
};




var makeId = function (type, path, loc) {
	return path + '-'
	     + loc.start.line + '-'
	     + loc.start.column + '-'
	     + loc.end.line + '-'
	     + loc.end.column;
};

// uses the surrounding code to generate a reasonable name for a function
var concoctFunctionName = function (node) {
	var name = undefined;

	if (node.type === 'FunctionDeclaration') {
		// function xxx() { }
		//  -> "xxx"
		name = node.id.name;
	} else if (node.type === 'FunctionExpression') {
		if (node.id) {
			// (function xxx() { })
			//  -> "xxx"
			name = node.id.name;
		} else if (node.parent.type === 'VariableDeclarator') {
			// var xxx = function () { }
			//  -> "xxx"
			name = node.parent.id.name;
		} else if (node.parent.type === 'AssignmentExpression') {
			var left = node.parent.left;
			if (left.type === 'MemberExpression' && !left.computed) {
				if (left.object.type === 'MemberExpression' && !left.object.computed) {
					if (left.object.property.type === 'Identifier' && left.object.property.name === 'prototype') {
						// yyy.prototype.xxx = function () { }
						//  -> "yyy.xxx"
						name = left.object.object.name + '.' + left.property.name;
					}
				}
			}
		} else if (node.parent.type === 'CallExpression') {
			// look, I know this is a regexp, I'm just sick of parsing ASTs
			if (/\.on$/.test(node.parent.callee.source())) {
				var args = node.parent.arguments;
				if (args[0].type === 'Literal' && typeof args[0].value === 'string') {
					// .on('event', function () { })
					//  -> "('event' handler)"
					name = "('" + args[0].value + "' handler)";
				}
			} else if (node.parent.callee.type === 'Identifier') {
				if (['setTimeout', 'setInterval'].indexOf(node.parent.callee.name) !== -1) {
					// setTimeout(function () { }, xxx)
					// setInterval(function () { }, xxx)
					//  -> "timer handler"
					name = 'timer handler';
					if (node.parent.arguments[1] && node.parent.arguments[1].type === 'Literal' && typeof node.parent.arguments[1].value === 'number') {
						// setTimeout(function () { }, 100)
						// setInterval(function () { }, 1500)
						//  -> "timer handler (100ms)"
						//  -> "timer handler (1.5s)"
						if (node.parent.arguments[1].value < 1000) {
							name += ' (' + node.parent.arguments[1].value + 'ms)';
						} else {
							name += ' (' + (node.parent.arguments[1].value / 1000) + 's)';
						}
					}
					name = '(' + name + ')';
				} else {
					// xxx(function () { })
					//  -> "('xxx' callback)"
					name = "('" + node.parent.callee.source() + "' callback)";
				}
			} else if (node.parent.callee.type === 'MemberExpression') {
				if (node.parent.callee.property.type === 'Identifier') {
					// xxx.yyy(..., function () { }, ...)
					//  -> "('yyy' callback)"
					name = "('" + node.parent.callee.property.name + "' callback)";
				}
			}
		} else if (node.parent.type === 'Property') {
			// { xxx: function () { } }
			//  -> "xxx"
			name = node.parent.key.name || node.parent.key.value;
			if (name !== undefined) {
				if (node.parent.parent.type === 'ObjectExpression') {
					var obj = node.parent.parent;
					if (obj.parent.type === 'VariableDeclarator') {
						// var yyy = { xxx: function () { } }
						//  -> "yyy.xxx"
						name = obj.parent.id.name + '.' + name;
					} else if(obj.parent.type === 'AssignmentExpression') {
						var left = obj.parent.left;
						if (left.type === 'MemberExpression' && !left.computed) {
							if (left.object.type === 'Identifier' && left.property.name === 'prototype') {
								// yyy.prototype = { xxx: function () { } }
								//  -> "yyy.xxx"
								name = left.object.name + '.' + name;
							}
						}
					}
				}
			}
		}
	}

	return name;
};

var extractTracePoints = function (content, path) {
	var nodes = [];

	try {
		falafel({
			source: content,
			loc: true
		}, function (node) {

			if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
				var params = [];
				node.params.forEach(function (param) {
					params.push({ name: param.name, start: param.loc.start, end: param.loc.end });
				});

				nodes.push({
					path: path,
					start: node.loc.start,
					end: node.loc.end,
					id: makeId("function", path, node.loc),
					type: "function",
					childrenIds: [],
					parentId: undefined,
					name: concoctFunctionName(node),
					params: params
				});

			} else if (node.type === 'CallExpression') {
				var nameLoc = (node.callee.type === 'MemberExpression') ? node.callee.property.loc : node.callee.loc;

				nodes.push({
					path: path,
					start: node.loc.start,
					end: node.loc.end,
					id: makeId("callsite", path, node.loc),
					type: "callsite",
					childrenIds: [],
					parentId: undefined,
					name: node.callee.source(),
					nameStart: nameLoc.start,
					nameEnd: nameLoc.end
				});

			} else if (node.type === 'IfStatement') {
				var handleBranch = function (node) {
					nodes.push({
						path: path,
						start: node.loc.start,
						end: node.loc.end,
						id: makeId("branch", path, node.loc),
						type: "branch",
						childrenIds: [],
						parentId: undefined,
					});
				};

				if (node.consequent) {
					handleBranch(node.consequent);
				}

				// we will have already visited a nested IfStatement since falafel visits children first
				if (node.alternate && node.alternate.type !== 'IfStatement') {
					handleBranch(node.alternate);
				}
			}
		}).toString();

		// I ought to be able to do this by taking advantage of falafel's walk order,
		// but I don't feel like being that fancy right now

		// link up parent pointers
		var nodesById = {};
		nodes.forEach(function (n1) {
			nodesById[n1.id] = n1;

			nodes.forEach(function (n2) {
				if (n1 == n2) {
					return;
				}

				if (contains(n1.start, n1.end, n2.start, n2.end)) {
					// set as parent if it's closer than the current parent
					if (n2.parentId) {
						if (comparePositions(n1, n2.parentId) > 0) {
							n2.parentId = n1.id;
						}
					} else {
						n2.parentId = n1.id;
					}
				}
			});
		});

		// link children pointers using the parent pointers
		nodes.forEach(function (n) {
			if (n.parentId) {
				nodesById[n.parentId].childrenIds.push(n.id);
			}
		});

	} catch (e) {
		console.log("exception during parsing", path, e);
		return;
	}

	return JSON.stringify({ nodes: nodes });
};

/**
 * injects code for tracing the execution of functions.
 *
 * the bodies of named functions are:
 *  - wrapped in try {} finally {},
 *  - have a call to traceEnter is prepended, and
 *  - have a call to traceExit added to the finally block
 *
 * here is an example:
 *
 *   function foo() {...}
 *     -->
 *   function foo() {
 *     tracer.traceEnter({
 *       start: { line: ..., column: ... },
 *       end: { line: ..., column: ... },
 *       vars: { a: a, b: b, ... }
 *     });
 *     try {
 *       ...
 *     } finally {
 *       tracer.traceExit({
 *         start: { line: ..., column: ... },
 *         end: { line: ..., column: ... }
 *       });
 *     }
 *   }
 *
 * anonymous functions get the same transformation, but they're also
 * wrapped in a call to traceFunCreate:
 *
 *   function () {...}
 *     -->
 *   tracer.traceFunCreate({
 *     start: { line: ..., column: ... },
 *     end: { line: ..., column: ... }
 *   }, function () {...})
 */
var traceFilter = function (content, options) {
	if (content.trim() === '') {
		return content;
	}

	var defaultOptions = {
		path: '<anonymous>',
		tracer_name: 'tracer',
		trace_function_entry: true,
		trace_function_creation: true,
		trace_function_calls: true,
		trace_branches: false,
		trace_switches: false,
		trace_loops: false,
	};
	options = mergeInto(options, defaultOptions);

	JSHINT(content);
	var jshintData = JSHINT.data();

	var processed = content;

	var functionSources = function () {
		var sources = {};
		try {
			falafel({
				source: content,
				loc: true
			}, function (node) {
				if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
					sources[makeId('function', options.path, node.loc)] = node.source();
				}
			});
		} catch (e) {
		}
		return sources;
	}();

	try {
		processed = falafel({
			source: content,
			loc: true
		}, function (node) {

			var loc = {
				path: options.path,
				start: node.loc.start,
				end: node.loc.end
			};

			/**
			 * find all variables in scope and generate the code to capture
			 * their values like { a: a, b: b, ... }
			 */
			var makeCaptureVarsJS = function (node, includeLocal) {
				var vars = findVariablesInScope(jshintData, node.loc.start.line, node.loc.start.column, includeLocal);
				var captureVarsJS = '';
				for (var i = 0; i < vars.length; i++) {
					if (i > 0) {
						captureVarsJS += ',';
					}
					captureVarsJS += vars[i] + ":" + vars[i];
				}
				return '{' + captureVarsJS + '}';
			};

			var traceBranch = function (node) {
				var attrs = { nodeId: makeId("branch", options.path, node.loc) };
				var captureVarsJS = makeCaptureVarsJS(node, true);
				var postCaptureVarsJS = makeCaptureVarsJS(node, true);

				// convert the arguments to strings
				var args = JSON.stringify(attrs);
				var entryArgs = args.slice(0, args.length - 1) + ', vars: ' + captureVarsJS + '}';
				var exitArgs = args.slice(0, args.length - 1) + ', vars: ' + postCaptureVarsJS + '}';

				var oldBody = node.source();
				if (oldBody[0] === '{') {
					oldBody = oldBody.slice(1, oldBody.length - 1); // remove braces
				}

				// insert the traces for when the function is called and when it exits
				var traceBegin = options.tracer_name + '.traceBranchEnter(' + entryArgs + ');';
				var traceError = options.tracer_name + '.traceBranchExceptionThrown(' + exitArgs + ', e); throw e;';
				var traceEnd = ';' + options.tracer_name + '.traceBranchExit(' + exitArgs + ');';

				// add line break after oldBody in case it ends in a //-comment
				node.update('{ ' + traceBegin + ' try { ' + oldBody + '\n } catch (e) { ' + traceError + ' } finally { ' + traceEnd + ' } }');
			};

			if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
				var attrs = { nodeId: makeId('function', options.path, node.loc) };
				var captureVarsJS = makeCaptureVarsJS(node.body);
				var postCaptureVarsJS = makeCaptureVarsJS(node.body, true);

				// convert the arguments to strings
				var args = JSON.stringify(attrs);
				var entryArgs = args.slice(0, args.length - 1) + ', vars: ' + captureVarsJS + ', arguments: Array.prototype.slice.apply(arguments), this: this }';
				var exitArgs = args.slice(0, args.length - 1) + ', vars: ' + postCaptureVarsJS + '}';

				if (options.trace_function_entry) {
					// insert the traces for when the function is called and when it exits
					var oldBody = node.body.source().slice(1, node.body.source().length - 1);
					var traceBegin = options.tracer_name + '.traceEnter(' + entryArgs + ');';
					var traceError = options.tracer_name + '.traceExceptionThrown(' + exitArgs + ', e); throw e;';
					var traceEnd = ';' + options.tracer_name + '.traceExit(' + exitArgs + ');';

					// add line break after oldBody in case it ends in a //-comment
					node.body.update('{ ' + traceBegin + ' try { ' + oldBody + '\n } catch (e) { ' + traceError + ' } finally { ' + traceEnd + ' } }');
				}

				if (node.type === 'FunctionExpression' && options.trace_function_creation) {
					if (node.parent.type !== 'Property' || node.parent.kind === 'init') {
						node.update(options.tracer_name + '.traceFunCreate(' + node.source() + ', ' + JSON.stringify(functionSources[attrs.nodeId]) + ')');
					}
				}
			} else if (node.type === 'CallExpression') {
				if (options.trace_function_calls) {
					var id = makeId("callsite", loc.path, loc);

					if (node.callee.source() !== "require") {
						if (node.callee.type === 'MemberExpression') {
							if (node.callee.computed) {
								node.callee.update(' ' + options.tracer_name + '.traceFunCall({ this: ' + node.callee.object.source() + ', property: ' + node.callee.property.source() + ', nodeId: ' + JSON.stringify(id) + ', vars: {} })');
							} else {
								node.callee.update(' ' + options.tracer_name + '.traceFunCall({ this: ' + node.callee.object.source() + ', property: "' + node.callee.property.source() + '", nodeId: ' + JSON.stringify(id) + ', vars: {} })');
							}
						} else {
							node.callee.update(' ' + options.tracer_name + '.traceFunCall({ func: ' + node.callee.source() + ', nodeId: ' + JSON.stringify(id) + ', vars: {} })');
						}
					}
				}
			} else if (/Statement$/.test(node.type)) {
				var semiColonStatements = ["BreakStatement", "ContinueStatement", "ExpressionStatement", "ReturnStatement", "ThrowStatement"];
				if (node.type === "ReturnStatement" && node.argument) {
					if (options.trace_function_entry) {
						var src = node.source().slice(6);
						var semicolon = src.slice(-1) === ";";
						if (semicolon) src = src.slice(0, -1);
						node.update("return " + options.tracer_name + ".traceReturnValue(" + src + ")" + (semicolon ? ";" : "") + "\n");
					}
				} else if (node.type === 'IfStatement') {
					if (options.trace_branches) {
						traceBranch(node.consequent);
						if (node.alternate && node.alternate.type !== 'IfStatement') { // if "else if" don't treat else as a block
							traceBranch(node.alternate);
						}
					}
				} else if (semiColonStatements.indexOf(node.type) !== -1) {
					if (!/;$/.test(node.source())) {
						node.update(node.source() + ";");
					}
				}
			} else if (node.type === 'SwitchStatement') {
				if (options.trace_switches) {
					for (var i in node.cases) {
						var c = node.cases[i];
						if (c.consequent.length > 0) {
							// it's impossible to get the source minus the "case 0:" at the beginning,
							// so calculate the offset of the first statement of the consequence, then slice off the front
							var relStart = {
								line: c.consequent[0].loc.start.line - c.loc.start.line,
								column: c.consequent[0].loc.start.column - c.loc.start.column
							};
							var source = c.source();
							var lines = c.source().split("\n").slice(relStart.line);
							lines[0] = lines[0].slice(relStart.column);
							var sourceWithoutCase = lines.join('\n');

							var attrs = { path: c.loc.path, start: c.loc.start, end: c.loc.end };
							console.log({
								attrs: attrs,
								originalSource: sourceWithoutCase
							});
						}
					}
				}
			} else if (node.type === 'ForStatement' || node.type === 'ForInStatement') {
				if (options.trace_loops) {
					node.body;
				}
			} else if (node.type === 'WhileStatement' || node.type === 'DoWhileStatement') {
				if (options.trace_loops) {
					node.body;
				}
			}
		}).toString();
	} catch (e) {
		console.log('exception during parsing', options.path, e);
		return content;
	}

	var prologue = "/* The following code has been modified by fondue to collect information about its execution. https://github.com/adobe-research/fondue */\n\n";
	prologue += options.tracer_name + '.add(' + JSON.stringify(options.path) + ', ' + extractTracePoints(content, options.path) + '); ';

	// add line break after processed in case it ends in a //-comment
	return prologue + options.tracer_name + '.traceFileEntry(); try { ' + processed + '\n } finally { ' + options.tracer_name + '.traceFileExit(); }';
};

/**
 * finds the variables that are in scope at the given line/col using the
 * provided jshintData object, which you can obtain like this:
 *
 *   jshint(src);
 *   var jshintData = jshint.data();
 *
 * by default (if includeAllLocal is not true), local variables (except for
 * parameters) in the inner-most scope will not be included. for example:
 *
 *   function foo(a) {
 *     var b;
 *     var c = function (d) {
 *       // XXX
 *       var e;
 *     }
 *   }
 *
 * if you provide a line/col at the XXX, you'll receive
 *   [a, b, c, d]    if includeAllLocal is false
 *   [a, b, c, d, e] if includeAllLocal is true
 */
function findVariablesInScope(jshintData, line, col, includeAllLocal) {
	var fInfo = jshintData.functions;

	// comparator for positions in the form { line: XXX, character: YYY }
	var compare = function (pos1, pos2) {
		var c = pos1.line - pos2.line;
		if (c == 0) {
			c = pos1.character - pos2.character;
		}
		return c;
	};

	// finds all functions in fInfo surrounding line/col
	var findContainingFunctions = function () {
		var functions = [];
		for (var i in fInfo) {
			var startsBefore = compare({ line: fInfo[i].line, character: fInfo[i].character },
										 { line: line, character: col }) <= 0;
			var endsAfter    = compare({ line: fInfo[i].last, character: fInfo[i].lastcharacter },
										 { line: line, character: col }) >= 0;
			if (startsBefore && endsAfter) {
				functions.push(fInfo[i]);
			}
		}

		// sort functions by appearance (just in case they aren't)
		functions.sort(function (a, b) {
			if (a.line !== b.line) {
				return a.line < b.line ? -1 : 1;
			}
			if (a.character !== b.character) {
				return a.character < b.character ? -1 : 1;
			}
			return 0;
		});

		return functions;
	};

	// returns all variables that are in scope (except globals) from the given list of functions
	var collectVars = function (functions) {
		var outerGroups = ['closure', 'outer', 'var', 'unused', 'param'];
		var innerGroups = ['param'];

		// add vars as keys in an object (de-dup)
		var varsO = {};
		for (var i = 0; i < functions.length; i++) {
			var newVars = [];
			var group = (!includeAllLocal && i == functions.length - 1) ? innerGroups : outerGroups;
			for (var j in group) {
				newVars = newVars.concat(functions[i][group[j]] || []);
			}
			for (var v in newVars) {
				varsO[newVars[v]] = true;
			}
		}

		// pull them out into a sorted array
		var vars = [];
		for (var i in varsO) {
			vars.push(i);
		}
		return vars.sort();
	};

	return collectVars(findContainingFunctions());
}


module.exports = {
	instrument: instrument,
	instrumentationPrefix: instrumentationPrefix,
};

})("/")
},{"fs":1,"./jshint":2,"../package.json":3,"falafel":4}],4:[function(require,module,exports){
var parse = require('esprima').parse;

module.exports = function (src, opts, fn) {
    if (typeof opts === 'function') {
        fn = opts;
        opts = {};
    }
    if (typeof src === 'object') {
        opts = src;
        src = opts.source;
        delete opts.source;
    }
    src = src || opts.source;
    opts.range = true;
    if (typeof src !== 'string') src = String(src);
    
    var ast = parse(src, opts);
    
    var result = {
        chunks : src.split(''),
        toString : function () { return result.chunks.join('') },
        inspect : function () { return result.toString() }
    };
    var index = 0;
    
    (function walk (node, parent) {
        insertHelpers(node, parent, result.chunks);
        
        Object.keys(node).forEach(function (key) {
            if (key === 'parent') return;
            
            var child = node[key];
            if (Array.isArray(child)) {
                child.forEach(function (c) {
                    if (c && typeof c.type === 'string') {
                        walk(c, node);
                    }
                });
            }
            else if (child && typeof child.type === 'string') {
                insertHelpers(child, node, result.chunks);
                walk(child, node);
            }
        });
        fn(node);
    })(ast, undefined);
    
    return result;
};
 
function insertHelpers (node, parent, chunks) {
    if (!node.range) return;
    
    node.parent = parent;
    
    node.source = function () {
        return chunks.slice(
            node.range[0], node.range[1]
        ).join('');
    };
    
    if (node.update && typeof node.update === 'object') {
        var prev = node.update;
        Object.keys(prev).forEach(function (key) {
            update[key] = prev[key];
        });
        node.update = update;
    }
    else {
        node.update = update;
    }
    
    function update (s) {
        chunks[node.range[0]] = s;
        for (var i = node.range[0] + 1; i < node.range[1]; i++) {
            chunks[i] = '';
        }
    };
}

},{"esprima":5}],5:[function(require,module,exports){
(function(){/*
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*jslint bitwise:true plusplus:true */
/*global esprima:true, define:true, exports:true, window: true,
throwError: true, createLiteral: true, generateStatement: true,
parseAssignmentExpression: true, parseBlock: true, parseExpression: true,
parseFunctionDeclaration: true, parseFunctionExpression: true,
parseFunctionSourceElements: true, parseVariableIdentifier: true,
parseLeftHandSideExpression: true,
parseStatement: true, parseSourceElement: true */

(function (root, factory) {
    'use strict';

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.esprima = {}));
    }
}(this, function (exports) {
    'use strict';

    var Token,
        TokenName,
        Syntax,
        PropertyKind,
        Messages,
        Regex,
        source,
        strict,
        index,
        lineNumber,
        lineStart,
        length,
        buffer,
        state,
        extra;

    Token = {
        BooleanLiteral: 1,
        EOF: 2,
        Identifier: 3,
        Keyword: 4,
        NullLiteral: 5,
        NumericLiteral: 6,
        Punctuator: 7,
        StringLiteral: 8
    };

    TokenName = {};
    TokenName[Token.BooleanLiteral] = 'Boolean';
    TokenName[Token.EOF] = '<end>';
    TokenName[Token.Identifier] = 'Identifier';
    TokenName[Token.Keyword] = 'Keyword';
    TokenName[Token.NullLiteral] = 'Null';
    TokenName[Token.NumericLiteral] = 'Numeric';
    TokenName[Token.Punctuator] = 'Punctuator';
    TokenName[Token.StringLiteral] = 'String';

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement'
    };

    PropertyKind = {
        Data: 1,
        Get: 2,
        Set: 4
    };

    // Error messages should be identical to V8.
    Messages = {
        UnexpectedToken:  'Unexpected token %0',
        UnexpectedNumber:  'Unexpected number',
        UnexpectedString:  'Unexpected string',
        UnexpectedIdentifier:  'Unexpected identifier',
        UnexpectedReserved:  'Unexpected reserved word',
        UnexpectedEOS:  'Unexpected end of input',
        NewlineAfterThrow:  'Illegal newline after throw',
        InvalidRegExp: 'Invalid regular expression',
        UnterminatedRegExp:  'Invalid regular expression: missing /',
        InvalidLHSInAssignment:  'Invalid left-hand side in assignment',
        InvalidLHSInForIn:  'Invalid left-hand side in for-in',
        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
        NoCatchOrFinally:  'Missing catch or finally after try',
        UnknownLabel: 'Undefined label \'%0\'',
        Redeclaration: '%0 \'%1\' has already been declared',
        IllegalContinue: 'Illegal continue statement',
        IllegalBreak: 'Illegal break statement',
        IllegalReturn: 'Illegal return statement',
        StrictModeWith:  'Strict mode code may not include a with statement',
        StrictCatchVariable:  'Catch variable may not be eval or arguments in strict mode',
        StrictVarName:  'Variable name may not be eval or arguments in strict mode',
        StrictParamName:  'Parameter name eval or arguments is not allowed in strict mode',
        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
        StrictFunctionName:  'Function name may not be eval or arguments in strict mode',
        StrictOctalLiteral:  'Octal literals are not allowed in strict mode.',
        StrictDelete:  'Delete of an unqualified identifier in strict mode.',
        StrictDuplicateProperty:  'Duplicate data property in object literal not allowed in strict mode',
        AccessorDataProperty:  'Object literal may not have data and accessor property with the same name',
        AccessorGetSet:  'Object literal may not have multiple get/set accessors with the same name',
        StrictLHSAssignment:  'Assignment to eval or arguments is not allowed in strict mode',
        StrictLHSPostfix:  'Postfix increment/decrement may not have eval or arguments operand in strict mode',
        StrictLHSPrefix:  'Prefix increment/decrement may not have eval or arguments operand in strict mode',
        StrictReservedWord:  'Use of future reserved word in strict mode'
    };

    // See also tools/generate-unicode-regex.py.
    Regex = {
        NonAsciiIdentifierStart: new RegExp('[\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]'),
        NonAsciiIdentifierPart: new RegExp('[\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u0487\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u0669\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07c0-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0\u08a2-\u08ac\u08e4-\u08fe\u0900-\u0963\u0966-\u096f\u0971-\u0977\u0979-\u097f\u0981-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09e6-\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a66-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b66-\u0b6f\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0ce6-\u0cef\u0cf1\u0cf2\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d66-\u0d6f\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e50-\u0e59\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0ed0-\u0ed9\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1049\u1050-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191c\u1920-\u192b\u1930-\u193b\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19d9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1aa7\u1b00-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1bf3\u1c00-\u1c37\u1c40-\u1c49\u1c4d-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1d00-\u1de6\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200c\u200d\u203f\u2040\u2054\u2071\u207f\u2090-\u209c\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005-\u3007\u3021-\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua62b\ua640-\ua66f\ua674-\ua67d\ua67f-\ua697\ua69f-\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua827\ua840-\ua873\ua880-\ua8c4\ua8d0-\ua8d9\ua8e0-\ua8f7\ua8fb\ua900-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf-\ua9d9\uaa00-\uaa36\uaa40-\uaa4d\uaa50-\uaa59\uaa60-\uaa76\uaa7a\uaa7b\uaa80-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabea\uabec\uabed\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\ufe70-\ufe74\ufe76-\ufefc\uff10-\uff19\uff21-\uff3a\uff3f\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]')
    };

    // Ensure the condition is true, otherwise throw an error.
    // This is only to have a better contract semantic, i.e. another safety net
    // to catch a logic error. The condition shall be fulfilled in normal case.
    // Do NOT use this to enforce a certain condition on any user input.

    function assert(condition, message) {
        if (!condition) {
            throw new Error('ASSERT: ' + message);
        }
    }

    function sliceSource(from, to) {
        return source.slice(from, to);
    }

    if (typeof 'esprima'[0] === 'undefined') {
        sliceSource = function sliceArraySource(from, to) {
            return source.slice(from, to).join('');
        };
    }

    function isDecimalDigit(ch) {
        return '0123456789'.indexOf(ch) >= 0;
    }

    function isHexDigit(ch) {
        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
    }

    function isOctalDigit(ch) {
        return '01234567'.indexOf(ch) >= 0;
    }


    // 7.2 White Space

    function isWhiteSpace(ch) {
        return (ch === ' ') || (ch === '\u0009') || (ch === '\u000B') ||
            (ch === '\u000C') || (ch === '\u00A0') ||
            (ch.charCodeAt(0) >= 0x1680 &&
             '\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\uFEFF'.indexOf(ch) >= 0);
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return (ch === '\n' || ch === '\r' || ch === '\u2028' || ch === '\u2029');
    }

    // 7.6 Identifier Names and Identifiers

    function isIdentifierStart(ch) {
        return (ch === '$') || (ch === '_') || (ch === '\\') ||
            (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') ||
            ((ch.charCodeAt(0) >= 0x80) && Regex.NonAsciiIdentifierStart.test(ch));
    }

    function isIdentifierPart(ch) {
        return (ch === '$') || (ch === '_') || (ch === '\\') ||
            (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') ||
            ((ch >= '0') && (ch <= '9')) ||
            ((ch.charCodeAt(0) >= 0x80) && Regex.NonAsciiIdentifierPart.test(ch));
    }

    // 7.6.1.2 Future Reserved Words

    function isFutureReservedWord(id) {
        switch (id) {

        // Future reserved words.
        case 'class':
        case 'enum':
        case 'export':
        case 'extends':
        case 'import':
        case 'super':
            return true;
        }

        return false;
    }

    function isStrictModeReservedWord(id) {
        switch (id) {

        // Strict Mode reserved words.
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'yield':
        case 'let':
            return true;
        }

        return false;
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    // 7.6.1.1 Keywords

    function isKeyword(id) {
        var keyword = false;
        switch (id.length) {
        case 2:
            keyword = (id === 'if') || (id === 'in') || (id === 'do');
            break;
        case 3:
            keyword = (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
            break;
        case 4:
            keyword = (id === 'this') || (id === 'else') || (id === 'case') || (id === 'void') || (id === 'with');
            break;
        case 5:
            keyword = (id === 'while') || (id === 'break') || (id === 'catch') || (id === 'throw');
            break;
        case 6:
            keyword = (id === 'return') || (id === 'typeof') || (id === 'delete') || (id === 'switch');
            break;
        case 7:
            keyword = (id === 'default') || (id === 'finally');
            break;
        case 8:
            keyword = (id === 'function') || (id === 'continue') || (id === 'debugger');
            break;
        case 10:
            keyword = (id === 'instanceof');
            break;
        }

        if (keyword) {
            return true;
        }

        switch (id) {
        // Future reserved words.
        // 'const' is specialized as Keyword in V8.
        case 'const':
            return true;

        // For compatiblity to SpiderMonkey and ES.next
        case 'yield':
        case 'let':
            return true;
        }

        if (strict && isStrictModeReservedWord(id)) {
            return true;
        }

        return isFutureReservedWord(id);
    }

    // 7.4 Comments

    function skipComment() {
        var ch, blockComment, lineComment;

        blockComment = false;
        lineComment = false;

        while (index < length) {
            ch = source[index];

            if (lineComment) {
                ch = source[index++];
                if (isLineTerminator(ch)) {
                    lineComment = false;
                    if (ch === '\r' && source[index] === '\n') {
                        ++index;
                    }
                    ++lineNumber;
                    lineStart = index;
                }
            } else if (blockComment) {
                if (isLineTerminator(ch)) {
                    if (ch === '\r' && source[index + 1] === '\n') {
                        ++index;
                    }
                    ++lineNumber;
                    ++index;
                    lineStart = index;
                    if (index >= length) {
                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                    }
                } else {
                    ch = source[index++];
                    if (index >= length) {
                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                    }
                    if (ch === '*') {
                        ch = source[index];
                        if (ch === '/') {
                            ++index;
                            blockComment = false;
                        }
                    }
                }
            } else if (ch === '/') {
                ch = source[index + 1];
                if (ch === '/') {
                    index += 2;
                    lineComment = true;
                } else if (ch === '*') {
                    index += 2;
                    blockComment = true;
                    if (index >= length) {
                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                    }
                } else {
                    break;
                }
            } else if (isWhiteSpace(ch)) {
                ++index;
            } else if (isLineTerminator(ch)) {
                ++index;
                if (ch ===  '\r' && source[index] === '\n') {
                    ++index;
                }
                ++lineNumber;
                lineStart = index;
            } else {
                break;
            }
        }
    }

    function scanHexEscape(prefix) {
        var i, len, ch, code = 0;

        len = (prefix === 'u') ? 4 : 2;
        for (i = 0; i < len; ++i) {
            if (index < length && isHexDigit(source[index])) {
                ch = source[index++];
                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
            } else {
                return '';
            }
        }
        return String.fromCharCode(code);
    }

    function scanIdentifier() {
        var ch, start, id, restore;

        ch = source[index];
        if (!isIdentifierStart(ch)) {
            return;
        }

        start = index;
        if (ch === '\\') {
            ++index;
            if (source[index] !== 'u') {
                return;
            }
            ++index;
            restore = index;
            ch = scanHexEscape('u');
            if (ch) {
                if (ch === '\\' || !isIdentifierStart(ch)) {
                    return;
                }
                id = ch;
            } else {
                index = restore;
                id = 'u';
            }
        } else {
            id = source[index++];
        }

        while (index < length) {
            ch = source[index];
            if (!isIdentifierPart(ch)) {
                break;
            }
            if (ch === '\\') {
                ++index;
                if (source[index] !== 'u') {
                    return;
                }
                ++index;
                restore = index;
                ch = scanHexEscape('u');
                if (ch) {
                    if (ch === '\\' || !isIdentifierPart(ch)) {
                        return;
                    }
                    id += ch;
                } else {
                    index = restore;
                    id += 'u';
                }
            } else {
                id += source[index++];
            }
        }

        // There is no keyword or literal with only one character.
        // Thus, it must be an identifier.
        if (id.length === 1) {
            return {
                type: Token.Identifier,
                value: id,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }

        if (isKeyword(id)) {
            return {
                type: Token.Keyword,
                value: id,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }

        // 7.8.1 Null Literals

        if (id === 'null') {
            return {
                type: Token.NullLiteral,
                value: id,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }

        // 7.8.2 Boolean Literals

        if (id === 'true' || id === 'false') {
            return {
                type: Token.BooleanLiteral,
                value: id,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }

        return {
            type: Token.Identifier,
            value: id,
            lineNumber: lineNumber,
            lineStart: lineStart,
            range: [start, index]
        };
    }

    // 7.7 Punctuators

    function scanPunctuator() {
        var start = index,
            ch1 = source[index],
            ch2,
            ch3,
            ch4;

        // Check for most common single-character punctuators.

        if (ch1 === ';' || ch1 === '{' || ch1 === '}') {
            ++index;
            return {
                type: Token.Punctuator,
                value: ch1,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }

        if (ch1 === ',' || ch1 === '(' || ch1 === ')') {
            ++index;
            return {
                type: Token.Punctuator,
                value: ch1,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }

        // Dot (.) can also start a floating-point number, hence the need
        // to check the next character.

        ch2 = source[index + 1];
        if (ch1 === '.' && !isDecimalDigit(ch2)) {
            return {
                type: Token.Punctuator,
                value: source[index++],
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }

        // Peek more characters.

        ch3 = source[index + 2];
        ch4 = source[index + 3];

        // 4-character punctuator: >>>=

        if (ch1 === '>' && ch2 === '>' && ch3 === '>') {
            if (ch4 === '=') {
                index += 4;
                return {
                    type: Token.Punctuator,
                    value: '>>>=',
                    lineNumber: lineNumber,
                    lineStart: lineStart,
                    range: [start, index]
                };
            }
        }

        // 3-character punctuators: === !== >>> <<= >>=

        if (ch1 === '=' && ch2 === '=' && ch3 === '=') {
            index += 3;
            return {
                type: Token.Punctuator,
                value: '===',
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }

        if (ch1 === '!' && ch2 === '=' && ch3 === '=') {
            index += 3;
            return {
                type: Token.Punctuator,
                value: '!==',
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }

        if (ch1 === '>' && ch2 === '>' && ch3 === '>') {
            index += 3;
            return {
                type: Token.Punctuator,
                value: '>>>',
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }

        if (ch1 === '<' && ch2 === '<' && ch3 === '=') {
            index += 3;
            return {
                type: Token.Punctuator,
                value: '<<=',
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }

        if (ch1 === '>' && ch2 === '>' && ch3 === '=') {
            index += 3;
            return {
                type: Token.Punctuator,
                value: '>>=',
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }

        // 2-character punctuators: <= >= == != ++ -- << >> && ||
        // += -= *= %= &= |= ^= /=

        if (ch2 === '=') {
            if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
                index += 2;
                return {
                    type: Token.Punctuator,
                    value: ch1 + ch2,
                    lineNumber: lineNumber,
                    lineStart: lineStart,
                    range: [start, index]
                };
            }
        }

        if (ch1 === ch2 && ('+-<>&|'.indexOf(ch1) >= 0)) {
            if ('+-<>&|'.indexOf(ch2) >= 0) {
                index += 2;
                return {
                    type: Token.Punctuator,
                    value: ch1 + ch2,
                    lineNumber: lineNumber,
                    lineStart: lineStart,
                    range: [start, index]
                };
            }
        }

        // The remaining 1-character punctuators.

        if ('[]<>+-*%&|^!~?:=/'.indexOf(ch1) >= 0) {
            return {
                type: Token.Punctuator,
                value: source[index++],
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [start, index]
            };
        }
    }

    // 7.8.3 Numeric Literals

    function scanNumericLiteral() {
        var number, start, ch;

        ch = source[index];
        assert(isDecimalDigit(ch) || (ch === '.'),
            'Numeric literal must start with a decimal digit or a decimal point');

        start = index;
        number = '';
        if (ch !== '.') {
            number = source[index++];
            ch = source[index];

            // Hex number starts with '0x'.
            // Octal number starts with '0'.
            if (number === '0') {
                if (ch === 'x' || ch === 'X') {
                    number += source[index++];
                    while (index < length) {
                        ch = source[index];
                        if (!isHexDigit(ch)) {
                            break;
                        }
                        number += source[index++];
                    }

                    if (number.length <= 2) {
                        // only 0x
                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                    }

                    if (index < length) {
                        ch = source[index];
                        if (isIdentifierStart(ch)) {
                            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                        }
                    }
                    return {
                        type: Token.NumericLiteral,
                        value: parseInt(number, 16),
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        range: [start, index]
                    };
                } else if (isOctalDigit(ch)) {
                    number += source[index++];
                    while (index < length) {
                        ch = source[index];
                        if (!isOctalDigit(ch)) {
                            break;
                        }
                        number += source[index++];
                    }

                    if (index < length) {
                        ch = source[index];
                        if (isIdentifierStart(ch) || isDecimalDigit(ch)) {
                            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                        }
                    }
                    return {
                        type: Token.NumericLiteral,
                        value: parseInt(number, 8),
                        octal: true,
                        lineNumber: lineNumber,
                        lineStart: lineStart,
                        range: [start, index]
                    };
                }

                // decimal number starts with '0' such as '09' is illegal.
                if (isDecimalDigit(ch)) {
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
            }

            while (index < length) {
                ch = source[index];
                if (!isDecimalDigit(ch)) {
                    break;
                }
                number += source[index++];
            }
        }

        if (ch === '.') {
            number += source[index++];
            while (index < length) {
                ch = source[index];
                if (!isDecimalDigit(ch)) {
                    break;
                }
                number += source[index++];
            }
        }

        if (ch === 'e' || ch === 'E') {
            number += source[index++];

            ch = source[index];
            if (ch === '+' || ch === '-') {
                number += source[index++];
            }

            ch = source[index];
            if (isDecimalDigit(ch)) {
                number += source[index++];
                while (index < length) {
                    ch = source[index];
                    if (!isDecimalDigit(ch)) {
                        break;
                    }
                    number += source[index++];
                }
            } else {
                ch = 'character ' + ch;
                if (index >= length) {
                    ch = '<end>';
                }
                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
        }

        if (index < length) {
            ch = source[index];
            if (isIdentifierStart(ch)) {
                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
        }

        return {
            type: Token.NumericLiteral,
            value: parseFloat(number),
            lineNumber: lineNumber,
            lineStart: lineStart,
            range: [start, index]
        };
    }

    // 7.8.4 String Literals

    function scanStringLiteral() {
        var str = '', quote, start, ch, code, unescaped, restore, octal = false;

        quote = source[index];
        assert((quote === '\'' || quote === '"'),
            'String literal must starts with a quote');

        start = index;
        ++index;

        while (index < length) {
            ch = source[index++];

            if (ch === quote) {
                quote = '';
                break;
            } else if (ch === '\\') {
                ch = source[index++];
                if (!isLineTerminator(ch)) {
                    switch (ch) {
                    case 'n':
                        str += '\n';
                        break;
                    case 'r':
                        str += '\r';
                        break;
                    case 't':
                        str += '\t';
                        break;
                    case 'u':
                    case 'x':
                        restore = index;
                        unescaped = scanHexEscape(ch);
                        if (unescaped) {
                            str += unescaped;
                        } else {
                            index = restore;
                            str += ch;
                        }
                        break;
                    case 'b':
                        str += '\b';
                        break;
                    case 'f':
                        str += '\f';
                        break;
                    case 'v':
                        str += '\v';
                        break;

                    default:
                        if (isOctalDigit(ch)) {
                            code = '01234567'.indexOf(ch);

                            // \0 is not octal escape sequence
                            if (code !== 0) {
                                octal = true;
                            }

                            if (index < length && isOctalDigit(source[index])) {
                                octal = true;
                                code = code * 8 + '01234567'.indexOf(source[index++]);

                                // 3 digits are only allowed when string starts
                                // with 0, 1, 2, 3
                                if ('0123'.indexOf(ch) >= 0 &&
                                        index < length &&
                                        isOctalDigit(source[index])) {
                                    code = code * 8 + '01234567'.indexOf(source[index++]);
                                }
                            }
                            str += String.fromCharCode(code);
                        } else {
                            str += ch;
                        }
                        break;
                    }
                } else {
                    ++lineNumber;
                    if (ch ===  '\r' && source[index] === '\n') {
                        ++index;
                    }
                }
            } else if (isLineTerminator(ch)) {
                break;
            } else {
                str += ch;
            }
        }

        if (quote !== '') {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.StringLiteral,
            value: str,
            octal: octal,
            lineNumber: lineNumber,
            lineStart: lineStart,
            range: [start, index]
        };
    }

    function scanRegExp() {
        var str = '', ch, start, pattern, flags, value, classMarker = false, restore, terminated = false;

        buffer = null;
        skipComment();

        start = index;
        ch = source[index];
        assert(ch === '/', 'Regular expression literal must start with a slash');
        str = source[index++];

        while (index < length) {
            ch = source[index++];
            str += ch;
            if (classMarker) {
                if (ch === ']') {
                    classMarker = false;
                }
            } else {
                if (ch === '\\') {
                    ch = source[index++];
                    // ECMA-262 7.8.5
                    if (isLineTerminator(ch)) {
                        throwError({}, Messages.UnterminatedRegExp);
                    }
                    str += ch;
                } else if (ch === '/') {
                    terminated = true;
                    break;
                } else if (ch === '[') {
                    classMarker = true;
                } else if (isLineTerminator(ch)) {
                    throwError({}, Messages.UnterminatedRegExp);
                }
            }
        }

        if (!terminated) {
            throwError({}, Messages.UnterminatedRegExp);
        }

        // Exclude leading and trailing slash.
        pattern = str.substr(1, str.length - 2);

        flags = '';
        while (index < length) {
            ch = source[index];
            if (!isIdentifierPart(ch)) {
                break;
            }

            ++index;
            if (ch === '\\' && index < length) {
                ch = source[index];
                if (ch === 'u') {
                    ++index;
                    restore = index;
                    ch = scanHexEscape('u');
                    if (ch) {
                        flags += ch;
                        str += '\\u';
                        for (; restore < index; ++restore) {
                            str += source[restore];
                        }
                    } else {
                        index = restore;
                        flags += 'u';
                        str += '\\u';
                    }
                } else {
                    str += '\\';
                }
            } else {
                flags += ch;
                str += ch;
            }
        }

        try {
            value = new RegExp(pattern, flags);
        } catch (e) {
            throwError({}, Messages.InvalidRegExp);
        }

        return {
            literal: str,
            value: value,
            range: [start, index]
        };
    }

    function isIdentifierName(token) {
        return token.type === Token.Identifier ||
            token.type === Token.Keyword ||
            token.type === Token.BooleanLiteral ||
            token.type === Token.NullLiteral;
    }

    function advance() {
        var ch, token;

        skipComment();

        if (index >= length) {
            return {
                type: Token.EOF,
                lineNumber: lineNumber,
                lineStart: lineStart,
                range: [index, index]
            };
        }

        token = scanPunctuator();
        if (typeof token !== 'undefined') {
            return token;
        }

        ch = source[index];

        if (ch === '\'' || ch === '"') {
            return scanStringLiteral();
        }

        if (ch === '.' || isDecimalDigit(ch)) {
            return scanNumericLiteral();
        }

        token = scanIdentifier();
        if (typeof token !== 'undefined') {
            return token;
        }

        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
    }

    function lex() {
        var token;

        if (buffer) {
            index = buffer.range[1];
            lineNumber = buffer.lineNumber;
            lineStart = buffer.lineStart;
            token = buffer;
            buffer = null;
            return token;
        }

        buffer = null;
        return advance();
    }

    function lookahead() {
        var pos, line, start;

        if (buffer !== null) {
            return buffer;
        }

        pos = index;
        line = lineNumber;
        start = lineStart;
        buffer = advance();
        index = pos;
        lineNumber = line;
        lineStart = start;

        return buffer;
    }

    // Return true if there is a line terminator before the next token.

    function peekLineTerminator() {
        var pos, line, start, found;

        pos = index;
        line = lineNumber;
        start = lineStart;
        skipComment();
        found = lineNumber !== line;
        index = pos;
        lineNumber = line;
        lineStart = start;

        return found;
    }

    // Throw an exception

    function throwError(token, messageFormat) {
        var error,
            args = Array.prototype.slice.call(arguments, 2),
            msg = messageFormat.replace(
                /%(\d)/g,
                function (whole, index) {
                    return args[index] || '';
                }
            );

        if (typeof token.lineNumber === 'number') {
            error = new Error('Line ' + token.lineNumber + ': ' + msg);
            error.index = token.range[0];
            error.lineNumber = token.lineNumber;
            error.column = token.range[0] - lineStart + 1;
        } else {
            error = new Error('Line ' + lineNumber + ': ' + msg);
            error.index = index;
            error.lineNumber = lineNumber;
            error.column = index - lineStart + 1;
        }

        throw error;
    }

    function throwErrorTolerant() {
        try {
            throwError.apply(null, arguments);
        } catch (e) {
            if (extra.errors) {
                extra.errors.push(e);
            } else {
                throw e;
            }
        }
    }


    // Throw an exception because of the token.

    function throwUnexpected(token) {
        if (token.type === Token.EOF) {
            throwError(token, Messages.UnexpectedEOS);
        }

        if (token.type === Token.NumericLiteral) {
            throwError(token, Messages.UnexpectedNumber);
        }

        if (token.type === Token.StringLiteral) {
            throwError(token, Messages.UnexpectedString);
        }

        if (token.type === Token.Identifier) {
            throwError(token, Messages.UnexpectedIdentifier);
        }

        if (token.type === Token.Keyword) {
            if (isFutureReservedWord(token.value)) {
                throwError(token, Messages.UnexpectedReserved);
            } else if (strict && isStrictModeReservedWord(token.value)) {
                throwErrorTolerant(token, Messages.StrictReservedWord);
                return;
            }
            throwError(token, Messages.UnexpectedToken, token.value);
        }

        // BooleanLiteral, NullLiteral, or Punctuator.
        throwError(token, Messages.UnexpectedToken, token.value);
    }

    // Expect the next token to match the specified punctuator.
    // If not, an exception will be thrown.

    function expect(value) {
        var token = lex();
        if (token.type !== Token.Punctuator || token.value !== value) {
            throwUnexpected(token);
        }
    }

    // Expect the next token to match the specified keyword.
    // If not, an exception will be thrown.

    function expectKeyword(keyword) {
        var token = lex();
        if (token.type !== Token.Keyword || token.value !== keyword) {
            throwUnexpected(token);
        }
    }

    // Return true if the next token matches the specified punctuator.

    function match(value) {
        var token = lookahead();
        return token.type === Token.Punctuator && token.value === value;
    }

    // Return true if the next token matches the specified keyword

    function matchKeyword(keyword) {
        var token = lookahead();
        return token.type === Token.Keyword && token.value === keyword;
    }

    // Return true if the next token is an assignment operator

    function matchAssign() {
        var token = lookahead(),
            op = token.value;

        if (token.type !== Token.Punctuator) {
            return false;
        }
        return op === '=' ||
            op === '*=' ||
            op === '/=' ||
            op === '%=' ||
            op === '+=' ||
            op === '-=' ||
            op === '<<=' ||
            op === '>>=' ||
            op === '>>>=' ||
            op === '&=' ||
            op === '^=' ||
            op === '|=';
    }

    function consumeSemicolon() {
        var token, line;

        // Catch the very common case first.
        if (source[index] === ';') {
            lex();
            return;
        }

        line = lineNumber;
        skipComment();
        if (lineNumber !== line) {
            return;
        }

        if (match(';')) {
            lex();
            return;
        }

        token = lookahead();
        if (token.type !== Token.EOF && !match('}')) {
            throwUnexpected(token);
        }
        return;
    }

    // Return true if provided expression is LeftHandSideExpression

    function isLeftHandSide(expr) {
        return expr.type === Syntax.Identifier || expr.type === Syntax.MemberExpression;
    }

    // 11.1.4 Array Initialiser

    function parseArrayInitialiser() {
        var elements = [];

        expect('[');

        while (!match(']')) {
            if (match(',')) {
                lex();
                elements.push(null);
            } else {
                elements.push(parseAssignmentExpression());

                if (!match(']')) {
                    expect(',');
                }
            }
        }

        expect(']');

        return {
            type: Syntax.ArrayExpression,
            elements: elements
        };
    }

    // 11.1.5 Object Initialiser

    function parsePropertyFunction(param, first) {
        var previousStrict, body;

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (first && strict && isRestrictedWord(param[0].name)) {
            throwErrorTolerant(first, Messages.StrictParamName);
        }
        strict = previousStrict;

        return {
            type: Syntax.FunctionExpression,
            id: null,
            params: param,
            defaults: [],
            body: body,
            rest: null,
            generator: false,
            expression: false
        };
    }

    function parseObjectPropertyKey() {
        var token = lex();

        // Note: This function is called only from parseObjectProperty(), where
        // EOF and Punctuator tokens are already filtered out.

        if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
            if (strict && token.octal) {
                throwErrorTolerant(token, Messages.StrictOctalLiteral);
            }
            return createLiteral(token);
        }

        return {
            type: Syntax.Identifier,
            name: token.value
        };
    }

    function parseObjectProperty() {
        var token, key, id, param;

        token = lookahead();

        if (token.type === Token.Identifier) {

            id = parseObjectPropertyKey();

            // Property Assignment: Getter and Setter.

            if (token.value === 'get' && !match(':')) {
                key = parseObjectPropertyKey();
                expect('(');
                expect(')');
                return {
                    type: Syntax.Property,
                    key: key,
                    value: parsePropertyFunction([]),
                    kind: 'get'
                };
            } else if (token.value === 'set' && !match(':')) {
                key = parseObjectPropertyKey();
                expect('(');
                token = lookahead();
                if (token.type !== Token.Identifier) {
                    throwUnexpected(lex());
                }
                param = [ parseVariableIdentifier() ];
                expect(')');
                return {
                    type: Syntax.Property,
                    key: key,
                    value: parsePropertyFunction(param, token),
                    kind: 'set'
                };
            } else {
                expect(':');
                return {
                    type: Syntax.Property,
                    key: id,
                    value: parseAssignmentExpression(),
                    kind: 'init'
                };
            }
        } else if (token.type === Token.EOF || token.type === Token.Punctuator) {
            throwUnexpected(token);
        } else {
            key = parseObjectPropertyKey();
            expect(':');
            return {
                type: Syntax.Property,
                key: key,
                value: parseAssignmentExpression(),
                kind: 'init'
            };
        }
    }

    function parseObjectInitialiser() {
        var properties = [], property, name, kind, map = {}, toString = String;

        expect('{');

        while (!match('}')) {
            property = parseObjectProperty();

            if (property.key.type === Syntax.Identifier) {
                name = property.key.name;
            } else {
                name = toString(property.key.value);
            }
            kind = (property.kind === 'init') ? PropertyKind.Data : (property.kind === 'get') ? PropertyKind.Get : PropertyKind.Set;
            if (Object.prototype.hasOwnProperty.call(map, name)) {
                if (map[name] === PropertyKind.Data) {
                    if (strict && kind === PropertyKind.Data) {
                        throwErrorTolerant({}, Messages.StrictDuplicateProperty);
                    } else if (kind !== PropertyKind.Data) {
                        throwErrorTolerant({}, Messages.AccessorDataProperty);
                    }
                } else {
                    if (kind === PropertyKind.Data) {
                        throwErrorTolerant({}, Messages.AccessorDataProperty);
                    } else if (map[name] & kind) {
                        throwErrorTolerant({}, Messages.AccessorGetSet);
                    }
                }
                map[name] |= kind;
            } else {
                map[name] = kind;
            }

            properties.push(property);

            if (!match('}')) {
                expect(',');
            }
        }

        expect('}');

        return {
            type: Syntax.ObjectExpression,
            properties: properties
        };
    }

    // 11.1.6 The Grouping Operator

    function parseGroupExpression() {
        var expr;

        expect('(');

        expr = parseExpression();

        expect(')');

        return expr;
    }


    // 11.1 Primary Expressions

    function parsePrimaryExpression() {
        var expr,
            token = lookahead(),
            type = token.type;

        if (type === Token.Identifier) {
            return {
                type: Syntax.Identifier,
                name: lex().value
            };
        }

        if (type === Token.StringLiteral || type === Token.NumericLiteral) {
            if (strict && token.octal) {
                throwErrorTolerant(token, Messages.StrictOctalLiteral);
            }
            return createLiteral(lex());
        }

        if (type === Token.Keyword) {
            if (matchKeyword('this')) {
                lex();
                return {
                    type: Syntax.ThisExpression
                };
            }

            if (matchKeyword('function')) {
                return parseFunctionExpression();
            }
        }

        if (type === Token.BooleanLiteral) {
            lex();
            token.value = (token.value === 'true');
            return createLiteral(token);
        }

        if (type === Token.NullLiteral) {
            lex();
            token.value = null;
            return createLiteral(token);
        }

        if (match('[')) {
            return parseArrayInitialiser();
        }

        if (match('{')) {
            return parseObjectInitialiser();
        }

        if (match('(')) {
            return parseGroupExpression();
        }

        if (match('/') || match('/=')) {
            return createLiteral(scanRegExp());
        }

        return throwUnexpected(lex());
    }

    // 11.2 Left-Hand-Side Expressions

    function parseArguments() {
        var args = [];

        expect('(');

        if (!match(')')) {
            while (index < length) {
                args.push(parseAssignmentExpression());
                if (match(')')) {
                    break;
                }
                expect(',');
            }
        }

        expect(')');

        return args;
    }

    function parseNonComputedProperty() {
        var token = lex();

        if (!isIdentifierName(token)) {
            throwUnexpected(token);
        }

        return {
            type: Syntax.Identifier,
            name: token.value
        };
    }

    function parseNonComputedMember() {
        expect('.');

        return parseNonComputedProperty();
    }

    function parseComputedMember() {
        var expr;

        expect('[');

        expr = parseExpression();

        expect(']');

        return expr;
    }

    function parseNewExpression() {
        var expr;

        expectKeyword('new');

        expr = {
            type: Syntax.NewExpression,
            callee: parseLeftHandSideExpression(),
            'arguments': []
        };

        if (match('(')) {
            expr['arguments'] = parseArguments();
        }

        return expr;
    }

    function parseLeftHandSideExpressionAllowCall() {
        var expr;

        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();

        while (match('.') || match('[') || match('(')) {
            if (match('(')) {
                expr = {
                    type: Syntax.CallExpression,
                    callee: expr,
                    'arguments': parseArguments()
                };
            } else if (match('[')) {
                expr = {
                    type: Syntax.MemberExpression,
                    computed: true,
                    object: expr,
                    property: parseComputedMember()
                };
            } else {
                expr = {
                    type: Syntax.MemberExpression,
                    computed: false,
                    object: expr,
                    property: parseNonComputedMember()
                };
            }
        }

        return expr;
    }


    function parseLeftHandSideExpression() {
        var expr;

        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();

        while (match('.') || match('[')) {
            if (match('[')) {
                expr = {
                    type: Syntax.MemberExpression,
                    computed: true,
                    object: expr,
                    property: parseComputedMember()
                };
            } else {
                expr = {
                    type: Syntax.MemberExpression,
                    computed: false,
                    object: expr,
                    property: parseNonComputedMember()
                };
            }
        }

        return expr;
    }

    // 11.3 Postfix Expressions

    function parsePostfixExpression() {
        var expr = parseLeftHandSideExpressionAllowCall(), token;

        token = lookahead();
        if (token.type !== Token.Punctuator) {
            return expr;
        }

        if ((match('++') || match('--')) && !peekLineTerminator()) {
            // 11.3.1, 11.3.2
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                throwErrorTolerant({}, Messages.StrictLHSPostfix);
            }

            if (!isLeftHandSide(expr)) {
                throwError({}, Messages.InvalidLHSInAssignment);
            }

            expr = {
                type: Syntax.UpdateExpression,
                operator: lex().value,
                argument: expr,
                prefix: false
            };
        }

        return expr;
    }

    // 11.4 Unary Operators

    function parseUnaryExpression() {
        var token, expr;

        token = lookahead();
        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
            return parsePostfixExpression();
        }

        if (match('++') || match('--')) {
            token = lex();
            expr = parseUnaryExpression();
            // 11.4.4, 11.4.5
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                throwErrorTolerant({}, Messages.StrictLHSPrefix);
            }

            if (!isLeftHandSide(expr)) {
                throwError({}, Messages.InvalidLHSInAssignment);
            }

            expr = {
                type: Syntax.UpdateExpression,
                operator: token.value,
                argument: expr,
                prefix: true
            };
            return expr;
        }

        if (match('+') || match('-') || match('~') || match('!')) {
            expr = {
                type: Syntax.UnaryExpression,
                operator: lex().value,
                argument: parseUnaryExpression()
            };
            return expr;
        }

        if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
            expr = {
                type: Syntax.UnaryExpression,
                operator: lex().value,
                argument: parseUnaryExpression()
            };
            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
                throwErrorTolerant({}, Messages.StrictDelete);
            }
            return expr;
        }

        return parsePostfixExpression();
    }

    // 11.5 Multiplicative Operators

    function parseMultiplicativeExpression() {
        var expr = parseUnaryExpression();

        while (match('*') || match('/') || match('%')) {
            expr = {
                type: Syntax.BinaryExpression,
                operator: lex().value,
                left: expr,
                right: parseUnaryExpression()
            };
        }

        return expr;
    }

    // 11.6 Additive Operators

    function parseAdditiveExpression() {
        var expr = parseMultiplicativeExpression();

        while (match('+') || match('-')) {
            expr = {
                type: Syntax.BinaryExpression,
                operator: lex().value,
                left: expr,
                right: parseMultiplicativeExpression()
            };
        }

        return expr;
    }

    // 11.7 Bitwise Shift Operators

    function parseShiftExpression() {
        var expr = parseAdditiveExpression();

        while (match('<<') || match('>>') || match('>>>')) {
            expr = {
                type: Syntax.BinaryExpression,
                operator: lex().value,
                left: expr,
                right: parseAdditiveExpression()
            };
        }

        return expr;
    }
    // 11.8 Relational Operators

    function parseRelationalExpression() {
        var expr, previousAllowIn;

        previousAllowIn = state.allowIn;
        state.allowIn = true;

        expr = parseShiftExpression();

        while (match('<') || match('>') || match('<=') || match('>=') || (previousAllowIn && matchKeyword('in')) || matchKeyword('instanceof')) {
            expr = {
                type: Syntax.BinaryExpression,
                operator: lex().value,
                left: expr,
                right: parseShiftExpression()
            };
        }

        state.allowIn = previousAllowIn;
        return expr;
    }

    // 11.9 Equality Operators

    function parseEqualityExpression() {
        var expr = parseRelationalExpression();

        while (match('==') || match('!=') || match('===') || match('!==')) {
            expr = {
                type: Syntax.BinaryExpression,
                operator: lex().value,
                left: expr,
                right: parseRelationalExpression()
            };
        }

        return expr;
    }

    // 11.10 Binary Bitwise Operators

    function parseBitwiseANDExpression() {
        var expr = parseEqualityExpression();

        while (match('&')) {
            lex();
            expr = {
                type: Syntax.BinaryExpression,
                operator: '&',
                left: expr,
                right: parseEqualityExpression()
            };
        }

        return expr;
    }

    function parseBitwiseXORExpression() {
        var expr = parseBitwiseANDExpression();

        while (match('^')) {
            lex();
            expr = {
                type: Syntax.BinaryExpression,
                operator: '^',
                left: expr,
                right: parseBitwiseANDExpression()
            };
        }

        return expr;
    }

    function parseBitwiseORExpression() {
        var expr = parseBitwiseXORExpression();

        while (match('|')) {
            lex();
            expr = {
                type: Syntax.BinaryExpression,
                operator: '|',
                left: expr,
                right: parseBitwiseXORExpression()
            };
        }

        return expr;
    }

    // 11.11 Binary Logical Operators

    function parseLogicalANDExpression() {
        var expr = parseBitwiseORExpression();

        while (match('&&')) {
            lex();
            expr = {
                type: Syntax.LogicalExpression,
                operator: '&&',
                left: expr,
                right: parseBitwiseORExpression()
            };
        }

        return expr;
    }

    function parseLogicalORExpression() {
        var expr = parseLogicalANDExpression();

        while (match('||')) {
            lex();
            expr = {
                type: Syntax.LogicalExpression,
                operator: '||',
                left: expr,
                right: parseLogicalANDExpression()
            };
        }

        return expr;
    }

    // 11.12 Conditional Operator

    function parseConditionalExpression() {
        var expr, previousAllowIn, consequent;

        expr = parseLogicalORExpression();

        if (match('?')) {
            lex();
            previousAllowIn = state.allowIn;
            state.allowIn = true;
            consequent = parseAssignmentExpression();
            state.allowIn = previousAllowIn;
            expect(':');

            expr = {
                type: Syntax.ConditionalExpression,
                test: expr,
                consequent: consequent,
                alternate: parseAssignmentExpression()
            };
        }

        return expr;
    }

    // 11.13 Assignment Operators

    function parseAssignmentExpression() {
        var token, expr;

        token = lookahead();
        expr = parseConditionalExpression();

        if (matchAssign()) {
            // LeftHandSideExpression
            if (!isLeftHandSide(expr)) {
                throwError({}, Messages.InvalidLHSInAssignment);
            }

            // 11.13.1
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                throwErrorTolerant(token, Messages.StrictLHSAssignment);
            }

            expr = {
                type: Syntax.AssignmentExpression,
                operator: lex().value,
                left: expr,
                right: parseAssignmentExpression()
            };
        }

        return expr;
    }

    // 11.14 Comma Operator

    function parseExpression() {
        var expr = parseAssignmentExpression();

        if (match(',')) {
            expr = {
                type: Syntax.SequenceExpression,
                expressions: [ expr ]
            };

            while (index < length) {
                if (!match(',')) {
                    break;
                }
                lex();
                expr.expressions.push(parseAssignmentExpression());
            }

        }
        return expr;
    }

    // 12.1 Block

    function parseStatementList() {
        var list = [],
            statement;

        while (index < length) {
            if (match('}')) {
                break;
            }
            statement = parseSourceElement();
            if (typeof statement === 'undefined') {
                break;
            }
            list.push(statement);
        }

        return list;
    }

    function parseBlock() {
        var block;

        expect('{');

        block = parseStatementList();

        expect('}');

        return {
            type: Syntax.BlockStatement,
            body: block
        };
    }

    // 12.2 Variable Statement

    function parseVariableIdentifier() {
        var token = lex();

        if (token.type !== Token.Identifier) {
            throwUnexpected(token);
        }

        return {
            type: Syntax.Identifier,
            name: token.value
        };
    }

    function parseVariableDeclaration(kind) {
        var id = parseVariableIdentifier(),
            init = null;

        // 12.2.1
        if (strict && isRestrictedWord(id.name)) {
            throwErrorTolerant({}, Messages.StrictVarName);
        }

        if (kind === 'const') {
            expect('=');
            init = parseAssignmentExpression();
        } else if (match('=')) {
            lex();
            init = parseAssignmentExpression();
        }

        return {
            type: Syntax.VariableDeclarator,
            id: id,
            init: init
        };
    }

    function parseVariableDeclarationList(kind) {
        var list = [];

        while (index < length) {
            list.push(parseVariableDeclaration(kind));
            if (!match(',')) {
                break;
            }
            lex();
        }

        return list;
    }

    function parseVariableStatement() {
        var declarations;

        expectKeyword('var');

        declarations = parseVariableDeclarationList();

        consumeSemicolon();

        return {
            type: Syntax.VariableDeclaration,
            declarations: declarations,
            kind: 'var'
        };
    }

    // kind may be `const` or `let`
    // Both are experimental and not in the specification yet.
    // see http://wiki.ecmascript.org/doku.php?id=harmony:const
    // and http://wiki.ecmascript.org/doku.php?id=harmony:let
    function parseConstLetDeclaration(kind) {
        var declarations;

        expectKeyword(kind);

        declarations = parseVariableDeclarationList(kind);

        consumeSemicolon();

        return {
            type: Syntax.VariableDeclaration,
            declarations: declarations,
            kind: kind
        };
    }

    // 12.3 Empty Statement

    function parseEmptyStatement() {
        expect(';');

        return {
            type: Syntax.EmptyStatement
        };
    }

    // 12.4 Expression Statement

    function parseExpressionStatement() {
        var expr = parseExpression();

        consumeSemicolon();

        return {
            type: Syntax.ExpressionStatement,
            expression: expr
        };
    }

    // 12.5 If statement

    function parseIfStatement() {
        var test, consequent, alternate;

        expectKeyword('if');

        expect('(');

        test = parseExpression();

        expect(')');

        consequent = parseStatement();

        if (matchKeyword('else')) {
            lex();
            alternate = parseStatement();
        } else {
            alternate = null;
        }

        return {
            type: Syntax.IfStatement,
            test: test,
            consequent: consequent,
            alternate: alternate
        };
    }

    // 12.6 Iteration Statements

    function parseDoWhileStatement() {
        var body, test, oldInIteration;

        expectKeyword('do');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        if (match(';')) {
            lex();
        }

        return {
            type: Syntax.DoWhileStatement,
            body: body,
            test: test
        };
    }

    function parseWhileStatement() {
        var test, body, oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        return {
            type: Syntax.WhileStatement,
            test: test,
            body: body
        };
    }

    function parseForVariableDeclaration() {
        var token = lex();

        return {
            type: Syntax.VariableDeclaration,
            declarations: parseVariableDeclarationList(),
            kind: token.value
        };
    }

    function parseForStatement() {
        var init, test, update, left, right, body, oldInIteration;

        init = test = update = null;

        expectKeyword('for');

        expect('(');

        if (match(';')) {
            lex();
        } else {
            if (matchKeyword('var') || matchKeyword('let')) {
                state.allowIn = false;
                init = parseForVariableDeclaration();
                state.allowIn = true;

                if (init.declarations.length === 1 && matchKeyword('in')) {
                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
                }
            } else {
                state.allowIn = false;
                init = parseExpression();
                state.allowIn = true;

                if (matchKeyword('in')) {
                    // LeftHandSideExpression
                    if (!isLeftHandSide(init)) {
                        throwError({}, Messages.InvalidLHSInForIn);
                    }

                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
                }
            }

            if (typeof left === 'undefined') {
                expect(';');
            }
        }

        if (typeof left === 'undefined') {

            if (!match(';')) {
                test = parseExpression();
            }
            expect(';');

            if (!match(')')) {
                update = parseExpression();
            }
        }

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        if (typeof left === 'undefined') {
            return {
                type: Syntax.ForStatement,
                init: init,
                test: test,
                update: update,
                body: body
            };
        }

        return {
            type: Syntax.ForInStatement,
            left: left,
            right: right,
            body: body,
            each: false
        };
    }

    // 12.7 The continue statement

    function parseContinueStatement() {
        var token, label = null;

        expectKeyword('continue');

        // Optimize the most common form: 'continue;'.
        if (source[index] === ';') {
            lex();

            if (!state.inIteration) {
                throwError({}, Messages.IllegalContinue);
            }

            return {
                type: Syntax.ContinueStatement,
                label: null
            };
        }

        if (peekLineTerminator()) {
            if (!state.inIteration) {
                throwError({}, Messages.IllegalContinue);
            }

            return {
                type: Syntax.ContinueStatement,
                label: null
            };
        }

        token = lookahead();
        if (token.type === Token.Identifier) {
            label = parseVariableIdentifier();

            if (!Object.prototype.hasOwnProperty.call(state.labelSet, label.name)) {
                throwError({}, Messages.UnknownLabel, label.name);
            }
        }

        consumeSemicolon();

        if (label === null && !state.inIteration) {
            throwError({}, Messages.IllegalContinue);
        }

        return {
            type: Syntax.ContinueStatement,
            label: label
        };
    }

    // 12.8 The break statement

    function parseBreakStatement() {
        var token, label = null;

        expectKeyword('break');

        // Optimize the most common form: 'break;'.
        if (source[index] === ';') {
            lex();

            if (!(state.inIteration || state.inSwitch)) {
                throwError({}, Messages.IllegalBreak);
            }

            return {
                type: Syntax.BreakStatement,
                label: null
            };
        }

        if (peekLineTerminator()) {
            if (!(state.inIteration || state.inSwitch)) {
                throwError({}, Messages.IllegalBreak);
            }

            return {
                type: Syntax.BreakStatement,
                label: null
            };
        }

        token = lookahead();
        if (token.type === Token.Identifier) {
            label = parseVariableIdentifier();

            if (!Object.prototype.hasOwnProperty.call(state.labelSet, label.name)) {
                throwError({}, Messages.UnknownLabel, label.name);
            }
        }

        consumeSemicolon();

        if (label === null && !(state.inIteration || state.inSwitch)) {
            throwError({}, Messages.IllegalBreak);
        }

        return {
            type: Syntax.BreakStatement,
            label: label
        };
    }

    // 12.9 The return statement

    function parseReturnStatement() {
        var token, argument = null;

        expectKeyword('return');

        if (!state.inFunctionBody) {
            throwErrorTolerant({}, Messages.IllegalReturn);
        }

        // 'return' followed by a space and an identifier is very common.
        if (source[index] === ' ') {
            if (isIdentifierStart(source[index + 1])) {
                argument = parseExpression();
                consumeSemicolon();
                return {
                    type: Syntax.ReturnStatement,
                    argument: argument
                };
            }
        }

        if (peekLineTerminator()) {
            return {
                type: Syntax.ReturnStatement,
                argument: null
            };
        }

        if (!match(';')) {
            token = lookahead();
            if (!match('}') && token.type !== Token.EOF) {
                argument = parseExpression();
            }
        }

        consumeSemicolon();

        return {
            type: Syntax.ReturnStatement,
            argument: argument
        };
    }

    // 12.10 The with statement

    function parseWithStatement() {
        var object, body;

        if (strict) {
            throwErrorTolerant({}, Messages.StrictModeWith);
        }

        expectKeyword('with');

        expect('(');

        object = parseExpression();

        expect(')');

        body = parseStatement();

        return {
            type: Syntax.WithStatement,
            object: object,
            body: body
        };
    }

    // 12.10 The swith statement

    function parseSwitchCase() {
        var test,
            consequent = [],
            statement;

        if (matchKeyword('default')) {
            lex();
            test = null;
        } else {
            expectKeyword('case');
            test = parseExpression();
        }
        expect(':');

        while (index < length) {
            if (match('}') || matchKeyword('default') || matchKeyword('case')) {
                break;
            }
            statement = parseStatement();
            if (typeof statement === 'undefined') {
                break;
            }
            consequent.push(statement);
        }

        return {
            type: Syntax.SwitchCase,
            test: test,
            consequent: consequent
        };
    }

    function parseSwitchStatement() {
        var discriminant, cases, clause, oldInSwitch, defaultFound;

        expectKeyword('switch');

        expect('(');

        discriminant = parseExpression();

        expect(')');

        expect('{');

        if (match('}')) {
            lex();
            return {
                type: Syntax.SwitchStatement,
                discriminant: discriminant
            };
        }

        cases = [];

        oldInSwitch = state.inSwitch;
        state.inSwitch = true;
        defaultFound = false;

        while (index < length) {
            if (match('}')) {
                break;
            }
            clause = parseSwitchCase();
            if (clause.test === null) {
                if (defaultFound) {
                    throwError({}, Messages.MultipleDefaultsInSwitch);
                }
                defaultFound = true;
            }
            cases.push(clause);
        }

        state.inSwitch = oldInSwitch;

        expect('}');

        return {
            type: Syntax.SwitchStatement,
            discriminant: discriminant,
            cases: cases
        };
    }

    // 12.13 The throw statement

    function parseThrowStatement() {
        var argument;

        expectKeyword('throw');

        if (peekLineTerminator()) {
            throwError({}, Messages.NewlineAfterThrow);
        }

        argument = parseExpression();

        consumeSemicolon();

        return {
            type: Syntax.ThrowStatement,
            argument: argument
        };
    }

    // 12.14 The try statement

    function parseCatchClause() {
        var param;

        expectKeyword('catch');

        expect('(');
        if (!match(')')) {
            param = parseExpression();
            // 12.14.1
            if (strict && param.type === Syntax.Identifier && isRestrictedWord(param.name)) {
                throwErrorTolerant({}, Messages.StrictCatchVariable);
            }
        }
        expect(')');

        return {
            type: Syntax.CatchClause,
            param: param,
            body: parseBlock()
        };
    }

    function parseTryStatement() {
        var block, handlers = [], finalizer = null;

        expectKeyword('try');

        block = parseBlock();

        if (matchKeyword('catch')) {
            handlers.push(parseCatchClause());
        }

        if (matchKeyword('finally')) {
            lex();
            finalizer = parseBlock();
        }

        if (handlers.length === 0 && !finalizer) {
            throwError({}, Messages.NoCatchOrFinally);
        }

        return {
            type: Syntax.TryStatement,
            block: block,
            guardedHandlers: [],
            handlers: handlers,
            finalizer: finalizer
        };
    }

    // 12.15 The debugger statement

    function parseDebuggerStatement() {
        expectKeyword('debugger');

        consumeSemicolon();

        return {
            type: Syntax.DebuggerStatement
        };
    }

    // 12 Statements

    function parseStatement() {
        var token = lookahead(),
            expr,
            labeledBody;

        if (token.type === Token.EOF) {
            throwUnexpected(token);
        }

        if (token.type === Token.Punctuator) {
            switch (token.value) {
            case ';':
                return parseEmptyStatement();
            case '{':
                return parseBlock();
            case '(':
                return parseExpressionStatement();
            default:
                break;
            }
        }

        if (token.type === Token.Keyword) {
            switch (token.value) {
            case 'break':
                return parseBreakStatement();
            case 'continue':
                return parseContinueStatement();
            case 'debugger':
                return parseDebuggerStatement();
            case 'do':
                return parseDoWhileStatement();
            case 'for':
                return parseForStatement();
            case 'function':
                return parseFunctionDeclaration();
            case 'if':
                return parseIfStatement();
            case 'return':
                return parseReturnStatement();
            case 'switch':
                return parseSwitchStatement();
            case 'throw':
                return parseThrowStatement();
            case 'try':
                return parseTryStatement();
            case 'var':
                return parseVariableStatement();
            case 'while':
                return parseWhileStatement();
            case 'with':
                return parseWithStatement();
            default:
                break;
            }
        }

        expr = parseExpression();

        // 12.12 Labelled Statements
        if ((expr.type === Syntax.Identifier) && match(':')) {
            lex();

            if (Object.prototype.hasOwnProperty.call(state.labelSet, expr.name)) {
                throwError({}, Messages.Redeclaration, 'Label', expr.name);
            }

            state.labelSet[expr.name] = true;
            labeledBody = parseStatement();
            delete state.labelSet[expr.name];

            return {
                type: Syntax.LabeledStatement,
                label: expr,
                body: labeledBody
            };
        }

        consumeSemicolon();

        return {
            type: Syntax.ExpressionStatement,
            expression: expr
        };
    }

    // 13 Function Definition

    function parseFunctionSourceElements() {
        var sourceElement, sourceElements = [], token, directive, firstRestricted,
            oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody;

        expect('{');

        while (index < length) {
            token = lookahead();
            if (token.type !== Token.StringLiteral) {
                break;
            }

            sourceElement = parseSourceElement();
            sourceElements.push(sourceElement);
            if (sourceElement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
            }
            directive = sliceSource(token.range[0] + 1, token.range[1] - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
                }
            } else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
                }
            }
        }

        oldLabelSet = state.labelSet;
        oldInIteration = state.inIteration;
        oldInSwitch = state.inSwitch;
        oldInFunctionBody = state.inFunctionBody;

        state.labelSet = {};
        state.inIteration = false;
        state.inSwitch = false;
        state.inFunctionBody = true;

        while (index < length) {
            if (match('}')) {
                break;
            }
            sourceElement = parseSourceElement();
            if (typeof sourceElement === 'undefined') {
                break;
            }
            sourceElements.push(sourceElement);
        }

        expect('}');

        state.labelSet = oldLabelSet;
        state.inIteration = oldInIteration;
        state.inSwitch = oldInSwitch;
        state.inFunctionBody = oldInFunctionBody;

        return {
            type: Syntax.BlockStatement,
            body: sourceElements
        };
    }

    function parseFunctionDeclaration() {
        var id, param, params = [], body, token, stricted, firstRestricted, message, previousStrict, paramSet;

        expectKeyword('function');
        token = lookahead();
        id = parseVariableIdentifier();
        if (strict) {
            if (isRestrictedWord(token.value)) {
                throwErrorTolerant(token, Messages.StrictFunctionName);
            }
        } else {
            if (isRestrictedWord(token.value)) {
                firstRestricted = token;
                message = Messages.StrictFunctionName;
            } else if (isStrictModeReservedWord(token.value)) {
                firstRestricted = token;
                message = Messages.StrictReservedWord;
            }
        }

        expect('(');

        if (!match(')')) {
            paramSet = {};
            while (index < length) {
                token = lookahead();
                param = parseVariableIdentifier();
                if (strict) {
                    if (isRestrictedWord(token.value)) {
                        stricted = token;
                        message = Messages.StrictParamName;
                    }
                    if (Object.prototype.hasOwnProperty.call(paramSet, token.value)) {
                        stricted = token;
                        message = Messages.StrictParamDupe;
                    }
                } else if (!firstRestricted) {
                    if (isRestrictedWord(token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictParamName;
                    } else if (isStrictModeReservedWord(token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictReservedWord;
                    } else if (Object.prototype.hasOwnProperty.call(paramSet, token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictParamDupe;
                    }
                }
                params.push(param);
                paramSet[param.name] = true;
                if (match(')')) {
                    break;
                }
                expect(',');
            }
        }

        expect(')');

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwError(firstRestricted, message);
        }
        if (strict && stricted) {
            throwErrorTolerant(stricted, message);
        }
        strict = previousStrict;

        return {
            type: Syntax.FunctionDeclaration,
            id: id,
            params: params,
            defaults: [],
            body: body,
            rest: null,
            generator: false,
            expression: false
        };
    }

    function parseFunctionExpression() {
        var token, id = null, stricted, firstRestricted, message, param, params = [], body, previousStrict, paramSet;

        expectKeyword('function');

        if (!match('(')) {
            token = lookahead();
            id = parseVariableIdentifier();
            if (strict) {
                if (isRestrictedWord(token.value)) {
                    throwErrorTolerant(token, Messages.StrictFunctionName);
                }
            } else {
                if (isRestrictedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictFunctionName;
                } else if (isStrictModeReservedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictReservedWord;
                }
            }
        }

        expect('(');

        if (!match(')')) {
            paramSet = {};
            while (index < length) {
                token = lookahead();
                param = parseVariableIdentifier();
                if (strict) {
                    if (isRestrictedWord(token.value)) {
                        stricted = token;
                        message = Messages.StrictParamName;
                    }
                    if (Object.prototype.hasOwnProperty.call(paramSet, token.value)) {
                        stricted = token;
                        message = Messages.StrictParamDupe;
                    }
                } else if (!firstRestricted) {
                    if (isRestrictedWord(token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictParamName;
                    } else if (isStrictModeReservedWord(token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictReservedWord;
                    } else if (Object.prototype.hasOwnProperty.call(paramSet, token.value)) {
                        firstRestricted = token;
                        message = Messages.StrictParamDupe;
                    }
                }
                params.push(param);
                paramSet[param.name] = true;
                if (match(')')) {
                    break;
                }
                expect(',');
            }
        }

        expect(')');

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwError(firstRestricted, message);
        }
        if (strict && stricted) {
            throwErrorTolerant(stricted, message);
        }
        strict = previousStrict;

        return {
            type: Syntax.FunctionExpression,
            id: id,
            params: params,
            defaults: [],
            body: body,
            rest: null,
            generator: false,
            expression: false
        };
    }

    // 14 Program

    function parseSourceElement() {
        var token = lookahead();

        if (token.type === Token.Keyword) {
            switch (token.value) {
            case 'const':
            case 'let':
                return parseConstLetDeclaration(token.value);
            case 'function':
                return parseFunctionDeclaration();
            default:
                return parseStatement();
            }
        }

        if (token.type !== Token.EOF) {
            return parseStatement();
        }
    }

    function parseSourceElements() {
        var sourceElement, sourceElements = [], token, directive, firstRestricted;

        while (index < length) {
            token = lookahead();
            if (token.type !== Token.StringLiteral) {
                break;
            }

            sourceElement = parseSourceElement();
            sourceElements.push(sourceElement);
            if (sourceElement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
            }
            directive = sliceSource(token.range[0] + 1, token.range[1] - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
                }
            } else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
                }
            }
        }

        while (index < length) {
            sourceElement = parseSourceElement();
            if (typeof sourceElement === 'undefined') {
                break;
            }
            sourceElements.push(sourceElement);
        }
        return sourceElements;
    }

    function parseProgram() {
        var program;
        strict = false;
        program = {
            type: Syntax.Program,
            body: parseSourceElements()
        };
        return program;
    }

    // The following functions are needed only when the option to preserve
    // the comments is active.

    function addComment(type, value, start, end, loc) {
        assert(typeof start === 'number', 'Comment must have valid position');

        // Because the way the actual token is scanned, often the comments
        // (if any) are skipped twice during the lexical analysis.
        // Thus, we need to skip adding a comment if the comment array already
        // handled it.
        if (extra.comments.length > 0) {
            if (extra.comments[extra.comments.length - 1].range[1] > start) {
                return;
            }
        }

        extra.comments.push({
            type: type,
            value: value,
            range: [start, end],
            loc: loc
        });
    }

    function scanComment() {
        var comment, ch, loc, start, blockComment, lineComment;

        comment = '';
        blockComment = false;
        lineComment = false;

        while (index < length) {
            ch = source[index];

            if (lineComment) {
                ch = source[index++];
                if (isLineTerminator(ch)) {
                    loc.end = {
                        line: lineNumber,
                        column: index - lineStart - 1
                    };
                    lineComment = false;
                    addComment('Line', comment, start, index - 1, loc);
                    if (ch === '\r' && source[index] === '\n') {
                        ++index;
                    }
                    ++lineNumber;
                    lineStart = index;
                    comment = '';
                } else if (index >= length) {
                    lineComment = false;
                    comment += ch;
                    loc.end = {
                        line: lineNumber,
                        column: length - lineStart
                    };
                    addComment('Line', comment, start, length, loc);
                } else {
                    comment += ch;
                }
            } else if (blockComment) {
                if (isLineTerminator(ch)) {
                    if (ch === '\r' && source[index + 1] === '\n') {
                        ++index;
                        comment += '\r\n';
                    } else {
                        comment += ch;
                    }
                    ++lineNumber;
                    ++index;
                    lineStart = index;
                    if (index >= length) {
                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                    }
                } else {
                    ch = source[index++];
                    if (index >= length) {
                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                    }
                    comment += ch;
                    if (ch === '*') {
                        ch = source[index];
                        if (ch === '/') {
                            comment = comment.substr(0, comment.length - 1);
                            blockComment = false;
                            ++index;
                            loc.end = {
                                line: lineNumber,
                                column: index - lineStart
                            };
                            addComment('Block', comment, start, index, loc);
                            comment = '';
                        }
                    }
                }
            } else if (ch === '/') {
                ch = source[index + 1];
                if (ch === '/') {
                    loc = {
                        start: {
                            line: lineNumber,
                            column: index - lineStart
                        }
                    };
                    start = index;
                    index += 2;
                    lineComment = true;
                    if (index >= length) {
                        loc.end = {
                            line: lineNumber,
                            column: index - lineStart
                        };
                        lineComment = false;
                        addComment('Line', comment, start, index, loc);
                    }
                } else if (ch === '*') {
                    start = index;
                    index += 2;
                    blockComment = true;
                    loc = {
                        start: {
                            line: lineNumber,
                            column: index - lineStart - 2
                        }
                    };
                    if (index >= length) {
                        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                    }
                } else {
                    break;
                }
            } else if (isWhiteSpace(ch)) {
                ++index;
            } else if (isLineTerminator(ch)) {
                ++index;
                if (ch ===  '\r' && source[index] === '\n') {
                    ++index;
                }
                ++lineNumber;
                lineStart = index;
            } else {
                break;
            }
        }
    }

    function filterCommentLocation() {
        var i, entry, comment, comments = [];

        for (i = 0; i < extra.comments.length; ++i) {
            entry = extra.comments[i];
            comment = {
                type: entry.type,
                value: entry.value
            };
            if (extra.range) {
                comment.range = entry.range;
            }
            if (extra.loc) {
                comment.loc = entry.loc;
            }
            comments.push(comment);
        }

        extra.comments = comments;
    }

    function collectToken() {
        var start, loc, token, range, value;

        skipComment();
        start = index;
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        token = extra.advance();
        loc.end = {
            line: lineNumber,
            column: index - lineStart
        };

        if (token.type !== Token.EOF) {
            range = [token.range[0], token.range[1]];
            value = sliceSource(token.range[0], token.range[1]);
            extra.tokens.push({
                type: TokenName[token.type],
                value: value,
                range: range,
                loc: loc
            });
        }

        return token;
    }

    function collectRegex() {
        var pos, loc, regex, token;

        skipComment();

        pos = index;
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        regex = extra.scanRegExp();
        loc.end = {
            line: lineNumber,
            column: index - lineStart
        };

        // Pop the previous token, which is likely '/' or '/='
        if (extra.tokens.length > 0) {
            token = extra.tokens[extra.tokens.length - 1];
            if (token.range[0] === pos && token.type === 'Punctuator') {
                if (token.value === '/' || token.value === '/=') {
                    extra.tokens.pop();
                }
            }
        }

        extra.tokens.push({
            type: 'RegularExpression',
            value: regex.literal,
            range: [pos, index],
            loc: loc
        });

        return regex;
    }

    function filterTokenLocation() {
        var i, entry, token, tokens = [];

        for (i = 0; i < extra.tokens.length; ++i) {
            entry = extra.tokens[i];
            token = {
                type: entry.type,
                value: entry.value
            };
            if (extra.range) {
                token.range = entry.range;
            }
            if (extra.loc) {
                token.loc = entry.loc;
            }
            tokens.push(token);
        }

        extra.tokens = tokens;
    }

    function createLiteral(token) {
        return {
            type: Syntax.Literal,
            value: token.value
        };
    }

    function createRawLiteral(token) {
        return {
            type: Syntax.Literal,
            value: token.value,
            raw: sliceSource(token.range[0], token.range[1])
        };
    }

    function createLocationMarker() {
        var marker = {};

        marker.range = [index, index];
        marker.loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            },
            end: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        marker.end = function () {
            this.range[1] = index;
            this.loc.end.line = lineNumber;
            this.loc.end.column = index - lineStart;
        };

        marker.applyGroup = function (node) {
            if (extra.range) {
                node.groupRange = [this.range[0], this.range[1]];
            }
            if (extra.loc) {
                node.groupLoc = {
                    start: {
                        line: this.loc.start.line,
                        column: this.loc.start.column
                    },
                    end: {
                        line: this.loc.end.line,
                        column: this.loc.end.column
                    }
                };
            }
        };

        marker.apply = function (node) {
            if (extra.range) {
                node.range = [this.range[0], this.range[1]];
            }
            if (extra.loc) {
                node.loc = {
                    start: {
                        line: this.loc.start.line,
                        column: this.loc.start.column
                    },
                    end: {
                        line: this.loc.end.line,
                        column: this.loc.end.column
                    }
                };
            }
        };

        return marker;
    }

    function trackGroupExpression() {
        var marker, expr;

        skipComment();
        marker = createLocationMarker();
        expect('(');

        expr = parseExpression();

        expect(')');

        marker.end();
        marker.applyGroup(expr);

        return expr;
    }

    function trackLeftHandSideExpression() {
        var marker, expr;

        skipComment();
        marker = createLocationMarker();

        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();

        while (match('.') || match('[')) {
            if (match('[')) {
                expr = {
                    type: Syntax.MemberExpression,
                    computed: true,
                    object: expr,
                    property: parseComputedMember()
                };
                marker.end();
                marker.apply(expr);
            } else {
                expr = {
                    type: Syntax.MemberExpression,
                    computed: false,
                    object: expr,
                    property: parseNonComputedMember()
                };
                marker.end();
                marker.apply(expr);
            }
        }

        return expr;
    }

    function trackLeftHandSideExpressionAllowCall() {
        var marker, expr;

        skipComment();
        marker = createLocationMarker();

        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();

        while (match('.') || match('[') || match('(')) {
            if (match('(')) {
                expr = {
                    type: Syntax.CallExpression,
                    callee: expr,
                    'arguments': parseArguments()
                };
                marker.end();
                marker.apply(expr);
            } else if (match('[')) {
                expr = {
                    type: Syntax.MemberExpression,
                    computed: true,
                    object: expr,
                    property: parseComputedMember()
                };
                marker.end();
                marker.apply(expr);
            } else {
                expr = {
                    type: Syntax.MemberExpression,
                    computed: false,
                    object: expr,
                    property: parseNonComputedMember()
                };
                marker.end();
                marker.apply(expr);
            }
        }

        return expr;
    }

    function filterGroup(node) {
        var n, i, entry;

        n = (Object.prototype.toString.apply(node) === '[object Array]') ? [] : {};
        for (i in node) {
            if (node.hasOwnProperty(i) && i !== 'groupRange' && i !== 'groupLoc') {
                entry = node[i];
                if (entry === null || typeof entry !== 'object' || entry instanceof RegExp) {
                    n[i] = entry;
                } else {
                    n[i] = filterGroup(entry);
                }
            }
        }
        return n;
    }

    function wrapTrackingFunction(range, loc) {

        return function (parseFunction) {

            function isBinary(node) {
                return node.type === Syntax.LogicalExpression ||
                    node.type === Syntax.BinaryExpression;
            }

            function visit(node) {
                var start, end;

                if (isBinary(node.left)) {
                    visit(node.left);
                }
                if (isBinary(node.right)) {
                    visit(node.right);
                }

                if (range) {
                    if (node.left.groupRange || node.right.groupRange) {
                        start = node.left.groupRange ? node.left.groupRange[0] : node.left.range[0];
                        end = node.right.groupRange ? node.right.groupRange[1] : node.right.range[1];
                        node.range = [start, end];
                    } else if (typeof node.range === 'undefined') {
                        start = node.left.range[0];
                        end = node.right.range[1];
                        node.range = [start, end];
                    }
                }
                if (loc) {
                    if (node.left.groupLoc || node.right.groupLoc) {
                        start = node.left.groupLoc ? node.left.groupLoc.start : node.left.loc.start;
                        end = node.right.groupLoc ? node.right.groupLoc.end : node.right.loc.end;
                        node.loc = {
                            start: start,
                            end: end
                        };
                    } else if (typeof node.loc === 'undefined') {
                        node.loc = {
                            start: node.left.loc.start,
                            end: node.right.loc.end
                        };
                    }
                }
            }

            return function () {
                var marker, node;

                skipComment();

                marker = createLocationMarker();
                node = parseFunction.apply(null, arguments);
                marker.end();

                if (range && typeof node.range === 'undefined') {
                    marker.apply(node);
                }

                if (loc && typeof node.loc === 'undefined') {
                    marker.apply(node);
                }

                if (isBinary(node)) {
                    visit(node);
                }

                return node;
            };
        };
    }

    function patch() {

        var wrapTracking;

        if (extra.comments) {
            extra.skipComment = skipComment;
            skipComment = scanComment;
        }

        if (extra.raw) {
            extra.createLiteral = createLiteral;
            createLiteral = createRawLiteral;
        }

        if (extra.range || extra.loc) {

            extra.parseGroupExpression = parseGroupExpression;
            extra.parseLeftHandSideExpression = parseLeftHandSideExpression;
            extra.parseLeftHandSideExpressionAllowCall = parseLeftHandSideExpressionAllowCall;
            parseGroupExpression = trackGroupExpression;
            parseLeftHandSideExpression = trackLeftHandSideExpression;
            parseLeftHandSideExpressionAllowCall = trackLeftHandSideExpressionAllowCall;

            wrapTracking = wrapTrackingFunction(extra.range, extra.loc);

            extra.parseAdditiveExpression = parseAdditiveExpression;
            extra.parseAssignmentExpression = parseAssignmentExpression;
            extra.parseBitwiseANDExpression = parseBitwiseANDExpression;
            extra.parseBitwiseORExpression = parseBitwiseORExpression;
            extra.parseBitwiseXORExpression = parseBitwiseXORExpression;
            extra.parseBlock = parseBlock;
            extra.parseFunctionSourceElements = parseFunctionSourceElements;
            extra.parseCatchClause = parseCatchClause;
            extra.parseComputedMember = parseComputedMember;
            extra.parseConditionalExpression = parseConditionalExpression;
            extra.parseConstLetDeclaration = parseConstLetDeclaration;
            extra.parseEqualityExpression = parseEqualityExpression;
            extra.parseExpression = parseExpression;
            extra.parseForVariableDeclaration = parseForVariableDeclaration;
            extra.parseFunctionDeclaration = parseFunctionDeclaration;
            extra.parseFunctionExpression = parseFunctionExpression;
            extra.parseLogicalANDExpression = parseLogicalANDExpression;
            extra.parseLogicalORExpression = parseLogicalORExpression;
            extra.parseMultiplicativeExpression = parseMultiplicativeExpression;
            extra.parseNewExpression = parseNewExpression;
            extra.parseNonComputedProperty = parseNonComputedProperty;
            extra.parseObjectProperty = parseObjectProperty;
            extra.parseObjectPropertyKey = parseObjectPropertyKey;
            extra.parsePostfixExpression = parsePostfixExpression;
            extra.parsePrimaryExpression = parsePrimaryExpression;
            extra.parseProgram = parseProgram;
            extra.parsePropertyFunction = parsePropertyFunction;
            extra.parseRelationalExpression = parseRelationalExpression;
            extra.parseStatement = parseStatement;
            extra.parseShiftExpression = parseShiftExpression;
            extra.parseSwitchCase = parseSwitchCase;
            extra.parseUnaryExpression = parseUnaryExpression;
            extra.parseVariableDeclaration = parseVariableDeclaration;
            extra.parseVariableIdentifier = parseVariableIdentifier;

            parseAdditiveExpression = wrapTracking(extra.parseAdditiveExpression);
            parseAssignmentExpression = wrapTracking(extra.parseAssignmentExpression);
            parseBitwiseANDExpression = wrapTracking(extra.parseBitwiseANDExpression);
            parseBitwiseORExpression = wrapTracking(extra.parseBitwiseORExpression);
            parseBitwiseXORExpression = wrapTracking(extra.parseBitwiseXORExpression);
            parseBlock = wrapTracking(extra.parseBlock);
            parseFunctionSourceElements = wrapTracking(extra.parseFunctionSourceElements);
            parseCatchClause = wrapTracking(extra.parseCatchClause);
            parseComputedMember = wrapTracking(extra.parseComputedMember);
            parseConditionalExpression = wrapTracking(extra.parseConditionalExpression);
            parseConstLetDeclaration = wrapTracking(extra.parseConstLetDeclaration);
            parseEqualityExpression = wrapTracking(extra.parseEqualityExpression);
            parseExpression = wrapTracking(extra.parseExpression);
            parseForVariableDeclaration = wrapTracking(extra.parseForVariableDeclaration);
            parseFunctionDeclaration = wrapTracking(extra.parseFunctionDeclaration);
            parseFunctionExpression = wrapTracking(extra.parseFunctionExpression);
            parseLeftHandSideExpression = wrapTracking(parseLeftHandSideExpression);
            parseLogicalANDExpression = wrapTracking(extra.parseLogicalANDExpression);
            parseLogicalORExpression = wrapTracking(extra.parseLogicalORExpression);
            parseMultiplicativeExpression = wrapTracking(extra.parseMultiplicativeExpression);
            parseNewExpression = wrapTracking(extra.parseNewExpression);
            parseNonComputedProperty = wrapTracking(extra.parseNonComputedProperty);
            parseObjectProperty = wrapTracking(extra.parseObjectProperty);
            parseObjectPropertyKey = wrapTracking(extra.parseObjectPropertyKey);
            parsePostfixExpression = wrapTracking(extra.parsePostfixExpression);
            parsePrimaryExpression = wrapTracking(extra.parsePrimaryExpression);
            parseProgram = wrapTracking(extra.parseProgram);
            parsePropertyFunction = wrapTracking(extra.parsePropertyFunction);
            parseRelationalExpression = wrapTracking(extra.parseRelationalExpression);
            parseStatement = wrapTracking(extra.parseStatement);
            parseShiftExpression = wrapTracking(extra.parseShiftExpression);
            parseSwitchCase = wrapTracking(extra.parseSwitchCase);
            parseUnaryExpression = wrapTracking(extra.parseUnaryExpression);
            parseVariableDeclaration = wrapTracking(extra.parseVariableDeclaration);
            parseVariableIdentifier = wrapTracking(extra.parseVariableIdentifier);
        }

        if (typeof extra.tokens !== 'undefined') {
            extra.advance = advance;
            extra.scanRegExp = scanRegExp;

            advance = collectToken;
            scanRegExp = collectRegex;
        }
    }

    function unpatch() {
        if (typeof extra.skipComment === 'function') {
            skipComment = extra.skipComment;
        }

        if (extra.raw) {
            createLiteral = extra.createLiteral;
        }

        if (extra.range || extra.loc) {
            parseAdditiveExpression = extra.parseAdditiveExpression;
            parseAssignmentExpression = extra.parseAssignmentExpression;
            parseBitwiseANDExpression = extra.parseBitwiseANDExpression;
            parseBitwiseORExpression = extra.parseBitwiseORExpression;
            parseBitwiseXORExpression = extra.parseBitwiseXORExpression;
            parseBlock = extra.parseBlock;
            parseFunctionSourceElements = extra.parseFunctionSourceElements;
            parseCatchClause = extra.parseCatchClause;
            parseComputedMember = extra.parseComputedMember;
            parseConditionalExpression = extra.parseConditionalExpression;
            parseConstLetDeclaration = extra.parseConstLetDeclaration;
            parseEqualityExpression = extra.parseEqualityExpression;
            parseExpression = extra.parseExpression;
            parseForVariableDeclaration = extra.parseForVariableDeclaration;
            parseFunctionDeclaration = extra.parseFunctionDeclaration;
            parseFunctionExpression = extra.parseFunctionExpression;
            parseGroupExpression = extra.parseGroupExpression;
            parseLeftHandSideExpression = extra.parseLeftHandSideExpression;
            parseLeftHandSideExpressionAllowCall = extra.parseLeftHandSideExpressionAllowCall;
            parseLogicalANDExpression = extra.parseLogicalANDExpression;
            parseLogicalORExpression = extra.parseLogicalORExpression;
            parseMultiplicativeExpression = extra.parseMultiplicativeExpression;
            parseNewExpression = extra.parseNewExpression;
            parseNonComputedProperty = extra.parseNonComputedProperty;
            parseObjectProperty = extra.parseObjectProperty;
            parseObjectPropertyKey = extra.parseObjectPropertyKey;
            parsePrimaryExpression = extra.parsePrimaryExpression;
            parsePostfixExpression = extra.parsePostfixExpression;
            parseProgram = extra.parseProgram;
            parsePropertyFunction = extra.parsePropertyFunction;
            parseRelationalExpression = extra.parseRelationalExpression;
            parseStatement = extra.parseStatement;
            parseShiftExpression = extra.parseShiftExpression;
            parseSwitchCase = extra.parseSwitchCase;
            parseUnaryExpression = extra.parseUnaryExpression;
            parseVariableDeclaration = extra.parseVariableDeclaration;
            parseVariableIdentifier = extra.parseVariableIdentifier;
        }

        if (typeof extra.scanRegExp === 'function') {
            advance = extra.advance;
            scanRegExp = extra.scanRegExp;
        }
    }

    function stringToArray(str) {
        var length = str.length,
            result = [],
            i;
        for (i = 0; i < length; ++i) {
            result[i] = str.charAt(i);
        }
        return result;
    }

    function parse(code, options) {
        var program, toString;

        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
            code = toString(code);
        }

        source = code;
        index = 0;
        lineNumber = (source.length > 0) ? 1 : 0;
        lineStart = 0;
        length = source.length;
        buffer = null;
        state = {
            allowIn: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false
        };

        extra = {};
        if (typeof options !== 'undefined') {
            extra.range = (typeof options.range === 'boolean') && options.range;
            extra.loc = (typeof options.loc === 'boolean') && options.loc;
            extra.raw = (typeof options.raw === 'boolean') && options.raw;
            if (typeof options.tokens === 'boolean' && options.tokens) {
                extra.tokens = [];
            }
            if (typeof options.comment === 'boolean' && options.comment) {
                extra.comments = [];
            }
            if (typeof options.tolerant === 'boolean' && options.tolerant) {
                extra.errors = [];
            }
        }

        if (length > 0) {
            if (typeof source[0] === 'undefined') {
                // Try first to convert to a string. This is good as fast path
                // for old IE which understands string indexing for string
                // literals only and not for string object.
                if (code instanceof String) {
                    source = code.valueOf();
                }

                // Force accessing the characters via an array.
                if (typeof source[0] === 'undefined') {
                    source = stringToArray(code);
                }
            }
        }

        patch();
        try {
            program = parseProgram();
            if (typeof extra.comments !== 'undefined') {
                filterCommentLocation();
                program.comments = extra.comments;
            }
            if (typeof extra.tokens !== 'undefined') {
                filterTokenLocation();
                program.tokens = extra.tokens;
            }
            if (typeof extra.errors !== 'undefined') {
                program.errors = extra.errors;
            }
            if (extra.range || extra.loc) {
                program.body = filterGroup(program.body);
            }
        } catch (e) {
            throw e;
        } finally {
            unpatch();
            extra = {};
        }

        return program;
    }

    // Sync with package.json.
    exports.version = '1.0.0';

    exports.parse = parse;

    // Deep copy.
    exports.Syntax = (function () {
        var name, types = {};

        if (typeof Object.create === 'function') {
            types = Object.create(null);
        }

        for (name in Syntax) {
            if (Syntax.hasOwnProperty(name)) {
                types[name] = Syntax[name];
            }
        }

        if (typeof Object.freeze === 'function') {
            Object.freeze(types);
        }

        return types;
    }());

}));
/* vim: set sw=4 ts=4 et tw=80 : */

})()
},{}]},{},["WG6PGP"])
;