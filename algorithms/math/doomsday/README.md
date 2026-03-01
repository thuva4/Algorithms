# Doomsday Algorithm

## Overview

The Doomsday Algorithm is a method for determining the day of the week for any given date. Devised by mathematician John Conway, it exploits the fact that certain easy-to-remember dates (called "doomsdays") always fall on the same day of the week within any given year. By anchoring calculations to these reference dates, the algorithm can compute the day of the week for any date in constant time.

The algorithm is elegant enough to be performed mentally with practice, making it a favorite party trick among mathematicians. It is also useful in software for date validation, calendar generation, and historical date analysis.

## How It Works

The algorithm relies on the following observations: (1) The "doomsday" for a year is the day of the week on which certain dates fall (4/4, 6/6, 8/8, 10/10, 12/12, the last day of February, 7/11, 11/7, and others). (2) The anchor day for a century is computed from the century number. (3) The doomsday for a specific year is computed by adding the year-within-century contribution. (4) From the doomsday, any date's day can be found by counting the offset.

### Example

Finding the day of the week for **January 15, 2000:**

**Step 1: Find the century anchor:**
- Century 2000s: anchor = Tuesday (2)

**Step 2: Find the year's doomsday:**
- Year within century: y = 00
- a = floor(00 / 12) = 0
- b = 00 mod 12 = 0
- c = floor(0 / 4) = 0
- Doomsday = (2 + 0 + 0 + 0) mod 7 = 2 = Tuesday

**Step 3: Find the closest doomsday reference date:**
- January's reference: 1/3 (or 1/4 in leap year). 2000 is a leap year, so reference is 1/4.
- 1/4 falls on Tuesday (doomsday).

**Step 4: Count offset:**
- January 15 - January 4 = 11 days
- 11 mod 7 = 4
- Tuesday + 4 = Saturday

Result: **January 15, 2000 is a Saturday**

**Another example: March 14, 2023:**

| Step | Computation | Result |
|------|------------|--------|
| Century anchor | 2000s | Tuesday (2) |
| y = 23 | a = 23/12 = 1, b = 23 mod 12 = 11, c = 11/4 = 2 | |
| Doomsday | (2 + 1 + 11 + 2) mod 7 = 16 mod 7 = 2 | Tuesday |
| Reference | 3/7 (doomsday in March) | Tuesday |
| Offset | 14 - 7 = 7, 7 mod 7 = 0 | +0 |
| Result | Tuesday + 0 | **Tuesday** |

## Pseudocode

```
function doomsday(year, month, day):
    // Century anchor days: 1800=Fri(5), 1900=Wed(3), 2000=Tue(2), 2100=Sun(0)
    century = year / 100
    anchor = (2 - (century mod 4) * 2 + 7) mod 7  // simplified formula

    // Year's doomsday
    y = year mod 100
    doomsday = (anchor + y/12 + y mod 12 + (y mod 12)/4) mod 7

    // Reference doomsdays for each month
    // Jan: 3 (or 4 in leap year), Feb: 28 (or 29), Mar: 7, Apr: 4,
    // May: 9, Jun: 6, Jul: 11, Aug: 8, Sep: 5, Oct: 10, Nov: 7, Dec: 12
    ref = getDoomsdayReference(month, isLeapYear(year))

    // Compute day of week
    offset = (day - ref) mod 7
    return (doomsday + offset + 7) mod 7
```

The algorithm decomposes the calculation into century, year, and month components, each requiring simple arithmetic.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(1) | O(1)  |
| Average | O(1) | O(1)  |
| Worst   | O(1) | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** The algorithm performs a fixed number of arithmetic operations (additions, divisions, modulo) regardless of the input date.

- **Average Case -- O(1):** The same fixed number of operations is performed for any date. No loops or recursive calls are involved.

- **Worst Case -- O(1):** The computation involves approximately 10-15 arithmetic operations. The complexity does not depend on the magnitude of the year or any other parameter.

- **Space -- O(1):** Only a handful of intermediate variables are needed. A small lookup table for monthly doomsday references uses constant space.

## When to Use

- **Determining the day of the week:** For any date in the Gregorian calendar (or Julian calendar with modifications).
- **Mental calculation:** The algorithm is designed to be performable in one's head with practice.
- **Calendar generation:** Building calendars for any month/year.
- **Historical date analysis:** Finding what day of the week historical events occurred.

## When NOT to Use

- **When a standard library function is available:** Most programming languages have built-in date functions that are simpler to use.
- **Dates before the Gregorian calendar adoption:** Different calendars require different algorithms.
- **When batch processing many dates:** A lookup table or precomputed calendar may be more efficient.
- **Non-Gregorian calendars:** Islamic, Hebrew, and other calendars have different structures.

## Comparison with Similar Algorithms

| Algorithm       | Time | Space | Notes                                          |
|----------------|------|-------|-------------------------------------------------|
| Doomsday        | O(1) | O(1)  | Conway's method; mental math friendly            |
| Zeller's Formula| O(1) | O(1)  | Direct formula; harder to memorize               |
| Tomohiko Sakamoto| O(1)| O(1)  | Compact formula; popular in programming          |
| Gauss's Method  | O(1) | O(1)  | Historical; for January 1 of a year              |

## Implementations

| Language   | File |
|------------|------|
| Python     | [doomsday.py](python/doomsday.py) |
| Java       | [Doomsday.java](java/Doomsday.java) |
| C++        | [doomsday.cpp](cpp/doomsday.cpp) |
| Go         | [doomsday.go](go/doomsday.go) |
| C#         | [Doomsday.cs](csharp/Doomsday.cs) |
| TypeScript | [index.js](typescript/index.js) |
| Kotlin     | [Doomsday.kt](kotlin/Doomsday.kt) |
| Swift      | [Doomsday.swift](swift/Doomsday.swift) |

## References

- Conway, J. H. (1973). Tomorrow is the day after doomsday. *Eureka*, 36, 28-31.
- Berlekamp, E. R., Conway, J. H., & Guy, R. K. (2004). *Winning Ways for your Mathematical Plays*. A K Peters. Volume 4, Chapter 24.
- [Doomsday Rule -- Wikipedia](https://en.wikipedia.org/wiki/Doomsday_rule)
