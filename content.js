console.log('content.js');

// Listen for messages
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'report_back') {
        var gridCellSize = 27; // 27
        var gridSize = 14; // 14
        var gridID;

        // Call the specified callback, passing
        // the web-page's DOM content as argument
        console.log('MESSAGE TEXT');
        sendResponse(document.all[0].outerHTML);

        var ctx = document.getElementById('myCanvas').getContext('2d');
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');


        $('body').append('<div id="testBTN">clickhere</div>');
        $('body').append('<div id="infomation">info</div>');
        $('body').append('<div id="testCanvasholder"></div>');
        // GREEN PINK PURPLE LIGHTGREEN RED YELLOW
        function nextMove() {
            gridID = [];
            //var temp = Math.floor(Math.random() * 6) + 1;
            //console.log('FIRING B',temp);
            setTimeout(function(){
                createADIVClone();
                var colorMax = checkAllGrid();
                //console.log('colorMax', colorMax);
                $('#infomation').html('colorMax ' + colorMax);
                $('#b' + (colorMax+1)).trigger('click');
                 nextMove();
             }, 280);
        }
        nextMove();
        // $('#testBTN').click(function(){
        //     nextMove();
        // });

        // Get the CanvasPixelArray from the given coordinates and dimensions.



        function GetPixel(x, y) {
            var p = ctx.getImageData(x, y, 27, 27).data;
            var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
            return hex;
        }

        function GetPixelwithNum(x, y, gridCellSize) {
            var p = ctx.getImageData(x, y, gridCellSize, gridCellSize).data;
            var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);

            var num = 0;
            // 1GREEN 2PINK 3PURPLE 4LIGHTGREEN 5RED 6YELLOW
            switch (hex) {
                case '#66cc00':
                    num = 0; // return green
                    break;
                case '#ff9fff':
                    num = 1; // return lite purple/pink
                    break;
                case '#743ef4':
                    num = 2; // return purple
                    break;
                case '#ccffcc':
                    num = 3; // return lite green
                    break;
                case '#ff0000':
                    num = 4; // return red
                    break;
                case '#ffcc00':
                    num = 5; // return yellow
                    break;
            }
            return {
                hex: hex,
                num: num
            };
        }

        function rgbToHex(r, g, b) {
            if (r > 255 || g > 255 || b > 255)
                throw "Invalid color component";
            return ((r << 16) | (g << 8) | b).toString(16);
        }

        // MAKE THE SYSTEM OUT FIRST
        function createADIVClone() {
            $('#testCanvasholder').empty();
            var temp, myID;
            var tempGridID = [];

            for (var i = 0; i < gridSize; i++) {
                //var j = 0;
                tempGridID = [];
                for (var j = 0; j < gridSize; j++) {
                    temp = GetPixelwithNum((i * gridCellSize), (j * gridCellSize), gridCellSize);
                    myID = 'cell' + i + '_' + j;

                    var $div = $('<div>', {
                        html: i + ':' + j,
                        id: myID,
                        style: 'left:' + (i * gridCellSize) + 'px;top:' + (j * gridCellSize) + 'px;' +
                            'background-color:' + temp.hex + ';width:' + gridCellSize + 'px;height:' + gridCellSize + 'px;',
                        class: 'cell'
                    });
                    tempGridID.push({
                        myID: myID,
                        hex: temp.hex,
                        colorNum: temp.num,
                        notTouched: true
                    });
                    $('#testCanvasholder').append($div);
                }
                gridID.push(tempGridID);
            }
        }

        function createMapping() {
            var returnArray = [];
            for (let i = 0; i < gridSize; i++) {
                var temp = [];
                for (let j = 0; j < gridSize; j++) {
                    temp.push(gridID[i][j]);
                }
                returnArray.push(temp);
            }
            return returnArray;
        }

        function checkAllGrid() {
            var borderArray = [];
            var colorBucketArray = [0,0,0,0,0,0];
            var borderCellsArrays = [];

            for (let i = 0; i < gridSize; i++) {
                var temp = [];
                for (let j = 0; j < gridSize; j++) {
                    temp.push(false);
                }
                borderArray.push(temp);
            }
            checkBorder(0, 0, getCurrentColor(0,0), borderArray);

            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if(borderArray[i][j] === true) {
                        makeMeBorder(i, j);
                        colorBucketArray[gridID[i][j].colorNum] += 1;
                        //
                        var returnNumOfColors = loopThruTouchPoints(i, j, 0, createMapping());
                        $('#'+gridID[i][j].myID).html(returnNumOfColors);
                        console.log(gridID[i][j].colorNum, returnNumOfColors);
                        colorBucketArray[gridID[i][j].colorNum] += returnNumOfColors;
                        borderCellsArrays.push(gridID[i][j]);
                    }
                }
            }

            console.log('colorBucketArray', colorBucketArray);
            var biggestIndex = 0, lastIndexValue = 0;
            for (var s=0; s < colorBucketArray.length; s++) {
                if(lastIndexValue < colorBucketArray[s]) {
                    lastIndexValue = colorBucketArray[s];
                    biggestIndex = s;
                }
            }
            //console.log('biggestIndex', biggestIndex);
            $('#testBTN').html(colorNumToString(biggestIndex));
            return biggestIndex;
        }

        function getCurrentColor(i, j) {
            //return lastColorHack;
            var temp = GetPixelwithNum((i * gridCellSize), (j * gridCellSize), gridCellSize);
            return temp.num;
        }

        function colorNumToString(num) {
            switch(num) {
    			case 0 :
    				return '#66cc00-GREEN'; // return green
    			break;
    			case 1 :
    				return '#ff9fff-PINK/LIGHTPURPLE'; // return lite purple/pink
    			break;
    			case 2 :
    				return '#743ef4/PURPLE'; // return purple
    			break;
    			case 3 :
    				return '#ccffcc/LITEGREEN'; // return lite green
    			break;
    			case 4 :
    				return '#ff0000/RED'; // return red
    			break;
    			case 5 :
    				return '#ffcc00/YELLOW'; // return yellow
    			break;
    		}
        }

        function checkBorder(i, j, checkColor, myArray) {
            gridID[i][j].notTouched = false;
            makeMeLightGrey(i, j);
            //console.log('checking', i, j, mapping);

            if ((j > 0) && gridID[i][j-1].notTouched) {
                // MOVE TOP
                //console.log('MOVE TOP');
                if (gridID[i][j-1].colorNum === checkColor) {
                    checkBorder(i, j-1, checkColor, myArray);
                } else {
                    myArray[i][j-1] = true;
                    //myArray.push({i: i, j: j-1});
                }
            }
            if ((i < gridSize-1) && gridID[i+1][j].notTouched) {
                // MOVE RIGHT
                //console.log('MOVE RIGHT');
                if (gridID[i+1][j].colorNum === checkColor) {
                    checkBorder(i+1, j, checkColor, myArray);
                } else {
                    myArray[i+1][j] = true;
                    //myArray.push({i: i+1, j: j});
                }
            }
            if ((j < gridSize-1) && gridID[i][j+1].notTouched) {
                // MOVE BOTTOM
                //console.log('MOVE BOTTOM');
                if (gridID[i][j+1].colorNum === checkColor) {
                    checkBorder(i, j+1, checkColor, myArray);
                } else {
                    myArray[i][j+1] = true;
                    //myArray.push({i: i, j: j+1});
                }
            }
            if ((i > 1) && gridID[i-1][j].notTouched) {
                // MOVE LEFT
                //console.log('MOVE LEFT');
                if (gridID[i-1][j].colorNum === checkColor) {
                    checkBorder(i-1, j, checkColor, myArray);
                } else {
                    myArray[i-1][j] = true;
                    //myArray.push({i: i-1, j: j});
                }
            }

            //return {i: i, j: j};
        }

        function loopThruTouchPoints(i, j, path, testArray) {
            if(!gridID[i][j].notTouched) {
                return 0;
            }
            testArray[i][j].notTouched = false;
            makeMeGrey(i, j);
            //console.log('==============',i, j);

            if ((j > 0) && testArray[i][j-1].notTouched && testArray[i][j].colorNum === testArray[i][j-1].colorNum) {
                // MOVE TOP
                //console.log('MOVE TOP');
                path = loopThruTouchPoints(i, j-1, path+1, testArray);
            }
            if ((i < gridSize-1) && gridID[i+1][j].notTouched && gridID[i][j].colorNum === gridID[i+1][j].colorNum) {
                // MOVE RIGHT
                //console.log('MOVE RIGHT');
                path = loopThruTouchPoints(i+1, j, path+1, testArray);
            }
            if ((j < gridSize-1) && gridID[i][j+1].notTouched && gridID[i][j].colorNum === gridID[i][j+1].colorNum) {
                // MOVE BOTTOM
                //console.log('MOVE BOTTOM');
                path = loopThruTouchPoints(i, j+1, path+1, testArray);
            }
            if ((i > 1) && gridID[i-1][j].notTouched && gridID[i][j].colorNum === gridID[i-1][j].colorNum) {
                // MOVE LEFT
                //console.log('MOVE LEFT');
                path = loopThruTouchPoints(i-1, j, path+1, testArray);
            }
            return path;
        }


        // var returnNeighbours = function (x, y) {
        //     var myNorth = (y > 0) ? graph[x][y - 1] : -1,
        //         mySouth = (y < gridSize - 1) ? graph[y + 1][x] : -1,
        //         myEast = (x < gridSize - 1) ? graph[y][x + 1] : -1,
        //         myWest = (x > 0) ? graph[y][x - 1] : -1;
        //
        //     return [myNorth, myEast, mySouth, myWest];
        // }

        function makeMeLightGrey(i, j) {
            $('#'+gridID[i][j].myID).css({'background-color':'LightGray'});
        }
        function makeMeGrey(i, j) {
            $('#'+gridID[i][j].myID).css({'background-color':'Grey'});
        }
        function makeMeBlack(i, j) {
            $('#'+gridID[i][j].myID).css({'background-color':'Black'});
        }
        function makeMeBorder(i, j) {
            $('#'+gridID[i][j].myID).css({'border':'3px solid Black', 'box-sizing': 'border-box'});
        }

        // function giveColorMapping() {
        //     for (var i = 0; i < gridSize; i++) {
        //         for (var j = 0; j < gridSize; j++) {
        //             var cMapping = gridID[i][j].borderMapping;
        //             //console.log('cMapping', cMapping, gridID[i][j].myID);
        //             if (cMapping >= 8) {
        //                 cMapping -= 8;
        //                 // MOVE TOP
        //                 if (gridID[i][j].colorNum === gridID[i][j - 1].colorNum) {
        //                     gridID[i][j].colorMapping += 8;
        //                 }
        //             }
        //             if (cMapping >= 4) {
        //                 cMapping -= 4;
        //                 // MOVE RIGHT
        //                 if (gridID[i][j].colorNum === gridID[i + 1][j].colorNum) {
        //                     gridID[i][j].colorMapping += 4;
        //                 }
        //             }
        //             if (cMapping >= 2) {
        //                 cMapping -= 2;
        //                 // MOVE BOTTOM
        //                 if (gridID[i][j].colorNum === gridID[i][j + 1].colorNum) {
        //                     gridID[i][j].colorMapping += 2;
        //                 }
        //             }
        //             if (cMapping >= 1) {
        //                 cMapping -= 1;
        //                 // MOVE LEFT
        //                 if (gridID[i][j].colorNum === gridID[i - 1][j].colorNum) {
        //                     gridID[i][j].colorMapping += 1;
        //                 }
        //             }
        //
        //             $('#' + gridID[i][j].myID).html(gridID[i][j].colorMapping);
        //         }
        //     }
        // }
        // function mySameConnection(x, y, count, direction) {
        //     console.log(x, y, count);
        //     var currentCount = 0;
        //     var returnNum = 0;
        //
        //     if (count > 100) {
        //         return 0;
        //     }
        //
        //     if (direction === 'MOVE_TOP' && ) {
        //
        //     }
        //
        //
        //     // if (x > 0 && gridID[x][y].colorNum === gridID[x-1][y].colorNum && comeFrom !== 'RIGHT') {
        //     //     console.log('MOVE LEFT');
        //     //     // CAN MOVE LEFT
        //     //     returnNum = mySameConnection(x-1, y, count+1, 'RIGHT');
        //     //     currentCount = Math.max(currentCount, returnNum);
        //     //     return currentCount;
        //     // }
        //     // if (x < gridSize && gridID[x][y].colorNum === gridID[x+1][y].colorNum && comeFrom !== 'LEFT') {
        //     //     console.log('MOVE RIGHT');
        //     //     // CAN MOVE RIGHT
        //     //     returnNum = mySameConnection(x+1, y, count+1, 'LEFT');
        //     //     currentCount = Math.max(currentCount, returnNum);
        //     //     return currentCount;
        //     // }
        //     // if (y > 0 && gridID[x][y].colorNum === gridID[x][y-1].colorNum && comeFrom !== 'DOWN') {
        //     //     console.log('MOVE UP');
        //     //     // CAN MOVE UP
        //     //     returnNum = mySameConnection(x, y-1, count+1, 'DOWN');
        //     //     currentCount = Math.max(currentCount, returnNum);
        //     //     return currentCount;
        //     // }
        //     // if (y < gridSize && gridID[x][y].colorNum === gridID[x][y+1].colorNum && comeFrom !== 'UP') {
        //     //     console.log('MOVE DOWN');
        //     //     // CAN MOVE DOWN
        //     //     returnNum = mySameConnection(x, y+1, count+1, 'UP');
        //     //     currentCount = Math.max(currentCount, returnNum);
        //     //     return currentCount;
        //     // }
        //     // console.log('MOVE NONE');
        //     // return currentCount;
        // }

        // canvas.onmousemove = function(e) {
        //     var mouseX, mouseY;
        //
        //     if (e.offsetX) {
        //         mouseX = e.offsetX;
        //         mouseY = e.offsetY;
        //     } else if (e.layerX) {
        //         mouseX = e.layerX;
        //         mouseY = e.layerY;
        //     }
        //     var c = ctx.getImageData(mouseX, mouseY, 1, 1).data;
        //
        //     //c[0] + '-' + c[1] + '-' + c[2]
        //     var hex = '#' + rgbToHex(c[0].toString(), c[1].toString(), c[2].toString());
        //     //hex
        //
        //     $('#ttip').css({
        //         'left': mouseX + 20,
        //         'top': mouseY + 20
        //     }).html('<div style="background-color:' + hex + ';">' + c[0] + '-' + c[1] + '-' + c[2] + '</div>');
        // };

    }
});
