let username = "";


username=loadUsername();
console.log(username);


const canvas = document.getElementById("game-area");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-button");
const stopBtn = document.getElementById("stop-button");
const newGameBtn = document.getElementById("new-game-button");

const height = 640;
const width = 1280;
const Directions = Object.freeze({"UP":1, "DOWN":2, "LEFT":3, "RIGHT":4});
let dir=Directions.UP;

const box = 20;
let score = 0;
const munch = new Audio("munch3.mp3");
let img = new Image();
img.src = "apple-remove.png";
//img.setColorToAlpha(0, 0);
let bg = new Image();
bg.src = "field.jpg";
ctx.clearRect(0, 0, width, height); 
ctx.drawImage(bg, 0, 0, width, height);

class Snake{
    
    constructor(){
        
        this.colLen=64;
        this.rowLen=32;
        this.snake = [];
        this.food = {x:null, y:null};
        for (let i = 0; i < 4; i++) {
            this.snake.push({
                x: (Math.ceil(this.colLen / 2) + i)*box,
                y: (Math.ceil(this.rowLen / 2))*box
            });
        }
        console.log(this.snake);
        this.createBait();
        this.interval = null;
        this.started=false;
        this.draw();
        
    }
    
     start(){
        if(!this.started){
            this.interval = setInterval(this.move.bind(this), 70);
            this.started=true;
        }
    }
    
    stop(){
        //let self = this;
        if(this.started){
            clearInterval(this.interval);
            this.started=false;
        }
    }
    draw(){
        let snake = this.snake;
        
        ctx.clearRect(0, 0, width, height); 
        ctx.drawImage(bg, 0, 0, width, height);
        document.getElementById("score").innerHTML="</br>"+score;
        
        for(let i =0; i<snake.length; i++){
            ctx.fillStyle = "blue";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            
            ctx.strokeStyle="black";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
        //ctx.fillStyle = "black";
        //ctx.fillRect(this.food.x, this.food.y, box, box);
        ctx.drawImage(img, this.food.x, this.food.y, 1.15*box, 1.15*box);
    }
    
    async move(){
        let snake = this.snake;
       
        this.draw();
        
        let headX=snake[0].x;
        let headY=snake[0].y;
        
        switch(dir){
            case Directions.UP:
                headY-=box;
                break;
            case Directions.DOWN:
                headY+=box;
                break;
            case Directions.LEFT:
                headX-=box;
                break;
            case Directions.RIGHT:
                headX+=box;
                break;
        }
        
        //prepravke ako odemo van granica
        headX=headX % width;
        headY=headY % height;
        if(headX<0){ headX=width;} 
        if(headY<0){ headY=height;} 
        
        // ako pojedemo hranu
        if(headX === this.food.x && headY === this.food.y){
            munch.play();
            score++;
            console.log(this.food);
            this.createBait();
            console.log(this.food);
        }else{
            snake.pop();
        }
        
        let newHead = {x: headX, y: headY};
        
        // game over ako udarimo u sebe
        if(collision(newHead,snake)){
            
            alert('Izgubili ste! Vas rezultat je: '+score);
            this.stop();
            await sendResult(username, score);
            getResult();
        }
        
        //ako nismo ni pojeli ni udarili zapravo stavljamo novi head na pocetak niza snake
        snake.unshift(newHead);   
    }
    
    createBait(){
        
        let x=Math.floor(Math.random()*this.colLen+1)*box;
        let y=Math.floor(Math.random()*this.rowLen+1)*box;
        console.log({x:x, y:y});
        
        if(collision({x:x, y:y}, this.snake)){
            this.createBait();
        }else{
            this.food={x:x, y:y};
        }
    }
    
}

function getDirection(event){
        
        switch(event.key){
            case "ArrowUp":
                if(dir!=Directions.DOWN){
                    dir=Directions.UP;	
                    console.log('gore');
                }
                break;
            case "ArrowDown":
                if(dir!=Directions.UP){
                    dir=Directions.DOWN;	
                    console.log('dole');
                }
                break;
            case "ArrowLeft":
                if(dir!=Directions.RIGHT){
                    dir=Directions.LEFT;
                    console.log('levo');
                }
                break;
            case "ArrowRight":
                if(dir!=Directions.LEFT){
                    dir=Directions.RIGHT;
                    console.log('desno');
                }
                break;
            }
            
        }

function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x === array[i].x && head.y === array[i].y){
            return true;
        }
    }
    return false;
}


function loadUsername() {
    let person = prompt("Please enter your name", "Harry Potter");
    let username = "";

    if (person == null || person == "") {
        username = "Unknown";
    } else {
        username = person;
    }
    
    return username;
};

const sendResult = async (username, result) => {
    try { 
        const URL = 'http://localhost:3002/';
        const response = await fetch(URL, {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            mode : 'cors',
            body : JSON.stringify({
                name : username,
                score : result
            })
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        
    } catch (err) {
        console.error(err);
    }
}

const getResult = async () => {
    try {
        const URL = 'http://localhost:3002/';
        const response = await fetch(URL, {
            method : 'GET',
            headers : {
                'Content-Type': 'application/json'
            }
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);   
             
    } catch (err) {
        console.log(err);
    }
};
newGameBtn.addEventListener("click", () => {window.location=location.href;});
let snake = new Snake();
document.addEventListener("keydown", event => getDirection(event));
startBtn.addEventListener("click", () => {snake.start();});
stopBtn.addEventListener("click", () => {snake.stop();});




