#include <vector>
#include <unordered_map>
using namespace std;

int boyer_moore_search(vector<int> arr) {
    int textLen = arr[0];
    int patLen = arr[1 + textLen];

    if (patLen == 0) return 0;
    if (patLen > textLen) return -1;

    vector<int> text(arr.begin() + 1, arr.begin() + 1 + textLen);
    vector<int> pattern(arr.begin() + 2 + textLen, arr.begin() + 2 + textLen + patLen);

    unordered_map<int, int> badChar;
    for (int i = 0; i < patLen; i++) {
        badChar[pattern[i]] = i;
    }

    int s = 0;
    while (s <= textLen - patLen) {
        int j = patLen - 1;
        while (j >= 0 && pattern[j] == text[s + j]) j--;
        if (j < 0) return s;
        auto it = badChar.find(text[s + j]);
        int bc = (it != badChar.end()) ? it->second : -1;
        int shift = j - bc;
        if (shift < 1) shift = 1;
        s += shift;
    }

    return -1;
}
