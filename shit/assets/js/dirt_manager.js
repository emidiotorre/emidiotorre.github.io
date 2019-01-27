import * as PIXI from 'pixi.js';
import {textures} from './textures.js';

export default class DirtManager {
    constructor(app,PointsManager){
        this.app = app;
        this.stage = app.stage;
        this.points = PointsManager;
        this.dirtList= [];
        this.texturesList = [textures.merdabuona, textures.vomito];
        this.spawnSpeed = 600;
        this.upSpeed = 100;
        this.maxSpawnSpeed = 150;
        this.spawnInterval;
        this.upInterval;
        this.start();
    }
    start(){
        this.upInterval = setInterval(()=>{this.update()},this.upSpeed);
        this.spawnInterval = setInterval(()=>{this.makeRandomShit()},this.spawnSpeed);
    }
    increaseSpeed(){
        clearInterval(this.spawnInterval);
        this.spawnSpeed -= this.spawnSpeed >= this.maxSpawnSpeed ? 20 : 0
        this.spawnInterval = setInterval(()=>{this.makeRandomShit()},this.spawnSpeed);
    }
    stopSpawn(){
        clearInterval(this.spawnInterval);
    }
    makeDirt(x,y){
        let sprite = new PIXI.Sprite(this.texturesList[Math.floor(Math.random()*this.texturesList.length)]);
        sprite.x = x;
        sprite.y = y;
        sprite.width = 64;
        sprite.height = 64;
        //sprite.rotation = Math.random()*360;
        sprite.anchor.set(0.5);
        sprite.interactive = true;
        //sprite.buttonMode = true;
        this.stage.addChild(sprite);
        this.dirtList.push(sprite);
        sprite.on('mouseover',(e)=>{this.removeDirt(e)})
        sprite.on('touchmove',(e)=>{this.removeDirt(e)})
    }
    removeDirt(e){
        console.log(e)
        e.currentTarget.parent.removeChild(e.currentTarget);
        const removeindex = this.dirtList.indexOf(e.currentTarget);
        this.dirtList[removeindex].destroy();
        this.dirtList.splice(removeindex,1);
        this.points.addPoint();
        this.increaseSpeed();
    }
    moveHorizontal(delta){
        this.dirtList.forEach((sprite)=>{
            sprite.position.set(sprite.position.x + delta,sprite.position.y);
        })
    }
    makeRandomShit(){
        this.makeDirt(Math.random()*-10, (Math.random()*this.app.screen.height).clamp(100, this.app.screen.height-100))
    }
    update(){
        this.dirtList.forEach((dirt)=>{
            if(dirt.x >= this.app.screen.width){
                this.points.removePoint()
                const removeindex = this.dirtList.indexOf(dirt); //Math.floor(Math.random()*this.dirtList.length);
                this.dirtList[removeindex].destroy();
                this.dirtList.splice(removeindex,1);
            }
        })
    }
}

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};