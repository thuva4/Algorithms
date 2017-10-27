#include <bits/stdc++.h>
#define PB push_back
typedef long long int ll;
using namespace std;

struct Point{
    int x, y;
};

// If collinear, do they intersect? i.e. does q lie on 'pr'
bool intersect(Point p, Point q, Point r){
    if(q.x <= max(p.x, r.x) && q.x >= min(p.x, r.x) && q.y <= max(p.y, r.y) && q.y >= min(p.y, r.y))
        return true;
    return false;
}

// 0 --> colinear
// 1 --> Clockwise
// 2 --> CounterClockwise
int orientation(Point p, Point q, Point r){
    int val = (q.y - p.y)*(r.x - q.x) - (q.x - p.x)*(r.y - q.y);
    if(val == 0)    return 0;
    if(val > 0)     return 1;
    if(val < 0)     return 2;
}

int doIntersect(Point p1, Point q1, Point p2, Point q2){
    int o1 = orientation(p1, q1, p2);
    int o2 = orientation(p1, q1, q2);
    int o3 = orientation(p2, q2, p1);
    int o4 = orientation(p2, q2, q1);
    if (o1 != o2 && o3 != o4)
        return true;

    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 == 0 && intersect(p1, p2, q1)) return true;
              
    // p1, q1 and p2 are colinear and q2 lies on segment p1q1
    if (o2 == 0 && intersect(p1, q2, q1)) return true;
                       
    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 == 0 && intersect(p2, p1, q2)) return true;
                                
    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 == 0 && intersect(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases
}

