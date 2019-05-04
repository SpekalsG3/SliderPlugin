(function($) {
	$.fn.myPlugin = function(min, max, step = 1, startPoint = min, orientation = "row", mainColor = "#e85f3e", hint = true, hud = true, interval = 5, track = true) {

		this.startDragCheck = false;

		this.each(function() {
			this.onselectstart = function() {
				return false;
			}

			this.classList.add(orientation);

			this.children[0].children[0].style.background = mainColor;
			this.children[1].style.background = mainColor;
			this.children[1].children[0].style.background = mainColor;

			this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + mainColor + ';"></div>' + min;
			this.step = step * parseInt($(this.children[0]).css("width")) / (max-min);

			if (startPoint > min && startPoint < max) {
				this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + mainColor + ';"></div>' + startPoint;
				var indent = (startPoint - min) * parseInt($(this.children[0]).css("width")) / (max - min) + 8;
				this.children[1].style.left = indent + "px";
				this.children[0].children[0].style.width = indent + "px";
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

			this.started = $(this).position().left;
			this.startDragCheck = true;
		});

		this.mousemove(function(e) {
			if (this.startDragCheck) {
				var move = Math.round((e.clientX - this.started - 16) / this.step) * this.step;
				
				if (move >= 0 && move <= parseInt($(this.children[0]).css("width"))) {
					this.children[1].children[0].innerHTML = '<div style="border-top: 4px solid ' + mainColor + ';"></div>' + Math.floor((max - min) * move / parseInt($(this.children[0]).css("width")) + min);
					this.children[1].style.left = move + 8 + "px";
					this.children[0].children[0].style.width = move + 8 + "px";
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

$("#default").myPlugin(0, 1000);
$(".similarSliders").myPlugin(0, 200, 5, 120, "row", "#ff6b6b",  true, false, 4, true);
$("#blueBigSlider").myPlugin(200, 500, 100, 250, "row", "#afded7",  true, true, 6, true);