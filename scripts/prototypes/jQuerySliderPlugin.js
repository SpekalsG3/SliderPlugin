(function($) {
    $.fn.AnimateSlider = function(min, max, step = 1, startPoint = min, orientation = "row", mainColor = "#e85f3e", hint = true, hud = true, interval = 5, track = true) {

        this.isDragStarted = false;

        this.each(function() {
            this.onselectstart = function() {
                return false;
            }

            this.value = startPoint;
            this.stepValue = step;

            this.min = min;
            this.max = max;
            if (orientation == "row") {
                this.pointerPosition = (startPoint - this.min) * parseInt($(this.children[0]).css("width")) / (this.max - this.min) + 8;
            } else {
                this.pointerPosition = (startPoint - this.min) * parseInt($(this.children[0]).css("height")) / (this.max - this.min) + 8;
            }
            this.orientation = orientation;

            this.setColor = function(color) {
                this.children[0].children[0].style.background = color;
                this.children[1].style.background = color;
                this.children[1].children[0].style.background = color;

                if (orientation == "row") {
                    this.children[1].children[0].children[0].style.borderTop = "4px solid" + color;
                    this.children[1].children[0].children[0].style.borderRight = "5px solid transparent";
                } else {
                    this.children[1].children[0].children[0].style.borderRight = "4px solid" + color;
                    this.children[1].children[0].children[0].style.borderTop = "5px solid transparent";
                }

                this.mainColor = color;
            }

            this.displayPart = function(el, flag, displayType = "block") {
                if (flag) {
                    el.style.display = displayType;
                } else {
                    el.style.display = "none";
                }
            }

            this.setHudPoints = function() {
                this.children[2].innerHTML = "";
                for (var i = 0; i < this.interval; i++) {
                    $(this.children[2]).append("<div>" + Math.floor(this.min + (this.max-this.min) / (this.interval-1) * i) + "</div>");
                }
            }

            this.setStep = function(value = this.stepValue) {
                this.stepValue = value;
                if (this.orientation == "row") {
                    this.step = value * parseInt($(this.children[0]).css("width")) / (this.max-this.min);
                } else {
                    this.step = value * parseInt($(this.children[0]).css("height")) / (this.max-this.min);
                }
            }

            this.setminMax = function(newmin = this.min, newMax = this.max) {
                var checkmin = (this.pointerPosition + step * (newmin > this.min) > 8),
                    checkMax;

                this.min = newmin;
                this.max = newMax;

                if (this.orientation == "row") {
                    checkMax = (this.pointerPosition + step * (newMax > this.max) < parseInt($(this.children[0]).css("width")) + 8);

                    this.pointerPosition = (this.value - this.min) * parseInt($(this.children[0]).css("width")) / (this.max - this.min) + 8;

                    if (checkmin && checkMax) {
                        this.children[0].children[0].style.width = this.pointerPosition + "px";
                        this.children[1].style.left = this.pointerPosition + "px";
                    } else if (checkMax) {
                        this.children[1].children[0].children[1].innerHTML = this.min;
                    } else if (checkmin) {
                        this.children[1].children[0].children[1].innerHTML = this.max;
                    }
                } else {
                    checkMax = (this.pointerPosition + step * (newMax > this.max) < parseInt($(this.children[0]).css("height")) + 8);

                    this.pointerPosition = (this.value - this.min) * parseInt($(this.children[0]).css("height")) / (this.max - this.min) + 8;

                    if (checkmin && checkMax) {
                        this.children[0].children[0].style.height = this.pointerPosition + "px";
                        this.children[1].style.top = this.pointerPosition + "px";
                    } else if (checkMax) {
                            this.children[1].children[0].children[1].innerHTML = this.min;
                    } else if (checkmin) {
                        this.children[1].children[0].children[1].innerHTML = this.max;
                    }
                }
                this.setStep();
                this.setHudPoints();
            }

            this.updateOrientation = function(orientation) {
                this.classList.remove(this.orientation);
                this.orientation = orientation;
                this.classList.add(this.orientation);

                if (this.orientation == "row") {
                    this.children[1].style.left = this.pointerPosition + "px";
                    this.children[1].style.top = "32px";

                    this.children[1].children[0].children[0].style.borderTop = "5px solid transparent";
                    this.children[1].children[0].children[0].style.borderRight = "4px solid " + this.mainColor;

                    this.children[0].children[0].style.width = this.children[0].children[0].style.height;
                    this.children[0].children[0].style.height = "100%";
                } else {
                    this.children[1].style.top = this.pointerPosition - 6 + "px";
                    this.children[1].style.left = "17px";

                    this.children[1].children[0].children[0].style.borderRight = "5px solid transparent";
                    this.children[1].children[0].children[0].style.borderTop = "4px solid " + this.mainColor;

                    this.children[0].children[0].style.height = this.children[0].children[0].style.width;
                    this.children[0].children[0].style.width = "100%";
                }
            }

            this.set = function(param, value) {
                //console.log(param + ": " + value);

                switch (param) {
                    case "min":
                        this.setminMax(parseInt(value), this.max);
                        break;
                    case "max":
                        this.setminMax(this.min, parseInt(value));
                        break;
                    case "step":
                        this.setStep(parseInt(value));
                        break;
                    case "startPoint":
                        break;
                    case "orientation":
                        this.updateOrientation(value.toLowerCase());
                        break;
                    case "mainColor":
                        this.setColor(value);
                        break;
                    case "hint":
                        this.displayPart(this.children[1].children[0], value);
                        break;
                    case "hud":
                        this.displayPart(this.children[2], value, "flex");
                        break;
                    case "interval":
                        this.interval = value;
                        this.setHudPoints();
                        break;
                    case "track":
                        this.displayPart(this.children[0].children[0], value);
                        break;

                }
            }

            this.settings = [min, max, step, startPoint, orientation, mainColor, hint, hud, interval, track];

            this.setColor(mainColor);

            this.displayPart(this.children[1].children[0], hint);
            this.displayPart(this.children[2], hud, "flex");
            this.displayPart(this.children[0].children[0], track);

            this.interval = interval;
            this.setHudPoints();

            this.classList.add(orientation);

            if (this.orientation == "row") {
                this.children[1].children[0].children[1].innerHTML = this.min;
            } else {
                this.children[1].children[0].children[1].innerHTML = this.min;
            }
            this.setStep(step);

            if (startPoint > this.min && startPoint <= this.max) {
                if (this.orientation == "row") {
                    this.children[1].children[0].children[1].innerHTML = startPoint;
                    this.pointerPosition = (this.value - this.min) * parseInt($(this.children[0]).css("width")) / (this.max - this.min) + 8;
                    this.children[0].children[0].style.width = this.pointerPosition + "px";
                    this.children[1].style.left = this.pointerPosition + "px";
                } else {
                    this.children[1].children[0].children[1].innerHTML = startPoint;
                    this.pointerPosition = (this.value - this.min) * parseInt($(this.children[0]).css("height")) / (this.max - this.min) + 8;
                    this.children[0].children[0].style.height = this.pointerPosition + "px";
                    this.children[1].style.top = this.pointerPosition + "px";
                }
                this.setStep();
                this.setHudPoints();
            }
        });

        this.mousedown(function(e) {
            if (!Object.values($(".pointer")).includes(e.target)) {
                this.isDragStarted = false;
                return;
            }

            if (this.orientation == "row") {
                this.started = $(this).position().left;
            } else {
                this.started = $(this).position().top;
            }
            this.isDragStarted = true;
        });

        this.mousemove(function(e) {
            if (this.isDragStarted) {
                var move;
                if (this.orientation == "row") {
                    move = Math.round((e.pageX - this.started - 16) / this.step) * this.step;
                } else {
                    move = Math.round((e.pageY - this.started - 10) / this.step) * this.step;
                }
                
                if (this.orientation == "row") {
                    if (move >= 0 && move <= parseInt($(this.children[0]).css("width"))) {
                        this.value = Math.floor((this.max - this.min) * move / parseInt($(this.children[0]).css("width")) + this.min);
                        this.pointerPosition = move + 8;
                        this.children[1].children[0].children[1].innerHTML = this.value;
                        this.children[1].style.left = this.pointerPosition + "px";
                        this.children[0].children[0].style.width = move + "px";
                    }
                } else {
                    if (move >= 0 && move <= parseInt($(this.children[0]).css("height"))) {
                        this.value = Math.floor((this.max - this.min) * move / parseInt($(this.children[0]).css("height")) + this.min);
                        this.pointerPosition = move + 2;
                        this.children[1].children[0].children[1].innerHTML = this.value;
                        this.children[1].style.top = this.pointerPosition + "px";
                        this.children[0].children[0].style.height = move + "px";
                    }
                }
            }
        });

        this.mouseup(function() {
            this.isDragStarted = false;
        });
        this.mouseleave(function() {
            this.isDragStarted = false;
        });

    }
})(jQuery);