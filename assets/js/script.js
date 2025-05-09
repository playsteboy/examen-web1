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
const finalMessage = document.getElementById("finalMessage");
const finalCat = document.getElementById("finalCat");
const typingStatus = document.getElementById("typingStatus");
const wpmDisplay = document.getElementById("wpmDisplay");
const displayFinal = document.getElementById("displayFinal");
const timeMessage = document.getElementById("timeMessage");
const textLimit = document.getElementById("textLimit")
const chrono = document.getElementById("chrono")
const loader_container = document.getElementById('loader_container')

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

const loader = document.getElementById('loader');

function showLoader(duration = 800, callback = () => {}) {
    loader.classList.remove('none');
    loader_container.classList.remove('none')
    setTimeout(() => {
        loader.classList.add('none');
        loader_container.classList.add('none')
        callback();
    }, duration);
}

// Initialize the typing test
const startTest = (wordCount = 50) => {
    typingStatus.classList.remove("bounce");
    displayFinal.classList.add("none");
    wpmDisplay.classList.add('none');
    typingStatus.textContent = "Typing Test";
    finalCat.classList.add('none');
    inputField.disabled = false;
    finalMessage.classList.add('none');
    wordDisplay.classList.remove('none');
    inputField.classList.remove('none');
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    endTime = null;
    previousEndTime = null;

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "#ff6b6b";
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    results.textContent = `0.00`;
    progress.textContent = `0.00%`;

    totalWords = 1;
    rate = 0;

    clearInterval(countdownInterval);
    countdownInterval = null;

    const selectedTime = timerSelect.value;

    if (selectedTime !== "none") {
        timeMessage.classList.remove('none');
        timeLeft = parseInt(selectedTime);
        updateTimerDisplay();
    } else {
        timeMessage.classList.add('none');
        timerDisplay.textContent = "";
    }
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) {
        startTime = Date.now();

        if (timerSelect.value !== "none" && !countdownInterval) {
            countdownInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    finishTest();
                }
            }, 1000);
        }
    }
};

// Calculate and return WPM & accuracy
let totalWords = 0;
let rate = 0;
const getCurrentStats = () => {
    const now = Date.now();
    const elapsedTime = previousEndTime ? (now - previousEndTime) / 1000 : 1;

    const expected = wordsToType[currentWordIndex];
    const typed = inputField.value.trim();

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
    if (event.key === " ") {
        if (inputField.value.trim() === wordsToType[currentWordIndex]) {
            if (!previousEndTime) previousEndTime = startTime;

            results.style.whiteSpace = "pre-line";
            const { bigWpm, totalRate } = getCurrentStats();
            results.textContent = `${bigWpm}`;
            progress.textContent = `${totalRate}%`;

            totalWords++;
            currentWordIndex++;
            previousEndTime = Date.now();
            highlightNextWord();

            inputField.value = "";
            event.preventDefault();
        } else {
            if (!previousEndTime) previousEndTime = startTime;

            if (event.key === " " && inputField.value.trim() === "") {
                event.preventDefault();
                return;
            }

            results.style.whiteSpace = "pre-line";
            const { bigWpm, totalRate } = getCurrentStats();
            results.textContent = `${bigWpm}`;
            progress.textContent = `${totalRate}%`;

            totalWords++;
            previousEndTime = Date.now();

            inputField.value = "";
            event.preventDefault();
        }
    }
};

// Highlight the current word in red
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex >= wordsToType.length) {
        displayFinal.classList.add("none");
            wpmDisplay.classList.add('none');
            textLimit.classList.add("none")
            chrono.classList.add("none")
            inputField.classList.add("none");
        showLoader(800, () => {
            inputField.classList.remove("none");
            textLimit.classList.remove("none")
            chrono.classList.remove("none")
            displayFinal.classList.remove("none");
            wpmDisplay.classList.remove('none');
            if (!endTime) endTime = Date.now();
            if (startTime) {
                const totalElapsedTime = (endTime - startTime) / 1000 / 60;
                const finalWPM = totalElapsedTime <= 0 ? 0 : (currentWordIndex / totalElapsedTime);
    animateCounter(wpmDisplay, 0, finalWPM);
    
            }
    
            finalCat.classList.remove('none');
            wordDisplay.classList.add('none');
            inputField.classList.add('none');
            inputField.disabled = true;
            finalMessage.classList.remove('none');
            finalMessage.style.whiteSpace = "pre-line";
            typingStatus.textContent = "Test Is Over !";
            typingStatus.classList.add("bounce");
            finalMessage.textContent = `Want to give it another shot? Click restart or try a new mode`;
            return;
        });
    }

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "#2e2e2e";
        }
        wordElements[currentWordIndex].style.color = "#ff6b6b";
    }
};

