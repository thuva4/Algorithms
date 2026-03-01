#include <string>
#include <vector>

std::vector<int> level_order_traversal(const std::vector<std::string>& tree_as_array) {
    std::vector<int> result;
    for (const std::string& value : tree_as_array) {
        if (value == "None" || value == "null" || value == "NULL") {
            continue;
        }
        result.push_back(std::stoi(value));
    }
    return result;
}
