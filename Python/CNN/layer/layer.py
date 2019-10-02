import numpy as np

class Layer:
	def __init__(self, learning_rate=0.01):
		self.learning_rate = learning_rate
	def forward(self, input):
		raise NotImplementedError
	def backward(self, gradient):
		raise NotImplementedError
	def get_params(self):
		return None, None
	def get_grads(self):
		return None, None
	def update(self, *args):
		return None