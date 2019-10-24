#include<stdio.h>
#include<stdlib.h>
# define max 20
void enqueue();
void dequeue();
//void peek();
void display();
int rear=-1,front=-1;
int que_arr[max];
int main()
{
	int ch;
	char cont;
	do
	{
		printf("**CIRCULAR QUEUE**\n");
		printf("Press 1 for ENQUEUE\n");
		printf("Press 2 for DEQUEUE\n");
	//	printf("Press 3 for PEEK\n");
		printf("Press 3 for DISPLAY\n");
		printf("Press 4 for EXIT\n");
		printf("Enter your choice: ");
		scanf("%d",&ch);
		switch(ch)  //menu-driven program
		{
			case 1: enqueue();
				break;
			case 2: dequeue();
				break;
		//	case 3: peek();
		//		break;
			case 3: display();
				break;
			case 4: exit(0);
			default: printf("Wrong Choice!\n");
		}  //end of switch case
		printf("\nAre you want to continue?: ");
		scanf("%s",&cont);
	}while(cont=='y'||cont=='Y');  //end of do-while
	return 0;
}  //end of main
void enqueue()
{
	int add_item;
	printf("Enter the element want to add: ");
	scanf("%d",&add_item);
	if(rear==max-1 && front==0)
	{
		printf("Queue is OVERFLOW\n");
	}
	else if(rear==-1 && front==-1)
	{
		rear=front=0;
		que_arr[rear]=add_item;
	}
	else if(rear==max-1 && front!=0)
	{
		rear=0;
		que_arr[rear]=add_item;
	}
	else
	{
		rear=rear+1;
		que_arr[rear]=add_item;
	}
}  //end of insertion i.e. enqueue
void dequeue()
{
	if(rear==-1  &&  front==-1)
	{
		printf("Queue is UNDERFLOW\n");
	}
	else
	{
		printf("Deleted element:%d",que_arr[front]);
		front++;
	}
}  //end of deletion i.e. dequeue
/*void peek()
{
	if(rear==-1 && front==-1)
	{
		printf("Queue is UNDERFLOW\n");
	}
	else
	{
		printf("%d",que_arr[front]);
	}
}  //end of peek (use to print the element which is going to be deleted first)*/
void display()
{
	int i=0;
	if(rear==-1 && front==-1)
	{
		printf("Queue is UNDERFLOW\n");
	}
	else
	{
		printf("The elements are: ");
		for(i=front;i<=rear;i++)
		{
			printf("%d\t",que_arr[i]);
		}
	}
	
}  //end of display
