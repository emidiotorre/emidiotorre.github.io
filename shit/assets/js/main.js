import * as PIXI from 'pixi.js';
import RoomManager from './room_manager.js';
import DirtManager from './dirt_manager.js';
import PointsManager from './points_manager.js';

function addTexture(stage,texture,x,y){
    const sprite = new PIXI.Sprite(texture);
    sprite.position.x = x;
    sprite.position.y = y;
    stage.addChild(sprite);
    return sprite;
};

function addTilingTexture(stage,texture,w,h,x,y){
    const sprite = new PIXI.extras.TilingSprite(texture,w,h);
    sprite.uvTransform.clampOffset = 0;
    sprite.position.x = x;
    sprite.position.y = y;
    stage.addChild(sprite);
    return sprite;
};


class Game {
    constructor(){
        this.app = new PIXI.Application(
            window.innerWidth,
            window.innerHeight,
            {backgroundColor : 0xEEEEEE});
        this.app.renderer.plugins.interaction.moveWhenInside = true;
        this.textures = {};
        this.roomManager;
        this.dirtManager;
        this.bg;
        this.speed = 3;
        this.pointsText = new PIXI.Text( '30' ,{fontFamily : 'Arial', fontSize: 48, fill : 0xffffff, align : 'center'});
        this.points = new PointsManager(this.pointsText);
    }
    increaseSpeed(){
        this.speedMultiplier += .25;
    }
    init(){
        document.body.appendChild(this.app.view);
        this.loadTextures();
        this.addTextures();
        this.attachHandlers();

        //const sliderContainer = new PIXI.Container();
        //this.app.stage.addChild(sliderContainer)

        this.roomManager = new RoomManager(this.app);
        this.dirtManager = new DirtManager(this.app, this.points);
        this.pointsText.x = 20
        this.pointsText.y = 20
        this.app.stage.addChild(this.pointsText)

        const defaultIcon = "url('assets/img/panno.png'),auto ";
        this.app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;

        this.start();
    }
    start(){
        this.app.ticker.add((delta)=>{
            //this.app.renderer.render(this.container, this.rt);
            if(this.points.getPoints()>0){

                this.speed += this.speed < 12 ? 0.005 : 0 ; //* delta;
                this.bg.tilePosition.x += this.speed;
                //this.app.stage.children.forEach((child)=>{
                    //    child.position.x += speed;
                    //}) 

                //this.roomManager.moveHorizontal(speed);
                this.dirtManager.moveHorizontal(this.speed);
                //this.dirtManager.makeRandomShit();
            }else{
                this.dirtManager.stopSpawn();
                //const gameOver = new PIXI.Text('GAME OVER',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
                //gameOver.position.x = this.app.stage.width/2;
                //gameOver.position.y = this.app.stage.height/2;
                //gameOver.interactive = true;
                //gameOver.buttonMode = true;
                //gameOver.on('click', this.restart);
                //this.app.stage.addChild(gameOver);
            }
        });
    }
    loadTextures(){
        this.textures.divanoT = PIXI.Texture.fromImage("assets/img/divano.png");
        this.textures.bgT = PIXI.Texture.fromImage("assets/img/bg.png");
    }
    addTextures(){
        this.bg = addTilingTexture(this.app.stage,this.textures.bgT,window.innerWidth,window.innerHeight,0,0);
    }
    attachHandlers(){
        this.app.stage.interactive = true;
        //this.app.stage.on('click', (event)=>{
        //    console.log(event.type, event, event.target);
        //    this.dirtManager.makeDirt(event.data.global.x,event.data.global.y);
        //});
    }
    restart(){
        this.points.resetPoints();
        this.dirtManager.increaseSpeed();
    }
    
}

window.game = new Game();
game.init();