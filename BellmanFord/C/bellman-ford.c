vector <int> graph [100005];    // graph is a vector to store the graph
    int distance [100005];

    for(int i = 0; i < m + 2; i++){    // initializing the distance as infinite

        graph[i].clear();
        distance[i] = INT_MAX;
    }

   for(int i = 0; i < m; i++){

        cin>>from>>next>>weight;    //from and next are the vertices and weight is the edge weiht betwenn the pair of vertices

        graph[i].push_back(from);
        graph[i].push_back(next);
        graph[i].push_back(weight);
   }

    distance[0] = 0;
    for(int i = 0; i < n - 1; i++){
        int j = 0;
        while(graph[j].size() != 0){

            if(distance[ graph[j][0]  ] + graph[j][2] < distance[ graph[j][1] ] ){     //comparing the current and new distances between the pair of vertices
                distance[ v[j][1] ] = distance[ graph[j][0]  ] + graph[j][2];          //updating the minimum distance
            }
            j++;
        }
    }
