<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid submission.']);
    exit;
}

$to = "info@aisystimz.com";
$subject = "New Consultation Request from Systimz Website";
$message = "Name: {$data['name']}\nEmail: {$data['email']}\nCompany: {$data['company']}\nRole: {$data['role']}\nIndustry: {$data['industry']}\nProject Size: {$data['project_size']}\nTimeline: {$data['timeline']}\nMessage: {$data['message']}\nNewsletter: " . ($data['newsletter'] ? "Yes" : "No") . "\nSource: {$data['source']}\nPage: {$data['page_url']}\nUser Agent: {$data['user_agent']}";

$headers = "From: noreply@aisystimz.com\r\nReply-To: {$data['email']}\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['status' => 'success']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Could not send email.']);
}
?>
