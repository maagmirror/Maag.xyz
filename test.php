<html>
<title>Estado Del Bot</title>
<body background="/background.jpg">

    <link rel="stylesheet" href="http://maag.xyz/css/menu.css" type="text/css"/>
<body>

<div id="header">
    <nav>
        <ul class="menu">
            <li><a href="http://maag.xyz/">Inicio</a></li>

                    <li><a href="http://maag.xyz/ban">Seguidos baneados</a></li>
                    <li><a href="http://maag.xyz/quienes">quienes</a></li>
                    <li><a href="http://maag.xyz/contact">Contact</a></li>
                    <li><a href="http://maag.xyz/bot">Estado Del Bot</a></li>
            </li>

        </ul>
    </nav>
</div>

<TABLE WIDTH="100%" HEIGHT="100%">
<TR>
<TD VALIGN="CENTER" ALIGN="CENTER">
<font size=10 color="white">
	El Bot esta en estado:
<?php
$url = 'http://www.taringa.net/ajax/mentions/user';
$fields = array(
	'uid' => '25854531' //Id del usuario
);
$fields_string="";
foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
rtrim($fields_string, '&');
$ch = curl_init();
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);
$data = json_decode($result,true);
$status = $data['data']['userStatus']; 
if($status == 'offline') {
   echo '<div style="color:red">offline<div>' ;
}
else {
  echo '<div style="color:green">online<div>' ;
  }
?>
</TD>
</TR>
</TABLE>
</BODY>
</font>
</html>
