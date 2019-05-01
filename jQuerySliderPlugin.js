(function($) {
	$.fn.myPlugin = function(min, max, step = 1, startPoint = 0, track = true, orientation = "horizontal", hud = true, interval = 4, hint = false) {

		this.startDragCheck = false;

		$(this)[0].children[1].children[0].innerHTML = startPoint;

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

				var move = Math.floor((e.clientX - this.started - 8) / step) * step;
				if (move >= 0 && move <= 260) {
					this.children[1].children[0].innerHTML = move;
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

$(".slider").myPlugin(0, 260, 10);