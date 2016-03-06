var c= document.getElementById("playground");
var ctx = c.getContext("2d");
var requestID;

var logo = new Image();
logo.src = "logo_dvd.jpg";

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
var usdx = 0;
var usdy = 0;
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
    ctx.arc( x, y, 10, 0, 2 * Math.PI );
    ctx.stroke();
    ctx.fill();
    
    //movement for the player
    //var angle = Math.atan( (y-my)/(x - mx) );
    //console.log(angle);    
    if (mx > x){
        usdx = 1;
    } else { usdx = -1; }
    if (my > y ){ 
       usdy = 1; } else { usdy = -1; }
    usx += usdx;
    usy += usdy;
    


    /* //requires more work with the math....
    if ( mx > x ){
        usdx = 1 * Math.sin(angle);
        usdy = 1 * Math.cos(angle);
    } else {
        usdx = -1 * Math.sin(angle);
        usdy = -1 * Math.cos(angle);
    }
	*/

    ctx.beginPath();
    ctx.arc( usx, usy, 10, 0, 2 * Math.PI );
    ctx.stroke();
    ctx.fill();


    requestID = window.requestAnimationFrame( bounce );
}

window.addEventListener('mousemove', function(e){
    mx = e.pageX;
    my = e.pageY;
    console.log("x is "+mx+" y is "+my);
});


DVD.addEventListener( "click", bounce )
