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
let endTime = null;
const timerSelect = document.getElementById("timerSelect");
let countdownInterval = null;
let timeLeft = null;
const timerDisplay = document.getElementById("timerDisplay");



const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const progress = document.getElementById("progress");
const finalMessage = document.getElementById("finalMessage")
const finalCat = document.getElementById("finalCat")
const typingStatus = document.getElementById("typingStatus")
const wpmDisplay = document.getElementById("wpmDisplay")
const displayFinal = document.getElementById("displayFinal")
const timeMessage = document.getElementById("timeMessage")

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
    typingStatus.classList.remove("bounce")
    displayFinal.classList.add("none")
    wpmDisplay.classList.add('none')
    typingStatus.textContent = "Typing Test"
    finalCat.classList.add('none')
    inputField.disabled = false;
    finalMessage.classList.add('none')
    wordDisplay.classList.remove('none')
    inputField.classList.remove('none') 
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = Date.now()
    endTime = null;
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

clearInterval(countdownInterval);
const selectedTime = timerSelect.value;

if (selectedTime !== "none") {
    timeMessage.classList.remove('none')
    timeLeft = parseInt(selectedTime);
    updateTimerDisplay();
    countdownInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            finishTest();
        }
    }, 1000);
} else {
    timeMessage.classList.add('none')
    timerDisplay.textContent = "";
}


};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculate and return WPM & accuracy
let totalWords = 0;
let rate = 0 ;
const getCurrentStats = () => {
    const now = Date.now();
    const elapsedTime = previousEndTime ? (now - previousEndTime) / 1000 : 1;

    const expected = wordsToType[currentWordIndex];
    const typed = inputField.value.trim();

    //if (!expected || !typed) return { bigWpm: "0.00", totalRate: "0.00" };

    let correctChars = 0;
    let uncorrectChars = 0;

    for (let i = 0; i < Math.min(expected.length, typed.length); i++) {
        if (expected[i] === typed[i]) correctChars++;
        else uncorrectChars++;
    }

    const minutes = elapsedTime / 60;
    if (minutes === 0) return { bigWpm: "0.00", totalRate: "0.00" };

    const wpm = (expected.length / 5) / minutes;

    const accuracy = expected.length ? (correctChars / expected.length) * 100 : 0;
    const bigWpm = wpm * (accuracy / 100);


    rate += accuracy;
    const totalRate = rate / totalWords;

    if (!expected || expected.length === 0 || totalWords === 0) {
        return { bigWpm: "0.00", totalRate: "0.00" };
    }
    

    return { bigWpm: bigWpm.toFixed(2), totalRate: totalRate.toFixed(2) };
};



// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed
        if (inputField.value.trim() === wordsToType[currentWordIndex]) {
            if (!previousEndTime) previousEndTime = startTime;

            results.style.whiteSpace = "pre-line";
            const { bigWpm, totalRate } = getCurrentStats();
            results.textContent = `${bigWpm}`;
            progress.textContent = `${totalRate}%`
            
            totalWords++
            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();
            
            inputField.value = ""; // Clear input field after space
            event.preventDefault(); // Prevent adding extra spaces
            }
            else{
                if (!previousEndTime) previousEndTime = startTime;
                if (event.key === " ") {
                    if (inputField.value.trim() === "") {
                        event.preventDefault(); 
                        return;
                    }
                    
                }
        
                results.style.whiteSpace = "pre-line";
                const { bigWpm, totalRate } = getCurrentStats();
                results.textContent = `${bigWpm}`;
                progress.textContent = `${totalRate}%`
                
                totalWords++
                previousEndTime = Date.now();
                
                inputField.value = ""; // Clear input field after space
                
                event.preventDefault(); // Prevent adding extra spaces
            }
        }
    };
    
    // Highlight the current word in red
    const highlightNextWord = () => {
        const wordElements = wordDisplay.children;

        if (currentWordIndex >= wordsToType.length) {
            displayFinal.classList.remove("none")
            wpmDisplay.classList.remove('none')
            if (!endTime) endTime = Date.now();
                if (startTime) {
                    const totalElapsedTime = (endTime - startTime) / 1000 / 60;
                    if (totalElapsedTime <= 0) {
                        wpmDisplay.textContent = `0.00`;
                    } else {
                        const globalWPM = currentWordIndex / totalElapsedTime;
                        wpmDisplay.textContent = `${globalWPM.toFixed(2)}`;
                    }
                }
                
            finalCat.classList.remove('none')
            wordDisplay.classList.add('none')
            inputField.classList.add('none') 
            inputField.disabled = true;
            finalMessage.classList.remove('none')
            finalMessage.style.whiteSpace = "pre-line";
            typingStatus.textContent = "Test Is Over !"
            typingStatus.classList.add("bounce")
            finalMessage.textContent = `Tap on the restart button to try again or select a new mode`;
            return;
        }
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

const skip = document.getElementById("button_skip")
skip.addEventListener(("click"),()=>{
    displayFinal.classList.remove("none")
    wpmDisplay.classList.remove('none')
    if (startTime && currentWordIndex > 0) {
        if (!endTime) endTime = Date.now();
        const totalElapsedTime = (endTime - startTime) / 1000 / 60;
        if (totalElapsedTime <= 0) {
            wpmDisplay.textContent = `0.00`;
        } else {
            const globalWPM = currentWordIndex / totalElapsedTime; 
            wpmDisplay.textContent = `${globalWPM.toFixed(2)}`;
        }
    } else {
        wpmDisplay.textContent = `0.00`; 
    }
    typingStatus.classList.add("bounce")
            
    wordDisplay.classList.add('none')
    finalCat.classList.remove('none')
    typingStatus.textContent = "Test Is Over !"
            inputField.classList.add('none') 
            inputField.disabled = true;
            finalMessage.classList.remove('none')
            finalMessage.style.whiteSpace = "pre-line";
            finalMessage.textContent = `Tap on the restart button to try again or select a new mode`;
})

function finishTest() {
    displayFinal.classList.remove("none");
    wpmDisplay.classList.remove('none');

    if (!endTime) endTime = Date.now();
    if (startTime) {
        const totalElapsedTime = (endTime - startTime) / 1000 / 60;
        const globalWPM = currentWordIndex / (totalElapsedTime > 0 ? totalElapsedTime : 1);
        wpmDisplay.textContent = `${globalWPM.toFixed(2)}`;
    }

    typingStatus.textContent = "Test Is Over !";
    typingStatus.classList.add("bounce");
    wordDisplay.classList.add("none");
    inputField.classList.add("none");
    inputField.disabled = true;
    finalCat.classList.remove("none");
    finalMessage.classList.remove("none");
    finalMessage.style.whiteSpace = "pre-line";
    finalMessage.textContent = `Tap on the restart button to try again or select a new mode`;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `0${minutes} : ${seconds.toString().padStart(2, '0')}`;
}


