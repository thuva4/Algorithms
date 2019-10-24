#include<stdio.h>
#include<process.h>
#include<stdlib.h>
void create();
void display();
void insert();
void search();
void deletion();
void reverse();
struct std{
	int roll;
	char name[30];
	struct std *next;
};
struct std *head=NULL,*tail=NULL;
int main()
{
	int ch;
	char a;
	do
	{
		printf("***It is a Linked List***\n");
		printf("Press 1 for CREATE\n");
		printf("Press 2 for DISPLAY\n");
		printf("Press 3 for INSERT\n");
		printf("Press 4 for SEARCH\n");
		printf("Press 5 for DELETE\n");
		printf("Press 6 for REVERSE\n");
		printf("Press 7 for EXIT\n");
		printf("Enter your choice: ");
		scanf("%d",&ch);
		switch(ch)
		{
			case 1: create();
				break;
			case 2: display();
				break;
			case 3: insert();
				break;
			case 4: search();
				break;
			case 5: deletion();
				break;
			case 6:reverse();
				break;
			case 7: exit(0);
			default:printf("Wrong Choice!\n");
		}   //end of switch case
		printf("Are you want to continue?: ");
		scanf("%s",&a);
	}while(a=='y' || a=='Y');   //end of do-while loop
	return 0;
}   //end of main
void create()
{
	struct std *p;
	p=(struct std*)malloc(sizeof(struct std));
	printf("The Roll: ");
	scanf("%d",&p->roll);
	printf("The Name: ");
	fflush(stdin);
	gets(p->name);
	p->next=NULL;
	if(head==NULL)
	{
		head=p;
		tail=p;
	}
	else
	{
		tail->next=p;
		tail=p;  //node addition at the end  	/*p->next=head;head=p;tail=p->next;-node addition at the beginning*/
	}
}  //end of create()
void display()
{
	struct std *p;
	p=head;
	while(p!=NULL)
	{
		printf("The Roll is:%d",p->roll);
		printf("\nThe name is: ");
		fflush(stdout);
		puts(p->name);
		p=p->next;
	}
	
}     //end of display()
void insert()
{
	struct std *p,*q=head;
	int pos,count=1;
	printf("Enter the position where you want to insert: ");
	scanf("%d",&pos);  //taking the position
	p=(struct std*)malloc(sizeof(struct std));
	printf("Enter Roll No.: ");
	scanf("%d",&p->roll);
	printf("Enter Name: ");
	fflush(stdin);
	gets(p->name);
	if(pos==1)
	{
		p->next=head;  //insertion at the beginning
		head=p;
	}
	else
	{
		while(count<pos-1)
		{
			q=q->next;
			count++;
		}   //end of while() to count the position
		p->next=q->next;
		q->next=p;
		if(p->next==NULL)  //link part of p equals to NULL
		{
			tail=p;
		}
	}  //end  of if-else
}  //end of insert()
void search()
{
	struct std *q=head,*p;
	int flag=1,roll_no;
	p=(struct std*)malloc(sizeof(struct std));
	printf("Enter the roll no.: ");
	scanf("%d",&p->roll);
	printf("Enter the name: ");
	fflush(stdin);
	gets(p->name);
	printf("Enter the roll no., you searching for: ");
	scanf("%d",&roll_no);
	while(q->next!=NULL)
	{
		if(q->roll==roll_no)
		{
			flag=0;
			p->next=q->next;
			q->next=p;
		}
		if(p->next==NULL)
		{
			tail=p;
		}
		q=q->next;
	}
	if(flag==0)
	{
		printf("Searching and insertion is successful\n");
	}
	else
	{
		printf("Searching failed!\n");
	}
}   //end of search();
void deletion()
{
	int pos,count=1;
	struct std *p,*q;
	printf("Enter the position from where you want to delete: ");
	scanf("%d",&pos);
	if(head==NULL)
	{
		printf("\nThe list is UNDERFLOW!");
	}
	else
	{
		if(pos==1)
		{
			p=head;
			head=head->next;
			free(p);
		}
		else
		{
			while(count<(pos-1))
			{
				p=p->next;
				count++;
			}
			q=p->next;
			p->next=q;
			free(q);
			if(p->next==NULL)
			{
				tail=p;  //tail updation
			}
			
		}
	}
}  //end of deletion()
void reverse()
{
	struct std *p,*q,*t;
	p=head; 
	t=NULL;
	q=p->next;
	while(p!=NULL)
	{
		q=p->next;
		p->next=t;
		t=p;
		p=q;
		
	}
	//p->next=t;
	head=t;
	
}  //end of reverse()
