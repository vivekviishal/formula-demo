function detectCurlyBraces(event) {
    const inputValue = event.target;
    const formula = inputValue.value;
    const cursorPosition = inputValue.selectionStart;

    if (formula[cursorPosition - 1] === '{') {
        inputValue.value = formula.slice(0, cursorPosition) + '}' + formula.slice(cursorPosition);
        inputValue.setSelectionRange(cursorPosition, cursorPosition);
    }
}

function validateFormula() {
    const formula = document.getElementById('formula').value;
    const variablesDiv = document.getElementById('variables');
    variablesDiv.innerHTML = ''; // Clear previous inputs
    const inputValuesDiv = document.getElementById('input-values');
    inputValuesDiv.style.display = 'block'; // Show the input-values div

    // Replace {x} with x to use in mathjs
    const parsedFormula = formula.replace(/{([^}]+)}/g, '$1');

    try {
        // Parse the formula to extract variables
        const parsed = math.parse(parsedFormula);
        const variables = [];
        parsed.traverse(function (node, path, parent) {
            if (node.type === 'SymbolNode') {
                variables.push(node.name);
            }
        });

        const uniqueVariables = [...new Set(variables)];

        // Create input fields for each unique variable
        uniqueVariables.forEach(variable => {
            const inputDiv = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = variable + ": ";
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = variable;
            input.id = variable;
            inputDiv.appendChild(label);
            inputDiv.appendChild(input);
            variablesDiv.appendChild(inputDiv);
        });

    } catch (error) {
        // Invalid formula, do nothing
        alert('Invalid formula');
    }
}

function submitFormula() {
    const formula = document.getElementById('formula').value;
    const parsedFormula = formula.replace(/{([^}]+)}/g, '$1');
    const variables = document.querySelectorAll('#variables input');
    const values = {};
    variables.forEach(input => {
        values[input.id] = parseFloat(input.value);
    });

    try {
        const result = math.evaluate(parsedFormula, values);
        document.getElementById('result').style.display = 'block';
        document.getElementById('output').textContent = `Result: ${result}`;
        document.getElementById('save').classList.remove('hidden');
    } catch (error) {
        alert('Evaluation failed');
    }
}
