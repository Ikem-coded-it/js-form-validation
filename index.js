function validate() {
    const form = document.getElementsByTagName('form')[0]
    const email = document.getElementsByClassName('email-container')[0];
    const country = document.getElementsByClassName('country-container')[0];
    const zip = document.getElementsByClassName('zip-container')[0];
    const password = document.getElementsByClassName('password-container')[0];
    const confirm = document.getElementsByClassName('confirm-password-container')[0];

    const fields = [email, country, zip, password, confirm];
    fields.forEach(field => {
        field.children[1].addEventListener('input', () => {
            if (field.className == 'password-container') validatePassword(field)
            if (field.className == 'country-container') validateCountry(field)

            if (!field.children[1].validity.valid) {
                showError(field.children[1], field.children[2])
            } else {
                field.children[2].textContent = '';

                if (field.className == 'email-container') validateEmail(field)
                if (field.className == 'confirm-password-container') {
                    confirmPassword(field.children[2])
                    return
                }
            }
        })
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const resultDisplay = document.getElementById('result')
        const errorFields = document.getElementsByTagName('span');
        const inputFields = document.getElementsByTagName('input');
        const errorFieldsArr = Array.from(errorFields);
        const inputFieldsArr = Array.from(inputFields);
        let isError = []
        let isInputEmpty = [] 

        errorFieldsArr.forEach(field => {
            if (field.innerText !== '') isError.push(true)
        })
        inputFieldsArr.forEach(input => {
            if (input.value == '') isInputEmpty.push(true)
        })


        if (isError.length > 0 || isInputEmpty.length > 0) {
            resultDisplay.innerText = "I ain't submitting till you enter correct data";
        } else {
            resultDisplay.innerText = "Congrats! form submitted, you get a high five";
            inputFieldsArr.forEach(input => input.value = '')
            errorFieldsArr.forEach(error => error.innerText = '')
        }
    })
 
    return
}

function showError(inputField, errorField) {
    if (inputField.validity.typeMismatch) {
        errorField.textContent = `Please enter a valid ${inputField.type}`;
    } else if (inputField.validity.tooShort) {
        errorField.textContent = `Must be up to ${inputField.minLength} characters`
    } else if (inputField.validity.tooLong) {
        errorField.textContent = `Must be less than ${inputField.maxLength} characters`
    } else if (inputField.validity.valueMissing) {
        errorField.textContent = `This field is required`;
    } else if (inputField.validity.patternMismatch) {
        errorField.textContent = `Please enter a valid ${inputField.type}`;
    } else if (inputField.validity.rangeUnderflow) {
        errorField.textContent = `Please enter a valid Nigerian zip code between ${inputField.min} and ${inputField.max}`;
    } else if (inputField.validity.rangeOverflow) {
        errorField.textContent = `Please enter a valid Nigerian zip code between ${inputField.min} and ${inputField.max}`;
    } else {
        errorField.textContent = '';
    }

    return
}

function confirmPassword(errorField) {
    const passwordField = document.querySelector('#password');
    const confirmPasswordField = document.querySelector('#confirm');

    if (confirmPasswordField.value != passwordField.value) {
        errorField.textContent = 'Must match password';
    }
}

function validatePassword(field) {
    const password = field.children[1].value;
    const lowerCaseLetters = /[a-z]/;
    const upperCaseLetters = /[A-Z]/;
    const numbers = /[0-9]/;
    const symbols = /[!@#$%^&*_=+-]/;

    const errorFieldContainer = field.children[3]

    if (lowerCaseLetters.test(password) == true) {
        const errorField = errorFieldContainer.children[1]
        errorField.className = 'valid'
    } else {
        const errorField = errorFieldContainer.children[1]
        errorField.className = 'invalid'
    }
    if (upperCaseLetters.test(password) == true) {
        const errorField = errorFieldContainer.children[0]
        errorField.className = 'valid'
    } else {
        const errorField = errorFieldContainer.children[0]
        errorField.className = 'invalid'
    }
    if (numbers.test(password) == true) {
        const errorField = errorFieldContainer.children[2]
        errorField.className = 'valid'
    } else {
        const errorField = errorFieldContainer.children[2]
        errorField.className = 'invalid'
    }
    if (symbols.test(password) == true) {
        const errorField = errorFieldContainer.children[3]
        errorField.className = 'valid'
    } else {
        const errorField = errorFieldContainer.children[3]
        errorField.className = 'invalid'
    }
}

async function validateCountry(field) {
    const countries = await fetchCountries()
    const isValid = countries.includes(field.children[1].value)
    if (isValid == false) {
        field.children[2].textContent = 'Please enter a valid country'
    }
    return
}

function validateEmail(field) {
    const emailRegex = /.@(gmail|yahoo|outlook)\.com$/;
    const isMatch = emailRegex.test(field.children[1].value)
    if (isMatch == false) {
        field.children[2].textContent = "A valid email address must contain an '@' and end with '.com'";
    }
}

function togglePasswordValidations() {
    const validations = document.getElementsByClassName('password-error-container')[0]
    const passwordField = document.getElementById('password')
    passwordField.addEventListener('focusin', () => {
        validations.classList.add('visible')
    })
    passwordField.addEventListener('focusout', () => {
        validations.classList.remove('visible')
    })
}

async function fetchCountries() {
    const res = await fetch('https://restcountries.com/v3.1/all')
    const jsonData = await res.json()
    return jsonData.map(country => {return country.name.common})
}

async function populateCountryData() {
    const countryList = document.getElementById('country-list');
    const countries = await fetchCountries();
    const alphabeticalOrderCountries = countries.sort()
    alphabeticalOrderCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        countryList.appendChild(option);
        return;
    })
}

validate()
populateCountryData()
togglePasswordValidations()