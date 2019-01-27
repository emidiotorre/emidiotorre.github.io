import * as PIXI from 'pixi.js';

export default class Dirt extends PIXI.Sprite {
    constructor(){
        super();
        this.interactive = true;
        this.buttonMode = true;
        //this.boundsPadding = 10;
        //this.anchor.set(0.5);
        this.width = 128;
        this.height = 128;
        this.on('click', this.onClick);
    }
    onClick(){
        console.log(this.parent);
        this.parent.removeChild(this);
    }
    moveHorizontal(delta){
        this.position.set(this.position.x + delta);
    }
}