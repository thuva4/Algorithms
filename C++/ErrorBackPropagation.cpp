#include <stdio.h>
#include <iostream>
#include <time.h>
#include <vector>
#include <math.h>
#include <stdlib.h>
#include <cmath>

using namespace std;
struct train {
	int x1, x2, t;
};

double sigmoid(double x) {
	return 1 / (1 + exp(-x)); // Sigmoid
}

class NN {
public:
	vector<vector<double> >weight;
	struct train *training_data;
	double learning_rate;
	int data_size;
	double **hidden;
	double **output;
	int hnode_num;
	int outnode_num;

	NN() {
		data_size = 4;
		hnode_num = 2;
		learning_rate = 0.7;
		outnode_num = 1;
		weight = createWeight();
		training_data = (struct train *)malloc(sizeof(struct train) * 4);
		training_data[0].x1 = 1;
		training_data[0].x2 = 1;
		training_data[0].t = 0;

		training_data[1].x1 = 1;
		training_data[1].x2 = 0;
		training_data[1].t = 1;

		training_data[2].x1 = 0;
		training_data[2].x2 = 1;
		training_data[2].t = 1;

		training_data[3].x1 = 0;
		training_data[3].x2 = 0;
		training_data[3].t = 0;
		hidden = (double **)malloc(sizeof(double*) * data_size);
		output = (double **)malloc(sizeof(double*) * data_size);
		for (int i = 0; i < data_size; i++) {
			hidden[i] = (double*)malloc(sizeof(double) * hnode_num);
			output[i] = (double*)malloc(sizeof(double) * outnode_num);
		}
	}
	vector<vector<double> > createWeight() {
		vector<vector<double> > _weight;
		_weight.resize(3);
		for (int i = 0; i < 3;i++) {
			_weight[i].resize(3);
		}
		return _weight;
	}

	void ran_generate() {
		for (int i = 0; i < 3; i++) {
			for (int j = 0; j < 3; j++) {
				this->weight[i][j] = ((double)(rand() % 1000) -500) / 200;

			}
		}
	}

	void printresult(int iteration) {
		for (int i = 0; i < 4; i++) {
			cout << "iteration : " << iteration << "---- target : " << training_data[i].t << " NN : " << output[i][0] << endl;
		}
	}
};


int main() {
	srand(time(NULL));
	//initialize all weights to small random numbers
	NN nn = NN();
	nn.ran_generate();
	double **grad_outW;
	double **grad_hidW;
	grad_outW = (double **)malloc(sizeof(double*) * 1);
	grad_hidW = (double **)malloc(sizeof(double*) * 2);
	for (int i = 0; i < 3; i++) {
		grad_outW[i] = (double*)malloc(sizeof(double) * 3);
		grad_hidW[i] = (double*)malloc(sizeof(double) * 3);
	}
	int iteration = 0;
	//Repeat   
	while (1) {
		//   for each output node¡¯s weight wkj
		//   for each hidden node¡¯s weight wji
		for (int i = 0; i < 3;i++) grad_outW[0][i] = 0;
		for (int j = 0; j < 2; j++) {
			for (int i = 0; i < 3;i++)
				grad_hidW[j][i] = 0;
		}

		//   for each training example Dn = <xn1, xn2, ¡¦, xnd, tn1, tn2, ¡¦, tnm>
		for (int i = 0; i < nn.data_size; i++) {
			//      for each hidden node hj
			for (int j = 0; j < nn.hnode_num; j++) {
				double sum = (nn.training_data[i].x1 * nn.weight[j][0]) + (nn.training_data[i].x2 * nn.weight[j][1]) + (nn.weight[j][2]);
				nn.hidden[i][j] = sigmoid(sum);
			}


			//      for each output node ok
			for (int j = 0; j < nn.outnode_num; j++) {
				int jj = j + nn.hnode_num;
				double _sum = (nn.hidden[i][0] * nn.weight[jj][0]) + (nn.hidden[i][1] * nn.weight[jj][1]) + (nn.weight[jj][2]);
				nn.output[i][j] = sigmoid(_sum);

			}
			

			//      for each output node¡¯s weight wkj
			for (int k = 0; k < nn.outnode_num; k++) {//for each output
				for (int j = 0; j < 2; j++) {//for each output's output weights
					grad_outW[k][j] += (nn.learning_rate * (nn.training_data[i].t - nn.output[i][k]) * (nn.output[i][k]) * (1 - nn.output[i][k]) * nn.hidden[i][j]);
				}
				grad_outW[k][2] += (nn.learning_rate * (nn.training_data[i].t - nn.output[i][k]) * (nn.output[i][k]) * (1 - nn.output[i][k]));
				
			}


			//      for each hidden node¡¯s weight wji
			for (int j = 0; j < nn.hnode_num; j++) {//for each hidden node
				for (int l = 0; l < 3; l++) {//for each hidden's weights
					double _input = nn.training_data[i].x1;//(j == 0 ? nn.training_data[i].x1 : nn.training_data[i].x2);
					if (l == 1) _input = nn.training_data[i].x2;
					else if (l == 2) _input = 1;
					double sigma = 0;
					for (int o = 0; o < nn.outnode_num; o++) {
						int oo = o + nn.hnode_num;
						sigma = + (nn.weight[oo][j] * (nn.training_data[i].t - nn.output[i][o]) * nn.output[i][o] * (1 - nn.output[i][o]));
					}
					
					grad_hidW[j][l] += (nn.learning_rate * sigma * nn.hidden[i][j] * (1 - nn.hidden[i][j]) * _input);

				}
			}
			
			
			//   end of for
		}
		//   for each output node¡¯s weight
		for (int k = 0; k < nn.outnode_num; k++) {
			for (int j = 0; j < 3; j++) {
				int kk = k + nn.hnode_num;
				nn.weight[kk][j] += grad_outW[k][j];
			}
		}
		//   for each hidden node¡¯s weight
		for (int j = 0; j < nn.hnode_num; j++)
			for (int i = 0; i < 3; i++) {
				nn.weight[j][i] += grad_hidW[j][i];
			}
		
		//until(termination condition)
		iteration++;
		if(iteration % 1000 == 0) nn.printresult(iteration);
		if (iteration == 10000) {
			break;
		}
	}

}