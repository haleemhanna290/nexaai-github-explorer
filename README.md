# NexaAI GitHub Explorer

NexaAI GitHub Explorer is a frontend project built for the internship task: Level 2 – Task 2: REST API Integration. The app helps users search GitHub repositories, filter results, sort them, and open live repository pages using the public GitHub REST API.

## Project Description

This application showcases how a frontend web app can communicate with a public API using the Fetch API, display live data dynamically, and handle loading, empty, and error states gracefully. It is designed to be beginner-friendly, clean, responsive, and easy to understand.

## Features

- Search GitHub repositories using a keyword
- Fetch live data from the GitHub REST API
- Display repository cards dynamically
- Filter results by programming language
- Sort results by best match, stars, and forks
- Handle loading and empty states
- Show friendly error messages if the request fails
- Open repository pages in a new browser tab
- Responsive layout for mobile, tablet, and desktop
- Simple and clean SaaS-style UI

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- GitHub REST API
- Fetch API

## API Used

This project uses the GitHub public REST API:

- Search endpoint: https://api.github.com/search/repositories?q=SEARCH_TERM

The app uses the `items` array returned from the API and shows repository details such as:

- name
- full_name
- owner.login
- owner.avatar_url
- description
- html_url
- language
- stargazers_count
- forks_count
- open_issues_count

## How the GitHub API Works

GitHub exposes public data through REST API endpoints. In this project, we call the repository search endpoint with a keyword such as `react` or `javascript`.

Example:

```javascript
const apiURL = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchTerm)}`;
const response = await fetch(apiURL);
const data = await response.json();
```

The returned JSON includes an `items` array containing repositories matching the search term. The frontend then reads this data and displays it in cards.

## Project Structure

```text
nexaai-github-explorer/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run

1. Open the project folder in VS Code.
2. Open [index.html](index.html) using Live Server.
3. Enter a repository keyword such as `react`, `node`, or `python`.
4. Click the Search button or press Enter.
5. View live repository results from GitHub.

## Future Improvements

- Add repository detail pages
- Add pagination for more search results
- Support more advanced filters
- Add dark mode
- Add bookmark/favorite functionality
- Improve accessibility and animations

## Internship Task Information

- Company: Codveda Technologies
- Level: 2
- Task: REST API Integration
- Task Name: NexaAI GitHub Explorer

## Author

Developed for the Front-End Development Internship task.

---

This project is designed to demonstrate the effective use of REST API integration in a practical and beginner-friendly frontend application.
