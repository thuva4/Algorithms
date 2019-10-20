#include<bits/stdc++.h>
using namespace std;
// Funtion to check if found match is stable or not
bool check_pair(int student, int match, vector<int> stud_list, vector<int> com_list, unordered_map<int, int> &m) {
    int current = m[match];
    int index_cur;
    int index_stud;
    for (int i = 0; i < stud_list.size(); i++) {
        if (com_list[i] == current) 
            index_cur = i;
        if (com_list[i] == student)
            index_stud = i;
    }
    if (index_stud>index_cur)
        return false;
    else return true;
}
// Function to find appropriate match for a student
int find_pair(int student, vector<int> stud_list, vector<vector<int>> com_list, unordered_map<int, int> &m) {
    int i = 0;
    while (i<stud_list.size()){
        int match = stud_list[i];
        if (m.find(match) == m.end()) {
            return match;
        } else {
            if (check_pair(student, match, stud_list, com_list[match-1], m)) {
               m[match] = student;
               return match;
            } else {
                i++;
            }
        }
    }
}
// Function to implement Gale-Shapley Algorithm
vector<pair<int, int>> Matcher(vector<vector<int>> stud_list, vector<vector<int>> com_list) {
    unordered_map<int, int> m;
    vector<pair<int, int>> matches;
    int i =0, j =0;
    int match;
    while(m.size()<stud_list.size()) {
        match = find_pair(i+1, stud_list[i], com_list, m);
        //cout <<  "debug " << i+1 << " " <<match << endl;
        m[match] = i+1;
        i = (i+1)%stud_list.size();
    }
    for (auto i = m.begin(); i != m.end(); i++) {
        matches.push_back(make_pair(i->second, i->first));
    }
    return matches;
}
// Comparator Function
bool comp(pair<int, int> i, pair<int, int> j) {
    return (i.first<j.first);
}
int main() {
    //initializing the preference list
    vector<vector<int>> stud_list;
    vector<vector<int>> com_list;
    vector<int> temp;
    int tem;
    int no_stud, no_com;
    cout << "Enter no. of students and companies\n";
    cin >> no_stud >> no_com;
    cout << "Enter preference list of students\n";
    for (int i = 0; i< no_stud; i++) {
        for(int j =0; j<no_com; j++) {
            cin >> tem;
            temp.push_back(tem);
        }
        stud_list.push_back(temp);
        temp.clear();
    }
    cout << "Enter preference list of companies\n";
    for (int i = 0; i< no_com; i++) {
        for(int j =0; j<no_stud; j++) {
            cin >> tem;
            temp.push_back(tem);
        }
        com_list.push_back(temp);
        temp.clear();
    }
    cout << "Placing students...\n";
    vector<pair<int, int>> matches(no_stud, make_pair(0, 0));
    matches = Matcher(stud_list, com_list);
    sort(matches.begin(), matches.end(), comp);
    // Printing the Matched students
    for (auto i = matches.begin(); i != matches.end();i++) {
        cout << "Student: " << i->first << " is placed in " << "Company: " <<i->second <<endl;
    }
}