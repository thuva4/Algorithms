vector<int> root, sz; 

void init(int n){ //initialize sets 
    root.clear() ;
    sz.clear();
    root.resize(n + 1) , sz.resize(n + 1) ;
    for(int i = 0 ; i < n + 1; ++i)
        root[i] = i , sz[i] = 1 ; // initially all sets are singletons.
    return ;
}

int parent(int node){
    if(root[node] == node) 
        return node ; // parent of its own set. 
    return root[node] = parent(root[node]) ; // path compression 
}

void merge(int A , int B){

    A = parent(A); // find root of A's set

    B = parent(B); // find root of B's set

    if(A == B) // belong to the same set
        return ;
    if(sz[A] < sz[B]) //union by size. 
        swap(A , B); 
    root[B] = A;  // parent of B is set to A 
    sz[A] += sz[B]; // add elements of B's set to A
    sz[B] = 0; // B is no longer a root
}

bool union_find(int A , int B){
    // to check if A and B belong to same set
    return parent(A) == parent(B) ;
}
