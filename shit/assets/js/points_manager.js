import * as PIXI from 'pixi.js';

export default class PointsManager {
    constructor(pixiText){
        this.basePoints = 30;
        this.points = 30;
        this.pixiText = pixiText;
        window.setInterval(()=>{this.update()},100);
    }
    addPoint(){
        this.points += 1;
    }
    removePoint(){
        this.points -= 1;
    }
    getPoints(){
        return this.points;
    }
    resetPoints(){
        this.points = this.basePoints;
    }
    update(){
        this.pixiText.text = this.points;
        console.log(this.points);
    }
    
}