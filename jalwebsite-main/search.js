// Search data containing content from all pages
const searchData = [
    {
      title: "Home",
      link: "index.html",
      description: "Welcome to Jal Sanjeevni – where every drop counts.",
      content: "Transforming every drop into a legacy. Welcome to the Elixir of Life. Jal Sanjeevni – water conservation and saving techniques.",
    },
    {
      title: "Water-Saving Techniques",
      link: "techniques.html",
      description: "Learn various water-saving methods to conserve water effectively.",
      content: "Techniques like rainwater harvesting, greywater recycling, and efficient irrigation systems are covered here.",
    },
    {
      title: "Case Studies",
      link: "case-studies.html",
      description: "Explore real-world examples of water-saving initiatives.",
      content: "Case studies include community-based water conservation efforts and individual success stories.",
    },
    {
      title: "Forum and Quiz",
      link: "forum.html",
      description: "Join discussions and take quizzes on water conservation topics.",
      content: "Engage in forums and test your knowledge about water conservation.",
    },
    {
      title: "Contact Us",
      link: "contact.html",
      description: "Get in touch with us for more information.",
      content: "Contact Jal Sanjeevni for inquiries, feedback, or to join our initiatives.",
    },
    {
      title: "Gallery",
      link: "gallery.html",
      description: "View inspiring images and stories about water conservation.",
      content: "Explore pictures of water-saving techniques and community efforts.",
    },
    {
      title: "Workshops",
      link: "workshops.html",
      description: "Attend workshops and learn water-saving techniques.",
      content: "Workshops on rainwater harvesting, efficient irrigation, and water sustainability.",
    },
    {
      title: "Challenges & Rewards",
      link: "water-conservation-challenges.html",
      description: "Participate in challenges and earn rewards for your contributions.",
      content: "Compete in water-saving challenges and earn recognition for your efforts.",
    },
    {
      title: "Profile",
      link: "profile.html",
      description: "Manage your profile and track your water-saving activities.",
      content: "Track your progress in saving water and view badges earned for contributions.",
    },
  ];
  
  // Perform search function
  function performSearch() {
    const searchInput = document.getElementById("search-input").value.toLowerCase().trim();
    const results = searchData.filter((item) =>
      item.title.toLowerCase().includes(searchInput) ||
      item.description.toLowerCase().includes(searchInput) ||
      item.content.toLowerCase().includes(searchInput)
    );
  
    if (results.length > 0) {
      displayResults(results);
    } else {
      displayNoResults();
    }
  }
  
  // Display search results
  function displayResults(results) {
    const resultContainer = document.getElementById("search-results");
    let resultHTML = `<h3>Search Results:</h3><ul style="list-style-type: none; padding: 0;">`;
  
    results.forEach((result) => {
      resultHTML += `
        <li style="margin-bottom: 10px;">
          <a href="${result.link}" style="font-size: 18px; color: #007BFF; text-decoration: none;">${result.title}</a>
          <p style="margin: 5px 0; color: #555;">${result.description}</p>
        </li>
      `;
    });
  
    resultHTML += `</ul>`;
    resultContainer.innerHTML = resultHTML;
    resultContainer.style.display = "block";
  }
  
  // Display message for no results
  function displayNoResults() {
    const resultContainer = document.getElementById("search-results");
    resultContainer.innerHTML = `<p style="color: #FF0000;">No results found. Please try searching for another keyword.</p>`;
    resultContainer.style.display = "block";
  }
  