import {VirtualConsole,PIXEL_TYPE} from './VirtualConsole.js'
let sLevel='';
let nLevelWidth;
let nLevelHeight;

// Player Properties
let fPlayerPosX;
let fPlayerPosY;

let fNewPlayerPosX;
let fNewPlayerPosY;


let fPlayerVelX;
let fPlayerVelY;
let bPlayerOnGround;

// Camera properties
let fCameraPosX;
let fCameraPosY;

let debugMode=true
let debugScreen

export class Plateformer {

    constructor( virtualScreen ) {

    if (debugMode) 
        {
            this.debugScreen = new VirtualConsole(80, 6, 11, 12, 'Roboto Mono', 14)
            console.log(this.debugScreen)

            this.debugScreen.setOriginX(0)
            this.debugScreen.setOriginY(768)
            //this.debugScreen.setBg("lightgrey")
//            this.debugScreen.clear()

        }

    this.Screen= virtualScreen
    
    this.nTileWidth = 8;
    this.nTileHeight = 8;
    
    //debugger;
    /*
    let ScreenWidth = width; // canvas width
    let ScreenHeight = height; // canvas height
*/

    let ScreenWidth = this.Screen.ConsoleCharWidth(); // canvas width
    let ScreenHeight = this.Screen.ConsoleCharHeight();
    

	this.nVisibleTilesX = ScreenWidth / this.nTileWidth;
    this.nVisibleTilesY = ScreenHeight / this.nTileHeight;
    
    this.previousKeycode=0
    //console.log("nVisibleTilesX",this.nVisibleTilesX)
    //console.log("nVisibleTilesY",this.nVisibleTilesY)
    //console.log(this)

    }

    start() {        

    // Level storage
    nLevelWidth = 64;
    nLevelHeight = 16;

    sLevel = ""
    sLevel += "...............................................................#";
    sLevel += "...............................................................#";
    sLevel += "........#####..................................................#";
    sLevel += ".......####....................................................#";
    sLevel += ".......................########................................#";
    sLevel += ".....##########.......###..............#.#....................O#";
    sLevel += "....................###................#.#......................";
    sLevel += "...................####.........................................";
    sLevel += "#####...#######OOO##...#############.##############.....########";
    sLevel += "...................................#.#...............###........";
    sLevel += "...############.........############.#............###...........";
    sLevel += "...#..........#.........#............#.........###..............";
    sLevel += "........................#.############......###.................";
    sLevel += "........................#................###....................";
    sLevel += "........................#################.......................";
    sLevel += "....OOOOO.......................................................";
    
    // Player Properties
	fPlayerPosY = 1.0;
    fPlayerVelX = 0.0;
    
	fPlayerVelY = 0.0;
    fPlayerPosX = 1.0;
    
    bPlayerOnGround = false;
	
	// Camera properties
    fCameraPosX = 0.0;
    fCameraPosY = 0.0;

    }

    onUserCreate() {
        this.start()
    }

