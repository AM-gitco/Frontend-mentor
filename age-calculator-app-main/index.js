let inputs = document.querySelectorAll("input");
let submit = document.querySelector(".btn-submit");
let day = document.getElementById("day");
let month = document.getElementById("month");
let year = document.getElementById("year");

// Label elements for each input 
let inputsLabels = {
    "day": document.querySelector(".label-day"),
    "month": document.querySelector(".label-month"),
    "year": document.querySelector(".label-year")
}

// Error elements for each input 
let errorElements = {
    "day": document.querySelector(".error-day"),
    "month": document.querySelector(".error-month"),
    "year": document.querySelector(".error-year")
}

// Validation functions for each input
let validators = {
    "day": validDay,
    "month": validMonth,
    "year": validYear
}

submit.addEventListener("click", (event) => {
    event.preventDefault();

    // Clears any existing error messages
    clearErrorMsg();

    let isValid = true;

    // If the input field is empty, shows an error message
    inputs.forEach(input => {
        if(input.value === "") {
            showErrorMsg(input, "This field is required");
            isValid= false;
        }
    });

    // Selects the validation function based on the input id and runs it
    if(isValid) {
        inputs.forEach(input => {
            let validationFunction = validators[input.id];
            if(validationFunction && !validationFunction(input)) {
                isValid = false;
            }
        });
    }

    // If the validation in previous steps was successful, calculates the user's age
    if(isValid) {
        let bDay = parseInput(day);
        let bMonth = parseInput(month);
        let bYear = parseInput(year);
    
        checkAge(bDay, bMonth, bYear);
    }
})

// Prevents non-digit characters from being entered
inputs.forEach(input => input.addEventListener("keydown", (event) => {
    let key = event.key;
    if(key.length === 1 && !key.match(/[0-9]/)) {
        event.preventDefault();
    }
}))

// Clears the error messages and style when user starts typing in the input field
inputs.forEach(input => input.addEventListener("input", () => {
    if(input.value !== "") {
        clearSingleErrorMsg(input);
    }
}))

// Converts the input value into an integer
function parseInput(input) {
    return parseInt(input.value, 10);
}

// Determines the number of days in February by checking if the given year is a leap year
function daysInFebruary(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;  
}

// Calculates the number of days in the given month
function getMonthDays(month, year) {
    let numberOfDays = 0

    if (month === 2) {
        numberOfDays = daysInFebruary(year);
    } else if (month === 4 || month === 6 || month === 9 || month === 11) {
        numberOfDays = 30;
    } else {
        numberOfDays = 31;
    }
     
    return numberOfDays
}

// Validates if the day number is between 1 and the number of days in the given month 
function validDay(input) {
    let day = parseInput(input);
    let monthValue = parseInput(month);
    let yearValue = parseInput(year);

    if(day < 1 || day > getMonthDays(monthValue, yearValue)) {
        showErrorMsg(input, "Must be a valid day");
        return false;
    } 
    return true;
}

// Validates if the month number is between 1 and 12
function validMonth(input) {
    let month = parseInput(input);

    if(month < 1 || month > 12) {
        showErrorMsg(input, "Must be a valid month");
        return false;
    } 
    return true;
}

// Validates if the year is in the past, has exactly 4 digits, and is later than 1900
function validYear(input) {
    let year = parseInput(input);
    let currentYear = new Date().getFullYear();

    if(year > currentYear) {
        showErrorMsg(input, "Must be in the past");
        return false;
    } else if(input.value.length !== 4) {
        showErrorMsg(input, "Must be 4 digits");
        return false;
    } else if(year < 1900) {
        showErrorMsg(input, "Must be after 1900");
        return false;
    }
    return true;
}

// Displays an error message and applies error styles
function showErrorMsg(input, message) {
    let inputId = input.id;
    let errorElement = errorElements[inputId];

    // Applies error styles to all inputs and their associated labels
    inputs.forEach(input => {
        input.classList.add("error-input");
        inputsLabels[input.id].classList.add("error-label");
    })
    
    // Displays the error message only for the specific input
    errorElement.innerText = message;
    errorElement.style.display = "inline-block";
}

// Clears the error message and removes error styles from the given input
function clearSingleErrorMsg(input) {
    input.classList.remove("error-input");
    let label = inputsLabels[input.id];
    label.classList.remove("error-label");
    let error = errorElements[input.id];
    error.style.display = "none";
}

// Clears all error messages and removes error styles from each input
function clearErrorMsg() {

    for(let input of inputs) {
        input.classList.remove("error-input");
    }

    for(let labelElement of Object.values(inputsLabels)) {
        labelElement.classList.remove("error-label");
    }

    for(let errorElement of Object.values(errorElements)) {
        errorElement.innerText = "";
        errorElement.style.display = "none";
    }
}

// Animates age numbers to their final number when the form is submitted
function animateNumber(span, endValue) {
    let currentValue = 0; 
    let increment = 1 
    let interval = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= endValue) {
            currentValue = endValue;
            clearInterval(interval);
        }
        
        span.innerText = currentValue;
    }, 40); 
}

// Updates the span's value and updates the word to its singular or plural form accordingly
function updateSpan(selector, value, singular, plural) {
    let span = document.querySelector(selector);
    let spanText = document.querySelector(`${selector}-text`);

    animateNumber(span, value);
    spanText.innerText = value === 1 ? `${singular}` : `${plural}`
}

// Calculates the difference in years, months, and days from the given birthdate to the current date and displays them in appropriate spans
function checkAge(bDay, bMonth, bYear) {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1;
    let currentDay = currentDate.getDate();

    //Years
    let years = currentYear - bYear;
    // Decrease a year if the current month is less than the birth month
    // Or if the current month is equal to the birth month and current day is less than the birth day, decrease a year
    if(currentMonth < bMonth || (currentMonth === bMonth && currentDay < bDay)) {
        years--;
    }
 
    // Months 
    let months = currentMonth - bMonth;

    if(currentDay < bDay) {
        months--;
    }
    // If months are negative, add 12
    if(months < 0) {
        months+= 12;
    }

    //Days 
    let days = currentDay - bDay;
    // If days are negative, find the number of days in the previous month and add to the negative days
    if(days < 0) {
        let daysInPreviousMonth = getMonthDays(currentMonth - 1 === 0 ? 12 : currentMonth - 1, currentYear)
        days += daysInPreviousMonth;
    }

    // Updates the span's value
    updateSpan(".years", years, " year", " years");
    updateSpan(".months", months, " month", " months");
    updateSpan(".days", days, " day", " days");
}

