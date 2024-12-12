<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Suggestions - Jal Sanjeevni</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="logo">
            <img src="jal_sanjeevni_logo.png" alt="Jal Sanjeevni Logo">
        </div>
        <h1>Thank You for Your Submission!</h1>
    </header>

    <main>
        <section>
            <div class="container">
                <h2>Suggested Pages for You</h2>
                <p>Based on your profession, we recommend exploring the following resources:</p>
                <ul>
                    <?php
                    // Get profession from the URL query
                    $profession = $_GET['profession'];

                    // Suggest pages based on profession
                    if ($profession == "student") {
                        echo '<li><a href="course.html">Explore Courses</a></li>';
                        echo '<li><a href="articles.html">Read Articles</a></li>';
                    } elseif ($profession == "farmer") {
                        echo '<li><a href="techniques.html">Water-Saving Techniques</a></li>';
                        echo '<li><a href="case-studies.html">Case Studies</a></li>';
                    } elseif ($profession == "engineer") {
                        echo '<li><a href="workshops.html">Workshops</a></li>';
                        echo '<li><a href="articles.html">Research Articles</a></li>';
                    } else {
                        echo '<li><a href="index.html">Visit Home Page</a></li>';
                        echo '<li><a href="forum.html">Join the Forum</a></li>';
                    }
                    ?>
                </ul>
                <p>Feel free to explore other sections of the website too. Together, let's conserve water!</p>
            </div>
        </section>
    </main>

    <footer>
        <h4>&copy; 2024 Water Efficient Knowledge Platform. All rights reserved.</h4>
    </footer>
</body>
</html>
