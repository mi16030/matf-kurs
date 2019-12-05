
const canvas = document.getElementById("game-area");
const ctx = canvas.getContext("2d");

ctx.fillStyle="#F1F1F1";
ctx.fillRect(0, 0, 810, 600);

const box = 30;


let snake=[];
snake[0]={
    x:9*box,
    y:10*box
};
snake[1]={
    x:9*box,
    y:11*box
};

let food=createBait();
let score=0;
let dir;
let ind=false;
document.addEventListener("keydown", direction);
let munch = new Audio("munch3.mp3");
let img = new Image();
img.src = "apple-remove.png";
//img.setColorToAlpha(0, 0);
let bg = new Image();
bg.src = "field.jpg";
function createBait() {
    
    
    x=Math.floor(Math.random()*27+1)*box;
    y=Math.floor(Math.random()*20+1)*box;
    
    if(collision({x:x, y:y}, snake)){
        return createBait();
    }
    
    return {x:x, y:y};
}

function direction(event){
    ind=true;
    switch(event.key){
        case "ArrowUp":
            if(dir!="down"){
                dir="up";	
                console.log('gore');
            }
            break;
        case "ArrowDown":
            if(dir!="up"){
                dir="down";	
                console.log('dole');
            }
            break;
        case "ArrowLeft":
            if(dir!="right"){
                dir="left";
                console.log('levo');
            }
            break;
        case "ArrowRight":
            if(dir!="left"){
                dir="right";
                console.log('desno');
            }
            break;
		}
		draw();
}

function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

function draw(){
    ctx.clearRect(0, 0, 810, 600);
    ctx.drawImage(bg, 0, 0, 810, 600);

    for(let i =0; i<snake.length; i++){
        ctx.fillStyle = "blue";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        
        ctx.strokeStyle="black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    
    ctx.fillStyle = "black";
    ctx.drawImage(img, food.x, food.y, 1.2*box, 1.2*box);
    
    document.getElementById("score").innerHTML="</br>"+score;

    
    let oldHeadX=snake[0].x;
    let oldHeadY=snake[0].y;
    
    if(dir=="left") oldHeadX-=box;
    if(dir=="right") oldHeadX+=box;
    if(dir=="up") oldHeadY-=box;
    if(dir=="down") oldHeadY+=box;
    
    oldHeadX=oldHeadX % 810;
    oldHeadY=oldHeadY % 600;
   
    if(oldHeadX<0){
        oldHeadX=810;
    } 
    if(oldHeadY<0){
        oldHeadY=600;
    } 

    
    // ako pojedemo hranu
    if(oldHeadX == food.x && oldHeadY == food.y){
        munch.play();
        score++;
        food = createBait();
        ctx.fillStyle = "black";
        ctx.fillRect(food.x, food.y, box, box);
        console.log(snake);
        
       
    }else{
        // skidamo poslednji i ne crtamo ga
        snake.pop();
    }
    
    
    
    let newHead = {
        x : oldHeadX,
        y : oldHeadY
    }
    
    // game over
    
    if(collision(newHead,snake) && ind){
        clearInterval(game);
        alert('izgubili ste');
    }
    
    snake.unshift(newHead);
    
    
}

let game=setInterval(draw, 100);

