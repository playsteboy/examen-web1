/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const progress = document.getElementById("progress");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 50) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "#ff6b6b"; // Highlight first word
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    results.textContent = `0.00`;
    progress.textContent = `0.00%`;

    totalWords = 1 ;
    rate = 0 ;

};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculate and return WPM & accuracy
let totalWords = 1;
let rate = 0 ;
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - previousEndTime) / 1000;
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60);

    const expected = wordsToType[currentWordIndex];
    const typed = inputField.value.trim();
    let correctChars = 0;

    for (let i = 0; i < Math.min(expected.length, typed.length); i++) {
        if (expected[i] === typed[i]) correctChars++;
    }
    const accuracy = (correctChars / expected.length) * 100;
    rate += accuracy

    const totalRate = rate/totalWords
    
    return { wpm: wpm.toFixed(2), totalRate: totalRate.toFixed(2) };
};


// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed
        //if (inputField.value.trim() === wordsToType[currentWordIndex]) {
            if (!previousEndTime) previousEndTime = startTime;
            results.style.whiteSpace = "pre-line";
            const { wpm, totalRate } = getCurrentStats();
            results.textContent = `${wpm}`;
            progress.textContent = `${totalRate}%`
            
            totalWords++
            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();
            
            inputField.value = ""; // Clear input field after space
            event.preventDefault(); // Prevent adding extra spaces
            //}
        }
    };
    
    // Highlight the current word in red
    const highlightNextWord = () => {
        const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "#2e2e2e";
        }
        wordElements[currentWordIndex].style.color = "#ff6b6b";
    }
};

// Event listeners
// Attach `updateWord` to `keydown` instead of `input`
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});
modeSelect.addEventListener("change", () => startTest());

// Start the test
startTest();

const restart = document.getElementById("button_restart")

restart.addEventListener(("click"),()=>{
    startTest();
})

