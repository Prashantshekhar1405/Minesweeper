const boardsize = 10;
const mines = 15;
const board = [];
const boardElement = document.getElementById('board');
const safecell = boardsize * boardsize - mines;
const blastSound = new Audio('./sounds/mixkit-arcade-game-explosion-2759.wav');
const restartbutton = document.querySelector('.restart');
let firstClick = false;
let running = false;
let startTime , updatedTime , TimeInterval , difference;
let savedTime = 0;
let status = false;

function init() {
    for(let r = 0; r < boardsize; r++){
        board[r] = [];
        for(let c = 0; c < boardsize; c++){
            const cell = {
                ismine : false ,
                isReaveled : false ,
                isFlaged : false , 
                adjacentmines : 0 ,
                element : document.createElement('div')
            };
            const el = cell.element;
            el.classList.add('cell');
            el.dataset.row = r;
            el.dataset.col = c;

            el.addEventListener('click' , () => handdleClick(r, c));
            el.addEventListener('contextmenu' , (e) => {
                e.preventDefault();
                ToggleFlag(r , c);
            });

            boardElement.appendChild(el);
            board[r][c] = cell;
        }
    }
    placemines();
    calculateAdjacentmines();
}

function placemines(){
    let placed = 0;
    while(placed < mines){
        const r = Math.floor(Math.random() * boardsize);
        const c = Math.floor(Math.random() * boardsize);
        if(!board[r][c].ismine){
            board[r][c].ismine = true;
            placed++;
        } 
    }
}
function calculateAdjacentmines(){
    for(let r = 0; r < boardsize; r++){
        for(let c = 0; c < boardsize; c++){
            let count = 0; 
            for(let dr = -1; dr <= 1; dr++){
                for(let dc = -1; dc <= 1; dc++){
                    let nr = r + dr;
                    let nc = c + dc;
                    if(nr >= 0 && nr < boardsize && nc >= 0 && nc < boardsize){
                        if(board[nr][nc].ismine) count++;
                    }
                }
            }
            board[r][c].adjacentmines = count;
        }
    }
}

let isReaveledSafecell = 0;

function handdleClick(r , c){
    if(!firstClick) {
        StartTimer();
        firstClick = true;
        document.getElementById("status-now").innerHTML = `<img class = "status-img" src = "https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUycjQzbDdtd3gzY3BhbjRzOXY5c2p4aTZ4cXo3MHpvZWZtbnJ4dnc4NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Xn2xCPbUeDYKFtU1YT/source.gif" >`;
    }
    const cell = board[r][c];
    if(cell.isReaveled || cell.isFlaged) return;

    cell.isReaveled = true;
    cell.element.classList.add('revealed');

    if(cell.ismine){
        blastSound.play();
        cell.element.textContent = '💣';
        for(let i = 0; i < boardsize; i++){
            for(let j = 0; j < boardsize; j++){
                const cell = board[i][j];
                if(cell.ismine){
                    const sound = new Audio('./sounds/mixkit-arcade-game-explosion-2759.wav');
                    sound.play();
                    cell.element.textContent = '💣';
                }
            }
        }
        StopTimer();
        document.getElementById("status-now").textContent = "Game Over";
        return;
    }

    isReaveledSafecell++;
    if(isReaveledSafecell === safecell){
        alert(" 🎉 you win")
    }

    if(cell.adjacentmines > 0){
        cell.element.textContent = cell.adjacentmines;
    }
    else {
        for(let dr = -1; dr <= 1; dr++){
            for(let dc = -1; dc <= 1; dc++){
                nr = r + dr;
                nc = c + dc;
                if(nr >= 0 && nr < boardsize && nc >= 0 && nc < boardsize){
                    handdleClick(nr , nc);
                }
            }
        }
    }
}
function ToggleFlag(r , c){
    if(!firstClick) {
        StartTimer();
        firstClick = true;
    }
    const cell = board[r][c];
    if(cell.isReaveled) return;

    cell.isFlaged = !cell.isFlaged;
    cell.element.textContent = cell.isFlaged ? '🚩' : '';
}

restartbutton.addEventListener('click', () => {
    boardElement.innerHTML = '';
    isReaveledSafecell = 0;
    init();
    ResetTimer();
    firstClick = false;
    document.getElementById("status-now").textContent = "let's play";
});
init();

function StartTimer() {
    if(!running){
        startTime = new Date().getTime() - savedTime;
       
        TimeInterval = setInterval(updateTime , 1);
        running = true;
    }
}
function ResetTimer() {
    clearInterval(TimeInterval);
    running = false;
    savedTime = 0;

    document.getElementById("minutes").innerHTML = "00";
    document.getElementById("seconds").innerHTML = "00"
    document.getElementById("milliseconds").innerHTML = "000";
}
function StopTimer() {
    if(running){
        clearInterval(TimeInterval);
        savedTime = new Date().getTime() - startTime;
        running = false;  
    }
}
function updateTime() {
    updatedTime = new Date().getTime();
    difference =  updatedTime - startTime;
    let minutes = Math.floor(difference / 60000);
    let seconds = Math.floor((difference % 60000) / 1000);
    let milliseconds = difference % 1000;

    document.getElementById("minutes").innerHTML = minutes.toString().padStart(2 , 0);
    document.getElementById("seconds").innerHTML = seconds.toString().padStart(2 , 0);
    document.getElementById("milliseconds").innerHTML = milliseconds.toString().padStart(3 , 0);
}