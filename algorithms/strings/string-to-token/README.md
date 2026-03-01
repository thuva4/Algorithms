# String to Token

## Overview

String tokenization (also known as string splitting) is the process of breaking a string into a sequence of meaningful pieces called tokens, using one or more delimiter characters. For example, tokenizing "Hello, World! How are you?" with space as a delimiter produces the tokens ["Hello,", "World!", "How", "are", "you?"]. This is a fundamental operation in text processing, parsing, and compiler design.

Tokenization is the first step in many text processing pipelines, from parsing CSV files and configuration files to lexical analysis in compilers and interpreters. The C standard library provides `strtok()` for this purpose, and most programming languages have built-in string split functions.

## How It Works

The algorithm scans through the input string character by character. When it encounters a non-delimiter character, it marks the start of a new token. It continues scanning until it finds a delimiter or the end of the string, at which point the token is extracted. Consecutive delimiters are typically treated as a single separator (skipping empty tokens). The process repeats until the entire string has been scanned.

### Example

Input string: `"one::two:::three::four"`, Delimiter: `":"`

**Step-by-step tokenization:**

| Position | Character | State | Action |
|----------|-----------|-------|--------|
| 0-2 | "one" | In token | Accumulate characters |
| 3-4 | "::" | Delimiter | Emit token "one", skip delimiters |
| 5-7 | "two" | In token | Accumulate characters |
| 8-10 | ":::" | Delimiter | Emit token "two", skip delimiters |
| 11-15 | "three" | In token | Accumulate characters |
| 16-17 | "::" | Delimiter | Emit token "three", skip delimiters |
| 18-21 | "four" | In token | Accumulate characters |
| End | - | - | Emit token "four" |

Result: Tokens = `["one", "two", "three", "four"]`

**Another example with multiple delimiters:**

Input: `"  Hello   World  "`, Delimiter: `" "`

| Step | Action | Tokens so far |
|------|--------|---------------|
| 1 | Skip leading spaces | [] |
| 2 | Read "Hello" | ["Hello"] |
| 3 | Skip spaces | ["Hello"] |
| 4 | Read "World" | ["Hello", "World"] |
| 5 | Skip trailing spaces | ["Hello", "World"] |

Result: Tokens = `["Hello", "World"]`

## Pseudocode

```
function tokenize(str, delimiters):
    tokens = empty list
    i = 0
    n = length(str)

    while i < n:
        // Skip delimiters
        while i < n and str[i] is in delimiters:
            i = i + 1

        // Find end of token
        start = i
        while i < n and str[i] is not in delimiters:
            i = i + 1

        // Extract token if non-empty
        if i > start:
            tokens.append(str[start..i-1])

    return tokens
```

The algorithm makes a single pass through the string, alternating between skipping delimiters and accumulating token characters. Each character is examined exactly once.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(n)  |
| Average | O(n) | O(n)  |
| Worst   | O(n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n):** The algorithm makes a single pass through the string of length n. Each character is examined exactly once to determine if it is a delimiter.

- **Average Case -- O(n):** Regardless of the number of tokens or delimiters, every character is processed once. Checking whether a character is a delimiter takes O(1) with a hash set or O(d) with a linear scan (where d is the number of distinct delimiters, typically small).

- **Worst Case -- O(n):** Even if the entire string is delimiters (producing no tokens) or has no delimiters (producing one token), the algorithm scans the entire string once.

- **Space -- O(n):** The output tokens collectively contain all non-delimiter characters, which in the worst case is the entire input string. Additionally, storing references to token positions requires O(k) space where k is the number of tokens.

## When to Use

- **Parsing structured text:** Splitting CSV rows, log entries, or configuration lines by their delimiters.
- **Lexical analysis:** The first phase of compilers and interpreters tokenizes source code into meaningful symbols.
- **Natural language processing:** Splitting text into words for further analysis (though NLP often requires more sophisticated tokenizers).
- **Command-line argument parsing:** Splitting user input into individual commands and arguments.

## When NOT to Use

- **When delimiters can appear within tokens:** Quoted strings (e.g., CSV with commas inside quotes) require a stateful parser, not simple tokenization.
- **When you need to preserve empty tokens:** Simple tokenization typically skips consecutive delimiters. Use split-with-limit for preserving empty fields.
- **Complex grammar parsing:** For nested structures or context-dependent parsing, use a proper parser (recursive descent, PEG, etc.).
- **Unicode-aware word boundary detection:** Natural language word boundaries require Unicode-aware segmentation (ICU, etc.), not simple delimiter splitting.

## Comparison with Similar Algorithms

| Method            | Time | Space | Notes                                          |
|------------------|------|-------|-------------------------------------------------|
| strtok (C)        | O(n) | O(1)  | In-place; modifies original string; not reentrant|
| String.split      | O(n) | O(n)  | Creates new strings; language built-in            |
| Regex tokenizer   | O(n) | O(n)  | Most flexible; higher constant factor             |
| Lexer/Scanner     | O(n) | O(n)  | Full lexical analysis; handles complex grammars   |

## Implementations

| Language | File |
|----------|------|
| C++      | [str_tok.cpp](cpp/str_tok.cpp) |

## References

- Kernighan, B. W., & Ritchie, D. M. (1988). *The C Programming Language* (2nd ed.). Prentice Hall. Section 7.8.
- Aho, A. V., Lam, M. S., Sethi, R., & Ullman, J. D. (2006). *Compilers: Principles, Techniques, and Tools* (2nd ed.). Pearson. Chapter 3: Lexical Analysis.
- [Lexical Analysis -- Wikipedia](https://en.wikipedia.org/wiki/Lexical_analysis)
