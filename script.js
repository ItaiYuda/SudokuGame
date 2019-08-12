//the board with the solution
let board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];
const boardSize = 9;
//min - max for random function
let max = 10;
let min = 1;
//row and col borders to iterate over every little square
let squaresBorder = [
    {startRow: 0, endRow: 3, startCol: 0, endCol: 3},
    {startRow: 0, endRow: 3, startCol: 3, endCol: 6},
    {startRow: 0, endRow: 3, startCol: 6, endCol: 9},
    {startRow: 3, endRow: 6, startCol: 0, endCol: 3},
    {startRow: 3, endRow: 6, startCol: 3, endCol: 6},
    {startRow: 3, endRow: 6, startCol: 6, endCol: 9},
    {startRow: 6, endRow: 9, startCol: 0, endCol: 3},
    {startRow: 6, endRow: 9, startCol: 3, endCol: 6},
    {startRow: 6, endRow: 9, startCol: 6, endCol: 9}
];
let inputs = document.getElementsByClassName('box');
//board to display on screen to the user
let gameBoard = [
    [, , , , , , , , ],
    [, , , , , , , , ],
    [, , , , , , , , ],
    [, , , , , , , , ],
    [, , , , , , , , ],
    [, , , , , , , , ],
    [, , , , , , , , ],
    [, , , , , , , , ],
    [, , , , , , , , ]
];
//users list
let users = [{userName: 'abcd', password: '1234'}];
let user = {
    userName: ''
};
let difficult = [60,40,20];
let diffChoise = 0;

function initBoard(){
    let tempArr = [];
    //arr counter to checks whether the number exists on the same row 
    let count = [0,0,0,0,0,0,0,0,0];
    max = 10;
    min = 1;  
    //iterate over the first row of the board and insert number between 1 to 9, i run on column   
    for(let i = 0, row = 0; i < boardSize; i++){
        let rand = Math.floor((Math.random() * (max - min))) + min;
        //function check if the rand number already in the row, if exists iterator i returns one, 
        //else insert to the board and Raises the number in the array counter
        if(!checkCol(row,i, rand, count)){
            i--;
        }
        else{
            board[row][i] = rand;
            count[rand-1]++;
            //A function to reduce the random numbers
            reduceMinMax(count, row);
        }
    }
    //counter for fails to complete the row
    let countFail = 0;
    //iterate from second row to the end of board
    for(let i = 1; i < boardSize; i++){
        max = 10;
        min = 1;
        //tempArr keeps all the numbers that fails to insert to the board in the same row
        tempArr = [];
        countFail = 0;
        for(let j = 0; j < boardSize; j++){
            //if counted 100 fails to complete the row, delete two rows back
            if(countFail > 100){
                countFail = 0;
                resetTwoRows(count , i);
                i--;
            }
            let rand = Math.floor((Math.random() * (max - min))) + min;
            if(!checkCol(i,j, rand, count)){
                j--;
                continue;
            }
            //functions to check that the number dont exists in the row and in the little square, if not insert to the board
            else if(checkRow(i,j,rand) && checkSquare(i,j,rand)){
                board[i][j] = rand;  
            }
            else{
                //if exists trying to insert to tempArr and returns one index j (column)
                if(!tempArr.includes(rand)){
                    tempArr.push(rand);
                }
                j--;
            }
            
            count[rand-1]++;  
            reduceMinMax(count, i);  
            //check if all the numbers to be raffled and if tempArr not empty (at list one number fail insert to the board)
            if(rowFullCheck(count, i) && tempArr.length > 0){
                j++;
                //function that try to insert tempArr to the board, if fails Resets the row and increase countFail by 1
                if(!(insertTempArrToBoard(tempArr, i ,j))){
                    resetRow(count, i);
                    j = -1;
                    max = 10;
                    min = 1;
                    tempArr = [];
    
                    countFail++;
                }
                else{
                    j = boardSize;
                }
                
            }
        }
    }
}

//try to insert tempArr to the board, return true (row complete) or false
function insertTempArrToBoard(tempArr, row, col){
    for(let k = col; k < boardSize; k++){
        let rand = Math.floor((Math.random() * (tempArr.length - 0))) + 0;
        if(checkRow(row,k,tempArr[rand]) && checkSquare(row,k,tempArr[rand])){
            swapTempArr(tempArr, rand);
            board[row][k] = tempArr.pop();
        }
    }
    if(tempArr.length != 0){
        return false;
    }
    else{
        return true;
    }
}
 
//reset two rows of the board and substruct from the counter array if its come to dead end
function resetTwoRows(count, row){
    for(let j = 0; j < boardSize; j++){
        count[j]--;
    }
    for(let i = row-1; i <= row; i++){
        for(let j = 0; j< boardSize; j++){
            board[i][j] = 0;
        }
    }

}

function swapTempArr(tempArr, index){
    let temp = tempArr[index];
    tempArr[index] = tempArr[tempArr.length - 1];
    tempArr[tempArr.length - 1] = temp;
}

