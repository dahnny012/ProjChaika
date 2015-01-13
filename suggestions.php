<?php

if(!empty($_GET['randNums'])){
  
   $randNums = preg_split("/,/",$_GET['randNums']);
   foreach($randNums as $num){
       $num = intval($num);
   }
 $file = fopen("Node/newBank.txt","r");
 $line =1;
 $index =0;
 sort($randNums);
 $target = $randNums[$index];
 $max = count($randNums);
 //var_dump($randNums);
 //br();
   while (($buffer = fgets($file, 4096)) 
   !== false && $index < $max) {
      if($line < $target){
        $line++;
      }
      else{
          if(strpos($buffer," ")){
              $target++;
             //echo "Contained a space";
              //br();
          }
          else{
              /*echo "Line ".$line;
              br();
              echo "Buffer: ".$buffer;
              br();*/
              $randNums[$index] = trim($buffer);
              $index++;
              $target = $randNums[$index];
          }
      }
   }
  //var_dump($randNums);
  echo json_encode($randNums);
   fclose($file);

}

function br()
{
   echo '<br>';
}