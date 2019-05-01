(function($) {
	$.fn.myPlugin = function() {
		console.log(this);
		this.children[1].mousedown(function(e) {
			if (!Object.values($(".pointer")).includes(e.target)) {
				return;
			}

		});
	}
})(jQuery);

$("#slider").myPlugin();