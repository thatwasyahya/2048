document.addEventListener('DOMContentLoaded', () => {
    const cells = Array.from(document.querySelectorAll('.cell'));
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const restartButton = document.getElementById('restart');
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    bestScoreDisplay.textContent = bestScore;

    function addNumber() {
        const emptyCells = cells.filter(cell => !cell.textContent);
        if (emptyCells.length === 0) return;
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.textContent = 2;
        randomCell.setAttribute('data-value', '2');
    }

    function move(direction) {
        let moved = false;

        const moveRowLeft = row => {
            let newRow = row.filter(num => num);
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    newRow[i + 1] = 0;
                    updateScore(newRow[i]);
                }
            }
            return newRow.filter(num => num).concat(Array(4 - newRow.filter(num => num).length).fill(0));
        };

        const rotateGrid = (grid, times) => {
            const newGrid = Array.from({ length: 4 }, () => Array(4).fill(0));
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (times === 1) newGrid[j][3 - i] = grid[i][j];
                    if (times === 2) newGrid[3 - i][3 - j] = grid[i][j];
                    if (times === 3) newGrid[3 - j][i] = grid[i][j];
                    if (times === 0) newGrid[i][j] = grid[i][j];
                }
            }
            return newGrid;
        };

        const getGrid = () => {
            const grid = [];
            for (let i = 0; i < 4; i++) {
                grid.push([0, 1, 2, 3].map(j => cells[i * 4 + j].textContent ? parseInt(cells[i * 4 + j].textContent) : 0));
            }
            return grid;
        };

        const setGrid = (grid) => {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (cells[i * 4 + j].textContent != grid[i][j]) moved = true;
                    cells[i * 4 + j].textContent = grid[i][j] ? grid[i][j] : '';
                    cells[i * 4 + j].setAttribute('data-value', grid[i][j] ? grid[i][j] : '');
                }
            }
        };

        let grid = getGrid();

        if (direction === 'left') {
            for (let i = 0; i < 4; i++) {
                grid[i] = moveRowLeft(grid[i]);
            }
        } else if (direction === 'right') {
            grid = rotateGrid(grid, 2);
            for (let i = 0; i < 4; i++) {
                grid[i] = moveRowLeft(grid[i]);
            }
            grid = rotateGrid(grid, 2);
        } else if (direction === 'up') {
            grid = rotateGrid(grid, 1);
            for (let i = 0; i < 4; i++) {
                grid[i] = moveRowLeft(grid[i]);
            }
            grid = rotateGrid(grid, 3);
        } else if (direction === 'down') {
            grid = rotateGrid(grid, 3);
            for (let i = 0; i < 4; i++) {
                grid[i] = moveRowLeft(grid[i]);
            }
            grid = rotateGrid(grid, 1);
        }

        setGrid(grid);
        if (moved) addNumber();
    }

    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = score;
        if (score > bestScore) {
            bestScore = score;
            bestScoreDisplay.textContent = bestScore;
            localStorage.setItem('bestScore', bestScore);
        }
    }

    function restartGame() {
        cells.forEach(cell => {
            cell.textContent = '';
            cell.removeAttribute('data-value');
        });
        score = 0;
        scoreDisplay.textContent = score;
        addNumber();
        addNumber();
    }

    restartButton.addEventListener('click', restartGame);

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                move('down');
                break;
            case 'ArrowDown':
                move('up');
                break;
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
        }
    });

    addNumber();
    addNumber();
});
