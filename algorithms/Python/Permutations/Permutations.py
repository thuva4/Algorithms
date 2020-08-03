def Permutations(array):
    if array.__len__== 1:
        return
    resultArray = [];
    for i in range(array.__len__):
        first = array[i]
        intermediate_array=[]
        if(i<array.__len__-1):
            intermediate_array = array[:i] + array[i+1:]
        else:
            intermediate_array= array[:i]
        map(lambda x: resultArray.append([first]+x), Permutations(intermediate_array))
