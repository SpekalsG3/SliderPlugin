var TestsDisplay = document.createElement("div");
TestsDisplay.setAttribute("id", "mocha");
document.body.appendChild(TestsDisplay);

mocha.setup("bdd");

var $testSlider = $("#test");
$testSlider.AnimateSlider();

var assert = chai.assert;

describe("Получение параметров", function() {

    it ("получить параметр \"max\"", function(){
        assert.equal($testSlider.get("max"), 100);
    });
    it ("получить параметр \"orientation\"", function(){
        assert.equal($testSlider.get("orientation"), "row");
    });
    it ("получить параметр \"color\"", function(){
        assert.equal($testSlider.get("color"), "#e85f3e");
    });
    it ("получить параметр \"hud\"", function(){
        assert.equal($testSlider.get("hud"), true);
    });
    it ("получить несуществующий параметр ", function(){
        assert.equal($testSlider.get("unknown"), null);
    });

});

describe("Установка параметров", function() {

    it ("установить параметр \"min\"", function(){
        $testSlider.set( {"min": 50} );
        assert.equal($testSlider.get("min"), 50);
        assert.equal($testSlider[0].children[1].children[0].children[1].innerHTML, "50");
    });
    it ("установить параметр \"orientation\"", function(){
        $testSlider.set( {"orientation": "column"} );
        assert.equal($testSlider.get("orientation"), "column");
    });
    it ("установить параметр \"color\"", function(){
        $testSlider.set( {"color": "#d99ae2"} );
        assert.equal($testSlider.get("color"), "#d99ae2");
        assert.equal($($testSlider[0].children[1]).css("background-color"), "rgb(217, 154, 226)");
        assert.equal($($testSlider[0].children[1].children[0]).css("background-color"), "rgb(217, 154, 226)");
        assert.equal($testSlider[0].children[1].children[0].children[0].style.borderRight, "4px solid rgb(217, 154, 226)");
    });
    it ("установить параметр \"hud\"", function(){
        $testSlider.set( {"hud": false} );
        assert.equal($testSlider.get("hud"), false);
    });
    it ("установить несуществующий параметр ", function(){
        $testSlider.set( {"unknown": 100} );
        assert.equal($testSlider.get("unknown"), null);
    });
    it ("установить параметр \"interval\" и несуществующий параметр", function(){
        $testSlider.set( {"interval": 3, "unknown": 100} );
        assert.equal($testSlider.get("unknown"), null);
        assert.equal($testSlider.get("unknown"), null);
    });

});

describe("Обработчик установки параметров", function() {
    var update;

    it("установить обработчик", function() {
        $testSlider.onChangingParameters = function(_update) {
            update = _update;
        }
        $testSlider.set( {min: 10} );
        assert.notEqual(update[0], undefined);
        assert.equal(update[0].parameter, "min");
        assert.equal(update[0].parameterIndex, 0);
        assert.equal(update[0].fromValue, 50);
        assert.equal(update[0].toValue, 10);
        assert.equal(settings[6].children[0].children[0].value, 0);
    });

    it("обработчик с обновлением конфига", function() {
        $testSlider.onChangingParameters = function(_update) {
            update = _update;
            for (var i = 0; i < Object.keys(update).length; i++) {
                var obj = update[Object.keys(update)[i]];
                var el = settings[Object.values(sliders).indexOf(this)].children[obj.parameterIndex].children[0];
                switch (obj.parameter) {
                    case "hint":
                    case "hud":
                    case "track":
                        if (obj.toValue) {
                            el.setAttribute("checked", "");
                        } else {
                            el.removeAttribute("checked", "");
                        }
                        break;
                    case "orientation":
                        if (obj.toValue == "row") {
                            el.children[1].removeAttribute("selected");
                            el.children[0].setAttribute("selected", "");
                        } else {
                            el.children[0].removeAttribute("selected");
                            el.children[1].setAttribute("selected", "");
                        }
                        break;
                    default:
                        el.value = obj.toValue;
                        break;
                }
            }
        }
        $testSlider.set( {orientation: "row", min: 50} );
        assert.notEqual(update[0], undefined);
        assert.notEqual(update[1], undefined);
        assert.equal(update[0].parameter, "orientation");
        assert.equal(update[0].parameterIndex, 4);
        assert.equal(update[0].fromValue, "column");
        assert.equal(update[0].toValue, "row");
        assert.equal(settings[6].children[4].children[0].children[0].getAttribute("selected"), "");
        assert.equal(settings[6].children[4].children[0].children[1].getAttribute("selected"), null);
        assert.equal(update[1].parameter, "min");
        assert.equal(update[1].parameterIndex, 0);
        assert.equal(update[1].fromValue, 10);
        assert.equal(update[1].toValue, 50);
        assert.equal($testSlider.get("min"), 50);
    });

});

describe("Нажатие мышью", function() {

    it("нажатие на подсказку", function() {
        $testSlider[0].onmousedown( {
            target: $testSlider[0].children[1].children[0],
            path: [$testSlider[0], $testSlider[0].children[1], $testSlider[0].children[1].children[0]] } );
        assert.equal($testSlider.get("isDragStarted"), false);
    });

    it("нажатие на полоску", function() {
        $testSlider[0].onmousedown( {
            target: $testSlider[0].children[0],
            path: [$testSlider[0], $testSlider[0].children[0]] } );
        assert.equal($testSlider.get("isDragStarted"), false);
    });

    it("нажатие на указатель", function() {
        $testSlider[0].onmousedown( {name: "tester", target: $testSlider[0].children[1]} );
        assert.equal($testSlider.get("isDragStarted"), true);
    });

});

var lastValue;

describe("Движение мыши", function() {

    it("движение по слайдеру", function() {
        var x = 50;
        $testSlider[0].onmousemove( {pageX: $($testSlider[0].children[0]).position().left + x} );

        lastValue = Math.round(($testSlider.get("max") - $testSlider.get("min")) * Math.round((x) / $testSlider.get("step")) * $testSlider.get("step") / $testSlider.get("size") + $testSlider.get("min"));
        assert.equal($testSlider.get("value"), lastValue);

        x = 100;
        lastValue = $testSlider.get("min") + Math.round(x * ($testSlider.get("max") - $testSlider.get("min")) / $testSlider.get("size"));
        $testSlider[0].onmousemove( {pageX: $($testSlider[0].children[0]).position().left + x} );
        assert.equal($testSlider.get("value"), lastValue);
    });

});

describe("Прекращение движения", function() {

    it("поднятие клавиши мыши", function() {
        assert.equal($testSlider.get("isDragStarted"), true);
        $testSlider[0].onmouseup();
        assert.equal($testSlider.get("isDragStarted"), false);
        $testSlider[0].onmousemove( {pageX: $($testSlider[0].children[0]).position().left + 100} );
        assert.equal($testSlider.get("value"), lastValue);
    });

    it("передвижение ползунка за слайдер", function() {
        $testSlider[0].onmousedown( {name: "tester", target: $testSlider[0].children[1]} );
        assert.equal($testSlider.get("isDragStarted"), true);
        $testSlider[0].onmouseleave();
        assert.equal($testSlider.get("isDragStarted"), false);
        $testSlider[0].onmousemove( {pageX: $($testSlider[0].children[0]).position().left + 100} );
        assert.equal($testSlider.get("value"), lastValue);
    });

});

mocha.run();