(function($) {
	$.fn.AnimateSlider = function(min, max, step = 1, startPoint = min, orientation = "row", mainColor = "#e85f3e", hint = true, hud = true, interval = 5, track = true) {

		this.startDragCheck = false;

		this.each(function() {
			this.onselectstart = function() {
				return false;
			}

			this.value = startPoint;
			this.stepValue = step;

			this.min = min;
			this.max = max;
			this.pos = (startPoint - this.min) * parseInt($(this.children[0]).css("width")) / (this.max - this.min) + 8;
			this.orientation = orientation;

			this.setColor = function(color) {
				this.children[0].children[0].style.background = color;
				this.children[1].style.background = color;
				this.children[1].children[0].style.background = color;

				if (this.children[1].children[0].children[0].style.borderTop == "") {
					this.children[1].children[0].children[0].style.borderRight = "4px solid" + color;
				} else {
					this.children[1].children[0].children[0].style.borderTop = "4px solid" + color;
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
				if (this.orientation == "row") {
					this.step = value * parseInt($(this.children[0]).css("width")) / (this.max-this.min);
				} else {
					this.step = value * parseInt($(this.children[0]).css("height")) / (this.max-this.min);
				}
			}

			this.setMinMax = function(newMin, newMax) {
				console.log(this.pos + " " + step);
				var checkMin = (this.pos + step * (newMin > this.min) > 8),
					checkMax = (this.pos + step * (newMax > this.max) < parseInt($(this.children[0]).css("width")) + 8);

				this.min = newMin;
				this.max = newMax;

				if (this.orientation == "row") {
					this.pos = (this.value - this.min) * parseInt($(this.children[0]).css("width")) / (this.max - this.min) + 8;

					if (checkMin && checkMax) {
						this.children[0].children[0].style.width = this.pos + "px";
						this.children[1].style.left = this.pos + "px";
					} else if (checkMax) {
						this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + this.mainColor + ';"></div>' + this.min;
					} else if (checkMin) {
						this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + this.mainColor + ';"></div>' + this.max;
					}
				} else {
					this.pos = (this.value - this.min) * parseInt($(this.children[0]).css("height")) / (this.max - this.min) + 8;

					if (checkMin && checkMax) {
						this.children[0].children[0].style.height = this.pos + "px";
						this.children[1].style.top = this.pos + "px";
					} else if (checkMin) {
							this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + this.mainColor + ';"></div>' + this.min;
					} else if (checkMax) {
						this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + this.mainColor + ';"></div>' + this.max;
					}
				}
				this.setStep();
				this.setHudPoints();
			}

			this.set = function(param, value) {
				//console.log(param + ": " + value);

				switch (param) {
					case "min":
						this.setMinMax(parseInt(value), this.max);
						break;
					case "max":
						this.setMinMax(this.min, parseInt(value));
						break;
					case "step":
						this.setStep(parseInt(value));
						break;
					case "startPoint":
						break;
					case "orientation":
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
				this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + this.mainColor + ';"></div>' + this.min;
			} else {
				this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + this.mainColor + ';"></div>' + this.min;
			}
			this.setStep(step);

			if (startPoint > this.min && startPoint <= this.max) {
				if (this.orientation == "row") {
					this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + this.mainColor + ';"></div>' + startPoint;
				} else {
					this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + this.mainColor + ';"></div>' + startPoint;
				}
				this.setMinMax();
			}
		});

		this.mousedown(function(e) {
			if (!Object.values($(".pointer")).includes(e.target)) {
				this.startDragCheck = false;
				return;
			}

			if (this.orientation == "row") {
				this.started = $(this).position().left;
			} else {
				this.started = $(this).position().top;
			}
			this.startDragCheck = true;
		});

		this.mousemove(function(e) {
			if (this.startDragCheck) {
				var move;
				if (this.orientation == "row") {
					move = Math.round((e.pageX - this.started - 16) / this.step) * this.step;
				} else {
					move = Math.round((e.pageY - this.started - 10) / this.step) * this.step;
				}
				
				if (this.orientation == "row") {
					if (move >= 0 && move <= parseInt($(this.children[0]).css("width"))) {
						this.value = Math.floor((this.max - this.min) * move / parseInt($(this.children[0]).css("width")) + this.min);
						this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + this.mainColor + ';"></div>' + this.value;
						this.children[1].style.left = move + 8 + "px";
						this.pos = move+8;
						this.children[0].children[0].style.width = move + 8 + "px";
					}
				} else {
					if (move >= 0 && move <= parseInt($(this.children[0]).css("height"))) {
						this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + this.mainColor + ';"></div>' + Math.floor((this.max - this.min) * move / parseInt($(this.children[0]).css("height")) + this.min);
						this.children[1].style.top = move + 2 + "px";
						this.pos = move+2;
						this.children[0].children[0].style.height = move + 2 + "px";
					}
				}
			}
		});

		this.mouseup(function() {
			this.startDragCheck = false;
		});
		this.mouseleave(function() {
			this.startDragCheck = false;
		});

	}
})(jQuery);