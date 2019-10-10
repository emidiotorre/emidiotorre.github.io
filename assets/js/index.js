import barba from '@barba/core';
import anime from 'animejs/lib/anime.es.js';
import '../scss/style.scss';

const pipe = (...functions) => args => functions.reduce((arg, fn) => fn(arg), args);
const compose = (...functions) => args => functions.reduceRight((arg, fn) => fn(arg), args);

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function makeAnime(target, cb = null, options = {}){
    return anime({
        targets: target,
        duration: 1000,
        easing: 'easeInOutQuad',
        ...options,
        complete: ()=>{
            if(isFunction(cb)){
                cb(target);
            }
        }
    });
};

function removeBlur( target, cb, options = {}){
    return () => { makeAnime(target,cb,{ filter: 'blur(0px)', duration: 1000, ...options}); }
};

function move( target, cb, options = {}){
    return () => { makeAnime(target, cb, {delay: 600, ...options});  }
};

function moveLeft( target, cb, options = {}){
    return () => { makeAnime(target, cb, {delay: 600, left: '30%', ...options});  }
};

function fadeOut( target, cb, options = {}){
    return () => { makeAnime(target, cb, {delay: 600, opacity: 0, ...options}); }
};

function fadeIn( target, cb, options = {}){
    return () => { makeAnime(target, cb, {delay: 600, opacity: 1, ...options}); }
};

function remove(target){
    return () => { target.parentNode.removeChild(target); }
}

function hide(target){
    return () => { target.style.display = "none"; }
}

function makeVisible(target,cb){
    return () => { makeAnime(target,cb,{opacity: 1,duration: 1000, filter: 'blur(0px)'})  }
}

function calcDistance(pointA, pointB){
    return Math.floor(Math.sqrt(Math.pow(Math.abs(pointA.x-pointB.x),2)+Math.pow(Math.abs(pointA.y-pointB.y),2)));
}

class Scene {
    constructor(){
        this.targets = {
            menu: document.querySelector(".menu"),
            menuLinks: document.querySelectorAll(".menulink"),
            hamburger: document.querySelector(".hamburger"),
            menu_logo: document.querySelector(".menu_logo"),
            menu_content: document.querySelector(".menu_content"),
        };
        this.open = false;
    }

    init(){
        this.targets.hamburger.addEventListener("click", (e) => {this.toggleMenu(e)});
        this.targets.menu.style.filter = 'blur(10px)';
        this.initproximity();
        //this.activateMenuLinks();
    }

    initproximity(){
        window.addEventListener('mousemove',(e)=>{
            let x = this.targets.hamburger.offsetLeft;
            let y = this.targets.hamburger.offsetTop;
            let h = this.targets.hamburger.offsetHeight;
            let w = this.targets.hamburger.offsetWidth;
            let X = e.pageX;
            let Y = e.pageY;
            let distance = calcDistance({x:X,y:Y},{x:x+w/2,y:y+h/2});
            let fact = distance/(100-distance);
            if (fact < 0.8) { fact = 0.8 };
            //let barH = Math.floor(5 - (distance/10));
            //if (barH < 2) { barH = 2 };
            //const innerBar = this.targets.hamburger.querySelector('.hamburger-inner');

            distance < 50 && !this.open ? this.targets.hamburger.style.transform = 'scaleY('+fact+')': this.targets.hamburger.style.transform = 'scaleY(1)';
            //distance < 50 && !this.open ? innerBar.style.height = barH+'px': innerBar.style.height = '4px';
        });
    }
    activateMenuLinks(){
        for (const menuLink in this.targets.menuLinks){
            menuLink.addEventListener(function(e){
                
            });
        }
    }
    
    hideMenu(){
        anime({
            targets: this.targets.menu,
            opacity: 0,
            duration: 1000,
            filter:'blur(10px)',
            easing: 'easeOutQuad',
            complete: ()=>{
                this.targets.menu.style.display = 'none';
                this.targets.menu_content.style.opacity = '0';
                this.targets.menu_content.style.top = '30%';
            }
        });
    }

