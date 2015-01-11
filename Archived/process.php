<?php

include 'connection.php';

if(!empty($_GET['data'])){
   //echo 'stage 2 cleared';
   $search = new SqlSearcher($db);
   $search->buildQuery($_GET['data']);
   $search->execute();
   $search->printResults();
}


if(!empty($_GET['search'])){

   $search = $_GET['search'];

   $entry = new entry($search);

   getRow($db,$entry);

}



class SqlSearcher
{
   public $db;
   public $query;
   public $request;
   function __construct($db)
   {
      $this->db = $db;
   }
   function buildQuery($request)
   {
      $base = "Select Word,Speech from Chaika where";
      $this->request = array();
      $i =0;
      foreach($request as $key)
      {
         $base .= " Word = '$key'";
         $this->request[$i] = $key;
         if($key !== end($request))
            $base .= " OR";
         $i++;
      }
    //  br();
     // echo $base;
      $this->query = $this->db->prepare($base);
   }
   
   function execute()
   {
      $this->query->execute();
   }
   
   function printResults()
   {
      // br();
      //echo "stage 2.5 cleared";
		//$test = "[";
      $last = "";
		$check = "";
      $length = count($this->request);
      while($row = $this->query->fetch(PDO::FETCH_ASSOC))
      {
         if($row['Word'] != null & $row['Word'] == $last)
         {
			   
            continue;
         }
         for($i =0; $i < $length; $i++)
         {
            if($this->request[$i] == $row['Word'])
            {
               $this->request[$i] = array($row['Word'],compress($row['Speech']));
					//$test .= json_encode($this->request[$i]);
            }
         }
			$last = $row['Word'];  
      }
		
		echo json_encode($this->request);
   }
   
}



function br()
{
   echo "\n";
}

function compress(&$word)
{
   $word = preg_split("/,/",$word);
   foreach($word as $key)
   {

      $buf .= fix($key);
      if($key !== end($word))
            $buf .= ",";
   
   }
   return $buf;
}

function fix($pos)
{
      $pos = trim($pos);
      switch($pos){
		case 'adjective':
      case 'adj':
			return 'adj';
		case 'noun':
      case 'n':
			return 'n';
		case 'verb':
      case 'v':
			return 'v';
		case 'adverb':
      case 'adv':
			return 'adv';
		default:
         return '';
		}

}






?>