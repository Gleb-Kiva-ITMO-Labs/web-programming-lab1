const MIN_X = -4;
const MAX_X = 4;
const MIN_Y = -5;
const MAX_Y = 5;
const ALLOWED_RADII = [1, 1.5, 2, 2.5, 3];
const HIT_PHRASES = ['Nice shot!', 'Bullseye!', 'Headshot!', 'Boom!', 'That\'s a hit!'];
const MISS_PHRASES = ['Oops!', 'You missed', 'Close, but no!', 'Not quite!', 'Whoops!'];

const resultsTable = document.getElementById('results-table');

document.getElementById('shooter-form').children.namedItem('y').placeholder = `Integer between ${MIN_Y} and ${MAX_Y}`;

// FORM VALIDATION
function getFormData() {
    const formElement = document.getElementById('shooter-form');
    return new FormData(formElement);
}

function parseFormData() {
    const formData = getFormData();
    const xValue = parseInt(formData.get('x'));
    const yValue = parseFloat(formData.get('y'));
    let rValues = [];
    if (formData.get('r-1')) rValues.push(1);
    if (formData.get('r-15')) rValues.push(1.5);
    if (formData.get('r-2')) rValues.push(2);
    if (formData.get('r-25')) rValues.push(2.5);
    if (formData.get('r-3')) rValues.push(3);
    const rValue = rValues[Math.floor(Math.random() * rValues.length)];
    return {
        x: xValue, y: yValue, r: rValue
    }
}


function formUpdated() {
    const formData = parseFormData();
    if (validate(formData)) {
        updateGraph(formData.r, formData.x, formData.y);
    }
}

function validate(formData) {
    let messages = [];
    // TODO разбить на функции
    if (!(!isNaN(formData.x) && (formData.x % 1 === 0 || formData.x === 0) && MIN_X <= formData.x && formData.x <= MAX_X)) messages.push('Invalid X value');
    if (!(!isNaN(formData.y) && formData.y % 1 === 0 && MIN_Y <= formData.y && formData.y <= MAX_Y)) messages.push('Invalid Y value');
    if (!(ALLOWED_RADII.includes(formData.r))) messages.push('Invalid R value');

    updateValidationErrorMessage(buildErrorMessage(messages));
    return messages.length == 0;
}

// SUBMITTING
function formSubmitted(e) {
    e.preventDefault();
    const formData = parseFormData();
    if (validate(formData)) {
        updateGraph(formData.r, formData.x, formData.y);
        sendRequest(formData);
    }
}

function sendRequest(formData) {
    const requestTime = Date.now();
    createRequestBlock(requestTime, formData);

    const params = new URLSearchParams(formData);
    fetch("/fcgi-bin/server.jar?" + params.toString()).then(
        async response => {
            if (!response.ok) {
                fillRequestBlockWithError(requestTime, response.statusText);
                return;
            }
            const result = await response.json();
            fillRequestBlock(requestTime, result);
        }
    ).catch(error => fillRequestBlockWithError(requestTime, `Error during request: ${error.message}`));
}

// UPDATES
function hideNoResultsMessage() {
    resultsTable.children.namedItem('results-table-empty').style.display = 'none';
}

function createRequestBlock(requestTime, data) {
    hideNoResultsMessage();

    var newRowBlock = document.createElement('tbody');
    newRowBlock.id = `request-${requestTime}`;

    var newRequestRow = document.createElement('tr');
    newRequestRow.appendChild(buildTableCell(data.x));
    newRequestRow.appendChild(buildTableCell(data.y));
    newRequestRow.appendChild(buildTableCell(data.r));

    newRowBlock.appendChild(newRequestRow);
    resultsTable.appendChild(newRowBlock);
}

function fillRequestBlock(requestTime, result) {
    var rowBlock = document.getElementById(`request-${requestTime}`);
    var requestRow = rowBlock.getElementsByTagName('tr')[0];
    requestRow.appendChild(buildTableCell(innerText = result ? getHitPhrase() : getMissPhrase()));
    rowBlock.appendChild(buildStatusRow(requestTime));
}

function fillRequestBlockWithError(requestTime, errorMessage) {
    const rowBlock = document.getElementById(`request-${requestTime}`);
    const requestRow = rowBlock.getElementsByTagName('tr')[0];
    if (rowBlock.children[0].children.length > 3) {
        const existingError = rowBlock.children[0].children.item(rowBlock.children[0].children.length - 1).children[0].children[1];
        existingError.innerText = buildErrorMessage([errorMessage, existingError.innerText]);
        return;
    } // какой ужас обещаю так больше не делать
    requestRow.appendChild(buildErrorTableCell(errorMessage));
    rowBlock.appendChild(buildStatusRow(requestTime));
}

function buildStatusRow(requestTime) {
    var newStatusRow = document.createElement('tr');
    newStatusRow.classList.add('filled-row');
    var details = `Executed at ${formatTime(requestTime)} in ${(new Date().getTime() - requestTime) / 1000} seconds`;
    newStatusRow.appendChild(buildTableCell(details, 4));
    return newStatusRow;
}

function updateGraph(radius, point_x, point_y) {
    R_coefficient = radius || 1;
    point_coordinates = {x: point_x, y: point_y};
    render();
}

function updateValidationErrorMessage(errorMessage) {
    const errorMessageElement = document.getElementById('input-validation-error-message');
    errorMessageElement.style.display = errorMessage ? 'block' : 'none';
    errorMessageElement.innerText = errorMessage;
}

// OTHER
function buildErrorMessage(messages) {
    return messages.map((msg, i) => i > 0 ? msg[0].toLowerCase() + msg.slice(1) : msg).join(', ');
}

function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function getHitPhrase() {
    return getRandomElement(HIT_PHRASES);
}

function getMissPhrase() {
    return getRandomElement(MISS_PHRASES);
}

function buildTableCell(value, colspan = 1) {
    var cell = document.createElement('td');
    cell.innerText = value;
    cell.colSpan = colspan;
    return cell;
}

function buildErrorTableCell(errorMessage) {
    var errorCell = document.createElement('td');

    var tooltipContainer = document.createElement('div');
    tooltipContainer.classList.add('tooltip-container');

    var errorCellText = document.createElement('span');
    errorCellText.textContent = 'Ошибка';
    tooltipContainer.appendChild(errorCellText);

    var tooltip = document.createElement('div');
    tooltip.innerHTML = errorMessage;
    tooltip.classList.add('tooltip');
    tooltip.classList.add('error-message');
    tooltipContainer.appendChild(tooltip);

    errorCell.appendChild(tooltipContainer);
    return errorCell;
}

function formatTime(milliseconds) {
    const date = new Date(milliseconds);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}