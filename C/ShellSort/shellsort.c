#include <stdio.h>
#define MAX 100

void shellSort(int array[], int size);

int main(void)
{   
	
	/*
	 * Welcome to ShellSort! Have fun sorting numbers :D
	*/
	int size, flag;
	int array[MAX];
	
	do
	{
		flag = 1;

		printf("How many integers do you want to sort?\n");
		scanf("%d", &size);

		size > 100
		? printf("Sorry, but I can't sort more than the defined <MAX> limit :(\nIf you need to sort more than <MAX>, change it in line 2\n")
		: printf("All ok!\n"), flag=0;

	}while(flag);

	for(int i = 0; i < size; i++)
	{
		printf("Insert number #%d: ", i+1);
		scanf("%d", &array[i]);
		printf("\n");
	}

	shellSort(array, size);

	printf("Sorted array:\n");
	for(int i = 0; i < size; i++)
		printf("%d ", array[i]);
	
	printf("\n");
	return 0;
}

void shellSort(int array[], int size)
{	
	int i, j;
	int spacing = 1;
	
	int tmp;

	while(spacing < size)
		spacing = 3*spacing+1;

	while(spacing > 0)
	{
		for(int i = spacing; i < size;i++)
		{
			tmp = array[i];
			j = i;

			while((j > spacing-1) && (tmp < array[j-spacing]))
			{
				array[j] = array[j-spacing];
				j -= spacing;
			}
			array[j] = tmp;
		}
		spacing = spacing/3;
	}
}

