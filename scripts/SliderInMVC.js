(function($) {

	$.fn.AnimateSlider = function(parameters = {}) {
		for (var i = 0; i < this.length; i++) {
			var model = new SliderModel(parameters),
				view = new SliderView(this[i]);

			var controller = new SliderController(view, model);
		}

	}

})(jQuery);


function Event(sender) {
	this.sender = sender;
	this.listeners = [];
}

Event.prototype.add = function(listener) {
	this.listeners.push(listener);
}

Event.prototype.manage = function(e = {}) {
	for (var i = 0; i < this.listeners.length; i++) {
		return this.listeners[i](e);
	}
}



function SliderController(sliderView, sliderModel) {
	this.sliderView = sliderView;
	this.sliderModel = sliderModel;

	this.sliderView.element.classList.add(this.sliderModel.orientation);

	this.setColor();
	this.displayPart(this.sliderView.element.children[1].children[0], this.sliderModel.hint);
	this.displayPart(this.sliderView.element.children[2], this.sliderModel.hud, "flex");
	this.displayPart(this.sliderView.element.children[0].children[0], this.sliderModel.track);
	this.setMinMax();

	this.init();
}


SliderController.prototype.init = function() {
	this.sliderView.element.children[1].children[0].children[1].innerHTML = this.sliderModel.startingPoint;

	if (this.sliderModel.orientation == "row") {
		this.sliderModel.pointerPosition = (this.sliderModel.pointerPosition - this.sliderModel.min) * parseInt($(this.sliderView.element.children[0]).css("width")) / (this.sliderModel.max - this.sliderModel.min) + 8;
	} else {
		this.sliderModel.pointerPosition = (this.sliderModel.pointerPosition - this.sliderModel.min) * parseInt($(this.sliderView.element.children[0]).css("height")) / (this.sliderModel.max - this.sliderModel.min) + 8;
	}

	var _this = this;

	this.sliderView.onSettingParams = new Event(this);
	this.sliderView.onSettingParams.add(function(update) {
		_this.set(update);
	});

	this.sliderView.onGettingParams = new Event(this);
	this.sliderView.onGettingParams.add(function(param) {
		return _this.get(param);
	});

	this.sliderView.onStartDraggingPointer = new Event(this);
	this.sliderView.onStartDraggingPointer.add(function(e) {
		_this.startDragging(e);
	});

	this.sliderView.toUpdateSlider = new Event(this);
	this.sliderView.toUpdateSlider.add(function(e) {
		_this.updateSlider(e);
	});

	this.sliderView.onEndingDragging = new Event(this);
	this.sliderView.onEndingDragging.add(function() {
		_this.endDragging();
	});

}


SliderController.prototype.startDragging = function(e) {
	if (!Object.values($(".pointer")).includes(e.target)) {
		this.sliderModel.startDraggingCheck = false;
		return;
	}
	this.sliderModel.startDragCheck = true;

	if (this.sliderModel.orientation == "row") {
		this.sliderModel.started = $(this.sliderView.element).position().left;
	} else {
		this.sliderModel.started = $(this.sliderView.element).position().top;
	}
}

SliderController.prototype.updateSlider = function(e) {
	if (this.sliderModel.startDragCheck) {
		this.movePointer({ pageX: e.pageX, pageY: e.pageY }, this.sliderModel.getModelData());
	}
}

SliderController.prototype.movePointer = function(e, sliderModelData) {
	var sliderViewModel = {
		color: sliderModelData.color,
		orientation: sliderModelData.orientation
	};

	var move;
	if (sliderModelData.orientation == "row") {
		move = Math.round((e.pageX - sliderModelData.started - 16) / sliderModelData.step) * sliderModelData.step;
	} else {
		move = Math.round((e.pageY - sliderModelData.started - 10) / sliderModelData.step) * sliderModelData.step;
	}

	if (sliderModelData.orientation == "row") {
		if (move >= 0 && move <= parseInt($(this.sliderView.element.children[0]).css("width"))) {
			sliderViewModel.value = Math.floor((sliderModelData.max - sliderModelData.min) * move / parseInt($(this.sliderView.element.children[0]).css("width")) + sliderModelData.min);
				sliderViewModel.pointerPosition = move + 8;
		} else {
			return;
		}
	} else {
		if (move >= 0 && move <= parseInt($(this.sliderView.element.children[0]).css("height"))) {
			sliderViewModel.value = Math.floor((sliderModelData.max - sliderModelData.min) * move / parseInt($(this.sliderView.element.children[0]).css("height")) + sliderModelData.min);
				sliderViewModel.pointerPosition = move + 2;
		} else {
			return;
		}
	}

	this.sliderModel.value = sliderViewModel.value;
	this.sliderModel.pointerPosition  = sliderViewModel.pointerPosition;

	this.renderMove(sliderViewModel);
}

