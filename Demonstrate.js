var sliders = document.getElementsByClassName("slider"),
	settings = document.getElementsByClassName("settings"),
	options = document.getElementsByClassName("options");

var keys = ["min", "max", "step", "startPoint", "orientation", "mainColor", "hint", "hud", "interval", "track"],
	values = {},
	prev = [],
	thisI = 0,
	setI = 0;

for (var i = 0; i < options[0].children.length; i++) {
	values[options[0].children[i].value] = i;
}

for (var i = 0; i < options.length; i++) {
	prev[i] = settings[i].children[0];

	for (var j = 0; j < settings[i].children.length; j++) {
		settings[i].children[j].children[0].oninput = function() {
			if (this.getAttribute("type") == "checkbox") {
				sliders[thisI].set(keys[setI], this.checked);
			} else {
				sliders[thisI].set(keys[setI], this.value);
			}
		}

		switch (settings[i].children[j].children[0].getAttribute("type")) {
			case "number":
			case "color":
				settings[i].children[j].children[0].value = sliders[i].settings[j];
				break;
			case "checkbox":
				if (sliders[i].settings[j]) {
					settings[i].children[j].children[0].setAttribute("checked","");
				}
				break;
			case null:
				if (sliders[i].settings[j] == "row") {
					settings[i].children[j].children[0].children[0].setAttribute("selected", "");
				} else {;
					settings[i].children[j].children[0].children[1].setAttribute("selected", "");
				}
				break;
		}
	}

	settings[i].children[0].style.display = "block";

	options[i].oninput = function(e) {
		thisI = parseInt(this.getAttribute("tab"));
		setI = values[this.value];

		prev[thisI].style.display = "none";
		prev[thisI] = settings[thisI].children[setI];
		settings[thisI].children[setI].style.display = "block";
	}


}