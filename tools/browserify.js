//https://github.com/browserify/browserify
var { createHash } = require("crypto");
var { EventEmitter } = require("events");
var fs = require("fs");
var { builtinModules } = require("module");
var path = require("path");
var { Duplex, PassThrough, Readable, Transform, Writable } = require("stream");
var { inherits } = require("util");


module.exports = {
    browserify: Browserify,
    watchify,
}



//mjs maybe
// import { createHash } from "crypto";
// import { EventEmitter } from "events";
// import fs from "fs";
// import { builtinModules } from "module";
// import path from "path";
// import { Duplex, PassThrough, Readable, Transform, Writable } from "stream";
// import { inherits } from "util";


var paths = {
    empty: null
};

var isArray = Array.isArray;
const { nextTick } = process;

function defined(...args) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] !== undefined)
            return args[i];
    }
}
function has(obj, key) {
    return obj && Reflect.has(obj, key);
}
var hasOwnProperty = Object.prototype.hasOwnProperty;

function xtend(...args) {
    var target = {};
    for (var i = 0; i < args.length; i++) {
        var source = args[i];
        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

function shasum(str) {
    str = "string" === typeof str ? str : Buffer.isBuffer(str) ? str : JSON.stringify(str);
    return createHash("sha1")
        .update(str, Buffer.isBuffer(str) ? null : "utf8")
        .digest("hex");
}
const TERMINATORS_LOOKUP = {
    "\u2028": "\\u2028",
    "\u2029": "\\u2029",
};
const sanitize = (str) => str.replace(/[\u2028\u2029]/g, (v) => TERMINATORS_LOOKUP[v]);
function removeComments(string) {
    return string.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "").trim();
}
const findImports = (code_string) => {
    let _code_string = removeComments(code_string);
    return [
        ...new Set([
            [..._code_string.matchAll(/require\((["'])(.*?)\1\)/g)].map((v) => v[2]),
            [..._code_string.matchAll(/import\((["'])(.*?)\1\)/g)].map((v) => v[2]),
            [..._code_string.matchAll(/from (["'])(.*?)\1/g)].map((v) => v[2]),
        ].flat()),
    ];
};
const detective = (code_string) => {
    return {
        strings: findImports(code_string),
    };
};
function checkSyntax(src, file, opts) {
    if (typeof src !== "string")
        src = String(src);
    try {
        eval('throw "STOP"; (function () { ' + src + "\n})()");
        return;
    }
    catch (err) {
        if (err === "STOP")
            return undefined;
        if (err.constructor.name !== "SyntaxError")
            return err;
        return err;
    }
}
var lastCwd = process.cwd();
var pathCache = Object.create(null);
function cachedPathRelative(from, to) {
    var cwd = process.cwd();
    if (cwd !== lastCwd) {
        pathCache = {};
        lastCwd = cwd;
    }
    if (pathCache[from] && pathCache[from][to])
        return pathCache[from][to];
    var result = path.relative.call(path, from, to);
    pathCache[from] = pathCache[from] || {};
    pathCache[from][to] = result;
    return result;
}
var defaultVars = {
    process: function () {
        return `(function () {
    //include global shims here too
    self.setImmediate = setTimeout;
    self.cancelImmediate = clearTimeout;

    if(!process) var process = {};
    process.nextTick = function (cb) { queueMicrotask((cb)); };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};
    function noop() {}
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;
    process.listeners = function (name) { return [] }
    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };
    process.cwd = function () { return '/' };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function() { return 0; };
    return process
    })()`;
    },
    global: function () {
        return ('typeof global !== "undefined" ? global : ' +
            'typeof self !== "undefined" ? self : ' +
            'typeof window !== "undefined" ? window : {}');
    },
    __filename: function (file, basedir) {
        var relpath = path.relative(basedir, file);
        if (path.sep === "\\") {
            relpath = relpath.replace(/\\/g, "/");
        }
        var filename = "/" + relpath;
        return JSON.stringify(filename);
    },
    __dirname: function (file, basedir) {
        var relpath = path.relative(basedir, file);
        if (path.sep === "\\") {
            relpath = relpath.replace(/\\/g, "/");
        }
        var dir = path.dirname("/" + relpath);
        return JSON.stringify(dir);
    },
};
function insertModuleGlobals(file, opts) {
if (/\.json$/i.test(file)) return through();
if (!opts) opts = {};

var basedir = opts.basedir || '/';
var vars = Object.assign({}, defaultVars, opts.vars);
var varNames = Object.keys(vars).filter(function(name) {
    return typeof vars[name] === 'function';
});

var quick = RegExp(varNames.map(function (name) {
    return '\\b' + name + '\\b';
}).join('|'));

var chunks = [];

return through(write, end);

function write (chunk, enc, next) { chunks.push(chunk); next() }

function end () {
    var self = this;
    var source = Buffer.isBuffer(chunks[0])
        ? Buffer.concat(chunks).toString('utf8')
        : chunks.join('')
    ;
    source = source
        .replace(/^\ufeff/, '')
        .replace(/^#![^\n]*\n/, '\n');
    
    if (opts.always !== true && !quick.test(source)) {
        this.push(source);
        this.push(null);
        return;
    }
    
    // try {
    //     var undeclared = opts.always
    //         ? { identifiers: varNames, properties: [] }
    //         : undeclaredIdentifiers(parse(source), { wildcard: true })
    //     ;
    // }

    try {
        var undeclared = { identifiers: varNames, properties: [] }
        
    }

    catch (err) {
        var e = new SyntaxError(
            (err.message || err) + ' while parsing ' + file
        );
        e.type = 'syntax';
        e.filename = file;
        return this.emit('error', e);
    }
    
    var globals = {};
    
    varNames.forEach(function (name) {
        if (!/\./.test(name)) return;
        var parts = name.split('.')
        var prop = undeclared.properties.indexOf(name)
        if (prop === -1 || countprops(undeclared.properties, parts[0]) > 1) return;
        var value = vars[name](file, basedir);
        if (!value) return;
        globals[parts[0]] = '{'
            + JSON.stringify(parts[1]) + ':' + value + '}';
        self.emit('global', name);
    });

    varNames.forEach(function (name) {
        if (/\./.test(name)) return;
        if (globals[name]) return;
        if (undeclared.identifiers.indexOf(name) < 0) return;
        var value = vars[name](file, basedir);
        if (!value) return;
        globals[name] = value;
        self.emit('global', name);
    });
    
    this.push(closeOver(globals, source, file, opts));
    this.push(null);
}
};



function closeOver (globals, src, file, opts) {
var keys = Object.keys(globals);
if (keys.length === 0) return src;
var values = keys.map(function (key) { return globals[key] });

// we double-wrap the source in IIFEs to prevent code like
//     (function(Buffer){ const Buffer = null }())
// which causes a parse error.
var wrappedSource = '(function (){\n' + src + '\n}).call(this)';
if (keys.length <= 3) {
    wrappedSource = '(function (' + keys.join(',') + '){'
        + wrappedSource + '}).call(this,' + values.join(',') + ')'
    ;
}
else {
  // necessary to make arguments[3..6] still work for workerify etc
  // a,b,c,arguments[3..6],d,e,f...
  var extra = [ '__argument0', '__argument1', '__argument2', '__argument3' ];
  var names = keys.slice(0,3).concat(extra).concat(keys.slice(3));
  values.splice(3, 0,
      'arguments[3]','arguments[4]',
      'arguments[5]','arguments[6]'
  );
  wrappedSource = '(function (' + names.join(',') + '){'
    + wrappedSource + '}).call(this,' + values.join(',') + ')';
}

// Generate source maps if wanted. Including the right offset for
// the wrapped source.

    return wrappedSource;



}

function countprops (props, name) {
return props.filter(function (prop) {
    return prop.slice(0, name.length + 1) === name + '.';
}).length;
}


var bpackPrelude = `(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,p.exports,r,e,n,t
        );
      }
      return n[i].exports;
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
    return o;
  }
  return r;
})();`;

var commentRx = /^\s*\/(?:\/|\*)[@#]\s+sourceMappingURL=data:(?:application|text)\/json;(?:charset[:=]\S+;)?base64,(.*)$/gm;
var mapFileCommentRx = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/){1}[ \t]*$)/gm;
function removeSourceMapComments(src) {
    if (!src.replace)
        return src;
    return src.replace(commentRx, "").replace(mapFileCommentRx, "");
}
function browserPack(opts) {
    if (!opts)
        opts = {};
    var parser = through.obj();
    var stream = through.obj(function (buf, enc, next) {
        parser.write(buf);
        next();
    }, function () {
        parser.end();
    });
    parser.pipe(through.obj(write, end));
    stream.standaloneModule = opts.standaloneModule;
    stream.hasExports = opts.hasExports;
    var first = true;
    var entries = [];
    var prelude = opts.prelude || bpackPrelude;
    return stream;
    function write(row, enc, next) {
        if (first && stream.hasExports) {
            var pre = opts.externalRequireName || "require";
            stream.push(Buffer.from(pre + "=", "utf8"));
        }
        if (first)
            stream.push(Buffer.from(prelude + "({", "utf8"));
        var wrappedSource = [
            first ? "" : ",",
            JSON.stringify(row.id),
            ":[",
            "function(require,module,exports){\n",
            removeSourceMapComments(row.source),
            "\n},",
            "{" +
                Object.keys(row.deps || {})
                    .sort()
                    .map(function (key) {
                    return JSON.stringify(key) + ":" + JSON.stringify(row.deps[key]);
                })
                    .join(",") +
                "}",
            "]",
        ].join("");
        stream.push(Buffer.from(wrappedSource, "utf8"));
        first = false;
        if (row.entry && row.order !== undefined) {
            entries[row.order] = row.id;
        }
        else if (row.entry)
            entries.push(row.id);
        next();
    }
    function end() {
        if (first)
            stream.push(Buffer.from(prelude + "({", "utf8"));
        entries = entries.filter(function (x) {
            return x !== undefined;
        });
        stream.push(Buffer.from("},{}," + JSON.stringify(entries) + ")", "utf8"));
        stream.push(Buffer.from(";\n", "utf8"));
        stream.push(null);
    }
}
function sortDependencies(opts) {
    if (!opts)
        opts = {};
    var rows = [];
    return through.obj(write, end);
    function write(row, enc, next) {
        rows.push(row);
        next();
    }
    function end() {
        var tr = this;
        rows.sort(cmp);
        sorter(rows, tr, opts);
    }
}
function sorter(rows, tr, opts) {
    var expose = opts.expose || {};
    if (Array.isArray(expose)) {
        expose = expose.reduce(function (acc, key) {
            acc[key] = true;
            return acc;
        }, {});
    }
    var hashes = {}, deduped = {};
    var sameDeps = depCmp();
    if (opts.dedupe) {
        rows.forEach(function (row) {
            var h = shasum(row.source);
            sameDeps.add(row, h);
            if (hashes[h]) {
                hashes[h].push(row);
            }
            else {
                hashes[h] = [row];
            }
        });
        Object.keys(hashes).forEach(function (h) {
            var rows = hashes[h];
            while (rows.length > 1) {
                var row = rows.pop();
                row.dedupe = rows[0].id;
                row.sameDeps = sameDeps.cmp(rows[0].deps, row.deps);
                deduped[row.id] = rows[0].id;
            }
        });
    }
    if (opts.index) {
        var index = {};
        var offset = 0;
        rows.forEach(function (row, ix) {
            if (has(expose, row.id)) {
                row.index = row.id;
                offset++;
                if (expose[row.id] !== true) {
                    index[expose[row.id]] = row.index;
                }
            }
            else {
                row.index = ix + 1 - offset;
            }
            index[row.id] = row.index;
        });
        rows.forEach(function (row) {
            row.indexDeps = {};
            Object.keys(row.deps).forEach(function (key) {
                var id = row.deps[key];
                row.indexDeps[key] = index[id];
            });
            if (row.dedupe) {
                row.dedupeIndex = index[row.dedupe];
            }
            tr.push(row);
        });
    }
    else {
        rows.forEach(function (row) {
            tr.push(row);
        });
    }
    tr.push(null);
}
function cmp(a, b) {
    return a.id + a.hash < b.id + b.hash ? -1 : 1;
}
function depCmp() {
    var deps = {}, hashes = {};
    return { add: add, cmp: cmp };
    function add(row, hash) {
        deps[row.id] = row.deps;
        hashes[row.id] = hash;
    }
    function cmp(a, b, limit) {
        if (!a && !b)
            return true;
        if (!a || !b)
            return false;
        var keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length)
            return false;
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i], ka = a[k], kb = b[k];
            var ha = hashes[ka];
            var hb = hashes[kb];
            var da = deps[ka];
            var db = deps[kb];
            if (ka === kb)
                continue;
            if (ha !== hb || (!limit && !cmp(da, db, 1))) {
                return false;
            }
        }
        return true;
    }
}
function parents(cwd, opts) {
    if (cwd === undefined)
        cwd = process.cwd();
    if (!opts)
        opts = {};
    var platform = opts.platform || process.platform;
    var isWindows = /^win/.test(platform);
    var init = isWindows ? "" : "/";
    var res = path
        .normalize(cwd)
        .split("/")
        .reduce(function (acc, dir, ix) {
        return acc.concat(path.join(acc[ix], dir));
    }, [init])
        .slice(1)
        .reverse();
    if (res[0] === res[1])
        return [res[0]];
    return res;
}
inherits(ModuleDeps, Transform);
function ModuleDeps(opts) {
    var self = this;
    if (!(this instanceof ModuleDeps))
        return new ModuleDeps(opts);
    Transform.call(this, { objectMode: true });
    if (!opts)
        opts = {};
    this.basedir = opts.basedir || process.cwd();
    this.persistentCache =
        opts.persistentCache ||
            function (file, id, pkg, fallback, cb) {
                process.nextTick(function () {
                    fallback(null, cb);
                });
            };
    this.cache = opts.cache;
    this.fileCache = opts.fileCache;
    this.pkgCache = opts.packageCache || {};
    this.pkgFileCache = {};
    this.pkgFileCachePending = {};
    this._emittedPkg = {};
    this._transformDeps = {};
    this.visited = {};
    this.walking = {};
    this.entries = [];
    this._input = [];
    this.paths = opts.paths || process.env.NODE_PATH || "";
    if (typeof this.paths === "string") {
        var delimiter = path.delimiter || (process.platform === "win32" ? ";" : ":");
        this.paths = this.paths.split(delimiter);
    }
    this.paths = this.paths.filter(Boolean).map(function (p) {
        return path.resolve(self.basedir, p);
    });
    this.transforms = [].concat(opts.transform).filter(Boolean);
    this.globalTransforms = [].concat(opts.globalTransform).filter(Boolean);
    this.resolver = opts.resolve || bresolve;
    this.detective = opts.detect || detective;
    this.options = Object.assign({}, opts);
    if (!this.options.modules)
        this.options.modules = {};
    if (!this.options.expose)
        this.options.expose = {};
    this.pending = 0;
    this.inputPending = 0;
    var topfile = path.join(this.basedir, "__fake.js");
    this.top = {
        id: topfile,
        filename: topfile,
        paths: this.paths,
        basedir: this.basedir,
    };
}
ModuleDeps.prototype._isTopLevel = function (file) {
    var isTopLevel = this.entries.some(function (main) {
        var m = relativePath(path.dirname(main), file);
        return m.split(/[\\\/]/).indexOf("node_modules") < 0;
    });
    if (!isTopLevel) {
        var m = relativePath(this.basedir, file);
        isTopLevel = m.split(/[\\\/]/).indexOf("node_modules") < 0;
    }
    return isTopLevel;
};
ModuleDeps.prototype._transform = function (row, enc, next) {
    var self = this;
    if (typeof row === "string") {
        row = { file: row };
    }
    if (row.transform && row.global) {
        this.globalTransforms.push([row.transform, row.options]);
        return next();
    }
    else if (row.transform) {
        this.transforms.push([row.transform, row.options]);
        return next();
    }
    self.pending++;
    var basedir = defined(row.basedir, self.basedir);
    if (row.entry !== false) {
        self.entries.push(path.resolve(basedir, row.file || row.id));
    }
    self.lookupPackage(row.file, function (err, pkg) {
        if (err && self.options.ignoreMissing) {
            self.emit("missing", row.file, self.top);
            self.pending--;
            return next();
        }
        if (err)
            return self.emit("error", err);
        self.pending--;
        self._input.push({ row: row, pkg: pkg });
        next();
    });
};
ModuleDeps.prototype._flush = function () {
    var self = this;
    var files = {};
    self._input.forEach(function (r) {
        var w = r.row, f = files[w.file || w.id];
        if (f) {
            f.row.entry = f.row.entry || w.entry;
            var ex = f.row.expose || w.expose;
            f.row.expose = ex;
            if (ex && f.row.file === f.row.id && w.file !== w.id) {
                f.row.id = w.id;
            }
        }
        else
            files[w.file || w.id] = r;
    });
    Object.keys(files).forEach(function (key) {
        var r = files[key];
        var pkg = r.pkg || {};
        var dir = r.row.file ? path.dirname(r.row.file) : self.basedir;
        if (!pkg.__dirname)
            pkg.__dirname = dir;
        self.walk(r.row, Object.assign({}, self.top, {
            filename: path.join(dir, "_fake.js"),
        }));
    });
    if (this.pending === 0)
        this.push(null);
    this._ended = true;
};
ModuleDeps.prototype.resolve = function (id, parent, cb) {
    var self = this;
    var opts = self.options;
    if (xhas(self.cache, parent.id, "deps", id) && self.cache[parent.id].deps[id]) {
        var file = self.cache[parent.id].deps[id];
        var pkg = self.pkgCache[file];
        if (pkg)
            return cb(null, file, pkg);
        return self.lookupPackage(file, function (err, pkg) {
            cb(null, file, pkg);
        });
    }
    parent.packageFilter = function (p, x) {
        var pkgdir = path.dirname(x);
        if (opts.packageFilter)
            p = opts.packageFilter(p, x);
        p.__dirname = pkgdir;
        return p;
    };
    if (opts.extensions)
        parent.extensions = opts.extensions;
    if (opts.modules)
        parent.modules = opts.modules;
    self.resolver(id, parent, function onresolve(err, file, pkg, fakePath) {
        if (err)
            return cb(err);
        if (!file)
            return cb(new Error('module not found: "' + id + '" from file ' + parent.filename));
        if (!pkg || !pkg.__dirname) {
            self.lookupPackage(file, function (err, p) {
                if (err)
                    return cb(err);
                if (!p)
                    p = {};
                if (!p.__dirname)
                    p.__dirname = path.dirname(file);
                self.pkgCache[file] = p;
                onresolve(err, file, opts.packageFilter ? opts.packageFilter(p, p.__dirname) : p, fakePath);
            });
        }
        else
            cb(err, file, pkg, fakePath);
    });
};
ModuleDeps.prototype.readFile = function (file, id, pkg) {
    var self = this;
    if (xhas(this.fileCache, file)) {
        return toStream(this.fileCache[file]);
    }
    var rs = fs.createReadStream(file, {
        encoding: "utf8",
    });
    return rs;
};
ModuleDeps.prototype.getTransforms = function (file, pkg, opts) {
    if (!opts)
        opts = {};
    var self = this;
    var isTopLevel;
    if (opts.builtin || opts.inNodeModules)
        isTopLevel = false;
    else
        isTopLevel = this._isTopLevel(file);
    var transforms = [].concat(isTopLevel ? this.transforms : []).concat(getTransforms(pkg, {
        globalTransform: this.globalTransforms,
        transformKey: this.options.transformKey,
    }));
    if (transforms.length === 0)
        return through();
    var pending = transforms.length;
    var streams = [];
    var input = through();
    var output = through();
    var dup = new DuplexWrapper(input, output);
    for (var i = 0; i < transforms.length; i++)
        (function (i) {
            makeTransform(transforms[i], function (err, trs) {
                if (err) {
                    return dup.emit("error", err);
                }
                streams[i] = trs;
                if (--pending === 0)
                    done();
            });
        })(i);
    return dup;
    function done() {
        var middle = StreamCombiner.apply(null, streams);
        middle.on("error", function (err) {
            err.message += " while parsing file: " + file;
            if (!err.filename)
                err.filename = file;
            dup.emit("error", err);
        });
        input.pipe(middle).pipe(output);
    }
    function makeTransform(tr, cb) {
        var trOpts = {};
        if (Array.isArray(tr)) {
            trOpts = tr[1] || {};
            tr = tr[0];
        }
        trOpts._flags = trOpts.hasOwnProperty("_flags") ? trOpts._flags : self.options;
        if (typeof tr === "function") {
            var t = tr(file, trOpts);
            t.on("dep", function (dep) {
                if (!self._transformDeps[file])
                    self._transformDeps[file] = [];
                self._transformDeps[file].push(dep);
            });
            self.emit("transform", t, file);
            nextTick(cb, null, wrapTransform(t));
        }
        else {
            loadTransform(tr, trOpts, function (err, trs) {
                if (err)
                    return cb(err);
                cb(null, wrapTransform(trs));
            });
        }
    }
    function loadTransform(id, trOpts, cb) {
        var params = {
            basedir: path.dirname(file),
            preserveSymlinks: false,
        };
        resolve(id, params, function nr(err, res, again) {
            if (err && again)
                return cb && cb(err);
            if (err) {
                params.basedir = pkg.__dirname;
                return resolve(id, params, function (e, r) {
                    nr(e, r, true);
                });
            }
            if (!res)
                return cb(new Error("cannot find transform module " +
                    id +
                    " while transforming " +
                    file));
            var r = require(res);
            if (typeof r !== "function") {
                return cb(new Error("Unexpected " +
                    typeof r +
                    " exported by the " +
                    JSON.stringify(res) +
                    " package. " +
                    "Expected a transform function."));
            }
            var trs = r(file, trOpts);
            trs.on("dep", function (dep) {
                if (!self._transformDeps[file])
                    self._transformDeps[file] = [];
                self._transformDeps[file].push(dep);
            });
            self.emit("transform", trs, file);
            cb(null, trs);
        });
    }
};
ModuleDeps.prototype.walk = function (id, parent, cb) {
    var self = this;
    var opts = self.options;
    this.pending++;
    var rec = {};
    var input;
    if (typeof id === "object") {
        rec = Object.assign({}, id);
        if (rec.entry === false)
            delete rec.entry;
        id = rec.file || rec.id;
        input = true;
        this.inputPending++;
    }
    self.resolve(id, parent, function (err, file, pkg, fakePath) {
        var builtin = has(parent.modules, id);
        if (rec.expose) {
            self.options.expose[rec.expose] = self.options.modules[rec.expose] = file;
        }
        if (pkg && !self._emittedPkg[pkg.__dirname]) {
            self._emittedPkg[pkg.__dirname] = true;
            self.emit("package", pkg);
        }
        if (opts.postFilter && !opts.postFilter(id, file, pkg)) {
            if (--self.pending === 0)
                self.push(null);
            if (input)
                --self.inputPending;
            return cb && cb(null, undefined);
        }
        if (err && rec.source) {
            file = rec.file;
            var ts = self.getTransforms(file, pkg);
            ts.on("error", function (err) {
                self.emit("error", err);
            });
            ts.pipe(new ConcatStream(function (body) {
                rec.source = body.toString("utf8");
                fromSource(file, rec.source, pkg);
            }));
            return ts.end(rec.source);
        }
        if (err && self.options.ignoreMissing) {
            if (--self.pending === 0)
                self.push(null);
            if (input)
                --self.inputPending;
            self.emit("missing", id, parent);
            return cb && cb(null, undefined);
        }
        if (err)
            return self.emit("error", err);
        if (self.visited[file]) {
            if (--self.pending === 0)
                self.push(null);
            if (input)
                --self.inputPending;
            return cb && cb(null, file);
        }
        self.visited[file] = true;
        if (rec.source) {
            var ts = self.getTransforms(file, pkg);
            ts.on("error", function (err) {
                self.emit("error", err);
            });
            ts.pipe(new ConcatStream(function (body) {
                rec.source = body.toString("utf8");
                fromSource(file, rec.source, pkg);
            }));
            return ts.end(rec.source);
        }
        var c = self.cache && self.cache[file];
        if (c)
            return fromDeps(file, c.source, c.package, fakePath, Object.keys(c.deps));
        self.persistentCache(file, id, pkg, persistentCacheFallback, function (err, c) {
            self.emit("file", file, id);
            if (err) {
                self.emit("error", err);
                return;
            }
            fromDeps(file, c.source, c.package, fakePath, Object.keys(c.deps));
        });
        function persistentCacheFallback(dataAsString, cb) {
            var stream = dataAsString ? toStream(dataAsString) : self.readFile(file, id, pkg).on("error", cb);
            stream
                .pipe(self.getTransforms(fakePath || file, pkg, {
                builtin: builtin,
                inNodeModules: parent.inNodeModules,
            }))
                .on("error", cb)
                .pipe(new ConcatStream(function (body) {
                var src = body.toString("utf8");
                try {
                    var deps = getDeps(file, src);
                }
                catch (err) {
                    cb(err);
                }
                if (deps) {
                    cb(null, {
                        source: src,
                        package: pkg,
                        deps: deps.reduce(function (deps, dep) {
                            deps[dep] = true;
                            return deps;
                        }, {}),
                    });
                }
            }));
        }
    });
    function getDeps(file, src) {
        var deps = rec.noparse ? [] : self.parseDeps(file, src);
        if (self._transformDeps[file])
            deps = deps.concat(self._transformDeps[file]);
        return deps;
    }
    function fromSource(file, src, pkg, fakePath) {
        var deps = getDeps(file, src);
        if (deps)
            fromDeps(file, src, pkg, fakePath, deps);
    }
    function fromDeps(file, src, pkg, fakePath, deps) {
        var p = deps.length;
        var resolved = {};
        if (input)
            --self.inputPending;
        (function resolve() {
            if (self.inputPending > 0)
                return setTimeout(resolve);
            deps.forEach(function (id) {
                if (opts.filter && !opts.filter(id)) {
                    resolved[id] = false;
                    if (--p === 0)
                        done();
                    return;
                }
                var isTopLevel = self._isTopLevel(fakePath || file);
                var current = {
                    id: file,
                    filename: file,
                    basedir: path.dirname(file),
                    paths: self.paths,
                    package: pkg,
                    inNodeModules: parent.inNodeModules || !isTopLevel,
                };
                self.walk(id, current, function (err, r) {
                    resolved[id] = r;
                    if (--p === 0)
                        done();
                });
            });
            if (deps.length === 0)
                done();
        })();
        function done() {
            if (!rec.id)
                rec.id = file;
            if (!rec.source)
                rec.source = src;
            if (!rec.deps)
                rec.deps = resolved;
            if (!rec.file)
                rec.file = file;
            if (self.entries.indexOf(file) >= 0) {
                rec.entry = true;
            }
            self.push(rec);
            if (cb)
                cb(null, file);
            if (--self.pending === 0)
                self.push(null);
        }
    }
};
ModuleDeps.prototype.parseDeps = function (file, src, cb) {
    var self = this;
    if (this.options.noParse === true)
        return [];
    if (/\.json$/.test(file))
        return [];
    if (Array.isArray(this.options.noParse) && this.options.noParse.indexOf(file) >= 0) {
        return [];
    }
    try {
        var deps = self.detective(src).strings;
    }
    catch (ex) {
        var message = ex && ex.message ? ex.message : ex;
        throw new Error("Parsing file " + file + ": " + message);
    }
    return deps;
};
ModuleDeps.prototype.lookupPackage = function (file, cb) {
    var self = this;
    var cached = this.pkgCache[file];
    if (cached)
        return nextTick(cb, null, cached);
    if (cached === false)
        return nextTick(cb, null, undefined);
    var dirs = parents(file ? path.dirname(file) : self.basedir);
    (function next() {
        if (dirs.length === 0) {
            self.pkgCache[file] = false;
            return cb(null, undefined);
        }
        var dir = dirs.shift();
        if (dir.split(/[\\\/]/).slice(-1)[0] === "node_modules") {
            return cb(null, undefined);
        }
        var pkgfile = path.join(dir, "package.json");
        var cached = self.pkgCache[pkgfile];
        if (cached)
            return nextTick(cb, null, cached);
        else if (cached === false)
            return next();
        var pcached = self.pkgFileCachePending[pkgfile];
        if (pcached)
            return pcached.push(onpkg);
        pcached = self.pkgFileCachePending[pkgfile] = [];
        fs.readFile(pkgfile, function (err, src) {
            if (err)
                return onpkg();
            try {
                var pkg = JSON.parse(src);
            }
            catch (err) {
                return onpkg(new Error([err + " while parsing json file " + pkgfile].join("")));
            }
            pkg.__dirname = dir;
            self.pkgCache[pkgfile] = pkg;
            self.pkgCache[file] = pkg;
            onpkg(null, pkg);
        });
        function onpkg(err, pkg) {
            if (self.pkgFileCachePending[pkgfile]) {
                var fns = self.pkgFileCachePending[pkgfile];
                delete self.pkgFileCachePending[pkgfile];
                fns.forEach(function (f) {
                    f(err, pkg);
                });
            }
            if (err)
                cb(err);
            else if (pkg && typeof pkg === "object")
                cb(null, pkg);
            else {
                self.pkgCache[pkgfile] = false;
                next();
            }
        }
    })();
};
function getTransforms(pkg, opts) {
    var trx = [];
    if (opts.transformKey) {
        var n = pkg;
        var keys = opts.transformKey;
        for (var i = 0; i < keys.length; i++) {
            if (n && typeof n === "object")
                n = n[keys[i]];
            else
                break;
        }
        if (i === keys.length) {
            trx = [].concat(n).filter(Boolean);
        }
    }
    return trx.concat(opts.globalTransform || []);
}
function xhas(obj, ...args) {
    if (!obj)
        return false;
    for (var i = 1; i < arguments.length; i++) {
        var key = arguments[i];
        if (!has(obj, key))
            return false;
        obj = obj[key];
    }
    return true;
}
function toStream(dataAsString) {
    var tr = through();
    tr.push(dataAsString);
    tr.push(null);
    return tr;
}
function wrapTransform(tr) {
    if (typeof tr.read === "function")
        return tr;
    var input = through(), output = through();
    input.pipe(tr).pipe(output);
    var wrapper = new DuplexWrapper(input, output);
    tr.on("error", function (err) {
        wrapper.emit("error", err);
    });
    return wrapper;
}
inherits(Browserify, EventEmitter);
function Browserify(files, opts) {
    var self = this;
    if (!(this instanceof Browserify))
        return new Browserify(files, opts);
    if (!opts)
        opts = {};
    if (typeof files === "string" || isArray(files) || isStream(files)) {
        opts = xtend(opts, { entries: [].concat(opts.entries || [], files) });
    }
    else
        opts = xtend(files, opts);
    if (opts.node) {
        opts.bare = true;
        opts.browserField = false;
    }
    if (opts.bare) {
        opts.builtins = false;
        opts.commondir = false;
    }
    self._options = opts;
    if (opts.noparse)
        opts.noParse = opts.noparse;
    if (opts.basedir !== undefined && typeof opts.basedir !== "string") {
        throw new Error("opts.basedir must be either undefined or a string.");
    }
    opts.dedupe = opts.dedupe === false ? false : true;
    self._external = [];
    self._exclude = [];
    self._ignore = [];
    self._expose = {};
    self._hashes = {};
    self._pending = 0;
    self._transformOrder = 0;
    self._transformPending = 0;
    self._transforms = [];
    self._entryOrder = 0;
    self._ticked = false;
    var browserField = opts.browserField;
    self._bresolve =
        browserField === false
            ? function (id, opts, cb) {
                if (!opts.basedir) {
                    opts.basedir = path.dirname(opts.filename);
                }
                resolve(id, opts, cb);
            }
            : typeof browserField === "string"
                ? function (id, opts, cb) {
                    opts.browser = browserField;
                    bresolve(id, opts, cb);
                }
                : bresolve;
    self._syntaxCache = {};
    var ignoreTransform = [].concat(opts.ignoreTransform).filter(Boolean);
    self._filterTransform = function (tr) {
        if (isArray(tr)) {
            return ignoreTransform.indexOf(tr[0]) === -1;
        }
        return ignoreTransform.indexOf(tr) === -1;
    };
    self.pipeline = self._createPipeline(opts);
    []
        .concat(opts.transform)
        .filter(Boolean)
        .filter(self._filterTransform)
        .forEach(function (tr) {
        self.transform(tr);
    });
    []
        .concat(opts.entries)
        .filter(Boolean)
        .forEach(function (file) {
        self.add(file, { basedir: opts.basedir });
    });
    []
        .concat(opts.require)
        .filter(Boolean)
        .forEach(function (file) {
        self.require(file, { basedir: opts.basedir });
    });
    []
        .concat(opts.plugin)
        .filter(Boolean)
        .forEach(function (p) {
        self.plugin(p, { basedir: opts.basedir });
    });
}
Browserify.prototype.require = function (file, opts) {
    var self = this;
    if (isArray(file)) {
        file.forEach(function (x) {
            if (typeof x === "object") {
                self.require(x.file, xtend(opts, x));
            }
            else
                self.require(x, opts);
        });
        return this;
    }
    if (!opts)
        opts = {};
    var basedir = defined(opts.basedir, self._options.basedir, process.cwd());
    var expose = opts.expose;
    if (file === expose && /^[\.]/.test(expose)) {
        expose = "/" + relativePath(basedir, expose);
    }
    if (expose === undefined && this._options.exposeAll) {
        expose = true;
    }
    if (expose === true) {
        expose = "/" + relativePath(basedir, file);
    }
    if (isStream(file)) {
        self._pending++;
        var order = self._entryOrder++;
        file.pipe(new ConcatStream(function (buf) {
            var filename = opts.file || file.file || path.join(basedir, "_stream_" + order + ".js");
            var id = file.id || expose || filename;
            if (expose || opts.entry === false) {
                self._expose[id] = filename;
            }
            if (!opts.entry && self._options.exports === undefined) {
                self._bpack.hasExports = true;
            }
            var rec = {
                source: buf.toString("utf8"),
                entry: defined(opts.entry, false),
                file: filename,
                id: id,
            };
            if (rec.entry)
                rec.order = order;
            if (rec.transform === false)
                rec.transform = false;
            self.pipeline.write(rec);
            if (--self._pending === 0)
                self.emit("_ready");
        }));
        return this;
    }
    var row;
    if (typeof file === "object") {
        row = xtend(file, opts);
    }
    else if (!opts.entry && isExternalModule(file)) {
        row = xtend(opts, { id: expose || file, file: file });
    }
    else {
        row = xtend(opts, { file: path.resolve(basedir, file) });
    }
    if (!row.id) {
        row.id = expose || row.file;
    }
    if (expose || !row.entry) {
        row.expose = row.id;
    }
    if (opts.external)
        return self.external(file, opts);
    if (row.entry === undefined)
        row.entry = false;
    if (!row.entry && self._options.exports === undefined) {
        self._bpack.hasExports = true;
    }
    if (row.entry)
        row.order = self._entryOrder++;
    if (opts.transform === false)
        row.transform = false;
    self.pipeline.write(row);
    return self;
};
Browserify.prototype.add = function (file, opts) {
    var self = this;
    if (!opts)
        opts = {};
    if (isArray(file)) {
        file.forEach(function (x) {
            self.add(x, opts);
        });
        return this;
    }
    return this.require(file, xtend({ entry: true, expose: false }, opts));
};
Browserify.prototype.external = function (file, opts) {
    var self = this;
    if (isArray(file)) {
        file.forEach(function (f) {
            if (typeof f === "object") {
                self.external(f, xtend(opts, f));
            }
            else
                self.external(f, opts);
        });
        return this;
    }
    if (file && typeof file === "object" && typeof file.bundle === "function") {
        var b = file;
        self._pending++;
        var bdeps = {};
        var blabels = {};
        b.on("label", function (prev, id) {
            self._external.push(id);
            if (prev !== id) {
                blabels[prev] = id;
                self._external.push(prev);
            }
        });
        b.pipeline.get("deps").push(through.obj(function (row, enc, next) {
            bdeps = xtend(bdeps, row.deps);
            this.push(row);
            next();
        }));
        self.on("dep", function (row) {
            Object.keys(row.deps).forEach(function (key) {
                var prev = bdeps[key];
                if (prev) {
                    var id = blabels[prev];
                    if (id) {
                        row.indexDeps[key] = id;
                    }
                }
            });
        });
        b.pipeline.get("label").once("end", function () {
            if (--self._pending === 0)
                self.emit("_ready");
        });
        return this;
    }
    if (!opts)
        opts = {};
    var basedir = defined(opts.basedir, process.cwd());
    this._external.push(file);
    this._external.push("/" + relativePath(basedir, file));
    return this;
};
Browserify.prototype.exclude = function (file, opts) {
    if (!opts)
        opts = {};
    if (isArray(file)) {
        var self = this;
        file.forEach(function (file) {
            self.exclude(file, opts);
        });
        return this;
    }
    var basedir = defined(opts.basedir, process.cwd());
    this._exclude.push(file);
    this._exclude.push("/" + relativePath(basedir, file));
    return this;
};
Browserify.prototype.ignore = function (file, opts) {
    if (!opts)
        opts = {};
    if (isArray(file)) {
        var self = this;
        file.forEach(function (file) {
            self.ignore(file, opts);
        });
        return this;
    }
    var basedir = defined(opts.basedir, process.cwd());
    if (file[0] === ".") {
        this._ignore.push(path.resolve(basedir, file));
    }
    else {
        this._ignore.push(file);
    }
    return this;
};
Browserify.prototype.transform = function (tr, opts) {
    var self = this;
    if (typeof opts === "function" || typeof opts === "string") {
        tr = [opts, tr];
    }
    if (isArray(tr)) {
        opts = tr[1];
        tr = tr[0];
    }
    if (typeof tr === "string" && !self._filterTransform(tr)) {
        return this;
    }
    function resolved() {
        self._transforms[order] = rec;
        --self._pending;
        if (--self._transformPending === 0) {
            self._transforms.forEach(function (transform) {
                self.pipeline.write(transform);
            });
            if (self._pending === 0) {
                self.emit("_ready");
            }
        }
    }
    if (!opts)
        opts = {};
    opts._flags = "_flags" in opts ? opts._flags : self._options;
    var basedir = defined(opts.basedir, this._options.basedir, process.cwd());
    var order = self._transformOrder++;
    self._pending++;
    self._transformPending++;
    var rec = {
        transform: tr,
        options: opts,
        global: opts.global,
    };
    if (typeof tr === "string") {
        var topts = {
            basedir: basedir,
            paths: (self._options.paths || []).map(function (p) {
                return path.resolve(basedir, p);
            }),
        };
        resolve(tr, topts, function (err, res) {
            if (err)
                return self.emit("error", err);
            rec.transform = res;
            resolved();
        });
    }
    else
        process.nextTick(resolved);
    return this;
};
Browserify.prototype.plugin = function (p, opts) {
    if (isArray(p)) {
        opts = p[1];
        p = p[0];
    }
    if (!opts)
        opts = {};
    var basedir = defined(opts.basedir, this._options.basedir, process.cwd());
    if (typeof p === "function") {
        p(this, opts);
    }
    else {
        var pfile = resolve.sync(String(p), { basedir: basedir });
        var f = require(pfile);
        if (typeof f !== "function") {
            throw new Error("plugin " + p + " should export a function");
        }
        f(this, opts);
    }
    return this;
};
Browserify.prototype._createPipeline = function (opts) {
    var self = this;
    if (!opts)
        opts = {};
    this._mdeps = this._createDeps(opts);
    this._mdeps.on("file", function (file, id) {
        pipeline.emit("file", file, id);
        self.emit("file", file, id);
    });
    this._mdeps.on("package", function (pkg) {
        pipeline.emit("package", pkg);
        self.emit("package", pkg);
    });
    this._mdeps.on("transform", function (tr, file) {
        pipeline.emit("transform", tr, file);
        self.emit("transform", tr, file);
    });
    var dopts = {
        index: !opts.fullPaths && !opts.exposeAll,
        dedupe: opts.dedupe,
        expose: this._expose,
    };
    this._bpack = browserPack(xtend(opts, { raw: true }));
    var pipeline = LabeledStreamSplicer.obj([
        'record', [this._recorder()],
        'deps', [this._mdeps],
        'json', [this._json()],
        'unbom', [this._unbom()],
        'unshebang', [this._unshebang()],
        'syntax', [this._syntax()],
        'sort', [sortDependencies(dopts)],
        'dedupe', [this._dedupe()],
        'label', [this._label(opts)],
        'emit-deps', [this._emitDeps()],
        'debug', [this._debug(opts)],
        'pack', [this._bpack],
        'wrap', []
    ]);
    if (opts.exposeAll) {
        var basedir = defined(opts.basedir, process.cwd());
        pipeline.get("deps").push(through.obj(function (row, enc, next) {
            if (self._external.indexOf(row.id) >= 0)
                return next();
            if (self._external.indexOf(row.file) >= 0)
                return next();
            if (isAbsolutePath(row.id)) {
                row.id = "/" + relativePath(basedir, row.file);
            }
            Object.keys(row.deps || {}).forEach(function (key) {
                row.deps[key] = "/" + relativePath(basedir, row.deps[key]);
            });
            this.push(row);
            next();
        }));
    }
    return pipeline;
};
Browserify.prototype._createDeps = function (opts) {
    var self = this;
    var mopts = xtend(opts);
    var basedir = defined(opts.basedir, process.cwd());
    mopts.expose = this._expose;
    mopts.extensions = [".js", ".json"].concat(mopts.extensions || []);
    self._extensions = mopts.extensions;
    mopts.transform = [];
    mopts.transformKey = defined(opts.transformKey, ["browserify", "transform"]);
    mopts.postFilter = function (id, file, pkg) {
        if (opts.postFilter && !opts.postFilter(id, file, pkg))
            return false;
        if (self._external.indexOf(file) >= 0)
            return false;
        if (self._exclude.indexOf(file) >= 0)
            return false;
        if (pkg && pkg.browserify && pkg.browserify.transform) {
            pkg.browserify.transform = [].concat(pkg.browserify.transform).filter(Boolean).filter(self._filterTransform);
        }
        return true;
    };
    mopts.filter = function (id) {
        if (opts.filter && !opts.filter(id))
            return false;
        if (self._external.indexOf(id) >= 0)
            return false;
        if (self._exclude.indexOf(id) >= 0)
            return false;
        if (opts.bundleExternal === false && isExternalModule(id)) {
            return false;
        }
        return true;
    };
    mopts.resolve = function (id, parent, cb) {
        if (self._ignore.indexOf(id) >= 0)
            return cb(null, paths.empty, {});
        self._bresolve(id, parent, function (err, file, pkg) {
            if (file && self._ignore.indexOf(file) >= 0) {
                return cb(null, paths.empty, {});
            }
            if (file && self._ignore.length) {
                var nm = file.replace(/\\/g, "/").split("/node_modules/")[1];
                if (nm) {
                    nm = nm.split("/")[0];
                    if (self._ignore.indexOf(nm) >= 0) {
                        return cb(null, paths.empty, {});
                    }
                }
            }
            if (file) {
                var ex = "/" + relativePath(basedir, file);
                if (self._external.indexOf(ex) >= 0) {
                    return cb(null, ex);
                }
                if (self._exclude.indexOf(ex) >= 0) {
                    return cb(null, ex);
                }
                if (self._ignore.indexOf(ex) >= 0) {
                    return cb(null, paths.empty, {});
                }
            }
            if (err)
                cb(err, file, pkg);
            else if (file) {
                if (opts.preserveSymlinks && parent.id !== self._mdeps.top.id) {
                    return cb(err, path.resolve(file), pkg, file);
                }
                fs.realpath(file, function (err, res) {
                    cb(err, res, pkg, file);
                });
            }
            else
                cb(err, null, pkg);
        });
    };
    builtinModules.forEach(key => self._exclude.push(key));
    mopts.globalTransform = [];
    if (!this._bundled) {
        this.once("bundle", function () {
            self.pipeline.write({
                transform: globalTr,
                global: true,
                options: {},
            });
        });
    }
    function globalTr(file) {
        if (opts.node || opts.bare || opts.target == "node")
            return through();
        else
            return insertModuleGlobals(file, xtend(opts, {
                debug: opts.debug,
                always: opts.insertGlobals,
                basedir: opts.commondir === false && isArray(opts.builtins) ? "/" : opts.basedir || process.cwd(),
            }));
    }
    return ModuleDeps(mopts);
};
Browserify.prototype._recorder = function (opts) {
    var self = this;
    var ended = false;
    this._recorded = [];
    if (!this._ticked) {
        process.nextTick(function () {
            self._ticked = true;
            self._recorded.forEach(function (row) {
                stream.push(row);
            });
            if (ended)
                stream.push(null);
        });
    }
    var stream = through.obj(write, end);
    return stream;
    function write(row, enc, next) {
        self._recorded.push(row);
        if (self._ticked)
            this.push(row);
        next();
    }
    function end() {
        ended = true;
        if (self._ticked)
            this.push(null);
    }
};
Browserify.prototype._json = function () {
    return through.obj(function (row, enc, next) {
        if (/\.json$/.test(row.file)) {
            row.source = "module.exports=" + sanitize(row.source);
        }
        this.push(row);
        next();
    });
};
Browserify.prototype._unbom = function () {
    return through.obj(function (row, enc, next) {
        if (/^\ufeff/.test(row.source)) {
            row.source = row.source.replace(/^\ufeff/, "");
        }
        this.push(row);
        next();
    });
};
Browserify.prototype._unshebang = function () {
    return through.obj(function (row, enc, next) {
        if (/^#!/.test(row.source)) {
            row.source = row.source.replace(/^#![^\n]*\n/, "");
        }
        this.push(row);
        next();
    });
};
Browserify.prototype._syntax = function () {
    var self = this;
    return through.obj(function (row, enc, next) {
        var h = shasum(row.source);
        if (typeof self._syntaxCache[h] === "undefined") {
            var err = checkSyntax(row.source, row.file || row.id);
            if (err)
                return this.emit("error", err);
            self._syntaxCache[h] = true;
        }
        this.push(row);
        next();
    });
};
Browserify.prototype._dedupe = function () {
    return through.obj(function (row, enc, next) {
        if (!row.dedupeIndex && row.dedupe) {
            row.source = "arguments[4][" + JSON.stringify(row.dedupe) + "][0].apply(exports,arguments)";
            row.nomap = true;
        }
        else if (row.dedupeIndex) {
            row.source = "arguments[4][" + JSON.stringify(row.dedupeIndex) + "][0].apply(exports,arguments)";
            row.nomap = true;
        }
        if (row.dedupeIndex && row.indexDeps) {
            row.indexDeps.dup = row.dedupeIndex;
        }
        this.push(row);
        next();
    });
};
Browserify.prototype._label = function (opts) {
    var self = this;
    var basedir = defined(opts.basedir, process.cwd());
    return through.obj(function (row, enc, next) {
        var prev = row.id;
        if (self._external.indexOf(row.id) >= 0)
            return next();
        if (self._external.indexOf("/" + relativePath(basedir, row.id)) >= 0) {
            return next();
        }
        if (self._external.indexOf(row.file) >= 0)
            return next();
        if (row.index)
            row.id = row.index;
        self.emit("label", prev, row.id);
        if (row.indexDeps)
            row.deps = row.indexDeps || {};
        Object.keys(row.deps).forEach(function (key) {
            if (self._expose[key]) {
                row.deps[key] = key;
                return;
            }
            var afile = path.resolve(path.dirname(row.file), key);
            var rfile = "/" + relativePath(basedir, afile);
            if (self._external.indexOf(rfile) >= 0) {
                row.deps[key] = rfile;
            }
            if (self._external.indexOf(afile) >= 0) {
                row.deps[key] = rfile;
            }
            if (self._external.indexOf(key) >= 0) {
                row.deps[key] = key;
                return;
            }
            for (var i = 0; i < self._extensions.length; i++) {
                var ex = self._extensions[i];
                if (self._external.indexOf(rfile + ex) >= 0) {
                    row.deps[key] = rfile + ex;
                    break;
                }
            }
        });
        if (row.entry || row.expose) {
            self._bpack.standaloneModule = row.id;
        }
        this.push(row);
        next();
    });
};
Browserify.prototype._emitDeps = function () {
    var self = this;
    return through.obj(function (row, enc, next) {
        self.emit("dep", row);
        this.push(row);
        next();
    });
};
Browserify.prototype._debug = function (opts) {
    var basedir = defined(opts.basedir, process.cwd());
    return through.obj(function (row, enc, next) {
        if (opts.debug) {
            row.sourceRoot = "file://localhost";
            row.sourceFile = relativePath(basedir, row.file);
        }
        this.push(row);
        next();
    });
};
Browserify.prototype.reset = function (opts) {
    if (!opts)
        opts = {};
    var hadExports = this._bpack.hasExports;
    this.pipeline = this._createPipeline(xtend(opts, this._options));
    this._bpack.hasExports = hadExports;
    this._entryOrder = 0;
    this._bundled = false;
    this.emit("reset");
};
Browserify.prototype.bundle = function (cb) {
    var self = this;
    if (cb && typeof cb === "object") {
        throw new Error("bundle() no longer accepts option arguments.\n" + "Move all option arguments to the browserify() constructor.");
    }
    if (this._bundled) {
        var recorded = this._recorded;
        this.reset();
        recorded.forEach(function (x) {
            self.pipeline.write(x);
        });
    }
    var output = ReadOnlyStream(this.pipeline);
    if (cb) {
        output.on("error", cb);
        output.pipe(new ConcatStream(function (body) {
            cb(null, body);
        }));
    }
    function ready() {
        self.emit("bundle", output);
        self.pipeline.end();
    }
    if (this._pending === 0)
        ready();
    else
        this.once("_ready", ready);
    this._bundled = true;
    return output;
};
function isStream(s) {
    return s && typeof s.pipe === "function";
}
function isAbsolutePath(file) {
    var regexp = process.platform === "win32" ? /^\w:/ : /^\//;
    return regexp.test(file);
}
function isExternalModule(file) {
    var regexp = process.platform === "win32" ? /^(\.|\w:)/ : /^[\/.]/;
    return !regexp.test(file);
}
function relativePath(from, to) {
    return cachedPathRelative(from, to).replace(/\\/g, "/");
}
var core = new Set(builtinModules);
function normalizeOptions(x, opts) {
    return opts || {};
}
var getNodeModulesDirs = function getNodeModulesDirs(absoluteStart, modules) {
    var prefix = "/";
    if (/^([A-Za-z]:)/.test(absoluteStart)) {
        prefix = "";
    }
    else if (/^\\\\/.test(absoluteStart)) {
        prefix = "\\\\";
    }
    var paths = [absoluteStart];
    var parsed = path.parse(absoluteStart);
    while (parsed.dir !== paths[paths.length - 1]) {
        paths.push(parsed.dir);
        parsed = path.parse(parsed.dir);
    }
    return paths.reduce(function (dirs, aPath) {
        return dirs.concat(modules.map(function (moduleDir) {
            return path.resolve(prefix, aPath, moduleDir);
        }));
    }, []);
};
function nodeModulesPaths(start, opts, request) {
    var modules = opts && opts.moduleDirectory ? [].concat(opts.moduleDirectory) : ["node_modules"];
    if (opts && typeof opts.paths === "function") {
        return opts.paths(request, start, function () {
            return getNodeModulesDirs(start, modules);
        }, opts);
    }
    var dirs = getNodeModulesDirs(start, modules);
    return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
}
function caller() {
    var origPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        return stack;
    };
    var stack = new Error().stack;
    Error.prepareStackTrace = origPrepareStackTrace;
    return stack[2].getFileName();
}
var defaultIsFile = function isFile(file, cb) {
    fs.stat(file, function (err, stat) {
        if (!err) {
            return cb(null, stat.isFile() || stat.isFIFO());
        }
        if (err.code === "ENOENT" || err.code === "ENOTDIR")
            return cb(null, false);
        return cb(err);
    });
};
var defaultIsDir = function isDirectory(dir, cb) {
    fs.stat(dir, function (err, stat) {
        if (!err) {
            return cb(null, stat.isDirectory());
        }
        if (err.code === "ENOENT" || err.code === "ENOTDIR")
            return cb(null, false);
        return cb(err);
    });
};
function resolve(x, options, callback) {
    var cb = callback;
    var opts = options;
    if (typeof options === "function") {
        cb = opts;
        opts = {};
    }
    if (typeof x !== "string") {
        var err = new TypeError("Path must be a string.");
        return process.nextTick(function () {
            cb(err);
        });
    }
    opts = normalizeOptions(x, opts);
    var isFile = opts.isFile || defaultIsFile;
    var isDirectory = opts.isDirectory || defaultIsDir;
    var readFile = opts.readFile || fs.readFile;
    var extensions = opts.extensions || [".js"];
    var basedir = opts.basedir || path.dirname(caller());
    var parent = opts.filename || basedir;
    opts.paths = opts.paths || [];
    var absoluteStart = path.resolve(basedir);
    if (opts.preserveSymlinks === false) {
        fs.realpath(absoluteStart, function (realPathErr, realStart) {
            if (realPathErr && realPathErr.code !== "ENOENT")
                cb(err);
            else
                init(realPathErr ? absoluteStart : realStart);
        });
    }
    else {
        init(absoluteStart);
    }
    var res;
    function init(basedir) {
        if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
            res = path.resolve(basedir, x);
            if (x === ".." || x.slice(-1) === "/")
                res += "/";
            if (/\/$/.test(x) && res === basedir) {
                loadAsDirectory(res, opts.package, onfile);
            }
            else
                loadAsFile(res, opts.package, onfile);
        }
        else
            loadNodeModules(x, basedir, function (err, n, pkg) {
                if (err)
                    cb(err);
                else if (core.has(x))
                    return cb(null, x);
                else if (n)
                    cb(null, n, pkg);
                else {
                    var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
                    moduleError.code = "MODULE_NOT_FOUND";
                    cb(moduleError);
                }
            });
    }
    function onfile(err, m, pkg) {
        if (err)
            cb(err);
        else if (m)
            cb(null, m, pkg);
        else
            loadAsDirectory(res, function (err, d, pkg) {
                if (err)
                    cb(err);
                else if (d)
                    cb(null, d, pkg);
                else {
                    var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
                    moduleError.code = "MODULE_NOT_FOUND";
                    cb(moduleError);
                }
            });
    }
    function loadAsFile(x, thePackage, callback) {
        var loadAsFilePackage = thePackage;
        var cb = callback;
        if (typeof loadAsFilePackage === "function") {
            cb = loadAsFilePackage;
            loadAsFilePackage = undefined;
        }
        var exts = [""].concat(extensions);
        load(exts, x, loadAsFilePackage);
        function load(exts, x, loadPackage) {
            if (exts.length === 0)
                return cb(null, undefined, loadPackage);
            var file = x + exts[0];
            var pkg = loadPackage;
            if (pkg)
                onpkg(null, pkg);
            else
                loadpkg(path.dirname(file), onpkg);
            function onpkg(err, pkg_, dir = void 0) {
                pkg = pkg_;
                if (err)
                    return cb(err);
                if (dir && pkg && opts.pathFilter) {
                    var rfile = path.relative(dir, file);
                    var rel = rfile.slice(0, rfile.length - exts[0].length);
                    var r = opts.pathFilter(pkg, x, rel);
                    if (r)
                        return load([""].concat(extensions.slice()), path.resolve(dir, r), pkg);
                }
                isFile(file, onex);
            }
            function onex(err, ex) {
                if (err)
                    return cb(err);
                if (ex)
                    return cb(null, file, pkg);
                load(exts.slice(1), x, pkg);
            }
        }
    }
    function loadpkg(dir, cb) {
        if (dir === "" || dir === "/")
            return cb(null);
        if (process.platform === "win32" && /^\w:[/\\]*$/.test(dir)) {
            return cb(null);
        }
        if (/[/\\]node_modules[/\\]*$/.test(dir))
            return cb(null);
        var pkgfile = path.join(dir, "package.json");
        isFile(pkgfile, function (err, ex) {
            if (!ex)
                return loadpkg(path.dirname(dir), cb);
            readFile(pkgfile, function (err, body) {
                if (err)
                    cb(err);
                try {
                    var pkg = JSON.parse(body);
                }
                catch (jsonErr) { }
                if (pkg && opts.packageFilter) {
                    pkg = opts.packageFilter(pkg, pkgfile);
                }
                cb(null, pkg, dir);
            });
        });
    }
    function loadAsDirectory(x, loadAsDirectoryPackage, callback = void 0) {
        var cb = callback;
        var fpkg = loadAsDirectoryPackage;
        if (typeof fpkg === "function") {
            cb = fpkg;
            fpkg = opts.package;
        }
        var pkgfile = path.join(x, "package.json");
        isFile(pkgfile, function (err, ex) {
            if (err)
                return cb(err);
            if (!ex)
                return loadAsFile(path.join(x, "index"), fpkg, cb);
            readFile(pkgfile, function (err, body) {
                if (err)
                    return cb(err);
                try {
                    var pkg = JSON.parse(body);
                }
                catch (jsonErr) { }
                if (opts.packageFilter) {
                    pkg = opts.packageFilter(pkg, pkgfile);
                }
                if (pkg.main) {
                    if (typeof pkg.main !== "string") {
                        var mainError = new TypeError("package “" + pkg.name + "” `main` must be a string");
                        mainError.code = "INVALID_PACKAGE_MAIN";
                        return cb(mainError);
                    }
                    if (pkg.main === "." || pkg.main === "./") {
                        pkg.main = "index";
                    }
                    loadAsFile(path.resolve(x, pkg.main), pkg, function (err, m, pkg) {
                        if (err)
                            return cb(err);
                        if (m)
                            return cb(null, m, pkg);
                        if (!pkg)
                            return loadAsFile(path.join(x, "index"), pkg, cb);
                        var dir = path.resolve(x, pkg.main);
                        loadAsDirectory(dir, pkg, function (err, n, pkg) {
                            if (err)
                                return cb(err);
                            if (n)
                                return cb(null, n, pkg);
                            loadAsFile(path.join(x, "index"), pkg, cb);
                        });
                    });
                    return;
                }
                loadAsFile(path.join(x, "/index"), pkg, cb);
            });
        });
    }
    function processDirs(cb, dirs) {
        if (dirs.length === 0)
            return cb(null, undefined);
        var dir = dirs[0];
        isDirectory(dir, isdir);
        function isdir(err, isdir) {
            if (err)
                return cb(err);
            if (!isdir)
                return processDirs(cb, dirs.slice(1));
            var file = path.join(dir, x);
            loadAsFile(file, opts.package, onfile);
        }
        function onfile(err, m, pkg) {
            if (err)
                return cb(err);
            if (m)
                return cb(null, m, pkg);
            loadAsDirectory(path.join(dir, x), opts.package, ondir);
        }
        function ondir(err, n, pkg) {
            if (err)
                return cb(err);
            if (n)
                return cb(null, n, pkg);
            processDirs(cb, dirs.slice(1));
        }
    }
    function loadNodeModules(x, start, cb) {
        processDirs(cb, nodeModulesPaths(start, opts, x));
    }
}
function isFile(file) {
    try {
        var stat = fs.statSync(file);
    }
    catch (e) {
        if (e && (e.code === "ENOENT" || e.code === "ENOTDIR"))
            return false;
        throw e;
    }
    return stat.isFile() || stat.isFIFO();
}
var defaultIsDirSync = function isDirectory(dir) {
    try {
        var stat = fs.statSync(dir);
    }
    catch (e) {
        if (e && (e.code === "ENOENT" || e.code === "ENOTDIR"))
            return false;
        throw e;
    }
    return stat.isDirectory();
};
var maybeUnwrapSymlink = function maybeUnwrapSymlink(x, opts) {
    if (!opts || !opts.preserveSymlinks) {
        try {
            return fs.realpathSync(x);
        }
        catch (realPathErr) {
            if (realPathErr.code !== "ENOENT") {
                throw realPathErr;
            }
        }
    }
    return x;
};
function sync(x, options) {
    if (typeof x !== "string") {
        throw new TypeError("Path must be a string.");
    }
    var opts = normalizeOptions(x, options);
    var isFile = opts.isFile || defaultIsFile;
    var isDirectory = opts.isDirectory || defaultIsDirSync;
    var readFileSync = opts.readFileSync || fs.readFileSync;
    var extensions = opts.extensions || [".js"];
    var basedir = opts.basedir || path.dirname(caller());
    var parent = opts.filename || basedir;
    opts.paths = opts.paths || [];
    var absoluteStart = maybeUnwrapSymlink(path.resolve(basedir), opts);
    if (opts.basedir && !isDirectory(absoluteStart)) {
        var dirError = new TypeError('Provided basedir "' +
            opts.basedir +
            '" is not a directory' +
            (opts.preserveSymlinks ? "" : ", or a symlink to a directory"));
        dirError.code = "INVALID_BASEDIR";
        throw dirError;
    }
    if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
        var res = path.resolve(absoluteStart, x);
        if (x === ".." || x.slice(-1) === "/")
            res += "/";
        var m = loadAsFileSync(res) || loadAsDirectorySync(res);
        if (m)
            return maybeUnwrapSymlink(m, opts);
    }
    else if (core[x]) {
        return x;
    }
    else {
        var n = loadNodeModulesSync(x, absoluteStart);
        if (n)
            return maybeUnwrapSymlink(n, opts);
    }
    if (core[x])
        return x;
    var err = new Error("Cannot find module '" + x + "' from '" + parent + "'");
    err.code = "MODULE_NOT_FOUND";
    throw err;
    function loadAsFileSync(x) {
        var pkg = loadpkg(path.dirname(x));
        if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
            var rfile = path.relative(pkg.dir, x);
            var r = opts.pathFilter(pkg.pkg, x, rfile);
            if (r) {
                x = path.resolve(pkg.dir, r);
            }
        }
        if (isFile(x)) {
            return x;
        }
        for (var i = 0; i < extensions.length; i++) {
            var file = x + extensions[i];
            if (isFile(file)) {
                return file;
            }
        }
    }
    function loadpkg(dir) {
        if (dir === "" || dir === "/")
            return;
        if (process.platform === "win32" && /^\w:[/\\]*$/.test(dir)) {
            return;
        }
        if (/[/\\]node_modules[/\\]*$/.test(dir))
            return;
        var pkgfile = path.join(dir, "package.json");
        if (!isFile(pkgfile)) {
            return loadpkg(path.dirname(dir));
        }
        var body = readFileSync(pkgfile);
        try {
            var pkg = JSON.parse(body);
        }
        catch (jsonErr) { }
        if (pkg && opts.packageFilter) {
            pkg = opts.packageFilter(pkg, pkgfile, dir);
        }
        return { pkg: pkg, dir: dir };
    }
    function loadAsDirectorySync(x) {
        var pkgfile = path.join(x, "/package.json");
        if (isFile(pkgfile)) {
            try {
                var body = readFileSync(pkgfile, "UTF8");
                var pkg = JSON.parse(body);
            }
            catch (e) { }
            if (opts.packageFilter) {
                pkg = opts.packageFilter(pkg, x);
            }
            if (pkg.main) {
                if (typeof pkg.main !== "string") {
                    var mainError = new TypeError("package “" + pkg.name + "” `main` must be a string");
                    mainError.code = "INVALID_PACKAGE_MAIN";
                    throw mainError;
                }
                if (pkg.main === "." || pkg.main === "./") {
                    pkg.main = "index";
                }
                try {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m)
                        return m;
                    var n = loadAsDirectorySync(path.resolve(x, pkg.main));
                    if (n)
                        return n;
                }
                catch (e) { }
            }
        }
        return loadAsFileSync(path.join(x, "/index"));
    }
    function loadNodeModulesSync(x, start) {
        var dirs = nodeModulesPaths(start, opts, x);
        for (var i = 0; i < dirs.length; i++) {
            var dir = dirs[i];
            if (isDirectory(dir)) {
                var m = loadAsFileSync(path.join(dir, "/", x));
                if (m)
                    return m;
                var n = loadAsDirectorySync(path.join(dir, "/", x));
                if (n)
                    return n;
            }
        }
    }
}
resolve.sync = sync;
function b_nodeModulesPaths(start, cb) {
    var splitRe = process.platform === "win32" ? /[\/\\]/ : /\/+/;
    var parts = start.split(splitRe);
    var dirs = [];
    for (var i = parts.length - 1; i >= 0; i--) {
        if (parts[i] === "node_modules")
            continue;
        var dir = path.join.apply(path, parts.slice(0, i + 1).concat(["node_modules"]));
        if (!parts[0].match(/([A-Za-z]:)/)) {
            dir = "/" + dir;
        }
        dirs.push(dir);
    }
    return dirs;
}
function find_shims_in_package(pkgJson, cur_path, shims, browser) {
    try {
        var info = JSON.parse(pkgJson);
    }
    catch (err) {
        err.message = pkgJson + " : " + err.message;
        throw err;
    }
    var replacements = getReplacements(info, browser);
    if (!replacements) {
        return;
    }
    if (typeof replacements === "string") {
        var key = path.resolve(cur_path, info.main || "index.js");
        shims[key] = path.resolve(cur_path, replacements);
        return;
    }
    Object.keys(replacements).forEach(function (key) {
        var val;
        if (replacements[key] === false) {
            val = path.normalize(__dirname + "/empty.js");
        }
        else {
            val = replacements[key];
            if (val[0] === ".") {
                val = path.resolve(cur_path, val);
            }
        }
        if (key[0] === "/" || key[0] === ".") {
            key = path.resolve(cur_path, key);
        }
        shims[key] = val;
    });
    [".js", ".json"].forEach(function (ext) {
        Object.keys(shims).forEach(function (key) {
            if (!shims[key + ext]) {
                shims[key + ext] = shims[key];
            }
        });
    });
}
function load_shims(paths, browser, cb) {
    var shims = Object.create(null);
    (function next() {
        var cur_path = paths.shift();
        if (!cur_path) {
            return cb(null, shims);
        }
        var pkg_path = path.join(cur_path, "package.json");
        fs.readFile(pkg_path, "utf8", function (err, data) {
            if (err) {
                if (err.code === "ENOENT") {
                    return next();
                }
                return cb(err);
            }
            try {
                find_shims_in_package(data, cur_path, shims, browser);
                return cb(null, shims);
            }
            catch (err) {
                return cb(err);
            }
        });
    })();
}
function load_shims_sync(paths, browser) {
    var shims = Object.create(null);
    var cur_path;
    while ((cur_path = paths.shift())) {
        var pkg_path = path.join(cur_path, "package.json");
        try {
            var data = fs.readFileSync(pkg_path, "utf8");
            find_shims_in_package(data, cur_path, shims, browser);
            return shims;
        }
        catch (err) {
            if (err.code === "ENOENT") {
                continue;
            }
            throw err;
        }
    }
    return shims;
}
function build_resolve_opts(opts, base) {
    var packageFilter = opts.packageFilter;
    var browser = normalizeBrowserFieldName(opts.browser);
    opts.basedir = base;
    opts.packageFilter = function (info, pkgdir) {
        if (packageFilter)
            info = packageFilter(info, pkgdir);
        var replacements = getReplacements(info, browser);
        if (!replacements) {
            return info;
        }
        info[browser] = replacements;
        if (typeof replacements === "string") {
            info.main = replacements;
            return info;
        }
        var replace_main = replacements[info.main || "./index.js"] || replacements["./" + info.main || "./index.js"];
        info.main = replace_main || info.main;
        return info;
    };
    var pathFilter = opts.pathFilter;
    opts.pathFilter = function (info, resvPath, relativePath) {
        if (relativePath[0] != ".") {
            relativePath = "./" + relativePath;
        }
        var mappedPath;
        if (pathFilter) {
            mappedPath = pathFilter.apply(this, arguments);
        }
        if (mappedPath) {
            return mappedPath;
        }
        var replacements = info[browser];
        if (!replacements) {
            return;
        }
        mappedPath = replacements[relativePath];
        if (!mappedPath && path.extname(relativePath) === "") {
            mappedPath = replacements[relativePath + ".js"];
            if (!mappedPath) {
                mappedPath = replacements[relativePath + ".json"];
            }
        }
        return mappedPath;
    };
    return opts;
}
function bresolve(id, opts, cb) {
    opts = opts || {};
    opts.filename = opts.filename || "";
    var base = path.dirname(opts.filename);
    if (opts.basedir) {
        base = opts.basedir;
    }
    var paths = b_nodeModulesPaths(base);
    if (opts.paths) {
        paths.push.apply(paths, opts.paths);
    }
    paths = paths.map(function (p) {
        return path.dirname(p);
    });
    load_shims(paths, opts.browser, function (err, shims) {
        if (err) {
            return cb(err);
        }
        var resid = path.resolve(opts.basedir || path.dirname(opts.filename), id);
        if (shims[id] || shims[resid]) {
            var xid = shims[id] ? id : resid;
            if (shims[xid][0] === "/") {
                return resolve(shims[xid], build_resolve_opts(opts, base), function (err, full, pkg) {
                    cb(null, full, pkg);
                });
            }
            id = shims[xid];
        }
        var modules = opts.modules || Object.create(null);
        var shim_path = modules[id];
        if (shim_path) {
            return cb(null, shim_path);
        }
        var full = resolve(id, build_resolve_opts(opts, base), function (err, full, pkg) {
            if (err) {
                return cb(err);
            }
            var resolved = shims ? shims[full] || full : full;
            cb(null, resolved, pkg);
        });
    });
}
bresolve.sync = function (id, opts) {
    opts = opts || {};
    opts.filename = opts.filename || "";
    var base = path.dirname(opts.filename);
    if (opts.basedir) {
        base = opts.basedir;
    }
    var paths = b_nodeModulesPaths(base);
    if (opts.paths) {
        paths.push.apply(paths, opts.paths);
    }
    paths = paths.map(function (p) {
        return path.dirname(p);
    });
    var shims = load_shims_sync(paths, opts.browser);
    var resid = path.resolve(opts.basedir || path.dirname(opts.filename), id);
    if (shims[id] || shims[resid]) {
        var xid = shims[id] ? id : resid;
        if (shims[xid][0] === "/") {
            return resolve.sync(shims[xid], build_resolve_opts(opts, base));
        }
        id = shims[xid];
    }
    var modules = opts.modules || Object.create(null);
    var shim_path = modules[id];
    if (shim_path) {
        return shim_path;
    }
    var full = resolve.sync(id, build_resolve_opts(opts, base));
    return shims ? shims[full] || full : full;
};
function normalizeBrowserFieldName(browser) {
    return browser || "browser";
}
function getReplacements(info, browser) {
    browser = normalizeBrowserFieldName(browser);
    var replacements = info[browser] || info.browser;
    if (typeof info.browserify === "string" && !replacements) {
        replacements = info.browserify;
    }
    return replacements;
}
inherits(Splicer, Duplex);
function Splicer(streams, opts) {
    if (!(this instanceof Splicer))
        return new Splicer(streams, opts);
    if (!opts && !Array.isArray(streams)) {
        opts = streams;
        streams = [];
    }
    if (!streams)
        streams = [];
    if (!opts)
        opts = {};
    Duplex.call(this, opts);
    var self = this;
    this._options = opts;
    this._wrapOptions = { objectMode: opts.objectMode !== false };
    this._streams = [];
    this.splice.apply(this, [0, 0].concat(streams));
    this.once("finish", function () {
        self._notEmpty();
        self._streams[0].end();
    });
}
Splicer.prototype._read = function () {
    var self = this;
    this._notEmpty();
    var r = this._streams[this._streams.length - 1];
    var buf, reads = 0;
    while ((buf = r.read()) !== null) {
        Duplex.prototype.push.call(this, buf);
        reads++;
    }
    if (reads === 0) {
        var onreadable = function () {
            r.removeListener("readable", onreadable);
            self.removeListener("_mutate", onreadable);
            self._read();
        };
        r.once("readable", onreadable);
        self.once("_mutate", onreadable);
    }
};
Splicer.prototype._write = function (buf, enc, next) {
    this._notEmpty();
    this._streams[0]._write(buf, enc, next);
};
Splicer.prototype._notEmpty = function () {
    var self = this;
    if (this._streams.length > 0)
        return;
    var stream = new PassThrough(this._options);
    stream.once("end", function () {
        var ix = self._streams.indexOf(stream);
        if (ix >= 0 && ix === self._streams.length - 1) {
            Duplex.prototype.push.call(self, null);
        }
    });
    this._streams.push(stream);
    this.length = this._streams.length;
};
Splicer.prototype.push = function (stream) {
    var args = [this._streams.length, 0].concat([].slice.call(arguments));
    this.splice.apply(this, args);
    return this._streams.length;
};
Splicer.prototype.pop = function () {
    return this.splice(this._streams.length - 1, 1)[0];
};
Splicer.prototype.shift = function () {
    return this.splice(0, 1)[0];
};
Splicer.prototype.unshift = function () {
    this.splice.apply(this, [0, 0].concat([].slice.call(arguments)));
    return this._streams.length;
};
Splicer.prototype.splice = function (start, removeLen) {
    var self = this;
    var len = this._streams.length;
    start = start < 0 ? len - start : start;
    if (removeLen === undefined)
        removeLen = len - start;
    removeLen = Math.max(0, Math.min(len - start, removeLen));
    for (var i = start; i < start + removeLen; i++) {
        if (self._streams[i - 1]) {
            self._streams[i - 1].unpipe(self._streams[i]);
        }
    }
    if (self._streams[i - 1] && self._streams[i]) {
        self._streams[i - 1].unpipe(self._streams[i]);
    }
    var end = i;
    var reps = [], args = arguments;
    for (var j = 2; j < args.length; j++)
        (function (stream) {
            if (Array.isArray(stream)) {
                stream = new Splicer(stream, self._options);
            }
            stream.on("error", function (err) {
                err.stream = this;
                self.emit("error", err);
            });
            stream = self._wrapStream(stream);
            stream.once("end", function () {
                var ix = self._streams.indexOf(stream);
                if (ix >= 0 && ix === self._streams.length - 1) {
                    Duplex.prototype.push.call(self, null);
                }
            });
            reps.push(stream);
        })(arguments[j]);
    for (var i = 0; i < reps.length - 1; i++) {
        reps[i].pipe(reps[i + 1]);
    }
    if (reps.length && self._streams[end]) {
        reps[reps.length - 1].pipe(self._streams[end]);
    }
    if (reps[0] && self._streams[start - 1]) {
        self._streams[start - 1].pipe(reps[0]);
    }
    var sargs = [start, removeLen].concat(reps);
    var removed = self._streams.splice.apply(self._streams, sargs);
    for (var i = 0; i < reps.length; i++) {
        reps[i].read(0);
    }
    this.emit("_mutate");
    this.length = this._streams.length;
    return removed;
};
Splicer.prototype.get = function () {
    if (arguments.length === 0)
        return undefined;
    var base = this;
    for (var i = 0; i < arguments.length; i++) {
        var index = arguments[i];
        if (index < 0) {
            base = base._streams[base._streams.length + index];
        }
        else {
            base = base._streams[index];
        }
        if (!base)
            return undefined;
    }
    return base;
};
Splicer.prototype.indexOf = function (stream) {
    return this._streams.indexOf(stream);
};
Splicer.prototype._wrapStream = function (stream) {
    if (typeof stream.read === "function")
        return stream;
    var w = new Readable(this._wrapOptions).wrap(stream);
    w._write = function (buf, enc, next) {
        if (stream.write(buf) === false) {
            stream.once("drain", next);
        }
        else
            nextTick(next);
    };
    return w;
};
Splicer.obj = function (streams, opts) {
    if (!opts && !Array.isArray(streams)) {
        opts = streams;
        streams = [];
    }
    if (!streams)
        streams = [];
    if (!opts)
        opts = {};
    opts.objectMode = true;
    return new Splicer(streams, opts);
};
inherits(Labeled, Splicer);
function Labeled(streams, opts) {
    if (!(this instanceof Labeled))
        return new Labeled(streams, opts);
    Splicer.call(this, [], opts);
    var reps = [];
    for (var i = 0; i < streams.length; i++) {
        var s = streams[i];
        if (typeof s === "string")
            continue;
        if (Array.isArray(s)) {
            s = new Labeled(s, opts);
        }
        if (i >= 0 && typeof streams[i - 1] === "string") {
            s.label = streams[i - 1];
        }
        reps.push(s);
    }
    if (typeof streams[i - 1] === "string") {
        reps.push(new Labeled([], opts));
    }
    this.splice.apply(this, [0, 0].concat(reps));
}
Labeled.prototype.indexOf = function (stream) {
    if (typeof stream === "string") {
        for (var i = 0; i < this._streams.length; i++) {
            if (this._streams[i].label === stream)
                return i;
        }
        return -1;
    }
    else {
        return Splicer.prototype.indexOf.call(this, stream);
    }
};
Labeled.prototype.get = function (key) {
    if (typeof key === "string") {
        var ix = this.indexOf(key);
        if (ix < 0)
            return undefined;
        return this._streams[ix];
    }
    else
        return Splicer.prototype.get.call(this, key);
};
Labeled.prototype.splice = function (key) {
    var ix;
    if (typeof key === "string") {
        ix = this.indexOf(key);
    }
    else
        ix = key;
    var args = [ix].concat([].slice.call(arguments, 1));
    return Splicer.prototype.splice.apply(this, args);
};
Labeled.obj = function (streams, opts = void 0) {
    if (!opts)
        opts = {};
    opts.objectMode = true;
    return new Labeled(streams, opts);
};
var LabeledStreamSplicer = Labeled;
class DestroyableTransform extends Transform {
    constructor(opts) {
        super(opts);
        this.destroy = function (err) {
            if (this._destroyed)
                return;
            this._destroyed = true;
            var self = this;
            process.nextTick(function () {
                if (err)
                    self.emit("error", err);
                self.emit("close");
            });
        };
        this._destroyed = false;
    }
}
function noop(chunk, enc, callback) {
    callback(null, chunk);
}
function create(construct) {
    return function (options = void 0, transform = void 0, flush = void 0) {
        if (typeof options == "function") {
            flush = transform;
            transform = options;
            options = {};
        }
        if (typeof transform != "function")
            transform = noop;
        if (typeof flush != "function")
            flush = null;
        return construct(options, transform, flush);
    };
}
var _throughText = create(function (options, transform, flush) {
    var t2 = new DestroyableTransform(options);
    t2._transform = transform;
    if (flush)
        t2._flush = flush;
    return t2;
});
let _throughObj = {
    obj: create(function (options, transform, flush) {
        var t2 = new DestroyableTransform(Object.assign({ objectMode: true, highWaterMark: 16 }, options));
        t2._transform = transform;
        if (flush)
            t2._flush = flush;
        return t2;
    }),
};
let through = Object.assign(_throughText, _throughObj);
class ConcatStream extends Writable {
    constructor(opts, cb) {
        super(opts);
        this._write = function (chunk, enc, next) {
            this.body.push(chunk);
            next();
        };
        this.inferEncoding = function (buff) {
            var firstBuffer = buff === undefined ? this.body[0] : buff;
            if (Buffer.isBuffer(firstBuffer))
                return "buffer";
            if (typeof Uint8Array !== "undefined" && firstBuffer instanceof Uint8Array)
                return "uint8array";
            if (Array.isArray(firstBuffer))
                return "array";
            if (typeof firstBuffer === "string")
                return "string";
            if (Object.prototype.toString.call(firstBuffer) === "[object Object]")
                return "object";
            return "buffer";
        };
        this.getBody = function () {
            if (!this.encoding && this.body.length === 0)
                return [];
            if (this.shouldInferEncoding)
                this.encoding = this.inferEncoding();
            if (this.encoding === "array")
                return arrayConcat(this.body);
            if (this.encoding === "string")
                return stringConcat(this.body);
            if (this.encoding === "buffer")
                return bufferConcat(this.body);
            if (this.encoding === "uint8array")
                return u8Concat(this.body);
            return this.body;
        };
        if (!(this instanceof ConcatStream))
            return new ConcatStream(opts, cb);
        if (typeof opts === "function") {
            cb = opts;
            opts = {};
        }
        if (!opts)
            opts = {};
        var encoding = opts.encoding;
        var shouldInferEncoding = false;
        if (!encoding) {
            shouldInferEncoding = true;
        }
        else {
            encoding = String(encoding).toLowerCase();
            if (encoding === "u8" || encoding === "uint8") {
                encoding = "uint8array";
            }
        }
        Writable.call(this, { objectMode: true });
        this.encoding = encoding;
        this.shouldInferEncoding = shouldInferEncoding;
        if (cb)
            this.on("finish", function () {
                cb(this.getBody());
            });
        this.body = [];
    }
}
var isArray = Array.isArray ||
    function (arr) {
        return Object.prototype.toString.call(arr) == "[object Array]";
    };
function isArrayish(arr) {
    return /Array\]$/.test(Object.prototype.toString.call(arr));
}
function isBufferish(p) {
    return typeof p === "string" || isArrayish(p) || (p && typeof p.subarray === "function");
}
function stringConcat(parts) {
    var strings = [];
    var needsToString = false;
    for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (typeof p === "string") {
            strings.push(p);
        }
        else if (Buffer.isBuffer(p)) {
            strings.push(p);
        }
        else if (isBufferish(p)) {
            strings.push(Buffer.from(p));
        }
        else {
            strings.push(Buffer.from(String(p)));
        }
    }
    if (Buffer.isBuffer(parts[0])) {
        strings = Buffer.concat(strings);
        strings = strings.toString("utf8");
    }
    else {
        strings = strings.join("");
    }
    return strings;
}
function bufferConcat(parts) {
    var bufs = [];
    for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (Buffer.isBuffer(p)) {
            bufs.push(p);
        }
        else if (isBufferish(p)) {
            bufs.push(Buffer.from(p));
        }
        else {
            bufs.push(Buffer.from(String(p)));
        }
    }
    return Buffer.concat(bufs);
}
function arrayConcat(parts) {
    var res = [];
    for (var i = 0; i < parts.length; i++) {
        res.push.apply(res, parts[i]);
    }
    return res;
}
function u8Concat(parts) {
    var len = 0;
    for (var i = 0; i < parts.length; i++) {
        if (typeof parts[i] === "string") {
            parts[i] = Buffer.from(parts[i]);
        }
        len += parts[i].length;
    }
    var u8 = new Uint8Array(len);
    for (var i = 0, offset = 0; i < parts.length; i++) {
        var part = parts[i];
        for (var j = 0; j < part.length; j++) {
            u8[offset++] = part[j];
        }
    }
    return u8;
}
function ReadOnlyStream(stream) {
    var opts = stream._readableState;
    if (typeof stream.read !== "function") {
        stream = new Readable(opts).wrap(stream);
    }
    var ro = new Readable({ objectMode: opts && opts.objectMode });
    var waiting = false;
    stream.on("readable", function () {
        if (waiting) {
            waiting = false;
            ro._read();
        }
    });
    ro._read = function () {
        var buf, reads = 0;
        while ((buf = stream.read()) !== null) {
            ro.push(buf);
            reads++;
        }
        if (reads === 0)
            waiting = true;
    };
    stream.once("end", function () {
        ro.push(null);
    });
    stream.on("error", function (err) {
        ro.emit("error", err);
    });
    return ro;
}
function StreamCombiner() {
    var streams;
    if (arguments.length == 1 && Array.isArray(arguments[0])) {
        streams = arguments[0];
    }
    else {
        streams = [].slice.call(arguments);
    }
    return combine(streams);
}
StreamCombiner.obj = function () {
    var streams;
    if (arguments.length == 1 && Array.isArray(arguments[0])) {
        streams = arguments[0];
    }
    else {
        streams = [].slice.call(arguments);
    }
    return combine(streams, { objectMode: true });
};
function combine(streams, opts = void 0) {
    for (var i = 0; i < streams.length; i++)
        streams[i] = wrap(streams[i], opts);
    if (streams.length == 0)
        return new PassThrough(opts);
    else if (streams.length == 1)
        return streams[0];
    var first = streams[0], last = streams[streams.length - 1], thepipe = new DuplexWrapper(opts, first, last);
    function recurse(streams) {
        if (streams.length < 2)
            return;
        streams[0].pipe(streams[1]);
        recurse(streams.slice(1));
    }
    recurse(streams);
    function onerror() {
        var args = [].slice.call(arguments);
        args.unshift("error");
        thepipe.emit.apply(thepipe, args);
    }
    for (var i = 1; i < streams.length - 1; i++)
        streams[i].on("error", onerror);
    return thepipe;
}
function wrap(tr, opts) {
    if (typeof tr.read === "function")
        return tr;
    return new Readable(opts).wrap(tr);
}
function DuplexWrapper(options, writable, readable) {
    if (typeof readable === "undefined") {
        readable = writable;
        writable = options;
        options = null;
    }
    Duplex.call(this, options);
    if (typeof readable.read !== "function") {
        readable = new Readable(options).wrap(readable);
    }
    this._writable = writable;
    this._readable = readable;
    this._waiting = false;
    var self = this;
    writable.once("finish", function () {
        self.end();
    });
    this.once("finish", function () {
        writable.end();
    });
    readable.on("readable", function () {
        if (self._waiting) {
            self._waiting = false;
            self._read();
        }
    });
    readable.once("end", function () {
        self.push(null);
    });
    if (!options || typeof options.bubbleErrors === "undefined" || options.bubbleErrors) {
        writable.on("error", function (err) {
            self.emit("error", err);
        });
        readable.on("error", function (err) {
            self.emit("error", err);
        });
    }
}
DuplexWrapper.prototype = Object.create(Duplex.prototype, {
    constructor: { value: DuplexWrapper },
});
DuplexWrapper.prototype._write = function _write(input, encoding, done) {
    this._writable.write(input, encoding, done);
};
DuplexWrapper.prototype._read = function _read() {
    var buf;
    var reads = 0;
    while ((buf = this._readable.read()) !== null) {
        this.push(buf);
        reads++;
    }
    if (reads === 0) {
        this._waiting = true;
    }
};
function SinkStream(opts, tr) {
    if (typeof opts === "function") {
        tr = opts;
        opts = {};
    }
    var sink;
    var done;
    if (typeof tr !== "function") {
        tr = function (bufs, next) {
            this.push(bufs);
            next();
        };
    }
    function write(buf, enc, next) {
        if (!sink) {
            sink = new ConcatStream(opts, function (data) {
                tr.call(stream, data, done);
            });
        }
        sink.write(buf);
        next();
    }
    function end(next) {
        if (!sink) {
            return next();
        }
        done = next;
        sink.end();
    }
    var stream = new Transform({ objectMode: true });
    stream._transform = write;
    stream._flush = end;
    return stream;
}
SinkStream.obj = function (tr) {
    return SinkStream({ encoding: "object" }, tr);
};
SinkStream.str = function (tr) {
    return SinkStream({ encoding: "string" }, tr);
};
function maybeEmptyObject(opts) {
    opts = opts || {};
    return opts;
}
function From2Ctor(opts = void 0, read = void 0) {
    if (typeof opts === "function") {
        read = opts;
        opts = {};
    }
    opts = maybeEmptyObject(opts);
    inherits(Class, Readable);
    function Class(override) {
        if (!(this instanceof Class))
            return new Class(override);
        this._reading = false;
        this._callback = check;
        this.destroyed = false;
        Readable.call(this, override || opts);
        var self = this;
        var hwm = this._readableState.highWaterMark;
        function check(err, data) {
            if (self.destroyed)
                return;
            if (err)
                return self.destroy(err);
            if (data === null)
                return self.push(null);
            self._reading = false;
            if (self.push(data))
                self._read(hwm);
        }
    }
    Class.prototype._from = read || function noop() { };
    Class.prototype._read = function (size) {
        if (this._reading || this.destroyed)
            return;
        this._reading = true;
        this._from(size, this._callback);
    };
    Class.prototype.destroy = function (err) {
        if (this.destroyed)
            return;
        this.destroyed = true;
        var self = this;
        process.nextTick(function () {
            if (err)
                self.emit("error", err);
            self.emit("close");
        });
    };
    return Class;
}
function from2(opts, read) {
    function toFunction(list) {
        list = list.slice();
        return function (_, cb) {
            var err = null;
            var item = list.length ? list.shift() : null;
            if (item instanceof Error) {
                err = item;
                item = null;
            }
            cb(err, item);
        };
    }
    if (typeof opts !== "object" || Array.isArray(opts)) {
        read = opts;
        opts = {};
    }
    var rs = new From2Ctor(opts);
    rs._from = Array.isArray(read) ? toFunction(read) : read || noop;
    return rs;
}
from2.ctor = From2Ctor;
from2.obj = function obj(opts, read) {
    if (typeof opts === "function" || Array.isArray(opts)) {
        read = opts;
        opts = {};
    }
    opts = maybeEmptyObject(opts);
    opts.objectMode = true;
    opts.highWaterMark = 16;
    return from2(opts, read);
};







//
// ─── WATCHIFY ───────────────────────────────────────────────────────────────────
//


//https://github.com/fitzgen/glob-to-regexp/blob/master/index.js
// type GlobOptions = Partial<{
//   extended: boolean;
//   globstar: boolean;
//   flags: string;
// }>;

function GlobToRegExp(glob, opts) {
  if (typeof glob !== "string") {
    throw new TypeError("Expected a string");
  }
  var str = String(glob);
  var reStr = "";
  var extended = opts ? !!opts.extended : false;
  //TLDR set to true to make dir/* only match 1 level deep
  var globstar = opts ? !!opts.globstar : false;
  var inGroup = false;
  var flags = opts && typeof opts.flags === "string" ? opts.flags : "";

  var c;
  for (var i = 0, len = str.length; i < len; i++) {
    c = str[i];

    switch (c) {
      case "/":
      case "$":
      case "^":
      case "+":
      case ".":
      case "(":
      case ")":
      case "=":
      case "!":
      case "|":
        reStr += "\\" + c;
        break;

      case "?":
        if (extended) {
          reStr += ".";
          break;
        }

      case "[":
      case "]":
        if (extended) {
          reStr += c;
          break;
        }

      case "{":
        if (extended) {
          inGroup = true;
          reStr += "(";
          break;
        }

      case "}":
        if (extended) {
          inGroup = false;
          reStr += ")";
          break;
        }

      case ",":
        if (inGroup) {
          reStr += "|";
          break;
        }
        reStr += "\\" + c;
        break;

      case "*":
        var prevChar = str[i - 1];
        var starCount = 1;
        while (str[i + 1] === "*") {
          starCount++;
          i++;
        }
        var nextChar = str[i + 1];

        if (!globstar) {
          reStr += ".*";
        } else {
          var isGlobstar =
            starCount > 1 &&
            (prevChar === "/" || prevChar === undefined) &&
            (nextChar === "/" || nextChar === undefined);

          if (isGlobstar) {
            reStr += "((?:[^/]*(?:/|$))*)";
            i++;
          } else {
            reStr += "([^/]*)";
          }
        }
        break;

      default:
        reStr += c;
    }
  }

  if (!flags || !~flags.indexOf("g")) {
    reStr = "^" + reStr + "$";
  }

  return new RegExp(reStr, flags);
}


const anymatch = (testGlob, actualFilepath) => {
  return GlobToRegExp(testGlob).test(actualFilepath);
};

const depsTransform = (b, cache) => {
  const _STREAM = new Transform({ objectMode: true });

  _STREAM._transform = (row, enc, next) => {
    var file = row.expose ? b._expose[row.id] : row.file;
    cache[file] = {
      source: row.source,
      deps: Object.assign({}, row.deps),
    };
    _STREAM.push(row);
    next();
  };

  return _STREAM;
};

const _wrapTransform = (b, time, bytes) => {
  let _STREAM = new Transform();
  _STREAM._transform = (buf, enc, next) => {
    bytes += buf.length;
    _STREAM.push(buf);
    next();
  };
  _STREAM._flush = () => {
    var delta = Date.now() - time;
    b.emit("time", delta);
    b.emit("bytes", bytes);
    b.emit("log", bytes + " bytes written (" + (delta / 1000).toFixed(2) + " seconds)");
    _STREAM.push(null);
  };

  return _STREAM;
};

function watchify(b, opts) {
  if (!opts) opts = {};
  var cache = b._options.cache;
  var pkgcache = b._options.packageCache;
  var delay = typeof opts.delay === "number" ? opts.delay : 100;
  var changingDeps = {};
  var pending = false;
  var updating = false;

  // unused atm, was a chokadir option, fs method also has this param b
  var wopts = {
    persistent: true,
  };

  var ignored = opts.ignoreWatch || "node_modules";

  if (cache) {
    b.on("reset", collect);
    collect();
  }
  function collect() {
    b.pipeline.get("deps").push(depsTransform(b, cache));
  }

  b.on("file", function (file) {
    watchFile(file);
  });

  b.on("package", function (pkg) {
    var file = path.join(pkg.__dirname, "package.json");
    watchFile(file);
    if (pkgcache) pkgcache[file] = pkg;
  });

  b.on("reset", reset);
  reset();

  function reset() {
    var time = null;
    var bytes = 0;
    b.pipeline.get("record").on("end", () => {
      time = Date.now();
    });
    b.pipeline.get("wrap").push(_wrapTransform(b, time, bytes));
  }

  var fwatchers = {};
  var fwatcherFiles = {};
  var ignoredFiles = {};

  b.on("transform", (tr, mfile) => {
    tr.on("file", (dep) => {
      watchFile(mfile, dep);
    });
  });
  b.on("bundle", (bundle) => {
    updating = true;
    bundle.on("error", () => void (updating = false));
    bundle.on("end", () => void (updating = false));
  });

  function watchFile(file, dep = void 0) {
    dep = dep || file;

    if (ignored) {
      if (!ignoredFiles.hasOwnProperty(file)) {
        ignoredFiles[file] = anymatch(ignored, file);
        //anymatch(ignored, file);
      }
      if (ignoredFiles[file]) return;
    }

    if (!fwatchers[file]) fwatchers[file] = [];
    if (!fwatcherFiles[file]) fwatcherFiles[file] = [];
    if (fwatcherFiles[file].indexOf(dep) >= 0) return;

    //idk how to quantify this , but adding a watcher for every dep instead of just letting the fs module do its thing seems dumb af
    //fun fact, the node docs mentioned experimental support for fs watch on urls, can finally use a socket as a virtual fs with watch support!
    //will try out later with vinyl ws server, there's some rollup plugin that does something similar to my vinyl hacks

    //var w = b._watcher(dep, wopts);
    var w = fs.watch(path.join(process.cwd(), "src"), { recursive: true });

    w.setMaxListeners(0);
    w.on("error", b.emit.bind(b, "error"));
    w.on("change", function () {
      invalidate(file);
    });
    fwatchers[file].push(w);
    fwatcherFiles[file].push(dep);
  }

  function invalidate(id) {
    if (cache) delete cache[id];
    if (pkgcache) delete pkgcache[id];
    changingDeps[id] = true;

    if (!updating && fwatchers[id]) {
      fwatchers[id].forEach(function (w) {
        w.close();
      });
      delete fwatchers[id];
      delete fwatcherFiles[id];
    }

    // wait for the disk/editor to quiet down first:
    // @ts-ignore
    if (pending) clearTimeout(pending);
    // @ts-ignore
    pending = setTimeout(notify, delay);
  }

  function notify() {
    if (updating) {
      // @ts-ignore
      pending = setTimeout(notify, delay);
    } else {
      pending = false;
      b.emit("update", Object.keys(changingDeps));
      changingDeps = {};
    }
  }

  b.close = () => {
    Object.keys(fwatchers).forEach((id) => {
      fwatchers[id].forEach((w) => {
        w.close();
      });
    });
  };

  b._watcher = (file, opts) => fs.watch(file, opts);

  return b;
}

watchify.args = {
  cache: {},
  packageCache: {},
};

