<?php
//sqlInsertion code
echo 'wtf';
if(!empty($_POST['start'])){
   $file = fopen("newBank.txt","r");
   echo $_POST['start'];
   $iter = 0;
   $iter2 = 0;
   while (($buffer = fgets($file, 4096)) !== false) 
   {
      if($iter < $_POST['start'])
      {
         $iter++;
         continue;
      }
      if($iter2 > 1000)
      {
         break;
      }
      if($buffer == NULL)
      {
         continue;
         $iter2++;
      }
      $entry = new entry($buffer);
      addToTable($db,$entry);
      $iter2++;
   }

   if (!feof($file)) {  
      return;
   }

   fclose($file);
      if($_POST['start'] < 200000 )
      {
         return;
      }
}

function addToTable($db,$entry)
{
   if($target = checkExist($db,$entry) & $target)
   {
      if($entry->comparePos($target))
      {
         $update = $db->prepare("UPDATE Chaika Set pos=? WHERE word=?");
         $update->bindParam(1,$entry->pos);
         $update->bindParam(2,$entry->word);
         $update->execute();
      }
   }
   else{

      $insert = $db->prepare("Insert into Chaika (Word,Speech) VALUES (?,?) ");
      $insert->bindParam(1,$entry->word);
      $insert->bindParam(2,$entry->pos);
      $insert->execute();
   }
}





function checkExist($db,$entry)
{
   $query = $db->prepare("Select Word from Chaika where word = ?");
   $query ->bindParam(1,$entry->word);
   $query->execute();
   return $query->fetchColumn() > 0;
}



function getRow($db,$entry)

{
   $query = $db->prepare("Select * from Chaika where word = ? ORDER BY Speech DESC");
   $query ->bindParam(1,$entry->word);
   $query->execute();
   $row = $query->fetch(PDO::FETCH_ASSOC);
   echo $row['Word'].' : '.$row['Speech'];
}

function br()
{
   echo '<br>';
}



class entry
{
   public $word;
   public $pos;
   function __construct($entry)
   {
      if($entry == NULL)
      {
         return;
      }
      $bank = preg_split("/:/",$entry);
      $i = 0;
      foreach($bank as $key){
         if($i == 0){
            $this->word = trim($key);
         }
         else{
            $this->pos = trim($key);
         }
         $i = 1;
      }
   }
   
   function comparePos($target)
   {
      $current =  preg_split("/,/",$this->pos);
      $target = preg_split("/,/",$target);
      return $current >= $target;
   }
}

?>