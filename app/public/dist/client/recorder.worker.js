"use strict";
(() => {
  var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  var __forAwait = (obj, it, method) => (it = obj[__knownSymbol("asyncIterator")]) ? it.call(obj) : (obj = obj[__knownSymbol("iterator")](), it = {}, method = (key, fn) => (fn = obj[key]) && (it[key] = (arg) => new Promise((yes, no, done) => (arg = fn.call(obj, arg), done = arg.done, Promise.resolve(arg.value).then((value) => yes({ value, done }), no)))), method("next"), method("return"), it);

  // node_modules/@colyseus/msgpackr/unpack.js
  var decoder;
  try {
    decoder = new TextDecoder();
  } catch (error) {
  }
  var src;
  var srcEnd;
  var position = 0;
  var EMPTY_ARRAY = [];
  var strings = EMPTY_ARRAY;
  var stringPosition = 0;
  var currentUnpackr = {};
  var currentStructures;
  var srcString;
  var srcStringStart = 0;
  var srcStringEnd = 0;
  var bundledStrings;
  var referenceMap;
  var currentExtensions = [];
  var dataView;
  var defaultOptions = {
    useRecords: false,
    mapsAsObjects: true
  };
  var C1Type = class {
  };
  var C1 = new C1Type();
  C1.name = "MessagePack 0xC1";
  var sequentialMode = false;
  var inlineObjectReadThreshold = 2;
  var readStruct;
  var onLoadedStructures;
  var onSaveState;
  try {
    new Function("");
  } catch (error) {
    inlineObjectReadThreshold = Infinity;
  }
  var Unpackr = class _Unpackr {
    constructor(options) {
      if (options) {
        if (options.useRecords === false && options.mapsAsObjects === void 0)
          options.mapsAsObjects = true;
        if (options.sequential && options.trusted !== false) {
          options.trusted = true;
          if (!options.structures && options.useRecords != false) {
            options.structures = [];
            if (!options.maxSharedStructures)
              options.maxSharedStructures = 0;
          }
        }
        if (options.structures)
          options.structures.sharedLength = options.structures.length;
        else if (options.getStructures) {
          (options.structures = []).uninitialized = true;
          options.structures.sharedLength = 0;
        }
        if (options.int64AsNumber) {
          options.int64AsType = "number";
        }
      }
      Object.assign(this, options);
    }
    unpack(source, options) {
      if (src) {
        return saveState(() => {
          clearSource();
          return this ? this.unpack(source, options) : _Unpackr.prototype.unpack.call(defaultOptions, source, options);
        });
      }
      if (!source.buffer && source.constructor === ArrayBuffer)
        source = typeof Buffer !== "undefined" ? Buffer.from(source) : new Uint8Array(source);
      if (typeof options === "object") {
        srcEnd = options.end || source.length;
        position = options.start || 0;
      } else {
        position = 0;
        srcEnd = options > -1 ? options : source.length;
      }
      stringPosition = 0;
      srcStringEnd = 0;
      srcString = null;
      strings = EMPTY_ARRAY;
      bundledStrings = null;
      src = source;
      try {
        dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
      } catch (error) {
        src = null;
        if (source instanceof Uint8Array)
          throw error;
        throw new Error("Source must be a Uint8Array or Buffer but was a " + (source && typeof source == "object" ? source.constructor.name : typeof source));
      }
      if (this instanceof _Unpackr) {
        currentUnpackr = this;
        if (this.structures) {
          currentStructures = this.structures;
          return checkedRead(options);
        } else if (!currentStructures || currentStructures.length > 0) {
          currentStructures = [];
        }
      } else {
        currentUnpackr = defaultOptions;
        if (!currentStructures || currentStructures.length > 0)
          currentStructures = [];
      }
      return checkedRead(options);
    }
    unpackMultiple(source, forEach) {
      let values, lastPosition = 0;
      try {
        sequentialMode = true;
        let size = source.length;
        let value = this ? this.unpack(source, size) : defaultUnpackr.unpack(source, size);
        if (forEach) {
          if (forEach(value, lastPosition, position) === false) return;
          while (position < size) {
            lastPosition = position;
            if (forEach(checkedRead(), lastPosition, position) === false) {
              return;
            }
          }
        } else {
          values = [value];
          while (position < size) {
            lastPosition = position;
            values.push(checkedRead());
          }
          return values;
        }
      } catch (error) {
        error.lastPosition = lastPosition;
        error.values = values;
        throw error;
      } finally {
        sequentialMode = false;
        clearSource();
      }
    }
    _mergeStructures(loadedStructures, existingStructures) {
      if (onLoadedStructures)
        loadedStructures = onLoadedStructures.call(this, loadedStructures);
      loadedStructures = loadedStructures || [];
      if (Object.isFrozen(loadedStructures))
        loadedStructures = loadedStructures.map((structure) => structure.slice(0));
      for (let i = 0, l = loadedStructures.length; i < l; i++) {
        let structure = loadedStructures[i];
        if (structure) {
          structure.isShared = true;
          if (i >= 32)
            structure.highByte = i - 32 >> 5;
        }
      }
      loadedStructures.sharedLength = loadedStructures.length;
      for (let id in existingStructures || []) {
        if (id >= 0) {
          let structure = loadedStructures[id];
          let existing = existingStructures[id];
          if (existing) {
            if (structure)
              (loadedStructures.restoreStructures || (loadedStructures.restoreStructures = []))[id] = structure;
            loadedStructures[id] = existing;
          }
        }
      }
      return this.structures = loadedStructures;
    }
    decode(source, options) {
      return this.unpack(source, options);
    }
  };
  function checkedRead(options) {
    try {
      if (!currentUnpackr.trusted && !sequentialMode) {
        let sharedLength = currentStructures.sharedLength || 0;
        if (sharedLength < currentStructures.length)
          currentStructures.length = sharedLength;
      }
      let result;
      if (currentUnpackr.randomAccessStructure && src[position] < 64 && src[position] >= 32 && readStruct) {
        result = readStruct(src, position, srcEnd, currentUnpackr);
        src = null;
        if (!(options && options.lazy) && result)
          result = result.toJSON();
        position = srcEnd;
      } else
        result = read();
      if (bundledStrings) {
        position = bundledStrings.postBundlePosition;
        bundledStrings = null;
      }
      if (sequentialMode)
        currentStructures.restoreStructures = null;
      if (position == srcEnd) {
        if (currentStructures && currentStructures.restoreStructures)
          restoreStructures();
        currentStructures = null;
        src = null;
        if (referenceMap)
          referenceMap = null;
      } else if (position > srcEnd) {
        throw new Error("Unexpected end of MessagePack data");
      } else if (!sequentialMode) {
        let jsonView;
        try {
          jsonView = JSON.stringify(result, (_, value) => typeof value === "bigint" ? `${value}n` : value).slice(0, 100);
        } catch (error) {
          jsonView = "(JSON view not available " + error + ")";
        }
        throw new Error("Data read, but end of buffer not reached " + jsonView);
      }
      return result;
    } catch (error) {
      if (currentStructures && currentStructures.restoreStructures)
        restoreStructures();
      clearSource();
      if (error instanceof RangeError || error.message.startsWith("Unexpected end of buffer") || position > srcEnd) {
        error.incomplete = true;
      }
      throw error;
    }
  }
  function restoreStructures() {
    for (let id in currentStructures.restoreStructures) {
      currentStructures[id] = currentStructures.restoreStructures[id];
    }
    currentStructures.restoreStructures = null;
  }
  function read() {
    let token = src[position++];
    if (token < 160) {
      if (token < 128) {
        if (token < 64)
          return token;
        else {
          let structure = currentStructures[token & 63] || currentUnpackr.getStructures && loadStructures()[token & 63];
          if (structure) {
            if (!structure.read) {
              structure.read = createStructureReader(structure, token & 63);
            }
            return structure.read();
          } else
            return token;
        }
      } else if (token < 144) {
        token -= 128;
        if (currentUnpackr.mapsAsObjects) {
          let object = {};
          for (let i = 0; i < token; i++) {
            let key = readKey();
            if (key === "__proto__")
              key = "__proto_";
            object[key] = read();
          }
          return object;
        } else {
          let map = /* @__PURE__ */ new Map();
          for (let i = 0; i < token; i++) {
            map.set(read(), read());
          }
          return map;
        }
      } else {
        token -= 144;
        let array = new Array(token);
        for (let i = 0; i < token; i++) {
          array[i] = read();
        }
        if (currentUnpackr.freezeData)
          return Object.freeze(array);
        return array;
      }
    } else if (token < 192) {
      let length = token - 160;
      if (srcStringEnd >= position) {
        return srcString.slice(position - srcStringStart, (position += length) - srcStringStart);
      }
      if (srcStringEnd == 0 && srcEnd < 140) {
        let string = length < 16 ? shortStringInJS(length) : longStringInJS(length);
        if (string != null)
          return string;
      }
      return readFixedString(length);
    } else {
      let value;
      switch (token) {
        case 192:
          return null;
        case 193:
          if (bundledStrings) {
            value = read();
            if (value > 0)
              return bundledStrings[1].slice(bundledStrings.position1, bundledStrings.position1 += value);
            else
              return bundledStrings[0].slice(bundledStrings.position0, bundledStrings.position0 -= value);
          }
          return C1;
        // "never-used", return special object to denote that
        case 194:
          return false;
        case 195:
          return true;
        case 196:
          value = src[position++];
          if (value === void 0)
            throw new Error("Unexpected end of buffer");
          return readBin(value);
        case 197:
          value = dataView.getUint16(position);
          position += 2;
          return readBin(value);
        case 198:
          value = dataView.getUint32(position);
          position += 4;
          return readBin(value);
        case 199:
          return readExt(src[position++]);
        case 200:
          value = dataView.getUint16(position);
          position += 2;
          return readExt(value);
        case 201:
          value = dataView.getUint32(position);
          position += 4;
          return readExt(value);
        case 202:
          value = dataView.getFloat32(position);
          if (currentUnpackr.useFloat32 > 2) {
            let multiplier = mult10[(src[position] & 127) << 1 | src[position + 1] >> 7];
            position += 4;
            return (multiplier * value + (value > 0 ? 0.5 : -0.5) >> 0) / multiplier;
          }
          position += 4;
          return value;
        case 203:
          value = dataView.getFloat64(position);
          position += 8;
          return value;
        // uint handlers
        case 204:
          return src[position++];
        case 205:
          value = dataView.getUint16(position);
          position += 2;
          return value;
        case 206:
          value = dataView.getUint32(position);
          position += 4;
          return value;
        case 207:
          if (currentUnpackr.int64AsType === "number") {
            value = dataView.getUint32(position) * 4294967296;
            value += dataView.getUint32(position + 4);
          } else if (currentUnpackr.int64AsType === "string") {
            value = dataView.getBigUint64(position).toString();
          } else if (currentUnpackr.int64AsType === "auto") {
            value = dataView.getBigUint64(position);
            if (value <= BigInt(2) << BigInt(52)) value = Number(value);
          } else
            value = dataView.getBigUint64(position);
          position += 8;
          return value;
        // int handlers
        case 208:
          return dataView.getInt8(position++);
        case 209:
          value = dataView.getInt16(position);
          position += 2;
          return value;
        case 210:
          value = dataView.getInt32(position);
          position += 4;
          return value;
        case 211:
          if (currentUnpackr.int64AsType === "number") {
            value = dataView.getInt32(position) * 4294967296;
            value += dataView.getUint32(position + 4);
          } else if (currentUnpackr.int64AsType === "string") {
            value = dataView.getBigInt64(position).toString();
          } else if (currentUnpackr.int64AsType === "auto") {
            value = dataView.getBigInt64(position);
            if (value >= BigInt(-2) << BigInt(52) && value <= BigInt(2) << BigInt(52)) value = Number(value);
          } else
            value = dataView.getBigInt64(position);
          position += 8;
          return value;
        case 212:
          value = src[position++];
          if (value == 114) {
            return recordDefinition(src[position++] & 63);
          } else {
            let extension = currentExtensions[value];
            if (extension) {
              if (extension.read) {
                position++;
                return extension.read(read());
              } else if (extension.noBuffer) {
                position++;
                return extension();
              } else
                return extension(src.subarray(position, ++position));
            } else
              throw new Error("Unknown extension " + value);
          }
        case 213:
          value = src[position];
          if (value == 114) {
            position++;
            return recordDefinition(src[position++] & 63, src[position++]);
          } else
            return readExt(2);
        case 214:
          return readExt(4);
        case 215:
          return readExt(8);
        case 216:
          return readExt(16);
        case 217:
          value = src[position++];
          if (srcStringEnd >= position) {
            return srcString.slice(position - srcStringStart, (position += value) - srcStringStart);
          }
          return readString8(value);
        case 218:
          value = dataView.getUint16(position);
          position += 2;
          if (srcStringEnd >= position) {
            return srcString.slice(position - srcStringStart, (position += value) - srcStringStart);
          }
          return readString16(value);
        case 219:
          value = dataView.getUint32(position);
          position += 4;
          if (srcStringEnd >= position) {
            return srcString.slice(position - srcStringStart, (position += value) - srcStringStart);
          }
          return readString32(value);
        case 220:
          value = dataView.getUint16(position);
          position += 2;
          return readArray(value);
        case 221:
          value = dataView.getUint32(position);
          position += 4;
          return readArray(value);
        case 222:
          value = dataView.getUint16(position);
          position += 2;
          return readMap(value);
        case 223:
          value = dataView.getUint32(position);
          position += 4;
          return readMap(value);
        default:
          if (token >= 224)
            return token - 256;
          if (token === void 0) {
            let error = new Error("Unexpected end of MessagePack data");
            error.incomplete = true;
            throw error;
          }
          throw new Error("Unknown MessagePack token " + token);
      }
    }
  }
  var validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
  function createStructureReader(structure, firstId) {
    function readObject() {
      if (readObject.count++ > inlineObjectReadThreshold) {
        let readObject2 = structure.read = new Function("r", "return function(){return " + (currentUnpackr.freezeData ? "Object.freeze" : "") + "({" + structure.map((key) => key === "__proto__" ? "__proto_:r()" : validName.test(key) ? key + ":r()" : "[" + JSON.stringify(key) + "]:r()").join(",") + "})}")(read);
        if (structure.highByte === 0)
          structure.read = createSecondByteReader(firstId, structure.read);
        return readObject2();
      }
      let object = {};
      for (let i = 0, l = structure.length; i < l; i++) {
        let key = structure[i];
        if (key === "__proto__")
          key = "__proto_";
        object[key] = read();
      }
      if (currentUnpackr.freezeData)
        return Object.freeze(object);
      return object;
    }
    readObject.count = 0;
    if (structure.highByte === 0) {
      return createSecondByteReader(firstId, readObject);
    }
    return readObject;
  }
  var createSecondByteReader = (firstId, read0) => {
    return function() {
      let highByte = src[position++];
      if (highByte === 0)
        return read0();
      let id = firstId < 32 ? -(firstId + (highByte << 5)) : firstId + (highByte << 5);
      let structure = currentStructures[id] || loadStructures()[id];
      if (!structure) {
        throw new Error("Record id is not defined for " + id);
      }
      if (!structure.read)
        structure.read = createStructureReader(structure, firstId);
      return structure.read();
    };
  };
  function loadStructures() {
    let loadedStructures = saveState(() => {
      src = null;
      return currentUnpackr.getStructures();
    });
    return currentStructures = currentUnpackr._mergeStructures(loadedStructures, currentStructures);
  }
  var readFixedString = readStringJS;
  var readString8 = readStringJS;
  var readString16 = readStringJS;
  var readString32 = readStringJS;
  function readStringJS(length) {
    let result;
    if (length < 16) {
      if (result = shortStringInJS(length))
        return result;
    }
    if (length > 64 && decoder)
      return decoder.decode(src.subarray(position, position += length));
    const end = position + length;
    const units = [];
    result = "";
    while (position < end) {
      const byte1 = src[position++];
      if ((byte1 & 128) === 0) {
        units.push(byte1);
      } else if ((byte1 & 224) === 192) {
        const byte2 = src[position++] & 63;
        units.push((byte1 & 31) << 6 | byte2);
      } else if ((byte1 & 240) === 224) {
        const byte2 = src[position++] & 63;
        const byte3 = src[position++] & 63;
        units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
      } else if ((byte1 & 248) === 240) {
        const byte2 = src[position++] & 63;
        const byte3 = src[position++] & 63;
        const byte4 = src[position++] & 63;
        let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
        if (unit > 65535) {
          unit -= 65536;
          units.push(unit >>> 10 & 1023 | 55296);
          unit = 56320 | unit & 1023;
        }
        units.push(unit);
      } else {
        units.push(byte1);
      }
      if (units.length >= 4096) {
        result += fromCharCode.apply(String, units);
        units.length = 0;
      }
    }
    if (units.length > 0) {
      result += fromCharCode.apply(String, units);
    }
    return result;
  }
  function readArray(length) {
    let array = new Array(length);
    for (let i = 0; i < length; i++) {
      array[i] = read();
    }
    if (currentUnpackr.freezeData)
      return Object.freeze(array);
    return array;
  }
  function readMap(length) {
    if (currentUnpackr.mapsAsObjects) {
      let object = {};
      for (let i = 0; i < length; i++) {
        let key = readKey();
        if (key === "__proto__")
          key = "__proto_";
        object[key] = read();
      }
      return object;
    } else {
      let map = /* @__PURE__ */ new Map();
      for (let i = 0; i < length; i++) {
        map.set(read(), read());
      }
      return map;
    }
  }
  var fromCharCode = String.fromCharCode;
  function longStringInJS(length) {
    let start = position;
    let bytes = new Array(length);
    for (let i = 0; i < length; i++) {
      const byte = src[position++];
      if ((byte & 128) > 0) {
        position = start;
        return;
      }
      bytes[i] = byte;
    }
    return fromCharCode.apply(String, bytes);
  }
  function shortStringInJS(length) {
    if (length < 4) {
      if (length < 2) {
        if (length === 0)
          return "";
        else {
          let a = src[position++];
          if ((a & 128) > 1) {
            position -= 1;
            return;
          }
          return fromCharCode(a);
        }
      } else {
        let a = src[position++];
        let b = src[position++];
        if ((a & 128) > 0 || (b & 128) > 0) {
          position -= 2;
          return;
        }
        if (length < 3)
          return fromCharCode(a, b);
        let c = src[position++];
        if ((c & 128) > 0) {
          position -= 3;
          return;
        }
        return fromCharCode(a, b, c);
      }
    } else {
      let a = src[position++];
      let b = src[position++];
      let c = src[position++];
      let d = src[position++];
      if ((a & 128) > 0 || (b & 128) > 0 || (c & 128) > 0 || (d & 128) > 0) {
        position -= 4;
        return;
      }
      if (length < 6) {
        if (length === 4)
          return fromCharCode(a, b, c, d);
        else {
          let e = src[position++];
          if ((e & 128) > 0) {
            position -= 5;
            return;
          }
          return fromCharCode(a, b, c, d, e);
        }
      } else if (length < 8) {
        let e = src[position++];
        let f = src[position++];
        if ((e & 128) > 0 || (f & 128) > 0) {
          position -= 6;
          return;
        }
        if (length < 7)
          return fromCharCode(a, b, c, d, e, f);
        let g = src[position++];
        if ((g & 128) > 0) {
          position -= 7;
          return;
        }
        return fromCharCode(a, b, c, d, e, f, g);
      } else {
        let e = src[position++];
        let f = src[position++];
        let g = src[position++];
        let h = src[position++];
        if ((e & 128) > 0 || (f & 128) > 0 || (g & 128) > 0 || (h & 128) > 0) {
          position -= 8;
          return;
        }
        if (length < 10) {
          if (length === 8)
            return fromCharCode(a, b, c, d, e, f, g, h);
          else {
            let i = src[position++];
            if ((i & 128) > 0) {
              position -= 9;
              return;
            }
            return fromCharCode(a, b, c, d, e, f, g, h, i);
          }
        } else if (length < 12) {
          let i = src[position++];
          let j = src[position++];
          if ((i & 128) > 0 || (j & 128) > 0) {
            position -= 10;
            return;
          }
          if (length < 11)
            return fromCharCode(a, b, c, d, e, f, g, h, i, j);
          let k = src[position++];
          if ((k & 128) > 0) {
            position -= 11;
            return;
          }
          return fromCharCode(a, b, c, d, e, f, g, h, i, j, k);
        } else {
          let i = src[position++];
          let j = src[position++];
          let k = src[position++];
          let l = src[position++];
          if ((i & 128) > 0 || (j & 128) > 0 || (k & 128) > 0 || (l & 128) > 0) {
            position -= 12;
            return;
          }
          if (length < 14) {
            if (length === 12)
              return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l);
            else {
              let m = src[position++];
              if ((m & 128) > 0) {
                position -= 13;
                return;
              }
              return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m);
            }
          } else {
            let m = src[position++];
            let n = src[position++];
            if ((m & 128) > 0 || (n & 128) > 0) {
              position -= 14;
              return;
            }
            if (length < 15)
              return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
            let o = src[position++];
            if ((o & 128) > 0) {
              position -= 15;
              return;
            }
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
          }
        }
      }
    }
  }
  function readOnlyJSString() {
    let token = src[position++];
    let length;
    if (token < 192) {
      length = token - 160;
    } else {
      switch (token) {
        case 217:
          length = src[position++];
          break;
        case 218:
          length = dataView.getUint16(position);
          position += 2;
          break;
        case 219:
          length = dataView.getUint32(position);
          position += 4;
          break;
        default:
          throw new Error("Expected string");
      }
    }
    return readStringJS(length);
  }
  function readBin(length) {
    return currentUnpackr.copyBuffers ? (
      // specifically use the copying slice (not the node one)
      Uint8Array.prototype.slice.call(src, position, position += length)
    ) : src.subarray(position, position += length);
  }
  function readExt(length) {
    let type = src[position++];
    if (currentExtensions[type]) {
      let end;
      return currentExtensions[type](src.subarray(position, end = position += length), (readPosition) => {
        position = readPosition;
        try {
          return read();
        } finally {
          position = end;
        }
      });
    } else
      throw new Error("Unknown extension type " + type);
  }
  var keyCache = new Array(4096);
  function readKey() {
    let length = src[position++];
    if (length >= 160 && length < 192) {
      length = length - 160;
      if (srcStringEnd >= position)
        return srcString.slice(position - srcStringStart, (position += length) - srcStringStart);
      else if (!(srcStringEnd == 0 && srcEnd < 180))
        return readFixedString(length);
    } else {
      position--;
      return asSafeString(read());
    }
    let key = (length << 5 ^ (length > 1 ? dataView.getUint16(position) : length > 0 ? src[position] : 0)) & 4095;
    let entry = keyCache[key];
    let checkPosition = position;
    let end = position + length - 3;
    let chunk;
    let i = 0;
    if (entry && entry.bytes == length) {
      while (checkPosition < end) {
        chunk = dataView.getUint32(checkPosition);
        if (chunk != entry[i++]) {
          checkPosition = 1879048192;
          break;
        }
        checkPosition += 4;
      }
      end += 3;
      while (checkPosition < end) {
        chunk = src[checkPosition++];
        if (chunk != entry[i++]) {
          checkPosition = 1879048192;
          break;
        }
      }
      if (checkPosition === end) {
        position = checkPosition;
        return entry.string;
      }
      end -= 3;
      checkPosition = position;
    }
    entry = [];
    keyCache[key] = entry;
    entry.bytes = length;
    while (checkPosition < end) {
      chunk = dataView.getUint32(checkPosition);
      entry.push(chunk);
      checkPosition += 4;
    }
    end += 3;
    while (checkPosition < end) {
      chunk = src[checkPosition++];
      entry.push(chunk);
    }
    let string = length < 16 ? shortStringInJS(length) : longStringInJS(length);
    if (string != null)
      return entry.string = string;
    return entry.string = readFixedString(length);
  }
  function asSafeString(property) {
    if (typeof property === "string") return property;
    if (typeof property === "number" || typeof property === "boolean" || typeof property === "bigint") return property.toString();
    if (property == null) return property + "";
    if (currentUnpackr.allowArraysInMapKeys && Array.isArray(property) && property.flat().every((item) => ["string", "number", "boolean", "bigint"].includes(typeof item))) {
      return property.flat().toString();
    }
    throw new Error(`Invalid property type for record: ${typeof property}`);
  }
  var recordDefinition = (id, highByte) => {
    let structure = read().map(asSafeString);
    let firstByte = id;
    if (highByte !== void 0) {
      id = id < 32 ? -((highByte << 5) + id) : (highByte << 5) + id;
      structure.highByte = highByte;
    }
    let existingStructure = currentStructures[id];
    if (existingStructure && (existingStructure.isShared || sequentialMode)) {
      (currentStructures.restoreStructures || (currentStructures.restoreStructures = []))[id] = existingStructure;
    }
    currentStructures[id] = structure;
    structure.read = createStructureReader(structure, firstByte);
    return structure.read();
  };
  currentExtensions[0] = () => {
  };
  currentExtensions[0].noBuffer = true;
  currentExtensions[66] = (data) => {
    let length = data.length;
    let value = BigInt(data[0] & 128 ? data[0] - 256 : data[0]);
    for (let i = 1; i < length; i++) {
      value <<= BigInt(8);
      value += BigInt(data[i]);
    }
    return value;
  };
  var errors = { Error, TypeError, ReferenceError };
  currentExtensions[101] = () => {
    let data = read();
    return (errors[data[0]] || Error)(data[1], { cause: data[2] });
  };
  currentExtensions[105] = (data) => {
    if (currentUnpackr.structuredClone === false) throw new Error("Structured clone extension is disabled");
    let id = dataView.getUint32(position - 4);
    if (!referenceMap)
      referenceMap = /* @__PURE__ */ new Map();
    let token = src[position];
    let target2;
    if (token >= 144 && token < 160 || token == 220 || token == 221)
      target2 = [];
    else
      target2 = {};
    let refEntry = { target: target2 };
    referenceMap.set(id, refEntry);
    let targetProperties = read();
    if (refEntry.used)
      return Object.assign(target2, targetProperties);
    refEntry.target = targetProperties;
    return targetProperties;
  };
  currentExtensions[112] = (data) => {
    if (currentUnpackr.structuredClone === false) throw new Error("Structured clone extension is disabled");
    let id = dataView.getUint32(position - 4);
    let refEntry = referenceMap.get(id);
    refEntry.used = true;
    return refEntry.target;
  };
  currentExtensions[115] = () => new Set(read());
  var typedArrays = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"].map((type) => type + "Array");
  var glbl = typeof globalThis === "object" ? globalThis : window;
  currentExtensions[116] = (data) => {
    let typeCode = data[0];
    let typedArrayName = typedArrays[typeCode];
    if (!typedArrayName) {
      if (typeCode === 16) {
        let ab = new ArrayBuffer(data.length - 1);
        let u8 = new Uint8Array(ab);
        u8.set(data.subarray(1));
        return ab;
      }
      throw new Error("Could not find typed array for code " + typeCode);
    }
    return new glbl[typedArrayName](Uint8Array.prototype.slice.call(data, 1).buffer);
  };
  currentExtensions[120] = () => {
    let data = read();
    return new RegExp(data[0], data[1]);
  };
  var TEMP_BUNDLE = [];
  currentExtensions[98] = (data) => {
    let dataSize = (data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3];
    let dataPosition = position;
    position += dataSize - data.length;
    bundledStrings = TEMP_BUNDLE;
    bundledStrings = [readOnlyJSString(), readOnlyJSString()];
    bundledStrings.position0 = 0;
    bundledStrings.position1 = 0;
    bundledStrings.postBundlePosition = position;
    position = dataPosition;
    return read();
  };
  currentExtensions[255] = (data) => {
    if (data.length == 4)
      return new Date((data[0] * 16777216 + (data[1] << 16) + (data[2] << 8) + data[3]) * 1e3);
    else if (data.length == 8)
      return new Date(
        ((data[0] << 22) + (data[1] << 14) + (data[2] << 6) + (data[3] >> 2)) / 1e6 + ((data[3] & 3) * 4294967296 + data[4] * 16777216 + (data[5] << 16) + (data[6] << 8) + data[7]) * 1e3
      );
    else if (data.length == 12)
      return new Date(
        ((data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3]) / 1e6 + ((data[4] & 128 ? -281474976710656 : 0) + data[6] * 1099511627776 + data[7] * 4294967296 + data[8] * 16777216 + (data[9] << 16) + (data[10] << 8) + data[11]) * 1e3
      );
    else
      return /* @__PURE__ */ new Date("invalid");
  };
  function saveState(callback) {
    if (onSaveState)
      onSaveState();
    let savedSrcEnd = srcEnd;
    let savedPosition = position;
    let savedStringPosition = stringPosition;
    let savedSrcStringStart = srcStringStart;
    let savedSrcStringEnd = srcStringEnd;
    let savedSrcString = srcString;
    let savedStrings = strings;
    let savedReferenceMap = referenceMap;
    let savedBundledStrings = bundledStrings;
    let savedSrc = new Uint8Array(src.slice(0, srcEnd));
    let savedStructures = currentStructures;
    let savedStructuresContents = currentStructures.slice(0, currentStructures.length);
    let savedPackr = currentUnpackr;
    let savedSequentialMode = sequentialMode;
    let value = callback();
    srcEnd = savedSrcEnd;
    position = savedPosition;
    stringPosition = savedStringPosition;
    srcStringStart = savedSrcStringStart;
    srcStringEnd = savedSrcStringEnd;
    srcString = savedSrcString;
    strings = savedStrings;
    referenceMap = savedReferenceMap;
    bundledStrings = savedBundledStrings;
    src = savedSrc;
    sequentialMode = savedSequentialMode;
    currentStructures = savedStructures;
    currentStructures.splice(0, currentStructures.length, ...savedStructuresContents);
    currentUnpackr = savedPackr;
    dataView = new DataView(src.buffer, src.byteOffset, src.byteLength);
    return value;
  }
  function clearSource() {
    src = null;
    referenceMap = null;
    currentStructures = null;
  }
  var mult10 = new Array(147);
  for (let i = 0; i < 256; i++) {
    mult10[i] = +("1e" + Math.floor(45.15 - i * 0.30103));
  }
  var defaultUnpackr = new Unpackr({ useRecords: false });
  var unpack = defaultUnpackr.unpack;
  var unpackMultiple = defaultUnpackr.unpackMultiple;
  var decode = defaultUnpackr.unpack;
  var FLOAT32_OPTIONS = {
    NEVER: 0,
    ALWAYS: 1,
    DECIMAL_ROUND: 3,
    DECIMAL_FIT: 4
  };
  var f32Array = new Float32Array(1);
  var u8Array = new Uint8Array(f32Array.buffer, 0, 4);

  // node_modules/@colyseus/msgpackr/pack.js
  var textEncoder;
  try {
    textEncoder = new TextEncoder();
  } catch (error) {
  }
  var extensions;
  var extensionClasses;
  var hasNodeBuffer = typeof Buffer !== "undefined";
  var ByteArrayAllocate = hasNodeBuffer ? function(length) {
    return Buffer.allocUnsafeSlow(length);
  } : Uint8Array;
  var ByteArray = hasNodeBuffer ? Buffer : Uint8Array;
  var MAX_BUFFER_SIZE = hasNodeBuffer ? 4294967296 : 2144337920;
  var target;
  var keysTarget;
  var targetView;
  var position2 = 0;
  var safeEnd;
  var bundledStrings2 = null;
  var writeStructSlots;
  var MAX_BUNDLE_SIZE = 21760;
  var hasNonLatin = /[\u0080-\uFFFF]/;
  var RECORD_SYMBOL = /* @__PURE__ */ Symbol("record-id");
  var Packr = class extends Unpackr {
    constructor(options) {
      super(options);
      this.offset = 0;
      let typeBuffer;
      let start;
      let hasSharedUpdate;
      let structures;
      let referenceMap2;
      let encodeUtf8 = ByteArray.prototype.utf8Write ? function(string, position3) {
        return target.utf8Write(string, position3, target.byteLength - position3);
      } : textEncoder && textEncoder.encodeInto ? function(string, position3) {
        return textEncoder.encodeInto(string, target.subarray(position3)).written;
      } : false;
      let packr = this;
      if (!options)
        options = {};
      let isSequential = options && options.sequential;
      let hasSharedStructures = options.structures || options.saveStructures;
      let maxSharedStructures = options.maxSharedStructures;
      if (maxSharedStructures == null)
        maxSharedStructures = hasSharedStructures ? 32 : 0;
      if (maxSharedStructures > 8160)
        throw new Error("Maximum maxSharedStructure is 8160");
      if (options.structuredClone && options.moreTypes == void 0) {
        this.moreTypes = true;
      }
      let maxOwnStructures = options.maxOwnStructures;
      if (maxOwnStructures == null)
        maxOwnStructures = hasSharedStructures ? 32 : 64;
      if (!this.structures && options.useRecords != false)
        this.structures = [];
      let useTwoByteRecords = maxSharedStructures > 32 || maxOwnStructures + maxSharedStructures > 64;
      let sharedLimitId = maxSharedStructures + 64;
      let maxStructureId = maxSharedStructures + maxOwnStructures + 64;
      if (maxStructureId > 8256) {
        throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");
      }
      let recordIdsToRemove = [];
      let transitionsCount = 0;
      let serializationsSinceTransitionRebuild = 0;
      this.pack = this.encode = function(value, encodeOptions) {
        if (!target) {
          target = new ByteArrayAllocate(8192);
          targetView = target.dataView || (target.dataView = new DataView(target.buffer, 0, 8192));
          position2 = 0;
        }
        safeEnd = target.length - 10;
        if (safeEnd - position2 < 2048) {
          target = new ByteArrayAllocate(target.length);
          targetView = target.dataView || (target.dataView = new DataView(target.buffer, 0, target.length));
          safeEnd = target.length - 10;
          position2 = 0;
        } else
          position2 = position2 + 7 & 2147483640;
        start = position2;
        if (encodeOptions & RESERVE_START_SPACE) position2 += encodeOptions & 255;
        referenceMap2 = packr.structuredClone ? /* @__PURE__ */ new Map() : null;
        if (packr.bundleStrings && typeof value !== "string") {
          bundledStrings2 = [];
          bundledStrings2.size = Infinity;
        } else
          bundledStrings2 = null;
        structures = packr.structures;
        if (structures) {
          if (structures.uninitialized)
            structures = packr._mergeStructures(packr.getStructures());
          let sharedLength = structures.sharedLength || 0;
          if (sharedLength > maxSharedStructures) {
            throw new Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to " + structures.sharedLength);
          }
          if (!structures.transitions) {
            structures.transitions = /* @__PURE__ */ Object.create(null);
            for (let i = 0; i < sharedLength; i++) {
              let keys = structures[i];
              if (!keys)
                continue;
              let nextTransition, transition = structures.transitions;
              for (let j = 0, l = keys.length; j < l; j++) {
                let key = keys[j];
                nextTransition = transition[key];
                if (!nextTransition) {
                  nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
                }
                transition = nextTransition;
              }
              transition[RECORD_SYMBOL] = i + 64;
            }
            this.lastNamedStructuresLength = sharedLength;
          }
          if (!isSequential) {
            structures.nextId = sharedLength + 64;
          }
        }
        if (hasSharedUpdate)
          hasSharedUpdate = false;
        let encodingError;
        try {
          if (packr.randomAccessStructure && value && value.constructor && value.constructor === Object)
            writeStruct(value);
          else
            pack2(value);
          let lastBundle = bundledStrings2;
          if (bundledStrings2)
            writeBundles(start, pack2, 0);
          if (referenceMap2 && referenceMap2.idsToInsert) {
            let idsToInsert = referenceMap2.idsToInsert.sort((a, b) => a.offset > b.offset ? 1 : -1);
            let i = idsToInsert.length;
            let incrementPosition = -1;
            while (lastBundle && i > 0) {
              let insertionPoint = idsToInsert[--i].offset + start;
              if (insertionPoint < lastBundle.stringsPosition + start && incrementPosition === -1)
                incrementPosition = 0;
              if (insertionPoint > lastBundle.position + start) {
                if (incrementPosition >= 0)
                  incrementPosition += 6;
              } else {
                if (incrementPosition >= 0) {
                  targetView.setUint32(
                    lastBundle.position + start,
                    targetView.getUint32(lastBundle.position + start) + incrementPosition
                  );
                  incrementPosition = -1;
                }
                lastBundle = lastBundle.previous;
                i++;
              }
            }
            if (incrementPosition >= 0 && lastBundle) {
              targetView.setUint32(
                lastBundle.position + start,
                targetView.getUint32(lastBundle.position + start) + incrementPosition
              );
            }
            position2 += idsToInsert.length * 6;
            if (position2 > safeEnd)
              makeRoom(position2);
            packr.offset = position2;
            let serialized = insertIds(target.subarray(start, position2), idsToInsert);
            referenceMap2 = null;
            return serialized;
          }
          packr.offset = position2;
          if (encodeOptions & REUSE_BUFFER_MODE) {
            target.start = start;
            target.end = position2;
            return target;
          }
          return target.subarray(start, position2);
        } catch (error) {
          encodingError = error;
          throw error;
        } finally {
          if (structures) {
            resetStructures();
            if (hasSharedUpdate && packr.saveStructures) {
              let sharedLength = structures.sharedLength || 0;
              let returnBuffer = target.subarray(start, position2);
              let newSharedData = prepareStructures(structures, packr);
              if (!encodingError) {
                if (packr.saveStructures(newSharedData, newSharedData.isCompatible) === false) {
                  return packr.pack(value, encodeOptions);
                }
                packr.lastNamedStructuresLength = sharedLength;
                if (target.length > 1073741824) target = null;
                return returnBuffer;
              }
            }
          }
          if (target.length > 1073741824) target = null;
          if (encodeOptions & RESET_BUFFER_MODE)
            position2 = start;
        }
      };
      const resetStructures = () => {
        if (serializationsSinceTransitionRebuild < 10)
          serializationsSinceTransitionRebuild++;
        let sharedLength = structures.sharedLength || 0;
        if (structures.length > sharedLength && !isSequential)
          structures.length = sharedLength;
        if (transitionsCount > 1e4) {
          structures.transitions = null;
          serializationsSinceTransitionRebuild = 0;
          transitionsCount = 0;
          if (recordIdsToRemove.length > 0)
            recordIdsToRemove = [];
        } else if (recordIdsToRemove.length > 0 && !isSequential) {
          for (let i = 0, l = recordIdsToRemove.length; i < l; i++) {
            recordIdsToRemove[i][RECORD_SYMBOL] = 0;
          }
          recordIdsToRemove = [];
        }
      };
      const packArray = (value) => {
        var length = value.length;
        if (length < 16) {
          target[position2++] = 144 | length;
        } else if (length < 65536) {
          target[position2++] = 220;
          target[position2++] = length >> 8;
          target[position2++] = length & 255;
        } else {
          target[position2++] = 221;
          targetView.setUint32(position2, length);
          position2 += 4;
        }
        for (let i = 0; i < length; i++) {
          pack2(value[i]);
        }
      };
      const pack2 = (value) => {
        if (position2 > safeEnd)
          target = makeRoom(position2);
        var type = typeof value;
        var length;
        if (type === "string") {
          let strLength = value.length;
          if (bundledStrings2 && strLength >= 4 && strLength < 4096) {
            if ((bundledStrings2.size += strLength) > MAX_BUNDLE_SIZE) {
              let extStart;
              let maxBytes2 = (bundledStrings2[0] ? bundledStrings2[0].length * 3 + bundledStrings2[1].length : 0) + 10;
              if (position2 + maxBytes2 > safeEnd)
                target = makeRoom(position2 + maxBytes2);
              let lastBundle;
              if (bundledStrings2.position) {
                lastBundle = bundledStrings2;
                target[position2] = 200;
                position2 += 3;
                target[position2++] = 98;
                extStart = position2 - start;
                position2 += 4;
                writeBundles(start, pack2, 0);
                targetView.setUint16(extStart + start - 3, position2 - start - extStart);
              } else {
                target[position2++] = 214;
                target[position2++] = 98;
                extStart = position2 - start;
                position2 += 4;
              }
              bundledStrings2 = ["", ""];
              bundledStrings2.previous = lastBundle;
              bundledStrings2.size = 0;
              bundledStrings2.position = extStart;
            }
            let twoByte = hasNonLatin.test(value);
            bundledStrings2[twoByte ? 0 : 1] += value;
            target[position2++] = 193;
            pack2(twoByte ? -strLength : strLength);
            return;
          }
          let headerSize;
          if (strLength < 32) {
            headerSize = 1;
          } else if (strLength < 256) {
            headerSize = 2;
          } else if (strLength < 65536) {
            headerSize = 3;
          } else {
            headerSize = 5;
          }
          let maxBytes = strLength * 3;
          if (position2 + maxBytes > safeEnd)
            target = makeRoom(position2 + maxBytes);
          if (strLength < 64 || !encodeUtf8) {
            let i, c1, c2, strPosition = position2 + headerSize;
            for (i = 0; i < strLength; i++) {
              c1 = value.charCodeAt(i);
              if (c1 < 128) {
                target[strPosition++] = c1;
              } else if (c1 < 2048) {
                target[strPosition++] = c1 >> 6 | 192;
                target[strPosition++] = c1 & 63 | 128;
              } else if ((c1 & 64512) === 55296 && ((c2 = value.charCodeAt(i + 1)) & 64512) === 56320) {
                c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
                i++;
                target[strPosition++] = c1 >> 18 | 240;
                target[strPosition++] = c1 >> 12 & 63 | 128;
                target[strPosition++] = c1 >> 6 & 63 | 128;
                target[strPosition++] = c1 & 63 | 128;
              } else {
                target[strPosition++] = c1 >> 12 | 224;
                target[strPosition++] = c1 >> 6 & 63 | 128;
                target[strPosition++] = c1 & 63 | 128;
              }
            }
            length = strPosition - position2 - headerSize;
          } else {
            length = encodeUtf8(value, position2 + headerSize);
          }
          if (length < 32) {
            target[position2++] = 160 | length;
          } else if (length < 256) {
            if (headerSize < 2) {
              target.copyWithin(position2 + 2, position2 + 1, position2 + 1 + length);
            }
            target[position2++] = 217;
            target[position2++] = length;
          } else if (length < 65536) {
            if (headerSize < 3) {
              target.copyWithin(position2 + 3, position2 + 2, position2 + 2 + length);
            }
            target[position2++] = 218;
            target[position2++] = length >> 8;
            target[position2++] = length & 255;
          } else {
            if (headerSize < 5) {
              target.copyWithin(position2 + 5, position2 + 3, position2 + 3 + length);
            }
            target[position2++] = 219;
            targetView.setUint32(position2, length);
            position2 += 4;
          }
          position2 += length;
        } else if (type === "number") {
          if (value >>> 0 === value) {
            if (value < 32 || value < 128 && this.useRecords === false || value < 64 && !this.randomAccessStructure) {
              target[position2++] = value;
            } else if (value < 256) {
              target[position2++] = 204;
              target[position2++] = value;
            } else if (value < 65536) {
              target[position2++] = 205;
              target[position2++] = value >> 8;
              target[position2++] = value & 255;
            } else {
              target[position2++] = 206;
              targetView.setUint32(position2, value);
              position2 += 4;
            }
          } else if (value >> 0 === value) {
            if (value >= -32) {
              target[position2++] = 256 + value;
            } else if (value >= -128) {
              target[position2++] = 208;
              target[position2++] = value + 256;
            } else if (value >= -32768) {
              target[position2++] = 209;
              targetView.setInt16(position2, value);
              position2 += 2;
            } else {
              target[position2++] = 210;
              targetView.setInt32(position2, value);
              position2 += 4;
            }
          } else {
            let useFloat32;
            if ((useFloat32 = this.useFloat32) > 0 && value < 4294967296 && value >= -2147483648) {
              target[position2++] = 202;
              targetView.setFloat32(position2, value);
              let xShifted;
              if (useFloat32 < 4 || // this checks for rounding of numbers that were encoded in 32-bit float to nearest significant decimal digit that could be preserved
              (xShifted = value * mult10[(target[position2] & 127) << 1 | target[position2 + 1] >> 7]) >> 0 === xShifted) {
                position2 += 4;
                return;
              } else
                position2--;
            }
            target[position2++] = 203;
            targetView.setFloat64(position2, value);
            position2 += 8;
          }
        } else if (type === "object" || type === "function") {
          if (!value)
            target[position2++] = 192;
          else {
            if (referenceMap2) {
              let referee = referenceMap2.get(value);
              if (referee) {
                if (!referee.id) {
                  let idsToInsert = referenceMap2.idsToInsert || (referenceMap2.idsToInsert = []);
                  referee.id = idsToInsert.push(referee);
                }
                target[position2++] = 214;
                target[position2++] = 112;
                targetView.setUint32(position2, referee.id);
                position2 += 4;
                return;
              } else
                referenceMap2.set(value, { offset: position2 - start });
            }
            let constructor = value.constructor;
            if (constructor === Object) {
              writeObject(value);
            } else if (constructor === Array) {
              packArray(value);
            } else if (constructor === Map) {
              if (this.mapAsEmptyObject) target[position2++] = 128;
              else {
                length = value.size;
                if (length < 16) {
                  target[position2++] = 128 | length;
                } else if (length < 65536) {
                  target[position2++] = 222;
                  target[position2++] = length >> 8;
                  target[position2++] = length & 255;
                } else {
                  target[position2++] = 223;
                  targetView.setUint32(position2, length);
                  position2 += 4;
                }
                for (let [key, entryValue] of value) {
                  pack2(key);
                  pack2(entryValue);
                }
              }
            } else {
              for (let i = 0, l = extensions.length; i < l; i++) {
                let extensionClass = extensionClasses[i];
                if (value instanceof extensionClass) {
                  let extension = extensions[i];
                  if (extension.write) {
                    if (extension.type) {
                      target[position2++] = 212;
                      target[position2++] = extension.type;
                      target[position2++] = 0;
                    }
                    let writeResult = extension.write.call(this, value);
                    if (writeResult === value) {
                      if (Array.isArray(value)) {
                        packArray(value);
                      } else {
                        writeObject(value);
                      }
                    } else {
                      pack2(writeResult);
                    }
                    return;
                  }
                  let currentTarget = target;
                  let currentTargetView = targetView;
                  let currentPosition = position2;
                  target = null;
                  let result;
                  try {
                    result = extension.pack.call(this, value, (size) => {
                      target = currentTarget;
                      currentTarget = null;
                      position2 += size;
                      if (position2 > safeEnd)
                        makeRoom(position2);
                      return {
                        target,
                        targetView,
                        position: position2 - size
                      };
                    }, pack2);
                  } finally {
                    if (currentTarget) {
                      target = currentTarget;
                      targetView = currentTargetView;
                      position2 = currentPosition;
                      safeEnd = target.length - 10;
                    }
                  }
                  if (result) {
                    if (result.length + position2 > safeEnd)
                      makeRoom(result.length + position2);
                    position2 = writeExtensionData(result, target, position2, extension.type);
                  }
                  return;
                }
              }
              if (Array.isArray(value)) {
                packArray(value);
              } else {
                if (value.toJSON) {
                  const json = value.toJSON();
                  if (json !== value)
                    return pack2(json);
                }
                if (type === "function")
                  return pack2(this.writeFunction && this.writeFunction(value));
                writeObject(value);
              }
            }
          }
        } else if (type === "boolean") {
          target[position2++] = value ? 195 : 194;
        } else if (type === "bigint") {
          if (value < BigInt(1) << BigInt(63) && value >= -(BigInt(1) << BigInt(63))) {
            target[position2++] = 211;
            targetView.setBigInt64(position2, value);
          } else if (value < BigInt(1) << BigInt(64) && value > 0) {
            target[position2++] = 207;
            targetView.setBigUint64(position2, value);
          } else {
            if (this.largeBigIntToFloat) {
              target[position2++] = 203;
              targetView.setFloat64(position2, Number(value));
            } else if (this.largeBigIntToString) {
              return pack2(value.toString());
            } else if (this.useBigIntExtension && value < BigInt(2) ** BigInt(1023) && value > -(BigInt(2) ** BigInt(1023))) {
              target[position2++] = 199;
              position2++;
              target[position2++] = 66;
              let bytes = [];
              let alignedSign;
              do {
                let byte = value & BigInt(255);
                alignedSign = (byte & BigInt(128)) === (value < BigInt(0) ? BigInt(128) : BigInt(0));
                bytes.push(byte);
                value >>= BigInt(8);
              } while (!((value === BigInt(0) || value === BigInt(-1)) && alignedSign));
              target[position2 - 2] = bytes.length;
              for (let i = bytes.length; i > 0; ) {
                target[position2++] = Number(bytes[--i]);
              }
              return;
            } else {
              throw new RangeError(value + " was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string");
            }
          }
          position2 += 8;
        } else if (type === "undefined") {
          if (this.encodeUndefinedAsNil)
            target[position2++] = 192;
          else {
            target[position2++] = 212;
            target[position2++] = 0;
            target[position2++] = 0;
          }
        } else {
          throw new Error("Unknown type: " + type);
        }
      };
      const writePlainObject = this.variableMapSize || this.coercibleKeyAsNumber || this.skipValues ? (object) => {
        let keys;
        if (this.skipValues) {
          keys = [];
          for (let key2 in object) {
            if ((typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key2)) && !this.skipValues.includes(object[key2]))
              keys.push(key2);
          }
        } else {
          keys = Object.keys(object);
        }
        let length = keys.length;
        if (length < 16) {
          target[position2++] = 128 | length;
        } else if (length < 65536) {
          target[position2++] = 222;
          target[position2++] = length >> 8;
          target[position2++] = length & 255;
        } else {
          target[position2++] = 223;
          targetView.setUint32(position2, length);
          position2 += 4;
        }
        let key;
        if (this.coercibleKeyAsNumber) {
          for (let i = 0; i < length; i++) {
            key = keys[i];
            let num = Number(key);
            pack2(isNaN(num) ? key : num);
            pack2(object[key]);
          }
        } else {
          for (let i = 0; i < length; i++) {
            pack2(key = keys[i]);
            pack2(object[key]);
          }
        }
      } : (object) => {
        target[position2++] = 222;
        let objectOffset = position2 - start;
        position2 += 2;
        let size = 0;
        for (let key in object) {
          if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
            pack2(key);
            pack2(object[key]);
            size++;
          }
        }
        if (size > 65535) {
          throw new Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');
        }
        target[objectOffset++ + start] = size >> 8;
        target[objectOffset + start] = size & 255;
      };
      const writeRecord = this.useRecords === false ? writePlainObject : options.progressiveRecords && !useTwoByteRecords ? (
        // this is about 2% faster for highly stable structures, since it only requires one for-in loop (but much more expensive when new structure needs to be written)
        (object) => {
          let nextTransition, transition = structures.transitions || (structures.transitions = /* @__PURE__ */ Object.create(null));
          let objectOffset = position2++ - start;
          let wroteKeys;
          for (let key in object) {
            if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
              nextTransition = transition[key];
              if (nextTransition)
                transition = nextTransition;
              else {
                let keys = Object.keys(object);
                let lastTransition = transition;
                transition = structures.transitions;
                let newTransitions = 0;
                for (let i = 0, l = keys.length; i < l; i++) {
                  let key2 = keys[i];
                  nextTransition = transition[key2];
                  if (!nextTransition) {
                    nextTransition = transition[key2] = /* @__PURE__ */ Object.create(null);
                    newTransitions++;
                  }
                  transition = nextTransition;
                }
                if (objectOffset + start + 1 == position2) {
                  position2--;
                  newRecord(transition, keys, newTransitions);
                } else
                  insertNewRecord(transition, keys, objectOffset, newTransitions);
                wroteKeys = true;
                transition = lastTransition[key];
              }
              pack2(object[key]);
            }
          }
          if (!wroteKeys) {
            let recordId = transition[RECORD_SYMBOL];
            if (recordId)
              target[objectOffset + start] = recordId;
            else
              insertNewRecord(transition, Object.keys(object), objectOffset, 0);
          }
        }
      ) : (object) => {
        let nextTransition, transition = structures.transitions || (structures.transitions = /* @__PURE__ */ Object.create(null));
        let newTransitions = 0;
        for (let key in object) if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
          nextTransition = transition[key];
          if (!nextTransition) {
            nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
            newTransitions++;
          }
          transition = nextTransition;
        }
        let recordId = transition[RECORD_SYMBOL];
        if (recordId) {
          if (recordId >= 96 && useTwoByteRecords) {
            target[position2++] = ((recordId -= 96) & 31) + 96;
            target[position2++] = recordId >> 5;
          } else
            target[position2++] = recordId;
        } else {
          newRecord(transition, transition.__keys__ || Object.keys(object), newTransitions);
        }
        for (let key in object)
          if (typeof object.hasOwnProperty !== "function" || object.hasOwnProperty(key)) {
            pack2(object[key]);
          }
      };
      const checkUseRecords = typeof this.useRecords == "function" && this.useRecords;
      const writeObject = checkUseRecords ? (object) => {
        checkUseRecords(object) ? writeRecord(object) : writePlainObject(object);
      } : writeRecord;
      const makeRoom = (end) => {
        let newSize;
        if (end > 16777216) {
          if (end - start > MAX_BUFFER_SIZE)
            throw new Error("Packed buffer would be larger than maximum buffer size");
          newSize = Math.min(
            MAX_BUFFER_SIZE,
            Math.round(Math.max((end - start) * (end > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096
          );
        } else
          newSize = (Math.max(end - start << 2, target.length - 1) >> 12) + 1 << 12;
        let newBuffer = new ByteArrayAllocate(newSize);
        targetView = newBuffer.dataView || (newBuffer.dataView = new DataView(newBuffer.buffer, 0, newSize));
        end = Math.min(end, target.length);
        if (target.copy)
          target.copy(newBuffer, 0, start, end);
        else
          newBuffer.set(target.slice(start, end));
        position2 -= start;
        start = 0;
        safeEnd = newBuffer.length - 10;
        return target = newBuffer;
      };
      const newRecord = (transition, keys, newTransitions) => {
        let recordId = structures.nextId;
        if (!recordId)
          recordId = 64;
        if (recordId < sharedLimitId && this.shouldShareStructure && !this.shouldShareStructure(keys)) {
          recordId = structures.nextOwnId;
          if (!(recordId < maxStructureId))
            recordId = sharedLimitId;
          structures.nextOwnId = recordId + 1;
        } else {
          if (recordId >= maxStructureId)
            recordId = sharedLimitId;
          structures.nextId = recordId + 1;
        }
        let highByte = keys.highByte = recordId >= 96 && useTwoByteRecords ? recordId - 96 >> 5 : -1;
        transition[RECORD_SYMBOL] = recordId;
        transition.__keys__ = keys;
        structures[recordId - 64] = keys;
        if (recordId < sharedLimitId) {
          keys.isShared = true;
          structures.sharedLength = recordId - 63;
          hasSharedUpdate = true;
          if (highByte >= 0) {
            target[position2++] = (recordId & 31) + 96;
            target[position2++] = highByte;
          } else {
            target[position2++] = recordId;
          }
        } else {
          if (highByte >= 0) {
            target[position2++] = 213;
            target[position2++] = 114;
            target[position2++] = (recordId & 31) + 96;
            target[position2++] = highByte;
          } else {
            target[position2++] = 212;
            target[position2++] = 114;
            target[position2++] = recordId;
          }
          if (newTransitions)
            transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
          if (recordIdsToRemove.length >= maxOwnStructures)
            recordIdsToRemove.shift()[RECORD_SYMBOL] = 0;
          recordIdsToRemove.push(transition);
          pack2(keys);
        }
      };
      const insertNewRecord = (transition, keys, insertionOffset, newTransitions) => {
        let mainTarget = target;
        let mainPosition = position2;
        let mainSafeEnd = safeEnd;
        let mainStart = start;
        target = keysTarget;
        position2 = 0;
        start = 0;
        if (!target)
          keysTarget = target = new ByteArrayAllocate(8192);
        safeEnd = target.length - 10;
        newRecord(transition, keys, newTransitions);
        keysTarget = target;
        let keysPosition = position2;
        target = mainTarget;
        position2 = mainPosition;
        safeEnd = mainSafeEnd;
        start = mainStart;
        if (keysPosition > 1) {
          let newEnd = position2 + keysPosition - 1;
          if (newEnd > safeEnd)
            makeRoom(newEnd);
          let insertionPosition = insertionOffset + start;
          target.copyWithin(insertionPosition + keysPosition, insertionPosition + 1, position2);
          target.set(keysTarget.slice(0, keysPosition), insertionPosition);
          position2 = newEnd;
        } else {
          target[insertionOffset + start] = keysTarget[0];
        }
      };
      const writeStruct = (object) => {
        let newPosition = writeStructSlots(object, target, start, position2, structures, makeRoom, (value, newPosition2, notifySharedUpdate) => {
          if (notifySharedUpdate)
            return hasSharedUpdate = true;
          position2 = newPosition2;
          let startTarget = target;
          pack2(value);
          resetStructures();
          if (startTarget !== target) {
            return { position: position2, targetView, target };
          }
          return position2;
        }, this);
        if (newPosition === 0)
          return writeObject(object);
        position2 = newPosition;
      };
    }
    useBuffer(buffer) {
      target = buffer;
      target.dataView || (target.dataView = new DataView(target.buffer, target.byteOffset, target.byteLength));
      targetView = target.dataView;
      position2 = 0;
    }
    set position(value) {
      position2 = value;
    }
    get position() {
      return position2;
    }
    set buffer(buffer) {
      target = buffer;
    }
    get buffer() {
      return target;
    }
    clearSharedData() {
      if (this.structures)
        this.structures = [];
      if (this.typedStructs)
        this.typedStructs = [];
    }
  };
  extensionClasses = [Date, Set, Error, RegExp, ArrayBuffer, Object.getPrototypeOf(Uint8Array.prototype).constructor, C1Type];
  extensions = [{
    pack(date, allocateForWrite, pack2) {
      let seconds = date.getTime() / 1e3;
      if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds >= 0 && seconds < 4294967296) {
        let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(6);
        target2[position3++] = 214;
        target2[position3++] = 255;
        targetView2.setUint32(position3, seconds);
      } else if (seconds > 0 && seconds < 4294967296) {
        let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(10);
        target2[position3++] = 215;
        target2[position3++] = 255;
        targetView2.setUint32(position3, date.getMilliseconds() * 4e6 + (seconds / 1e3 / 4294967296 >> 0));
        targetView2.setUint32(position3 + 4, seconds);
      } else if (isNaN(seconds)) {
        if (this.onInvalidDate) {
          allocateForWrite(0);
          return pack2(this.onInvalidDate());
        }
        let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(3);
        target2[position3++] = 212;
        target2[position3++] = 255;
        target2[position3++] = 255;
      } else {
        let { target: target2, targetView: targetView2, position: position3 } = allocateForWrite(15);
        target2[position3++] = 199;
        target2[position3++] = 12;
        target2[position3++] = 255;
        targetView2.setUint32(position3, date.getMilliseconds() * 1e6);
        targetView2.setBigInt64(position3 + 4, BigInt(Math.floor(seconds)));
      }
    }
  }, {
    pack(set, allocateForWrite, pack2) {
      if (this.setAsEmptyObject) {
        allocateForWrite(0);
        return pack2({});
      }
      let array = Array.from(set);
      let { target: target2, position: position3 } = allocateForWrite(this.moreTypes ? 3 : 0);
      if (this.moreTypes) {
        target2[position3++] = 212;
        target2[position3++] = 115;
        target2[position3++] = 0;
      }
      pack2(array);
    }
  }, {
    pack(error, allocateForWrite, pack2) {
      let { target: target2, position: position3 } = allocateForWrite(this.moreTypes ? 3 : 0);
      if (this.moreTypes) {
        target2[position3++] = 212;
        target2[position3++] = 101;
        target2[position3++] = 0;
      }
      pack2([error.name, error.message, error.cause]);
    }
  }, {
    pack(regex, allocateForWrite, pack2) {
      let { target: target2, position: position3 } = allocateForWrite(this.moreTypes ? 3 : 0);
      if (this.moreTypes) {
        target2[position3++] = 212;
        target2[position3++] = 120;
        target2[position3++] = 0;
      }
      pack2([regex.source, regex.flags]);
    }
  }, {
    pack(arrayBuffer, allocateForWrite) {
      if (this.moreTypes)
        writeExtBuffer(arrayBuffer, 16, allocateForWrite);
      else
        writeBuffer(hasNodeBuffer ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer), allocateForWrite);
    }
  }, {
    pack(typedArray, allocateForWrite) {
      let constructor = typedArray.constructor;
      if (constructor !== ByteArray && this.moreTypes)
        writeExtBuffer(typedArray, typedArrays.indexOf(constructor.name), allocateForWrite);
      else
        writeBuffer(typedArray, allocateForWrite);
    }
  }, {
    pack(c1, allocateForWrite) {
      let { target: target2, position: position3 } = allocateForWrite(1);
      target2[position3] = 193;
    }
  }];
  function writeExtBuffer(typedArray, type, allocateForWrite, encode2) {
    let length = typedArray.byteLength;
    if (length + 1 < 256) {
      var { target: target2, position: position3 } = allocateForWrite(4 + length);
      target2[position3++] = 199;
      target2[position3++] = length + 1;
    } else if (length + 1 < 65536) {
      var { target: target2, position: position3 } = allocateForWrite(5 + length);
      target2[position3++] = 200;
      target2[position3++] = length + 1 >> 8;
      target2[position3++] = length + 1 & 255;
    } else {
      var { target: target2, position: position3, targetView: targetView2 } = allocateForWrite(7 + length);
      target2[position3++] = 201;
      targetView2.setUint32(position3, length + 1);
      position3 += 4;
    }
    target2[position3++] = 116;
    target2[position3++] = type;
    if (!typedArray.buffer) typedArray = new Uint8Array(typedArray);
    target2.set(new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength), position3);
  }
  function writeBuffer(buffer, allocateForWrite) {
    let length = buffer.byteLength;
    var target2, position3;
    if (length < 256) {
      var { target: target2, position: position3 } = allocateForWrite(length + 2);
      target2[position3++] = 196;
      target2[position3++] = length;
    } else if (length < 65536) {
      var { target: target2, position: position3 } = allocateForWrite(length + 3);
      target2[position3++] = 197;
      target2[position3++] = length >> 8;
      target2[position3++] = length & 255;
    } else {
      var { target: target2, position: position3, targetView: targetView2 } = allocateForWrite(length + 5);
      target2[position3++] = 198;
      targetView2.setUint32(position3, length);
      position3 += 4;
    }
    target2.set(buffer, position3);
  }
  function writeExtensionData(result, target2, position3, type) {
    let length = result.length;
    switch (length) {
      case 1:
        target2[position3++] = 212;
        break;
      case 2:
        target2[position3++] = 213;
        break;
      case 4:
        target2[position3++] = 214;
        break;
      case 8:
        target2[position3++] = 215;
        break;
      case 16:
        target2[position3++] = 216;
        break;
      default:
        if (length < 256) {
          target2[position3++] = 199;
          target2[position3++] = length;
        } else if (length < 65536) {
          target2[position3++] = 200;
          target2[position3++] = length >> 8;
          target2[position3++] = length & 255;
        } else {
          target2[position3++] = 201;
          target2[position3++] = length >> 24;
          target2[position3++] = length >> 16 & 255;
          target2[position3++] = length >> 8 & 255;
          target2[position3++] = length & 255;
        }
    }
    target2[position3++] = type;
    target2.set(result, position3);
    position3 += length;
    return position3;
  }
  function insertIds(serialized, idsToInsert) {
    let nextId;
    let distanceToMove = idsToInsert.length * 6;
    let lastEnd = serialized.length - distanceToMove;
    while (nextId = idsToInsert.pop()) {
      let offset = nextId.offset;
      let id = nextId.id;
      serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
      distanceToMove -= 6;
      let position3 = offset + distanceToMove;
      serialized[position3++] = 214;
      serialized[position3++] = 105;
      serialized[position3++] = id >> 24;
      serialized[position3++] = id >> 16 & 255;
      serialized[position3++] = id >> 8 & 255;
      serialized[position3++] = id & 255;
      lastEnd = offset;
    }
    return serialized;
  }
  function writeBundles(start, pack2, incrementPosition) {
    if (bundledStrings2.length > 0) {
      targetView.setUint32(bundledStrings2.position + start, position2 + incrementPosition - bundledStrings2.position - start);
      bundledStrings2.stringsPosition = position2 - start;
      let writeStrings = bundledStrings2;
      bundledStrings2 = null;
      pack2(writeStrings[0]);
      pack2(writeStrings[1]);
    }
  }
  function prepareStructures(structures, packr) {
    structures.isCompatible = (existingStructures) => {
      let compatible = !existingStructures || (packr.lastNamedStructuresLength || 0) === existingStructures.length;
      if (!compatible)
        packr._mergeStructures(existingStructures);
      return compatible;
    };
    return structures;
  }
  var defaultPackr = new Packr({ useRecords: false });
  var pack = defaultPackr.pack;
  var encode = defaultPackr.pack;
  var { NEVER, ALWAYS, DECIMAL_ROUND, DECIMAL_FIT } = FLOAT32_OPTIONS;
  var REUSE_BUFFER_MODE = 512;
  var RESET_BUFFER_MODE = 1024;
  var RESERVE_START_SPACE = 2048;

  // app/public/src/game/replay-format.ts
  var MAGIC = [67, 76, 82, 80];
  var CONTAINER_V1 = 1;
  var KIND = { handshake: 0, state: 1, patch: 2, message: 3 };
  var ENC_MSGPACK = 0;
  var ENC_BYTES = 1;
  var ENC_NONE = 2;
  var ByteWriter = class {
    constructor() {
      // ArrayBuffer-backed (not ArrayBufferLike) so done() returns a valid Blob/BufferSource
      this.buf = new Uint8Array(4096);
      this.len = 0;
    }
    ensure(n) {
      if (this.len + n <= this.buf.length) return;
      let cap = this.buf.length;
      while (cap < this.len + n) cap *= 2;
      const nb = new Uint8Array(cap);
      nb.set(this.buf.subarray(0, this.len));
      this.buf = nb;
    }
    u8(v) {
      this.ensure(1);
      this.buf[this.len++] = v & 255;
    }
    u32(v) {
      this.ensure(4);
      v = v >>> 0;
      this.buf[this.len++] = v & 255;
      this.buf[this.len++] = v >>> 8 & 255;
      this.buf[this.len++] = v >>> 16 & 255;
      this.buf[this.len++] = v >>> 24 & 255;
    }
    varint(v) {
      if (!Number.isInteger(v) || v < 0)
        throw new Error(`varint: expected a non-negative integer, got ${v}`);
      this.ensure(10);
      while (v >= 128) {
        this.buf[this.len++] = v & 127 | 128;
        v = Math.floor(v / 128);
      }
      this.buf[this.len++] = v;
    }
    bytes(u8) {
      this.ensure(u8.length);
      this.buf.set(u8, this.len);
      this.len += u8.length;
    }
    done() {
      return this.buf.subarray(0, this.len);
    }
  };
  var ByteReader = class {
    constructor(u8) {
      this.u8 = u8;
      this.pos = 0;
    }
    u8r() {
      return this.u8[this.pos++];
    }
    u32() {
      const b = this.u8;
      const p = this.pos;
      this.pos += 4;
      return ((b[p] | b[p + 1] << 8 | b[p + 2] << 16) >>> 0) + b[p + 3] * 16777216;
    }
    varint() {
      let shift = 1;
      let result = 0;
      let b;
      do {
        b = this.u8[this.pos++];
        result += (b & 127) * shift;
        shift *= 128;
      } while (b & 128);
      return result;
    }
    bytes(n) {
      const out = this.u8.slice(this.pos, this.pos + n);
      this.pos += n;
      return out;
    }
    get eof() {
      return this.pos >= this.u8.length;
    }
    get length() {
      return this.u8.length;
    }
  };
  var te = new TextEncoder();
  var td = new TextDecoder();
  function encodeHeaderV1(manifest) {
    const w = new ByteWriter();
    for (const c of MAGIC) w.u8(c);
    w.u8(CONTAINER_V1);
    const meta = {
      format: "colreplay-v1",
      schemaVersion: CONTAINER_V1,
      game: manifest.game,
      room: manifest.room,
      viewerUid: manifest.viewerUid,
      recordedAt: manifest.recordedAt
    };
    const metaBytes = te.encode(JSON.stringify(meta));
    w.u32(metaBytes.length);
    w.bytes(metaBytes);
    return w.done();
  }
  function readReplayHeader(bytes) {
    try {
      if (bytes.length < 9) return null;
      for (let i = 0; i < MAGIC.length; i++)
        if (bytes[i] !== MAGIC[i]) return null;
      const r = new ByteReader(bytes);
      for (let i = 0; i < MAGIC.length; i++) r.u8r();
      if (r.u8r() !== CONTAINER_V1) return null;
      const metaLen = r.u32();
      if (metaLen <= 0 || 9 + metaLen > bytes.length) return null;
      return JSON.parse(td.decode(r.bytes(metaLen)));
    } catch (e) {
      return null;
    }
  }
  var TRAILER_MAGIC = [67, 76, 84, 82];
  var TRAILER_FOOTER_LEN = 4 + TRAILER_MAGIC.length;
  function encodeReplayTrailer(summary) {
    const w = new ByteWriter();
    const body = te.encode(JSON.stringify(summary));
    w.bytes(body);
    w.u32(body.length);
    for (const c of TRAILER_MAGIC) w.u8(c);
    return w.done();
  }
  function parseTrailerFooter(buf) {
    try {
      const L = buf.length;
      if (L < TRAILER_FOOTER_LEN) return null;
      for (let i = 0; i < TRAILER_MAGIC.length; i++) {
        if (buf[L - TRAILER_MAGIC.length + i] !== TRAILER_MAGIC[i]) return null;
      }
      const lenPos = L - TRAILER_FOOTER_LEN;
      const summaryLen = (buf[lenPos] | buf[lenPos + 1] << 8 | buf[lenPos + 2] << 16) + buf[lenPos + 3] * 16777216;
      const start = lenPos - summaryLen;
      if (summaryLen <= 0 || start < 0) return null;
      const summary = JSON.parse(
        td.decode(buf.subarray(start, lenPos))
      );
      if (typeof summary !== "object" || summary === null) return null;
      return { summary, byteLength: summaryLen + TRAILER_FOOTER_LEN };
    } catch (e) {
      return null;
    }
  }
  function readReplayTrailer(buf) {
    var _a, _b;
    return (_b = (_a = parseTrailerFooter(buf)) == null ? void 0 : _a.summary) != null ? _b : null;
  }
  function trailerByteLength(buf) {
    var _a, _b;
    return (_b = (_a = parseTrailerFooter(buf)) == null ? void 0 : _a.byteLength) != null ? _b : null;
  }
  function encodeFrameV1(frame, prevT) {
    var _a;
    const w = new ByteWriter();
    const t = writeFrame(w, frame, prevT == null ? (_a = frame.t) != null ? _a : 0 : prevT);
    return { bytes: w.done(), t };
  }
  function writeFrame(w, f, prevT) {
    var _a, _b, _c;
    if (!(f.kind in KIND))
      throw new Error(`writeFrame: unknown frame kind "${f.kind}"`);
    const kind = KIND[f.kind];
    w.u8(kind);
    const t = (_a = f.t) != null ? _a : 0;
    let dt = t - prevT;
    let nextPrevT = t;
    if (dt < 0) {
      console.warn(`[colreplay] non-monotonic frame t (dt=${dt}); clamping to 0`);
      dt = 0;
      nextPrevT = prevT;
    }
    w.varint(dt);
    if (kind === KIND.message) {
      if (typeof f.type === "number") {
        w.u8(0);
        w.varint(f.type);
      } else {
        w.u8(1);
        const tb = te.encode(String(f.type));
        w.varint(tb.length);
        w.bytes(tb);
      }
      const p = f.payload;
      if (p === void 0) {
        w.u8(ENC_NONE);
      } else if (p instanceof Uint8Array) {
        w.u8(ENC_BYTES);
        w.varint(p.length);
        w.bytes(p);
      } else {
        w.u8(ENC_MSGPACK);
        const pb = pack(p);
        w.varint(pb.length);
        w.bytes(pb);
      }
    } else {
      w.varint((_b = f.offset) != null ? _b : 1);
      const b = (_c = f.bytes) != null ? _c : new Uint8Array(0);
      w.varint(b.length);
      w.bytes(b);
    }
    return nextPrevT;
  }

  // app/public/src/game/opfs-replay-writer.ts
  var RESUME_TAIL_SCAN = 64 * 1024;
  var ReplayFileWriter = class {
    constructor(handle, opts) {
      this.handle = handle;
      // threads tDelta across appends; null at open, so the next frame starts at delta 0 and a reopened file resumes its own timeline
      this.prevT = null;
      this.framesWritten = 0;
      const size = handle.getSize();
      if (size === 0) {
        const header = encodeHeaderV1(opts.meta);
        handle.write(header, { at: 0 });
        this.offset = header.length;
        this.resumed = false;
      } else {
        this.offset = this.stripResumeTrailer(size);
        this.resumed = true;
      }
    }
    // on resume, truncate off an EOF summary trailer so appends land after the last frame. best-effort (needs read + truncate)
    stripResumeTrailer(size) {
      if (!this.handle.read || !this.handle.truncate) return size;
      const tailLen = Math.min(size, RESUME_TAIL_SCAN);
      const tail = new Uint8Array(tailLen);
      let got;
      try {
        got = this.handle.read(tail, { at: size - tailLen });
      } catch (e) {
        console.error(
          "[colreplay] resume tail read failed; appending without trailer strip",
          e
        );
        return size;
      }
      const trailerLen = trailerByteLength(tail.subarray(0, got));
      if (trailerLen == null) return size;
      const newSize = size - trailerLen;
      try {
        this.handle.truncate(newSize);
      } catch (e) {
        console.error(
          "[colreplay] resume trailer truncate failed; appending without trailer strip",
          e
        );
        return size;
      }
      return newSize;
    }
    // one atomic write per batch: on a throw/short write, roll back so the caller can safely resend the same batch (no-loss)
    appendFrames(frames) {
      if (frames.length === 0) return;
      const startOffset = this.offset;
      const startPrevT = this.prevT;
      let prevT = this.prevT;
      let total = 0;
      const parts = [];
      for (const f of frames) {
        const { bytes, t } = encodeFrameV1(f, prevT);
        parts.push(bytes);
        total += bytes.length;
        prevT = t;
      }
      const buf = new Uint8Array(total);
      let at = 0;
      for (const p of parts) {
        buf.set(p, at);
        at += p.length;
      }
      let written;
      try {
        written = this.handle.write(buf, { at: startOffset });
      } catch (e) {
        this.rollback(startOffset, startPrevT);
        throw e;
      }
      if (written !== buf.length) {
        this.rollback(startOffset, startPrevT);
        throw new Error(
          `ReplayFileWriter: short write ${written}/${buf.length} B`
        );
      }
      this.offset = startOffset + buf.length;
      this.prevT = prevT;
      this.framesWritten += frames.length;
    }
    rollback(offset, prevT) {
      var _a, _b;
      try {
        (_b = (_a = this.handle).truncate) == null ? void 0 : _b.call(_a, offset);
      } catch (e) {
        console.error("[colreplay] rollback truncate failed", e);
      }
      this.offset = offset;
      this.prevT = prevT;
    }
    flush() {
      this.handle.flush();
    }
    // EOF match-summary footer, written once at close; guarded so a failure leaves the recording trailer-less rather than lost
    writeTrailer(summary) {
      var _a, _b, _c, _d;
      const at = this.offset;
      try {
        const bytes = encodeReplayTrailer(summary);
        const written = this.handle.write(bytes, { at });
        if (written !== bytes.length) {
          (_b = (_a = this.handle).truncate) == null ? void 0 : _b.call(_a, at);
          return;
        }
        this.offset += bytes.length;
      } catch (e) {
        console.error(
          "[colreplay] trailer write failed (recording kept, no summary)",
          e
        );
        try {
          (_d = (_c = this.handle).truncate) == null ? void 0 : _d.call(_c, at);
        } catch (e2) {
        }
      }
    }
    // flush in try/finally so a flush throw still releases the handle, else the OPFS lock leaks for the page session
    close() {
      try {
        this.handle.flush();
      } finally {
        this.handle.close();
      }
    }
    get size() {
      return this.offset;
    }
    // frames appended by this writer (not a resumed prefix)
    get count() {
      return this.framesWritten;
    }
    get isResumed() {
      return this.resumed;
    }
  };

  // app/public/src/game/recorder-worker-core.ts
  var DEFAULT_KEEP_RECENT = 2;
  var errMsg = (e) => {
    var _a;
    return String((_a = e == null ? void 0 : e.message) != null ? _a : e);
  };
  var isQuotaError = (e) => e instanceof Error && (e.name === "QuotaExceededError" || /quota/i.test(e.message));
  function summariseEntry(e) {
    var _a, _b;
    const meta = readReplayHeader(e.header);
    return {
      roomId: e.roomId,
      recordedAt: (_a = meta == null ? void 0 : meta.recordedAt) != null ? _a : null,
      mtime: e.mtime,
      bytes: e.bytes,
      game: meta ? { version: meta.game.version, assetsVersion: meta.game.assetsVersion } : null,
      viewerUid: (_b = meta == null ? void 0 : meta.viewerUid) != null ? _b : null,
      summary: e.tail ? readReplayTrailer(e.tail) : null
    };
  }
  var sortKey = (f) => (f.recordedAt ? Date.parse(f.recordedAt) : Number.NaN) || f.mtime;
  function createRecorderWorker(deps) {
    let keepRecent = DEFAULT_KEEP_RECENT;
    let current = null;
    function ensureOpen(roomId, meta) {
      return __async(this, null, function* () {
        if ((current == null ? void 0 : current.roomId) === roomId) return;
        if (current) {
          try {
            current.writer.close();
          } catch (e) {
            console.error("[recorder.worker] closing previous file", e);
          }
          current = null;
        }
        const handle = yield deps.openHandle(roomId);
        let writer;
        try {
          writer = new ReplayFileWriter(handle, { meta });
        } catch (e) {
          try {
            handle.close();
          } catch (e2) {
          }
          throw e;
        }
        current = { roomId, handle, writer, lastBatchId: 0 };
        if (deps.prune) yield deps.prune(keepRecent, roomId);
      });
    }
    function handleMessage(msg) {
      return __async(this, null, function* () {
        var _a;
        switch (msg.type) {
          case "frames": {
            const batchId = (_a = msg.batchId) != null ? _a : 0;
            try {
              yield ensureOpen(msg.roomId, msg.meta);
            } catch (e) {
              deps.post({
                type: "nack",
                roomId: msg.roomId,
                batchId,
                error: errMsg(e)
              });
              break;
            }
            const cur = current;
            if (!cur) {
              deps.post({
                type: "nack",
                roomId: msg.roomId,
                batchId,
                error: "no active file after open"
              });
              break;
            }
            if (batchId !== 0 && batchId <= cur.lastBatchId) {
              deps.post({ type: "ack", roomId: msg.roomId, batchId });
              break;
            }
            try {
              cur.writer.appendFrames(msg.frames);
            } catch (e) {
              if (deps.prune && isQuotaError(e)) {
                try {
                  yield deps.prune(0, msg.roomId);
                } catch (e2) {
                }
              }
              deps.post({
                type: "nack",
                roomId: msg.roomId,
                batchId,
                error: errMsg(e)
              });
              break;
            }
            cur.lastBatchId = batchId;
            try {
              cur.writer.flush();
            } catch (e) {
              console.error("[recorder.worker] flush after append failed", e);
            }
            deps.post({ type: "ack", roomId: msg.roomId, batchId });
            break;
          }
          case "flush":
            current == null ? void 0 : current.writer.flush();
            break;
          case "download": {
            if (current && current.roomId === msg.roomId) {
              try {
                current.writer.flush();
                const size = current.writer.size;
                const buf = new Uint8Array(size);
                current.handle.read(buf, { at: 0 });
                deps.post(
                  { type: "downloaded", id: msg.id, buf: buf.buffer, bytes: size },
                  [buf.buffer]
                );
              } catch (e) {
                deps.post({ type: "downloaded", id: msg.id, error: errMsg(e) });
              }
              break;
            }
            try {
              const bytes = deps.readFile ? yield deps.readFile(msg.roomId) : null;
              if (!bytes || bytes.length === 0) {
                deps.post({
                  type: "downloaded",
                  id: msg.id,
                  error: "no recording for room"
                });
              } else {
                const ab = bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength ? bytes.buffer : bytes.slice().buffer;
                deps.post(
                  { type: "downloaded", id: msg.id, buf: ab, bytes: bytes.length },
                  [ab]
                );
              }
            } catch (e) {
              deps.post({ type: "downloaded", id: msg.id, error: errMsg(e) });
            }
            break;
          }
          case "config":
            keepRecent = Math.max(1, Math.floor(msg.keep));
            break;
          case "list": {
            try {
              const raw = deps.list ? yield deps.list() : [];
              const files = raw.map(summariseEntry).sort((a, b) => sortKey(b) - sortKey(a));
              deps.post({ type: "listed", id: msg.id, files });
            } catch (e) {
              deps.post({ type: "listed", id: msg.id, files: [], error: errMsg(e) });
            }
            break;
          }
          case "delete": {
            if ((current == null ? void 0 : current.roomId) === msg.roomId) {
              deps.post({
                type: "deleted",
                id: msg.id,
                error: "cannot delete the active recording"
              });
              break;
            }
            try {
              if (deps.remove) yield deps.remove(msg.roomId);
              deps.post({ type: "deleted", id: msg.id, roomId: msg.roomId });
            } catch (e) {
              deps.post({ type: "deleted", id: msg.id, error: errMsg(e) });
            }
            break;
          }
          case "close":
            if (current && (msg.roomId == null || current.roomId === msg.roomId)) {
              try {
                if (msg.summary) current.writer.writeTrailer(msg.summary);
                current.writer.close();
              } catch (e) {
                console.error("[recorder.worker] close", e);
              }
              current = null;
            }
            break;
        }
      });
    }
    return { handleMessage };
  }

  // app/public/src/game/recorder.worker.ts
  var dirPromise = null;
  function replaysDir() {
    if (!dirPromise) {
      dirPromise = navigator.storage.getDirectory().then((root) => root.getDirectoryHandle("replays", { create: true }));
    }
    return dirPromise;
  }
  var core = createRecorderWorker({
    openHandle(roomId) {
      return __async(this, null, function* () {
        const dir = yield replaysDir();
        const fh = yield dir.getFileHandle(`${roomId}.colreplay`, { create: true });
        const h = yield fh.createSyncAccessHandle();
        return h;
      });
    },
    readFile(roomId) {
      return __async(this, null, function* () {
        const dir = yield replaysDir();
        let fh;
        try {
          fh = yield dir.getFileHandle(`${roomId}.colreplay`, { create: false });
        } catch (e) {
          return null;
        }
        const file = yield fh.getFile();
        return new Uint8Array(yield file.arrayBuffer());
      });
    },
    list() {
      return __async(this, null, function* () {
        const HEADER_PREFIX = 16384;
        const TAIL_BYTES = 4096;
        const dir = yield replaysDir();
        const out = [];
        const iter = dir;
        try {
          for (var iter2 = __forAwait(iter.entries()), more, temp, error; more = !(temp = yield iter2.next()).done; more = false) {
            const [name, handle] = temp.value;
            if (!name.endsWith(".colreplay") || handle.kind !== "file") continue;
            try {
              const file = yield handle.getFile();
              const header = new Uint8Array(
                yield file.slice(0, HEADER_PREFIX).arrayBuffer()
              );
              const tail = new Uint8Array(
                yield file.slice(Math.max(0, file.size - TAIL_BYTES)).arrayBuffer()
              );
              out.push({
                roomId: name.slice(0, -".colreplay".length),
                header,
                tail,
                bytes: file.size,
                mtime: file.lastModified
              });
            } catch (e) {
            }
          }
        } catch (temp) {
          error = [temp];
        } finally {
          try {
            more && (temp = iter2.return) && (yield temp.call(iter2));
          } finally {
            if (error)
              throw error[0];
          }
        }
        return out;
      });
    },
    remove(roomId) {
      return __async(this, null, function* () {
        const dir = yield replaysDir();
        yield dir.removeEntry(`${roomId}.colreplay`);
      });
    },
    prune(keep, protect) {
      return __async(this, null, function* () {
        const dir = yield replaysDir();
        const protectName = `${protect}.colreplay`;
        const entries = [];
        const iter = dir;
        try {
          for (var iter2 = __forAwait(iter.entries()), more, temp, error; more = !(temp = yield iter2.next()).done; more = false) {
            const [name, handle] = temp.value;
            if (!name.endsWith(".colreplay") || handle.kind !== "file") continue;
            if (name === protectName) continue;
            try {
              const file = yield handle.getFile();
              entries.push({ name, mtime: file.lastModified });
            } catch (e) {
            }
          }
        } catch (temp) {
          error = [temp];
        } finally {
          try {
            more && (temp = iter2.return) && (yield temp.call(iter2));
          } finally {
            if (error)
              throw error[0];
          }
        }
        const keepNames = new Set(
          entries.sort((a, b) => b.mtime - a.mtime).slice(0, keep).map((e) => e.name)
        );
        for (const e of entries) {
          if (!keepNames.has(e.name)) {
            try {
              yield dir.removeEntry(e.name);
            } catch (e2) {
            }
          }
        }
      });
    },
    post: (message, transfer) => self.postMessage(message, transfer != null ? transfer : [])
  });
  var chain = Promise.resolve();
  self.onmessage = (e) => {
    chain = chain.then(() => core.handleMessage(e.data)).catch((err) => console.error("[recorder.worker]", err));
  };
  self.postMessage({ type: "ready" });
})();