//return true if all the numbers raffled in the curent row
function rowFullCheck(count, row){
    for(let i = 0; i < count.length; i++){
        if(count[i] != row + 1){
            return false;
        }        
    }
    return true;
}

function resetRow(count, row){
    for(let i = 0; i< boardSize; i++){
        board[row][i] = 0;
    }
    
    for(let i = 0; i < count.length; i++){
        count[i]--;
    }
}


function checkRow(row,col, num){
    for(let i = 0; i < row; i++){
        if(board[i][col] == num){
            return false;
        }
    }
    return true;
}

function checkCol(i,j, num, count){
    if(count[num-1] == i+1){
        return false;
    }
    return true;
}

function checkSquare(row,col, num){
    let squareIndex = -1;
    //run on squaresBorder {array of objects that keep the row and col borders of little squares} if the sending row and col is between
    //the row and col of the spesific square, keep the index. we will iterate from the strating row and col to the end row and col of the square
    // and return true if the number not exist in the square, false otherwise
    for(let i = 0; i < squaresBorder.length; i++){
        if(squaresBorder[i].startRow <= row && squaresBorder[i].endRow > row &&
            squaresBorder[i].startCol <= col && squaresBorder[i].endCol > col){
            squareIndex = i;
            break;
        }
    }
    for(let i = squaresBorder[squareIndex].startRow; i < squaresBorder[squareIndex].endRow ; i++){
        for(let j = squaresBorder[squareIndex].startCol; j < squaresBorder[squareIndex].endCol; j++){
            if(i == row && j == col){
                return true;
            }
            if(board[i][j] == num){
                return false;
            }
            
        }
    }
}

//function to reduce the min and max to raffle.
function reduceMinMax(count, row){
    let minFlag = true, maxFlag = true;
    for(let start = min - 1,end = max - 2; start < end ;){
        if(minFlag){
            if(count[start] == row+1){
                min = start + 2;
                start++
            }
            else{
                minFlag = false;
            }
        }
        if(maxFlag){
            if(count[end] == row+1){
                max = end + 1;
                end--
            }
            else{
                maxFlag = false;
            }
        }
        if(!maxFlag && !minFlag){
            break;
        }
    }
}





function logIn(){
    let userName = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let msgUserLogIn = document.getElementById('msgUserLogIn');
    let msgPwdLogIn = document.getElementById('msgPwdLogIn');

    
    for(let i =0; i <users.length; i++){
        if(users[i].userName == userName && users[i].password == password){
            user.userName = users[i].userName;
            msgUserLogIn.innerHTML = '';
            containerLogIn.style.display = 'none';
            containerStart.style.display = 'none';
            containerDifficult.style.display = 'block';
            navBarLogOut.style.display = 'none';
            navBarLogIn.style.display = 'flex';
            document.getElementById('printUserName').innerHTML =  userName;
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            return;
        }
        else if(users[i].userName == userName && users[i].password != password){
            msgPwdLogIn.innerHTML = 'Wrong password!';
            msgUserLogIn.innerHTML = '';
            return;
        }
       
    }
    msgUserLogIn.innerHTML = 'User Name doesn\'t exists!';
}





function showBoard(){
    max = 9;
    min = 0;
    for(let i = 0; i < difficult[diffChoise]; i++){
        let randRow = Math.floor((Math.random() * (max - min))) + min;
        let randCol = Math.floor((Math.random() * (max - min))) + min;
        if(gameBoard[randRow][randCol] == null){
            gameBoard[randRow][randCol] = board[randRow][randCol];
        }
        else{
            i--;
        }
    }
    /* split explation
    let str ='hello';
    let arr = str.split('');
    arr = ['h','e','l','l','o'];
    */
    for(let input of inputs){
        let indexs = input.id.split('');
        if(gameBoard[indexs[0]][indexs[1]] != null){
            input.value = gameBoard[indexs[0]][indexs[1]];
            input.disabled = true;
        }
    }
}
function again(){
    resetBoardsAndInputs()
    initBoard();
    showBoard();
}

function resetBoardsAndInputs(){
    gameBoard = [
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,]
    ];
    board = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
    ];
    for(var input of inputs){
        input.disabled = false;
        input.value = null;   
        if(input.classList.contains('errorBox')){
            input.classList.remove('errorBox'); 
        }     
    }
}

function resetDiff(){
    losePopUp.style.display = 'none';
    winPopUp.style.display = 'none';
    containerBoard.style.display = 'none';
    containerDifficult.style.display = 'block';
}

function finish(){
    let winning = true;
    let error = false
    
    for(var input of inputs){
        if(input.disabled == true){
            continue;
        }
        if(input.value == '' || input.value > 9 || input.value < 1){
            input.classList.add('errorBox');
            error = true;
        }
        else{
            let indexs = input.id.split('');
            if(board[indexs[0]][indexs[1]] != input.value && winning){
                winning = false;
            }
        }       
    }
    if(error){
        return;
    }
    if(winning){
        winPopUp.style.display = 'block';
    }
    else{
        losePopUp.style.display = 'block';
    }
    
}

