<?php
header('Content-Type: text/plain; charset=utf-8');
$raw = file_get_contents('php://input');
echo "RAW INPUT: [" . $raw . "]\n";
echo "POST: "; print_r($_POST);
echo "JSON: "; print_r(json_decode($raw, true));
