+>>>>>
>>>>>
>>>>>
>>>>>
temporary values stay up here 
+++++>>>>+++++ +++++ > valores 
+++++>>>>+++++ ++++ > a +++++>>>>+++++ 
+++ > ordenar +++++>>>>+++++ > sao 
+++++>>>>+++++ + > so +++++>>>>+++++ ++ > 
dez +++++>>>>++++ > valores +++++>>>>+++ 
> que
+++++>>>>++ > acabam +++++>>>>+ > aqui
		>>>	aqui temos um 
		>>>	valor indicativo 
		>>>	do fim da 
		>>>	recursividade
		>
		>
+++ >>> valor indicativo da necessidade 
de fazer dois splits
		>	0
+++++ +++++ > 10 <<<<< voltar ao header 
tem 5 bytes cada bloco [ while nao for 0
	--[++ if nao for 2 (ou seja é 3)
		copiar o primeiro valor
		>>>[-<<+< while houver 
		>>>valor pra copiar
			+ marcar o bloco 
a 4 pra voltarmos
			[>>>>>] ir para o 
ultimo bloco
			>>>+<<< meter la 
			>>>o valor
			----[++++<<<<<----]++++	
voltar ao bloco marcado
			- desmarcar o 
bloco
		>>>]<<< fim de while
		repetir o processo pro 
segundo valor
		>>>>[-<<+<<
			+
			[>>>>>] ir para o 
ultimo bloco
			>>>>+<<<< meter 
			>>>>la o valor
			----[++++<<<<<----]++++	
voltar ao bloco marcado
			-
		>>>>]<<<<
		restaurar os valores 
copiados
		>[->>+<<]<
		>>[->>+<<]<<
		+ marcar o bloco como 4
		[>>>>>] ir para o ultimo 
bloco
		temos os dois valores
		no ultimo bloco vamos
		calcular a media agora
		>>>[-<+>>>+<<]>>[-<<+>>]<<<<<
		>>>>[->+<<<+>>]>[-<+>]<<<<<
		neste momento está 0 _ S 
V W
		vamos dividir por dois o 
S
		>>[ enquanto houver S
			[>>>+>+<<<<-]>>>>[<<<<+>>>>-]<<<<	
fazer uma copia do S
			<<+>>>>> ligar o 
U
			-[ se S2 for 
maior que 1
				<<<<<- 
desligar o U
				>>--<+< 
				>>remover 
				>>2 do S 
				>>e 
				>>aumentar 
				>>1 o D
				>>>>>[-] 
				>>>>>apagar 
				>>>>>o S2
			]<<<<<
			[->>-<<]>> se U 
apagar S e U
		]<<
		>[->+<]< copiar o D para 
		>S
		agora está 0 _ M V W
		agora vamos copiar o W 
pro bloco seguinte
		>>>>[->>>>>+<<<<<]<<<<
		copiar o M pro fim do 
bloco e pro lugar do V no bloco seguinte
		>>[->>+>>>>+<<<<<<]<<
		primeiro bloco
		++
		>>>>[-<<+<+>>>]<<[->>+<<]<< 
		>>>>0 W _ V W
		>>>[-<+<->>]<[->+<]<< 0 
		>>>W_V _ V W
		>-[<+>[-]]< 2/3 0 0 V W
		>>>>>
		segundo bloco
		++
		>>>>[-<<+<+>>>]<<[->>+<<]<< 
		>>>>0 W _ V W
		>>>[-<+<->>]<[->+<]<< 0 
		>>>W_V _ V W
		>-[<+>[-]]< 2/3 0 0 V W
		----[++++<<<<<----]++++ 
encontrar o bloco
		-- marcar o bloco como 2
	--] fim de if
	++
>>>>>] fim de while
o apontador esta no fim dos blocos que ja 
estao divididos prontos a serem usados 
para a ordenacao <<<<< avancar para o 
ultimo bloco criado acima [ se o bloco 
nao for nulo que indica que tem que ser 
aplicado + marcalo com valor 3
	copiar os valores para o primeiro 
bloco indicado pelo valor 1
	>>>[-<<<
		-[+<<<<<-]+ ir para o 
bloco
		>>>+<<<
		---[+++>>>>>---]+++
	>>>]<<<
	>>>>[-<<<<
		-[+<<<<<-]+ ir para o 
bloco
		>>>>+<<<<
		---[+++>>>>>---]+++
	>>>>]<<<<
	acabado de copiar os valores ir 
para o bloco com eles
	-[+<<<<<-]+
	fazer aqui as cenas e tal tipo 
calcular a media outra vez
	e depois fazer as cenas subir pra 
coiso
	copiar os valores pra baixo 
duplicando os pelo caminho
	>>>[-<<+>>>>+<<]
	>[-<<+>>>>+<<]<<<< 
	>[->>+>>>>+<<<<<<]<
	>>[->>+>>>>>+<<<<<<<]<<
	>>>[-<+>]>[-<<+>>]<<<<
	>>>>>>[-]<<<<<<
	divisao por 2
	>>[
		[->+>+<<]>>[-<<+>>]<<
		>>+<
		-[
			>-
			<<--
			> >>>>>+<<+ <<< <
			>[-]
		]<
		>>[-<<[-]>>]<<
	]<<
	ja temos os dados no bloco 
primeiro
	1 _ _ _ _
	A B L M H
	_ _ _ _ _
	calcular a soma das diferencas e 
verificar se é nula
	>>>>>
	A [->>>>>+<<<<< 
<+<<->>>]<[->+<]>>
	B [->>>>>+<<<<< 
<<+<->>>]<<[->>+<<]>>>>
	M 
[-<<<<+<<+>>>>>>]<<<<[->>>>+<<<<]>>>>>
	H 
[-<<<<<+<+>>>>>>]<<<<<[->>>>>+<<<<<]
	pointer no 5o byte do primeiro 
bloco
	> >>>>> [->-<] subtrair o A ao B
	> pointer no B de baixo ptr(11)
	[ se A for diferente de B
		[-]< <<<<< <<<
		pointer no DA
		contas manhosas pra 
calcular o DA&DB a partir do DA e do DB
		[
			[->>+<<] mover o 
DA
			>[ ver do DB
				[->>>>>>>+<<<<<<<] 
move lo pra longe porque n ha espaco 
perto
				<<+>>
			]<
		]
		>>[-<<+>>]< restaurar o 
		>>DA
		>>>>>>>[-<<<<<<<+>>>>>>>]<<<<<<<
		<<
		enquanto DA&DB temos que 
ir ver qual é o menor portanto
		vamos busca los la abaixo
		[
			o pointer tá no 
DA&DB
			buscar o A e 
ptr(10)
			>>>> meter o 
			>>>> pointer no A
			[->>>>>+>+<<<<<<]>>>>>[-<<<<<+>>>>>]<<<<<
			> meter o pointer 
			> no B
			[->>>>+>>+<<<<<<]>>>>[-<<<<+>>>>]
	
			+> marcar isto 
como 1 e meter o pointer no A2
			copiar o A2 pra 
baixo e tal
			[->>>>> 
>>>>>+<<<<< <<<<<]>>>>> >>>>>
	
			estamos no 
primeiro numero (5) com A na segunda casa
			[ enquanto houver 
numero
				remover 
um e copiar pro proximo
				-[->>>>>+<<<<<]>>>>>
			]
			<+ marcar este 
cagalhoto como 6
			duplicar o numero
			>>>>[-<<+<+>>>]
			<<[->>+<<]<<
			>[-< -[+<<<<<-]+ 
			>>>>+<<< 
			>------[++++++>>>>>------]++++++ 
			>>]<
			- desmarcar o 
cagalhoto
			-[+<<<<<-]+ 
procurar o 1
			buscar o B e 
ptr(10)
			>> pointer no B2
			[->>>>> 
>>>>+<<<<< <<<<]>>>>> >>>>
			estamos no 
primeiro numero (5) com B na segunda casa
			[ enquanto houver 
numero
				remover 
um e copiar pro proximo
				-[->>>>>+<<<<<]>>>>>
			]
			<++ marcar este 
cagalhoto como 7
			duplicar o numero
			>>>>[-<<+<+>>>]
			<<[->>+<<]<<
			>[-<
				-[+<<<<<-]+
				>>>>+<<<<
				-------[+++++++>>>>>-------
			]+++++++ >]<
			-- desmarcar o 
cagalhoto
			-[+<<<<<-]+ 
procurar o 1
			ja temos o 
pointer no 1 e os valores v(A) e v(B) 
tambem ja estao cá
			ver qual é o 
maior dos dois;
			(1) _ _ vA vB
			less_than(13;14;18);
			copy(X(13);18;17)
			>>> [->>>>+>+<<<<<] 
			>>> >>>>[-<<<<+>>>>]<<<< 
			>>> <<<
			copy(Y(14);19;17)
			>>>> [->>>+>>+<<<<<] 
			>>>> >>>[-<<<+>>>]<<< 
			>>>> <<<<
			meter o pointer 
no segundo vA(18)
			>>>>> >>>
			while (18)
			[
				- dec(18)
				while 
(19)
				>[
					<<<+>>> 
inc(16)
					- 
dec(19)
					[-<<<<+>>>>] 
move(19;15)
				]
				<<<<[->>>>+<<<<] 
move(15;19)
				>>>
			]
			ptr(10)
			<<< <<<<<
			copy(X(13);18;17)
			>>> [->>>>+>+<<<<<] 
			>>> >>>>[-<<<<+>>>>]<<<< 
			>>> <<<
			copy(Y(14);19;17)
			>>>> [->>>+>>+<<<<<] 
			>>>> >>>[-<<<+>>>]<<< 
			>>>> <<<<
			ptr(16)
			>>>>> >
			subtract_to(16;{18;19})
			[->>->-<<<]
			ptr(10)
			< <<<<<
			o ptr está no 10
			ver qual numero e 
pra onde levar mudando o A/B e DA/DB e 
ptr(19)
			calcular destino
			ptr(9) 
copy(9;{11;16};12)
			<[->>+>+<<<]>>>[-<<<+>>>]<<<
			ptr(2) 
subtract_to(2;11;4)
			<<<< <<< [->>+> 
>>>>> >-< <<<<< <<<]>>[-<<+>>]<<
			ptr(3) 
subtract_to(3;11;4)
			> [->+> >>>>> >-< 
			> <<<<< 
			> <<]>[-<+>]<
			fazer punhes
			ptr(2) dec(2)
			<-
			ptr(5) inc(5)
			>>> +
			ptr(18)
			>>>>> >>>>> >>>
			while(18) OU SEJA 
o B é menor que A
			[
				ptr(6) 
inc(6)
				<<< <<<<< 
<<<< +
				ptr(5) 
dec(5)
				< -
				ptr(3) 
dec(3)
				<< -
				ptr(2) 
inc(2)
				< +
				ptr(13)
				>>> >>>>> >>>
				swap(13;14;12)
				[-<+>]>[-<+>]<<[->>+<<]>
				ptr(18)
				>> >>>
				clear(18)
				[-]
			]
			ptr(19)
			>
			clear(19)
			[-]
			ptr(11)
			<<<< <<<<
			levar o 13 pro 
mark(5) indicado pelo 11 e voltar pro 
mark(1) aka ptr(10)
			move(11;21)
			[- >>>>> 
>>>>>+<<<<< <<<<<]
			ptr(13) 
move(13;{22})
			>>
			[->> >>>>> >>+<< 
<<<<< <<]
			ptr(14) clear(14)
			>[-]
			ptr(20)
			> >>>>>
			>[
				dec(mark(5):1) 
move(mark(5):1;mark(5):6)
				-[->>>>>+<<<<<]
				ptr(mark(5):2) 
move(mark(5):2;mark(5):7)
				>[->>>>>+<<<<<]
				ptr(mark(5):6)
				>>>>
			]<
			estamos num 
mark(5) e é preciso mover o :2 pro :3
			>>[->+<]<<
			voltar pro 
mark(1)
			-[+<<<<<-]+
			- desmarca lo
			ptr(1) aka DA&DB
			<<<<<
			<<<<
	
			recalcular DA&DB 
com ptr(1)
			o pointer aqui 
tem que estar no DA&DB
			and(2;3;1;{4;10})
			[-]
			>[
				ptr(4) 
clear(4) ptr(2)
				>>[-]<<
				move(2;4)
				[->>+<<]
				>[
					[->>>>>>>+<<<<<<<] 
move(3;10)
					<<+>> 
ptr(1) inc(1) ptr(3)
				]< ptr(4)
			]
			>>[-<<+>>]< 
			>>move(4;2)
			>>>>>>>[-<<<<<<<+>>>>>>>]<<<<<<< 
			>>>>>>>move(10;3)
			<< ptr(1)
		]
		pointer no DA&DB ptr(1)
		ptr(2)
		>
		[ copiar os da primeira 
metade pro final destination
			marcar 10
			ptr(10) inc(10) 
ptr(5)
			>>> >>>>> + <<<<<
			copy(5;21;11) 
ptr(11)
			[->>>>> >+>>>> 
>>>>> >+< <<<<< <<<<< <<<<<]+>>>>> >[-< 
<<<<<+>>>>> >]
			ptr(21)
			>>>>> >>>>>
			[-[->>>>>+<<<<<]>>>>>]<
			>>>>[-<<+<+>>>]<<<< 
			>>>>>>[->>+<<]<<
			-[+ 
>[-<<<<<+>>>>>]< <<<<<-]+
			>[->+<]<
			estamos em 
ptr(10)
			copy(9;11;13)
			< [->>+>>+<<<<] 
>>>>[-<<<<+>>>>]<<<
			subtract_to(2;11;4)
			<<<<< <<< [->>+> 
>>>>> >-< <<<<< <<<]>>[-<<+>>]<
			subtract_to(3;11;4)
			[->+> >>>>> >-< 
<<<<< <<]>[-<+>]> >>>>>
			>[->>>>> 
			>>>>>>+<<<<< 
			><<<<<]<
			>>[->>>>> 
			>>>>>>>+<<<<< 
			>><<<<<]<<
			>>>>> >>>>>
			>[
				-[->>>>>+<<<<<]
				>[->>>>>+<<<<<]<
				>>>>>
			]<
			>>[->+<]<<
			-[+<<<<<-]+
			desmarcar
			-
			ptr(2) dec(2)
			<<<<< <<< -
		]
		ptr(3)
		>
		[ copiar os da primeira 
metade pro final destination
			marcar 10
			ptr(10) inc(10) 
ptr(6)
			>> >>>>> + <<<<
			copy(6;21;11) 
ptr(11)
			[->>>> >+>>>> 
>>>>> >+< <<<<< <<<<< <<<<]+>>>> >[-< 
<<<<+>>>> >]
			ptr(21)
			>>>>> >>>>>
			[-[->>>>>+<<<<<]>>>>>]<
			>>>>[-<<+<+>>>]<<<< 
			>>>>>>[->>+<<]<<
			-[+ 
>[-<<<<<+>>>>>]< <<<<<-]+
			>[->+<]<
			estamos em 
ptr(10)
			copy(9;11;13)
			< [->>+>>+<<<<] 
>>>>[-<<<<+>>>>]<<<
			subtract_to(2;11;4)
			<<<<< <<< [->>+> 
>>>>> >-< <<<<< <<<]>>[-<<+>>]<
			subtract_to(3;11;4)
			[->+> >>>>> >-< 
<<<<< <<]>[-<+>]> >>>>>
			estamos em 10
			>[->>>>> 
			>>>>>>+<<<<< 
			><<<<<]<
			>>[->>>>> 
			>>>>>>>+<<<<< 
			>><<<<<]<<
			>>>>> >>>>>
			>[
				-[->>>>>+<<<<<]
				>[->>>>>+<<<<<]<
				>>>>>
			]<
			>>[->+<]<<
			-[+<<<<<-]+
			estamos em 10 
outra vez
			desmarcar
			-
			ptr(3) dec(3)
			<<<<< << -
		]
		assentar os valores do 
array temporario
		move(7;21)
		move(9;22)
		
		>> >>[->>> >>>>> >>>>> 
		>> >>>+< <<<<< <<<<< <<<]
		>>[-> >>>>> >>>>> >>+<< 
		>><<<<< <<<<< <]
		aproveitar e marcar o 10
		> +
		
		>>>>> >>>>>
		>[-[->>>>>+<<<<<] 
		>>-[->>>>>+<<<<<]< 
			>>>>>>]<
		>>[-[->>>>>+<<<<<]>>[-]<< 
		>>>[->+<]< >>>>>]<<
		-[+<<<<<-]+
		-
		voltar a meter o pointer 
no B de baixo
		ptr(11)
		>
		[-]
	]
	voltar a meter o pointer no 
inicio do bloco 1
	< <<<<< <<<<<
	
	pointer no inicio do bloco 1
	limpar as cenas no bloco 1
	>[-]>[-]>[-]>[-]>
	[-]>[-]>[-]>[-]>[-]>
	[-]>[-]>[-]>[-]>[-]>
	[-]>[-]>[-]>[-]>[-]
	<<<<
	<<<<<
	<<<<<
	<<<<<
	
	---[+++>>>>>---]+++ ir para o 
bloco marcado
	--- eliminar o bloco
	<<<<< avançar para o proximo 
bloco ] imprimir as vaquinhas como letras 
de B a K -[+<<<<<-]+ 
-----[+++++>>>>>-----]+++++ [
	>>>>
	+++++ +++++
	+++++ +++++
	+++++ +++++
	+++++ +++++
	+++++ +++++
	+++++ +++++
	+++++
	.
	----- -----
	----- -----
	----- -----
	----- -----
	----- -----
	----- -----
	-----
	<
	+++++ +++++ +++++ +++++ +++++ 
+++++ ++
	.
	----- ----- ----- ----- ----- 
----- --
	>>
] +++++ +++++.----- -----
