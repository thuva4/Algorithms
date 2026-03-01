// C code to demonstrate working of
// strtok
#include <string.h>
#include <stdio.h>
 
// Driver function
int main()
{
 // Declaration of string
    char gfg[100] = " Hacktober fest by Github";
 
    // Declaration of delimiter
    const char s[4] = "-";
    char* tok;
 
    // Use of strtok
    // get first token
    tok = strtok(gfg, s);
 
    // Checks for delimeter
    while (tok != 0) {
        printf(" %s\n", tok);
 
        // Use of strtok
        // go through other tokens
        tok = strtok(0, s);
    }
 
    return (0);
}
#include <string>
#include <vector>

std::vector<std::string> tokenize(const std::string& value, const std::string& delimiter) {
    if (value.empty()) {
        return {};
    }
    if (delimiter.empty()) {
        return {value};
    }

    std::vector<std::string> tokens;
    std::size_t start = 0;
    while (start <= value.size()) {
        std::size_t position = value.find(delimiter, start);
        if (position == std::string::npos) {
            std::string token = value.substr(start);
            if (!token.empty()) {
                tokens.push_back(token);
            }
            break;
        }
        std::string token = value.substr(start, position - start);
        if (!token.empty()) {
            tokens.push_back(token);
        }
        start = position + delimiter.size();
    }
    return tokens;
}
