
<?php
 
// Did the user click the Exit button?  If so, quit
if ($_POST['btnExit'] == '1') {
  return;
}
 
// get customer account number entered by the user
$account = $_POST['CSID'];
 
// retrieve customer record for this account
$options = array('i5_lib' => 'MYLIBRARY', 'i5_naming' => DB2_I5_NAMING_ON);
$conn = db2_connect('', '', '', $options);
$query = "SELECT * FROM CUSTMASTP WHERE CSID = ?";
$stmt = db2_prepare($conn, $query);
db2_bind_param($stmt, 1, "account", DB2_PARAM_IN) ;
if (db2_execute($stmt)) {
  if($row = db2_fetch_assoc($stmt)) {
      $data = $row;
  }
}
db2_close($conn);
 
// Output the screen
$data['CSID'] = $account;
$view = '../custinqd.json';
$output = array('data' => $data, 'view' => $view, 'screen' => 'CUSTINQFMT');
echo json_encode($output);
 
?>
