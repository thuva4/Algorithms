#include <string>
#include <vector>

std::vector<int> fenwick_tree_operations(
    std::vector<int> array,
    const std::vector<std::vector<std::string>>& queries
) {
    std::vector<int> result;

    for (const std::vector<std::string>& query : queries) {
        if (query.empty()) {
            continue;
        }

        if (query[0] == "update" && query.size() >= 3) {
            int index = std::stoi(query[1]);
            int value = std::stoi(query[2]);
            if (index >= 0 && index < static_cast<int>(array.size())) {
                array[index] = value;
            }
            continue;
        }

        if (query[0] == "sum" && query.size() >= 2) {
            int index = std::stoi(query[1]);
            int total = 0;
            for (int i = 0; i <= index && i < static_cast<int>(array.size()); ++i) {
                total += array[i];
            }
            result.push_back(total);
        }
    }

    return result;
}
