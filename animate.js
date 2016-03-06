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
var usx = 100;
var usy = 100;
var v = 0;
var angle = 0;

//mx = mouse x
var mx = 0;
var my = 0;

var DVD = document.getElementById("dvd");
var bounce = function(){
    ctx.clearRect( 0, 0, c.width, c.height );
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
