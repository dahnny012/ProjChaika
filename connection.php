<?php 





$config['db'] = array(


	'host' => '127.0.0.1:3306',


	'username' => '',


	'password' => '',


	'dbname' => ''


	);





	


$db = new PDO('mysql:host=' . $config['db']['host']. ';dbname=' . $config['db']['dbname'] , $config['db']['username'] , $config['db']['password']);

















?>
