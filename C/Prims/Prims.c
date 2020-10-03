#include<stdio.h>
#include<stdlib.h>
#define MAX 20
#define INFINITY 999
int cost[MAX][MAX],visited[MAX];
void prims(int cost[][MAX],int n){

   int i,j,ne=1;
   int a,b,u,v,min,mincost=0;
   for(i=0;i<=n;i++)
    visited[i]=0;
    printf("\n edges of the spanning tree");
    visited[1]=1;
    while(ne<n){
        for(i=1,min=INFINITY;i<n;i++)
        {
            for(j=1;j<=n;j++){

                if(cost[i][j]<min)
                if(visited[i]==0){
                    continue;
                }
                else{
                    min=cost[i][j];
                    a=u=i;
                    b=v=j;
                }
            }



        }
        if(visited[u]==0 || visited[v]==0){

            printf("\n%d.EDGE(%d%d)=%d\n",ne++,a,b,min);
            mincost+=min;
            visited[b]=1;
        }

        cost[a][b]=cost[b][a]=INFINITY;
    }
    printf("\n MINIMUM COST=%d\n",mincost);
}

   int main(int argc,char *argv[]){
       int n,i,j;
       printf("enter the number of elements\n");
        scanf("%d\n",&n);
      for(i=0;i<n;i++){
        for(j=0;j<=n;j++){
          if(cost[i][j]<min)
		     if(visited[i]!=0) {




        }
      }

           prims(cost,n);
           return 0;

   }




