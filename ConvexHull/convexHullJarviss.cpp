#include <bits/stdc++.h>
#define PB push_back
typedef long long int ll;
using namespace std;

struct point{
    int x, y;
};
vector<point> hull;

int orientation(point p, point q, point r){
    int val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if(val == 0)    // p, q, r are colinear
        return 0;
    else if(val > 0)// Clockwise
        return 1;
    else            // CounterClockwise
        return 2;
}

void convexHull(point *points, int n){
    int l = 0;
    if(n < 3)   // Hull doesn't exist
        return;
    for(int i = 1;i < n; i++)       // finding the left-most point
        if(points[i].x < points[l].x)
            l = i;
    int start = l, q;
    do{
        hull.PB(points[l]);
        q = (l + 1) % n;
        for(int i = 0;i < n; i++){
            // If i is more counterclockwise than current q, then update q
            if(orientation(points[l], points[i], points[q]) == 2)
                q = i;
        }
        l = q;
    }
    while(l != start);
}


int main(){
    int i, n, x, y;
    ios_base::sync_with_stdio(false);cin.tie(NULL);
    cin >> n;
    point points[100100];
    for(i = 0;i < n; i++){
        cin >> x >> y;
        points[i].x = x;
        points[i].y = y;
    }
    convexHull(points, n);
    for(i = 0;i < hull.size(); i++)
        cout << "(" << hull[i].x << ", " << hull[i].y << ")\n";
    return 0;
}
