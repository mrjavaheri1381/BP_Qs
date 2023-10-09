// script.js
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const statusSelect = document.getElementById("statusSelect");
    const topicLabels = document.querySelectorAll(".topic-label");
    const questionList = document.querySelector(".question-list");

    // Function to filter and render questions
    function filterAndRenderQuestions(questions) {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedStatus = statusSelect.value;
        const selectedTopics = Array.from(topicLabels)
            .filter(label => label.classList.contains("selected-topic"))
            .map(label => label.getAttribute("data-topic"));

        const filteredQuestions = questions.filter(question => {
            const nameMatch = question.Name.toLowerCase().includes(searchTerm);
            const statusMatch = !selectedStatus || question.Status === selectedStatus;
            const topicsMatch = selectedTopics.every(topic => question.Topics.includes(topic));

            return nameMatch && statusMatch && topicsMatch;
        });

        renderQuestions(filteredQuestions);
    }

    // Function to render questions
    function renderQuestions(questions) {
        questionList.innerHTML = "";

        if (questions.length === 0) {
            questionList.innerHTML = "<p>No matching questions found.</p>";
            return;
        }

        questions.forEach(question => {
            const questionItem = document.createElement("div");
            questionItem.className = "question-item";
            questionItem.innerHTML = `
                <h3><a href="${question.Link}" target="_blank">${question.Name}</a></h3>
                <p>Topics: ${question.Topics.join(", ")}</p>
                <p>Status: ${question.State}</p>
            `;

            questionList.appendChild(questionItem);
        });
    }

    // Function to handle topic selection
    function toggleTopicSelection(event) {
        const label = event.target;
        label.classList.toggle("selected-topic");
        filterAndRenderQuestions(loadedQuestions); // Filter using loaded questions
    }

    // Add click event listeners to topic labels
    topicLabels.forEach(label => {
        label.addEventListener("click", toggleTopicSelection);
    });

    // Event listeners
    searchInput.addEventListener("input", () => filterAndRenderQuestions(loadedQuestions));
    statusSelect.addEventListener("change", () => filterAndRenderQuestions(loadedQuestions));

    // Fetch questions from data.json
    let loadedQuestions; // To store loaded questions

    fetch('/static/js/data.json')
        .then(response => response.json())
        .then(data => {
            loadedQuestions = data; // Store the loaded questions
            filterAndRenderQuestions(loadedQuestions); // Initial rendering
        })
        .catch(error => console.error('Error loading data:', error));
});
