var SliderController = function(sliderView, sliderModel) {
	this.sliderView = sliderView;
	this.sliderModel = sliderModel;
};

SliderController.prototype.onStartDraging = function(e) {
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
	this.sliderView.onStartDraging = this.onStartDragging.bind(this);
}

SliderController.prototype.updateSlider = function(sliderModelData) {
	var sliderViewModel = {
		color: sliderModelData.color
	};

	var move;
	if (sliderModelData.orientation == "row") {
		move = Math.round((e.pageX - sliderModelData.started - 16) / sliderModelData.step) * sliderModelData.step;
	} else {
		move = Math.round((e.pageY - sliderModelData.started - 10) / sliderModelData.step) * sliderModelData.step;
	}

	sliderViewModel.trackSize = sliderModelData.move;

	if (sliderModelData.orientation == "row") {
		if (move >= 0 && move <= parseInt($(this.children[0]).css("width"))) {
			sliderViewModel.value = Math.floor((sliderModelData.max - sliderModelData.min) * move / parseInt($(this.children[0]).css("width")) + sliderModelData.min);
			sliderViewModel.pointerPosition = move + 8;
			/*this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + this.mainColor + ';"></div>' + sliderViewModel.value;
			this.children[1].style.left = this.pos + "px";
			this.children[0].children[0].style.width = this.pos + "px";*/
		}
	} else {
		if (move >= 0 && move <= parseInt($(this.children[0]).css("height"))) {
			sliderViewModel.value = Math.floor((sliderModelData.max - sliderModelData.min) * move / parseInt($(this.children[0]).css("height")) + sliderModelData.min);
			sliderViewModel.pointerPosition = move + 2;
			/*this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + this.mainColor + ';"></div>' + sliderViewModel.value;
			this.children[1].style.top = this.pos + "px";
			this.children[0].children[0].style.height = this.pos + "px";*/
		}
	}

	this.sliderModel.value = sliderViewModel.value;
	this.sliderModel.pointerPosition  = sliderViewModel.pointerPosition;

	this.sliderView.render(sliderViewModel);
}

SliderController.prototype.endDragging = function() {
	this.sliderModel.startDragCheck = false;
}

var SliderViewMock = function() {
	this.calledRenderWith = null;
};

SliderViewMock.prototype.render = function(sliderViewModel) {
	this.calledRenderWith = sliderViewModel;
};

var view = new SliderViewMock(),
	controller = new SliderController();

var sliderViewModel = {

};