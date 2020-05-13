import { CONSOLE_COLOR, P5COLOR} from "./ConsoleColors.js"

export class VirtualConsole {

  constructor( pCols, pLines, pWi, pHe, pFont, pSize) {

    // Number of text Colums and Lines
    this.nbCols = pCols
    this.nbLines = pLines

    // With and Height of a cell
    this.W = pWi
    this.H = pHe

    // Offset in canvas
    this.originX=0
    this.originY=0

    this.cursorX=0
    this.cursorY=0
    this.offSet=0

    this.inkC=''
    this.backgroundC=''

    this.fontName = pFont
    this.fontSize = pSize

    this.setColorMode(COLORMODE.P5)

    this.setInk('white') // Defaults for P5 color mode : use setink() and clear() to switch to consoleColor mode
    this.setBg('black')

    this.nbElems = this.nbCols * this.nbLines
    this.inks = new Array(this.nbElems)
    this.bgs  = new Array(this.nbElems)
    this.chars= new Array(this.nbElems)

    this.clear()

    this.P5colors = new P5COLOR() 
    
    //console.log(this)
  }

  setXcursor(x) { 
    this.cursorX = x 
    this.offSet = this.cursorY * this.nbCols + x
    } // text cursor

  setYcursor(y) { 
    this.cursorY = y
    this.offSet = this.cursorY * this.nbCols + this.cursorX
  } // text cursor

  gotoXY(x,y) {
    // todo : bound check and default value ?
    /*
    if(x>NBcol) console.log('x out of bounds, setting to max') && x = this.nbCols
    if(y>)
    */
    this.cursorX = x 
    this.cursorY = y 
    this.offSet = this.cursorY * this.nbCols + this.cursorX
    
  }

  setColorMode(mode)
  { // either P5 or Console. Console uses 16 indexed colors as integer,         otherwise standard P5 Color
    if(mode==COLORMODE.CONSOLE){
      console.log("switching to console color mode")
      this.backgroundC=CONSOLE_COLOR.FG_BLACK
      this.inkC=CONSOLE_COLOR.FG_WHITE
      this.ColorMode=mode
      this.draw = this.draw_ConsoleColor; // draw in console mode
    }
    else
    if (mode==COLORMODE.P5) {
      console.log("P5 color mode")
      this.ColorMode=mode
      this.draw=this.draw_P5Color; // draw in P5 mode, with P5 colors
    }
  }

  clear() {
    this.inks.fill(this.inkC)
    this.bgs.fill(this.backgroundC)
    this.chars.fill(' ')
    this.cursorX = 0 
    this.cursorY = 0 
    this.offSet = 0
  }

  setInk(ink) { // these become ineffective when CONSOLECOLOR_MODE is used
    this.inkC=ink
  }

  setBg(bg)   { // these become ineffective when CONSOLECOLOR_MODE is used
    console.log("Setting background to " + bg)

    this.backgroundC=bg
    // this.bgs && this.bgs.fill(this.backgroundC)
  }

  clip(value, min, max )
  {
    if (value < min) return min
    if (value > max) return max
    return value
  }

  // rectangle filling with a char and ink
  textFill(x1, y1, x2, y2, chr, ink)
  {
      x1=this.clip(x1, 0, this.nbCols-1)
      y1=this.clip(y1, 0, this.nbLines-1) 
      x2=this.clip(x2, 0, this.nbCols-1)
      y2=this.clip(y2, 0, this.nbLines-1)

    for(let y=y1 ; y <= y2 ; y++) {
      this.gotoXY(x1,y)
      for(let x=x1; x <= x2; x++) {
        this.chars[this.offSet] = chr
        this.inks[this.offSet]  = ink
        this.bgs[this.offSet++] = this.backgroundC
      }
    }
  }

