
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
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

    const globals = (typeof window !== 'undefined' ? window : global);
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
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
    const { console: console_1 } = globals;

    const file = "src\\containers\\Screen.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.key = list[i];
    	return child_ctx;
    }

    // (165:8) {#each display as key}
    function create_each_block(ctx) {
    	var li, t_value = ctx.key + "", t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "char svelte-w7n64k");
    			add_location(li, file, 165, 10, 3315);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.display) && t_value !== (t_value = ctx.key + "")) {
    				set_data_dev(t, t_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(li);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(165:8) {#each display as key}", ctx });
    	return block;
    }

    function create_fragment(ctx) {
    	var section, div2, div1, ul0, t0, div0, span, t2, ul1, li0, t3, li1, t4, li2, t5, li3, t6, div4, div3;

    	let each_value = ctx.display;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div2 = element("div");
    			div1 = element("div");
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "TECTOY";
    			t2 = space();
    			ul1 = element("ul");
    			li0 = element("li");
    			t3 = space();
    			li1 = element("li");
    			t4 = space();
    			li2 = element("li");
    			t5 = space();
    			li3 = element("li");
    			t6 = space();
    			div4 = element("div");
    			div3 = element("div");
    			attr_dev(ul0, "class", "display svelte-w7n64k");
    			add_location(ul0, file, 163, 6, 3251);
    			attr_dev(span, "class", "text svelte-w7n64k");
    			add_location(span, file, 169, 8, 3413);
    			attr_dev(li0, "class", "color red svelte-w7n64k");
    			add_location(li0, file, 171, 10, 3486);
    			attr_dev(li1, "class", "color yellow svelte-w7n64k");
    			add_location(li1, file, 172, 10, 3522);
    			attr_dev(li2, "class", "color blue svelte-w7n64k");
    			add_location(li2, file, 173, 10, 3561);
    			attr_dev(li3, "class", "color green svelte-w7n64k");
    			add_location(li3, file, 174, 10, 3598);
    			attr_dev(ul1, "class", "colors svelte-w7n64k");
    			add_location(ul1, file, 170, 8, 3455);
    			attr_dev(div0, "class", "text-logo svelte-w7n64k");
    			add_location(div0, file, 168, 6, 3380);
    			attr_dev(div1, "class", "visor svelte-w7n64k");
    			add_location(div1, file, 162, 4, 3224);
    			attr_dev(div2, "class", "tela svelte-w7n64k");
    			add_location(div2, file, 161, 2, 3200);
    			attr_dev(div3, "class", "entrada-disquete svelte-w7n64k");
    			add_location(div3, file, 180, 4, 3707);
    			attr_dev(div4, "class", "disquete svelte-w7n64k");
    			add_location(div4, file, 179, 2, 3679);
    			attr_dev(section, "class", "svelte-w7n64k");
    			add_location(section, file, 160, 0, 3187);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div2);
    			append_dev(div2, div1);
    			append_dev(div1, ul0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul0, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t2);
    			append_dev(div0, ul1);
    			append_dev(ul1, li0);
    			append_dev(ul1, t3);
    			append_dev(ul1, li1);
    			append_dev(ul1, t4);
    			append_dev(ul1, li2);
    			append_dev(ul1, t5);
    			append_dev(ul1, li3);
    			append_dev(section, t6);
    			append_dev(section, div4);
    			append_dev(div4, div3);
    		},

    		p: function update(changed, ctx) {
    			if (changed.display) {
    				each_value = ctx.display;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { display } = $$props;
      console.log("rendering screen", display);

    	const writable_props = ['display'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1.warn(`<Screen> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('display' in $$props) $$invalidate('display', display = $$props.display);
    	};

    	$$self.$capture_state = () => {
    		return { display };
    	};

    	$$self.$inject_state = $$props => {
    		if ('display' in $$props) $$invalidate('display', display = $$props.display);
    	};

    	return { display };
    }

    class Screen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["display"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Screen", options, id: create_fragment.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.display === undefined && !('display' in props)) {
    			console_1.warn("<Screen> was created without expected prop 'display'");
    		}
    	}

    	get display() {
    		throw new Error("<Screen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set display(value) {
    		throw new Error("<Screen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\BigButton.svelte generated by Svelte v3.12.0 */
    const { console: console_1$1 } = globals;

    const file$1 = "src\\components\\BigButton.svelte";

    function create_fragment$1(ctx) {
    	var button, span, t, button_class_value, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span = element("span");
    			t = text(ctx.key);
    			attr_dev(span, "class", "text svelte-101k2jr");
    			add_location(span, file$1, 59, 2, 1064);
    			attr_dev(button, "class", button_class_value = "big-button -" + ctx.color + " svelte-101k2jr");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$1, 55, 0, 958);
    			dispose = listen_dev(button, "click", ctx.click_handler);
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

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { key, color, status } = $$props;
      const handleBigButtonClick = letter => {
        if (!status) {
          return;
        }
        console.log(letter);
        let audio = new Audio();
        audio.src = "./sounds/click.wav";
        audio.play();
      };

    	const writable_props = ['key', 'color', 'status'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1$1.warn(`<BigButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleBigButtonClick(key);

    	$$self.$set = $$props => {
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('color' in $$props) $$invalidate('color', color = $$props.color);
    		if ('status' in $$props) $$invalidate('status', status = $$props.status);
    	};

    	$$self.$capture_state = () => {
    		return { key, color, status };
    	};

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate('key', key = $$props.key);
    		if ('color' in $$props) $$invalidate('color', color = $$props.color);
    		if ('status' in $$props) $$invalidate('status', status = $$props.status);
    	};

    	return {
    		key,
    		color,
    		status,
    		handleBigButtonClick,
    		click_handler
    	};
    }

    class BigButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["key", "color", "status", "handleBigButtonClick"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "BigButton", options, id: create_fragment$1.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.key === undefined && !('key' in props)) {
    			console_1$1.warn("<BigButton> was created without expected prop 'key'");
    		}
    		if (ctx.color === undefined && !('color' in props)) {
    			console_1$1.warn("<BigButton> was created without expected prop 'color'");
    		}
    		if (ctx.status === undefined && !('status' in props)) {
    			console_1$1.warn("<BigButton> was created without expected prop 'status'");
    		}
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

    	get status() {
    		throw new Error("<BigButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<BigButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleBigButtonClick() {
    		return this.$$.ctx.handleBigButtonClick;
    	}

    	set handleBigButtonClick(value) {
    		throw new Error("<BigButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FunctionalButton.svelte generated by Svelte v3.12.0 */
    const { console: console_1$2 } = globals;

    const file$2 = "src\\components\\FunctionalButton.svelte";

    function create_fragment$2(ctx) {
    	var button, t, button_class_value, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(ctx.text);
    			attr_dev(button, "class", button_class_value = "functional-button -" + ctx.color + " -font-" + ctx.fontColor + " svelte-1pz1i0x");
    			add_location(button, file$2, 69, 0, 1283);
    			dispose = listen_dev(button, "click", ctx.click_handler);
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

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { text, color, fontColor, action, status } = $$props;

      const handleFunctionalButtonClick = text => {
        if (text !== "liga" && text !== "desl.") {
          if (!status) {
            return;
          }
        }
        console.log(text);
        let audio = new Audio();
        audio.src = "./sounds/click.wav";
        audio.play();
        if (text !== "liga" && text !== "desl.") {
          console.log("action: ", text);
          action && action(text);
        } else {
          action && action();
        }
      };

    	const writable_props = ['text', 'color', 'fontColor', 'action', 'status'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1$2.warn(`<FunctionalButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleFunctionalButtonClick(text);

    	$$self.$set = $$props => {
    		if ('text' in $$props) $$invalidate('text', text = $$props.text);
    		if ('color' in $$props) $$invalidate('color', color = $$props.color);
    		if ('fontColor' in $$props) $$invalidate('fontColor', fontColor = $$props.fontColor);
    		if ('action' in $$props) $$invalidate('action', action = $$props.action);
    		if ('status' in $$props) $$invalidate('status', status = $$props.status);
    	};

    	$$self.$capture_state = () => {
    		return { text, color, fontColor, action, status };
    	};

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate('text', text = $$props.text);
    		if ('color' in $$props) $$invalidate('color', color = $$props.color);
    		if ('fontColor' in $$props) $$invalidate('fontColor', fontColor = $$props.fontColor);
    		if ('action' in $$props) $$invalidate('action', action = $$props.action);
    		if ('status' in $$props) $$invalidate('status', status = $$props.status);
    	};

    	return {
    		text,
    		color,
    		fontColor,
    		action,
    		status,
    		handleFunctionalButtonClick,
    		click_handler
    	};
    }

    class FunctionalButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["text", "color", "fontColor", "action", "status", "handleFunctionalButtonClick"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "FunctionalButton", options, id: create_fragment$2.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.text === undefined && !('text' in props)) {
    			console_1$2.warn("<FunctionalButton> was created without expected prop 'text'");
    		}
    		if (ctx.color === undefined && !('color' in props)) {
    			console_1$2.warn("<FunctionalButton> was created without expected prop 'color'");
    		}
    		if (ctx.fontColor === undefined && !('fontColor' in props)) {
    			console_1$2.warn("<FunctionalButton> was created without expected prop 'fontColor'");
    		}
    		if (ctx.action === undefined && !('action' in props)) {
    			console_1$2.warn("<FunctionalButton> was created without expected prop 'action'");
    		}
    		if (ctx.status === undefined && !('status' in props)) {
    			console_1$2.warn("<FunctionalButton> was created without expected prop 'status'");
    		}
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

    	get action() {
    		throw new Error("<FunctionalButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<FunctionalButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get status() {
    		throw new Error("<FunctionalButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<FunctionalButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleFunctionalButtonClick() {
    		return this.$$.ctx.handleFunctionalButtonClick;
    	}

    	set handleFunctionalButtonClick(value) {
    		throw new Error("<FunctionalButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\MiddleButton.svelte generated by Svelte v3.12.0 */
    const { console: console_1$3 } = globals;

    const file$3 = "src\\components\\MiddleButton.svelte";

    function create_fragment$3(ctx) {
    	var button, span0, t0, t1, span1, t2, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			span0 = element("span");
    			t0 = text(ctx.number);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(ctx.text);
    			attr_dev(span0, "class", "number svelte-12fuhl8");
    			add_location(span0, file$3, 98, 2, 1943);
    			attr_dev(span1, "class", "tone svelte-12fuhl8");
    			add_location(span1, file$3, 99, 2, 1983);
    			attr_dev(button, "class", "middle-button svelte-12fuhl8");
    			add_location(button, file$3, 95, 0, 1848);
    			dispose = listen_dev(button, "click", ctx.click_handler);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span0);
    			append_dev(span0, t0);
    			append_dev(button, t1);
    			append_dev(button, span1);
    			append_dev(span1, t2);
    		},

    		p: function update(changed, ctx) {
    			if (changed.number) {
    				set_data_dev(t0, ctx.number);
    			}

    			if (changed.text) {
    				set_data_dev(t2, ctx.text);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { text, number, action, status, handleMiddleButtonClick = (number, text) => {
        if (!status) {
          return;
        }
        console.log(Number(number), text);
        let bu = "./sounds/";
        let audio = new Audio();
        switch (Number(number)) {
          case 1: {
            audio.src = bu + "do.wav";
            break;
          }
          case 2: {
            audio.src = bu + "re.wav";
            break;
          }
          case 3: {
            audio.src = bu + "mi.wav";
            break;
          }
          case 4: {
            audio.src = bu + "fa.wav";
            break;
          }
          case 5: {
            audio.src = bu + "sol.wav";
            break;
          }
          case 6: {
            audio.src = bu + "la.wav";
            break;
          }
          case 7: {
            audio.src = bu + "si.wav";
            break;
          }
          case 8: {
            audio.src = bu + "do-m.wav";
            break;
          }
          case 9: {
            audio.src = bu + "sol.wav";
            break;
          }
          default: {
            audio.src = bu + "sol.wav";
            break;
          }
        }
        console.log(audio);
        audio.play();
        action && action(number);
      } } = $$props;

    	const writable_props = ['text', 'number', 'action', 'status', 'handleMiddleButtonClick'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1$3.warn(`<MiddleButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleMiddleButtonClick(number, text);

    	$$self.$set = $$props => {
    		if ('text' in $$props) $$invalidate('text', text = $$props.text);
    		if ('number' in $$props) $$invalidate('number', number = $$props.number);
    		if ('action' in $$props) $$invalidate('action', action = $$props.action);
    		if ('status' in $$props) $$invalidate('status', status = $$props.status);
    		if ('handleMiddleButtonClick' in $$props) $$invalidate('handleMiddleButtonClick', handleMiddleButtonClick = $$props.handleMiddleButtonClick);
    	};

    	$$self.$capture_state = () => {
    		return { text, number, action, status, handleMiddleButtonClick };
    	};

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate('text', text = $$props.text);
    		if ('number' in $$props) $$invalidate('number', number = $$props.number);
    		if ('action' in $$props) $$invalidate('action', action = $$props.action);
    		if ('status' in $$props) $$invalidate('status', status = $$props.status);
    		if ('handleMiddleButtonClick' in $$props) $$invalidate('handleMiddleButtonClick', handleMiddleButtonClick = $$props.handleMiddleButtonClick);
    	};

    	return {
    		text,
    		number,
    		action,
    		status,
    		handleMiddleButtonClick,
    		click_handler
    	};
    }

    class MiddleButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["text", "number", "action", "status", "handleMiddleButtonClick"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "MiddleButton", options, id: create_fragment$3.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.text === undefined && !('text' in props)) {
    			console_1$3.warn("<MiddleButton> was created without expected prop 'text'");
    		}
    		if (ctx.number === undefined && !('number' in props)) {
    			console_1$3.warn("<MiddleButton> was created without expected prop 'number'");
    		}
    		if (ctx.action === undefined && !('action' in props)) {
    			console_1$3.warn("<MiddleButton> was created without expected prop 'action'");
    		}
    		if (ctx.status === undefined && !('status' in props)) {
    			console_1$3.warn("<MiddleButton> was created without expected prop 'status'");
    		}
    	}

    	get text() {
    		throw new Error("<MiddleButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<MiddleButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get number() {
    		throw new Error("<MiddleButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set number(value) {
    		throw new Error("<MiddleButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get action() {
    		throw new Error("<MiddleButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set action(value) {
    		throw new Error("<MiddleButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get status() {
    		throw new Error("<MiddleButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<MiddleButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleMiddleButtonClick() {
    		throw new Error("<MiddleButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleMiddleButtonClick(value) {
    		throw new Error("<MiddleButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\YellowButton.svelte generated by Svelte v3.12.0 */
    const { console: console_1$4 } = globals;

    const file$4 = "src\\components\\YellowButton.svelte";

    function create_fragment$4(ctx) {
    	var button, t, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(ctx.text);
    			attr_dev(button, "class", "yellow-button svelte-198d3mt");
    			add_location(button, file$4, 35, 0, 634);
    			dispose = listen_dev(button, "click", ctx.click_handler);
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
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { text, status } = $$props;
      const handleYellowClick = text => {
        if (!status) {
          return;
        }
        console.log(text);
        let audio = new Audio();
        audio.src = "./sounds/click.wav";
        audio.play();
      };

    	const writable_props = ['text', 'status'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1$4.warn(`<YellowButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleYellowClick(text);

    	$$self.$set = $$props => {
    		if ('text' in $$props) $$invalidate('text', text = $$props.text);
    		if ('status' in $$props) $$invalidate('status', status = $$props.status);
    	};

    	$$self.$capture_state = () => {
    		return { text, status };
    	};

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate('text', text = $$props.text);
    		if ('status' in $$props) $$invalidate('status', status = $$props.status);
    	};

    	return {
    		text,
    		status,
    		handleYellowClick,
    		click_handler
    	};
    }

    class YellowButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["text", "status", "handleYellowClick"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "YellowButton", options, id: create_fragment$4.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.text === undefined && !('text' in props)) {
    			console_1$4.warn("<YellowButton> was created without expected prop 'text'");
    		}
    		if (ctx.status === undefined && !('status' in props)) {
    			console_1$4.warn("<YellowButton> was created without expected prop 'status'");
    		}
    	}

    	get text() {
    		throw new Error("<YellowButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<YellowButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get status() {
    		throw new Error("<YellowButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<YellowButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleYellowClick() {
    		return this.$$.ctx.handleYellowClick;
    	}

    	set handleYellowClick(value) {
    		throw new Error("<YellowButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\containers\Keyboard.svelte generated by Svelte v3.12.0 */

    const file$5 = "src\\containers\\Keyboard.svelte";

    function create_fragment$5(ctx) {
    	var section3, div, ul0, li0, t0, li1, t1, li2, t2, li3, t3, section0, ul1, li4, t4, li5, t5, li6, t6, li7, t7, ul2, li8, t8, li9, t9, li10, t10, li11, t11, section1, ul3, li12, t12, li13, t13, li14, t14, li15, t15, li16, t16, li17, t17, li18, t18, li19, t19, li20, t20, li21, t21, section2, ul4, li22, t22, li23, t23, li24, t24, li25, t25, li26, t26, li27, t27, li28, t28, li29, t29, li30, t30, li31, current;

    	var bigbutton0 = new BigButton({
    		props: {
    		key: "A",
    		color: "red",
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var bigbutton1 = new BigButton({
    		props: {
    		key: "B",
    		color: "yellow",
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var bigbutton2 = new BigButton({
    		props: {
    		key: "C",
    		color: "blue",
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var bigbutton3 = new BigButton({
    		props: {
    		key: "D",
    		color: "green",
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var funcbutton0 = new FunctionalButton({
    		props: {
    		text: "enter",
    		color: "white",
    		fontColor: "blue",
    		status: ctx.status,
    		action: ctx.handleFunction
    	},
    		$$inline: true
    	});

    	var funcbutton1 = new FunctionalButton({
    		props: {
    		text: "livro",
    		color: "white",
    		fontColor: "blue",
    		status: ctx.status,
    		action: ctx.handleFunction
    	},
    		$$inline: true
    	});

    	var funcbutton2 = new FunctionalButton({
    		props: {
    		text: "desl.",
    		color: "red",
    		fontColor: "blue",
    		action: ctx.turnOff,
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var funcbutton3 = new FunctionalButton({
    		props: {
    		text: "liga",
    		color: "green",
    		fontColor: "blue",
    		action: ctx.turnOn,
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var funcbutton4 = new FunctionalButton({
    		props: {
    		text: "+",
    		color: "blue",
    		fontColor: "white",
    		status: ctx.status,
    		action: ctx.handleFunction
    	},
    		$$inline: true
    	});

    	var funcbutton5 = new FunctionalButton({
    		props: {
    		text: "-",
    		color: "blue",
    		fontColor: "white",
    		status: ctx.status,
    		action: ctx.handleFunction
    	},
    		$$inline: true
    	});

    	var funcbutton6 = new FunctionalButton({
    		props: {
    		text: "X",
    		color: "blue",
    		fontColor: "white",
    		status: ctx.status,
    		action: ctx.handleFunction
    	},
    		$$inline: true
    	});

    	var funcbutton7 = new FunctionalButton({
    		props: {
    		text: "÷",
    		color: "blue",
    		fontColor: "white",
    		status: ctx.status,
    		action: ctx.handleFunction
    	},
    		$$inline: true
    	});

    	var middlekey0 = new MiddleButton({
    		props: {
    		number: "0",
    		text: "pausa",
    		action: ctx.handleNumberInsert,
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var middlekey1 = new MiddleButton({
    		props: {
    		number: "1",
    		text: "dó",
    		action: ctx.handleNumberInsert,
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var middlekey2 = new MiddleButton({
    		props: {
    		number: "2",
    		text: "ré",
    		action: ctx.handleNumberInsert,
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var middlekey3 = new MiddleButton({
    		props: {
    		number: "3",
    		text: "mi",
    		action: ctx.handleNumberInsert,
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var middlekey4 = new MiddleButton({
    		props: {
    		number: "4",
    		text: "fá",
    		action: ctx.handleNumberInsert,
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var middlekey5 = new MiddleButton({
    		props: {
    		number: "5",
    		text: "sol",
    		action: ctx.handleNumberInsert,
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var middlekey6 = new MiddleButton({
    		props: {
    		number: "6",
    		text: "lá",
    		action: ctx.handleNumberInsert,
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var middlekey7 = new MiddleButton({
    		props: {
    		number: "7",
    		text: "si",
    		action: ctx.handleNumberInsert,
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var middlekey8 = new MiddleButton({
    		props: {
    		number: "8",
    		text: "dó",
    		action: ctx.handleNumberInsert,
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var middlekey9 = new MiddleButton({
    		props: {
    		number: "9",
    		text: "ré",
    		action: ctx.handleNumberInsert,
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var yellowbutton0 = new YellowButton({
    		props: { text: "adição", status: ctx.status },
    		$$inline: true
    	});

    	var yellowbutton1 = new YellowButton({
    		props: { text: "subtração", status: ctx.status },
    		$$inline: true
    	});

    	var yellowbutton2 = new YellowButton({
    		props: {
    		text: "multiplicação",
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var yellowbutton3 = new YellowButton({
    		props: { text: "divisão", status: ctx.status },
    		$$inline: true
    	});

    	var yellowbutton4 = new YellowButton({
    		props: {
    		text: "aritmética",
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var yellowbutton5 = new YellowButton({
    		props: { text: "operação", status: ctx.status },
    		$$inline: true
    	});

    	var yellowbutton6 = new YellowButton({
    		props: { text: "siga-me", status: ctx.status },
    		$$inline: true
    	});

    	var yellowbutton7 = new YellowButton({
    		props: {
    		text: "memória tons",
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var yellowbutton8 = new YellowButton({
    		props: {
    		text: "número do meio",
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	var yellowbutton9 = new YellowButton({
    		props: {
    		text: "advinhe o número",
    		status: ctx.status
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			section3 = element("section");
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
    			t11 = space();
    			section1 = element("section");
    			ul3 = element("ul");
    			li12 = element("li");
    			middlekey0.$$.fragment.c();
    			t12 = space();
    			li13 = element("li");
    			middlekey1.$$.fragment.c();
    			t13 = space();
    			li14 = element("li");
    			middlekey2.$$.fragment.c();
    			t14 = space();
    			li15 = element("li");
    			middlekey3.$$.fragment.c();
    			t15 = space();
    			li16 = element("li");
    			middlekey4.$$.fragment.c();
    			t16 = space();
    			li17 = element("li");
    			middlekey5.$$.fragment.c();
    			t17 = space();
    			li18 = element("li");
    			middlekey6.$$.fragment.c();
    			t18 = space();
    			li19 = element("li");
    			middlekey7.$$.fragment.c();
    			t19 = space();
    			li20 = element("li");
    			middlekey8.$$.fragment.c();
    			t20 = space();
    			li21 = element("li");
    			middlekey9.$$.fragment.c();
    			t21 = space();
    			section2 = element("section");
    			ul4 = element("ul");
    			li22 = element("li");
    			yellowbutton0.$$.fragment.c();
    			t22 = space();
    			li23 = element("li");
    			yellowbutton1.$$.fragment.c();
    			t23 = space();
    			li24 = element("li");
    			yellowbutton2.$$.fragment.c();
    			t24 = space();
    			li25 = element("li");
    			yellowbutton3.$$.fragment.c();
    			t25 = space();
    			li26 = element("li");
    			yellowbutton4.$$.fragment.c();
    			t26 = space();
    			li27 = element("li");
    			yellowbutton5.$$.fragment.c();
    			t27 = space();
    			li28 = element("li");
    			yellowbutton6.$$.fragment.c();
    			t28 = space();
    			li29 = element("li");
    			yellowbutton7.$$.fragment.c();
    			t29 = space();
    			li30 = element("li");
    			yellowbutton8.$$.fragment.c();
    			t30 = space();
    			li31 = element("li");
    			yellowbutton9.$$.fragment.c();
    			attr_dev(li0, "class", "svelte-1v97djx");
    			add_location(li0, file$5, 195, 6, 4355);
    			attr_dev(li1, "class", "svelte-1v97djx");
    			add_location(li1, file$5, 198, 6, 4432);
    			attr_dev(li2, "class", "svelte-1v97djx");
    			add_location(li2, file$5, 201, 6, 4512);
    			attr_dev(li3, "class", "svelte-1v97djx");
    			add_location(li3, file$5, 204, 6, 4590);
    			attr_dev(ul0, "class", "big-buttons-list svelte-1v97djx");
    			add_location(ul0, file$5, 194, 4, 4318);
    			attr_dev(li4, "class", "svelte-1v97djx");
    			add_location(li4, file$5, 211, 8, 4754);
    			attr_dev(li5, "class", "svelte-1v97djx");
    			add_location(li5, file$5, 219, 8, 4951);
    			attr_dev(li6, "class", "svelte-1v97djx");
    			add_location(li6, file$5, 227, 8, 5148);
    			attr_dev(li7, "class", "svelte-1v97djx");
    			add_location(li7, file$5, 235, 8, 5336);
    			attr_dev(ul1, "class", "func-butons svelte-1v97djx");
    			add_location(ul1, file$5, 210, 6, 4720);
    			attr_dev(li8, "class", "svelte-1v97djx");
    			add_location(li8, file$5, 245, 8, 5570);
    			attr_dev(li9, "class", "svelte-1v97djx");
    			add_location(li9, file$5, 253, 8, 5763);
    			attr_dev(li10, "class", "svelte-1v97djx");
    			add_location(li10, file$5, 261, 8, 5956);
    			attr_dev(li11, "class", "svelte-1v97djx");
    			add_location(li11, file$5, 269, 8, 6149);
    			attr_dev(ul2, "class", "oper-buttons svelte-1v97djx");
    			add_location(ul2, file$5, 244, 6, 5535);
    			attr_dev(section0, "class", "wrap-functions svelte-1v97djx");
    			add_location(section0, file$5, 209, 4, 4680);
    			attr_dev(li12, "class", "svelte-1v97djx");
    			add_location(li12, file$5, 281, 8, 6441);
    			attr_dev(li13, "class", "svelte-1v97djx");
    			add_location(li13, file$5, 288, 8, 6608);
    			attr_dev(li14, "class", "svelte-1v97djx");
    			add_location(li14, file$5, 295, 8, 6772);
    			attr_dev(li15, "class", "svelte-1v97djx");
    			add_location(li15, file$5, 302, 8, 6936);
    			attr_dev(li16, "class", "svelte-1v97djx");
    			add_location(li16, file$5, 309, 8, 7100);
    			attr_dev(li17, "class", "svelte-1v97djx");
    			add_location(li17, file$5, 316, 8, 7264);
    			attr_dev(li18, "class", "svelte-1v97djx");
    			add_location(li18, file$5, 323, 8, 7429);
    			attr_dev(li19, "class", "svelte-1v97djx");
    			add_location(li19, file$5, 330, 8, 7593);
    			attr_dev(li20, "class", "svelte-1v97djx");
    			add_location(li20, file$5, 337, 8, 7757);
    			attr_dev(li21, "class", "svelte-1v97djx");
    			add_location(li21, file$5, 344, 8, 7921);
    			attr_dev(ul3, "class", "middle-buttons svelte-1v97djx");
    			add_location(ul3, file$5, 280, 6, 6404);
    			attr_dev(section1, "class", "wrap-middle svelte-1v97djx");
    			add_location(section1, file$5, 279, 4, 6367);
    			attr_dev(li22, "class", "svelte-1v97djx");
    			add_location(li22, file$5, 355, 8, 8184);
    			attr_dev(li23, "class", "svelte-1v97djx");
    			add_location(li23, file$5, 358, 8, 8264);
    			attr_dev(li24, "class", "svelte-1v97djx");
    			add_location(li24, file$5, 361, 8, 8347);
    			attr_dev(li25, "class", "svelte-1v97djx");
    			add_location(li25, file$5, 364, 8, 8434);
    			attr_dev(li26, "class", "svelte-1v97djx");
    			add_location(li26, file$5, 367, 8, 8515);
    			attr_dev(li27, "class", "svelte-1v97djx");
    			add_location(li27, file$5, 370, 8, 8599);
    			attr_dev(li28, "class", "svelte-1v97djx");
    			add_location(li28, file$5, 373, 8, 8681);
    			attr_dev(li29, "class", "svelte-1v97djx");
    			add_location(li29, file$5, 376, 8, 8762);
    			attr_dev(li30, "class", "svelte-1v97djx");
    			add_location(li30, file$5, 379, 8, 8848);
    			attr_dev(li31, "class", "svelte-1v97djx");
    			add_location(li31, file$5, 382, 8, 8936);
    			attr_dev(ul4, "class", "yellow-buttons svelte-1v97djx");
    			add_location(ul4, file$5, 354, 6, 8147);
    			attr_dev(section2, "class", "wrap-yellow svelte-1v97djx");
    			add_location(section2, file$5, 353, 4, 8110);
    			attr_dev(div, "class", "inner-keyboard-container svelte-1v97djx");
    			add_location(div, file$5, 193, 2, 4274);
    			attr_dev(section3, "class", "keyboard-container svelte-1v97djx");
    			add_location(section3, file$5, 192, 0, 4234);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section3, anchor);
    			append_dev(section3, div);
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
    			append_dev(div, t11);
    			append_dev(div, section1);
    			append_dev(section1, ul3);
    			append_dev(ul3, li12);
    			mount_component(middlekey0, li12, null);
    			append_dev(ul3, t12);
    			append_dev(ul3, li13);
    			mount_component(middlekey1, li13, null);
    			append_dev(ul3, t13);
    			append_dev(ul3, li14);
    			mount_component(middlekey2, li14, null);
    			append_dev(ul3, t14);
    			append_dev(ul3, li15);
    			mount_component(middlekey3, li15, null);
    			append_dev(ul3, t15);
    			append_dev(ul3, li16);
    			mount_component(middlekey4, li16, null);
    			append_dev(ul3, t16);
    			append_dev(ul3, li17);
    			mount_component(middlekey5, li17, null);
    			append_dev(ul3, t17);
    			append_dev(ul3, li18);
    			mount_component(middlekey6, li18, null);
    			append_dev(ul3, t18);
    			append_dev(ul3, li19);
    			mount_component(middlekey7, li19, null);
    			append_dev(ul3, t19);
    			append_dev(ul3, li20);
    			mount_component(middlekey8, li20, null);
    			append_dev(ul3, t20);
    			append_dev(ul3, li21);
    			mount_component(middlekey9, li21, null);
    			append_dev(div, t21);
    			append_dev(div, section2);
    			append_dev(section2, ul4);
    			append_dev(ul4, li22);
    			mount_component(yellowbutton0, li22, null);
    			append_dev(ul4, t22);
    			append_dev(ul4, li23);
    			mount_component(yellowbutton1, li23, null);
    			append_dev(ul4, t23);
    			append_dev(ul4, li24);
    			mount_component(yellowbutton2, li24, null);
    			append_dev(ul4, t24);
    			append_dev(ul4, li25);
    			mount_component(yellowbutton3, li25, null);
    			append_dev(ul4, t25);
    			append_dev(ul4, li26);
    			mount_component(yellowbutton4, li26, null);
    			append_dev(ul4, t26);
    			append_dev(ul4, li27);
    			mount_component(yellowbutton5, li27, null);
    			append_dev(ul4, t27);
    			append_dev(ul4, li28);
    			mount_component(yellowbutton6, li28, null);
    			append_dev(ul4, t28);
    			append_dev(ul4, li29);
    			mount_component(yellowbutton7, li29, null);
    			append_dev(ul4, t29);
    			append_dev(ul4, li30);
    			mount_component(yellowbutton8, li30, null);
    			append_dev(ul4, t30);
    			append_dev(ul4, li31);
    			mount_component(yellowbutton9, li31, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var bigbutton0_changes = {};
    			if (changed.status) bigbutton0_changes.status = ctx.status;
    			bigbutton0.$set(bigbutton0_changes);

    			var bigbutton1_changes = {};
    			if (changed.status) bigbutton1_changes.status = ctx.status;
    			bigbutton1.$set(bigbutton1_changes);

    			var bigbutton2_changes = {};
    			if (changed.status) bigbutton2_changes.status = ctx.status;
    			bigbutton2.$set(bigbutton2_changes);

    			var bigbutton3_changes = {};
    			if (changed.status) bigbutton3_changes.status = ctx.status;
    			bigbutton3.$set(bigbutton3_changes);

    			var funcbutton0_changes = {};
    			if (changed.status) funcbutton0_changes.status = ctx.status;
    			if (changed.handleFunction) funcbutton0_changes.action = ctx.handleFunction;
    			funcbutton0.$set(funcbutton0_changes);

    			var funcbutton1_changes = {};
    			if (changed.status) funcbutton1_changes.status = ctx.status;
    			if (changed.handleFunction) funcbutton1_changes.action = ctx.handleFunction;
    			funcbutton1.$set(funcbutton1_changes);

    			var funcbutton2_changes = {};
    			if (changed.turnOff) funcbutton2_changes.action = ctx.turnOff;
    			if (changed.status) funcbutton2_changes.status = ctx.status;
    			funcbutton2.$set(funcbutton2_changes);

    			var funcbutton3_changes = {};
    			if (changed.turnOn) funcbutton3_changes.action = ctx.turnOn;
    			if (changed.status) funcbutton3_changes.status = ctx.status;
    			funcbutton3.$set(funcbutton3_changes);

    			var funcbutton4_changes = {};
    			if (changed.status) funcbutton4_changes.status = ctx.status;
    			if (changed.handleFunction) funcbutton4_changes.action = ctx.handleFunction;
    			funcbutton4.$set(funcbutton4_changes);

    			var funcbutton5_changes = {};
    			if (changed.status) funcbutton5_changes.status = ctx.status;
    			if (changed.handleFunction) funcbutton5_changes.action = ctx.handleFunction;
    			funcbutton5.$set(funcbutton5_changes);

    			var funcbutton6_changes = {};
    			if (changed.status) funcbutton6_changes.status = ctx.status;
    			if (changed.handleFunction) funcbutton6_changes.action = ctx.handleFunction;
    			funcbutton6.$set(funcbutton6_changes);

    			var funcbutton7_changes = {};
    			if (changed.status) funcbutton7_changes.status = ctx.status;
    			if (changed.handleFunction) funcbutton7_changes.action = ctx.handleFunction;
    			funcbutton7.$set(funcbutton7_changes);

    			var middlekey0_changes = {};
    			if (changed.handleNumberInsert) middlekey0_changes.action = ctx.handleNumberInsert;
    			if (changed.status) middlekey0_changes.status = ctx.status;
    			middlekey0.$set(middlekey0_changes);

    			var middlekey1_changes = {};
    			if (changed.handleNumberInsert) middlekey1_changes.action = ctx.handleNumberInsert;
    			if (changed.status) middlekey1_changes.status = ctx.status;
    			middlekey1.$set(middlekey1_changes);

    			var middlekey2_changes = {};
    			if (changed.handleNumberInsert) middlekey2_changes.action = ctx.handleNumberInsert;
    			if (changed.status) middlekey2_changes.status = ctx.status;
    			middlekey2.$set(middlekey2_changes);

    			var middlekey3_changes = {};
    			if (changed.handleNumberInsert) middlekey3_changes.action = ctx.handleNumberInsert;
    			if (changed.status) middlekey3_changes.status = ctx.status;
    			middlekey3.$set(middlekey3_changes);

    			var middlekey4_changes = {};
    			if (changed.handleNumberInsert) middlekey4_changes.action = ctx.handleNumberInsert;
    			if (changed.status) middlekey4_changes.status = ctx.status;
    			middlekey4.$set(middlekey4_changes);

    			var middlekey5_changes = {};
    			if (changed.handleNumberInsert) middlekey5_changes.action = ctx.handleNumberInsert;
    			if (changed.status) middlekey5_changes.status = ctx.status;
    			middlekey5.$set(middlekey5_changes);

    			var middlekey6_changes = {};
    			if (changed.handleNumberInsert) middlekey6_changes.action = ctx.handleNumberInsert;
    			if (changed.status) middlekey6_changes.status = ctx.status;
    			middlekey6.$set(middlekey6_changes);

    			var middlekey7_changes = {};
    			if (changed.handleNumberInsert) middlekey7_changes.action = ctx.handleNumberInsert;
    			if (changed.status) middlekey7_changes.status = ctx.status;
    			middlekey7.$set(middlekey7_changes);

    			var middlekey8_changes = {};
    			if (changed.handleNumberInsert) middlekey8_changes.action = ctx.handleNumberInsert;
    			if (changed.status) middlekey8_changes.status = ctx.status;
    			middlekey8.$set(middlekey8_changes);

    			var middlekey9_changes = {};
    			if (changed.handleNumberInsert) middlekey9_changes.action = ctx.handleNumberInsert;
    			if (changed.status) middlekey9_changes.status = ctx.status;
    			middlekey9.$set(middlekey9_changes);

    			var yellowbutton0_changes = {};
    			if (changed.status) yellowbutton0_changes.status = ctx.status;
    			yellowbutton0.$set(yellowbutton0_changes);

    			var yellowbutton1_changes = {};
    			if (changed.status) yellowbutton1_changes.status = ctx.status;
    			yellowbutton1.$set(yellowbutton1_changes);

    			var yellowbutton2_changes = {};
    			if (changed.status) yellowbutton2_changes.status = ctx.status;
    			yellowbutton2.$set(yellowbutton2_changes);

    			var yellowbutton3_changes = {};
    			if (changed.status) yellowbutton3_changes.status = ctx.status;
    			yellowbutton3.$set(yellowbutton3_changes);

    			var yellowbutton4_changes = {};
    			if (changed.status) yellowbutton4_changes.status = ctx.status;
    			yellowbutton4.$set(yellowbutton4_changes);

    			var yellowbutton5_changes = {};
    			if (changed.status) yellowbutton5_changes.status = ctx.status;
    			yellowbutton5.$set(yellowbutton5_changes);

    			var yellowbutton6_changes = {};
    			if (changed.status) yellowbutton6_changes.status = ctx.status;
    			yellowbutton6.$set(yellowbutton6_changes);

    			var yellowbutton7_changes = {};
    			if (changed.status) yellowbutton7_changes.status = ctx.status;
    			yellowbutton7.$set(yellowbutton7_changes);

    			var yellowbutton8_changes = {};
    			if (changed.status) yellowbutton8_changes.status = ctx.status;
    			yellowbutton8.$set(yellowbutton8_changes);

    			var yellowbutton9_changes = {};
    			if (changed.status) yellowbutton9_changes.status = ctx.status;
    			yellowbutton9.$set(yellowbutton9_changes);
    		},

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

    			transition_in(middlekey0.$$.fragment, local);

    			transition_in(middlekey1.$$.fragment, local);

    			transition_in(middlekey2.$$.fragment, local);

    			transition_in(middlekey3.$$.fragment, local);

    			transition_in(middlekey4.$$.fragment, local);

    			transition_in(middlekey5.$$.fragment, local);

    			transition_in(middlekey6.$$.fragment, local);

    			transition_in(middlekey7.$$.fragment, local);

    			transition_in(middlekey8.$$.fragment, local);

    			transition_in(middlekey9.$$.fragment, local);

    			transition_in(yellowbutton0.$$.fragment, local);

    			transition_in(yellowbutton1.$$.fragment, local);

    			transition_in(yellowbutton2.$$.fragment, local);

    			transition_in(yellowbutton3.$$.fragment, local);

    			transition_in(yellowbutton4.$$.fragment, local);

    			transition_in(yellowbutton5.$$.fragment, local);

    			transition_in(yellowbutton6.$$.fragment, local);

    			transition_in(yellowbutton7.$$.fragment, local);

    			transition_in(yellowbutton8.$$.fragment, local);

    			transition_in(yellowbutton9.$$.fragment, local);

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
    			transition_out(middlekey0.$$.fragment, local);
    			transition_out(middlekey1.$$.fragment, local);
    			transition_out(middlekey2.$$.fragment, local);
    			transition_out(middlekey3.$$.fragment, local);
    			transition_out(middlekey4.$$.fragment, local);
    			transition_out(middlekey5.$$.fragment, local);
    			transition_out(middlekey6.$$.fragment, local);
    			transition_out(middlekey7.$$.fragment, local);
    			transition_out(middlekey8.$$.fragment, local);
    			transition_out(middlekey9.$$.fragment, local);
    			transition_out(yellowbutton0.$$.fragment, local);
    			transition_out(yellowbutton1.$$.fragment, local);
    			transition_out(yellowbutton2.$$.fragment, local);
    			transition_out(yellowbutton3.$$.fragment, local);
    			transition_out(yellowbutton4.$$.fragment, local);
    			transition_out(yellowbutton5.$$.fragment, local);
    			transition_out(yellowbutton6.$$.fragment, local);
    			transition_out(yellowbutton7.$$.fragment, local);
    			transition_out(yellowbutton8.$$.fragment, local);
    			transition_out(yellowbutton9.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section3);
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

    			destroy_component(middlekey0);

    			destroy_component(middlekey1);

    			destroy_component(middlekey2);

    			destroy_component(middlekey3);

    			destroy_component(middlekey4);

    			destroy_component(middlekey5);

    			destroy_component(middlekey6);

    			destroy_component(middlekey7);

    			destroy_component(middlekey8);

    			destroy_component(middlekey9);

    			destroy_component(yellowbutton0);

    			destroy_component(yellowbutton1);

    			destroy_component(yellowbutton2);

    			destroy_component(yellowbutton3);

    			destroy_component(yellowbutton4);

    			destroy_component(yellowbutton5);

    			destroy_component(yellowbutton6);

    			destroy_component(yellowbutton7);

    			destroy_component(yellowbutton8);

    			destroy_component(yellowbutton9);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	

      let { turnOn, turnOff, updateDisplay, handleNumberInsert, handleFunction, status } = $$props;

      // onMount(() => {
      //   const elements = document.querySelectorAll("button");
      //   elements.forEach(el => el.addEventListener("click", hi));
      //   // console.log(elements);
      // });

    	const writable_props = ['turnOn', 'turnOff', 'updateDisplay', 'handleNumberInsert', 'handleFunction', 'status'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Keyboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('turnOn' in $$props) $$invalidate('turnOn', turnOn = $$props.turnOn);
    		if ('turnOff' in $$props) $$invalidate('turnOff', turnOff = $$props.turnOff);
    		if ('updateDisplay' in $$props) $$invalidate('updateDisplay', updateDisplay = $$props.updateDisplay);
    		if ('handleNumberInsert' in $$props) $$invalidate('handleNumberInsert', handleNumberInsert = $$props.handleNumberInsert);
    		if ('handleFunction' in $$props) $$invalidate('handleFunction', handleFunction = $$props.handleFunction);
    		if ('status' in $$props) $$invalidate('status', status = $$props.status);
    	};

    	$$self.$capture_state = () => {
    		return { turnOn, turnOff, updateDisplay, handleNumberInsert, handleFunction, status };
    	};

    	$$self.$inject_state = $$props => {
    		if ('turnOn' in $$props) $$invalidate('turnOn', turnOn = $$props.turnOn);
    		if ('turnOff' in $$props) $$invalidate('turnOff', turnOff = $$props.turnOff);
    		if ('updateDisplay' in $$props) $$invalidate('updateDisplay', updateDisplay = $$props.updateDisplay);
    		if ('handleNumberInsert' in $$props) $$invalidate('handleNumberInsert', handleNumberInsert = $$props.handleNumberInsert);
    		if ('handleFunction' in $$props) $$invalidate('handleFunction', handleFunction = $$props.handleFunction);
    		if ('status' in $$props) $$invalidate('status', status = $$props.status);
    	};

    	return {
    		turnOn,
    		turnOff,
    		updateDisplay,
    		handleNumberInsert,
    		handleFunction,
    		status
    	};
    }

    class Keyboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, ["turnOn", "turnOff", "updateDisplay", "handleNumberInsert", "handleFunction", "status"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Keyboard", options, id: create_fragment$5.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.turnOn === undefined && !('turnOn' in props)) {
    			console.warn("<Keyboard> was created without expected prop 'turnOn'");
    		}
    		if (ctx.turnOff === undefined && !('turnOff' in props)) {
    			console.warn("<Keyboard> was created without expected prop 'turnOff'");
    		}
    		if (ctx.updateDisplay === undefined && !('updateDisplay' in props)) {
    			console.warn("<Keyboard> was created without expected prop 'updateDisplay'");
    		}
    		if (ctx.handleNumberInsert === undefined && !('handleNumberInsert' in props)) {
    			console.warn("<Keyboard> was created without expected prop 'handleNumberInsert'");
    		}
    		if (ctx.handleFunction === undefined && !('handleFunction' in props)) {
    			console.warn("<Keyboard> was created without expected prop 'handleFunction'");
    		}
    		if (ctx.status === undefined && !('status' in props)) {
    			console.warn("<Keyboard> was created without expected prop 'status'");
    		}
    	}

    	get turnOn() {
    		throw new Error("<Keyboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set turnOn(value) {
    		throw new Error("<Keyboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get turnOff() {
    		throw new Error("<Keyboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set turnOff(value) {
    		throw new Error("<Keyboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateDisplay() {
    		throw new Error("<Keyboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateDisplay(value) {
    		throw new Error("<Keyboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleNumberInsert() {
    		throw new Error("<Keyboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleNumberInsert(value) {
    		throw new Error("<Keyboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleFunction() {
    		throw new Error("<Keyboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleFunction(value) {
    		throw new Error("<Keyboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get status() {
    		throw new Error("<Keyboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<Keyboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    // export const display = writable(["", "", "", "", "", "", ""]);
    const display = writable({
      status: false,
      displayValue: ['w', 'e', 'l', 'c', 'o', 'm', 'e'],
      operation: null,
      values: [0, 0],
      current: 0
    });

    /* src\App.svelte generated by Svelte v3.12.0 */
    const { console: console_1$5 } = globals;

    function create_fragment$6(ctx) {
    	var t, current;

    	var screen = new Screen({
    		props: { display: ctx.display.displayValue },
    		$$inline: true
    	});

    	var keyboard = new Keyboard({
    		props: {
    		turnOn: ctx.turn_on,
    		turnOff: ctx.turn_off,
    		updateDisplay: ctx.updateDisplay,
    		handleNumberInsert: ctx.setDigit,
    		status: ctx.display.status,
    		handleFunction: ctx.setOperation
    	},
    		$$inline: true
    	});

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

    		p: function update(changed, ctx) {
    			var screen_changes = {};
    			if (changed.display) screen_changes.display = ctx.display.displayValue;
    			screen.$set(screen_changes);

    			var keyboard_changes = {};
    			if (changed.turn_on) keyboard_changes.turnOn = ctx.turn_on;
    			if (changed.turn_off) keyboard_changes.turnOff = ctx.turn_off;
    			if (changed.updateDisplay) keyboard_changes.updateDisplay = ctx.updateDisplay;
    			if (changed.display) keyboard_changes.status = ctx.display.status;
    			keyboard.$set(keyboard_changes);
    		},

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
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$6.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	

      let { initialState = {
        status: false,
        displayValue: [0, 0, 0, 0, 0, 0, 0],
        operation: null,
        values: [0, 0],
        current: 0
      }, display_off = ["", "", "", "", "", "", ""], display_on = [0, 0, 0, 0, 0, 0, 0] } = $$props;

      let display$1;

      const unsubscribe = display.subscribe(value => {
        // console.log("dp: ", value);
        $$invalidate('display', display$1 = value);
      });

      let { turn_on = () => {
        console.log("ligando");
        updateDisplay({ ...initialState, status: true });
      } } = $$props;

      let { turn_off = () => {
        console.log("desligando");
        let newValue = { ...display$1, displayValue: display_off, status: false };
        updateDisplay(newValue);
      } } = $$props;

      let { updateDisplay = newValue => {
        display.update(value => {
          return newValue;
        });
      } } = $$props;

      // export let handleNumberInsert = number => {
      //   console.log("number from handle: " + number);
      // };

      const setOperation = operation => {
        console.log(`operation: ${operation}`);
        if (display$1.current === 0) {
          updateDisplay({
            ...display$1,
            operation,
            current: 1
          });
        } else {
          const equals = operation === "enter";
          const currentOperation = display$1.operation;

          const values = [...display$1.values];
          try {
            values[0] = eval(`${values[0]} ${currentOperation} ${values[1]}`);
          } catch (e) {
            values[0] = display$1.values[0];
            console.log(e);
          }
          values[1] = 0;

          updateDisplay({
            ...display$1,
            values,
            displayValue: values[0],
            current: equals ? 0 : 1,
            operation: equals ? null : operation
          });
        }
      };

      const setDigit = digit => {
        console.log(`Digit: ${digit}`);

        const currentValue = display$1.displayValue.join("");
        console.log("display value: ", currentValue);
        console.log("Novo valor: ", currentValue + "" + digit);
        const displayValue = formatValueToDisplay(currentValue + "" + digit);
        console.log("display value: ", displayValue);
        updateDisplay({ ...display$1, displayValue });

        const index = display$1.current;
        const newValue = parseFloat(displayValue);
        const values = [...display$1.values];
        values[index] = newValue;
        updateDisplay({ ...display$1, values, displayValue });
      };

      const formatValueToDisplay = value => {
        if (value.length < 7) {
          let retorno = new Array(7 - value.length).fill(0);
          return [...retorno, ...value.split("")];
        } else if (value.length > 7) {
          return value.split("").splice(1, 7);
        } else {
          return value.split("");
        }
      };

      // onMount(() => {
      //   console.log("onmount", display);
      // });

    	const writable_props = ['initialState', 'display_off', 'display_on', 'turn_on', 'turn_off', 'updateDisplay'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1$5.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('initialState' in $$props) $$invalidate('initialState', initialState = $$props.initialState);
    		if ('display_off' in $$props) $$invalidate('display_off', display_off = $$props.display_off);
    		if ('display_on' in $$props) $$invalidate('display_on', display_on = $$props.display_on);
    		if ('turn_on' in $$props) $$invalidate('turn_on', turn_on = $$props.turn_on);
    		if ('turn_off' in $$props) $$invalidate('turn_off', turn_off = $$props.turn_off);
    		if ('updateDisplay' in $$props) $$invalidate('updateDisplay', updateDisplay = $$props.updateDisplay);
    	};

    	$$self.$capture_state = () => {
    		return { initialState, display_off, display_on, display: display$1, turn_on, turn_off, updateDisplay };
    	};

    	$$self.$inject_state = $$props => {
    		if ('initialState' in $$props) $$invalidate('initialState', initialState = $$props.initialState);
    		if ('display_off' in $$props) $$invalidate('display_off', display_off = $$props.display_off);
    		if ('display_on' in $$props) $$invalidate('display_on', display_on = $$props.display_on);
    		if ('display' in $$props) $$invalidate('display', display$1 = $$props.display);
    		if ('turn_on' in $$props) $$invalidate('turn_on', turn_on = $$props.turn_on);
    		if ('turn_off' in $$props) $$invalidate('turn_off', turn_off = $$props.turn_off);
    		if ('updateDisplay' in $$props) $$invalidate('updateDisplay', updateDisplay = $$props.updateDisplay);
    	};

    	return {
    		initialState,
    		display_off,
    		display_on,
    		display: display$1,
    		turn_on,
    		turn_off,
    		updateDisplay,
    		setOperation,
    		setDigit
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, ["initialState", "display_off", "display_on", "turn_on", "turn_off", "updateDisplay", "setDigit"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$6.name });
    	}

    	get initialState() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialState(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get display_off() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set display_off(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get display_on() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set display_on(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get turn_on() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set turn_on(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get turn_off() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set turn_off(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateDisplay() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateDisplay(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setDigit() {
    		return this.$$.ctx.setDigit;
    	}

    	set setDigit(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
