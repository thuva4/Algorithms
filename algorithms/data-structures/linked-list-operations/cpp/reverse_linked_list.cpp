#include <vector>

struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

static Node* buildList(const std::vector<int>& arr) {
    if (arr.empty()) {
        return nullptr;
    }
    Node* head = new Node(arr[0]);
    Node* current = head;
    for (size_t i = 1; i < arr.size(); i++) {
        current->next = new Node(arr[i]);
        current = current->next;
    }
    return head;
}

static std::vector<int> toArray(Node* head) {
    std::vector<int> result;
    Node* current = head;
    while (current != nullptr) {
        result.push_back(current->value);
        current = current->next;
    }
    return result;
}

static void freeList(Node* head) {
    while (head != nullptr) {
        Node* next = head->next;
        delete head;
        head = next;
    }
}

std::vector<int> reverseLinkedList(std::vector<int> arr) {
    Node* head = buildList(arr);

    Node* prev = nullptr;
    Node* current = head;
    while (current != nullptr) {
        Node* next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }

    std::vector<int> result = toArray(prev);
    freeList(prev);
    return result;
}
