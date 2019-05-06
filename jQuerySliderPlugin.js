(function($) {
	$.fn.AnimateSlider = function(min, max, step = 1, startPoint = min, orientation = "row", mainColor = "#e85f3e", hint = true, hud = true, interval = 5, track = true) {

		this.startDragCheck = false;

		this.each(function() {
			this.onselectstart = function() {
				return false;
			}

			this.min = min;
			this.max = max;
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

			this.setHudPoints = function(int) {
				this.children[2].innerHTML = "";
				for (var i = 0; i < int; i++) {
					$(this.children[2]).append("<div>" + Math.floor(this.min + (this.max-this.min) / (int-1) * i) + "</div>");
				}
			}

			this.set = function(param, value) {
				//console.log(param + ": " + value);

				switch (param) {
					case "min":
						this.min = value;
						break;
					case "max":
						this.max = value;
						break;
					case "step":
						if (this.orientation == "row") {
							this.step = value * parseInt($(this.children[0]).css("width")) / (this.max-this.min);
						} else {
							this.step = value * parseInt($(this.children[0]).css("height")) / (this.max-this.min);
						}
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
						this.setHudPoints(value);
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

			this.setHudPoints(interval);

			this.classList.add(orientation);

			if (this.orientation == "row") {
				this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + this.mainColor + ';"></div>' + min;
				this.step = step * parseInt($(this.children[0]).css("width")) / (max-min);
			} else {
				this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + this.mainColor + ';"></div>' + min;
				this.step = step * parseInt($(this.children[0]).css("height")) / (max-min);
			}

			if (startPoint > min && startPoint <= max) {
				if (this.orientation == "row") {
					this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + this.mainColor + ';"></div>' + startPoint;
					var indent = (startPoint - min) * parseInt($(this.children[0]).css("width")) / (max - min) + 8;
					this.children[1].style.left = indent + "px";
					this.children[0].children[0].style.width = indent + "px";
				} else {
					this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + this.mainColor + ';"></div>' + startPoint;
					var indent = (startPoint - min) * parseInt($(this.children[0]).css("height")) / (max - min) + 8;
					this.children[1].style.top = indent + "px";
					this.children[0].children[0].style.height = indent + "px";
				}
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
						this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + this.mainColor + ';"></div>' + Math.floor((max - min) * move / parseInt($(this.children[0]).css("width")) + min);
						this.children[1].style.left = move + 8 + "px";
						this.children[0].children[0].style.width = move + 8 + "px";
					}
				} else {
					if (move >= 0 && move <= parseInt($(this.children[0]).css("height"))) {
						this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + this.mainColor + ';"></div>' + Math.floor((max - min) * move / parseInt($(this.children[0]).css("height")) + min);
						this.children[1].style.top = move + 2 + "px";
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

$("#default").AnimateSlider(-100, 100);
$(".similarSliders").AnimateSlider(0, 200, 5, 120, "row", "#ff6b6b",  false, true, 4, false);
$("#blueBigSlider").AnimateSlider(200, 500, 100, 250, "row", "#afded7",  true, false, 6, true);
$("#columnSliderOne").AnimateSlider(5, 10, 1, 0, "column", "#8dc79d", true, true, 5, true);
$("#columnSliderTwo").AnimateSlider(10, 200, 2, 100, "column", "#7d4db7", false, true, 2, false);