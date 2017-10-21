Program PSumMatrix ;
Var
  x, y                      : Integer ;
	Matrix1, Matrix2, Matrix3 : array [1..3,1..3] of integer ;
const
    MAX_COLUMNS_MATRIX = 3;
Begin
    //Get values from first matrix
	for x := 1 to MAX_COLUMNS_MATRIX do
  Begin
  	for y:= 1 to MAX_COLUMNS_MATRIX do
    Begin
      Write('First Matrix. Please enter a value for row ',x,' column ',y,': ');
      Readln(Matrix1[x,y]);
    	Writeln;
    End;
  End;
		
    {Get values from second matrix}        
	for x := 1 to MAX_COLUMNS_MATRIX do
 	Begin
  	for y:= 1 to MAX_COLUMNS_MATRIX do
    Begin
    	Write('Second Matrix. Please enter a value for row ',x,' column ',y,': ');
      Readln(Matrix2[x,y]);
      Writeln;

      // Sum matrices
      Matrix3[x,y] :=  Matrix1[x,y] + Matrix2[x,y];
    End;
  End;

	Clrscr ; //Clear screen

	{Show values from first matrix, second matrix and sum from matrices}
	writeln('First Matrix');
	for x := 1 to 3 do
  Begin
    Writeln;
    for y := 1 to 3 do
        Write(Matrix1[x,y],'|');
  End;
	writeln;
	writeln;

	writeln('Seconde Matrix');
	for x := 1 to 3 do
  Begin
    Writeln;
    for y := 1 to 3 do
        Write(Matrix2[x,y],'|');
  End;					
	writeln;
	writeln;
	
	writeln('The sum of the matrices is: ');
	for x := 1 to 3 do
	Begin
		Writeln;
	  for y:= 1 to 3 do
	  	Write(Matrix3[x,y],'|');
	End;
		
	Writeln;
  Readkey; //Wait press any key.
End.