SliderController.prototype.endDragging = function() {
	this.sliderModel.startDragCheck = false;
}


SliderController.prototype.renderMove = function(sliderViewModel) {
	this.sliderView.element.children[1].children[0].children[1].innerHTML = sliderViewModel.value;
	if (sliderViewModel.orientation == "row") {
		this.sliderView.element.children[1].style.left = sliderViewModel.pointerPosition + "px";
		this.sliderView.element.children[0].children[0].style.width = sliderViewModel.pointerPosition + "px";
	} else {
		this.sliderView.element.children[1].style.top = sliderViewModel.pointerPosition + "px";
		this.sliderView.element.children[0].children[0].style.height = sliderViewModel.pointerPosition + "px";
	}
}



SliderController.prototype.setColor = function(color = this.sliderModel.color) {
	this.sliderView.element.children[0].children[0].style.background = color;
	this.sliderView.element.children[1].style.background = color;
	this.sliderView.element.children[1].children[0].style.background = color;

	if (this.sliderModel.orientation == "row") {
		this.sliderView.element.children[1].children[0].children[0].style.borderTop = "4px solid" + color;
		this.sliderView.element.children[1].children[0].children[0].style.borderRight = "5px solid transparent";
	} else {
		this.sliderView.element.children[1].children[0].children[0].style.borderRight = "4px solid" + color;
		this.sliderView.element.children[1].children[0].children[0].style.borderTop = "5px solid transparent";
	}
}

SliderController.prototype.displayPart = function(el, flag, displayType = "block") {
	if (flag) {
		el.style.display = displayType;
	} else {
		el.style.display = "none";
	}
}
SliderController.prototype.setStep = function(value = this.sliderModel.stepValue) {
	this.sliderModel.stepValue = value;
	if (this.sliderModel.orientation == "row") {
		this.sliderModel.step = value * parseInt($(this.sliderView.element.children[0]).css("width")) / (this.sliderModel.max - this.sliderModel.min);
	} else {
		this.sliderModel.step = value * parseInt($(this.sliderView.element.children[0]).css("height")) / (this.sliderModel.max - this.sliderModel.min);
	}
}

SliderController.prototype.setHudPoints = function() {
	this.sliderView.element.children[2].innerHTML = "";
	for (var i = 0; i < this.sliderModel.interval; i++) {
		$(this.sliderView.element.children[2]).append("<div>" + Math.floor(this.sliderModel.min + (this.sliderModel.max-this.sliderModel.min) / (this.sliderModel.interval-1) * i) + "</div>");
	}
}

SliderController.prototype.setMinMax = function(newMin = this.sliderModel.min, newMax = this.sliderModel.max) {
	var checkMin = (this.sliderModel.pointerPosition + this.sliderModel.step * (newMin > this.sliderModel.min) > 8),
		checkMax;

	this.sliderModel.min = newMin;
	this.sliderModel.max = newMax;

	if (this.sliderModel.orientation == "row") {
		checkMax = (this.sliderModel.pointerPosition + this.sliderModel.step * (newMax > this.sliderModel.max) < parseInt($(this.sliderView.element.children[0]).css("width")) + 8);
		this.sliderModel.pointerPosition = (this.sliderModel.value - this.sliderModel.min) * parseInt($(this.sliderView.element.children[0]).css("width")) / (this.sliderModel.max - this.sliderModel.min) + 8;
		

	console.log(checkMin + " " + checkMax);
		if (checkMin && checkMax) {
			this.sliderView.element.children[0].children[0].style.width = this.sliderModel.pointerPosition + "px";
			this.sliderView.element.children[1].style.left = this.sliderModel.pointerPosition + "px";
		} else if (!checkMin) {
			this.sliderView.element.children[1].children[0].children[1].innerHTML = this.sliderModel.min;
		} else if (!checkMax) {
			this.sliderView.element.children[1].children[0].children[1].innerHTML = this.sliderModel.max;
		}

	} else {
		checkMax = (this.sliderModel.pointerPosition + this.sliderModel.step * (newMax > this.sliderModel.max) < parseInt($(this.sliderView.element.children[0]).css("height")) + 8);
		this.sliderModel.pointerPosition = (this.sliderModel.value - this.sliderModel.min) * parseInt($(this.sliderView.element.children[0]).css("height")) / (this.sliderModel.max - this.sliderModel.min) + 8;

		if (checkMin && checkMax) {
			this.sliderView.element.children[0].children[0].style.height = this.sliderModel.pointerPosition + "px";
			this.sliderView.element.children[1].style.top = this.sliderModel.pointerPosition + "px";
		} else if (!checkMin) {
			this.sliderView.element.children[1].children[0].children[1].innerHTML = this.sliderModel.min;
		} else if (!checkMax) {
			this.sliderView.element.children[1].children[0].children[1].innerHTML = this.sliderModel.max;
		}
	}

	this.setStep();
	this.setHudPoints();
}

