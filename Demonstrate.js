$("#default").AnimateSlider();
$(".similarSliders").AnimateSlider({
	min: 0,
	max: 200,
	step: 5,
	startingPoint: 120,
	color: "#ff6b6b",
	hint: false,
	interval: 4,
	track: false});
$("#blueBigSlider").AnimateSlider({
	min: 200,
	max: 500,
	step: 100,
	startingPoint: 250,
	color: "#afded7",
	hud: false,
	interval: 6});
$("#columnSliderOne").AnimateSlider({
	min: 5,
	max: 10,
	startingPoint: 0,
	orientation: "column",
	color: "#8dc79d"});
$("#columnSliderTwo").AnimateSlider({
	min: 10,
	max: 200,
	step: 2,
	startingPoint: 100,
	orientation: "column",
	color: "#7d4db7",
	hint: false,
	interval: 2,
	track: false});

var sliders = document.getElementsByClassName("slider"),
	settings = document.getElementsByClassName("settings"),
	options = document.getElementsByClassName("options");

var keys = ["min", "max", "step", "startPoint", "orientation", "mainColor", "hint", "hud", "interval", "track"],
	values = {},
	prev = [],
	thisI = 1,
	setI = 1;

for (var i = 0; i < options[0].children.length; i++) {
	values[options[0].children[i].value] = i;
}

for (var i = 0; i < options.length; i++) {
	prev[i] = settings[i].children[0];

	for (var j = 0; j < settings[i].children.length; j++) {
		settings[i].children[j].children[0].oninput = function() {
			thisI = this.parentNode.parentNode.parentNode.getAttribute("tab");
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
		thisI = parseInt(this.parentNode.getAttribute("tab"));
		setI = values[this.value];

		prev[thisI].style.display = "none";
		prev[thisI] = settings[thisI].children[setI];
		settings[thisI].children[setI].style.display = "block";
	}


}