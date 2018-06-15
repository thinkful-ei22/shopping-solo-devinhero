/* global cuid */
'use strict';

const STORE = {
  items: [
    {id: cuid(), name: 'apples', checked: false},
    {id: cuid(), name: 'oranges', checked: false},
    {id: cuid(), name: 'milk', checked: true},
    {id: cuid(), name: 'bread', checked: false}
  ],
};

function getStoreItemById(itemId){
  return STORE.items.find(item => item.id === itemId);
}

function generateItemElement(item) {
  return `
    <li class='js-item-index-element' data-item-index="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  const filter = $('.js-shopping-list-filter').val();
  const filterList = filterShoppingItemsArray(shoppingList, filter);

  const items = filterList.map((item) => generateItemElement(item));
  return items.join('');
}

function filterShoppingItemsArray(items, filter){
  if(filter){
    return items.filter(item => item.name.indexOf(filter) !== -1);
  }else{
    return items;
  }
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({id: cuid(), name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-add-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemId) {
  console.log('Toggling checked property for item at index ' + itemId);
  const item = getStoreItemById(itemId);
  console.log('Item found for checked: ' + item);
  item.checked = !item.checked;
}

function getItemIndexFromElement(item) {
  return $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemId = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemId);
    renderShoppingList();
  });
}

function handleDeleteItemClicked() {
  $('.shopping-list').on('click', '.shopping-item-delete', function(e){
    const itemId = getItemIndexFromElement(this);
    deleteItemById(itemId);
    renderShoppingList();
  });
}

function handleFilterItems(){
  $('.js-shopping-list-filter').on('keyup',  function(e){
    renderShoppingList();
  });
}

function deleteItemById(itemId){
  STORE.items = STORE.items.filter(item => item.id !== itemId);
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleFilterItems();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);