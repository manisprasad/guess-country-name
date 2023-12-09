// Define startQuiz globally
async function startQuiz() {
    try {
        const flagImg = document.querySelector("#flag-img");
        flagImg.src = "https://cdn.dribbble.com/users/255512/screenshots/2215917/animation.gif";
        const allData = await getCountryFlagData();
        if (allData) {
          
            setupQuiz(allData);
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    await startQuiz(); // Call the startQuiz function here
});

async function getCountryFlagData() {
    try {
        const response = await fetch("https://shadify.dev/api/countries/country-quiz");

        if (!response.ok) {
            throw new Error("Can't fetch data");
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        throw new Error("Failed to fetch data: " + error.message);
    }
}

function setupQuiz(allData) {
    const answer = allData.answer.trim();
    const variants = allData.variants.map(variant => variant.trim());

    const flagImg = document.querySelector("#flag-img");
    flagImg.src = allData.flag;

    createOptionDiv(variants[0], variants[1], variants[2], variants[3]);

    let isClickLocked = false; // Define locally within the function

    const optionButtons = document.querySelectorAll(".option-div button");

    optionButtons.forEach(eachBtn => {
        eachBtn.addEventListener("click", () => {
            if (isClickLocked) {
                return;
            }
            isClickLocked = true;
            const clickedOption = eachBtn.textContent.trim();
            handleAnswerFeedback(eachBtn, clickedOption === answer, () => {
                isClickLocked = false; // Reset the flag after handling feedback
            });
        });
    });
}

function createOptionDiv(opt1, opt2, opt3, opt4) {
    const optionDiv = document.querySelector(".option-div");

    const button1 = createButton(opt1);
    const button2 = createButton(opt2);
    const button3 = createButton(opt3);
    const button4 = createButton(opt4);

    optionDiv.innerHTML = ''; // Clear existing content
    optionDiv.appendChild(button1);
    optionDiv.appendChild(button2);
    optionDiv.appendChild(button3);
    optionDiv.appendChild(button4);
}

function createButton(text) {
    const button = document.createElement('button');
    button.className = "bg-blue-600 hover:scale-105 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue";
    button.textContent = text;
    return button;
}

function handleAnswerFeedback(element, isCorrect, callback) {
    const animationName = isCorrect ? 'correctAnswerAnimation' : 'wrongAnswerAnimation';
    element.style.animation = `${animationName} 0.5s ease-in-out`;
    
    element.addEventListener("animationend", () => {
        element.style.animation = "";
        callback(); // Invoke the callback to reset the flag
    });

    if (isCorrect) {
        isClickLocked = true;
    
        let container = document.querySelector(".container");
        let loader = document.querySelector(".loader-container");
    
        // Store the initial position
        container.style.scale = "0"
        loader.style.display = "block";
    
        // Consider other ways to initiate a new quiz
        setTimeout(() => {
            container.style.scale = "1"
            loader.style.display = "none";

            startQuiz();
        }, 1100);
    }
    
}
