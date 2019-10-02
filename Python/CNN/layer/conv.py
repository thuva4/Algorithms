import numpy as np
import scipy.signal as signal

from .layer import Layer

class Conv3x3(Layer):

  def __init__(self, num_filters):
    super().__init__()
    self.kernel_size = np.array([3,3])
    self.num_filters = num_filters
    self.filters = np.random.randn(3, 3, num_filters) / 9
    self.biases = np.random.randn(num_filters)

  def forward(self, input, debug=False):

    input = np.array(input)
    self.last_input = input
    self.last_input_shape = input.shape

    input_height, input_width = input.shape
    output_height, output_width = input_height - self.kernel_size[0] + 1, input_width -  self.kernel_size[1] + 1
    output = np.zeros((output_height, output_width, self.num_filters))
    for i in range(self.num_filters):
        output[:, :, i] = signal.correlate2d(input, self.filters[:,:,i], mode='valid') \
        + self.biases[i]

    self.output = output

    return output

  def backward(self, gradient, debug=False, learn_rate=0.005):

    weigh_gradient = np.zeros(self.filters.shape)
    biases_gradient = np.zeros(self.num_filters)
    kernel_height = self.filters.shape[1]
    kernel_width = self.filters.shape[2]
    window_height = self.last_input_shape[0] - kernel_height
    window_width = self.last_input_shape[1] - kernel_width

    for i in range(self.num_filters):
        weigh_gradient[:, :, i] = signal.correlate2d(self.last_input, gradient[:, :, i], mode='valid')
        biases_gradient[i] = np.sum(gradient[:, :, i])

    self.weigh_gradient = weigh_gradient
    self.biases_gradient = biases_gradient

    return None
    
  def get_params(self):
    return self.filters, self.biases

  def get_grads(self):
    return self.weigh_gradient, self.biases_gradient

  def update(self, debug=False):
    self.filters -= self.learning_rate * self.weigh_gradient
    self.biases -= self.learning_rate * self.biases_gradient