// Event listeners
inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});

modeSelect.addEventListener("change", () => startTest());

// Start the test initially
startTest();

const restart = document.getElementById("button_restart");
restart.addEventListener("click", () => {
        startTest();
});

const skip = document.getElementById("button_skip");
skip.addEventListener("click", () => {
    finalCat.classList.add("none");
        finalMessage.classList.add("none");
        displayFinal.classList.add("none");
    chrono.classList.add("none")
    textLimit.classList.add("none")
    wordDisplay.classList.add("none");
    inputField.classList.add("none");
    showLoader(800, () => {
        finalCat.classList.remove("none");
        finalMessage.classList.remove("none");
        displayFinal.classList.remove("none");
        chrono.classList.remove("none")
        textLimit.classList.remove("none")
        displayFinal.classList.remove("none");
        wpmDisplay.classList.remove('none');
        if (startTime && currentWordIndex > 0) {
            if (!endTime) endTime = Date.now();
            const totalElapsedTime = (endTime - startTime) / 1000 / 60;
            const finalWPM = totalElapsedTime <= 0 ? 0 : (currentWordIndex / totalElapsedTime);
    animateCounter(wpmDisplay, 0, finalWPM);
    
        } else {
            wpmDisplay.textContent = `0.00`;
        }
        typingStatus.classList.add("bounce");
    
        wordDisplay.classList.add('none');
        finalCat.classList.remove('none');
        typingStatus.textContent = "Test Is Over !";
        inputField.classList.add('none');
        inputField.disabled = true;
        finalMessage.classList.remove('none');
        finalMessage.style.whiteSpace = "pre-line";
        finalMessage.textContent = `Want to give it another shot? Click restart or try a new mode`;
    });
});

function finishTest() {
    textLimit.classList.add("none")
    wordDisplay.classList.add("none");
    inputField.classList.add("none");
    chrono.classList.add("none")
    showLoader(800, () => {
        chrono.classList.remove("none")
        textLimit.classList.remove("none")
        typingStatus.classList.remove('none')
        displayFinal.classList.remove("none");
        wpmDisplay.classList.remove('none');
    
        if (!endTime) endTime = Date.now();
        if (startTime) {
            const totalElapsedTime = (endTime - startTime) / 1000 / 60;
            const globalWPM = currentWordIndex / (totalElapsedTime > 0 ? totalElapsedTime : 1);
            const finalWPM = totalElapsedTime <= 0 ? 0 : (currentWordIndex / totalElapsedTime);
    animateCounter(wpmDisplay, 0, finalWPM);
    
        }
    
        typingStatus.textContent = "Test Is Over !";
        typingStatus.classList.add("bounce");
        inputField.disabled = true;
        finalCat.classList.remove("none");
        finalMessage.classList.remove("none");
        finalMessage.style.whiteSpace = "pre-line";
        finalMessage.textContent = `Want to give it another shot? Click restart or try a new mode`;
    });
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `0${minutes} : ${seconds.toString().padStart(2, '0')}`;
}

//Select time without restarting the test
timerSelect.addEventListener("change", () => {
    const selectedTime = timerSelect.value;
    if (selectedTime !== "none") {
        timeLeft = parseInt(selectedTime);
        timeMessage.classList.remove("none");
        updateTimerDisplay(); 
    } else {
        timeMessage.classList.add("none");
        timerDisplay.textContent = "";
    }
});

function animateCounter(element, start, end, duration = 1000) {
    const range = end - start;
    let startTime = null;

    function animate(time) {
        if (!startTime) startTime = time;
        const progress = time - startTime;
        const current = Math.min(start + (range * (progress / duration)), end);
        element.textContent = current.toFixed(2);

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = end.toFixed(2);
        }
    }

    requestAnimationFrame(animate);
}
finalCat.addEventListener('click', () => {
    finalCat.classList.remove('catScale', 'catWiggle', 'catRotate');
    void finalCat.offsetWidth;
    finalCat.classList.add('catScale');
});

finalCat.addEventListener('animationend', (e) => {
    if (e.animationName === 'catScale') {
        finalCat.classList.remove('catScale');
        void finalCat.offsetWidth;
        finalCat.classList.add('catWiggle');
    } else if (e.animationName === 'catWiggle') {
        finalCat.classList.remove('catWiggle');
        setTimeout(() => {
            finalCat.classList.add('catRotate');
        }, 200);
    }
});



