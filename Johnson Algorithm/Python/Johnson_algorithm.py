def readfile():
    import re
    l = list()
    data = list()
    pattern = '-*[0-9]+'
    filename = 'graph.txt'
    file = open(filename,'r')
    l.append(file.readlines())
    file.close()
    for x in l:
        data = re.findall(pattern,str(x))
    return data



def setdata(data):
    source = list()
    destination = list()
    edgecost = list()
    test = 0
    vertices = 0
    edges = 0
    distance = list()
    for x in data:
        if test == 0:
            vertices = x
        if test == 1:
            edges = x
        if test == 2:
            source.append(int(x))
        if test == 3:
            destination.append(int(x))
        if test == 4:
            edgecost.append(int(x))
            test = 1
        test+=1
    vertexlist = list(vertices)
    test = int(vertices)-1
    while test > 0:
         vertexlist.append(test)
         test -=1
    for x in vertexlist:
        source.append(0)
        destination.append(int(x))
        edgecost.append(0)
    distance = list()
    test = 0
    while test < int(vertices)+ 1:
        distance.append(test)
        test+=1
    return vertices, edges, source, destination, edgecost, vertexlist, distance



def intialize(distance):
    predecessor = list()
    d = list()
    #initialization
    for x in distance:
        if x == 0:
            d.append(0)
        else:
            d.append(999999999)
        predecessor.append('null')
    return d, predecessor



def relax(vertices, source, destination, edgecost, d, predecessor,edges):
    y = 0
    i = 0
    z = 0
    for x in edgecost:
        z+=1
    while i < int(vertices):
        while y<int(z):
            if d[int(source[y])] + edgecost[y] < d[int(destination[y])]:
                d[int(destination[y])] = int(edgecost[y]) + d[int(source[y])]
                predecessor[int(destination[y])] = source[y]
            y+=1
        y=0
        i+=1
    return source, destination, edgecost, d, predecessor

def reweight(vertices, source, destination, edgecost, d,edges):
    y = 0
    z = 0
    for x in edgecost:
        z+=1
    while y<int(z)-1:
        edgecost[y] = edgecost[y] + d[int(source[y])] - d[int(destination[y])]
        y+=1
    return source, destination, edgecost, d


def output(source, destination, edgecost):
    print ('Output in the form...')
    print ('[Source]')
    print ('[Destination]')
    print ('[Reweighting]')
    print()
    print('Running Dijkstra on vertex n')
    print('vertices [0...n]')
    print('previous of [0...n]')
    print('cost of [0...n]')
    print()
    print()
    print(source)
    print(destination)
    print(edgecost)
    print()


def Dijkstra(vertexlist, sourcevertex,source,destination, edgecost,predecessor,edges,vertices):
    u = 0
    v = 0
    alt = 0
    count = 0
    smallest = 9999999
    newvertexlist = list()
    newvertexlist.append(0)
    for x in vertexlist:
        newvertexlist.append(int(x))
    dist = list()
    previous = list()
    Q = set(newvertexlist)
    Q.remove(0)
    for x in newvertexlist:
        if int(x) == int(sourcevertex):
            dist.append(0)
        else:
            dist.append(9999999)
        previous.append('undefined')
    while len(Q) != 0:
        for y in Q:
            if y != 0:
                if dist[int(y)] < smallest:
                    smallest = dist[y]
                    u = y
                if dist[y] == 999999:
                    break
        smallest = 9999999
        Q.remove(u)
        while(int(count)<int(edges)+1):
            if(source[count] == u):
                v = destination[count]
                alt = dist[u] + edgecost[count]
                if alt < dist[v]:
                    dist[v] = alt
                    previous[v] = u
            count+=1
        count = 0
    print('Vertices:' + str(newvertexlist))
    print('Previous:' + str(previous))
    print('Cost:    ' + str(dist))
    print()








def Johnsons():
    data = list()
    source = list()
    destination = list()
    edgecost = list()
    test = 0
    vertices = 0
    edges = 0
    data = readfile()
    vertexlist = list()
    distance = list()
    vertices, edges, source, destination, edgecost, vertexlist, distance = setdata(data)
    predecessor = list()
    d = list()
    d, predecessor = intialize(distance)
    #relaxation
    source, destination, edgecost, d, predecessor = relax(vertices, source, destination, edgecost, d, predecessor,edges)
    #change weights
    vertexlist.reverse()
    source, destination, edgecost, d = reweight(vertices, source, destination, edgecost, d,edges)
    output(source, destination, edgecost)
    for x in vertexlist:
        print('Running Dijkstra on vertex ' + str(x))
Dijkstra(vertexlist,x,source, destination, edgecost, predecessor, edges,vertices)
