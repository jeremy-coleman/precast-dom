function Mime(...args) {
    this._types = Object.create(null);
    this._extensions = Object.create(null);
  
    for (var i = 0; i < args.length; i++) {
      this.define(args[i]);
    }
  
    this.define = this.define.bind(this);
    this.getType = this.getType.bind(this);
    this.getExtension = this.getExtension.bind(this);
  }
  
  
  Mime.prototype.define = function(typeMap, force) {
    for (var type in typeMap) {
      var extensions = typeMap[type].map(function(t) {return t.toLowerCase()});
      type = type.toLowerCase();
  
      for (var i = 0; i < extensions.length; i++) {
        var ext = extensions[i];
  
        // '*' prefix = not the preferred type for this extension.  So fixup the
        // extension, and skip it.
        if (ext[0] == '*') {
          continue;
        }
  
        if (!force && (ext in this._types)) {
          throw new Error(
            'Attempt to change mapping for "' + ext +
            '" extension from "' + this._types[ext] + '" to "' + type +
            '". Pass `force=true` to allow this, otherwise remove "' + ext +
            '" from the list of extensions for "' + type + '".'
          );
        }
  
        this._types[ext] = type;
      }
  
      // Use first extension as default
      if (force || !this._extensions[type]) {
        var ext = extensions[0];
        this._extensions[type] = (ext[0] != '*') ? ext : ext.substr(1);
      }
    }
  };
  
  /**
   * Lookup a mime type based on extension
   */
  Mime.prototype.getType = function(path) {
    path = String(path);
    var last = path.replace(/^.*[/\\]/, '').toLowerCase();
    var ext = last.replace(/^.*\./, '').toLowerCase();
  
    var hasPath = last.length < path.length;
    var hasDot = ext.length < last.length - 1;
  
    return (hasDot || !hasPath) && this._types[ext] || null;
  };
  
  /**
   * Return file extension associated with a mime type
   */
  Mime.prototype.getExtension = function(type) {
    type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
    return type && this._extensions[type.toLowerCase()] || null;
  };
  
  var mime = new Mime(require('./mime_standard.js'));
  
module.exports = mime;