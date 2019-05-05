(function($) {
	$.fn.AnimateSlider = function(min, max, step = 1, startPoint = min, orientation = "row", mainColor = "#e85f3e", hint = true, hud = true, interval = 5, track = true) {

		this.startDragCheck = false;

		this.each(function() {
			this.onselectstart = function() {
				return false;
			}

			this.settings = [min, max, step, startPoint, orientation, mainColor, hint, hud,
			interval, track];

			this.classList.add(orientation);

			this.children[0].children[0].style.background = mainColor;
			this.children[1].style.background = mainColor;
			this.children[1].children[0].style.background = mainColor;

			if (orientation == "row") {
				this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + mainColor + ';"></div>' + min;
				this.step = step * parseInt($(this.children[0]).css("width")) / (max-min);
			} else {
				this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + mainColor + ';"></div>' + min;
				this.step = step * parseInt($(this.children[0]).css("height")) / (max-min);
			}

			if (startPoint > min && startPoint < max) {
				if (orientation == "row") {
					this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + mainColor + ';"></div>' + startPoint;
					var indent = (startPoint - min) * parseInt($(this.children[0]).css("width")) / (max - min) + 8;
					this.children[1].style.left = indent + "px";
					this.children[0].children[0].style.width = indent + "px";
				} else {
					this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + mainColor + ';"></div>' + startPoint;
					var indent = (startPoint - min) * parseInt($(this.children[0]).css("height")) / (max - min) + 8;
					this.children[1].style.top = indent + "px";
					this.children[0].children[0].style.height = indent + "px";
				}
			}

			for (var i = 0; i < interval; i++) {
				$(this.children[2]).append("<div>" + Math.floor(min + (max-min) / (interval-1) * i) + "</div>");
			}

			if (hint) {
				this.children[1].children[0].style.display = "block";
			} else {
				this.children[1].children[0].style.display = "none";
			}

			if (track) {
				this.children[0].children[0].style.display = "block";
			} else {
				this.children[0].children[0].style.display = "none";
			}

			if (hud) {
				this.children[2].style.display = "flex";
			} else {
				this.children[2].style.display = "none";
			}
		});

		this.set = function(param, value) {
		}

		this.mousedown(function(e) {
			if (!Object.values($(".pointer")).includes(e.target)) {
				this.startDragCheck = false;
				return;
			}

			if (orientation == "row") {
				this.started = $(this).position().left;
			} else {
				this.started = $(this).position().top;
			}
			this.startDragCheck = true;
		});

		this.mousemove(function(e) {
			if (this.startDragCheck) {
				var move;
				if (orientation == "row") {
					move = Math.round((e.pageX - this.started - 16) / this.step) * this.step;
				} else {
					move = Math.round((e.pageY - this.started - 10) / this.step) * this.step;
				}
				
				if (orientation == "row") {
					if (move >= 0 && move <= parseInt($(this.children[0]).css("width"))) {
						this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + mainColor + ';"></div>' + Math.floor((max - min) * move / parseInt($(this.children[0]).css("width")) + min);
						this.children[1].style.left = move + 8 + "px";
						this.children[0].children[0].style.width = move + 8 + "px";
					}
				} else {
					if (move >= 0 && move <= parseInt($(this.children[0]).css("height"))) {
						this.children[1].children[0].innerHTML = '<div style="border-right: 4px solid ' + mainColor + ';"></div>' + Math.floor((max - min) * move / parseInt($(this.children[0]).css("height")) + min);
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