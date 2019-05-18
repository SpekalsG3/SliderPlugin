var SliderController = function(sliderView, sliderModel) {
	this.sliderView = sliderView;
	this.sliderModel = sliderModel;

	this.sliderView.element.classList.add(this.sliderModel.orientation);

	this.setColor();
	this.displayPart(this.sliderView.element.children[1].children[0], this.sliderModel.hint);
	this.displayPart(this.sliderView.element.children[2], this.sliderModel.hud, "flex");
	this.displayPart(this.sliderView.element.children[0].children[0], this.sliderModel.track);
	this.setMinMax();

	this.init();
};

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
		
		if (checkMin && checkMax) {
			this.sliderView.element.children[0].children[0].style.width = this.sliderModel.pointerPosition + "px";
			this.sliderView.element.children[1].style.left = this.sliderModel.pointerPosition + "px";
		}

	} else {
		checkMax = (this.sliderModel.pointerPosition + this.sliderModel.step * (newMax > this.sliderModel.max) < parseInt($(this.sliderView.element.children[0]).css("height")) + 8);
		this.sliderModel.pointerPosition = (this.sliderModel.value - this.sliderModel.min) * parseInt($(this.sliderView.element.children[0]).css("height")) / (this.sliderModel.max - this.sliderModel.min) + 8;

		if (checkMin && checkMax) {
			this.sliderView.element.children[0].children[0].style.height = this.sliderModel.pointerPosition + "px";
			this.sliderView.element.children[1].style.top = this.sliderModel.pointerPosition + "px";
		}
	}

	if (checkMax) {
		this.sliderView.element.children[1].children[0].children[1].innerHTML = this.sliderModel.min;
	} else if (checkMin) {
		this.sliderView.element.children[1].children[0].children[1].innerHTML = this.sliderModel.max;
	}

	this.setStep();
	this.setHudPoints();
}



SliderController.prototype.init = function() {
	this.sliderView.element.children[1].children[0].children[1].innerHTML = this.sliderModel.startPoint;

	if (this.sliderModel.orientation == "row") {
		this.sliderModel.pointerPosition = (this.sliderModel.pointerPosition - this.sliderModel.min) * parseInt($(this.sliderView.element.children[0]).css("width")) / (this.sliderModel.max - this.sliderModel.min) + 8;
	} else {
		this.sliderModel.pointerPosition = (this.sliderModel.pointerPosition - this.sliderModel.min) * parseInt($(this.sliderView.element.children[0]).css("height")) / (this.sliderModel.max - this.sliderModel.min) + 8;
	}

}

var SliderView = function(model, element) {
	this.element = element;
	this.sliderModel = model;

	var _this = this;

	this.element.addEventListener("mousedown", function(e) {
		_this.startDragging(e);
	});
	this.element.addEventListener("mouseup", function(){
		_this.endDragging();
	});
	this.element.addEventListener("mouseleave", function() {
		_this.endDragging();
	});
	this.element.addEventListener("mousemove", function(e) {
		if (_this.sliderModel.startDragCheck) {
			_this.movePointer({ pageX: e.pageX, pageY: e.pageY }, _this.sliderModel.getModelData());
		}
	});
}



SliderView.prototype.startDragging = function(e) {
	if (!Object.values($(".pointer")).includes(e.target)) {
		this.sliderModel.startDraggingCheck = false;
		return;
	}
	this.sliderModel.startDragCheck = true;

	if (this.sliderModel.orientation == "row") {
		this.sliderModel.started = $(this.element).position().left;
	} else {
		this.sliderModel.started = $(this.element).position().top;
	}
}

SliderView.prototype.updateSlider = function(e) {
	if (this.sliderModel.startDragCheck) {
		this.movePointer({ pageX: e.pageX, pageY: e.pageY }, this.sliderModel.getModelData());
	}
}

SliderView.prototype.movePointer = function(e, sliderModelData) {
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
		if (move >= 0 && move <= parseInt($(this.element.children[0]).css("width"))) {
			sliderViewModel.value = Math.floor((sliderModelData.max - sliderModelData.min) * move / parseInt($(this.element.children[0]).css("width")) + sliderModelData.min);
		}
	} else {
		if (move >= 0 && move <= parseInt($(this.element.children[0]).css("height"))) {
			sliderViewModel.value = Math.floor((sliderModelData.max - sliderModelData.min) * move / parseInt($(this.element.children[0]).css("height")) + sliderModelData.min);
		}
	}
	sliderViewModel.pointerPosition = move + 8;

	this.sliderModel.value = sliderViewModel.value;
	this.sliderModel.pointerPosition  = sliderViewModel.pointerPosition;

	this.renderMove(sliderViewModel);
}

SliderView.prototype.endDragging = function() {
	this.sliderModel.startDragCheck = false;
}



SliderView.prototype.renderMove = function(sliderViewModel) {
	this.element.children[1].children[0].children[1].innerHTML = sliderViewModel.value;
	if (sliderViewModel.orientation == "row") {
		this.element.children[1].style.left 				= sliderViewModel.pointerPosition + "px";
		this.element.children[0].children[0].style.width 	= sliderViewModel.pointerPosition + "px";
	} else {
		this.element.children[1].style.top 					= sliderViewModel.pointerPosition + "px";
		this.element.children[0].children[0].style.height 	= sliderViewModel.pointerPosition + "px";
	}
}

var SliderModel = function(params = {}) {
	this.min = 			params.min 						? params.min 		: 0,
	this.max = 			params.max 						? params.max 		: 100,
	this.step = 		params.step 					? params.step 		: 1,
	this.startPoint = 	params.startPoint 				? params.startPoint : this.min,
	this.orientation = 	params.orientation == "column" 	? "column" 			: "row",
	this.color = 		params.color 					? params.color 		: "#e85f3e",
	this.hint = 		params.hint 					? params.hint 		: true,
	this.hud = 			params.hud 						? params.hud 		: true,
	this.interval = 	params.interval 				? params.interval	: 5,
	this.track = 		params.track 					? params.track 		: true,

	this.stepValue = this.step;
	this.started = null;
	this.pointerPosition = this.startPoint;
	this.value = this.startPoint;
	this.startDraggingCheck = false;
};

SliderModel.prototype.getModelData = function() {
	console.log({
		min: this.min,
		max: this.max,
		step: this.step,
		orientation: this.orientation,
		color: this.color,
		started: this.started,
		value: this.value,
		pointerPosition: this.pointerPosition
	});
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



var parameters = {
	min: 0,
	max: 100,
	step: 10,
	startPoint: 50,
	interval: 3
};

var model = new SliderModel(parameters),
	view = new SliderView(model, document.getElementById("MVC"));

var controller = new SliderController(view, model);

// controller.startDragging({target: $(".pointer")[0], pageX: 100, pageY: 100});
// controller.updateSlider({target: $(".pointer")[0], pageX: 100, pageY: 100}, model.getModelData());