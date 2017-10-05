# Python program to detect loop in the linked list
 
# Node class 
class Node:
    # Constructor to initialize the node object
    def __init__(self, data):
        self.data = data
        self.next = None
 
class Python:
 
    # Function to initialize head
    def __init__(self):
        self.head = None
 
    # Function to insert a new node at the beginning
    def push(self, new_data):
        new_node = Node(new_data)
        new_node.next = self.head
        self.head = new_node
 
    # Function to prit the linked LinkedList
    def printList(self):
        temp = self.head
        while(temp):
            print temp.data
            temp = temp.next
 
    #To check if there exists a loop within the list
    def detectLoop(self):
        slow_p = self.head  #This is the first pointer and it jumps by one node
        fast_p = self.head  #This is the second pointer and it jumps by two nodes
        while(slow_p and fast_p and fast_p.next):   #To check if these pointers point to null
            slow_p = slow_p.next
            fast_p = fast_p.next.next
            if slow_p == fast_p:
                print "Found Loop"
                return
 
# Main program for testing
llist = Python()
llist.push(5)
llist.push(10)
llist.push(15)
llist.push(20)
 
# Create a loop for testing
llist.head.next.next.next.next = llist.head
llist.detectLoop()