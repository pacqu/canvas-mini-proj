var c = document.getElementById("playground");
var ctx = c.getContext("2d");
var requestID;
var ASTEROIDS = new Array();
var BULLETS = new Array();
var desist = function HALT(){
    window.cancelAnimationFrame( requestID );
}    

var stop = document.getElementById("stop");
stop.addEventListener( "click", desist);

//for the enemy circle
//var alive = true;

//usx = us's x
var shp = new Image();
shp.src = "galaga-ship.gif";
//var usx = c.width/2;
//var usy = c.height/2;
//var v = 0;
//var angle = 0;
//var ualive = true;

//shooting;
//var reloaded = true;
//var bx,by,br,bangle,bv;

var aster = new Image();
aster.src = "asteroid.png";

var back = new Image();
back.src = "space.png";

back.onload = function(){
    ctx.drawImage(back,0,0,1000,500);   
};

var laser = new Image();
laser.src = "laser.png";

function asteroid(size, asx, asy, v, angle) {
    this.size = size;
    this.asx = asx;
    this.asy = asy;
    this.v = v;
    this.angle = angle;

    this.draw = function(ctx){
      ctx.beginPath();
      ctx.drawImage(aster, this.asx, this.asy, this.size * 30, this.size * 30);
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
	if( this.size > 0 ){
	    this.size--;
	    this.v += .2;
	    ASTEROIDS.push(
		new asteroid(this.size,this.asx,this.asy,this.v,
			     this.angle+(Math.random()*Math.PI)-(Math.PI/2)));
	}	
    }
}

ASTEROIDS.push(new asteroid(3, 100, 100, 1.7, 0.25*Math.PI));

var i; 

var player = document.getElementById("dvd");
var PLAYER = new ship(500,250);
function ship(x,y){
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.alive = true;
    this.reloaded = true;
    this.v=0;
    this.cooldown = 0;
    this.r = 10;
        
    this.move = function(){
	this.x += Math.cos(this.angle)*this.v;
	this.y += Math.sin(this.angle)*this.v;
	if (this.v>5){
	    this.v=5;
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
		console.log("oh");
		if ( ((this.x-ex)*(this.x-ex) + (this.y-ey)*(this.y-ey)) < (er+this.r)*(er+this.r) && this.alive){
		    alert("You died. HAHA");
		    this.alive = false;                 		    
		}
	    }
	}

	if (this.alive){
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
    }

    this.shoot = function(){
        if (this.cooldown <= 0){
	    BULLETS.push(new bullet(this.x,this.y,this.v+5,this.angle));
            //console.log("x is "+this.x);
            this.cooldown = 16;
        }
    };
};
function bullet(x,y,v,angle){
    this.x = x;
    this.y = y;
    this.v = v;
    this.angle = angle;
    this.r = 20;
    //console.log(this.x+ " " + x);
    this.hit = false;

    this.move = function(){
        this.x += Math.cos(this.angle) * this.v;
        this.y += Math.sin(this.angle) * this.v;
        for( var i = 0; i < ASTEROIDS.length; i++ ){
            var ex = ASTEROIDS[i].asx;
            var ey = ASTEROIDS[i].asy
            var er = ASTEROIDS[i].size*10;
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
}

window.addEventListener("keydown", function(e){ //note angle is countercllockwise
   //e.keyCode; 39 == right; 38 == up; 37 == left; 40 == down
   //console.log(e.keyCode);
   if ( e.keyCode == 39 ){
       PLAYER.angle += .17; //right //radians
   } if ( e.keyCode == 38 ){ //up
       PLAYER.v += .1;
   } if ( e.keyCode == 37 ){
       PLAYER.angle -= .17;
   } if ( e.keyCode == 40 ){
       PLAYER.v -= .1;
   } if ( e.keyCode == 70 || e.keyCode == 32){ //f or space
       PLAYER.shoot(ctx);
   }
});

player.addEventListener( "click", bounce )
