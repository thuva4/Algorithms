#coding: utf-8

def cocktailSort(lista):
	
	nova_lista = []
	for j in range(len(lista)):
		for i in range(len(lista)-1):
			if lista[len(lista)-1 - i] < lista[len(lista)-2 - i]:
				lista[len(lista)-1-i],lista[len(lista)-2-i] = lista[len(lista)-2-i],lista[len(lista)-1-i]
			if lista[i] > lista[i+1]:
				lista[i],lista[i+1] = lista[i+1],lista[i]
	return lista
		
print cocktailSort([3, 4, 2, 0, 5, 6, 7,1])