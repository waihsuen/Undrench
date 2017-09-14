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
