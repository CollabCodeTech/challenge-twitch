
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    let SvelteElement;
    if (typeof HTMLElement !== 'undefined') {
        SvelteElement = class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
                // @ts-ignore todo: improve typings
                for (const key in this.$$.slotted) {
                    // @ts-ignore todo: improve typings
                    this.appendChild(this.$$.slotted[key]);
                }
            }
            attributeChangedCallback(attr, _oldValue, newValue) {
                this[attr] = newValue;
            }
            $destroy() {
                destroy_component(this, 1);
                this.$destroy = noop;
            }
            $on(type, callback) {
                // TODO should this delegate to addEventListener?
                const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
                callbacks.push(callback);
                return () => {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1)
                        callbacks.splice(index, 1);
                };
            }
            $set() {
                // overridden by instance, if it has props
            }
        };
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src\containers\Screen.svelte generated by Svelte v3.12.0 */

    const file = "src\\containers\\Screen.svelte";

    function create_fragment(ctx) {
    	var section, div2, div1, ul0, li0, t1, li1, t3, li2, t5, li3, t7, li4, t9, li5, t11, li6, t13, div0, span, t15, ul1, li7, t16, li8, t17, li9, t18, li10, t19, div4, div3;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div2 = element("div");
    			div1 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "0";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "1";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "2";
    			t5 = space();
    			li3 = element("li");
    			li3.textContent = "3";
    			t7 = space();
    			li4 = element("li");
    			li4.textContent = "4";
    			t9 = space();
    			li5 = element("li");
    			li5.textContent = "5";
    			t11 = space();
    			li6 = element("li");
    			li6.textContent = "6";
    			t13 = space();
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "TECTOY";
    			t15 = space();
    			ul1 = element("ul");
    			li7 = element("li");
    			t16 = space();
    			li8 = element("li");
    			t17 = space();
    			li9 = element("li");
    			t18 = space();
    			li10 = element("li");
    			t19 = space();
    			div4 = element("div");
    			div3 = element("div");
    			attr_dev(li0, "class", "char svelte-w7n64k");
    			add_location(li0, file, 163, 8, 3215);
    			attr_dev(li1, "class", "char svelte-w7n64k");
    			add_location(li1, file, 164, 8, 3248);
    			attr_dev(li2, "class", "char svelte-w7n64k");
    			add_location(li2, file, 165, 8, 3281);
    			attr_dev(li3, "class", "char svelte-w7n64k");
    			add_location(li3, file, 166, 8, 3314);
    			attr_dev(li4, "class", "char svelte-w7n64k");
    			add_location(li4, file, 167, 8, 3347);
    			attr_dev(li5, "class", "char svelte-w7n64k");
    			add_location(li5, file, 168, 8, 3380);
    			attr_dev(li6, "class", "char svelte-w7n64k");
    			add_location(li6, file, 169, 8, 3413);
    			attr_dev(ul0, "class", "display svelte-w7n64k");
    			add_location(ul0, file, 162, 6, 3185);
    			attr_dev(span, "class", "text svelte-w7n64k");
    			add_location(span, file, 172, 8, 3490);
    			attr_dev(li7, "class", "color red svelte-w7n64k");
    			add_location(li7, file, 174, 10, 3563);
    			attr_dev(li8, "class", "color yellow svelte-w7n64k");
    			add_location(li8, file, 175, 10, 3599);
    			attr_dev(li9, "class", "color blue svelte-w7n64k");
    			add_location(li9, file, 176, 10, 3638);
    			attr_dev(li10, "class", "color green svelte-w7n64k");
    			add_location(li10, file, 177, 10, 3675);
    			attr_dev(ul1, "class", "colors svelte-w7n64k");
    			add_location(ul1, file, 173, 8, 3532);
    			attr_dev(div0, "class", "text-logo svelte-w7n64k");
    			add_location(div0, file, 171, 6, 3457);
    			attr_dev(div1, "class", "visor svelte-w7n64k");
    			add_location(div1, file, 161, 4, 3158);
    			attr_dev(div2, "class", "tela svelte-w7n64k");
    			add_location(div2, file, 160, 2, 3134);
    			attr_dev(div3, "class", "entrada-disquete svelte-w7n64k");
    			add_location(div3, file, 183, 4, 3784);
    			attr_dev(div4, "class", "disquete svelte-w7n64k");
    			add_location(div4, file, 182, 2, 3756);
    			attr_dev(section, "class", "svelte-w7n64k");
    			add_location(section, file, 159, 0, 3121);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div2);
    			append_dev(div2, div1);
    			append_dev(div1, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t1);
    			append_dev(ul0, li1);
    			append_dev(ul0, t3);
    			append_dev(ul0, li2);
    			append_dev(ul0, t5);
    			append_dev(ul0, li3);
    			append_dev(ul0, t7);
    			append_dev(ul0, li4);
    			append_dev(ul0, t9);
    			append_dev(ul0, li5);
    			append_dev(ul0, t11);
    			append_dev(ul0, li6);
    			append_dev(div1, t13);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t15);
    			append_dev(div0, ul1);
    			append_dev(ul1, li7);
    			append_dev(ul1, t16);
    			append_dev(ul1, li8);
    			append_dev(ul1, t17);
    			append_dev(ul1, li9);
    			append_dev(ul1, t18);
    			append_dev(ul1, li10);
    			append_dev(section, t19);
    			append_dev(section, div4);
    			append_dev(div4, div3);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    class Screen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Screen", options, id: create_fragment.name });
    	}
    }

    /* src\components\BigButton.svelte generated by Svelte v3.12.0 */

    const file$1 = "src\\components\\BigButton.svelte";

    function create_fragment$1(ctx) {
    	var button, span, t, button_class_value;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			t = text(ctx.key);
    			attr_dev(span, "class", "text svelte-101k2jr");
    			add_location(span, file$1, 47, 2, 807);
    			attr_dev(button, "class", button_class_value = "big-button -" + ctx.color + " svelte-101k2jr");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$1, 46, 0, 753);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span);
    			append_dev(span, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.key) {
    				set_data_dev(t, ctx.key);
    			}

    			if ((changed.color) && button_class_value !== (button_class_value = "big-button -" + ctx.color + " svelte-101k2jr")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { BigButton = "", key, color } = $$props;

    	const writable_props = ['BigButton', 'key', 'color'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<BigButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('BigButton' in $$props) $$invalidate('BigButton', BigButton = $$props.BigButton);
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('color' in $$props) $$invalidate('color', color = $$props.color);
    	};

    	$$self.$capture_state = () => {
    		return { BigButton, key, color };
    	};

    	$$self.$inject_state = $$props => {
    		if ('BigButton' in $$props) $$invalidate('BigButton', BigButton = $$props.BigButton);
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('color' in $$props) $$invalidate('color', color = $$props.color);
    	};

    	return { BigButton, key, color };
    }

    class BigButton_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment$1, safe_not_equal, ["BigButton", "key", "color"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "BigButton_1", options, id: create_fragment$1.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.key === undefined && !('key' in props)) {
    			console.warn("<BigButton> was created without expected prop 'key'");
    		}
    		if (ctx.color === undefined && !('color' in props)) {
    			console.warn("<BigButton> was created without expected prop 'color'");
    		}
    	}

    	get BigButton() {
    		throw new Error("<BigButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set BigButton(value) {
    		throw new Error("<BigButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<BigButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<BigButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<BigButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<BigButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FunctionalButton.svelte generated by Svelte v3.12.0 */

    const file$2 = "src\\components\\FunctionalButton.svelte";

    function create_fragment$2(ctx) {
    	var button, t, button_class_value;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(ctx.text);
    			attr_dev(button, "class", button_class_value = "functional-button -" + ctx.color + " -font-" + ctx.fontColor + " svelte-1pz1i0x");
    			add_location(button, file$2, 50, 0, 827);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.text) {
    				set_data_dev(t, ctx.text);
    			}

    			if ((changed.color || changed.fontColor) && button_class_value !== (button_class_value = "functional-button -" + ctx.color + " -font-" + ctx.fontColor + " svelte-1pz1i0x")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { FunctionalButton, text, color, fontColor } = $$props;

    	const writable_props = ['FunctionalButton', 'text', 'color', 'fontColor'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<FunctionalButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('FunctionalButton' in $$props) $$invalidate('FunctionalButton', FunctionalButton = $$props.FunctionalButton);
    		if ('text' in $$props) $$invalidate('text', text = $$props.text);
    		if ('color' in $$props) $$invalidate('color', color = $$props.color);
    		if ('fontColor' in $$props) $$invalidate('fontColor', fontColor = $$props.fontColor);
    	};

    	$$self.$capture_state = () => {
    		return { FunctionalButton, text, color, fontColor };
    	};

    	$$self.$inject_state = $$props => {
    		if ('FunctionalButton' in $$props) $$invalidate('FunctionalButton', FunctionalButton = $$props.FunctionalButton);
    		if ('text' in $$props) $$invalidate('text', text = $$props.text);
    		if ('color' in $$props) $$invalidate('color', color = $$props.color);
    		if ('fontColor' in $$props) $$invalidate('fontColor', fontColor = $$props.fontColor);
    	};

    	return { FunctionalButton, text, color, fontColor };
    }

    class FunctionalButton_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$2, safe_not_equal, ["FunctionalButton", "text", "color", "fontColor"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "FunctionalButton_1", options, id: create_fragment$2.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.FunctionalButton === undefined && !('FunctionalButton' in props)) {
    			console.warn("<FunctionalButton> was created without expected prop 'FunctionalButton'");
    		}
    		if (ctx.text === undefined && !('text' in props)) {
    			console.warn("<FunctionalButton> was created without expected prop 'text'");
    		}
    		if (ctx.color === undefined && !('color' in props)) {
    			console.warn("<FunctionalButton> was created without expected prop 'color'");
    		}
    		if (ctx.fontColor === undefined && !('fontColor' in props)) {
    			console.warn("<FunctionalButton> was created without expected prop 'fontColor'");
    		}
    	}

    	get FunctionalButton() {
    		throw new Error("<FunctionalButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set FunctionalButton(value) {
    		throw new Error("<FunctionalButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<FunctionalButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<FunctionalButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<FunctionalButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<FunctionalButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontColor() {
    		throw new Error("<FunctionalButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontColor(value) {
    		throw new Error("<FunctionalButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\containers\Keyboard.svelte generated by Svelte v3.12.0 */

    const file$3 = "src\\containers\\Keyboard.svelte";

    function create_fragment$3(ctx) {
    	var section1, div, ul0, li0, t0, li1, t1, li2, t2, li3, t3, section0, ul1, li4, t4, li5, t5, li6, t6, li7, t7, ul2, li8, t8, li9, t9, li10, t10, li11, current;

    	var bigbutton0 = new BigButton_1({
    		props: { key: "A", color: "red" },
    		$$inline: true
    	});

    	var bigbutton1 = new BigButton_1({
    		props: { key: "B", color: "yellow" },
    		$$inline: true
    	});

    	var bigbutton2 = new BigButton_1({
    		props: { key: "C", color: "blue" },
    		$$inline: true
    	});

    	var bigbutton3 = new BigButton_1({
    		props: { key: "D", color: "green" },
    		$$inline: true
    	});

    	var funcbutton0 = new FunctionalButton_1({
    		props: {
    		text: "enter",
    		color: "white",
    		fontColor: "blue"
    	},
    		$$inline: true
    	});

    	var funcbutton1 = new FunctionalButton_1({
    		props: {
    		text: "livro",
    		color: "white",
    		fontColor: "blue"
    	},
    		$$inline: true
    	});

    	var funcbutton2 = new FunctionalButton_1({
    		props: {
    		text: "desl.",
    		color: "red",
    		fontColor: "blue"
    	},
    		$$inline: true
    	});

    	var funcbutton3 = new FunctionalButton_1({
    		props: {
    		text: "liga",
    		color: "green",
    		fontColor: "blue"
    	},
    		$$inline: true
    	});

    	var funcbutton4 = new FunctionalButton_1({
    		props: {
    		text: "+",
    		color: "blue",
    		fontColor: "white"
    	},
    		$$inline: true
    	});

    	var funcbutton5 = new FunctionalButton_1({
    		props: {
    		text: "-",
    		color: "blue",
    		fontColor: "white"
    	},
    		$$inline: true
    	});

    	var funcbutton6 = new FunctionalButton_1({
    		props: {
    		text: "X",
    		color: "blue",
    		fontColor: "white"
    	},
    		$$inline: true
    	});

    	var funcbutton7 = new FunctionalButton_1({
    		props: {
    		text: "÷",
    		color: "blue",
    		fontColor: "white"
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			section1 = element("section");
    			div = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			bigbutton0.$$.fragment.c();
    			t0 = space();
    			li1 = element("li");
    			bigbutton1.$$.fragment.c();
    			t1 = space();
    			li2 = element("li");
    			bigbutton2.$$.fragment.c();
    			t2 = space();
    			li3 = element("li");
    			bigbutton3.$$.fragment.c();
    			t3 = space();
    			section0 = element("section");
    			ul1 = element("ul");
    			li4 = element("li");
    			funcbutton0.$$.fragment.c();
    			t4 = space();
    			li5 = element("li");
    			funcbutton1.$$.fragment.c();
    			t5 = space();
    			li6 = element("li");
    			funcbutton2.$$.fragment.c();
    			t6 = space();
    			li7 = element("li");
    			funcbutton3.$$.fragment.c();
    			t7 = space();
    			ul2 = element("ul");
    			li8 = element("li");
    			funcbutton4.$$.fragment.c();
    			t8 = space();
    			li9 = element("li");
    			funcbutton5.$$.fragment.c();
    			t9 = space();
    			li10 = element("li");
    			funcbutton6.$$.fragment.c();
    			t10 = space();
    			li11 = element("li");
    			funcbutton7.$$.fragment.c();
    			attr_dev(li0, "class", "svelte-8d8zgf");
    			add_location(li0, file$3, 119, 6, 2560);
    			attr_dev(li1, "class", "svelte-8d8zgf");
    			add_location(li1, file$3, 122, 6, 2628);
    			attr_dev(li2, "class", "svelte-8d8zgf");
    			add_location(li2, file$3, 125, 6, 2699);
    			attr_dev(li3, "class", "svelte-8d8zgf");
    			add_location(li3, file$3, 128, 6, 2768);
    			attr_dev(ul0, "class", "big-buttons-list svelte-8d8zgf");
    			add_location(ul0, file$3, 118, 4, 2523);
    			attr_dev(li4, "class", "svelte-8d8zgf");
    			add_location(li4, file$3, 135, 8, 2923);
    			attr_dev(li5, "class", "svelte-8d8zgf");
    			add_location(li5, file$3, 138, 8, 3022);
    			attr_dev(li6, "class", "svelte-8d8zgf");
    			add_location(li6, file$3, 141, 8, 3121);
    			attr_dev(li7, "class", "svelte-8d8zgf");
    			add_location(li7, file$3, 144, 8, 3218);
    			attr_dev(ul1, "class", "func-butons svelte-8d8zgf");
    			add_location(ul1, file$3, 134, 6, 2889);
    			attr_dev(li8, "class", "svelte-8d8zgf");
    			add_location(li8, file$3, 149, 8, 3362);
    			attr_dev(li9, "class", "svelte-8d8zgf");
    			add_location(li9, file$3, 152, 8, 3457);
    			attr_dev(li10, "class", "svelte-8d8zgf");
    			add_location(li10, file$3, 155, 8, 3552);
    			attr_dev(li11, "class", "svelte-8d8zgf");
    			add_location(li11, file$3, 158, 8, 3647);
    			attr_dev(ul2, "class", "oper-buttons svelte-8d8zgf");
    			add_location(ul2, file$3, 148, 6, 3327);
    			attr_dev(section0, "class", "wrap-functions svelte-8d8zgf");
    			add_location(section0, file$3, 133, 4, 2849);
    			attr_dev(div, "class", "inner-keyboard-container svelte-8d8zgf");
    			add_location(div, file$3, 117, 2, 2479);
    			attr_dev(section1, "class", "keyboard-container svelte-8d8zgf");
    			add_location(section1, file$3, 116, 0, 2439);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section1, anchor);
    			append_dev(section1, div);
    			append_dev(div, ul0);
    			append_dev(ul0, li0);
    			mount_component(bigbutton0, li0, null);
    			append_dev(ul0, t0);
    			append_dev(ul0, li1);
    			mount_component(bigbutton1, li1, null);
    			append_dev(ul0, t1);
    			append_dev(ul0, li2);
    			mount_component(bigbutton2, li2, null);
    			append_dev(ul0, t2);
    			append_dev(ul0, li3);
    			mount_component(bigbutton3, li3, null);
    			append_dev(div, t3);
    			append_dev(div, section0);
    			append_dev(section0, ul1);
    			append_dev(ul1, li4);
    			mount_component(funcbutton0, li4, null);
    			append_dev(ul1, t4);
    			append_dev(ul1, li5);
    			mount_component(funcbutton1, li5, null);
    			append_dev(ul1, t5);
    			append_dev(ul1, li6);
    			mount_component(funcbutton2, li6, null);
    			append_dev(ul1, t6);
    			append_dev(ul1, li7);
    			mount_component(funcbutton3, li7, null);
    			append_dev(section0, t7);
    			append_dev(section0, ul2);
    			append_dev(ul2, li8);
    			mount_component(funcbutton4, li8, null);
    			append_dev(ul2, t8);
    			append_dev(ul2, li9);
    			mount_component(funcbutton5, li9, null);
    			append_dev(ul2, t9);
    			append_dev(ul2, li10);
    			mount_component(funcbutton6, li10, null);
    			append_dev(ul2, t10);
    			append_dev(ul2, li11);
    			mount_component(funcbutton7, li11, null);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(bigbutton0.$$.fragment, local);

    			transition_in(bigbutton1.$$.fragment, local);

    			transition_in(bigbutton2.$$.fragment, local);

    			transition_in(bigbutton3.$$.fragment, local);

    			transition_in(funcbutton0.$$.fragment, local);

    			transition_in(funcbutton1.$$.fragment, local);

    			transition_in(funcbutton2.$$.fragment, local);

    			transition_in(funcbutton3.$$.fragment, local);

    			transition_in(funcbutton4.$$.fragment, local);

    			transition_in(funcbutton5.$$.fragment, local);

    			transition_in(funcbutton6.$$.fragment, local);

    			transition_in(funcbutton7.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(bigbutton0.$$.fragment, local);
    			transition_out(bigbutton1.$$.fragment, local);
    			transition_out(bigbutton2.$$.fragment, local);
    			transition_out(bigbutton3.$$.fragment, local);
    			transition_out(funcbutton0.$$.fragment, local);
    			transition_out(funcbutton1.$$.fragment, local);
    			transition_out(funcbutton2.$$.fragment, local);
    			transition_out(funcbutton3.$$.fragment, local);
    			transition_out(funcbutton4.$$.fragment, local);
    			transition_out(funcbutton5.$$.fragment, local);
    			transition_out(funcbutton6.$$.fragment, local);
    			transition_out(funcbutton7.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section1);
    			}

    			destroy_component(bigbutton0);

    			destroy_component(bigbutton1);

    			destroy_component(bigbutton2);

    			destroy_component(bigbutton3);

    			destroy_component(funcbutton0);

    			destroy_component(funcbutton1);

    			destroy_component(funcbutton2);

    			destroy_component(funcbutton3);

    			destroy_component(funcbutton4);

    			destroy_component(funcbutton5);

    			destroy_component(funcbutton6);

    			destroy_component(funcbutton7);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	
      let { Keyboard } = $$props;

    	const writable_props = ['Keyboard'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Keyboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('Keyboard' in $$props) $$invalidate('Keyboard', Keyboard = $$props.Keyboard);
    	};

    	$$self.$capture_state = () => {
    		return { Keyboard };
    	};

    	$$self.$inject_state = $$props => {
    		if ('Keyboard' in $$props) $$invalidate('Keyboard', Keyboard = $$props.Keyboard);
    	};

    	return { Keyboard };
    }

    class Keyboard_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$3, safe_not_equal, ["Keyboard"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Keyboard_1", options, id: create_fragment$3.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.Keyboard === undefined && !('Keyboard' in props)) {
    			console.warn("<Keyboard> was created without expected prop 'Keyboard'");
    		}
    	}

    	get Keyboard() {
    		throw new Error("<Keyboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Keyboard(value) {
    		throw new Error("<Keyboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.12.0 */

    function create_fragment$4(ctx) {
    	var t, current;

    	var screen = new Screen({ $$inline: true });

    	var keyboard = new Keyboard_1({ $$inline: true });

    	const block = {
    		c: function create() {
    			screen.$$.fragment.c();
    			t = space();
    			keyboard.$$.fragment.c();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(screen, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(keyboard, target, anchor);
    			current = true;
    		},

    		p: noop,

    		i: function intro(local) {
    			if (current) return;
    			transition_in(screen.$$.fragment, local);

    			transition_in(keyboard.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(screen.$$.fragment, local);
    			transition_out(keyboard.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(screen, detaching);

    			if (detaching) {
    				detach_dev(t);
    			}

    			destroy_component(keyboard, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$4, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$4.name });
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
