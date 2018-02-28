(function () {
	if (window.BG === undefined) window.BG = {};

	var BGen = window.BG.BGen = function (params) {
		if (!params.hasOwnProperty('ctx'))    throw 'Need canvas context';
		if (!params.hasOwnProperty('canvas')) throw 'Need canvas';
		if (!params.hasOwnProperty('input'))  throw 'Need input';
		this.symbology = new BG[params.symbology || 'Code128B']();
		this.ctx = params['ctx'];
		this.canvas = params['canvas'];
		this.input = params['input'];

		// disable antialiasing
		this.ctx['imageSmoothingEnabled'] = false;

		// setter for everything relating to the size of the drawn bar code
		// eventually it'll be possible to set the height and the zoom ratio
		this.setHeightAndWidth(params.height || 20, params.width || 1)

		// bind listener to input 
		this.input.oninput = this.getInput.bind(this);

		// bind height and width settings listeners
		this.heightInput = params['heightInput'];
		this.widthInput = params['widthInput'];
		this.heightInput.oninput = ()=>{this.setHeight(this.heightInput.value)};
		this.widthInput.oninput  = ()=>{this.setWidth(this.widthInput.value)};
	}

	BGen.prototype.getInput = function () {
		var [bin, sanitized] = this.symbology.encode(this.input.value);
		this.clearCanvas();
		this.drawBarCode(bin);
		//this.drawText(sanitized);
	}

	BGen.prototype.clearCanvas = function () {
		this.ctx.save();
		this.ctx.setTransform(1,0,0,1,0,0);
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.ctx.restore();
	}

	BGen.prototype.drawBarCode = function (bin) {
		this.ctx.save();
		var barCodeLength = bin.length * this.width;
		var xOffset = Math.round(this.canvas.width / 2 - barCodeLength / 2)
		for (i in bin) {
			if (bin[i] == '1') {
				this.ctx.putImageData(this.line, i * this.width + xOffset, 0);
			}
		}
		this.ctx.restore();
	}

	BGen.prototype.setHeight = function (height) {
		this.setHeightAndWidth(height, this.width);
	}

	BGen.prototype.setWidth = function (width) {
		this.setHeightAndWidth(this.height, width);
	}

	BGen.prototype.setHeightAndWidth = function (height, width) {
		this.height = height;
		this.width = width;
		this.line = ctx.createImageData(width, height);
		var data = this.line.data;
		for (var i = 0; i < data.length; i += 4) {
			data[i]   = 0;
			data[i+1] = 0;
			data[i+2] = 0;
			data[i+3] = 255;
		}
		this.getInput(); // redraw
	}
})();