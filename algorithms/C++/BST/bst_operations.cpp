#include <bits/stdc++.h>

using namespace std;

struct bstnode{
int data;
bstnode* left;
bstnode* right;
};

bstnode* Newnode(int data){
    bstnode* node = new bstnode();
    node->data=data;
    node->left=NULL;
    node->right=NULL;
    return node;
}


bstnode* Insert(bstnode* root, int data){
    if(root==NULL)
            root = Newnode(data);
    else if(data <= root->data)
            root->left = Insert(root->left,data);
    else
            root->right = Insert(root->right,data);

    return root;
}

void bfs(bstnode* root){
     queue <bstnode*> q;
    
    if(root==NULL)
        return;
    else{
    q.push(root);
    while(!q.empty()){
        bstnode* curr=q.front();
        if(curr->left!=NULL)
            q.push(curr->left);
         if(curr->right!=NULL)
            q.push(curr->right);
        cout<<curr->data<<" ";
        q.pop();
        }
    }    

}

bool Search(bstnode* root,int data){
    if(root==NULL)
            return false;
    else if(root->data==data)
            return true;
    else if(data<root->data)
            return Search(root->left,data);
    else
            return Search(root->right,data);
}

int main(){
	int ch;
     bstnode* node = NULL;
     node = Insert(node,15);            
     node =Insert(node,25);
     node =Insert(node,13);
     node =Insert(node,12);
     node =Insert(node,11);
     node =Insert(node,18);
     node =Insert(node,17);
     node =Insert(node,14);
     node =Insert(node,26);
     node =Insert(node,16);
     node =Insert(node,28);


        /*       15
               /    \
              13     25
             /  \    / \
            12  14  18  26
           /       /     \
          11      17     28
          
           */
	cout<<"************* BST Operations *************"<<endl;
	cout<<"1. Search Operation  2. BFS Traversal "<<endl;
	cout<<"Enter your choice : ";
	cin>>ch;
	switch(ch){
	case 1: int n;
     		cout<<"Enter no to be searched : ";
     		cin>>n;
     		if(Search(node,n) == true)
            		cout<<"Element found ";
     		else
            		cout<<"Element not found ";
		break;
	case 2: cout<<" The BFS traversal is : ";
        	bfs(node);

	deafult : cout<<"Please enter valid choice!";
	}
        

        
}
