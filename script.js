const boardsize = 10;
const mines = 15;
const board = [];
const boardElement = document.getElementById('board');
const safecell = boardsize * boardsize - mines;
const blastSound = new Audio('./sounds/mixkit-arcade-game-explosion-2759.wav');

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
        alert("💥 game Over");
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
    const cell = board[r][c];
    if(cell.isReaveled) return;

    cell.isFlaged = !cell.isFlaged;
    cell.element.textContent = cell.isFlaged ? '🚩' : '';
}
// function Reavealallmines(){
   
// }
// function logMinePositions() {
//     console.log("💣 Mine Positions:");
//     for (let r = 0; r < boardsize; r++) {
//         for (let c = 0; c < boardsize; c++) {
//             if (board[r][c].ismine) {
//                 console.log(`Mine at: (${r}, ${c})`);
//             }
//         }
//     }
// }
init();
// logMinePositions();