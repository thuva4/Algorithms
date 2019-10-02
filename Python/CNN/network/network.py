import numpy as np

class Network:
	def __init__(self, layers, debug=False):
		self.layers = layers

	def forward(self, input, debug=False):
		# input = np.array(input).reshape(-1, 1)
		for layer in self.layers:
			input = layer.forward(input, debug)
		output = input
		self.output = output
		return output

	def backward(self, gradient, debug=False):
		# gradient = np.array(gradient).reshape(-1, 1)
		for layer in self.layers[::-1]:
			gradient = layer.backward(gradient, debug)

	def update(self, debug=False):
		for layer in self.layers:
			layer.update(debug)

	def get_layers(self):
		return self.layers