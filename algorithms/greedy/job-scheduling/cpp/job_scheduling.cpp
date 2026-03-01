#include <vector>
#include <algorithm>

using namespace std;

int job_scheduling(vector<int> arr) {
    int n = arr[0];
    vector<pair<int,int>> jobs(n);
    int maxDeadline = 0;
    for (int i = 0; i < n; i++) {
        jobs[i] = {arr[1 + 2*i], arr[1 + 2*i + 1]};
        maxDeadline = max(maxDeadline, jobs[i].first);
    }

    sort(jobs.begin(), jobs.end(), [](auto& a, auto& b) {
        return a.second > b.second;
    });

    vector<bool> slots(maxDeadline + 1, false);
    int totalProfit = 0;

    for (auto& job : jobs) {
        for (int t = min(job.first, maxDeadline); t > 0; t--) {
            if (!slots[t]) {
                slots[t] = true;
                totalProfit += job.second;
                break;
            }
        }
    }

    return totalProfit;
}
