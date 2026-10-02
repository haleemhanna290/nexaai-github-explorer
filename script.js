// NexaAI GitHub Explorer
// This file fetches live GitHub repository data using the GitHub REST API.

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const clearButton = document.getElementById("clearButton");
const languageFilter = document.getElementById("languageFilter");
const sortSelect = document.getElementById("sortSelect");
const resultsInfo = document.getElementById("resultsInfo");
const repoGrid = document.getElementById("repoGrid");
const statusMessage = document.getElementById("statusMessage");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("navMenu");
const exampleChips = document.querySelectorAll(".chip");

let allRepositories = [];
let currentSort = "best_match";
let currentLanguage = "All";
let searchDebounceTimer = null;

// Show a loading message while the GitHub API request is running.
function showLoading(message) {
  statusMessage.textContent = message;
  statusMessage.className = "status-message visible loading";
}

// Show a friendly error message when the request fails.
function showError(message) {
  statusMessage.textContent = message;
  statusMessage.className = "status-message visible error";
}

// Show a friendly empty state before search or when there are no results.
function showEmptyState(message) {
  repoGrid.innerHTML = `
    <div class="empty-state" aria-live="polite">
      <div class="empty-icon">🔍</div>
      <h3>${message}</h3>
      <p>Discover projects, technologies, and developer communities across GitHub.</p>
    </div>
  `;
}

function updateResultsInfo(count) {
  resultsInfo.textContent = `Showing ${count} repositories`;
}

function formatCount(value) {
  if (value === null || value === undefined) {
    return "0";
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }

  return String(value);
}

function renderRepositoryCard(repo) {
  const image = repo.owner && repo.owner.avatar_url ? repo.owner.avatar_url : "";
  const description = repo.description || "No description available.";
  const language = repo.language || "Not specified.";
  const visibility = repo.private ? "Private" : "Public";

  const card = document.createElement("article");
  card.className = "repo-card";
  card.innerHTML = `
    <div class="card-top">
      <div class="repo-icon" aria-hidden="true">📁</div>
      <img src="${image}" alt="${repo.owner.login} avatar" width="42" height="42" style="border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0;" />
    </div>

    <div>
      <h3 class="repo-name">${repo.name}</h3>
      <p class="repo-owner">${repo.owner.login} / ${repo.name}</p>
    </div>

    <p class="repo-description">${description}</p>

    <span class="language-badge">${language}</span>

    <div class="repo-stats">
      <div>
        <span>⭐</span>
        <strong>${formatCount(repo.stargazers_count)}</strong>
      </div>
      <div>
        <span>🍴</span>
        <strong>${formatCount(repo.forks_count)}</strong>
      </div>
      <div>
        <span>⚠️</span>
        <strong>${formatCount(repo.open_issues_count)}</strong>
      </div>
    </div>

    <div class="repo-visibility ${visibility.toLowerCase()}">${visibility}</div>

    <a
      class="repo-link"
      href="${repo.html_url}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View ${repo.name} on GitHub"
    >
      View Repository
    </a>
  `;

  return card;
}

function sortRepositories(items) {
  const sortedItems = [...items];

  if (currentSort === "stars") {
    sortedItems.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } else if (currentSort === "forks") {
    sortedItems.sort((a, b) => b.forks_count - a.forks_count);
  } else {
    sortedItems.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  return sortedItems;
}

function filterRepositories() {
  const filtered = allRepositories.filter((repo) => {
    if (currentLanguage === "All") {
      return true;
    }

    return (repo.language || "Not specified.") === currentLanguage;
  });

  const sortedAndFiltered = sortRepositories(filtered);
  displayRepositories(sortedAndFiltered);
  updateResultsInfo(sortedAndFiltered.length);

  if (sortedAndFiltered.length === 0) {
    showEmptyState("No repositories found. Try another search.");
  }
}

function displayRepositories(repositories) {
  repoGrid.innerHTML = "";

  if (!repositories || repositories.length === 0) {
    showEmptyState("No repositories found. Try another search.");
    return;
  }

  repositories.forEach((repo) => {
    repoGrid.appendChild(renderRepositoryCard(repo));
  });
}

async function fetchRepositories(searchTerm) {
  const apiURL = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchTerm)}`;

  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error("Unable to fetch repositories.");
    }

    const data = await response.json();
    allRepositories = data.items || [];

    filterRepositories();

    if (allRepositories.length === 0) {
      statusMessage.textContent = "No repositories found. Try another search.";
      statusMessage.className = "status-message visible";
    } else {
      statusMessage.textContent = "Repositories loaded successfully.";
      statusMessage.className = "status-message visible loading";
      setTimeout(() => {
        statusMessage.className = "status-message";
        statusMessage.textContent = "";
      }, 1200);
    }
  } catch (error) {
    allRepositories = [];
    showError("Unable to fetch repositories. Please check your internet connection and try again.");
    showEmptyState("Search GitHub to discover amazing projects.");
    updateResultsInfo(0);
  }
}

async function searchRepositories() {
  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    showError("Please enter a search term.");
    showEmptyState("Search GitHub to discover amazing projects.");
    updateResultsInfo(0);
    return;
  }

  showLoading("Searching GitHub...");
  await fetchRepositories(searchTerm);
}

function debounce(callback, delay) {
  return function debounceFunction(...args) {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => callback(...args), delay);
  };
}

const debouncedSearch = debounce(() => {
  searchRepositories();
}, 500);

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await searchRepositories();
});

searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim();

  if (!term) {
    allRepositories = [];
    showEmptyState("Search GitHub to discover amazing projects.");
    updateResultsInfo(0);
    statusMessage.className = "status-message";
    statusMessage.textContent = "";
    return;
  }

  debouncedSearch();
});

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  allRepositories = [];
  currentLanguage = "All";
  languageFilter.value = "All";
  sortSelect.value = "best_match";
  currentSort = "best_match";
  showEmptyState("Search GitHub to discover amazing projects.");
  updateResultsInfo(0);
  statusMessage.className = "status-message";
  statusMessage.textContent = "";
});

languageFilter.addEventListener("change", (event) => {
  currentLanguage = event.target.value;

  if (allRepositories.length > 0) {
    filterRepositories();
  }
});

sortSelect.addEventListener("change", (event) => {
  currentSort = event.target.value;

  if (allRepositories.length > 0) {
    filterRepositories();
  }
});

exampleChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const query = chip.dataset.query;
    searchInput.value = query;
    searchRepositories();
  });
});

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

showEmptyState("Search GitHub to discover amazing projects.");
updateResultsInfo(0);
