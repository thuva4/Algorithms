/**
 Copyright 2019 Rare
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
   http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/*
 The below function uses the Levenshtein distance algorithm
 to calculate the edit distance between two given strings.
 It calculates the cost of editing by counting each of the
 minimum insertions, deletions, and replacements which are
 needed to make one of the strings similar to the other one.
 For example, the minimum cost or the edit distance for having
 "abcd" as "abnde" would be one replacement and one of either
 deletion or insertion, therefore two operations.
 You might find this article:
    https://en.wikipedia.org/wiki/Levenshtein_distance
 and this youtube video:
    https://www.youtube.com/watch?v=MiqoA-yF-0M
 useful about the algorithm.
 */


func editCost(firstString str1: String, secondString str2: String) -> Int {
    
    // Calculating the length of the strings
    let length1 = str1.count, length2 = str2.count
    
    //defining a table for Levenshtein distance algorithm
    //with one extra row and one extra column than the size of the string
    var table = Array(repeating: Array(repeating: 0, count: length2 + 1), count: length1 + 1)
    
    //initializing the first column from 0 to length1
    for i in 0 ... length1 { table[i][0] = i }
    
    //initializing the first row from 0 to length2
    for j in 0 ... length2 { table[0][j] = j }
    
    //initializing the rest of the table based on min value of the precedent neighbors
    for i in 1 ... length1 {
        for j in 1 ... length2 {
            table[i][j] = min( table[i-1][j], table[i][j-1], table[i-1][j-1] )
            
            //considering the characters of the first string as the headers of the rows from 1 to length1
            //considering the characters of the second string as the headers of the columns from 1 to length2
            //if corresponding characters to the cell at [i][j] are not the same, add one to the minimum that we just got
            //because if characters are not the same, it will apply a cost to edit it
            if str1[str1.index(str1.startIndex, offsetBy: i-1)].lowercased() !=
                str2[str2.index(str2.startIndex, offsetBy: j-1)].lowercased()
            { table[i][j] += 1 }
            
        }
    }
    
    //returning the last value in the table
    //this value is the acomulated value of costs (needed operations)
    return table[length1][length2]
    
}



// Usage:


print(editCost(firstString: "sunday", secondString: "saturday"))
//  1 insertion  : a before u in sunday   --> saunday
//  1 insertion  : t before u in sunday   --> satunday
//  1 replacement: n with r in sunday     --> saturday
//cost: 3

print(editCost(firstString: "kitten", secondString: "sitting"))
//3

print(editCost(firstString: "abcd", secondString: "abbde"))
//2


