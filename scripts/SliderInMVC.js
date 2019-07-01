(function($) {

    $.fn.AnimateSlider = function(parameters = {}) {
        var _this = this;

        for (var i = 0; i < this.length; i++) {
            var model = new SliderModel(parameters),
                view = new SliderView(this[i]);

            _this.controller = new SliderController(view, model);
        }

        this.get = function(value) {
            return _this.controller.sliderModel.get(value);
        }

        this.set = function(update) {
            if (_this.onChangingParameters != function(){}) {
                _this.controller.sliderView.element.onChangingParameters = _this.onChangingParameters;
            }
            _this.controller.set(update);
        }

        this.onChangingParameters = function(){}
        return this;
    }

})(jQuery);


function Event() {
    this.listeners = [];
}

Event.prototype.add = function(listener) {
    this.listeners.push(listener);
}

Event.prototype.manage = function(args = {}) {
    for (var i = 0; i < this.listeners.length; i++) {
        return this.listeners[i](args);
    }
}



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
        this.sliderModel.pointerPosition = (this.sliderModel.pointerPosition - this.sliderModel.min) * this.sliderModel.size / (this.sliderModel.max - this.sliderModel.min) + 8;
    } else {
        this.sliderModel.size = parseInt($(this.sliderView.element.children[0]).css("height"));
        this.sliderModel.pointerPosition = (this.sliderModel.pointerPosition - this.sliderModel.min) * this.sliderModel.size / (this.sliderModel.max - this.sliderModel.min) + 8;
    }

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
        orientation: sliderModelData.orientation
    };

    var move;
    if (sliderModelData.orientation == "row") {
        move = Math.round((e.pageX - sliderModelData.started - 16) / sliderModelData.step) * sliderModelData.step;
    } else {
        move = Math.round((e.pageY - sliderModelData.started - 10) / sliderModelData.step) * sliderModelData.step;
    }

    if (move >= 0 && move <= this.sliderModel.size) {
        if (sliderModelData.orientation == "row") {
                sliderViewModel.value = Math.floor((sliderModelData.max - sliderModelData.min) * move / this.sliderModel.size + sliderModelData.min);
                    sliderViewModel.pointerPosition = move + 8;
        } else {
                sliderViewModel.value = Math.floor((sliderModelData.max - sliderModelData.min) * move / this.sliderModel.size + sliderModelData.min);
                    sliderViewModel.pointerPosition = move + 2;
        }
    } else {
        return;
    }

    this.sliderModel.value = sliderViewModel.value;
    this.sliderModel.pointerPosition  = sliderViewModel.pointerPosition;

    this.sliderView.renderMove(sliderViewModel);
}

SliderController.prototype.endDragging = function() {
    this.sliderModel.startDragCheck = false;
}

SliderController.prototype.setMinMax = function(newMin = this.sliderModel.min, newMax = this.sliderModel.max) {
    //var checkMin = (this.sliderModel.pointerPosition + this.sliderModel.step * (newMin > this.sliderModel.min) > 8),
    //  checkMax = (this.sliderModel.pointerPosition + this.sliderModel.step * (newMax > this.sliderModel.max) < this.sliderModel.size + 8);

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
        this.sliderView.element.children[1].style.top = this.sliderModel.pointerPosition - 6 + "px";
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
        console.log(e)
        if (Object.values($(".pointer")).includes(e.target)) {
            _this.onStartDraggingPointer.manage(e);
        } else if (Object.values($(".bar")).includes(e.path[0]) || Object.values($(".bar")).includes(e.path[1])) {
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


function SliderModel(params) {
    this.min =          params.min                      ? params.min            : 0;
    this.max =          params.max                      ? params.max            : 100;
    this.step =         params.step > 0                 ? params.step           : 1;
    this.startingPoint= params.startingPoint            ? params.startingPoint  : this.min;
    this.orientation =  params.orientation == "column"  ? "column"              : "row";
    this.color =        params.color                    ? params.color          : "#e85f3e";
    this.hint =         params.hint != undefined        ? params.hint           : true;
    this.hud =          params.hud != undefined         ? params.hud            : true;
    this.interval =     params.interval                 ? params.interval       : 5;
    this.track =        params.track != undefined       ? params.track          : true;

    this.size = null;
    this.stepValue = this.step;
    this.started = null;
    this.pointerPosition = this.startingPoint;
    this.value = this.startingPoint;
    this.startDragCheck = false;
}

SliderModel.prototype.setStep = function(value) {
    this.stepValue = value;
    this.step = value * this.size / (this.max - this.min);
}

SliderModel.prototype.get = function(param) {
    return this[param] != undefined ? this[param] : null;
}

SliderModel.prototype.getHudSettings = function() {
    return {
        min: this.min,
        max: this.max,
        interval: this.interval
    }
}

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