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
Runtime.BaseStruct = function(ctx, obj)
{
	if (obj == undefined) obj = null;
	use("Runtime.BaseObject").call(this, ctx);
	this.constructor._assign(ctx, this, null, obj);
	if (this.__uq__ == undefined || this.__uq__ == null) this.__uq__ = Symbol();
		Object.freeze(this);
};
Runtime.BaseStruct.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.BaseStruct.prototype.constructor = Runtime.BaseStruct;
Object.assign(Runtime.BaseStruct.prototype,
{
	/**
	 * Init struct data
	 */
	initData: function(ctx, old, changed)
	{
		if (changed == undefined) changed = null;
	},
	/**
	 * Copy this struct with new values
	 * @param Map obj = null
	 * @return BaseStruct
	 */
	copy: function(ctx, obj)
	{
		if (obj == undefined) obj = null;
		if (obj == null)
		{
			return this;
		}
		var proto = Object.getPrototypeOf(this);
		var item = Object.create(proto); /* item._init(); */
		item = Object.assign(item, this);
		
		this.constructor._assign(ctx, item, this, obj);
		
		Object.freeze(item);
		
		return item;
		return this;
	},
	/**
	 * Clone this struct with fields
	 * @param Collection fields = null
	 * @return BaseStruct
	 */
	clone: function(ctx, fields)
	{
		if (fields == undefined) fields = null;
		if (fields == null)
		{
			return this;
		}
		var __v0 = use("Runtime.Map");
		var obj = new __v0(ctx);
		fields.each(ctx, (ctx, field_name) => 
		{
			obj.set(ctx, field_name, this.takeValue(ctx, field_name));
		});
		/* Return object */
		var __v1 = use("Runtime.rtl");
		var res = __v1.newInstance(ctx, this.getClassName(ctx), use("Runtime.Collection").from([obj.toDict(ctx)]));
		return res;
	},
	/**
	 * Create new struct with new value
	 * @param string field_name
	 * @param fn f
	 * @return BaseStruct
	 */
	map: function(ctx, field_name, f)
	{
		var __v0 = use("Runtime.Map");
		return this.copy(ctx, (new __v0(ctx)).set(ctx, field_name, f(ctx, this.takeValue(ctx, field_name))).toDict(ctx));
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Runtime.BaseStruct"))
		{
		}
		use("Runtime.BaseObject").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		use("Runtime.BaseObject").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		return use("Runtime.BaseObject").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Runtime.BaseStruct";
	},
});
Object.assign(Runtime.BaseStruct, use("Runtime.BaseObject"));
Object.assign(Runtime.BaseStruct,
{
	/**
	 * Assign
	 */
	_assign: function(ctx, item, old_item, obj)
	{
		if (obj == null)
		{
			item.initData(ctx, old_item, obj);
			return ;
		}
		var _Dict = use("Runtime.Dict");
		if (obj instanceof _Dict)
		{
			for (var key in obj._map) item[key.substring(1)] = obj._map[key];
		}
		else
		{
			for (var key in obj) item[key] = obj[key];
		}
		
		item.initData(ctx, old_item, obj);
	},
	/**
	 * Returns new instance
	 */
	newInstance: function(ctx, items)
	{
		return new (Function.prototype.bind.apply(this, [null, ctx, items]));
	},
	/**
	 * Update struct
	 * @param Collection<string> path
	 * @param var value
	 * @return BaseStruct
	 */
	update: function(ctx, item, items)
	{
		return item.copy(ctx, items);
	},
	/**
	 * Update struct
	 * @param Collection<string> path
	 * @param var value
	 * @return BaseStruct
	 */
	setAttr: function(ctx, item, path, value)
	{
		var __v0 = use("Runtime.rtl");
		return __v0.setAttr(ctx, item, path, value);
	},
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Runtime";
	},
	getCurrentClassName: function()
	{
		return "Runtime.BaseStruct";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Runtime.BaseStruct",
			"name": "Runtime.BaseStruct",
			"annotations": Collection.from([
			]),
		});
	},
	getFieldsList: function(ctx, f)
	{
		var a = [];
		if (f==undefined) f=0;
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
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
});use.add(Runtime.BaseStruct);
module.exports = Runtime.BaseStruct;
Runtime.BaseStruct.prototype.get = function(ctx, k, v){ return this[k] != undefined ? this[k] : v; };