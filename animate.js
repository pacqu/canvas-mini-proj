var c = document.getElementById("playground");
var ctx = c.getContext("2d");

var lvl = document.getElementById("level");
var pts = document.getElementById("points");
var requestID;
var ASTEROIDS;
var BULLETS;
var level;
var points;
var mute;
var pause = false;

var LASER = new Audio("laser.wav"); // buffers automatically when created

var player = document.getElementById("play");
var PLAYER;

var stop = document.getElementById("stop");
var keys;

function init(){
    halt();

    keys = [];
    ASTEROIDS = new Array();
    BULLETS = new Array();
    PLAYER = new ship(500,250);

    //change this to true random l8r
    ASTEROIDS.push(new asteroid(3, Math.random()*c.width, Math.random()*c.height, 1 + Math.random(), Math.random()*2*Math.PI));
    ASTEROIDS.push(new asteroid(3, Math.random()*c.width, Math.random()*c.height, 1 + Math.random(), Math.random()*2*Math.PI));
    ASTEROIDS.push(new asteroid(3, Math.random()*c.width, Math.random()*c.height, 1 + Math.random(), Math.random()*2*Math.PI));
    
    PLAYER.alive = true;
    PLAYER.v = 0;
    PLAYER.angle = 0;
    PLAYER.x = 500;
    PLAYER.y = 250;
    PLAYER.invinc = 64;
    PLAYER.evaL = false;
    PLAYER.evaR = false;
    level = 0;
    points = 0;
    //mute = false;
};
    
function halt(){
    window.cancelAnimationFrame( requestID );
    player.style.display = "initial";
    stop.style.display = "none";
};    

stop.addEventListener( "click", function(){
	window.cancelAnimationFrame( requestID );
	player.style.display = "initial";
	stop.style.display = "none";
    } );

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
    ctx.fillText("Asteroids", 305, 260);
    ctx.font="30px sans serif";
    ctx.fillText("A Golden Astro Gunslingers Production", 255, 310);
};

var laser = new Image();
laser.src = "laser.png";
var missile = new Image();
missile.src = "missile.png";
var shrapnel = new Image();
shrapnel.src = "shrapnel.png";

//shrapnel.setAttribute('height', 30);
//shrapnel.setAttribute('width', 30);

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
      ASTEROIDS.splice(ASTEROIDS.indexOf(this),1);
    }	
  }
}

var i;
function ship(x,y){
    this.invinc = 64;
    this.MissReload = 120;
    this.reload = 15;
    this.ShrapReload = 60;
    this.ShrapCooldown = 0;
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.alive = true;
    this.reloaded = true;
    this.v=0;
    this.cooldown = 0;
    this.MissCooldown = 0;
    this.r = 10;
    this.evaL = false;
    this.evaR = false;
        
    this.move = function(){
     
        if ( keys[39] || keys[68] ){
            this.angle += .085; //right //radians
        } if ( keys[38] || keys[87] ){ //up
            this.v += .05;
        } if ( keys[37] || keys[65] ){
            this.angle -= .085;
        } if ( keys[40] || keys[83] ){
            this.v -= .05;
        } if ( keys[75] || keys[32]){ //k or space
            this.shoot(ctx);
        } if ( keys[76] || keys[32]){ // L
	    this.missile(ctx);
	} if ( keys[32] || keys[74]){ // space
	    this.shrapnel(ctx);
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
		    //alert("You Died! Play Again?");
		    this.alive = false;
		}
             }
	}
        if (ASTEROIDS.length == 0){ 
            level+=1;
            lvl.innerHTML = "Level: " + level;
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
        if (this.alive && (this.evaL || this.evaR)){
            if (this.evaL == true){
                this.x += 75*Math.sin(this.angle);
                this.y -= 75*Math.cos(this.angle);
                console.log(this.x);
                this.evaL = false;
            }
            if (this.evaR == true){
                this.y += 75*Math.cos(this.angle);
                this.x -= 75*Math.sin(this.angle);
                this.evaR = false;
            }
        }	
        if (this.cooldown > 0){
            this.cooldown--;
        }
        if (this.MissCooldown > 0){
            this.MissCooldown--;
        }
        if (this.ShrapCooldown > 0){
            this.ShrapCooldown--;
        }
        if (this.invinc > 0){
            this.invinc--;
        }
    }

    this.shoot = function(){
        if (this.cooldown <= 0 && this.alive){
	    BULLETS.push(new bullet(this.x,this.y,this.v+5,this.angle, 1));
            //console.log("x is "+this.x);
            this.cooldown = this.reload;
            if(!mute){
		LASER.play();
	    }

        }
    };
    this.missile = function(){
        if (this.MissCooldown <= 0 && this.alive){
	    BULLETS.push(new bullet(this.x+Math.sin(this.angle)*3,this.y-Math.cos(this.angle)*3,2*(this.v+5),this.angle,2)); //right one
	    BULLETS.push(new bullet(this.x+Math.sin(this.angle)*25,this.y-Math.cos(this.angle)*25,2*(this.v+5),this.angle,2));
	    //console.log(this.x+Math.sin(this.angle)*25);
            this.MissCooldown = this.MissReload;
            if(!mute){
		LASER.play();
	    }
	    console.log("fired missile");

        }
    };
    this.shrapnel = function(){
	if (this.ShrapCooldown <= 0 && this.alive){
	    for (this.a = 0; this.a < 50; this.a++){
		BULLETS.push(new bullet(this.x,this.y,(this.v+5),this.angle+Math.random()*2*Math.PI,1)); //right one
	    }
	    this.ShrapCooldown = this.ShrapReload;
            if(!mute){
		LASER.play();
	    }
        }
    }
    this.status = function(){
	console.log("status");	
	ctx.fillStyle="#FF0000";
	
	ctx.drawImage(missile,c.width-60,c.height-55);
	ctx.fillRect(c.width-60, c.height-10,50,-40*(this.MissCooldown/this.MissReload));
	
	ctx.drawImage(laser, c.width-90,c.height-40);
 	ctx.fillRect(c.width-100,c.height-10,50,-40*(this.cooldown/this.reload));
	
	ctx.drawImage(shrapnel, c.width-150, c.height-50, 40, 40);
	ctx.fillRect(c.width-150, c.height-10,50,-40*(this.ShrapCooldown/this.ShrapReload));	
    }
};

