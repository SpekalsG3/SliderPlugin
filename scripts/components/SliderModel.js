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
    this.isDragStarted = false;
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
        size: this.size,
        pointerPosition: this.pointerPosition
    };
}