import mnist
import numpy as np
from layer import Conv3x3
from layer import ReLU
from layer import MaxPool2
from layer import Softmax
from network import Network
from optimizer import GradientDescent
from loss import CrossEntropy

# We only use the first 1k examples of each set in the interest of time.
# Feel free to change this if you want.
train_images = mnist.train_images()
train_labels = mnist.train_labels()
test_images = mnist.test_images()
test_labels = mnist.test_labels()

conv = Conv3x3(8)                  # 28x28x1 -> 26x26x8
relu = ReLU()                      # 26x26x3 -> 26x26x3
pool = MaxPool2()                  # 26x26x8 -> 13x13x8
softmax = Softmax(13 * 13 * 8, 10) # 13x13x8 -> 10

net = Network([conv, relu, pool, softmax])
optimizator = GradientDescent(0.01)
losser = CrossEntropy()

def preprocess(image):
    return (image / 255) - 0.5

def forward(image):
    pred = net.forward(image)
    pred = pred.reshape(-1)
    return pred

def backward(gradient):
    net.backward(gradient)
    optimizator.step(net)

def calc_loss(pred, actual):
    label = np.argwhere(actual == 1)[0]
    l = losser.loss(pred, actual)
    acc = 1 if np.argmax(pred) == label else 0
    return l, acc

def train(image, label):
    pred = forward(image)
    actual = np.zeros(pred.shape)
    actual[label] = 1
    gradient = losser.gradient(pred, actual)
    backward(gradient)
    return calc_loss(pred, actual)

def main():
    for epoch in range(4):
        print('--- Epoch %d ---' % (epoch + 1))
        loss = 0
        num_correct = 0
        for i, (image, label) in enumerate(zip(train_images, train_labels)):
            image= preprocess(image)
            if i % 1000 == 999:
              print( '[Step %d] Past 100 steps: Average Loss %.3f | Accuracy: %d%%' % (i + 1, loss / 100, num_correct / 10.0))
              loss = 0
              num_correct = 0

            
            l, acc = train(image, label)
            loss += l
            num_correct += acc
main()



print('MNIST CNN initialized!')

# Test the CNN
print('\n--- Testing the CNN ---')
def test():
    loss = 0
    num_correct = 0
    for im, label in zip(test_images, test_labels):
        im = preprocess(im)
        pred = forward(im)
        actual = np.zeros(pred.shape)
        actual[label] = 1
        l, acc = calc_loss(pred, actual)
        loss += l
        num_correct += acc

    num_tests = len(test_images)
    print('Test Loss:', loss / num_tests)
    print('Test Accuracy:', num_correct / num_tests)

test()