let containerBoard = document.getElementById('container-board');
let containerRegister = document.getElementById('container-register');
let containerLogIn = document.getElementById('container-logIn');
let containerStart = document.getElementById('container-start');
let containerDifficult = document.getElementById('difficult-choise');
let losePopUp = document.getElementById('losePopUp');
let winPopUp = document.getElementById('winPopUp');
let navBarLogOut =  document.getElementById('navBarLogOut');
let navBarLogIn =  document.getElementById('navBarLogIn');



function register(){
    let userName = document.forms['register-form']['username'].value;
    let pwd1 = document.forms['register-form']['pwd1'].value;
    let pwd2 = document.forms['register-form']['pwd2'].value;
    let msgUserReg = document.getElementById('msgUserReg');
    let msgPwd1Reg = document.getElementById('msgPwd1Reg');
    let msgPwd2Reg = document.getElementById('msgPwd2Reg');
    let userSuccess = true;
    let pwd1Success = true;
    
    //user name checks
    let re = /^\w+$/;
    if(userName.length < 4) {
        msgUserReg.innerHTML = "Must contain at least 4 characters";
        userSuccess = false; 
    }
    
    else if(!re.test(userName)) {
        msgUserReg.innerHTML = "Must contain only letters, numbers and underscores";
        userSuccess = false; 
    }
    else{
        for(let i =0; i <users.length; i++){
            if(users[i].userName == userName){
                msgUserReg.innerHTML = "User name already exists";
                return;
            }
        }
        msgUserReg.innerHTML = '';
    }

    
    //password1 checks
    let re1 = /[0-9]/;
    let re2 = /[a-z]/;
    let re3 = /[A-Z]/;
    if(pwd1.length < 4) {
        msgPwd1Reg.innerHTML = "Must contain at least 4 characters";
        pwd1Success = false; 
    }
    else if(pwd1 == userName) {
        msgPwd1Reg.innerHTML = "Must be different from Username";
        pwd1Success = false; 
    }
    else if(!re1.test(pwd1)) {
        msgPwd1Reg.innerHTML = "Must contain at least one digit";
        pwd1Success = false; 
    }
    
    else if(!re2.test(pwd1)) {
        msgPwd1Reg.innerHTML = "Must contain at least one lowercase letter";
        pwd1Success = false; 
    }
    
    else if(!re3.test(pwd1)) {
        msgPwd1Reg.innerHTML = "Must contain at least one uppercase letter";
        pwd1Success = false; 
    }
    else{
        msgPwd1Reg.innerHTML = '';
    }

    if(pwd1Success && userSuccess && pwd1 != pwd2){
        msgPwd2Reg.innerHTML = "Must be equal to password"; 
        pwd1Success = false; 
    }
    else{
        msgPwd2Reg.innerHTML = '';
    }

    if(pwd1Success == true && userSuccess == true){
        containerDifficult.style.display = 'block';
        containerRegister.style.display= 'none';
        containerStart.style.display = 'none';
        navBarLogIn.style.display = 'flex';
        navBarLogOut.style.display = 'none';
        user.userName = userName;
        let newUser = {
            userName: user.userName,
            password: pwd1
        };
        users.push(newUser);
        document.getElementById('printUserName').innerHTML =  userName;
        document.forms['register-form']['username'].value = '';
        document.forms['register-form']['pwd1'].value = '';
        document.forms['register-form']['pwd2'].value = '';
    }
}


function diffcultChoise(diff){
    
    resetBoardsAndInputs();
    diffChoise = diff;
    initBoard();
    showBoard();
    containerBoard.style.display = 'grid';
    containerDifficult.style.display = 'none';
    
}

function changeClassOnfocus(input){
    if(input.classList.contains('errorBox')){
        input.classList.remove('errorBox'); 
    }
}

function changeClassOnBlur(input){
    if(input.value == '' || input.value > 9 || input.value < 1){
        input.classList.add('errorBox');
    }
}

function switchToRegister(){
    containerLogIn.style.display = 'none';
    containerRegister.style.display = 'block';
}

function switchToLogIn(){
    containerRegister.style.display = 'none';
    containerLogIn.style.display = 'block';
}

function KeepPlaying(){
    losePopUp.style.display = 'none';
}

function logOut(){
    user.password = '';
    user.userName = '';
    
    containerBoard.style.display = 'none';
    containerDifficult.style.display = 'none';
    losePopUp.style.display = 'none';
    winPopUp.style.display = 'none';
    navBarLogIn.style.display = 'none';
    containerStart.style.display = 'flex';
    containerLogIn.style.display = 'block';
    navBarLogOut.style.display = 'flex';
}

