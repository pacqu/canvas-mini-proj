var c= document.getElementById("playground");
var ctx = c.getContext("2d");
var requestID;

var desist = function HALT(){
    window.cancelAnimationFrame( requestID );
}    

var stop = document.getElementById("stop");
stop.addEventListener( "click", desist);

//for the enemy circle
var dx = 1;
var dy = 3;
var x = c.width/3*2;
var y = c.height/3*2;

//usx = us's x
var usx = c.width/2;
var usy = c.height/2;
var v = 0;
var angle = 0;

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
      if( this.asx >= c.width )
        this.asx = 0; 
      if( this.asx <= 0 )
        this.asx = c.width;
      if( this.asy >= c.height )
        this.asy = 0;
      if( this.asy <= 0 )
        this.asy = c.height;
      this.asx += v * Math.cos(this.angle);
      this.asy += v * Math.sin(this.angle);
    }
}

var a1 = new asteroid(3, 100, 100, 1.7, 0.25*Math.PI);

//mx = mouse x
var mx = 0;
var my = 0;

var DVD = document.getElementById("dvd");
var bounce = function(){
    ctx.clearRect( 0, 0, c.width, c.height );
    a1.move(ctx);
    a1.draw(ctx);
    /*
    if ( ((x + 10) > c.width) || ( x < c.width/2 ) ){
        dx *= -1;
    } 
    if ( ((y+10) > c.height) || (y -10 < 0)){
        dy *= -1;
    }
    x += dx;
    y += dy;

    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc( x, y, 10, 0, 2 * Math.PI );
    ctx.stroke();
    ctx.fill();
    */


    ////
    if (v>5){
        v = 5;
    }

    usx += v * Math.cos(angle);
    usy += v * Math.sin(angle);
    if (v>0){
        v-=.005;
    }
    ctx.beginPath();
    ctx.fillStyle = "#0000ff";   
    ctx.arc( usx, usy, 10, .25*Math.PI +angle, 1.75 * Math.PI + angle );    
    ctx.stroke();
    ctx.fill();

    requestID = window.requestAnimationFrame( bounce );
}

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
   }
});

// will be changed to shooting
window.addEventListener('mousemove', function(e){
    mx = e.pageX;
    my = e.pageY;
    //console.log("x is "+mx+" y is "+my);
});


DVD.addEventListener( "click", bounce )
