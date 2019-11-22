#define _CRT_SECURE_NO_WARNINGS
//#include <iostream>
#include <stdio.h>
//using namespace std;
int MinPlayer(char[3][3]);
int MaxPlayer(char[3][3]);

int evaluate(char arr[3][3]){
	for (int i = 0; i < 3; i++){
		if (arr[i][0] == arr[i][1] && arr[i][1] == arr[i][2]){
			if (arr[i][0] == 'x')
				return 10;
			else if (arr[i][0] == 'o')
				return -10;
		}
		if (arr[0][i] == arr[1][i] && arr[1][i] == arr[2][i]) {
			if (arr[0][i] == 'x')
				return 10;

			else if (arr[0][i] == 'o')
				return -10;
		}
	}
	if (arr[0][0] == arr[1][1] && arr[1][1] == arr[2][2]){
		if (arr[0][0] == 'x')
			return 10;
		else if (arr[0][0] == 'o')
			return -10;
	}
	if (arr[0][2] == arr[1][1] && arr[1][1] == arr[2][0]){
		if (arr[0][2] == 'x')
			return 10;
		else if (arr[0][2] == 'o')
			return -10;
	}
	return 0;
}

int MaxPlayer(char arr[3][3]) {
	int profit = evaluate(arr);
	if (profit == 10 || profit == -10)
		return profit;
	int check = 0;
	for (int i = 0; i < 3; i++) {
		for (int j = 0; j < 3; j++) {
			if (arr[i][j] == '-' || check == 1) {
				check = 1;
				break;
			}
		}
	}
	if (check == 0)
		return 0;
	int M = -9999;
	int m;
	for (int i = 0; i < 3; i++) {
		for (int j = 0; j < 3; j++) {
			if (arr[i][j] == '-') {
				arr[i][j] = 'x';
				m = MinPlayer(arr);
				if (m > M)
					M = m;
				arr[i][j] = '-';
			}
			
		}
	}
	return M;
}

int MinPlayer(char arr[3][3]) {
	int profit = evaluate(arr);
	if (profit == 10 || profit == -10)
		return profit;
	int check = 0;
	for (int i = 0; i < 3; i++) {
		for (int j = 0; j < 3; j++) {
			if (arr[i][j] == '-') {
				check = 1;
				break;
			}
		}
		if (check == 1)
			break;
	}
	if (check == 0)
		return 0;
	int M = 9999;
	int m;
	for (int i = 0; i < 3; i++) {
		for (int j = 0; j < 3; j++) {
			if (arr[i][j] == '-') {
				arr[i][j] = 'o';
				m = MaxPlayer(arr);
				if (m < M)
					M = m;
				arr[i][j] = '-';
			}
			
		}
	}
	return M;
}

void search(char arr[3][3]) {
	int x, y;
	int maxvalue = -9999;
	int minvalue = 9999;
	int a;
	int maxcnt = 0;
	int mincnt = 0;
	for (int i = 0; i < 3; i++) {
		for (int j = 0; j < 3; j++) {
			if (arr[i][j] == 'x')
				maxcnt++;
			else if (arr[i][j] == 'o')
				mincnt++;
		}
	}

	for (int i = 0; i < 3; i++) {
		for (int j = 0; j < 3; j++) {
			if (arr[i][j] == '-') {
				if (mincnt >= maxcnt) {
					arr[i][j] = 'x';
					a = MinPlayer(arr);
					if (maxvalue < a) {
						x = j;
						y = i;
						maxvalue = a;
					}
				}
				else {
					arr[i][j] = 'o';
					a = MaxPlayer(arr);
					if (minvalue > a) {
						x = j;
						y = i;
						minvalue = a;
					}
				}
			}
			arr[i][j] = '-';
		}
	}
	printf("(%d,%d) ", y, x);
	
}

int main() {
	char arr[3][3] = {'-','-','-','-','-','-','-','-','-'};
	search(arr);
}