Skip to content
This repository
Search
Pull requests
Issues
Marketplace
Explore
 @noelchanwh
 Sign out
 Unwatch 1
  Star 0
  Fork 0 noelchanwh/SkiingInSingapore
 Code  Issues 0  Pull requests 0  Projects 0  Wiki  Settings Insights
Branch: master Find file Copy pathSkiingInSingapore/app/scripts/main.js
69aa0f8  on 20 May 2015
@noelchanwh noelchanwh Calculate the longest path
1 contributor
RawBlameHistory
224 lines (182 sloc)  6.38 KB
window._debugging = false;


var graph = [],
    globalLongestPath = -1,
    globalDrop = -1,
    globalSmallestEndPointValue = Number.MAX_VALUE,

    startPointValue = 0,
    endPointValue = 0,

    currentLongestPath = 0,
    currentSmallestEndPointValue = Number.MAX_VALUE,

    gridDimension = 0,
    pathTaken = [],
    pathForCSS = [];

//graph = [[4, 8, 7, 3],
//         [2, 5, 9, 3],
//         [6, 3, 2, 5],
//         [4, 4, 1, 6]];
//
//graph = [[9, 8, 7, 6],
//         [9, 9, 6, 9],
//         [9, 4, 5, 3],
//         [9, 9, 9, 9]];

$(document).ready(function () {
    var rawMapArray = [];

    $.get('./map.txt', function (data) {
        rawMapArray = data.split('\n');
        for (var y = 0; y < rawMapArray.length; y++) {
            graph.push(rawMapArray[y].split(' ').map(Number));
        }

        if(window._debugging) {
            // FOR DEBUGGING
            gridDimension = 35;
            createTheMap();
            enableStepByStepTesting();
        } else {
            window.console = {};
            console.log = function(){};

            gridDimension = graph.length;
            testInLoop();
        }

    });


});

var enableStepByStepTesting = function () {
    var stepY = 0,
        stepX = 0;

    $('#next').bind('click', function () {

        for (var c = 0; c < pathForCSS.length; c++) {
            $(pathForCSS[c]).removeClass('active');
        }

        testStepByStep(stepY, stepX);
        if (stepX < gridDimension) {
            stepX++;
        } else {
            stepY++;
            stepX = 0;
        }
    });
}


var testStepByStep = function (y, x) {
    console.log('-----------------------------------');
    console.log('startPointValue ' + startPointValue);
    testLogic(y, x);
    //console.log({globalLongestPath, globalSmallestEndPointValue, globalDrop});
    console.log('-----------------------------------');
}

var testInLoop = function () {
    for (var y = 0; y < gridDimension; y++) {
        for (var x = 0; x < gridDimension; x++) {
            testLogic(y, x);
        }
    }
    console.log('--- THE LONGEST PATH FOR SKIING ---');
    //console.log({globalLongestPath, globalSmallestEndPointValue, globalDrop});
    console.log('email: ' + globalLongestPath.toString(10) + globalDrop.toString(10) + '@redmart.com');
    console.log('-----------------------------------');

    document.writeln('<br \><br \>globalLongestPath ' + globalLongestPath);
    document.writeln('<br \>globalSmallestEndPointValue ' + globalSmallestEndPointValue);
    document.writeln('<br \>globalDrop ' + globalDrop);
    document.writeln('<br \>email: ' + globalLongestPath.toString(10) + globalDrop.toString(10) + '@redmart.com');
}


var testLogic = function(y, x) {
    startPointValue = endPointValue = currentSmallestEndPointValue = graph[y][x];
    currentLongestPath = 0;

    // CHECK THE GRID WITH RECURIVE
    gridChecker(y, x, 0);
    // NOW THAT BEST PATH FOR THE CELL WILL BE OUTPUT
    if (globalLongestPath < currentLongestPath) {
        globalLongestPath = currentLongestPath;
        globalSmallestEndPointValue = currentSmallestEndPointValue;
        globalDrop = startPointValue - currentSmallestEndPointValue;
    } else if (globalLongestPath == currentLongestPath && globalDrop < (startPointValue - currentSmallestEndPointValue)) {
        // SINCE NOW BOTH ARE EQUAL IN DISTANCE CHECK WHICH HAS A BETTER DROP
        globalLongestPath = currentLongestPath;
        globalSmallestEndPointValue = currentSmallestEndPointValue;
        globalDrop = startPointValue - currentSmallestEndPointValue;
    }
}


var gridChecker = function (y, x, prevPathLen) {

    if(window._debugging) {
        $('#cell' + y + '_' + x).addClass('active');
        pathForCSS.push('#cell' + y + '_' + x);
    }

    var cellValue = graph[y][x],
        currentPathLen = prevPathLen + 1,
        neighbour = returnNeighbours(y, x),
        innerX = x,
        innerY = y,
        endOfPath = true;

    pathTaken.push(cellValue);

    for (var direction = 0; direction < 4; direction++) {
        if (typeof (neighbour[direction]) != 'number') {
            alert('WARNING ' + neighbour[direction])
        }
        if ((neighbour[direction] != -1) && (cellValue > neighbour[direction])) {
            switch (direction) {
            case 0:
                // NORTH
                pathTaken.push('↑');
                innerY = y - 1;
                innerX = x;
                break;
            case 1:
                // EAST
                pathTaken.push('→');
                innerY = y;
                innerX = x + 1;
                break;
            case 2:
                // SOUTH
                pathTaken.push('↓');
                innerY = y + 1;
                innerX = x;
                break;
            case 3:
                // WEST
                pathTaken.push('←');
                innerY = y;
                innerX = x - 1;
                break;

            }
            endOfPath = false;
            gridChecker(innerY, innerX, currentPathLen);
        }
    }

    if (endOfPath) {
        endPointValue = graph[y][x];
        console.log('=== End of Path');
        console.log('pathTaken ' + pathTaken);
        //console.log({currentPathLen, endPointValue});
        pathTaken = [];

        if (currentLongestPath <= currentPathLen) {
            currentLongestPath = currentPathLen;

            if (currentSmallestEndPointValue > cellValue) {
                currentSmallestEndPointValue = cellValue;
            }
        }
        //console.log({currentLongestPath, currentSmallestEndPointValue});
    }
}

var returnNeighbours = function (y, x) {
    var myNorth = (y > 0) ? graph[y - 1][x] : -1,
        mySouth = (y < graph.length - 1) ? graph[y + 1][x] : -1,
        myEast = (x < graph.length - 1) ? graph[y][x + 1] : -1,
        myWest = (x > 0) ? graph[y][x - 1] : -1;

    return [myNorth, myEast, mySouth, myWest];
}

var createTheMap = function () {
    var posX = 0,
        posY = 0,
        padding = 30;

    for (var i = 0; i < gridDimension; i++) {

        posY += padding;

        for (var j = 0; j < gridDimension; j++) {

            posX = j * padding;

            $('<div/>', {
                id: 'cell' + i + '_' + j,
                class: 'cell',
                html: graph[i][j],
                style: 'top:' + posY + 'px; left: ' + posX + 'px;'
            }).appendTo('#mainContainer');
        }
    }
}
