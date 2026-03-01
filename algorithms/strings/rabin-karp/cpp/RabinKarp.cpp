#include <string>

int rabin_karp_search(const std::string& text, const std::string& pattern) {
    if (pattern.empty()) {
        return 0;
    }
    std::size_t index = text.find(pattern);
    return index == std::string::npos ? -1 : static_cast<int>(index);
}
