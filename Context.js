"use strict;"
var use = require('bayrell').use;
/*!
 *  Bayrell Runtime Library
 *
 *  (c) Copyright 2016-2020 "Ildar Bikmamatov" <support@bayrell.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
if (typeof Runtime == 'undefined') Runtime = {};
Runtime.Context = function(ctx)
{
	use("Runtime.CoreStruct").apply(this, arguments);
};
Runtime.Context.prototype = Object.create(use("Runtime.CoreStruct").prototype);
Runtime.Context.prototype.constructor = Runtime.Context;
Object.assign(Runtime.Context.prototype,
{
	_init: function(ctx)
	{
		var defProp = use('Runtime.rtl').defProp;
		var a = Object.getOwnPropertyNames(this);
		var __v0 = use("Runtime.Vector");
		this.base_path = null;
		this.enviroments = null;
		this.settings = null;
		this.modules = null;
		this.entities = null;
		this.drivers = null;
		this.providers = null;
		this.tags = null;
		this.initialized = false;
		this.started = false;
		this.start_time = 0;
		this.logs = new __v0(ctx);
		use("Runtime.CoreStruct").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Runtime.Context"))
		{
			this.base_path = o.base_path;
			this.enviroments = o.enviroments;
			this.settings = o.settings;
			this.modules = o.modules;
			this.entities = o.entities;
			this.drivers = o.drivers;
			this.providers = o.providers;
			this.tags = o.tags;
			this.initialized = o.initialized;
			this.started = o.started;
			this.start_time = o.start_time;
			this.logs = o.logs;
		}
		use("Runtime.CoreStruct").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "base_path")this.base_path = v;
		else if (k == "enviroments")this.enviroments = v;
		else if (k == "settings")this.settings = v;
		else if (k == "modules")this.modules = v;
		else if (k == "entities")this.entities = v;
		else if (k == "drivers")this.drivers = v;
		else if (k == "providers")this.providers = v;
		else if (k == "tags")this.tags = v;
		else if (k == "initialized")this.initialized = v;
		else if (k == "started")this.started = v;
		else if (k == "start_time")this.start_time = v;
		else if (k == "logs")this.logs = v;
		else use("Runtime.CoreStruct").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "base_path")return this.base_path;
		else if (k == "enviroments")return this.enviroments;
		else if (k == "settings")return this.settings;
		else if (k == "modules")return this.modules;
		else if (k == "entities")return this.entities;
		else if (k == "drivers")return this.drivers;
		else if (k == "providers")return this.providers;
		else if (k == "tags")return this.tags;
		else if (k == "initialized")return this.initialized;
		else if (k == "started")return this.started;
		else if (k == "start_time")return this.start_time;
		else if (k == "logs")return this.logs;
		return use("Runtime.CoreStruct").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Runtime.Context";
	},
});
Object.assign(Runtime.Context, use("Runtime.CoreStruct"));
Object.assign(Runtime.Context,
{
	/**
	 * Returns app name
	 * @return string
	 */
	appName: function(ctx)
	{
		return "";
	},
	/**
	 * Returns context settings
	 * @return Dict<string>
	 */
	getSettings: function(ctx, env)
	{
		return null;
	},
	/**
	 * Extends entities
	 */
	getEntities: function(ctx, entities)
	{
		return null;
	},
	/**
	 * Returns enviroment by eky
	 */
	env: function(ctx, c, key)
	{
		return (c.enviroments != null) ? c.enviroments.get(ctx, key, "") : "";
	},
	/**
	 * Returns settings
	 * @return Dict<string>
	 */
	config: function(ctx, c, items, d)
	{
		if (d == undefined) d = null;
		if (c.settings == null)
		{
			return null;
		}
		var config = c.settings.get(ctx, "config", null);
		var __v0 = use("Runtime.rtl");
		return (config != null) ? __v0.attr(ctx, config, items, d) : null;
	},
	/**
	 * Returns docker secret key
	 */
	secret: function(ctx, c, key)
	{
		var secrets = c.settings.get(ctx, "secrets", null);
		return (secrets != null) ? secrets.get(ctx, "key", "") : "";
	},
	/**
	 * Create context
	 *
	 * @params Dict env
	 * @params Collection<string> modules
	 * @params Dict settings
	 * @return Context
	 */
	create: function(ctx, env, entities)
	{
		if (entities == undefined) entities = null;
		var settings = this.getSettings(ctx, env);
		/* Context data */
		var obj = use("Runtime.Dict").from({"enviroments":env,"settings":settings,"modules":(settings != null) ? settings.get(ctx, "modules", null) : null,"entities":entities});
		/* Create context */
		var ctx = this.newInstance(ctx, obj);
		return ctx;
	},
	/**
	 * Init context
	 */
	init: function(ctx, c)
	{
		if (c.initialized)
		{
			return c;
		}
		/* Extends modules */
		var modules = this.getRequiredModules(ctx, c.modules);
		/* Get modules entities */
		var entities = this.getEntitiesFromModules(ctx, modules);
		entities = entities.prependCollectionIm(ctx, this.getEntities(ctx, c.env));
		/* Base path */
		var __v0 = use("Runtime.rtl");
		var base_path = (c.base_path != "") ? c.base_path : __v0.attr(ctx, c.env, use("Runtime.Collection").from(["BASE_PATH"]), "", "string");
		/* Add entities */
		if (c.entities != null)
		{
			entities = entities.appendCollectionIm(ctx, c.entities);
		}
		c = c.copy(ctx, { "entities": entities });
		/* Extend entities */
		entities = this.chain(ctx, c, "Runtime.Entities", use("Runtime.Collection").from([c,entities]));
		entities = this.extendEntities(ctx, c, entities);
		entities = this.extendEntitiesFromAnnotations(ctx, entities);
		/* Get providers */
		var providers = this.getProvidersFromEntities(ctx, entities);
		/* Register drivers */
		var drivers = this.getDriversFromEntities(ctx, entities);
		return c.copy(ctx, use("Runtime.Dict").from({"modules":modules,"entities":entities,"providers":providers,"drivers":drivers,"base_path":base_path,"initialized":true}));
	},
	/**
	 * Start context
	 */
	start: function(ctx, c)
	{
		var drivers,i,driver_name,driver;
		return (__async_t) =>
		{
			if (__async_t.pos(ctx) == "0")
			{
				if (c.started)
				{
					return __async_t.ret(ctx, c);
				}
				drivers = c.drivers.keys(ctx);
				return __async_t.jump(ctx, "1.0");
			}
			/* Start Loop */
			else if (__async_t.pos(ctx) == "1.0")
			{
				i = 0;
				return __async_t.jump(ctx, "1.1");
			}
			/* Loop Expression */
			else if (__async_t.pos(ctx) == "1.1")
			{
				var __async_var = i < drivers.count(ctx);
				if (__async_var)
				{
					return __async_t.jump(ctx, "1.2");
				}
				return __async_t.jump(ctx, "2");
			}
			/* Loop */
			else if (__async_t.pos(ctx) == "1.2")
			{
				i++;
				driver_name = drivers.item(ctx, i);
				driver = c.drivers.item(ctx, driver_name);
				return __async_t.jump(ctx, "1.3").call(ctx, driver.startDriver(ctx),"__v0");
			}
			else if (__async_t.pos(ctx) == "1.3")
			{
				return __async_t.jump(ctx, "1.1");
			}
			/* End Loop */
			else if (__async_t.pos(ctx) == "2")
			{
				return __async_t.ret(ctx, c.copy(ctx, use("Runtime.Dict").from({"started":true})));
			}
			return __async_t.ret_void(ctx);
		};
	},
	/* ---------------------- Driver -------------------- */
	/**
	 * Get driver
	 *
	 * @params string driver_name
	 * @return Runtime.anager
	 */
	getDriver: function(ctx, c, driver_name)
	{
		if (c.drivers.has(ctx, driver_name))
		{
			return c.drivers.item(ctx, driver_name);
		}
		return null;
	},
	/* --------------------- Provider ------------------- */
	/**
	 * Create provider
	 *
	 * @params string provider_name
	 * @return CoreProvider
	 */
	createProvider: function(ctx, c, provider_name, params, settings_name)
	{
		if (settings_name == undefined) settings_name = "default";
		var provider = null;
		if (c.providers.has(ctx, provider_name))
		{
			var info = c.providers.item(ctx, provider_name);
			if (info.kind == "interface")
			{
				var __v0 = use("Runtime.Exceptions.RuntimeException");
				throw new __v0(ctx, "Provider " + use("Runtime.rtl").toStr(provider_name) + use("Runtime.rtl").toStr(" does not declared"))
			}
			var class_name = info.value;
			if (class_name == "")
			{
				class_name = info.name;
			}
			/* Set default params */
			if (params == null)
			{
				var __v0 = use("Runtime.rtl");
				params = __v0.attr(ctx, c.settings, use("Runtime.Collection").from(["providers",class_name,settings_name]));
			}
			if (params == null)
			{
				params = use("Runtime.Dict").from({});
			}
			var __v0 = use("Runtime.rtl");
			provider = __v0.newInstance(ctx, class_name, use("Runtime.Collection").from([params]));
			provider = this.chain(ctx, c, class_name, use("Runtime.Collection").from([provider]));
			if (provider_name != class_name)
			{
				provider = this.chain(ctx, c, provider_name, use("Runtime.Collection").from([provider]));
			}
		}
		else
		{
			var __v0 = use("Runtime.Exceptions.RuntimeException");
			throw new __v0(ctx, "Provider " + use("Runtime.rtl").toStr(provider_name) + use("Runtime.rtl").toStr(" not found"))
		}
		return provider;
	},
	/**
	 * Returns provider
	 *
	 * @params string provider_name
	 * @return CoreProvider
	 */
	getProvider: function(ctx, c, provider_name, settings_name)
	{
		if (settings_name == undefined) settings_name = "default";
		var provider = this.createProvider(ctx, c, provider_name, null, settings_name);
		return provider;
	},
	/* ---------------------- Chain --------------------- */
	/**
	 * Apply Lambda Chain
	 */
	chain: function(ctx, c, chain_name, args)
	{
		var entities = c.entities.filter(ctx, (ctx, item) => 
		{
			var __v0 = use("Runtime.Annotations.LambdaChain");
			return item instanceof __v0 && item.name == chain_name && item.is_async == false;
		});
		entities = entities.sortIm(ctx, (a, b) => 
		{
			return a.pos > b.pos;
		});
		for (var i = 0;i < entities.count(ctx);i++)
		{
			var item = entities.item(ctx, i);
			var item_chain_name = item.chain;
			if (item_chain_name != "")
			{
				var res = c.chain(ctx, item_chain_name, args);
				args = args.setIm(ctx, args.count(ctx) - 1, res);
			}
			else
			{
				var __v0 = use("Runtime.rs");
				var arr = __v0.split(ctx, "::", item.value);
				var class_name = arr.get(ctx, 0, "");
				var method_name = arr.get(ctx, 1, "");
				var __v0 = use("Runtime.rtl");
				var f = __v0.method(ctx, class_name, method_name);
				var __v0 = use("Runtime.rtl");
				var res = __v0.apply(ctx, f, args);
				args = args.setIm(ctx, args.count(ctx) - 1, res);
			}
		}
		var res = args.last(ctx);
		return res;
	},
	/**
	 * Apply Lambda Chain Await
	 */
	chainAwait: function(ctx, c, chain_name, args)
	{
		var entities,i,item,item_chain_name,res,arr,class_name,method_name,f;
		return (__async_t) =>
		{
			if (__async_t.pos(ctx) == "0")
			{
				entities = c.entities.filter(ctx, (ctx, item) => 
				{
					var __v0 = use("Runtime.Annotations.LambdaChain");
					return item instanceof __v0 && item.name == chain_name;
				});
				entities = entities.sortIm(ctx, (a, b) => 
				{
					return a.pos > b.pos;
				});
				return __async_t.jump(ctx, "1.0");
			}
			/* Start Loop */
			else if (__async_t.pos(ctx) == "1.0")
			{
				i = 0;
				return __async_t.jump(ctx, "1.1");
			}
			/* Loop Expression */
			else if (__async_t.pos(ctx) == "1.1")
			{
				var __async_var = i < entities.count(ctx);
				if (__async_var)
				{
					return __async_t.jump(ctx, "1.2");
				}
				return __async_t.jump(ctx, "2");
			}
			/* Loop */
			else if (__async_t.pos(ctx) == "1.2")
			{
				i++;
				item = entities.item(ctx, i);
				item_chain_name = item.chain;
				return __async_t.jump(ctx, "1.3.0");
			}
			/* Start if */
			else if (__async_t.pos(ctx) == "1.3.0")
			{
				var __async_var = item_chain_name != "";
				if (__async_var)
				{
					return __async_t.jump(ctx, "1.3.1");
				}
				return __async_t.jump(ctx, "1.3.2");
			}
			/* If true */
			else if (__async_t.pos(ctx) == "1.3.1")
			{
				return __async_t.jump(ctx, "1.3.3").call(ctx, this.chainAwait(ctx, item_chain_name, args),"__v0");
			}
			else if (__async_t.pos(ctx) == "1.3.3")
			{
				res = __async_t.getVar(ctx, "__v0");
				args = args.setIm(ctx, args.count(ctx) - 1, res);
				return __async_t.jump(ctx, "1.4");
			}
			/* Next If */
			else if (__async_t.pos(ctx) == "1.3.2")
			{
				/* If false */
				var __v0 = use("Runtime.rs");
				arr = __v0.split(ctx, "::", item.value);
				class_name = arr.get(ctx, 0, "");
				method_name = arr.get(ctx, 1, "");
				var __v0 = use("Runtime.rtl");
				f = __v0.method(ctx, class_name, method_name);
				return __async_t.jump(ctx, "1.3.4.0");
			}
			/* Start if */
			else if (__async_t.pos(ctx) == "1.3.4.0")
			{
				var __async_var = item.is_async;
				if (__async_var)
				{
					return __async_t.jump(ctx, "1.3.4.1");
				}
				return __async_t.jump(ctx, "1.3.4.2");
			}
			/* If true */
			else if (__async_t.pos(ctx) == "1.3.4.1")
			{
				var __v0 = use("Runtime.rtl");
				return __async_t.jump(ctx, "1.3.4.3").call(ctx, __v0.apply(ctx, f, args),"__v1");
			}
			else if (__async_t.pos(ctx) == "1.3.4.3")
			{
				res = __async_t.getVar(ctx, "__v1");
				args = args.setIm(ctx, args.count(ctx) - 1, res);
				return __async_t.jump(ctx, "1.3.5");
			}
			/* Next If */
			else if (__async_t.pos(ctx) == "1.3.4.2")
			{
				/* If false */
				var __v0 = use("Runtime.rtl");
				res = __v0.apply(ctx, f, args);
				args = args.setIm(ctx, args.count(ctx) - 1, res);
				return __async_t.jump(ctx, "1.3.5");
			}
			/* End if */
			else if (__async_t.pos(ctx) == "1.3.5")
			{
				return __async_t.jump(ctx, "1.4");
			}
			/* End if */
			else if (__async_t.pos(ctx) == "1.4")
			{
				return __async_t.jump(ctx, "1.1");
			}
			/* End Loop */
			else if (__async_t.pos(ctx) == "2")
			{
				res = args.last(ctx);
				return __async_t.ret(ctx, res);
			}
			return __async_t.ret_void(ctx);
		};
	},
	/**
	 * Translate message
	 * @params string message - message need to be translated
	 * @params string space - message space
	 * @params Map params - Messages params. Default null.
	 * @params string locale - Different locale. Default "".
	 * @return string - translated string
	 */
	translate: function(ctx, c, message, space, params, locale)
	{
		if (params == undefined) params = null;
		if (locale == undefined) locale = "";
		return message;
	},
	/* ----------------------- Bus ---------------------- */
	/**
	 * Send message
	 * @param Message msg
	 * @param Context ctx
	 * @return Message
	 */
	sendMessage: function(ctx, c, msg)
	{
		var provider;
		return (__async_t) =>
		{
			if (__async_t.pos(ctx) == "0")
			{
				var __v0 = use("Runtime.RuntimeConstant");
				provider = this.getProvider(ctx, c, __v0.BUS_INTERFACE, "default");
				return __async_t.jump(ctx, "1").call(ctx, provider.constructor.sendMessage(ctx, provider, msg),"__v0");
			}
			else if (__async_t.pos(ctx) == "1")
			{
				msg = __async_t.getVar(ctx, "__v0");
				return __async_t.ret(ctx, msg);
			}
			return __async_t.ret_void(ctx);
		};
	},
	/* ---------------------- Logs ---------------------- */
	/**
	 * Log message
	 * @param string message
	 * @param int loglevel
	 */
	debug: function(ctx, c, message, loglevel)
	{
		if (loglevel == undefined) loglevel = 0;
		this.logs.push(ctx, message + use("Runtime.rtl").toStr("\n"));
	},
	/**
	 * Timer message
	 * @param string message
	 * @param int loglevel
	 */
	log_timer: function(ctx, c, message, loglevel)
	{
		if (loglevel == undefined) loglevel = 0;
		var time = this.utime(ctx, c) - c.start_time;
		var __v0 = use("Runtime.rtl");
		var s = "[" + use("Runtime.rtl").toStr(__v0.round(ctx, time * 1000)) + use("Runtime.rtl").toStr("]ms ") + use("Runtime.rtl").toStr(message) + use("Runtime.rtl").toStr("\n");
		c.logs.push(ctx, s);
	},
	/**
	 * Dump var to log
	 * @param var v
	 * @param int loglevel
	 */
	dump: function(ctx, c, v, loglevel)
	{
		if (loglevel == undefined) loglevel = 0;
	},
	/**
	 * Append logs message
	 * @param Collection<string> logs
	 */
	logAppend: function(ctx, c, logs)
	{
		/*this.logs.appendVector(logs);*/
	},
	/**
	 * Return logs
	 */
	getLogs: function(ctx, c)
	{
		/*return this.logs.toCollection();*/
		return use("Runtime.Collection").from([]);
	},
	/* ---------------------- Tags ---------------------- */
	/**
	 * Set tag
	 */
	setTagIm: function(ctx, c, tag_name, value)
	{
		return c.copy(ctx, use("Runtime.Dict").from({"tags":c.tags.setIm(ctx, c, tag_name, value)}));
	},
	/**
	 * Returns tag
	 */
	getTag: function(ctx, c, tag_name)
	{
		return c.tags.get(ctx, c, tag_name, null);
	},
	/* ---------------------- Other --------------------- */
	/**
	 * Returns unix timestamp
	 */
	time: function(ctx, c)
	{
	},
	/**
	 * Returns unix timestamp
	 */
	utime: function(ctx, c)
	{
	},
	/* -------------------- Functions ------------------- */
	/**
	 * Returns required modules
	 * @param string class_name
	 * @return Collection<string>
	 */
	_getRequiredModules: function(ctx, res, cache, modules, filter)
	{
		if (filter == undefined) filter = null;
		if (modules == null)
		{
			return ;
		}
		if (filter)
		{
			modules = modules.filter(ctx, filter);
		}
		for (var i = 0;i < modules.count(ctx);i++)
		{
			var module_name = modules.item(ctx, i);
			if (cache.get(ctx, module_name, false) == false)
			{
				cache.set(ctx, module_name, true);
				var __v0 = use("Runtime.rtl");
				var f = __v0.method(ctx, module_name + use("Runtime.rtl").toStr(".ModuleDescription"), "requiredModules");
				var sub_modules = f(ctx);
				if (sub_modules != null)
				{
					var sub_modules = sub_modules.keys(ctx);
					this._getRequiredModules(ctx, res, cache, sub_modules);
				}
				res.push(ctx, module_name);
			}
		}
	},
	/**
	 * Returns all modules
	 * @param Collection<string> modules
	 * @return Collection<string>
	 */
	getRequiredModules: function(ctx, modules)
	{
		var __v0 = use("Runtime.Vector");
		var res = new __v0(ctx);
		var __v0 = use("Runtime.Map");
		var cache = new __v0(ctx);
		this._getRequiredModules(ctx, res, cache, modules);
		res = res.removeDublicatesIm(ctx);
		return res.toCollection(ctx);
	},
	/**
	 * Returns modules entities
	 */
	getEntitiesFromModules: function(ctx, modules)
	{
		var __v0 = use("Runtime.Vector");
		var entities = new __v0(ctx);
		for (var i = 0;i < modules.count(ctx);i++)
		{
			var module_class_name = modules.item(ctx, i) + use("Runtime.rtl").toStr(".ModuleDescription");
			var __v0 = use("Runtime.rtl");
			var f = __v0.method(ctx, module_class_name, "entities");
			var arr = f(ctx);
			entities.appendVector(ctx, arr);
		}
		return entities.toCollection(ctx);
	},
	/**
	 * Extend entities
	 */
	extendEntitiesFromAnnotations: function(ctx, entities)
	{
		var e = entities.toVector(ctx);
		for (var i = 0;i < entities.count(ctx);i++)
		{
			var item1 = entities.item(ctx, i);
			var item1_class_name = item1.getClassName(ctx);
			if (item1_class_name == "Runtime.Annotations.Entity")
			{
				var class_name = (item1.value != "") ? item1.value : item1.name;
				var __v0 = use("Runtime.RuntimeUtils");
				var info = __v0.getClassIntrospection(ctx, class_name);
				if (info != null && info.class_info)
				{
					for (var j = 0;j < info.class_info.count(ctx);j++)
					{
						var item2 = info.class_info.item(ctx, j);
						var item2_class_name = item2.getClassName(ctx);
						var __v0 = use("Runtime.Annotations.Entity");
						if (item2 instanceof __v0 && item2_class_name != "Runtime.Annotations.Entity")
						{
							item2 = item2.copy(ctx, use("Runtime.Dict").from({"name":class_name}));
							e.push(ctx, item2);
						}
					}
				}
			}
		}
		return e.toCollection(ctx);
	},
	/**
	 * Returns providers from entities
	 */
	getProvidersFromEntities: function(ctx, entities)
	{
		var arr = entities.filter(ctx, (ctx, item) => 
		{
			var __v0 = use("Runtime.Annotations.Provider");
			return item instanceof __v0;
		});
		var __v0 = use("Runtime.Map");
		var providers = new __v0(ctx);
		for (var i = 0;i < arr.count(ctx);i++)
		{
			var item = arr.item(ctx, i);
			providers.set(ctx, item.name, item);
		}
		return providers.toDict(ctx);
	},
	/**
	 * Register drivers
	 */
	getDriversFromEntities: function(ctx, entities)
	{
		var arr = entities.filter(ctx, (ctx, item) => 
		{
			var __v0 = use("Runtime.Annotations.Driver");
			return item instanceof __v0;
		});
		var __v0 = use("Runtime.Map");
		var drivers = new __v0(ctx);
		for (var i = 0;i < arr.count(ctx);i++)
		{
			var item = arr.item(ctx, i);
			var driver_name = item.name;
			var class_name = item.value;
			if (class_name == "")
			{
				class_name = item.name;
			}
			var __v0 = use("Runtime.rtl");
			var driver = __v0.newInstance(ctx, class_name, use("Runtime.Collection").from([]));
			driver = this.chain(ctx, class_name, use("Runtime.Collection").from([driver]));
			if (class_name != driver_name)
			{
				driver = this.chain(ctx, driver_name, use("Runtime.Collection").from([driver]));
			}
			drivers.set(ctx, item.name, driver);
		}
		return drivers.toDict(ctx);
	},
	/**
	 * Extends entities
	 */
	extendEntities: function(ctx, c, entities)
	{
		return entities;
	},
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Runtime";
	},
	getCurrentClassName: function()
	{
		return "Runtime.Context";
	},
	getParentClassName: function()
	{
		return "Runtime.CoreStruct";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Runtime.Context",
			"name": "Runtime.Context",
			"annotations": Collection.from([
			]),
		});
	},
	getFieldsList: function(ctx, f)
	{
		var a = [];
		if (f==undefined) f=0;
		if ((f|3)==3)
		{
			a.push("base_path");
			a.push("enviroments");
			a.push("settings");
			a.push("modules");
			a.push("entities");
			a.push("drivers");
			a.push("providers");
			a.push("tags");
			a.push("initialized");
			a.push("started");
			a.push("start_time");
			a.push("logs");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		if (field_name == "base_path") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "enviroments") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "settings") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "modules") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "entities") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "drivers") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "providers") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "tags") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "initialized") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "started") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "start_time") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "logs") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a = [
		];
		return use("Runtime.Collection").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
});use.add(Runtime.Context);
if (module.exports == undefined) module.exports = {};
if (module.exports.Runtime == undefined) module.exports.Runtime = {};
module.exports.Runtime.Context = Runtime.Context;