var SliderController = function(sliderView, sliderModel) {
	this.sliderView = sliderView;
	this.sliderModel = sliderModel;
};

SliderController.prototype.startDraging = function(e) {
	if (!Object.values($(".pointer")).includes(e.target)) {
		this.sliderModel.startDraggingCheck = false;
		return;
	}
	this.sliderModel.startDragCheck = true;

	// this.started = this.sliderModel.getPagePosition();
	if (this.orientation == "row") {
		this.sliderModel.started = $(this).position().left;
	} else {
		this.sliderModel.started = $(this).position().top;
	}
}

SliderController.prototype.init = function() {

	this.sliderView.startDraging = this.startDragging.bind(this);
	this.sliderView.updateSlider = this.updateSlider.bind(this);
	this.sliderView.endDragging = this.endDragging.bind(this);
}

SliderController.prototype.updateSlider = function(e, sliderModelData) {
	/*
		started,
		min,
		max,
		step,
		color,
		orientation,
	*/

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
		if (move >= 0 && move <= 260){//parseInt($(this.children[0]).css("width"))) {
			sliderViewModel.value = Math.floor((sliderModelData.max - sliderModelData.min) * move / parseInt($(this.sliderView.element.children[0]).css("width")) + sliderModelData.min);

			/*this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + this.mainColor + ';"></div>' + sliderViewModel.value;
			this.children[1].style.left = this.pos + "px";
			this.children[0].children[0].style.width = this.pos + "px";*/
		}
	} else {
		if (move >= 0 && move <= 260){//parseInt($(this.children[0]).css("height"))) {
			sliderViewModel.value = Math.floor((sliderModelData.max - sliderModelData.min) * move / parseInt($(this.sliderView.element.children[0]).css("height")) + sliderModelData.min);

			/*this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + this.mainColor + ';"></div>' + sliderViewModel.value;
			this.children[1].style.top = this.pos + "px";
			this.children[0].children[0].style.height = this.pos + "px";*/
		}
	}
	sliderViewModel.pointerPosition = move + 8;

	//this.sliderModel.value = sliderViewModel.value;
	//this.sliderModel.pointerPosition  = sliderViewModel.pointerPosition;

	this.sliderView.render(sliderViewModel);
}

SliderController.prototype.endDragging = function() {
	this.sliderModel.startDragCheck = false;
}

var SliderView = function(element, params = {}) {
	this.element = element;

	this.parameters = {
		min: params.min ? params.min : 0,
		max: params.max ? params.max : 100,
		step: params.step ? params.step : 1,
		startPoint: params.startPoint ? params.startPoint : parameters.min,
		orientation: params.orientation == "column" ? "column" : "row",
		mainColor: params.mainColor ? params.mainColor : "#e85f3e",
		hint: params.hint ? params.hint : true,
		hud: params.hud ? params.hud : true,
		interval: params.interval ? params.interval : 5,
		track: params.track ? params.track : true,
	}

	this.startDraging = null;
	this.updateSlider = null;
	this.endDragging = null;
}

SliderView.prototype.render = function(sliderViewModel) {
	if (sliderViewModel.orientation == "row") {
		this.element.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + sliderViewModel.color + ';"></div>' + sliderViewModel.value;
		this.element.children[1].style.left = sliderViewModel.pointerPosition + "px";
		this.element.children[0].children[0].style.width = sliderViewModel.pointerPosition + "px";
	} else {
		this.element.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + sliderViewModel.color + ';"></div>' + sliderViewModel.value;
		this.element.children[1].style.top = sliderViewModel.pointerPosition + "px";
		this.element.children[0].children[0].style.height = sliderViewModel.pointerPosition + "px";
	}
}

var parameters = {
	min: 0,
	max: 100,
	step: 10,
	startPoint: 50,
	interval: 3
};

var view = new SliderView(document.getElementById("MVC"));

var controller = new SliderController(view, null);

var sliderModelData = {
	started: 10,
	min: 0,
	max: 100,
	step: 5,
	color: "#e85f3e",
	orientation: "row"
};

controller.updateSlider({pageX: 100, pageY: 100}, sliderModelData);