#include<bits/stdc++.h>
using namespace std;
 
/* Link list node */
struct Node
{
    int data;
    struct Node* next;
};
 
void push(struct Node** head_ref, int new_data)
{
    /* allocate node */
    struct Node* new_node = (struct Node*) malloc(sizeof(struct Node));
 
    /* put in the data  */
    new_node->data  = new_data;
 
    /* link the old list off the new node */
    new_node->next = (*head_ref);
 
    /* move the head to point to the new node */
    (*head_ref) = new_node;
}
 
int detectloop(struct Node *list)
{
    struct Node *slow_p = list, *fast_p = list;
  
    while (slow_p && fast_p && fast_p->next )
    {
        slow_p = slow_p->next;
        fast_p  = fast_p->next->next;
        if (slow_p == fast_p)
        {
           printf("Found Loop");
           return 1;
        }
    }
    return 0;
}
 
//The Main function
int main()
{
    /* Start with the empty list */
    struct Node* head = NULL;
 
    push(&head, 5);
    push(&head, 10);
    push(&head, 15);
    push(&head, 20);
 
    /* Create a loop for testing */
    head->next->next->next->next = head;
    detectloop(head);

    return 0;
}
#include <string>
#include <vector>

std::vector<std::vector<std::string>> floyd_warshall(const std::vector<std::vector<std::string>>& distance_matrix) {
    const long long inf = 1LL << 60;
    int n = static_cast<int>(distance_matrix.size());
    std::vector<std::vector<long long>> dist(n, std::vector<long long>(n, inf));

    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < static_cast<int>(distance_matrix[i].size()); ++j) {
            if (distance_matrix[i][j] == "Infinity") {
                dist[i][j] = inf;
            } else {
                dist[i][j] = std::stoll(distance_matrix[i][j]);
            }
        }
    }

    for (int k = 0; k < n; ++k) {
        for (int i = 0; i < n; ++i) {
            if (dist[i][k] == inf) {
                continue;
            }
            for (int j = 0; j < n; ++j) {
                if (dist[k][j] == inf) {
                    continue;
                }
                long long through_k = dist[i][k] + dist[k][j];
                if (through_k < dist[i][j]) {
                    dist[i][j] = through_k;
                }
            }
        }
    }

    std::vector<std::vector<std::string>> result(n, std::vector<std::string>(n));
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            result[i][j] = dist[i][j] == inf ? "Infinity" : std::to_string(dist[i][j]);
        }
    }
    return result;
}
