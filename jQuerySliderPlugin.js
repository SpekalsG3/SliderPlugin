(function($) {
	$.fn.myPlugin = function(min, max, step = 1, startPoint = min, orientation = "horizontal", hint = false, hud = true, interval = 4, track = true) {

		this.startDragCheck = false;

		this.each(function() {
			this.children[1].children[0].innerHTML = startPoint;
			this.step = step * parseInt($(this.children[0]).css("width")) / (max-min);
			if (startPoint > min && startPoint <= max) {
				var indent = (startPoint - min) * parseInt($(this.children[0]).css("width")) / (max - min);
				this.children[1].style.left = indent + "px";
				this.children[0].children[0].style.width = indent + "px";
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
		});

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
				var move = Math.round((e.clientX - this.started - 8) / this.step) * this.step;
				
				if (move >= 0 && move <= parseInt($(this.children[0]).css("width"))) {
					this.children[1].children[0].innerHTML = (max - min) * move / parseInt($(this.children[0]).css("width")) + min;
					this.children[1].style.left = move + "px";
					this.children[0].children[0].style.width = move + "px";
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

$(".slider").myPlugin(100, 200, 10, 120, "horizontal", true, true, 4, true);