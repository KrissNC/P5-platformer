import {VirtualConsole, PIXEL_TYPE} from './VirtualConsole.js'
import {Plateformer} from './Plateformer.js'


let vs
let game

let myFont

function preload() {
}

/*
function setup() {
  fill('#ED225D');
  textFont(myFont);
  textSize(36);
  text('p5*js', 10, 50);
}
*/

function setup() {
  
  createCanvas(1200,768);
  noSmooth();
  setAttributes('antialias', true);

  vs = new VirtualConsole(160,96, 8, 8, 'Roboto Mono', 8)
  // these are OK
  //vs = new VirtualConsole(160, 120, 4, 6, 'Courier Prime', 8)
  // vs = new VirtualConsole(160, 120, 4, 9, 'Consolas',8)

//  vs.setOriginX(20)
//  vs.setOriginY(10)
  vs.setBg('darkblue')
  
  /*
  vs.textFill(0,0,0,0, PIXEL_TYPE.PIXEL_SOLID ,'orange')
  vs.textFill(0,1,0,1, PIXEL_TYPE.PIXEL_SOLID ,'green')
  
  vs.textFill(8,1,10,1, PIXEL_TYPE.PIXEL_SOLID ,'lightblue')
  vs.textFill(8,2,10,2, PIXEL_TYPE.PIXEL_SOLID ,'yellow')
  vs.textFill(8,3,10,4, 'A','white')
  vs.textFill(8,5,10,6, 'B' ,'white')
  */
  /*
  for (let i=0;i<10; i++) {
    vs.gotoXY(i,i)
    vs.putchar(PIXEL_TYPE.PIXEL_SOLID)
  }
  */

  
  game = new Plateformer(vs)
  game.start();


  //game.onUserUpdate()
  //noLoop()
  
}

function draw() {
  //background(128)
  //vs.draw()
  game.onUserUpdate()
  game.draw()
}

window.preload=preload
window.setup = setup
window.draw = draw

/* function mousePressed() {
  noLoop();
}

function mouseReleased() {
  loop();
} */