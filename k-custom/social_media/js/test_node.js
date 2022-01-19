try{
  const mysql = require('/home/ubuntu/node_module/mysql');
  console.log('mysql found');  
}
catch(ex){
   console.log('mysql not found ff'); 
}
try{
  const mysql = require('/usr/lib/node_module/mysql');
  console.log('mysql2 found');  
}
catch(ex){
   console.log('mysql not found ff'); 
}

