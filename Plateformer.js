import {PIXEL_TYPE} from './VirtualConsole.js'
let sLevel='';
let nLevelWidth;
let nLevelHeight;

// Player Properties
let fPlayerPosX;
let fPlayerPosY;

let fPlayerVelX;
let fPlayerVelY;
let bPlayerOnGround;

// Camera properties
let fCameraPosX;
let fCameraPosY;


export class Plateformer {

    constructor( virtualScreen ) {

    this.Screen=virtualScreen
    
    this.nTileWidth = 8;
    this.nTileHeight = 8;
    
    //debugger;
    let ScreenWidth = width; // canvas width
    let ScreenHeight = height; // canvas height


	this.nVisibleTilesX = ScreenWidth / this.nTileWidth;
    this.nVisibleTilesY = ScreenHeight / this.nTileHeight;
    
    console.log("nVisibleTilesX",this.nVisibleTilesX)
    console.log("nVisibleTilesY",this.nVisibleTilesY)
    console.log(this)

    }

    start() {        

    // Level storage
    nLevelWidth = 64;
    nLevelHeight = 16;

    sLevel = ""
    sLevel += "................................................................";
    sLevel += "..GGGG..........................................................";
    sLevel += "........#####...................................................";
    sLevel += ".......####.....................................................";
    sLevel += ".......................########................................#";
    sLevel += ".....##########.......###..............#.#......................";
    sLevel += "....................###................#.#......................";
    sLevel += "...................####.........................................";
    sLevel += "#####...############...#############.##############.....########";
    sLevel += "...................................#.#...............###........";
    sLevel += "...#######GG###.........############.#............###...........";
    sLevel += "...G..........G.........#............#.........###..............";
    sLevel += "........................#.############......###.................";
    sLevel += "........................#................###....................";
    sLevel += "........................#################.......................";
    sLevel += "................................................................";

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
    // Link camera to player position
        
	fCameraPosX = fPlayerPosX;
	fCameraPosY = fPlayerPosY;
     
   	// Calculate Top-Leftmost visible tile
    this.fOffsetX = fCameraPosX - (this.nVisibleTilesX+0.0) / 2.0;
    this.fOffsetY = fCameraPosY - (this.nVisibleTilesY+0.0) / 2.0;
           
    if (this.fOffsetX < 0) this.fOffsetX = 0;
    if (this.fOffsetY < 0) this.fOffsetY = 0;
    if (this.fOffsetX > nLevelWidth - this.nVisibleTilesX) this.fOffsetX = nLevelWidth - this.nVisibleTilesX;
    if (this.fOffsetY > nLevelHeight - this.nVisibleTilesY) this.fOffsetY = nLevelHeight - this.nVisibleTilesY;

     
    // this displays the whole level
    for (let x=0; x<43; x++)
        for (let y=0; y<15; y++) {

            let c = this.getTileChar(x,y)

            this.Screen.gotoXY(x+106,y)            
            this.Screen.putchar(c)    
        }
    

    //console.log(this)

    /* for (let xx = 0; xx < this.nVisibleTilesX; xx++) {
        console.log("one line") 
        for (let y = 0; y < this.nVisibleTilesY; y++) { */

    //debugger;
    let TileChar    
    
    // debugger
    let nScaledTilesX = this.nVisibleTilesX / this.nTileWidth
    let nScaledTilesY = this.nVisibleTilesY / this.nTileHeight

    for (let x = 0; x < nScaledTilesX ; x++) {
        for (let y = 0; y < nScaledTilesY ; y++) {
            TileChar = this.getTileChar(x, y)

            switch (TileChar) {                
                case '.':
                    break;

                case '#':
                    this.Screen.textFill(x * this.nTileWidth, y * this.nTileHeight, ((x + 1) * this.nTileWidth)-1, ((y + 1) * this.nTileHeight)-1, PIXEL_TYPE.PIXEL_SOLID, "yellow")
                    break;
                case 'G':
                    this.Screen.textFill(x * this.nTileWidth, y * this.nTileHeight, ((x + 1) * this.nTileWidth)-1, ((y + 1) * this.nTileHeight)-1, PIXEL_TYPE.PIXEL_SOLID, "green")                    
                    break;

                default:
                    console.log("alert ! : ", TileChar)
                    break;

            }
        }
    }

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
    }
}