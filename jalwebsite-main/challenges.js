// Select the leaderboard list, search input, and sort select elements
const leaderboardList = document.getElementById('leaderboard-list');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');

// Sample leaderboard data (this could be fetched from a database or API)
const leaderboardData = [
    { name: 'John Doe', waterSaved: 150 },
    { name: 'Jane Smith', waterSaved: 140 },
    { name: 'Alex Johnson', waterSaved: 130 },
    { name: 'Emily Davis', waterSaved: 120 },
    { name: 'Michael Brown', waterSaved: 110 },
];

// Function to render the leaderboard
function renderLeaderboard(data) {
    leaderboardList.innerHTML = data.map(entry => `<li>${entry.name} - ${entry.waterSaved} liters saved</li>`).join('');
}

// Function to update the leaderboard based on search and sort
function updateLeaderboard() {
    let filteredData = [...leaderboardData];

    // Filter by search input
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredData = filteredData.filter(entry => entry.name.toLowerCase().includes(searchTerm));
    }

    // Sort data
    const sortOrder = sortSelect.value;
    filteredData.sort((a, b) => sortOrder === 'asc' ? a.waterSaved - b.waterSaved : b.waterSaved - a.waterSaved);

    // Render the filtered and sorted leaderboard
    renderLeaderboard(filteredData);
}

// Event listeners for search input and sort select
searchInput.addEventListener('input', updateLeaderboard);
sortSelect.addEventListener('change', updateLeaderboard);

// Initial render of the leaderboard
renderLeaderboard(leaderboardData);