#include <bits/stdc++.h>
#define PB push_back
typedef long long int ll;
using namespace std;

struct point{
    int x, y;
};
point p0;

point nextToTop(stack<point> &s){
    point p = s.top();
    s.pop();
    point res = s.top();
    s.push(p);
    return res;
}

int swap(point &p1, point &p2){
    point temp = p1;
    p1 = p2;
    p2 = temp;
}

int disSq(point p1, point p2){
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

int orientation(point p, point q, point r){
    int val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if(val == 0)    // colinear
        return 0;
    else if(val > 0)    // clockwise
        return 1;
    else                // counterClockwise
        return 2;
}

bool cmp(point p1, point p2){
    int o = orientation(p0, p1, p2);
    if(o == 0)
        return (disSq(p0, p2) >= disSq(p0, p1))? true : false;
    else if(o == 2)
        return true;
    else
        return false;
}

void convexHull(point *points, int n){
    int ymin = points[0].y, min = 0, i;
    for(i = 1;i < n; i++){
        int y = points[i].y;
        if(y < ymin || (ymin == y && points[i].x < points[min].x))
            ymin = points[i].y, min = i;
    }
    swap(points[0], points[min]);
    p0 = points[0];
    sort(&points[1], &points[1] + n - 1, cmp);      // n - 1 signifies the number of elements
    int m = 1;
    for(i = 1;i < n; i++){
        while(i < n - 1 && orientation(p0, points[i], points[i+1]) == 0)
            i++;
        points[m] = points[i];
        m++;
    }
    if(m < 3)       // Hull doesn't exist
        return;
    stack<point> s;
    s.push(points[0]);
    s.push(points[1]);
    s.push(points[2]);
    for(i = 3;i < m; i++){
        while(orientation(nextToTop(s), s.top(), points[i]) != 2)
            s.pop();
        s.push(points[i]);
    }
    while(!s.empty()){
        point p = s.top();
        cout << "(" << p.x << ", " << p.y << ")" << endl;
        s.pop();
    }
}

int main(){
    ios_base::sync_with_stdio(false);cin.tie(NULL);
    point points[100100];
    int n;
    cin >> n;
    for(int i = 0;i < n; i++){
        int x, y;
        cin >> x >> y;
        points[i].x = x;
        points[i].y = y;
    }
    convexHull(points, n);
    return 0;
}

