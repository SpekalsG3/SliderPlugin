function SliderView(element) {
    this.element = element;

    this.onSettingParams = new Event();
    this.onGettingParams = new Event();
    this.toUpdateSlider = new Event();
    this.onStartDraggingPointer = new Event();
    this.onEndingDragging = new Event();

    this.element.onChangingParameters = function(){};

    var _this = this;

    this.element.set = function(update) {
        _this.onSettingParams.manage(update);
    }

    this.element.get = function(param) {
        return _this.onGettingParams.manage(param);
    }

    this.element.onmousedown = function(e) {
        if (_this.element.children[1] == e.target) {
            _this.onStartDraggingPointer.manage(e);
        } else if (e.path.includes(_this.element.children[0])) {
            _this.onStartDraggingPointer.manage(e);
            _this.toUpdateSlider.manage(e);
            _this.onEndingDragging.manage();
        }
    }
    this.element.onmousemove = function(e) {
        _this.toUpdateSlider.manage(e);
    }
    this.element.onmouseup = function() {
        _this.onEndingDragging.manage();
    }
    this.element.onmouseleave = function() {
        _this.onEndingDragging.manage();
    }
}


SliderView.prototype.renderMove = function(sliderViewModel) {
    this.element.children[1].children[0].children[1].innerHTML = sliderViewModel.value;
    if (sliderViewModel.orientation == "row") {
        this.element.children[1].style.left = sliderViewModel.pointerPosition + "px";
        this.element.children[0].children[0].style.width = sliderViewModel.pointerPosition + "px";
    } else {
        this.element.children[1].style.top = sliderViewModel.pointerPosition + "px";
        this.element.children[0].children[0].style.height = sliderViewModel.pointerPosition + "px";
    }
}


SliderView.prototype.setColor = function(orientation, color) {
    this.element.children[0].children[0].style.background = color;
    this.element.children[1].style.background = color;
    this.element.children[1].children[0].style.background = color;

    if (orientation == "row") {
        this.element.children[1].children[0].children[0].style.borderTop = "4px solid" + color;
        this.element.children[1].children[0].children[0].style.borderRight = "5px solid transparent";
    } else {
        this.element.children[1].children[0].children[0].style.borderRight = "4px solid" + color;
        this.element.children[1].children[0].children[0].style.borderTop = "5px solid transparent";
    }
}

SliderView.prototype.displayPart = function(part, flag, displayType = "block") {
    if (flag) {
        part.style.display = displayType;
    } else {
        part.style.display = "none";
    }
}

SliderView.prototype.setHudPoints = function(sliderViewModel) {
    this.element.children[2].innerHTML = "";
    for (var i = 0; i < sliderViewModel.interval; i++) {
        $(this.element.children[2]).append("<div>" + Math.floor(sliderViewModel.min + (sliderViewModel.max-sliderViewModel.min) / (sliderViewModel.interval-1) * i) + "</div>");
    }
}