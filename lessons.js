// Function to get the query parameter from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to load JSON data
async function loadJSON() {
    const response = await fetch('lessons.json');
    return await response.json();
}

// Function to create and return an HTML element
function createElement(tag, textContent) {
    const element = document.createElement(tag);
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

// Function to initialize the game based on the level
async function initGame() {
    const level = getQueryParameter('level') || '1';  // Default to level 1 if not specified
    const data = await loadJSON();
    const levelData = data[`level${level}`];
    
    if (!levelData) {
        document.getElementById('game-content').innerText = `Level ${level} data not found`;
        return;
    }

    // Clear existing content
    const lessonsContent = document.getElementById('lessons-content');
    lessonsContent.innerHTML = '';

    // Populate content dynamically
    lessonsContent.appendChild(createElement('h1', levelData.title));
    lessonsContent.appendChild(createElement('h2', levelData.symbol));
    levelData.description.forEach(desc => {
        lessonsContent.appendChild(createElement('p', desc));
    });
    lessonsContent.appendChild(createElement('h2', 'Examples:'));
    const ul = createElement('ul');
    levelData.examples.forEach(example => {
        ul.appendChild(createElement('li', example));
    });
    lessonsContent.appendChild(ul);

    // Create the exercise link dynamically
    const exerciseLink = createElement('a', 'START');
    exerciseLink.className = 'start-link';
    exerciseLink.href = `exercises.html?level=${level}`;
    lessonsContent.appendChild(exerciseLink);

    const lessonsNavigation = document.getElementById('lessons-navigation');
    // create 20 links for the other lessons
    for (let i = 1; i <= 20; i++) {
        const lessonLink = createElement('a', `level ${i}`);
        lessonLink.className = 'lesson-link';
        if (data[`level${i}`]) {
            lessonLink.textContent = data[`level${i}`].symbol;
        }
        lessonLink.href = `lessons.html?level=${i}`;
        lessonsNavigation.appendChild(lessonLink);
    }
}

// Initialize the game when the DOM content is loaded
document.addEventListener('DOMContentLoaded', initGame);