SliderController.prototype.set = function(update) {
	for (var i = 0; i < Object.keys(update).length; i++) {
		var key = Object.keys(update)[i];
		switch (key) {
			case "min":
				this.setMinMax(parseInt(update[key]), this.sliderModel.max);
				break;
			case "max":
				this.setMinMax(this.sliderModel.min, parseInt(update[key]));
				break;
			case "step":
				this.setStep(parseInt(update[key]));
				break;
			case "startPoint":
				break;
			case "orientation":
				this.updateOrientation(update[key].toLowerCase());
				break;
			case "mainColor":
				this.setColor(update[key]);
				break;
			case "hint":
				this.displayPart(this.sliderView.element.children[1].children[0], update[key]);
				break;
			case "hud":
				this.displayPart(this.sliderView.element.children[2], update[key], "flex");
				break;
			case "interval":
				this.sliderModel.interval = update[key];
				this.setHudPoints();
				break;
			case "track":
				this.displayPart(this.sliderView.element.children[0].children[0], update[key]);
				break;
		}
	}
}



SliderController.prototype.get = function(param) {
	return this.sliderModel[param];
}


function SliderView(element) {
	this.element = element;

	this.onSettingParams = null;
	this.onGettingParams = null;
	this.toUpdateSlider = null;
	this.onStartDraggingPointer = null;
	this.onEndingDragging = null;

	var _this = this;

	this.element.set = function(update) {
		_this.onSettingParams.manage(update);
	}

	this.element.get = function(param) {
		return _this.onGettingParams.manage(param);
	}

	this.element.addEventListener("mousedown", function(e) {
		_this.onStartDraggingPointer.manage(e);
	});
	this.element.addEventListener("mousemove", function(e) {
		_this.toUpdateSlider.manage(e);
	});
	this.element.addEventListener("mouseup", function() {
		_this.onEndingDragging.manage();
	});
	this.element.addEventListener("mouseleave", function() {
		_this.onEndingDragging.manage();
	});
}


function SliderModel(params) {
	this.min = 			params.min 						? params.min 			: 0;
	this.max = 			params.max 						? params.max 			: 100;
	this.step = 		params.step 					? params.step 			: 1;
	this.startingPoint= params.startingPoint 			? params.startingPoint 	: this.min;
	this.orientation = 	params.orientation == "column" 	? "column" 				: "row";
	this.color = 		params.color 					? params.color 			: "#e85f3e";
	this.hint = 		params.hint != undefined		? params.hint 			: true;
	this.hud = 			params.hud != undefined			? params.hud 			: true;
	this.interval = 	params.interval 				? params.interval		: 5;
	this.track = 		params.track != undefined		? params.track 			: true;

	this.stepValue = this.step;
	this.started = null;
	this.pointerPosition = this.startingPoint;
	this.value = this.startingPoint;
	this.startDraggingCheck = false;
};


SliderModel.prototype.getModelData = function() {
	return {
		min: this.min,
		max: this.max,
		step: this.step,
		orientation: this.orientation,
		color: this.color,
		started: this.started,
		value: this.value,
		pointerPosition: this.pointerPosition
	};
}