var c = document.getElementById("playground");
var ctx = c.getContext("2d");
var requestID;
var ASTEROIDS;
var BULLETS;
var level;
var mute;

var LASER = new Audio("laser.wav"); // buffers automatically when created

var player = document.getElementById("play");
var PLAYER;

var stop = document.getElementById("stop");
var keys;

function init(){
    desist;

//    ctx.clearRect( 0, 0, c.width, c.height );
//    ctx.drawImage(back,0,0,1000,500);

    keys = [];
    ASTEROIDS = new Array();
    BULLETS = new Array();
    PLAYER = new ship(500,250);

    //change this to true random l8r
    ASTEROIDS.push(new asteroid(3, 100 + Math.random()*100, 100 + Math.random()*100, 1 + Math.random(), Math.random()*2*Math.PI));
    ASTEROIDS.push(new asteroid(3, 400 + Math.random()*100, 70 + Math.random()*100, 1 + Math.random(), Math.random()*2*Math.PI));
    ASTEROIDS.push(new asteroid(3, 800 + Math.random()*100, 300 + Math.random()*100, 1 + Math.random(), Math.random()*2*Math.PI));
    
    PLAYER.alive = true;
    PLAYER.v = 0;
    PLAYER.angle = 0;
    PLAYER.x = 500;
    PLAYER.y = 250;
    PLAYER.invinc = 64;
    level = 0;
    mute = false;
};
    
var desist = function HALT(){
    window.cancelAnimationFrame( requestID );
    player.style.display = "initial";
    stop.style.display = "none";
}    

stop.addEventListener( "click", desist);

var shp = new Image();
shp.src = "galaga-ship.gif";

var aster = new Image();
aster.src = "asteroid.png";

var back = new Image();
back.src = "space.png";

back.onload = function(){
    ctx.drawImage(back,0,0,1000,500);
    ctx.font="100px sans serif";
    ctx.fillStyle="white";
    ctx.fillText("Asteroids", 325, 260);
    ctx.font="30px sans serif";
    ctx.fillText("A Golden Astro Gunslingers Production", 275, 310);
};

var laser = new Image();
laser.src = "laser.png";

var soundless = document.getElementById("mute");
var sounder = document.getElementById("unmute");

function asteroid(size, asx, asy, v, angle) {
    this.size = size;
    this.asx = asx;
    this.asy = asy;
    this.v = v;
    this.angle = angle;

    this.draw = function(ctx){
      ctx.beginPath();
      ctx.drawImage(aster, this.asx-(this.size*15), this.asy-(this.size*15), this.size * 30, this.size * 30);
      ctx.closePath();
    }
    this.move = function(){
      if( this.asx > c.width )
        this.asx = 0; 
      if( this.asx < 0 )
        this.asx = c.width;
      if( this.asy > c.height )
        this.asy = 0;
      if( this.asy < 0 )
        this.asy = c.height;
      this.asx += v * Math.cos(this.angle);
      this.asy += v * Math.sin(this.angle);
    }
    this.split = function(){
	if( this.size > 1 ){
	    this.size--;
	    this.v += .2;
	    ASTEROIDS.push(
		new asteroid(this.size,this.asx,this.asy,this.v,
			     this.angle+(Math.random()*Math.PI)-(Math.PI/2)));
    }else{
      console.log("asteroid popped");
      ASTEROIDS.splice(ASTEROIDS.indexOf(this),1);
    }	
  }
}

