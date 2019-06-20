var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;

var dx = 2
var dy = -2

var ballRadius = 10;
var colourBall = getRandomColor();
var brickColor = getRandomColor();

var paddleColor = brickColor;
var paddleSpeed = 8;
var paddleHeight = 5;
var paddleWidth = canvas.width*0.2;
var paddleX = (canvas.width-paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var bricks = [];
var brickWidth = paddleWidth/2 - paddleWidth/4;
var brickHeight = 20;
var brickPadding = 10;
var brickOffset = 10;

var brickColumnCount = Math.floor(canvas.width/(brickWidth+brickPadding));
var brickRowCount = Math.floor(canvas.height/(4*(brickHeight+brickPadding)));

var score = 0;
var lives = 100;
var stop = false;

function init(){
    createBricks();
    draw();
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);



function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);   
    win();
    drawBall();
    drawScore();
    drawLives();
    direction();
    drawBricks();
    drawPaddle();
    collisionDetection();
    if(!stop){
        requestAnimationFrame(draw);
    }
};



function createBricks(){

    var setStatus;

    for (var col = 0; col < brickColumnCount; col++) {
        bricks[col] = [];
        for (var row = 0; row < brickRowCount; row++) {
            if(row === 0){
                setStatus = 1;
            } else{
                setStatus = Math.floor(Math.random() * 2)
            }

            bricks[col][row] = { 
                x: 0,
                y: 0,
                status: setStatus,
            };
        };
    };
};

function direction(){

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    };

    if( y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
        if(x + ballRadius >= paddleX && x - ballRadius <= paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                endtext("GAME OVER");
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }   

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += paddleSpeed;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
    x += dx;
    y += dy;
};

function endtext(text){
    stop = true;
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Score: "+  score, canvas.width/2, canvas.height/2);
};


function collisionDetection() {
    for(var col = 0; col < brickColumnCount; col++) {
        for(var row = 0; row < brickRowCount; row++) {
            var b = bricks[col][row];
            if(b.status >= 1) {
                if( x + ballRadius/2 > b.x && x - ballRadius/2 < b.x+brickWidth && 
                    y + ballRadius/2 > b.y && y - ballRadius/2 < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    colourBall = getRandomColor();
                    score += col;
                }
            }
        }
    }
}

function win(){
    var bad = [];
    var loc;
    for(var col=0; col<brickColumnCount; col++) {
        for(var row=0; row<brickRowCount; row++) {
            if(bricks[col][row].status > 0){
                loc = true;
            } else {
                loc = false;
            }
            bad.push(loc);
        }
    };

    if(bad.indexOf(true) === -1){
        endtext("Good job !CONGRATULATIONS!");
    }
    
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = colourBall;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var col = 0; col < brickColumnCount; col++) {
        for (var row = 0; row < brickRowCount; row++) {
            if (bricks[col][row].status > 0) {
                var brickX = (col * (brickWidth + brickPadding)) + brickOffset;
                var brickY = (row * (brickHeight + brickPadding)) + brickOffset + 15;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColor;
                ctx.fill();
                ctx.closePath();
            };
        };
    };
};


function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
};

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score , canvas.width*0.3, 20);
};


function drawLives() {
    ctx.beginPath();
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width*0.6, 20);
    ctx.closePath();
};
 
function clickHandler(){
    document.location.reload();
    stop = false;
    console.log(stop);
};

init();

draw()
draw()
draw()