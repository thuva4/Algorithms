func floodFill(image imageGraph: inout [[Int]], row: Int, column: Int, oldColor: Int, newColor: Int, fillDiagnols: Bool) {
    //Check if input coords (row and column) are within the bounds of the graph
    guard (row >= 0 && row < imageGraph.count) && (column >= 0 && column < imageGraph[0].count) else {
        return
    }
    //Check if the coords value/color is the value to be replaced, otherwise stop execution
    if imageGraph[row][column] != oldColor {
        return
    }
    
    //Replace the value at the coords with the newColor
    imageGraph[row][column] = newColor

    //Recursively call this function on the coords' neighbors
    floodFill(image: &imageGraph, row: row - 1, column: column, oldColor: oldColor, newColor: newColor, fillDiagnols: fillDiagnols)
    floodFill(image: &imageGraph, row: row + 1, column: column, oldColor: oldColor, newColor: newColor, fillDiagnols: fillDiagnols)
    floodFill(image: &imageGraph, row: row, column: column - 1, oldColor: oldColor, newColor: newColor, fillDiagnols: fillDiagnols)
    floodFill(image: &imageGraph, row: row, column: column + 1, oldColor: oldColor, newColor: newColor, fillDiagnols: fillDiagnols)
    
    if fillDiagnols {
        floodFill(image: &imageGraph, row: row - 1, column: column - 1, oldColor: oldColor, newColor: newColor, fillDiagnols: fillDiagnols)
        floodFill(image: &imageGraph, row: row - 1, column: column + 1, oldColor: oldColor, newColor: newColor, fillDiagnols: fillDiagnols)
        floodFill(image: &imageGraph, row: row + 1, column: column - 1, oldColor: oldColor, newColor: newColor, fillDiagnols: fillDiagnols)
        floodFill(image: &imageGraph, row: row + 1, column: column + 1, oldColor: oldColor, newColor: newColor, fillDiagnols: fillDiagnols)
    }
}

//Example #1 - normal fill without diagnol fill

var normalFillGraph = [
//[C]0  1  2  3  4  5  6  7   //[R]
    [2, 2, 1, 1, 1, 1, 1, 1], // 0
    [2, 2, 2, 1, 1, 1, 1, 1], // 1
    [2, 1, 1, 2, 2, 1, 1, 1], // 2
    [1, 1, 2, 2, 2, 2, 1, 1], // 3
    [1, 1, 2, 2, 2, 2, 1, 1], // 4
    [1, 1, 1, 2, 2, 1, 2, 1], // 5
    [1, 1, 1, 1, 1, 2, 2, 2], // 6
    [1, 1, 1, 1, 1, 2, 2, 2], // 7
]

floodFill(image: &normalFillGraph, row: 3, column: 5, oldColor: 2, newColor: 0, fillDiagnols: false)

/* Result:
    [2, 2, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 1, 1, 1, 1, 1],
    [2, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 1, 2, 1],
    [1, 1, 1, 1, 1, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 2, 2],
*/

//Example #2 - Also Fill Diagnols

var diagnolFillGraph = [
//[C]0  1  2  3  4  5  6  7   //[R]
    [2, 2, 1, 1, 1, 1, 1, 1], // 0
    [2, 2, 2, 1, 1, 1, 1, 1], // 1
    [2, 1, 1, 2, 2, 1, 1, 1], // 2
    [1, 1, 2, 2, 2, 2, 1, 1], // 3
    [1, 1, 2, 2, 2, 2, 1, 1], // 4
    [1, 1, 1, 2, 2, 1, 2, 1], // 5
    [1, 1, 1, 1, 1, 2, 2, 2], // 6
    [1, 1, 1, 1, 1, 2, 2, 2], // 7
]

floodFill(image: &diagnolFillGraph, row: 3, column: 5, oldColor: 2, newColor: 0, fillDiagnols: true)

/*  Result:
    [0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 1, 1],
    [0, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0],
*/
