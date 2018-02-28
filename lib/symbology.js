(function () {
	if (window.BG === undefined) window.BG = {};

	window.BG.inherits = function (Inheritor, Base) {
		function Surrogate () {};
		Surrogate.prototype = Base.prototype;
		Inheritor.prototype = new Surrogate();
	}

	var Symbology = window.BG.Symbology = function () {
		this.loadChrToVal();
		this.loadValToBin();
	}

	// Default mapping object.
	Symbology.prototype.mapping = [{"chr": undefined, "val": undefined, "bin": undefined}];

	// Create mappings.
	Symbology.prototype.loadChrToVal = function () {
		this.chrToVal = {};
		this.mapping.forEach(m => {
			this.chrToVal[m.chr] = m.val;
		});
	}
	Symbology.prototype.loadValToBin = function () {
		this.valToBin = {};
		this.mapping.forEach(m => {
			this.valToBin[m.val] = m.bin;
		});
	}

	// Takes a string, filters out unencodable characters, returns a string.
	Symbology.prototype.sanitize = function (str) {
		var keys = Object.keys(this.chrToVal);
		return str.split('').filter(x => keys.indexOf(x)).join('');
	}

	// Takes a sanitized string and returns an array of values.
	Symbology.prototype.translate = function (str) {
		return str.split('').map(x => this.chrToVal[x]);
	}

	// Takes an array of values and returns a checksum value.
	Symbology.prototype.checksum = function (arr) {

	}

	// Takes the contents and adds ending chars, checksum, etc.
	Symbology.prototype.addMeta = function (arr) {

	}

	// Takes an array of values and returns a binary string.
	Symbology.prototype.doEncode = function (arr) {
		return arr.map(x => this.valToBin[x]).join('');
	}

	// All together now... (returns pair [binaryString, sanitizedString])
	Symbology.prototype.encode = function (str) {
		var sanitized  = this.sanitize(str);
		var translated = this.translate(sanitized);
		var metaed     = this.addMeta(translated);
		var encoded    = this.doEncode(metaed);
		return [encoded, sanitized];
	}
})();