function SliderController(sliderView, sliderModel) {
    this.sliderView = sliderView;
    this.sliderModel = sliderModel;

    this.init();

    this.sliderView.setColor(this.sliderModel.get("orientation"), this.sliderModel.get("color"));
    this.sliderView.displayPart(this.sliderView.element.children[1].children[0], this.sliderModel.hint);
    this.sliderView.displayPart(this.sliderView.element.children[2], this.sliderModel.hud, "flex");
    this.sliderView.displayPart(this.sliderView.element.children[0].children[0], this.sliderModel.track);
    this.setMinMax();
}


SliderController.prototype.init = function() {
    this.sliderView.element.children[1].children[0].children[1].innerHTML = this.sliderModel.startingPoint;

    this.sliderView.element.classList.add(this.sliderModel.orientation);

    if (this.sliderModel.orientation == "row") {
        this.sliderModel.size = parseInt($(this.sliderView.element.children[0]).css("width"));
    } else {
        this.sliderModel.size = parseInt($(this.sliderView.element.children[0]).css("height"));
    }
    this.sliderModel.pointerPosition = (this.sliderModel.pointerPosition - this.sliderModel.min) * this.sliderModel.size / (this.sliderModel.max - this.sliderModel.min) + 8;

    var _this = this;

    this.sliderView.onSettingParams.add(function(update) {
        _this.set(update);
    });

    this.sliderView.onGettingParams.add(function(param) {
        return _this.sliderModel.get(param);
    });

    this.sliderView.onStartDraggingPointer.add(function(e) {
        _this.startDragging(e);
    });

    this.sliderView.toUpdateSlider.add(function(e) {
        _this.updateSlider(e);
    });

    this.sliderView.onEndingDragging.add(function() {
        _this.endDragging();
    });

}


SliderController.prototype.startDragging = function(e) {
    this.sliderModel.isDragStarted = true;

    if (this.sliderModel.orientation == "row") {
        this.sliderModel.started = $(this.sliderView.element).position().left;
    } else {
        this.sliderModel.started = $(this.sliderView.element).position().top;
    }
}

SliderController.prototype.updateSlider = function(e) {
    if (this.sliderModel.isDragStarted) {
        this.movePointer({ pageX: e.pageX, pageY: e.pageY }, this.sliderModel.getModelData());
    }
}

SliderController.prototype.movePointer = function(e, sliderModelData) {
    var sliderViewModel = {
        orientation: sliderModelData.orientation
    };

    var move;
    if (sliderModelData.orientation == "row") {
        move = Math.round((e.pageX - sliderModelData.started - 16) / sliderModelData.step) * sliderModelData.step;
    } else {
        move = Math.round((e.pageY - sliderModelData.started - 16) / sliderModelData.step) * sliderModelData.step;
    }

    if (move >= 0 && move <= this.sliderModel.size) {
        sliderViewModel.value = Math.floor((sliderModelData.max - sliderModelData.min) * move / sliderModelData.size + sliderModelData.min);
        sliderViewModel.pointerPosition = move + 8;
    } else {
        return;
    }

    this.sliderModel.value = sliderViewModel.value;
    this.sliderModel.pointerPosition = sliderViewModel.pointerPosition;

    this.sliderView.renderMove(sliderViewModel);
}

SliderController.prototype.endDragging = function() {
    this.sliderModel.isDragStarted = false;
}

SliderController.prototype.setMinMax = function(newMin = this.sliderModel.min, newMax = this.sliderModel.max) {

    var checkMin = newMin > this.sliderModel.value,
        checkMax = newMax < this.sliderModel.value;

    this.sliderModel.min = newMin;
    this.sliderModel.max = newMax;

    if (checkMin) {
        this.sliderModel.value = this.sliderModel.min;
        this.sliderView.element.children[1].children[0].children[1].innerHTML = this.sliderModel.min;
    } else if (checkMax) {
        this.sliderModel.value = this.sliderModel.max;
        this.sliderView.element.children[1].children[0].children[1].innerHTML = this.sliderModel.max;
    } else {
        this.sliderModel.pointerPosition = (this.sliderModel.value - this.sliderModel.min) * this.sliderModel.size / (this.sliderModel.max - this.sliderModel.min) + 8;

        this.sliderView.renderMove({
            pointerPosition: this.sliderModel.pointerPosition,
            orientation: this.sliderModel.orientation,
            value: this.sliderModel.value
        });
    }

    this.sliderModel.setStep(this.sliderModel.get("stepValue"));
    this.sliderView.setHudPoints(this.sliderModel.getHudSettings());
}

