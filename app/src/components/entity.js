import { SVG } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'

export function createEntity(drawPlane) {
    // Create a group to hold the entity
    let entityGroup = drawPlane.group();

    const rowHeight = 40;
    const numberOfEntities = 5;
    const rowWidth = 250;

    const borderRect = entityGroup.rect(rowWidth, rowHeight * numberOfEntities).stroke({ color: 'black', width: '2px' });

    entityGroup.add(borderRect);

    createEntityHeader(entityGroup, rowWidth, rowHeight);

    // Create attribute rectangles
    const firstRow = createEntityRow(entityGroup, rowWidth, rowHeight, 0, 40, true);
    const secondRow = createEntityRow(entityGroup, rowWidth, rowHeight, 0, 80, false);
    const thirdRow = createEntityRow(entityGroup, rowWidth, rowHeight, 0, 120, true);

    createEntityRow(entityGroup, rowWidth, rowHeight, 0, 160);

    // Add everything to the main group
    entityGroup.add(firstRow);
    entityGroup.add(secondRow);
    entityGroup.add(thirdRow);

    // Make the group draggable
    entityGroup.draggable();

    // Add the group to the drawing plane
    entityGroup.addTo(drawPlane);
}

function createEntityHeader(entityGroup, width, height) {
    // Create the header group
    let headerGroup = entityGroup.group();

    // Create the header rectangle
    let header = headerGroup.rect(width, height).fill('blue');

    // Create the foreignObject and add HTML content
    let foreignObject = SVG().foreignObject(width, height);

    // Create a div element to hold HTML content
    let div = document.createElement('div');

    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.height = '100%';
    div.style.width = '100%';
    div.style.background = 'transparent'; // Ensure background is transparent or set a color if needed

    // Create an input element
    let input = document.createElement('input');
    input.type = 'text';

    input.placeholder = 'Add entity name';
    input.style.textAlign = 'center';
    input.style.width = '80%';
    input.style.padding = '5px'; // Add padding if needed
    input.style.boxSizing = 'border-box'; // Ensure padding is included in width
    input.style.pointerEvents = 'none'; // Disable pointer events initially

    attachTextInputEvents(input, div, entityGroup)

    // Construct the header with the input field
    div.appendChild(input);
    foreignObject.add(div);
    headerGroup.add(header);
    headerGroup.add(foreignObject);
    entityGroup.add(headerGroup);
}

function createEntityRow(entityGroup, width, height, deltaX, deltaY, determineColor) {
    let entityRowGroup = entityGroup.group();

    // Create the attribute row rectangle
    const backgroundColor = determineColor === true ? 'lightblue' : 'lightskyblue';
    const entityRowRect = entityRowGroup.rect(width, height).fill(backgroundColor).move(deltaX, deltaY);

    const foreignObject = entityRowGroup.foreignObject(width, height).move(deltaX, deltaY);

    // Create the div container for the entity row
    const divContainer = document.createElement('div');
    divContainer.style.display = 'flex';
    divContainer.style.flexDirection = 'row';
    divContainer.style.height = '100%';
    divContainer.style.width = '100%';
    divContainer.style.background = 'transparent'; // Ensure background is transparent or set a color if needed

    // Create the primary key select input menu
    const keyContainer = createKeyInput();
    divContainer.appendChild(keyContainer);

    // Create the attribute name input menu
    const attrNameInput = createAttrNameInput(entityGroup);
    divContainer.appendChild(attrNameInput);

    // Create the attribute type input menu
    const attrTypeInput = createAttrTypeInput();
    divContainer.appendChild(attrTypeInput);

    foreignObject.add(divContainer);

    entityRowGroup.add(entityRowRect);
    entityRowGroup.add(foreignObject);

    entityGroup.add(entityRowGroup);
        
}

/**
 * Create a select input field for choosing whether an attribute is primary key, foreign key or neither
 * @returns 
 */
function createKeyInput() {
    const keyContainer = document.createElement('div');
    keyContainer.style.display = 'flex';
    keyContainer.style.width = '20%';
    keyContainer.style.height = '100%';
    keyContainer.style.background = 'transparent';

    const keyDropDown = document.createElement('select');
    keyContainer.appendChild(keyDropDown);
    keyDropDown.style.height = '100%';
    keyDropDown.style.width = '100%';
    keyDropDown.style.background = 'none';
    keyDropDown.style.border = 'none';

    const primaryKeyOption = document.createElement('option');
    primaryKeyOption.value = 'PK';
    primaryKeyOption.text = 'PK';

    const foreignKeyOption = document.createElement('option');
    foreignKeyOption.value = 'FK';
    foreignKeyOption.text = 'FK';

    keyDropDown.appendChild(primaryKeyOption);
    keyDropDown.appendChild(foreignKeyOption);

    return keyContainer;

}

function createAttrNameInput(entityGroup) {
    const attrNameContainer = document.createElement('div');
    
    attrNameContainer.style.display = 'flex';
    
    attrNameContainer.style.width = '40%';
    attrNameContainer.style.height = '100%';

    attrNameContainer.style.background = 'transparent';

    const input = document.createElement('input');

    input.type = 'text';

    input.placeholder = 'Attr name';
    input.style.textAlign = 'center';
    input.style.width = '80%';
    input.style.boxSizing = 'border-box'; // Ensure padding is included in width
    input.style.pointerEvents = 'none'; // Disable pointer events initially

    attrNameContainer.appendChild(input);

    attachTextInputEvents(input, attrNameContainer, entityGroup);

    return attrNameContainer;
}

function createAttrTypeInput(entityGroup) {
    const attrTypeContainer = document.createElement('div');
    
    attrTypeContainer.style.display = 'flex';
    
    attrTypeContainer.style.width = '40%';
    attrTypeContainer.style.height = '100%';

    attrTypeContainer.style.background = 'transparent';

    const input = document.createElement('input');

    input.type = 'text';

    input.placeholder = 'Attr type';
    input.style.textAlign = 'center';
    input.style.width = '80%';
    input.style.boxSizing = 'border-box'; // Ensure padding is included in width
    input.style.pointerEvents = 'none'; // Disable pointer events initially

    attrTypeContainer.appendChild(input);

    attachTextInputEvents(input, attrTypeContainer, entityGroup);

    return attrTypeContainer;
}










function attachTextInputEvents(input, targetContainer, group) {
    // Attach events

    // Disable dragging while input is focused
    input.addEventListener('focus', () => {
        group.draggable(false);
    });

    // Re-enable dragging when input loses focus
    input.addEventListener('blur', () => {
        group.draggable();
        input.style.pointerEvents = 'none'; // Disable pointer events after editing
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter')
            input.blur();
    });

    // Enable the input field on double-click
    targetContainer.addEventListener('dblclick', () => {
        input.style.pointerEvents = 'auto'; // Enable pointer events to allow editing
        input.focus(); // Focus the input field to start editing
    });
}