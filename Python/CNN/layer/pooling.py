import numpy as np

from .layer import Layer

class MaxPool2(Layer):

  def forward(self, input, debug=False):
    self.last_input = input

    input1 = input[::2]
    input2 = input[1::2]
    pool_height = np.where(input1 > input2, input1, input2)

    pool_height1 = pool_height[:, ::2]
    pool_height2 = pool_height[:, 1::2]
    pool = np.where(pool_height1 > pool_height2, pool_height1, pool_height2)

    return pool

  def backward(self, gradient, debug=False):

    gradient_repeat_vertical = np.repeat(gradient, 2, axis=0)
    gradient_repeat_square = np.repeat(gradient_repeat_vertical, 2, axis=1)
    output = np.where(self.last_input == gradient_repeat_square, self.last_input, 0)

    return output