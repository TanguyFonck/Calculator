const displayResult = document.querySelector('.result')
const buttons = document.querySelector('.btnContainer')
const userInput = document.querySelector('.input')
const calculator = document.querySelector('.calculator')
let isEqualsPressed = false;
let checkForDecimal = "";
let equation = 0;
// prutsen
buttons.addEventListener('click', (event) => {

    if(!event.target.closest('button')) return;

    const key = event.target;
    const keyValue = key.textContent;
    let inputDisplay = userInput.textContent;
    const { type } = key.dataset;
    const { previousKeyType } = calculator.dataset;
    // 
    if (type === 'number' && !isEqualsPressed) {
            if (inputDisplay === '0') {
                userInput.textContent = (previousKeyType === 'operator') ? inputDisplay + keyValue : keyValue;
                equation = (previousKeyType === 'operator') ? equation + key.value : key.value;
                checkForDecimal = checkForDecimal + keyValue;

            } else {
            // nummeers te groot anders als te groot dan nummer vervangen door exponentieel ( te veel cijfers na de komma)
                if (checkForDecimal.length >= 17) {
                    let replaceNumber = checkForDecimal;
                    checkForDecimal = Number(checkForDecimal).toExponential(2);
                    userInput.textContent = inputDisplay.replace(replaceNumber, checkForDecimal);
                } else {
                    userInput.textContent = userInput.textContent.includes('N')? 'NaN' : userInput.textContent.includes('I')? 'Infinity' : inputDisplay + keyValue;
                    equation = equation + key.value;
                    checkForDecimal = checkForDecimal + keyValue;
                }
            }
    }

    if (type === "operator" && previousKeyType !== 'operator' && !isEqualsPressed && !inputDisplay.includes('Infinity')) {
        checkForDecimal = '';
        userInput.textContent = inputDisplay + ' ' + keyValue + ' ';
        equation = equation + ' ' + key.value + ' ';
    }

    if (type === "decimal" && (previousKeyType === 'number' || inputDisplay === '0')
        && !isEqualsPressed && !inputDisplay.includes('Infinity')) {
        if(!checkForDecimal.includes(',')) {
            userInput.textContent = inputDisplay + keyValue;
            equation = equation + key.value;
            checkForDecimal = checkForDecimal + keyValue;
        }
    }

    if ((type === 'delete' || type === 'reset') && inputDisplay !== '0') {

        if(type === 'delete' && !isEqualsPressed) {

            userInput.textContent = inputDisplay.substring(0,inputDisplay.length-1);
            equation = equation.substring(0,equation.length-1)
            checkForDecimal = checkForDecimal.substring(0,checkForDecimal.length-1)

        } else {

            inputDisplay = '0';
            userInput.textContent = inputDisplay;
            displayResult.innerHTML = ' ';
            isEqualsPressed = false;
            equation = '';
            checkForDecimal = '';

        }
    }

    if (type === 'equal') {

        isEqualsPressed = true;
        const finalResult = handleEquation(equation);

        if (finalResult || finalResult === 0) {

            displayResult.textContent = (!Number.isInteger(finalResult)) ? finalResult.toFixed(2): (finalResult.toString().length >=16)? finalResult.toExponential(2) : finalResult;

            
        } else {
            displayResult.textContent = 'ERROR';
        }
    }
          calculator.dataset.previousKeyType = type;
})


//  operator zodat je kan kiezen of er moet plus of min etc gedaan worden
function calculate(firstNumber, operator, secondNumber) {
    firstNumber = Number(firstNumber);
    secondNumber = Number(secondNumber);
    if (operator === 'minus' || operator === '-' ) {
        return firstNumber - secondNumber;
    }
    if ( operator === 'plus' || operator === '+') {
        return firstNumber + secondNumber;
    }
    if (operator === 'multiply' || operator === 'x') {
      return firstNumber * secondNumber;
    }
    if (operator === 'divide' || operator === '/') {
        return firstNumber / secondNumber;
    }
    if (operator === 'remainder' || operator === '%') {
        return firstNumber % secondNumber;
    }
    
};


function handleEquation(equation) {

    equation = equation.split(" ");
    const operators = ['/','x','%', '+', '-'];
    let firstNumber;
    let secondNumber;
    let operator;
    let operatorIndex;
    let result;

    for(var i = 0; i < operators.length; i++) {
        while(equation.includes(operators[i])) {

            operatorIndex = equation.findIndex(item => item === operators[i]);
            firstNumber = equation[operatorIndex-1];
            operator = equation[operatorIndex];
            secondNumber = equation[operatorIndex+1];
            result = calculate(firstNumber, operator, secondNumber) 
            // volgorde?
            equation.splice(operatorIndex -1,3,result);
        }
    }
    console.log(equation)
    console.log(operator)
    return result;
}

// Create the functions that populate the display when you click the number buttons. You should be storing the ‘display value’ in a variable somewhere for use in the next step.
// stap 1, addeventlistener, stap 2, bij btn push display veranderen, stap 3 display value opslaan
