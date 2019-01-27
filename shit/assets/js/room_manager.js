import * as PIXI from 'pixi.js';
import {textures} from './textures.js';

export default class RoomManager {
    constructor(app){
        this.app = app;
        this.stage = app.stage;
        this.rooms = [];
        this.roomHeight = (this.stage.height/2)-50;
        this.roomWidth = this.stage.width/20
        this.makeRooms();
        this.rooms.forEach((room)=>{
            this.stage.addChild(room);
        });
        window.setInterval(()=>{this.update()},100);
    }

    makeRooms(){
        for(let i=1; i<10; i++){
            const room = new PIXI.Container();
            const bed = new PIXI.Sprite(textures.letto);
            room.x= i * this.roomWidth, 
            room.y= i%2 == 0 ? 0 : this.app.screen.height - this.roomHeight, 
            room.width= 40, 
            room.height= this.roomHeight
            bed.x = room.x;
            bed.y = room.y;
            bed.width = 128
            bed.height = 128
            //bed.rotation = Math.random()*360;
            //bed.anchor.set(0.5);
            room.addChild(bed);
            //{
            //stage: this.stage, 
            //}
            
            this.rooms.push(room);
        }

    }
    moveHorizontal(delta){
        this.rooms.forEach((room)=>{
            room.position.x += delta
        })
    }
    update(){
        this.rooms.forEach((room)=>{
            if(room.position.x > this.app.screen.width){
                room.moveHorizontal(-(this.app.screen.width + room.width));
            }
        })
    }
    
}