from random import shuffle

TABLE = range(0, 256)
shuffle(TABLE)

def hash8(message):
    hash = len(message) % 256
    for i in message:
        hash = TABLE[hash^ord(i)]
    return hash

if __name__ == '__main__':
    print(hash8("Hello World"))