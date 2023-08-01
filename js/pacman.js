'use strict'

const PACMAN = '😎';
var gPacman;

function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 5
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {

    if (!gGame.isOn) return

    // console.log('ev', ev);
    const nextLocation = getNextLocation(ev)

    if (!nextLocation) return
    // console.log('nextLocation', nextLocation)

    var nextCell = gBoard[nextLocation.i][nextLocation.j]
    // console.log('NEXT CELL', nextCell)
    // console.log(nextLocation)

    if (nextCell === WALL) return
    if (nextCell === FOOD) updateScore(1)

    if (nextCell === CHERRY) {
        updateScore(10)
        playSound('audio/eat.mp3')
    }

    if (nextCell === SUPERFOOD) {
        if (gPacman.isSuper) return
        updateScore(1)
        initSuperMode()
        playSound('audio/eat.mp3')
    }

    else if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            eatGhost(nextLocation)

        } else {
            renderCell(gPacman.location, '<span>💀</span>')
            notifyLoser()
            gameOver()
            return
        }
    }


    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY

    // update the DOM
    renderCell(gPacman.location, EMPTY)

    // update the model
    gPacman.location = nextLocation
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN

    // update the DOM
    renderCell(gPacman.location, PACMAN)

    //check for win:
    checkWin()
}

function endSuperMode() {
    gPacman.isSuper = false
    reviveGhosts()
    gGhosts.forEach(ghost => ghost.color = getRandomColor())
}

function reviveGhosts() {
    for (var i = gGhostsGraveyard.length; i > 0; i--) {
        var ghost = gGhostsGraveyard.pop()
        // console.log(gGhostsGraveyard.length)
        gGhosts.push(ghost)
    }
}

function eatGhost(location) {

    // console.log(location)
    var ghostObj

    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === location.i &&
            gGhosts[i].location.j === location.j) {
            ghostObj = gGhosts.splice(i, 1)
        }
    }

    // console.log(ghostObj, gGhosts)
    gGhostsGraveyard.unshift(ghostObj[0])
}

function initSuperMode() {
    gPacman.isSuper = true
    gGhosts.forEach(ghost => ghost.color = '#6e2aa9b1')
    gGhosts.forEach(ghost => renderCell(ghost.location, getGhostHTML(ghost)))
    setTimeout(endSuperMode, 5000)
}

function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--;
            break;
        case 'ArrowDown':
            nextLocation.i++;
            break;
        case 'ArrowLeft':
            nextLocation.j--;
            break;
        case 'ArrowRight':
            nextLocation.j++;
            break;
        default:
            return null;
    }
    return nextLocation;
}