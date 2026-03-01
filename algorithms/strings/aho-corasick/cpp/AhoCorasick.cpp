#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <map>
using namespace std;

struct TrieNode {
    map<char, int> children;
    int fail;
    vector<int> output;
    TrieNode() : fail(0) {}
};

class AhoCorasick {
    vector<TrieNode> trie;
    vector<string> patterns;

public:
    AhoCorasick(const vector<string>& words) : patterns(words) {
        trie.push_back(TrieNode());
        buildTrie();
        buildFailLinks();
    }

    void buildTrie() {
        for (int i = 0; i < (int)patterns.size(); i++) {
            int cur = 0;
            for (char c : patterns[i]) {
                if (trie[cur].children.find(c) == trie[cur].children.end()) {
                    trie[cur].children[c] = trie.size();
                    trie.push_back(TrieNode());
                }
                cur = trie[cur].children[c];
            }
            trie[cur].output.push_back(i);
        }
    }

    void buildFailLinks() {
        queue<int> q;
        for (auto& p : trie[0].children) {
            trie[p.second].fail = 0;
            q.push(p.second);
        }

        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (auto& p : trie[u].children) {
                char c = p.first;
                int v = p.second;
                int f = trie[u].fail;
                while (f && trie[f].children.find(c) == trie[f].children.end())
                    f = trie[f].fail;
                trie[v].fail = (trie[f].children.count(c) && trie[f].children[c] != v)
                    ? trie[f].children[c] : 0;
                for (int idx : trie[trie[v].fail].output)
                    trie[v].output.push_back(idx);
                q.push(v);
            }
        }
    }

    vector<pair<string, int>> search(const string& text) {
        vector<pair<string, int>> results;
        int cur = 0;
        for (int i = 0; i < (int)text.size(); i++) {
            char c = text[i];
            while (cur && trie[cur].children.find(c) == trie[cur].children.end())
                cur = trie[cur].fail;
            if (trie[cur].children.count(c))
                cur = trie[cur].children[c];
            for (int idx : trie[cur].output) {
                results.push_back({patterns[idx], i - (int)patterns[idx].size() + 1});
            }
        }
        return results;
    }
};

int main() {
    vector<string> words = {"he", "she", "his", "hers"};
    AhoCorasick ac(words);
    auto results = ac.search("ahishers");
    for (auto& r : results) {
        cout << "Word \"" << r.first << "\" found at index " << r.second << endl;
    }
    return 0;
}
#include <string>
#include <vector>

std::vector<std::vector<std::string>> aho_corasick_search(
    const std::string& text,
    const std::vector<std::string>& patterns
) {
    std::vector<std::vector<std::string>> matches;

    for (std::size_t end = 0; end < text.size(); ++end) {
        for (const std::string& pattern : patterns) {
            if (pattern.empty()) {
                continue;
            }
            if (end + 1 < pattern.size()) {
                continue;
            }
            std::size_t start = end + 1 - pattern.size();
            if (text.compare(start, pattern.size(), pattern) == 0) {
                matches.push_back({pattern, std::to_string(start)});
            }
        }
    }

    return matches;
}
