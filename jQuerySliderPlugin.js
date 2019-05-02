(function($) {
	$.fn.myPlugin = function(min, max, step = 1, startPoint = min, track = true, orientation = "horizontal", hud = true, interval = 4, hint = false) {

		this.startDragCheck = false;
		step *= 260 / (max-min);

		this.each(function(i) {
			this.children[1].children[0].innerHTML = startPoint;
			this.children[1].style.left = (startPoint - min) * 260 / (max - min) + "px";
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

				/*if (!Object.values($(".pointer")).includes(e.target)) {
					this.startDragCheck = false;
					return;
				}*/

				var move = Math.round((e.clientX - this.started - 8) / step) * step;
				if (move >= 0 && move <= 260) {
					this.children[1].children[0].innerHTML = (max - min) * move / 260 + min; //move + min;
					this.children[1].style.left = move + "px";
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

$(".slider").myPlugin(100, 200, 10, 150);