    showMenu(){
        this.targets.menu.style.display = 'block';
        this.targets.menu_content.style.opacity = '0';
        
        makeVisible(this.targets.menu,null)();
        
        anime({
            targets: this.targets.menu_content,
            duration: 1000,
            opacity: 1,
            top: '40%',
            easing: 'easeOutQuad',
        });
    }
    
    toggleMenu(e){
        this.targets.hamburger.classList.toggle("is-active");
        this.open ? this.hideMenu() :this.showMenu();
        this.open = !this.open;
    }

}

document.addEventListener("DOMContentLoaded", function(event) { 


    const navs = document.getElementsByTagName('NAV');
    
    for(const nav of navs){
        console.log(nav);
        nav.style.opacity = '0';
    }
    fadeIn(navs)();

    const intro= document.getElementById('intro');
    const intro_logo= document.getElementById('intro_logo');
    const hiddenIntro = document.querySelectorAll('.hiddenIntro');
    
    if(intro){
        //nav.style.filter = 'blur(10px)';
        //removeBlur(intro_logo,moveLeft(intro_logo,fadeOut(intro,removeTarget)))();
        console.log(navs[0].offsetLeft + navs[0].style.paddingRight);
        removeBlur(intro_logo,move(intro_logo,fadeIn(navs),{left: '40%' }))();
    }

    const links = document.querySelectorAll('a[href]');
    for(const link of links){
        link.addEventListener('click',function(e) {
            if(e.currentTarget.href === window.location.href) {
              e.preventDefault();
              e.stopPropagation();
            }
        });
    };
  
  


    barba.init({
        transitions: [{
            sync: true,
            beforeAppear() {
                
            },
            leave({ current, next, trigger }) {
                const intro = document.getElementById('intro');
                if(intro) {
                    remove(intro)();
                };
                return new Promise(function(resolve,reject){
                    anime({
                        targets: current.container,
                        opacity: 0,
                        duration: 3000,
                        //scale: .8,
                        filter: 'blur(20px)',
                        easing: 'easeOutQuad',
                        complete:()=>{resolve()}
                    });
                });
            },
            beforeEnter(){
                window.scrollY = 0;
            },
            enter({ current, next, trigger }) {
                return new Promise(function(resolve,reject){
                    //next.container.style.filter = 'blur(20px)';
                    next.container.style.display = 'none';
                    next.container.style.display = 'block';
                    next.container.style.opacity = 0;
                    anime({
                        targets: next.container,
                        opacity: 1,
                        duration: 2000,
                        scale: 1,
                        //filter: 'blur(0)',
                        easing: 'easeOutQuad',
                        complete:()=>{
                            //const sidebar_content = next.container.querySelectorAll('.sidebar_content')[0];
                            //console.log(sidebar_content);
                            //sidebar_content.style.position = 'fixed';
                            //forceRedraw(next.container);
                            resolve()
                        }
                    });
                });
            }
        },{
            name: 'menu-transition',
            custom: ({ current, next, trigger }) => trigger.classList && trigger.classList.contains('menulink'),
            sync: true,
            beforeAppear() {},
            appear() {},
            afterAppear() {},
            beforeLeave() {
                const intro = document.getElementById('intro');
                if(intro) {
                    hide(intro)();
                };
            },
            leave() {
                console.log('leaving from menu');
                scene.toggleMenu();
            },
            afterLeave() {},
            beforeEnter() {},
            enter() {},
            afterEnter() {}
          }]
    });

});

const forceRedraw = function(element){

    if (!element) { return; }

    var n = document.createTextNode(' ');
    var disp = element.style.display;  // don't worry about previous display style

    element.appendChild(n);
    element.style.display = 'none';

    setTimeout(function(){
        element.style.display = disp;
        n.parentNode.removeChild(n);
    },20); // you can play with this timeout to make it as short as possible
}