<?php  

	function search_fibonacci($total)
	{
		$a=0;
  		$b=1;
  
  	for ($i=0; $i<$total-1; $i++)
  	{

    	$output = $b + $a;

    	$a = $b;
    	$b = $output;
  	}
  		return $output;
	}

?>