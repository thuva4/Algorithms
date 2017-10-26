<?php
      
      function Fibo($number){

          $v;
          $num1 = 0; 
          $num2 = 1;
          $temp;
          for ($i = 1; $i <= $number; $i++) {
              echo $num1." ";

              $temp = $num1 + $num2;
              $num1 = $num2;
              $num2 = $temp;
           }
      }
Fibo(5)
?>
