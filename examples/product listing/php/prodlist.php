<?php
 
// Did the user click the Exit button?  If so, quit
if ($_POST['btnExit'] == '1') {
  return;
}
 
// read product records
$options = array('i5_lib' => 'MYLIBRARY', 'i5_naming' => DB2_I5_NAMING_ON);
$conn = db2_connect('', '', '', $options);
$query = "SELECT * FROM PRODUCTSP";
$stmt = db2_prepare($conn, $query);
$grid = array();
if (db2_execute($stmt)) {
  while($row = db2_fetch_assoc($stmt)) {
    array_push($grid, $row);
  }
}
db2_close($conn);
 
// Output the screen
$view = '../prodlist.json';
$data['PRODSFL'] = $grid;
$output = array('data' => $data, 'view' => $view, 'screen' => 'PRODCTL');
echo json_encode($output);
 
?>