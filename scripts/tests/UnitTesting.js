var TestsDisplay = document.createElement("div");
TestsDisplay.setAttribute("id", "mocha");
document.body.appendChild(TestsDisplay);

mocha.setup("bdd");

var testSlider = $("#test");
testSlider.AnimateSlider();

var assert = chai.assert;

describe("Getting parameters", function() {

	it ("получить параметр \"max\"", function(){
		assert.equal(testSlider.get("max"), 100);
	});
	it ("получить параметр \"orientation\"", function(){
		assert.equal(testSlider.get("orientation"), "row");
	});
	it ("получить параметр \"color\"", function(){
		assert.equal(testSlider.get("color"), "#e85f3e");
	});
	it ("получить параметр \"hud\"", function(){
		assert.equal(testSlider.get("hud"), true);
	});
	it ("получить несуществующий параметр ", function(){
		assert.equal(testSlider.get("unknown"), null);
	});

});

describe("Setting parameters", function() {

	it ("установить параметр \"min\"", function(){
		testSlider.set( {"min": 50} );
		assert.equal(testSlider.get("min"), 50);
		assert.equal(testSlider[0].children[1].children[0].children[1].innerHTML, "50");
	});
	it ("установить параметр \"orientation\"", function(){
		testSlider.set( {"orientation": "column"} );
		assert.equal(testSlider.get("orientation"), "column");
	});
	it ("установить параметр \"color\"", function(){
		testSlider.set( {"color": "#d99ae2"} );
		assert.equal(testSlider.get("color"), "#d99ae2");
		assert.equal($(testSlider[0].children[1]).css("background-color"), "rgb(217, 154, 226)");
		assert.equal($(testSlider[0].children[1].children[0]).css("background-color"), "rgb(217, 154, 226)");
		assert.equal($(testSlider[0].children[1].children[0].children[0]).css("border-right"), "4px solid rgb(217, 154, 226)");
	});
	it ("установить параметр \"hud\"", function(){
		testSlider.set( {"hud": false} );
		assert.equal(testSlider.get("hud"), false);
	});
	it ("установить несуществующий параметр ", function(){
		testSlider.set( {"unknown": 100} );
		assert.equal(testSlider.get("unknown"), null);
	});
	it ("установить параметр \"interval\" и несуществующий параметр", function(){
		testSlider.set( {"interval": 3, "unknown": 100} );
		assert.equal(testSlider.get("unknown"), null);
		assert.equal(testSlider.get("unknown"), null);
	});

});

mocha.run();