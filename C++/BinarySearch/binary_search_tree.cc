#include <iostream>

using namespace std;

struct Node {
	int data;
	Node *right, *left;
	Node(int _data, Node *r = nullptr, Node* l = nullptr) : data(_data), right(r), left(l) {}
};

class BST {
private:
	Node *root;
	
	void insert(Node* root, int data) {
		if(root->data > data) {
			if(!root->left) {
				root->left = new Node(data);
			} else {
				insert(root->left, data);
			}
		} else {
			if(!root->right) {
				root->right = new Node(data);
			} else {
				insert(root->right, data);
			}
		}
	}
	
	Node* min(Node *root) {
		while(root->left != nullptr) root = root->left;
		return root;
	}

	Node* remove(Node* root, int data) {
		if(root == nullptr) return root;
		else if(root->data > data) root->left = remove(root->left, data);
		else if(root->data < data) root->right = remove(root->right, data);
		else {
			Node* tmp = root;
			if(root->right == nullptr && root->left == nullptr) {
				delete root;
				root = nullptr;
			} else if(root->right == nullptr) {
				root = root->left;
				delete tmp;
			} else if(root->left == nullptr) {
				root = root->right;
				delete tmp;
			} else {
				tmp = min(root->right);
				root->data = tmp->data;
				root->right = remove(root->right, tmp->data);
			}
		}
		
		return root;
	}
	void printBST(Node* root) {
		if(!root) return;

		printBST(root->left);
		cout << root->data << ' ';
		printBST(root->right);
	}

public:
	void add(int data) {
		if(root) {
			this->insert(root, data);
		} else {
			root = new Node(data); 
		}
		
	}
	
	void rem(int data) {
		if(root) {
			this->remove(root, data);
		} else return;
	}

	void print() {
		printBST(this->root);
	}
};

int main() {
	BST* bst = new BST();
	int n; cin >> n;
	for(int i = 0; i < n; i++) {
		int zz;
		std::cin >> zz;
		bst->add(zz);
	}
	int zz;
	std::cin >> zz;
	bst->rem(zz);
	bst->print();

	delete bst;

	return 0;
}
