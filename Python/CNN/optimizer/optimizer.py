import numpy as np

class Optimizer:
	def step(self, network):
		raise NotImplementedError

class GradientDescent(Optimizer):
	def __init__(self, learning_rate = 0.1, debug=False):
		self.learning_rate = learning_rate

	def step(self, network, debug=False):
		return network.update()