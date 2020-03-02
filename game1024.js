document.body.style.height = window.innerHeight + 'px';

game1024 = {
    emptyYxList: undefined,
    rootData: undefined,
    transitionTime: 200,
    animationTime: 300,
    root: undefined,
    readyOfAction: false,
    rootColumn: 8,
    rootRow: 8,
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
        var rootData = [];
        for (var y = 0; y < this.rootRow; y++) {
            var arr = [];
            for (var x = 0; x < this.rootColumn; x++) {
                arr.push(0);
            }
            rootData.push(arr);
        }
        this.rootData = rootData;

        this.resetEmptyYxList();

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
            item.className = game1024.getNumberClassName(newNum) + ' ' + game1024.getYxClassName(newYx);
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
            game1024.onDoubleAnimation(yx);
        }, this.transitionTime);
    },
    onDoubleAnimation: function(yx) {
        var item = this.getItem(yx);
        var y = yx.charAt(0);
        var x = yx.charAt(1);

        item.className = game1024.getNumberClassName(game1024.rootData[y][x]) + ' ' + game1024.getYxClassName(yx);
        item.classList.add('uniteItem');

        setTimeout(function() {
                item.classList.remove('uniteItem');
        }, this.animationTime);
    },
    getItem: function(yx) {
        return document.querySelector('.' + this.getYxClassName(yx));
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
    resetEmptyYxList: function() {
        var arr = [];

        for (var y = 0; y < this.rootRow; y++) {
            for (var x = 0; x < this.rootColumn; x++) {
                arr.push('' + y + x);
            }
        }

        this.emptyYxList = arr;
    },
    action: function(way) {
        if (this.readyOfAction === false)
            return;

        var operation = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        operation[way] = true;

        if(operation.up  || operation.down || operation.left || operation.right) {
            this.readyOfAction = false;

            this.resetEmptyYxList();
            var moveCount = 0;

            var y = 0;
            var x = 0;
            var yToMove;
            var xToMove;
            var condition = true;

            while (condition) {
                if (operation.up) {
                    y = 1;
                    yToMove = 0;
                    xToMove = x;
                }
                else if (operation.down) {
                    y = this.rootRow - 2;
                    yToMove = this.rootRow - 1;
                    xToMove = x;
                }
                else if (operation.left) {
                    x = 1;
                    yToMove = y;
                    xToMove = 0;
                }
                else {
                    x = this.rootColumn - 2;
                    yToMove = y;
                    xToMove = this.rootColumn - 1;
                }
                while (condition) {
                    if (this.rootData[y][x] === 0) {

                    } else if (this.rootData[yToMove][xToMove] === 0) {
                        this.moveItem(y, x, yToMove, xToMove);
                        moveCount++;
                    } else if (this.rootData[yToMove][xToMove] !== this.rootData[y][x]) {
                        this.removeEmptyYx(yToMove, xToMove);

                        if (operation.up)
                            yToMove++;
                        else if (operation.down)
                            yToMove--;
                        else if (operation.left)
                            xToMove++;
                        else
                            xToMove--;

                        if (!(yToMove === y && xToMove === x)) {
                            this.moveItem(y, x, yToMove, xToMove);
                            moveCount++;
                        }
                    } else {
                        var doubleItem = document.querySelector('.' + this.yxClassPrefix + y + x);
                        var deleteItem = document.querySelector('.' + this.yxClassPrefix + yToMove + xToMove);
                        this.moveItem(y, x, yToMove, xToMove);
                        moveCount++;
                        this.removeNumber(deleteItem);
                        this.doubleNumber(doubleItem);
                        this.removeEmptyYx(yToMove, xToMove);

                        if (operation.up)
                            yToMove++;
                        else if (operation.down)
                            yToMove--;
                        else if (operation.left)
                            xToMove++;
                        else
                            xToMove--;
                    }

                    if (operation.up) {
                        y++;
                        condition = y < this.rootRow;
                    } else if (operation.down) {
                        y--;
                        condition = y >= 0;
                    } else if (operation.left) {
                        x++;
                        condition = x < this.rootColumn;
                    } else {
                        x--;
                        condition = x >= 0;
                    }
                }
                if (this.rootData[yToMove][xToMove] !== 0) {
                    this.removeEmptyYx(yToMove, xToMove);
                }

                if (operation.up || operation.down) {
                    x++;
                    condition = x < this.rootColumn;
                } else {
                    y++;
                    condition = y < this.rootRow;
                }
            }
        } else {
            alert('잘못된 입력입니다.');
            return;
        }


        if (moveCount > 0) {
            if (this.isVictory()) {
                this.onVictory();
                return;
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
        }, this.transitionTime)

    }
}