var i;
function ship(x,y){
    this.invinc = 64;
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.alive = true;
    this.reloaded = true;
    this.v=0;
    this.cooldown = 0;
    this.r = 10;
        
    this.move = function(){
    
        if ( keys[39] ){
            this.angle += .085; //right //radians
        } if ( keys[38] ){ //up
            this.v += .05;
        } if ( keys[37] ){
            this.angle -= .085;
        } if ( keys[40] ){
            this.v -= .05;
        } if ( keys[70] || keys[32]){ //f or space
            this.shoot(ctx);
        }

	this.x += Math.cos(this.angle)*this.v;
	this.y += Math.sin(this.angle)*this.v;
	if (this.v>5){
	    this.v=5;
	} if (this.v<-5){
            this.v=-5;
        } if (this.x<0){
	    this.x = c.width;
	} if (this.x>c.width){
	    this.x = 0;
	} if (this.y<0){
	    this.y = c.height;
	} if (this.y>c.height){
	    this.y = 0;
        }
	if (ASTEROIDS.length > 0){
	    for( var i = 0; i < ASTEROIDS.length; i++ ){
		var ex = ASTEROIDS[i].asx;
		var ey = ASTEROIDS[i].asy;
		var er = ASTEROIDS[i].size*10;
		if ( ((this.x-ex)*(this.x-ex) + (this.y-ey)*(this.y-ey)) < (er+this.r)*(er+this.r) && this.alive && this.invinc < 1){
		    alert("You died. HAHA");
		    this.alive = false; 
                    init();                		    
		}
	    }
	}
        if (ASTEROIDS.length == 0){ 
            level+=1;
            ASTEROIDS.push(
		new asteroid(3, (this.x + c.width * Math.random() + c.width / 2) % c.width, (this.y + c.height * Math.random()+ c.height / 2) % c.height, 
                            (Math.random() * 10) % 2 + level, (Math.random()*Math.PI*2)) );
            ASTEROIDS.push(
		new asteroid(3, (this.x + c.width * Math.random() + c.width / 2) % c.width, (this.y + c.height * Math.random() + c.height / 2) % c.height, 
                            (Math.random() * 10) % 2 + level, (Math.random()*Math.PI*2)) );
            ASTEROIDS.push(
		new asteroid(3, (this.x + c.width * Math.random() + c.width / 2) % c.width, (this.y + c.height * Math.random() + c.height / 2) % c.height, 
                            (Math.random() * 10) % 2 + level, (Math.random()*Math.PI*2)) );
            this.invinc = 32;
        }
	if (this.alive && this.invinc % 2 == 0){
            ctx.beginPath();
	    ctx.save();
	    ctx.translate(this.x,this.y);
	    ctx.rotate(this.angle);
	    ctx.drawImage(shp,-shp.width/2,-shp.width/2);
	    ctx.restore();
            ctx.closePath();
	}	
        if (this.cooldown > 0){
            this.cooldown--;
        }
        if (this.invinc > 0){
            this.invinc--;
        }
    }

    this.shoot = function(){
        if (this.cooldown <= 0 && this.alive){
	    BULLETS.push(new bullet(this.x,this.y,this.v+5,this.angle));
            //console.log("x is "+this.x);
            this.cooldown = 30;
            if(!mute){
		LASER.play();
	    }

        }
    };
};
function bullet(x,y,v,angle){
    this.x = x;
    this.y = y;
    this.v = v+level;
    this.angle = angle;
    this.r = 5;
    console.log(this.x+ " " + x);
    this.hit = false;

    this.move = function(){
        this.x += Math.cos(this.angle) * this.v;
        this.y += Math.sin(this.angle) * this.v;
        for( var i = 0; i < ASTEROIDS.length; i++ ){
            var ex = ASTEROIDS[i].asx;
            var ey = ASTEROIDS[i].asy
            var er = ASTEROIDS[i].size*15;
            if ( (this.x-ex)*(this.x-ex) + (this.y-ey)*(this.y-ey) < (er+this.r)*(er+this.r) ){
              ASTEROIDS[i].split();
              this.hit = true;
              if (this.hit){
                  console.log("hitted");
              }
              break;
            }
        }
        ctx.beginPath();
	ctx.save();
	ctx.translate(this.x,this.y);
	ctx.rotate(this.angle);
	ctx.drawImage(laser,-laser.width/2,-laser.width/2);
	ctx.restore();
	ctx.closePath();
        
    };
}

var bounce = function(){
    ctx.clearRect( 0, 0, c.width, c.height );
    ctx.drawImage(back,0,0,1000,500);
    for( i = 0; i < ASTEROIDS.length; i++ ){
      ASTEROIDS[i].draw(ctx);
      ASTEROIDS[i].move(ctx);
    }
    PLAYER.move(ctx);
    for ( i = 0; i<BULLETS.length; i++){
        if (BULLETS[i].bx > c.width || BULLETS[i].by > c.height || 
            BULLETS[i].bx < 0 || BULLETS[i].by < 0 || BULLETS[i].hit ){
            BULLETS.splice(i,1);
        } else {
            BULLETS[i].move(ctx);
        }
    }
    requestID = window.requestAnimationFrame( bounce );
    player.style.display = "none";
    stop.style.display = "initial";
};

window.addEventListener("keyup", function(e){ //note angle is countercllockwise
    keys[e.keyCode] = false;
});

window.addEventListener("keydown", function(e){ //note angle is countercllockwise
   //e.keyCode; 39 == right; 38 == up; 37 == left; 40 == down
   keys[e.keyCode] = true;
});

player.addEventListener( "click", bounce );

soundless.addEventListener( "click", function(){
    mute = !mute;
    soundless.style.display = "none";
    console.log("why");
    yes = sounder.style.display = "initial";
    console.log(yes);
    });

sounder.addEventListener( "click", function(){
	mute = !mute;
	soundless.style.display = "initial";
	sounder.style.display = "none";
    });

init();