  putchar(c) {
    this.chars[this.offSet]=c
    this.inks[this.offSet]=this.inkC
    this.bgs[this.offSet++]=this.backgroundC
    if (this.cursorX++ === this.nbCols) {
      this.cursorX=0
      this.cursorY++
      // TODO ,   check for Y too big
    }
    this.offSet = this.cursorY * this.nbCols + this.cursorX
    // TODO check for offset too big 'out of screen')
    
  }

  write(s) {
    for(let i=0,n=s.length; i<n; i++) this.putchar(s.charAt(i))
  }

  writeln(s) {
    this.write(s)
    this.cursorX=0
    this.cursorY++
    this.offSet = this.cursorY * this.nbCols // + this.cursorX
  }

  // pixel Display Origine
  setOriginX(x) {
    this.originX=x
  }

  // pixel Display Origine
  setOriginY(y) {
    this.originY=y
  }

  ConsoleWidth() { // in pixels
    return this.W * this.nbCols
  }

  ConsoleCharWidth() { // in pixels
    return this.nbCols
  }

  ConsoleHeight() {
    return this.H * this.nbLines
  }

  ConsoleCharHeight() {
    return this.nbLines
  }

  draw_ConsoleColor() {
    push()
    noStroke()

    fill(this.P5colors._c(this.backgroundC))    

    rect(this.originX,this.originY, this.nbCols*this.W, this.nbLines*this.H)

    
    textFont(this.fontName)
    textSize(this.fontSize)   

    //console.log("general ink " + this.inkC)
    fill(this.P5colors._c(this.inkC))    

    let currentInk=this.inkC
    let currentBG=this.backgroundC
    let xt,yt
    let c

    for(let i=0,n=this.chars.length; i<n ; i++ ) {

      c=this.chars[i]

      if (c != ' ') {

        if ( this.inks[i] != currentInk ) {

          //console.log("currentInk" + currentInk)
          let col= this.inks[i]
          // console.log("col " + col)
          fill(this.P5colors._c(col))
          currentInk=col

        }

        // text coords scaled to font size
        yt= Math.floor(i/this.nbCols) * this.H
        xt= (i % this.nbCols) * this.W

        if(c=='\u2588') { // draw full rectangle for block
          // A rectangle          
          rect(xt + this.originX, this.originY + yt, this.W, this.H);
        }
        else text(c, xt + this.originX, this.originY + yt + this.H)
        //  point(xt + this.originX, this.originY + yt + this.H)
      } // end if c ' '
    } // end for
    

    pop()
  }
  
  draw_P5Color() {
    push()
    noStroke()
    fill(this.backgroundC)    
    rect(this.originX,this.originY, this.nbCols*this.W, this.nbLines*this.H)

    textFont(this.fontName)
    textSize(this.fontSize)   

    fill(this.inkC)
    let currentInk=this.inkC
    let currentBG=this.backgroundC
    let xt,yt
    let c

    for(let i=0,n=this.chars.length; i<n ; i++ ){
      c=this.chars[i]

      if (c != ' ') {
        if (this.inks[i]!=currentInk) {
          fill(this.inks[i])
          currentInk=this.inks[i]
        }

        // text coords scaled to font size
        yt= Math.floor(i/this.nbCols) * this.H
        xt= (i % this.nbCols) * this.W

        if(c=='\u2588') { // draw full rectangle for block
          // A rectangle          
          rect(xt + this.originX, this.originY + yt, this.W, this.H);
        }
        else text(c, xt + this.originX, this.originY + yt + this.H)
        //  point(xt + this.originX, this.originY + yt + this.H)
      } // end if c ' '
    } // end for
    pop()

  }

}

export const PIXEL_TYPE = {
	PIXEL_SOLID : '\u2588',
	PIXEL_THREEQUARTERS : '\u2593',
	PIXEL_HALF : '\u2592',
	PIXEL_QUARTER : '\u2591'
}

export const COLORMODE = {
	CONSOLE : 0,
  P5 : 1
}
