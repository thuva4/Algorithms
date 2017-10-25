def EuclideanShortestPath(xMin, xMax, yMin, yMax, num_obs, step, radius, dim):

#Only solution for a 2D space with polygonal obstacles
if dim == 2:
	
	#Algorithm to find the valid vertices in the grid.
	valid_vertices = []
	path_x = numpy.arange(xMin, xMax, step)
	path_y = numpy.arange(yMin, yMax, step)
	for x in path_x: 
		for y in path_y:
			valid_vertices[i,j] = True 

	for n in range(num_obs):
		for x in path_x: 
			for y in path_y:
				dist = x - y 
				if dist < radius: 
					valid_vertices[i,j] = False
					
