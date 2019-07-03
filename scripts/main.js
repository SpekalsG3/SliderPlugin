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