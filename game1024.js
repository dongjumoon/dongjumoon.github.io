document.body.style.height = window.innerHeight + 'px';

game1024 = {
    emptyYxList: [
        '00', '01', '02', '03',
        '10', '11', '12', '13',
        '20', '21', '22', '23',
        '30', '31', '32', '33'
    ],
    rootData: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    transitionTime: 200,
    animationTime: 900,
    root: undefined,
    readyOfAction: false,
    rootColumn: 4,
    rootRow: 4,
    startNumber: 2, //2의 n 승 숫자만 가능(디자인 관련문제).
    goalNumber: Math.pow(2, 10), // startNumber 의 10승
    numberClassPrefix: 'item-num',
    yxClassPrefix: 'yx',

    start: function(root) {
        this.root = root;
        this.root.innerHTML = "";
        // 4*4 게임판 배경 생성
        for (var i = 0; i < this.rootColumn * this.rootRow; i++) {
            var li = document.createElement('li');
            li.className = 'item-base';
            this.root.insertAdjacentElement('afterbegin', li);
        }

        var div = document.createElement('div');
        div.className = 'game-over-screen';
        this.root.insertAdjacentElement('afterbegin', div);

        this.addNewItem();
        this.readyOfAction = true;
    },
    addNewItem: function() {
        var newNum = this.getNewNumber();
        var newYx = this.randomChoice(this.emptyYxList);
        var item = document.createElement('div');
        item.className = this.getNumberClassName(newNum) + ' ' + this.getYxClassName(newYx) + ' invisible';
        this.root.insertAdjacentElement('beforeend', item);
        setTimeout(function(){
            item.className = this.getNumberClassName(newNum) + ' ' + this.getYxClassName(newYx);
        }, this.transitionTime / 2);

        var y = newYx.charAt(0);
        var x = newYx.charAt(1);

        this.rootData[y][x] = newNum;
        this.removeEmptyYx(y,x);
    },
    randomChoice: function(arr) {
        var randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    },
    getNewNumber: function() {
        return Math.random() < 0.8 ? this.startNumber : this.startNumber + this.startNumber;
    },
    isGameOver: function() {
        for (var y = 0; y < this.rootRow; y++) {
            for (var x = 0; x < this.rootColumn - 1; x++) {
                if (this.rootData[y][x] === this.rootData[y][x+1])
                    return false;
            }
        }
        for (var y = 0; y < this.rootRow - 1; y++) {
            for (var x = 0; x < this.rootColumn; x++) {
                if (this.rootData[y][x] === this.rootData[y+1][x])
                    return false;
            }
        }
        return true;
    },
    isVictory: function() {
        for (var y = 0; y < this.rootData.length; y++) {
            for (var x = 0; x < this.rootData[y].length; x++) {
                if (this.rootData[y][x] === this.goalNumber) {
                    return true;
                }
            }
        }
        return false;
    },
    onGameOver: function() {
        setTimeout(function() {
            document.querySelector('.game-over-screen').style.opacity = 1;
        }, 1000)
    },
    onVictory: function() {
        setTimeout(function() {
            alert('you win');
        }, 1000)
    },
    removeEmptyYx: function(y, x) {
        var yx = '' + y + x;
        var removeIndex = this.emptyYxList.indexOf(yx);
        if (removeIndex >= 0) {
            this.emptyYxList.splice(removeIndex, 1);
        }
    },
    removeNumber: function(item) {
        setTimeout(function() {
            item.parentNode.removeChild(item);
        }, this.transitionTime)
    },
    doubleNumber: function(item) {
        var yx = this.getYx(item);
        var y = yx.charAt(0);
        var x = yx.charAt(1);

        this.rootData[y][x] *= 2;
        setTimeout(function() {
            for (var i = 0; i < item.length; i++) {
                var yx = game1024.getYx(item[i]);
                var y = yx.charAt(0);
                var x = yx.charAt(1);

                item[i].className = this.getNumberClassName(game1024.rootData[y][x]) + ' ' + this.getYxClassName(yx);
                item[i].classList.add('uniteItem');
            }
            setTimeout(function() {
                for (var i = 0; i < item.length; i ++) {
                    item[i].classList.remove('uniteItem');
                }
            }, game1024.animationTime);
        }, this.transitionTime)
    },
    onDoubleAnimation: function(item) {
        // TODO;
    },
    getYxClassName: function(yx) {
        return this.yxClassPrefix + yx;
    },
    getRootData: function() {
        // TODO;
    },
    getY: function(item) {
        var clsName = item.className;
        return clsName.substr(clsName.indexOf(this.yxClassPrefix) + this.yxClassPrefix.length, 1);
    },
    getX: function(item) {
        var clsName = item.className;
        return clsName.substr(clsName.indexOf(this.yxClassPrefix) + this.yxClassPrefix.length + 1, 1);
    },
    getNumberClassName: function(number) {
        return this.numberClassPrefix + number;
    },
    moveItem: function(fromY, fromX, toY, toX) {
        var Item = document.querySelector('.' + this.getYxClassName('' + fromY + fromX));
        Item.classList.add(this.getYxClassName('' + toY + toX));
        Item.classList.remove(this.getYxClassName('' + fromY + fromX));
        this.rootData[toY][toX] = this.rootData[fromY][fromX];
        this.rootData[fromY][fromX] = 0;
    },
    getYx: function(item) {
        var clsName = item.className;
        return clsName.substr(clsName.indexOf(this.yxClassPrefix) + this.yxClassPrefix.length, 2);
    },

    action: function(way) {
        if (this.readyOfAction === false)
            return;
        this.readyOfAction = false;

        var operation = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        operation[way] = true;

        this.emptyYxList = [
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
            for (var x = 0; x < 4; x++) {
                var moveToX = 0;
                var moveToY = x;
                for (var y = 1; y < 4; y++) {
                    if (this.rootData[y][x] === 0) {
                        continue;
                    } else if (this.rootData[moveToX][moveToY] === 0) {
                        this.moveItem(y, x, moveToX, moveToY);
                        moveCount++;
                    } else if (this.rootData[moveToX][moveToY] !== this.rootData[y][x]) {
                        this.removeEmptyYx(moveToX, moveToY);
                        moveToX++;
                        if (!(moveToX === y && moveToY === x)) {
                            this.moveItem(y, x, moveToX, moveToY);
                            moveCount++;
                        }
                    } else {
                        var doubleItem = document.querySelector('.' + this.yxClassPrefix + y + x);
                        var deleteItem = document.querySelector('.' + this.yxClassPrefix + moveToX + moveToY);
                        this.moveItem(y, x, moveToX, moveToY);
                        moveCount++;
                        removeItemList.push(deleteItem);
                        uniteItemList.push(doubleItem);
                        this.removeEmptyYx(moveToX, moveToY);
                        moveToX++;
                    }
                }
                if (this.rootData[moveToX][moveToY] !== 0) {
                    this.removeEmptyYx(moveToX, moveToY);
                }
            }
        }

        if(operation.down) { // 하
            // 33 23 13 03
            // 32 22 12 02
            // 31 21 11 01
            // 30 20 10 00
            for (var x = 3; x >= 0; x--) {
                var moveToX = 3;
                var moveToY = x;
                for (var y = 2; y >= 0; y--) {
                    if (this.rootData[y][x] === 0) {
                        continue;
                    } else if (this.rootData[moveToX][moveToY] === 0) {
                        this.moveItem(y, x, moveToX, moveToY);
                        moveCount++;
                    } else if (this.rootData[moveToX][moveToY] !== this.rootData[y][x]) {
                        this.removeEmptyYx(moveToX, moveToY);
                        moveToX--;
                        if (!(moveToX === y && moveToY === x)) {
                            this.moveItem(y, x, moveToX, moveToY);
                            moveCount++;
                        }
                    } else {
                        var doubleItem = document.querySelector('.' + this.yxClassPrefix + y + x);
                        var deleteItem = document.querySelector('.' + this.yxClassPrefix + moveToX + moveToY);
                        this.moveItem(y, x, moveToX, moveToY);
                        moveCount++;
                        removeItemList.push(deleteItem);
                        uniteItemList.push(doubleItem);
                        this.removeEmptyYx(moveToX, moveToY);
                        moveToX--;
                    }
                }
                if (this.rootData[moveToX][moveToY] !== 0) {
                    this.removeEmptyYx(moveToX, moveToY);
                }
            }
        }

        if(operation.left) { // 좌
            // 00 01 02 03
            // 10 11 12 13
            // 20 21 22 23
            // 30 31 32 33
            for (var y = 0; y < 4; y++) {
                var moveToX = y;
                var moveToY = 0;
                for (var x = 1; x < 4; x++) {
                    if (this.rootData[y][x] === 0) {
                        continue;
                    } else if (this.rootData[moveToX][moveToY] === 0) {
                        this.moveItem(y, x, moveToX, moveToY);
                        moveCount++;
                    } else if (this.rootData[moveToX][moveToY] !== this.rootData[y][x]) {
                        this.removeEmptyYx(moveToX, moveToY);
                        moveToY++;
                        if (!(moveToX === y && moveToY === x)) {
                            this.moveItem(y, x, moveToX, moveToY);
                            moveCount++;
                        }
                    } else {
                        var doubleItem = document.querySelector('.' + this.yxClassPrefix + y + x);
                        var deleteItem = document.querySelector('.' + this.yxClassPrefix + moveToX + moveToY);
                        this.moveItem(y, x, moveToX, moveToY);
                        moveCount++;
                        removeItemList.push(deleteItem);
                        uniteItemList.push(doubleItem);
                        this.removeEmptyYx(moveToX, moveToY);
                        moveToY++;
                    }
                }
                if (this.rootData[moveToX][moveToY] !== 0) {
                    this.removeEmptyYx(moveToX, moveToY);
                }
            }
        }

        if(operation.right) { // 우
            // 33 32 31 30
            // 23 22 21 20
            // 13 12 11 10
            // 03 02 01 00
            for (var y = 3; y >= 0; y--) {
                var moveToX = y;
                var moveToY = 3;
                for (var x = 2; x >= 0; x--) {
                    if (this.rootData[y][x] === 0) {
                        continue;
                    } else if (this.rootData[moveToX][moveToY] === 0) {
                        this.moveItem(y, x, moveToX, moveToY);
                        moveCount++;
                    } else if (this.rootData[moveToX][moveToY] !== this.rootData[y][x]) {
                        this.removeEmptyYx(moveToX, moveToY);
                        moveToY--;
                        if (!(moveToX === y && moveToY === x)) {
                            this.moveItem(y, x, moveToX, moveToY);
                            moveCount++;
                        }
                    } else {
                        var doubleItem = document.querySelector('.' + this.yxClassPrefix + y + x);
                        var deleteItem = document.querySelector('.' + this.yxClassPrefix + moveToX + moveToY);
                        this.moveItem(y, x, moveToX, moveToY);
                        moveCount++;
                        removeItemList.push(deleteItem);
                        uniteItemList.push(doubleItem);
                        this.removeEmptyYx(moveToX, moveToY);
                        moveToY--;
                    }
                }
                if (this.rootData[moveToX][moveToY] !== 0) {
                    this.removeEmptyYx(moveToX, moveToY);
                }
            }
        }


        if (moveCount > 0) {
            if (removeItemList.length > 0) {
                game1024.removeNumber(removeItemList);
                game1024.doubleNumber(uniteItemList);

                if (this.isVictory()) {
                    this.onVictory();
                    return;
                }
            }

            this.addNewItem();
            if (this.emptyYxList.length === 0) {
                if (this.isGameOver()) {
                    this.onGameOver();
                    return;
                }
            }
        }

        setTimeout(function(){
            game1024.readyOfAction = true;
        }, this.transitionTime + 30)

    }
}
