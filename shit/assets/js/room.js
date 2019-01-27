import * as PIXI from 'pixi.js';
import textures from './textures.js';

function makeRoom(){
    const room = new PIXI.Container();
    const elements = makeRoomElements(3);
    elements.forEach(element => {
        room.addChild(element);
    });
    return room
}

function makeRoomElements(number){
    const elements = [];
    for (let i=1; i<number; i++){
        elements.push(makeRoomElement());
    }
    return elements;
}

function makeRoomElement(){
    const sprite = new PIXI.Sprite(textures.letto);
    sprite.x = x;
    sprite.y = y;
    sprite.rotation = Math.random()*360;
    return sprite
}

class Wall extends PIXI.Graphics {
    constructor(conf){
        super();
        this.stage = conf.stage;
        
        this.stage.addChild(this);
        
        this.beginFill(0xFFFFFF,1)
        if(conf.isHorizontal){
            this.drawRect(
                conf.x,
                conf.y,
                conf.width,
                conf.height
                );
        }
        this.drawRect(
            conf.x,
            conf.y,
            conf.width,
            conf.height
            );
        this.endFill();
        //return this.graphics;
    }
    moveHorizontal(delta){
        this.setTransform(this.position.x + delta)
    }
}
