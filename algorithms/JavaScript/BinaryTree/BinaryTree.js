class BinaryTreeNode{
     data;
     left;
     right;
     constructor(val) { this.data = val; this.left = null;
     this.right = null;}
}

main();
    

    function takeInputLevelOrder() 
    { 
        var data = prompt("Enter the root data");

        if (data == -1)
            return null;

        var root = new BinaryTreeNode(data);
        var toTakeInput = [];
        toTakeInput.push(root);

        while(!(toTakeInput === undefined || toTakeInput == 0)){
            var temp = toTakeInput.shift();             // front element of queue is stored in temp variable 
                                                     				// front element is popped from the queue

            data = prompt("Enter the left node of " + temp.data);         // data of left node is entered
            
            
            if(data != -1){
            leftnode = new BinaryTreeNode(data);   // left node is created 
            temp.left = leftnode;                                       // leftnode is linked to the temp node popped from queue by pointing left pointer to it
            toTakeInput.push(leftnode);                                 // left node is pushed in the queue to take input of it when it is at front position in the queue
            }

            data = prompt("Enter the right node of " + temp.data);          // data of left node is entered
            if(data != -1){
            rightnode = new BinaryTreeNode(data);   // right node is created 
            temp.right = rightnode;                                       // rightnode is linked to the temp node popped from queue by pointing right pointer to it
            toTakeInput.push(rightnode);   								// right node is pushed in the queue to take input of it when it is at front position in the queue
            }
        }
        return root;
    }
    
    function printLevelOrder(root)
    {            
	
        if(root == null)
            return;                                     		  // if root is null then return as the tree is empty
        
        qu = [];    // queue is created to store BinaryTreeNode pointers to print level wise using FIFO technique
        qu.push(root);
    
        while(!(qu === undefined || qu == 0)){
            
        node = qu.shift();                           // front node is stored in node variable
                                                           			// front element is popped
        
        if(node != null)
        console.log(node.data + "  ");                       // node is printed
        
        if(node.left != null)
            qu.push(node.left);
        
        if(node.right != null)
            qu.push(node.right);
        }
    }
        
        
    function PreOrder_Traversal(root){         // template PreOrder traversal function using recursion
        if(root == null)return;
        
        console.log(root.data + "  ");
        PreOrder_Traversal(root.left);
        PreOrder_Traversal(root.right);
    }
  
    function PostOrder_Traversal(root){       // template PostOrder traversal function using recursion 
      if(root == null)return;
      
      PostOrder_Traversal(root.left);
      PostOrder_Traversal(root.right);
      console.log(root.data + "  ");
      }
      
      function InOrder_Traversal(root){         //  template InOrder traversal function using recursion 
      if(root == null)return;
      
      InOrder_Traversal(root.left);
      console.log(root.data + "  ");
      InOrder_Traversal(root.right);
      }
      
      function main(){
	       root = takeInputLevelOrder();
	       console.log("Level Order : "); printLevelOrder(root);
	       console.log("");
	       console.log(" PreOrder : ");  PreOrder_Traversal(root);
	       console.log("");
	       console.log(" PostOrder : "); PostOrder_Traversal(root);
	       console.log("");
	       console.log(" InOrder : "); InOrder_Traversal(root);
	      }
    