    onUserUpdate() {
    // update and draw

    fPlayerVelX = 0.0
    fPlayerVelY = 0.0

    this.Screen.clear()

    // handle input
    // result : this.requestedAction (one letter)
    if (keyIsPressed) {
        this.keyHeld = (keyCode == this.previousKeyCode);
        // this.keyHeld = false;

        switch (keyCode) {

            case 38:
                fPlayerVelY = -6.0
                break;

            case 40:
                fPlayerVelY = 6.0
                //  this.requestedAction = "D"; // accelerate downwards
                //  break;
                break;

            case 37:
                // left
                fPlayerVelX = -6.0
                break;

            case 39:
                // right
                fPlayerVelX = 6.0
                break;
                /*
                            case 32:
                              if (!this.keyHeld) { // if "space" no double jump

                              }
                              break;
                */
                //case 27:
                //  this.requestedAction = "X"; // exit
                //  break;
            default:
        }
        this.previousKeyCode = keyCode;
        
    } else {
        this.keyHeld = false;
        this.previousKeyCode = 0;
    }


    //console.log(deltaTime)

    let elapsedTime = deltaTime/1000
    fNewPlayerPosX = fPlayerPosX + fPlayerVelX * elapsedTime
    fNewPlayerPosY = fPlayerPosY + fPlayerVelY * elapsedTime

    // Check for Collision
    if (fPlayerVelX <= 0) // Moving Left
    {
        if (this.getTileChar(0|fNewPlayerPosX, 0|fPlayerPosY) != '.' || this.getTileChar(fNewPlayerPosX|0, 0|(fPlayerPosY + 0.9)) != '.')
        {
            fNewPlayerPosX = (0|fNewPlayerPosX) + 1;
            fPlayerVelX = 0;
        }
    }
    else // Moving Right
    {
        if (this.getTileChar((fNewPlayerPosX + 1.0)|0, fPlayerPosY|0) != '.' || this.getTileChar((fNewPlayerPosX + 1.0)|0, (fPlayerPosY + 0.9)|0) != '.')
        {
            fNewPlayerPosX = 0|fNewPlayerPosX;
            fPlayerVelX = 0;
            
        }
    }

    bPlayerOnGround = false;
    if (fPlayerVelY <= 0) // Moving Up
    {
        if (this.getTileChar(fNewPlayerPosX|0, fNewPlayerPosY|0) != '.' || this.getTileChar((fNewPlayerPosX + 0.9)|0, fNewPlayerPosY|0) != '.')
        {
            fNewPlayerPosY = (0|fNewPlayerPosY) + 1;
            fPlayerVelY = 0;
        }
    }
    else // Moving Down
    {
        if (this.getTileChar(0|fNewPlayerPosX, (fNewPlayerPosY + 1.0)|0) != '.' || this.getTileChar((fNewPlayerPosX + 0.9)|0, (fNewPlayerPosY + 1.0)|0) != '.')
        {
            fNewPlayerPosY = 0|fNewPlayerPosY;
            fPlayerVelY = 0;
            bPlayerOnGround = true; // Player has a solid surface underfoot
            // nDirModX = 0;
        }
    }
   
    fPlayerPosX = fNewPlayerPosX    
    fPlayerPosY = fNewPlayerPosY

    // Link camera to player position
        
	fCameraPosX = fPlayerPosX;
	fCameraPosY = fPlayerPosY;
     
   	// Calculate Top-Leftmost visible tile
    this.fOffsetX = fCameraPosX - (this.nVisibleTilesX+0.0) / 2.0;
    this.fOffsetY = fCameraPosY - (this.nVisibleTilesY+0.0) / 2.0;
    
    // Clipping
    if (this.fOffsetX < 0) this.fOffsetX = 0;
    if (this.fOffsetY < 0) this.fOffsetY = 0;

    let maximumX = nLevelWidth - this.nVisibleTilesX
    if (this.fOffsetX > ( maximumX)) this.fOffsetX = maximumX;

    if (this.fOffsetY > (nLevelHeight - this.nVisibleTilesY)) this.fOffsetY = nLevelHeight - this.nVisibleTilesY;
    
    this.debug(0,0,"fOfssetX>" + nf(this.fOffsetX,3,2).toString())

    //console.log("offsetX ",this.fOffsetX)
    //console.log(this.fOffsetY)
    
    /*
    // this displays the whole level
    for (let x=0; x<64; x++)
        for (let y=0; y<16; y++) {
            let c = this.getTileChar(x,y)
            this.Screen.gotoXY(x+96,y)            
            this.Screen.putchar(c)    
        }
    */


    let TileChar    
    
	// Get offsets for smooth movement
    let fTileOffsetX = (this.fOffsetX - (this.fOffsetX|0)) * this.nTileWidth;
    let fTileOffsetY = (this.fOffsetY - (this.fOffsetY|0)) * this.nTileHeight;

    for (let x = 0; x <= this.nVisibleTilesX ; x++) {
        for (let y = 0; y <= this.nVisibleTilesY ; y++) {

                TileChar = this.getTileChar(x + parseInt(this.fOffsetX), y + parseInt(this.fOffsetY))

            switch (TileChar) {
                case '.':
                    break;

                case 'O':
                    //this.Screen.textFill(x * this.nTileWidth - fTileOffsetX, y * this.nTileHeight - fTileOffsetY, ((x + 1) * fTileOffsetX) - (1 + this.fOffsetX), ((y + 1) * this.nTileHeight) - (1 + fTileOffsetY), PIXEL_TYPE.PIXEL_SOLID, "yellow")
                    this.Screen.textFill(x * this.nTileWidth -(0|fTileOffsetX), y * this.nTileHeight -(0|fTileOffsetY), ((x + 1) * this.nTileWidth) - (1 +(0|fTileOffsetX)), ((y + 1) * this.nTileHeight) - (1 +(0|fTileOffsetY)), PIXEL_TYPE.PIXEL_SOLID, "orange")
                    break;
                        
                case '#':
                    //this.Screen.textFill(x * this.nTileWidth - fTileOffsetX, y * this.nTileHeight - fTileOffsetY, ((x + 1) * fTileOffsetX) - (1 + this.fOffsetX), ((y + 1) * this.nTileHeight) - (1 + fTileOffsetY), PIXEL_TYPE.PIXEL_SOLID, "yellow")
                    this.Screen.textFill(x * this.nTileWidth -(0|fTileOffsetX), y * this.nTileHeight -(0|fTileOffsetY), ((x + 1) * this.nTileWidth) - (1 +(0|fTileOffsetX)), ((y + 1) * this.nTileHeight) - (1 +(0|fTileOffsetY)), PIXEL_TYPE.PIXEL_SOLID, "yellow")
                    //this.Screen.textFill(x * this.nTileWidth - fTileOffsetX, y * this.nTileHeight - fTileOffsetY, ((x + 1) * fTileOffsetX) - (1 + this.fOffsetX), ((y + 1) * this.nTileHeight) - (1 + fTileOffsetY), PIXEL_TYPE.PIXEL_SOLID, "yellow")
                    
                    break;
                default:
                     console.log("alert ! : ", TileChar) 
                     break;                    
            } //switch
        } // 2nd for
    } // end for

    this.debug(16,0,"player pos X>" + nf(fPlayerPosX,3,2).toString())
    
    // player
    let xP = fPlayerPosX - this.fOffsetX    
    let yP = fPlayerPosY - this.fOffsetY

    this.debug(16,2,"subtraction>" + nf(xP,3,2).toString())

    this.Screen.textFill( (xP * this.nTileWidth)|0,0|(yP * this.nTileHeight), 0|(((xP + 1.0) * this.nTileWidth)-1), 0|(((yP + 1.0) * this.nTileHeight)-1), PIXEL_TYPE.PIXEL_SOLID, "red")

    }

    getTileChar(xx,yy) {

        if (xx>-1 && xx < nLevelWidth && yy >-1 && yy < nLevelHeight) {
            return sLevel.charAt(xx + yy * nLevelWidth)
        }
        // out of bounds, error
        return '!'
    }

    setTileChar(xx,yy,c) {
        let index = xx + yy * nLevelWidth
        let newLevel = sLevel.substr(0,index) + c + sLevel.substr(index+1);
        sLevel = newLevel
        
    }

    draw() {
        this.Screen.draw()

        this.debugScreen.draw()
    }

    debug(x, y, st) {
        let l= st.length
        let Erase = "                                                  ".substring(0,l)
        this.debugScreen.gotoXY(x,y)
        this.debugScreen.write(Erase)
        this.debugScreen.gotoXY(x,y)
        this.debugScreen.write(st)   
    }

}