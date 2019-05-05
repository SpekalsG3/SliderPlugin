var sliders = document.getElementsByClassName("slider"),
	settings = document.getElementsByClassName("settings"),
	options = document.getElementsByClassName("options");

var values = {},
	prev = [];

for (var i = 0; i < options[0].children.length; i++) {
	values[options[0].children[i].value] = i;
}

for (var i = 0; i < options.length; i++) {
	prev[i] = settings[i].children[0];

	for (var j = 0; j < settings[i].children.length; j++) {
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

	options[i].onchange = function(e) {
		var thisI = parseInt(this.getAttribute("tab")),
			setI = values[this.value];
		prev[thisI].style.display = "none";
		prev[thisI] = settings[thisI].children[setI];
		settings[thisI].children[setI].style.display = "block";
	}
}