<?php
// Get form data
$profession = $_POST['profession'];
$location = $_POST['location'];
$water_source = $_POST['water-source'];
$water_awareness = $_POST['water-awareness'];
$water_concerns = implode(", ", $_POST['water-concerns']); // Handle multiple select
$interest_areas = implode(", ", $_POST['interest-areas']); // Handle multiple select

// Format the data
$data = "Profession: $profession\n";
$data .= "Location: $location\n";
$data .= "Water Source: $water_source\n";
$data .= "Water Awareness: $water_awareness\n";
$data .= "Water Concerns: $water_concerns\n";
$data .= "Interest Areas: $interest_areas\n";
$data .= "-----------------------------\n";

// Path to the file where the responses will be saved
$file_path = 'survey_responses.txt';

// Check if the file exists and is writable
if (is_writable($file_path)) {
    // Append the data to the text file
    file_put_contents($file_path, $data, FILE_APPEND);
} else {
    // Handle the case where the file is not writable
    die("Unable to write to file.");
}

// Redirect to the suggestions page with the profession as a query parameter
header("Location: suggestions.php?profession=$profession");
exit();
?>
