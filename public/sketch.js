var socket = io.connect("localhost:3000");
let allCharacters = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
let midiArray = [];
let characterToMidi;
var textString = 'type & submit to make music';
let sprites = [];
var iter = 0;

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function setup() {
	createCanvas(500, 500);
	characterToMidi = createVector(0,0);
	//create DOM elements
	input = createInput('type & submit to make music');
	inputToString();
	input.size(width/2,16)
	input.position(0,0);
	submit = createButton('submit');
	submit.position(input.width, 0)
	submit.mouseClicked(inputToString);
	slider = createSlider(50, 500, 200);
	slider.changed(reportVal);
	slider.position(width - width/4,0);
	//assign a midi note to each character
	midiArray = ['36', '38', '40', '43', '45', '48', '50', '52', '55', '57', '60', '62', '64', '67', '69', '72', '74', '76', '79', '81', '84', '86', '88', '91', '93', '96', '98']
	characterToMidi.x = shuffleArray(midiArray);
	characterToMidi.y = allCharacters.split('');
	//initialize array of sprites and create a new one on each 'beat' message
	sprites = [];
	socket.on('beat', createSprite);
}

//match characters in input element corresponding midi notes and replace
function inputToString(){
	let outputArray = [];
	textString = input.value().toString().replace(/["'.,\/#!$%\^&\*;:{}=\-_`~()]\s/g,'').replace(/\s/g, '').split('');
	for (var i = 0; i < textString.length; i++) {
		for (var j=0;j < characterToMidi.y.length; j++){	
			if (textString[i] == characterToMidi.y[j]) {
				outputArray[i] = characterToMidi.x[j];
			}
			if (j>=characterToMidi.y.length-1){
				socket.emit('note', outputArray);
			}
		}
	}
}
//send slider value to server on change
function reportVal(){
	var val = slider.value();
	socket.emit('report', val);
}
//create new sprite 
function createSprite(){
	background(255);
	for (var i = 0; i < sprites.length; i++) {
 		if (iter<510) iter++;
 		else iter = 0;
		sprites[i].update(iter);
		sprites[i].display();
	}
	sprites.push(new Sprite);
	if (sprites.length > textString.length) sprites = sprites.splice(0,0);
	textSize(16);
	fill(0);
	text('speed', width - width/6-5, 30);
}

//initialize sprite class so each new sprite
//spawns at a random location w/ a random fill color
//and so each sprite shrinks and loses opacity over time
class Sprite{
	constructor(){
		this.pos = createVector(random(width/2-width/4,width/2+width/4), random(height/2+height/4,height/2-height/4));
		this.r = random(100);
		this.g = random(100);
		this.color = color(this.r, this.g, 255,255);
		this.radius = random(100);
	}

	update(i){
		this.radius = 510 - i;
		this.color = color(this.r,this.g,255,i/2);
	}

	display(){
		noStroke();
		fill(this.color);
		ellipse(this.pos.x,this.pos.y,this.radius, this.radius);
	}

}
