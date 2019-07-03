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

var sliders = document.getElementsByClassName("slider");
var settings = document.getElementsByClassName("settings");
var options = document.getElementsByClassName("options");

var settingsList = ["min", "max", "stepValue", "startingPoint", "orientation", "color", "hint", "hud", "interval", "track"];
var possibleSettingValues = {};
var prevSetting = [];
var currentSetting = 0;
var settingValue = 0;

for (var i = 0; i < options[0].children.length; i++) {
    possibleSettingValues[options[0].children[i].value] = i;
}

for (var i = 0; i < options.length; i++) {
    prevSetting[i] = settings[i].children[0];

    options[i].oninput = function(e) {
        currentSetting = parseInt(this.parentNode.getAttribute("data-tab"));
        settingValue = possibleSettingValues[this.value];

        prevSetting[currentSetting].style.display = "none";
        prevSetting[currentSetting] = settings[currentSetting].children[settingValue];
        settings[currentSetting].children[settingValue].style.display = "block";
    }

    for (var j = 0; j < settings[i].children.length; j++) {
        settings[i].children[j].children[0].oninput = function() {
            currentSetting = this.parentNode.parentNode.parentNode.getAttribute("data-tab");
            if (this.getAttribute("type") == "checkbox") {
                sliders[currentSetting].set(JSON.parse('{"' + settingsList[settingValue] + '": ' + this.checked + '}'));
            } else if (this.getAttribute("type") == null) {
                sliders[currentSetting].set(JSON.parse('{"' + settingsList[settingValue] + '": "' + this.value.toLowerCase() + '"}'));
            } else {
                sliders[currentSetting].set(JSON.parse('{"' + settingsList[settingValue] + '": ' + this.value + '}'));
            }
        }

        switch (settings[i].children[j].children[0].getAttribute("type")) {
            case "number":
            case "color":
                settings[i].children[j].children[0].value = sliders[i].get(settingsList[j]);
                break;
            case "checkbox":
                if (sliders[i].get(settingsList[j])) {
                    settings[i].children[j].children[0].setAttribute("checked","");
                }
                break;
            case null:
                if (sliders[i].get("orientation") == "row") {
                    settings[i].children[j].children[0].children[0].setAttribute("selected", "");
                } else {;
                    settings[i].children[j].children[0].children[1].setAttribute("selected", "");
                }
                break;
        }
    }

    settings[i].children[0].style.display = "block";

    sliders[i].onChangingParameters = function(update) {
        for (var i = 0; i < Object.keys(update).length; i++) {
            var setted = update[Object.keys(update)[i]];
            var effectedSlider = settings[Object.values(sliders).indexOf(this)].children[setted.parameterIndex].children[0];
            switch (setted.parameter) {
                case "hint":
                case "hud":
                case "track":
                    if (setted.toValue) {
                        effectedSlider.setAttribute("checked", "");
                    } else {
                        effectedSlider.removeAttribute("checked", "");
                    }
                    break;
                case "orientation":
                    if (setted.toValue == "row") {
                        effectedSlider.children[1].removeAttribute("selected");
                        effectedSlider.children[0].setAttribute("selected", "");
                    } else {
                        effectedSlider.children[0].removeAttribute("selected");
                        effectedSlider.children[1].setAttribute("selected", "");
                    }
                    break;
                default:
                    effectedSlider.value = setted.toValue;
                    break;
            }
        }
    }
}