function bullet(x,y,v,angle,type){
    this.x = x;
    this.y = y;
    this.v = v+level;
    this.angle = angle;
    this.r = 5;
    this.type = type;
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
              points += 10;
              pts.innerHTML = "Points: " + points;
              break;
            }
        }
        ctx.beginPath();
	ctx.save();
	ctx.translate(this.x,this.y);
	ctx.rotate(this.angle);
	if (this.type == 1){
	    ctx.drawImage(laser,-laser.width/2,-laser.width/2);
	} else if (this.type == 2){
	    ctx.drawImage(missile,-laser.width/2,-laser.width/2);
	    //console.log(-missile.width/2);
	}
	ctx.restore();
	ctx.closePath(); 
    };
}

var bounce = function(){
    ctx.clearRect( 0, 0, c.width, c.height );
    ctx.drawImage(back,0,0,1000,500);
    PLAYER.status();
    if( !PLAYER.alive ){
        ctx.clearRect( 0, 0, c.width, c.height );
        ctx.drawImage(back,0,0,1000,500);
        ctx.font = "100px sans serif";
        ctx.fillText("You Died!", 290, 255);
        ctx.font = "30px sans serif";
	ctx.fillText("Press Enter to Play Again", 340, 325);
        halt();
        return;
    }
    for( i = 0; i < ASTEROIDS.length; i++ ){
      ASTEROIDS[i].draw(ctx);
      ASTEROIDS[i].move(ctx);
    }
    PLAYER.move(ctx);
    for ( i = 0; i<BULLETS.length; i++){
        if (BULLETS[i].x > c.width || BULLETS[i].y > c.height || 
            BULLETS[i].x < 0 || BULLETS[i].y < 0 || BULLETS[i].hit ){
            if ( BULLETS[i].hit && BULLETS[i].type == 2 ){
		for (this.a = 0; this.a < 5; this.a++){
		    BULLETS.push( new bullet(BULLETS[i].x, BULLETS[i].y, BULLETS[i].v/2, BULLETS[i].angle+Math.random()*Math.PI/4, BULLETS[i].type-1) );
		    BULLETS.push( new bullet(BULLETS[i].x, BULLETS[i].y, BULLETS[i].v/2, BULLETS[i].angle-Math.random()*Math.PI/4, BULLETS[i].type-1) );
		}
	    }
            BULLETS.splice(i,1);
	    //bounce();
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
    if (e.keyCode == 88 || e.keyCode == 73){ //x
        PLAYER.evaL = true;
        console.log("True x");
    }
    if (e.keyCode == 67 || e.keyCode == 79){
        PLAYER.evaR = true;
    }
    if (e.keyCode == 13){
        init();
        bounce();
    }
});

window.addEventListener("keydown", function(e){ //note angle is countercllockwise
   e.preventDefault();

   //e.keyCode; 39 == right; 38 == up; 37 == left; 40 == down
   if (e.keyCode == 80){ // p
	pause = !pause;
	if (pause){
	    window.cancelAnimationFrame( requestID );
	} else {
	    window.requestAnimationFrame( bounce );
	}
   }
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
mute = !mute;