'use strict'

const WALL = '🌵'
const FOOD = '.'
const EMPTY = ' '
const SUPERFOOD = '🍔'
const CHERRY = '🍒'

var gGame = {
    score: 0,
    isOn: false
}

var gBoard
var gCherryIntervalId

function init() {
    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)
    renderBoard(gBoard, '.board-container')

    updateScore(-gGame.score)
    hideModal()

    gGame.isOn = true
    initRandomCherryInterval()
    playSound('audio/gamestart.mp3')
}

function buildBoard() {
    const SIZE = 10
    const board = []

    for (var i = 0; i < SIZE; i++) {
        board.push([])

        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === SIZE - 1 ||
                j === 0 || j === SIZE - 1 ||
                (j === 3 && i > 4 && i < SIZE - 2)) {
                board[i][j] = WALL
            }

            if (i === 1 && j === 1 ||
                i === 1 && j === 8 ||
                i === 8 && j === 1 ||
                i === 8 && j === 8) {
                board[i][j] = SUPERFOOD
            }

        }
    }
    return board
}

function checkWin() {
    if (countItems(gBoard, FOOD)) return false

    greetWinner()
    showModal()
    gameOver()
    return true
}

function updateScore(diff) {
    gGame.score += diff
    document.querySelector('h2 span').innerText = gGame.score
}

function initRandomCherryInterval() {
    gCherryIntervalId = setInterval(placeRandomCherry, 15000)
}

function placeRandomCherry() {
    //DONE: find empty locations to plcae cherry
    //DONE: place cherry in random location inside the model
    //DONE: render cell
    var emptyLocations = findLocations(gBoard, ' ')
    const randIdx = getRandomInt(0, emptyLocations.length)
    const randLocation = emptyLocations[randIdx]

    //Model
    gBoard[randLocation.i][randLocation.j] = CHERRY

    //DOM
    renderCell(randLocation, CHERRY)
}

function gameOver() {
    gGame.isOn = false
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryIntervalId)
}

function notifyLoser() {
    const elP = document.querySelector('.modal p')
    elP.innerText = 'Oops! you lost😭'
    showModal()
    playSound('audio/gameover.mp3')
}

function greetWinner() {
    const elP = document.querySelector('.modal p')
    elP.innerText = 'Congrats! you win!🏆'
    showModal()
    playSound('audio/win.mp3')
}

function hideModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')
}

function showModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('hide')
}