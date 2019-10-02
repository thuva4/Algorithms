import numpy as np

from .layer import Layer

class Softmax(Layer):
  # A standard fully-connected layer with softmax activation.

  def __init__(self, input_len, nodes):
    super().__init__()
    self.output_dim = nodes
    self.weights = np.random.randn(input_len, nodes) / input_len
    self.biases = np.zeros((nodes, 1))

  def forward(self, input, debug=False):
    self.last_input_shape = input.shape

    input = input.reshape(-1, 1)
    self.last_input = input
    # input = input.reshape(-1, 1)

    input_len, nodes = self.weights.shape


    ## TODO: totals: (output_dim,) =>(output_dim, 1)
    totals = np.dot(self.weights.T, input) + self.biases
    self.last_totals = totals

    ## TODO: exp: (output_dim,) =>(output_dim, 1): from totals
    exp = np.exp(totals)
    return exp / np.sum(exp, axis=0)

  def backward(self, gradient, debug=False):
    '''
    Performs a backward pass of the softmax layer.
    Returns the loss gradient for this layer's inputs.
    - d_L_d_out is the loss gradient for this layer's outputs.
    - learn_rate is a float.
    '''
    gradient = np.array(gradient).reshape(-1, 1)

    # e^totals
    t_exp = np.exp(self.last_totals)

    # Sum of all e^totals
    S = np.sum(t_exp)

    # Gradients of out[i] against totals
    d_out_d_t = -t_exp * t_exp.reshape(-1) / (S ** 2)
    for i in range(self.output_dim):
      d_out_d_t[i, i] = t_exp[i] * (S - t_exp[i]) / (S ** 2) 

    # Gradients of totals against weights/biases/input
    d_t_d_w = np.array(self.last_input)
    d_t_d_b = 1
    d_t_d_inputs = self.weights

    # Gradients of loss against totals
    d_L_d_t = np.dot(d_out_d_t, gradient)

    # Gradients of loss against weights/biases/input
    d_L_d_w = np.array(self.last_input) * d_L_d_t.reshape(-1)
    d_L_d_b = d_L_d_t * d_t_d_b
    d_L_d_inputs = np.dot(d_t_d_inputs, d_L_d_t)

    # Update weights / biases
    self.weight_gradient = d_L_d_w.reshape(self.weights.shape)
    self.bias_gradient = d_L_d_b.reshape(self.biases.shape)

    return d_L_d_inputs.reshape(self.last_input_shape)
  def get_params(self):
    return self.weights, self.biases

  def get_grads(self):
    return self.weight_gradient, self.bias_gradient

  def update(self, debug=False):
    self.weights -= self.learning_rate * self.weight_gradient
    self.biases -= self.learning_rate * self.bias_gradient