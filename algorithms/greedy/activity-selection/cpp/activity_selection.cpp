#include <vector>
#include <algorithm>

int activitySelection(std::vector<int> arr) {
    int n = static_cast<int>(arr.size()) / 2;
    if (n == 0) {
        return 0;
    }

    std::vector<std::pair<int, int>> activities(n);
    for (int i = 0; i < n; i++) {
        activities[i] = {arr[2 * i], arr[2 * i + 1]};
    }

    std::sort(activities.begin(), activities.end(),
              [](const std::pair<int, int>& a, const std::pair<int, int>& b) {
                  return a.second < b.second;
              });

    int count = 1;
    int lastFinish = activities[0].second;

    for (int i = 1; i < n; i++) {
        if (activities[i].first >= lastFinish) {
            count++;
            lastFinish = activities[i].second;
        }
    }

    return count;
}