SliderController.prototype.setOrientation = function(orientation) {
    this.sliderView.element.classList.remove(this.sliderModel.orientation);
    this.sliderModel.orientation = orientation;
    this.sliderView.element.classList.add(this.sliderModel.orientation);

    if (this.sliderModel.orientation == "row") {
        this.sliderView.element.children[1].style.left = this.sliderModel.pointerPosition + "px";
        this.sliderView.element.children[1].style.top = "32px";

        this.sliderView.element.children[1].children[0].children[0].style.borderRight = "5px solid transparent";
        this.sliderView.element.children[1].children[0].children[0].style.borderTop = "4px solid " + this.sliderModel.color;

        this.sliderView.element.children[2].style.left = "16px";

        this.sliderView.element.children[0].children[0].style.width = this.sliderView.element.children[0].children[0].style.height;
        this.sliderView.element.children[0].children[0].style.height = "100%";
    } else {
        this.sliderView.element.children[1].style.top = this.sliderModel.pointerPosition + "px";
        this.sliderView.element.children[1].style.left = "17px";

        this.sliderView.element.children[1].children[0].children[0].style.borderTop = "5px solid transparent";
        this.sliderView.element.children[1].children[0].children[0].style.borderRight = "4px solid " + this.sliderModel.color;

        this.sliderView.element.children[2].style.left = 0;

        this.sliderView.element.children[0].children[0].style.height = this.sliderView.element.children[0].children[0].style.width;
        this.sliderView.element.children[0].children[0].style.width = "100%";
    }
}

SliderController.prototype.set = function(update) {
    var changes = {};
    for (var i = 0; i < Object.keys(update).length; i++) {
        var key = Object.keys(update)[i];
        var parameterIndex,
            fromValue = this.sliderModel.get(key);
            setted = true;
        switch (key) {
            case "min":
                parameterIndex = 0;
                this.setMinMax(parseInt(update[key]), this.sliderModel.get("max"));
                break;
            case "max":
                parameterIndex = 1;
                this.setMinMax(this.sliderModel.get("min"), parseInt(update[key]));
                break;
            case "step":
                parameterIndex = 2;
                this.sliderModel.setStep(parseInt(update[key]));
                break;
            case "startingPoint":
                break;
            case "orientation":
                parameterIndex = 4;
                this.setOrientation(update[key].toLowerCase());
                break;
            case "color":
                parameterIndex = 5;
                this.sliderModel.color = update[key];
                this.sliderView.setColor(this.sliderModel.get("orientation"), update[key]);
                break;
            case "hint":
                parameterIndex = 6;
                this.sliderModel.hint = update[key];
                this.sliderView.displayPart(this.sliderView.element.children[1].children[0], update[key]);
                break;
            case "hud":
                parameterIndex = 7;
                this.sliderModel.hud = update[key];
                this.sliderView.displayPart(this.sliderView.element.children[2], update[key], "flex");
                break;
            case "interval":
                parameterIndex = 8;
                this.sliderModel.interval = update[key];
                this.sliderView.setHudPoints(this.sliderModel.getHudSettings());
                break;
            case "track":
                parameterIndex = 9;
                this.sliderModel.track = update[key];
                this.sliderView.displayPart(this.sliderView.element.children[0].children[0], update[key]);
                break;
            default:
                setted = false;
        }
        if (setted) {
            var _this = this;
            changes[i] = {
                parameter: key,
                parameterIndex: parameterIndex,
                fromValue: fromValue,
                toValue: _this.sliderModel.get(key)
            }
        }
    }
    this.sliderView.element.onChangingParameters(changes);
}