var { createHash } = require('crypto');
var path = require('path');
const { Transform } = require('stream');

const { Server } = require("./ws");

//TODO scope.cache from object to map (its perfect candidate)
//most magic happens in the 'wrap' pipeline
//TODO somehow set up process listener or another socket so can use this instead of gulp livereload for styles/assets

module.exports = HotReloadPlugin;


var sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

function log(msg, ...data) {
  const t = /T([0-9:.]+)Z/g.exec(new Date().toISOString())[1];
  console.log(colors.green(`[${t}] ReactHMR`) + "::" + colors.cyan(msg));
  data.forEach((d) => console.log(colors.yellow("  >"), colors.yellow(d)));
}

function logError(error) {
  if (error) {
    log(error);
  }
}

var DefaultOptions = {
  port: 4474,
  host: null,
  client: true,
  dedupe: true,
  debug: false,
};

function HotReloadPlugin(b, opts = {}) {
  var _opts = Object.assign(opts, DefaultOptions);
  const { port, host, client, dedupe, debug } = _opts;

  // server is alive as long as watchify is running
  var wss = new Server({ port: Number(port) });
  log(`[HMR]:Listening@port:${port}`);

  wss.on("connection", (client) => {
    log("New client connected");
  });

  let clientRequires = [];

  const clientOpts = {
    nodeModulesRoot: path.resolve(process.cwd(), "node_modules"),
    port: Number(port),
    host: host,
    clientEnabled: client,
    //debug: debug,
    clientRequires: clientRequires,
  };

  clientRequires.forEach((file) => b.require(file, opts));

  b.on("reset", addHooks);
  addHooks();

  function addHooks() {
    var mappings = {};
    var pathById = {};
    var pathByIdx = {};
    var entries = [];

    var getPathById = (mappings) => Object.fromEntries(
      Object.entries(mappings).map(([file, [s, d, { browserifyId: id }]]) => [id, file])
    );

    function mapMappingToSrcDepsKVPairs(mappings) {
      var _pathById = getPathById(mappings);
      var result = {};
      
      //key value pair is src: deps
      Object.entries(mappings).forEach(([key, value]) => {
        const [src, deps, meta] = value;

        let dependecyPaths = {};

        for (let [k, v] of Object.entries(deps)) {
          dependecyPaths[k] = _pathById[v] || String(v);
        }

        return (result[key] = [src, dependecyPaths, meta]);
      });

      return result;
    }

    b.pipeline.on("error", (error) => {
      log("Notify clients about bundle error");
      wss.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: "bundle_error",
            data: { error: error.toString() },
          }),
          logError
        );
      });
    });

    b.pipeline.get("record").push(
      through.obj((row, enc, next) => {
        next(null, row);
      })
    );

    b.pipeline.get("sort").push(
      through.obj((row, enc, next) => {
        const { id, index, file } = row;
        pathById[id] = file;
        pathByIdx[index] = file;
        next(null, row);
      })
    );

    b.pipeline.splice(
      "dedupe",
      0,
      through.obj((row, enc, next) => {
        const cloned = Object.assign({}, row);
        if (row.dedupeIndex) {
          cloned.dedupeIndex = pathByIdx[idx] || String(idx) || console.warn("Full path not found for index: " + idx);
        }
        if (row.dedupe) {
          cloned.dedupe = pathById[id] || String(id) || console.warn("Full path not found for id: " + id);
        }
        next(null, cloned);
      })
    );

    b.pipeline.get("label").push(
      through.obj(
        (row, enc, next) => {
          const { id, file, source, deps, entry } = row;

          if (entry) {
            entries.push(file);
          }

          mappings[file] = [
            source,
            deps,
            {
              id: file,
              hash: sha256(source),
              browserifyId: id,
              sourcemap: "",
            },
          ];
          next(null, row);
        },
        function flush(next) {
          next();
        }
      )
    );

    b.pipeline.get("wrap").push(
      through.obj(
        (row, enc, next) => {
          next(null);
        },
        function flush(next) {

          const withFixedDepsIds = mapMappingToSrcDepsKVPairs(mappings);

          const args = [withFixedDepsIds, entries, clientOpts];

          var bundleSrc = `(${loader.toString()})(${args.map((a) => JSON.stringify(a, null, 2)).join(", ")});`;


          this.push(Buffer.from(bundleSrc, "utf8"));

          //Notify reload
          log("Notify clients about bundle change");
          wss.clients.forEach((client) => {
            client.send(
              JSON.stringify({
                type: "change",
                data: withFixedDepsIds,
              }),
              logError
            );
          });

          next();
        }
      )
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                             loader (browser client)                        */
/* -------------------------------------------------------------------------- */

function loader(mappings, entryPoints, options) {
  const { host = "localhost", protocol = "ws", port = 3000 } = options;

  var info = (msg) => void console.info("LiveReactload::", msg);
  var error = (msg) => void console.error("LiveReactload ::", msg);

  if (entryPoints.length > 1) {
    throw new Error("[HOT]Please use only one entry point");
  }

  var entryId = entryPoints[0];

  var scope = {
    mappings: mappings,
    cache: {},
    reloadHooks: {},
  };

  function startClient() {
    var ws = new WebSocket(`ws://localhost:${port}`);

    ws.onopen = () => {
      info("[HMR]:Listening for changes");
    };

    ws.onmessage = (m) => {
      var msg = JSON.parse(m.data);
      switch (msg.type) {
        case "change":
          handleBundleChange(msg.data);
          break;
        case "bundle_error":
          handleBundleError(msg.data);
          break;
        default:
          return void 0;
      }
    };

    function handleBundleChange(newMappings) {
      info("Bundle changed");
      var changes = patch(newMappings);
      if (changes.length > 0) {
        reload(changes);
      } else {
        info("Nothing to reload");
      }
    }
  
    function handleBundleError(data) {
      error("Bundling error occurred");
      error(data.error);
    }

  }

  //TODO remove sourcemaps using regexp for //# sourceMappingURL=` , prevents error spam in dev console
  function compile(mapping) {
    var body = mapping[0];
    if (typeof body !== "function") {
      var compileModule = new Function(
        "_src",
        "return eval('function _reload(require, module, exports){\\n' + _src + '\\n}; _reload;');"
      );
      var compiled = compileModule(body);

      mapping[0] = compiled;
      mapping[2].source = body;
    }
  }

  // returns module from cache or the source then caches it
  function load(id) {
    var mappings = scope.mappings;
    var cache = scope.cache;

    if (!cache[id]) {
      if (!mappings[id]) {
        var req = typeof require == "function" && require;
        if (req) return req(id);
        var error = new Error("Cannot find module '" + id + "'");
        error["code"] = "MODULE_NOT_FOUND";
        throw error;
      }

      var module = (cache[id] = {
        exports: {},
        hot: {
          onUpdate: (maybe, hook) => {
            scope.reloadHooks[id] = hook || maybe;
          },
        },
      });

      //(require, module, exports) => body
      const _moduleRequire = (path) => load(mappings[id][1][path] || path);

      mappings[id][0].call(module.exports, _moduleRequire, module, module.exports);
    }

    return cache[id].exports;
  }

  /** Patches updates and returns a list of changes. does not do any reloading yet.*/
  function patch(mappings) {
    var changes = [];

    Object.keys(mappings).forEach((id) => {
      var old = scope.mappings[id];
      var mapping = mappings[id];
      var meta = mapping[2];

      if (!old || old[2].hash !== meta.hash) {
        compile(mapping);
        scope.mappings[id] = mapping;
        changes.push([id, old]);
      }
    });

    return changes;
  }

  /** Reloads changes or tries to restore previous code. Changes is an array received from "patch" function */
  function reload(changes) {
    var changedModules = changes.map((c) => c[0]);
    try {
      info("Applying changes...");
      evaluate(entryId, {});
      info("Reload complete!");
    } 
    catch (e) {
      error("Error occurred while reloading changes. Restoring old implementation...");
      console.error(e);
      console.error(e.stack);
      try {
        //restore function
        changes.forEach((c) => {
          //maybe destructure
          var id = c[0];
          var mapping = c[1];

          if (mapping) {
            scope.mappings[id] = mapping;
          } 
          else {
            delete scope.mappings[id];
          }
        });
        //revaluate after restore & log it
        evaluate(entryId, {});
        info("Restored!");
      } 
      catch (re) {
        error("Restore failed. You may need to refresh your browser");
        console.error(re);
        console.error(re.stack);
      }
    }

    function evaluate(id, changeCache) {
      //external - maybe just compare id to browserify configs externals
      

      if (id in changeCache) {
        //debug("Circular dependency detected for module", id, "not traversing any further");
        return changeCache[id];
      }

      if (!(id in scope.mappings)) return false;

      var meChanged = changedModules.includes(id);
      changeCache[id] = meChanged;

      var originalCache = scope.cache[id];

      if (id in scope.cache) {
        delete scope.cache[id];
      }


      //get deps and filter out npm stuff
      var deps = Object.values(scope.mappings[id][1]).filter((id) => id.indexOf(options.nodeModulesRoot) === -1);

      var depsChanged = deps.map((dep) => evaluate(dep, changeCache));
      var isReloaded = originalCache !== undefined && id in scope.cache;

      var depChanged = depsChanged.some((v) => v);

      if (isReloaded || depChanged || meChanged) {
        if (!isReloaded) {
          var hook = scope.reloadHooks[id];
          if (typeof hook === "function" && hook()) {
            console.log(" > Manually accepted", id);
            scope.cache[id] = originalCache;
            changeCache[id] = false;
          } else {
            console.log(" > Loading::", id);
            load(id);
            changeCache[id] = true;
          }
        }

        //this never hits
        else {
          console.log(" > Already reloaded ::", id);
        }
        return changeCache[id];
      }
      //this is pretty effectful, the restore function should do this?
      else {
        // restore old version of the module
        if (originalCache !== undefined) {
          scope.cache[id] = originalCache;
        }
        return false;
      }
    }
  }

  // prepare mappings before starting the app
  Object.keys(scope.mappings).forEach((key) => {
    if (scope.mappings.hasOwnProperty(key)) {
      compile(scope.mappings[key]);
    }
  });

  startClient();

  //optionally load clientRequires
  if (options.clientRequires && options.clientRequires.length) {
    options.clientRequires.forEach(load);
  }

  // standalone bundles may need the exports from entry module
  return load(entryId);

}



//---------------------- end loader scope--------------------//



function defineColor(start, end) {
  const open = `\x1b[${start}m`;
  const close = `\x1b[${end}m`;
  const regex = new RegExp(`\\x1b\\[${end}m`, "g");
  return (str) => {
    return open + ("" + str).replace(regex, open) + close;
  };
}

var colors = {
  // modifiers
  reset: defineColor(0, 0),
  bold: defineColor(1, 22),
  dim: defineColor(2, 22),
  italic: defineColor(3, 23),
  underline: defineColor(4, 24),
  inverse: defineColor(7, 27),
  hidden: defineColor(8, 28),
  strikethrough: defineColor(9, 29),

  // colors
  black: defineColor(30, 39),
  red: defineColor(31, 39),
  green: defineColor(32, 39),
  yellow: defineColor(33, 39),
  blue: defineColor(34, 39),
  magenta: defineColor(35, 39),
  cyan: defineColor(36, 39),
  white: defineColor(97, 39),
  gray: defineColor(90, 39),

  lightGray: defineColor(37, 39),
  lightRed: defineColor(91, 39),
  lightGreen: defineColor(92, 39),
  lightYellow: defineColor(93, 39),
  lightBlue: defineColor(94, 39),
  lightMagenta: defineColor(95, 39),
  lightCyan: defineColor(96, 39),

  // background colors
  bgBlack: defineColor(40, 49),
  bgRed: defineColor(41, 49),
  bgGreen: defineColor(42, 49),
  bgYellow: defineColor(43, 49),
  bgBlue: defineColor(44, 49),
  bgMagenta: defineColor(45, 49),
  bgCyan: defineColor(46, 49),
  bgWhite: defineColor(107, 49),
  bgGray: defineColor(100, 49),

  bgLightRed: defineColor(101, 49),
  bgLightGreen: defineColor(102, 49),
  bgLightYellow: defineColor(103, 49),
  bgLightBlue: defineColor(104, 49),
  bgLightMagenta: defineColor(105, 49),
  bgLightCyan: defineColor(106, 49),
  bgLightGray: defineColor(47, 49),
};



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
// a noop _transform function
function noop(chunk, enc, callback) {
  callback(null, chunk);
}
function create(construct) {
  return function (options, transform, flush) {
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
// main export, just make me a transform stream!
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

//([file, [s, d, { browserifyId: id }]])
/* 
type FileMapping = [
  file,
  [s, d, { browserifyId: id }],
{
  id: string,
  hash: string,
  browserifyId: number,
  sourcemap: string | null | undefined
}
]
 */
