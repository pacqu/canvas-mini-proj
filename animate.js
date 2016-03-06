var c= document.getElementById("playground");
var ctx = c.getContext("2d");
var requestID;

var desist = function HALT(){
    window.cancelAnimationFrame( requestID );
}    

var stop = document.getElementById("stop");
stop.addEventListener( "click", desist);

//for the enemy circle
var ex = c.width/3*2;
var ey = c.height/3*2;
var alive = true;

//usx = us's x
var usx = c.width/2;
var usy = c.height/2;
var v = 0;
var angle = 0;
var ualive = true;

//shooting;
var reloaded = true;
var bx,by,bangle,bv;

function asteroid(size, asx, asy, v, angle) {
    this.size = size;
    this.asx = asx;
    this.asy = asy;
    this.v = v;
    this.angle = angle;

    this.draw = function(ctx){
      ctx.beginPath();
      ctx.fillStyle = "red";   
      ctx.arc(this.asx, this.asy, this.size * 10 , 0, 2 * Math.PI);
      ctx.fill();
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
      ex = this.asx;
      ey = this.asy;
    }
}

var a1 = new asteroid(3, 100, 100, 1.7, 0.25*Math.PI);

//mx = mouse x
var mx = 0;
var my = 0;

var player = document.getElementById("dvd");
var bounce = function(){
    ctx.clearRect( 0, 0, c.width, c.height );
    a1.move(ctx);
    if (alive){
        a1.draw(ctx);
    }
 
    if ( (usx-ex)*(usx-ex) + (usy-ey)*(usy-ey) < 1210 ) {
        ualive = false;
    }
    if (v>5){
        v = 5;}
    if (usx < 0){
        usx = c.width;} 
    if (usy < 0){
        usy = c.height;}
    if (usx > c.width){
        usx = 0;}
    if (usy > c.height){
        usy = 0;}
    usx += v * Math.cos(angle);
    usy += v * Math.sin(angle);
    if (v>0){
        //v-=.005;
    }
    if (ualive){
        ctx.beginPath();
        ctx.fillStyle = "#0000ff";   
        ctx.arc( usx, usy, 10, .25*Math.PI +angle, 1.75 * Math.PI + angle );    
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    //bullet
    if (!reloaded){ //i.e. still flying
        bx += Math.cos(bangle) * bv;
        by += Math.sin(bangle) * bv;
        ctx.beginPath();
        ctx.fillStyle = "#000080";   
        ctx.arc(bx, by, 10 , 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        if ( (bx > c.width) || bx < 0 || by > c.height || by < 0){
            reloaded = true;
            console.log(true);
        }
        if ( (bx - ex)*(bx-ex) + (by-ey)*(by-ey) < 1210 ){
            alive = false;
            reloaded = true;
        }
    }
    requestID = window.requestAnimationFrame( bounce );
}

function shoot(){
    if (reloaded && ualive){
        bx = usx;
        by = usy;
        bv = 5 +v;
        bangle = angle;
        reloaded = false;
    }
};

window.addEventListener("keydown", function(e){ //note angle is countercllockwise
   //e.keyCode; 39 == right; 38 == up; 37 == left; 40 == down
   //console.log(e.keyCode);
   if ( e.keyCode == 39 ){
       angle += .17; //right //radians
   } if ( e.keyCode == 38 ){ //up
       v += .1;
   } if ( e.keyCode == 37 ){
       angle -= .17;
   } if ( e.keyCode == 40 ){
       v -= .1;
   } if ( e.keyCode == 70 || e.keyCode == 32){ //f or space
       shoot();
   }
});

player.addEventListener( "click", bounce )
