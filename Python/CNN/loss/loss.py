import numpy as np

class Loss:

	def loss(self, predicted, actual):
		raise NotImplementedError

	def gradient(self, predicted, actual):
		raise NotImplementedError

class SSE(Loss):

	def loss(self, predicted, actual, debug=False):
		predicted = np.array(predicted)
		actual = np.array(actual).reshape(predicted.shape)
		return np.sum(np.square(predicted-actual))

	def gradient(self, predicted, actual, debug=False):
		predicted = np.array(predicted)
		actual = np.array(actual).reshape(predicted.shape)
		return (predicted - actual) * 2

class CrossEntropy(Loss):

	def loss(self, predicted, actual, debug=False):
		predicted = np.array(predicted)
		actual = np.array(actual).reshape(predicted.shape)
		return -np.log(predicted[actual==1])

	def gradient(self, predicted, actual, debug=False):
		predicted = np.array(predicted)
		actual = np.array(actual).reshape(predicted.shape)
		gradient = np.zeros(predicted.shape)
		gradient[actual==1] = -1 / predicted[actual==1]
		return gradient

class CategoryCrossEntropy(Loss):
	def loss(self, predicted, actual, debug=False):
		predicted = np.array(predicted)
		actual = np.array(actual).reshape(predicted.shape)
		return -np.log(predicted[actual==1])

	def gradient(self, predicted, actual, debug=False):
		predicted = np.array(predicted)
		actual = np.array(actual).reshape(predicted.shape)
		gradient = np.zeros(predicted.shape)
		gradient[actual==1] = -1 / predicted[actual==1]
		return gradient