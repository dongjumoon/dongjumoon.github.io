game1024 = {
    emptyXyList: [
        '00', '01', '02', '03',
        '10', '11', '12', '13',
        '20', '21', '22', '23',
        '30', '31', '32', '33'
    ],
    gameBoxData: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    transitionTime: 200,
    gameBox: {},
    ready: false,

    start: function(backgroundElement) {
        this.gameBox = backgroundElement;
        this.gameBox.innerHTML = "";
        // 4*4 게임판 배경 생성
        for (var i = 0; i < 16; i++) {
            var li = document.createElement('li');
            li.className = 'item-base';
            this.gameBox.insertAdjacentElement('afterbegin', li);
        }

        this.addNewItem();
        this.ready = true;
    },
    addNewItem: function() {
        var randomIndex = Math.floor(Math.random() * this.emptyXyList.length);
        var newNum = Math.random() < 0.8 ? 2 : 4;
        var newXy = this.emptyXyList[randomIndex];
        var item = document.createElement('div');
        item.className = 'item-num' + newNum + ' xy' + newXy + ' invisible';
        this.gameBox.insertAdjacentElement('beforeend', item);
        setTimeout(function(){
            item.className = 'item-num' + newNum + ' xy' + newXy;
        }, this.transitionTime / 2);

        var x = newXy.charAt(0);
        var y = newXy.charAt(1);

        this.gameBoxData[x][y] = newNum;
        this.removePlace(x,y);
    },
    confirmGameOver: function() {
        for (var x = 0; x < 4; x++) {
            for (var y = 0; y < 3; y++) {
                if (this.gameBoxData[x][y] === this.gameBoxData[x][y+1])
                    return false;
            }
        }
        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 4; y++) {
                if (this.gameBoxData[x][y] === this.gameBoxData[x+1][y])
                    return false;
            }
        }
        return true;
    },
    confirmVictory: function() {
        for (var x = 0; x < this.gameBoxData.length; x++) {
            for (var y = 0; y < this.gameBoxData[x].length; y++) {
                if (this.gameBoxData[x][y] === 1024) {
                    return true;
                }
            }
        }
        return false;
    },
    gameOver: function() {
        alert('game over');
    },
    youWin: function() {
        alert('you win');
    },
    removePlace: function(x, y) {
        var xy = '' + x + y;
        var removeIndex = this.emptyXyList.indexOf(xy);
        if (removeIndex >= 0) {
            this.emptyXyList.splice(removeIndex, 1);
        }
    },
    removeElement: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    },
    addUniteAnimation: function(elements) {
        for (var i = 0; i < elements.length; i ++) {
            var clsName = elements[i].className;
            var xy = clsName.substr(clsName.indexOf('xy') + 2, 2);
            var x = xy.charAt(0);
            var y = xy.charAt(1);

            this.gameBoxData[x][y] *= 2;
            elements[i].className = 'item-num' + this.gameBoxData[x][y] + ' xy' + xy;
            elements[i].classList.add('uniteItem');
        }
        setTimeout(function() {
            for (var i = 0; i < elements.length; i ++) {
                elements[i].classList.remove('uniteItem');
            }
        }, this.transitionTime);
    },
    moveItem: function(x, y, moveToX, moveToY) {
        var Item = document.querySelector('.xy' + x + y);
        Item.classList.add('xy' + moveToX + moveToY);
        Item.classList.remove('xy' + x + y);
        this.gameBoxData[moveToX][moveToY] = this.gameBoxData[x][y];
        this.gameBoxData[x][y] = 0;
    },

    action: function(way) {
        if (this.ready === false)
            return;
        this.ready = false;

        var operation = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        operation[way] = true;

        this.emptyXyList = [
            '00', '01', '02', '03',
            '10', '11', '12', '13',
            '20', '21', '22', '23',
            '30', '31', '32', '33'
        ];
        var moveCount = 0;
        var removeItemList = [];
        var uniteItemList = [];


        if(operation.up) { // 상
            // 00 10 20 30
            // 01 11 21 31
            // 02 12 22 32
            // 03 13 23 33
            for (var y = 0; y < 4; y++) {
                var moveToX = 0;
                var moveToY = y;
                for (var x = 1; x < 4; x++) {
                    if (this.gameBoxData[x][y] === 0) {
                        continue;
                    } else if (this.gameBoxData[moveToX][moveToY] === 0) {
                        this.moveItem(x, y, moveToX, moveToY);
                        moveCount++;
                    } else if (this.gameBoxData[moveToX][moveToY] !== this.gameBoxData[x][y]) {
                        this.removePlace(moveToX, moveToY);
                        moveToX++;
                        if (!(moveToX === x && moveToY === y)) {
                            this.moveItem(x, y, moveToX, moveToY);
                            moveCount++;
                        }
                    } else {
                        var doubleItem = document.querySelector('.xy' + x + y);
                        var deleteItem = document.querySelector('.xy' + moveToX + moveToY);
                        this.moveItem(x, y, moveToX, moveToY);
                        moveCount++;
                        removeItemList.push(deleteItem);
                        uniteItemList.push(doubleItem);
                        this.removePlace(moveToX, moveToY);
                        moveToX++;
                    }
                }
                if (this.gameBoxData[moveToX][moveToY] !== 0) {
                    this.removePlace(moveToX, moveToY);
                }
            }
        }

        if(operation.down) { // 하
            // 33 23 13 03
            // 32 22 12 02
            // 31 21 11 01
            // 30 20 10 00
            for (var y = 3; y >= 0; y--) {
                var moveToX = 3;
                var moveToY = y;
                for (var x = 2; x >= 0; x--) {
                    if (this.gameBoxData[x][y] === 0) {
                        continue;
                    } else if (this.gameBoxData[moveToX][moveToY] === 0) {
                        this.moveItem(x, y, moveToX, moveToY);
                        moveCount++;
                    } else if (this.gameBoxData[moveToX][moveToY] !== this.gameBoxData[x][y]) {
                        this.removePlace(moveToX, moveToY);
                        moveToX--;
                        if (!(moveToX === x && moveToY === y)) {
                            this.moveItem(x, y, moveToX, moveToY);
                            moveCount++;
                        }
                    } else {
                        var doubleItem = document.querySelector('.xy' + x + y);
                        var deleteItem = document.querySelector('.xy' + moveToX + moveToY);
                        this.moveItem(x, y, moveToX, moveToY);
                        moveCount++;
                        removeItemList.push(deleteItem);
                        uniteItemList.push(doubleItem);
                        this.removePlace(moveToX, moveToY);
                        moveToX--;
                    }
                }
                if (this.gameBoxData[moveToX][moveToY] !== 0) {
                    this.removePlace(moveToX, moveToY);
                }
            }
        }

        if(operation.left) { // 좌
            // 00 01 02 03
            // 10 11 12 13
            // 20 21 22 23
            // 30 31 32 33
            for (var x = 0; x < 4; x++) {
                var moveToX = x;
                var moveToY = 0;
                for (var y = 1; y < 4; y++) {
                    if (this.gameBoxData[x][y] === 0) {
                        continue;
                    } else if (this.gameBoxData[moveToX][moveToY] === 0) {
                        this.moveItem(x, y, moveToX, moveToY);
                        moveCount++;
                    } else if (this.gameBoxData[moveToX][moveToY] !== this.gameBoxData[x][y]) {
                        this.removePlace(moveToX, moveToY);
                        moveToY++;
                        if (!(moveToX === x && moveToY === y)) {
                            this.moveItem(x, y, moveToX, moveToY);
                            moveCount++;
                        }
                    } else {
                        var doubleItem = document.querySelector('.xy' + x + y);
                        var deleteItem = document.querySelector('.xy' + moveToX + moveToY);
                        this.moveItem(x, y, moveToX, moveToY);
                        moveCount++;
                        removeItemList.push(deleteItem);
                        uniteItemList.push(doubleItem);
                        this.removePlace(moveToX, moveToY);
                        moveToY++;
                    }
                }
                if (this.gameBoxData[moveToX][moveToY] !== 0) {
                    this.removePlace(moveToX, moveToY);
                }
            }
        }

        if(operation.right) { // 우
            // 33 32 31 30
            // 23 22 21 20
            // 13 12 11 10
            // 03 02 01 00
            for (var x = 3; x >= 0; x--) {
                var moveToX = x;
                var moveToY = 3;
                for (var y = 2; y >= 0; y--) {
                    if (this.gameBoxData[x][y] === 0) {
                        continue;
                    } else if (this.gameBoxData[moveToX][moveToY] === 0) {
                        this.moveItem(x, y, moveToX, moveToY);
                        moveCount++;
                    } else if (this.gameBoxData[moveToX][moveToY] !== this.gameBoxData[x][y]) {
                        this.removePlace(moveToX, moveToY);
                        moveToY--;
                        if (!(moveToX === x && moveToY === y)) {
                            this.moveItem(x, y, moveToX, moveToY);
                            moveCount++;
                        }
                    } else {
                        var doubleItem = document.querySelector('.xy' + x + y);
                        var deleteItem = document.querySelector('.xy' + moveToX + moveToY);
                        this.moveItem(x, y, moveToX, moveToY);
                        moveCount++;
                        removeItemList.push(deleteItem);
                        uniteItemList.push(doubleItem);
                        this.removePlace(moveToX, moveToY);
                        moveToY--;
                    }
                }
                if (this.gameBoxData[moveToX][moveToY] !== 0) {
                    this.removePlace(moveToX, moveToY);
                }
            }
        }


        if (moveCount > 0) {
            if (removeItemList.length > 0) {
                setTimeout(function() {
                    game1024.removeElement(removeItemList);
                    game1024.addUniteAnimation(uniteItemList);
                }, this.transitionTime)

                if (this.confirmVictory()) {
                    setTimeout(game1024.youWin,1000);
                    return;
                }
            }

            this.addNewItem();
            if (this.emptyXyList.length === 0) {
                if (this.confirmGameOver()) {
                    setTimeout(game1024.gameOver,1000);
                    return;
                }
            }
        }

        setTimeout(function(){
            game1024.ready = true;
        }, this.transitionTime + 30)

    }
}
