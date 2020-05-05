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
    
    this.setInk('white') // Defaults
    this.setBg('black')

    this.nbElems = this.nbCols * this.nbLines
    this.inks = new Array(this.nbElems)
    this.bgs  = new Array(this.nbElems)
    this.chars= new Array(this.nbElems)

    this.clear()
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

  clear() {
    this.inks.fill(this.inkC)
    this.bgs.fill(this.backgroundC)
    this.chars.fill(' ')
    this.cursorX = 0 
    this.cursorY = 0 
    this.offSet = 0

  }

  setInk(ink) {
    this.inkC=ink
  }

  setBg(bg) {
    this.backgroundC=bg
    // this.bgs && this.bgs.fill(this.backgroundC)
  }

  // rectangle filling with a char and ink
  textFill(x1, y1, x2, y2, chr, ink)
  {
//    console.log("filling " , x1, y1, x2, y2, chr, ink)
//    console.log("offSet is : ", this.offSet)

    for(let y=y1 ; y <= y2 ; y++) {
      this.gotoXY(x1,y)
//      console.log("inside loop offSet is : ", this.offSet)
      for(let x=x1; x <= x2; x++) {
        //console.log(this.offSet)
        this.chars[this.offSet] = chr
        this.inks[this.offSet]  = ink
        this.bgs[this.offSet++] = this.backgroundC
      }
//      console.log("inside2 loop offSet is : ", this.offSet)
//      console.log ("(x=",this.cursorX,"), (y=", this.cursorY,")")
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

  ConsoleHeight() {
    return this.H * this.nbLines
  }

  draw()   {
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
    //stroke('white'); // Change the color ofr the point if any
    //noStroke() // 
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
  } // end draw


}

export const PIXEL_TYPE = {
	PIXEL_SOLID : '\u2588',
	PIXEL_THREEQUARTERS : '\u2593',
	PIXEL_HALF : '\u2592',
	PIXEL_QUARTER : '\u2591'
}