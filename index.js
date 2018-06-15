/* global cuid */
'use strict';

const STORE = {
  items: [
    {id: cuid(), name: 'Praisin Bran', checked: false, editing: false},
    {id: cuid(), name: 'milk', checked: true, editing: false},
    {id: cuid(), name: 'bread', checked: false, editing: false}
  ],
  filter: '',
  hideChecked: false
};


////Rendering and list filtering

function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  var filterList = filterItemsArrayByTerm(shoppingList, STORE.filter);
  filterList = filterItemsArrayByChecked(filterList);

  const items = filterList.map((item) => generateItemElement(item));
  return items.join('');
}

function filterItemsArrayByTerm(items, filter){
  if(filter){
    return items.filter(item => item.name.indexOf(filter) !== -1);
  }else{
    return items;
  }
}

function filterItemsArrayByChecked(items){
  if(STORE.hideChecked){
    return items.filter(item => !item.checked);
  }else{
    return items;
  }
}


function generateItemElement(item) {
  
  return `
    <li class='js-item-index-element' data-item-index="${item.id}">
      ${item.editing ? generateItemEditFieldString(item) : generateItemSpanString(item)}
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

function generateItemEditFieldString(item){
  return `<form class="js-item-name-edit-form">
            <input type="text" name="item-name-edit-entry" class="js-item-name-edit-entry" placeholder="${item.name}">
            <button type="submit">Confirm name</button>
          </form>`;
}

function generateItemSpanString(item){
  return `<span class="shopping-item js-shopping-item ${item.checked ?
                   'shopping-item__checked' : ''}">${item.name}</span>`;
}

function setStoreFilter(filter){
  STORE.filter = filter;
}

function setStoreHideChecked(val){
  STORE.hideChecked = val;
}


////Single list item manipulation

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({id: cuid(), name: itemName, checked: false});
}

function getItemIndexFromElement(item) {
  return $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
}

function toggleCheckedForListItem(itemId) {
  console.log('Toggling checked property for item at index ' + itemId);
  const item = getStoreItemById(itemId);
  console.log('Item found for checked: ' + item);
  item.checked = !item.checked;
}

function toggleEditingForListItem(itemId){
  const item = getStoreItemById(itemId);
  item.editing = !item.editing;
}

function setItemName(item, newName){
  item.name = newName;
}

function getStoreItemById(itemId){
  return STORE.items.find(item => item.id === itemId);
}

function deleteStoreItemById(itemId){
  STORE.items = STORE.items.filter(item => item.id !== itemId);
}



////Event handlers

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

function handleFilterItems(){
  $('#js-shopping-list-add-form').on('keyup', '.js-shopping-list-filter', function(e){
    const filter = $('.js-shopping-list-filter').val();
    setStoreFilter(filter);
    renderShoppingList();
  });
}

function handleHideCheckedClicked(){
  $('#js-shopping-list-add-form').on('click', '.js-hide-checked', function(e){
    const isChecked = $('.js-hide-checked').is(':checked');
    setStoreHideChecked(isChecked);
    renderShoppingList();
  });
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemId = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemId);
    renderShoppingList();
  });
}

function handleEditItemClicked(){
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    console.log('`handleEditItemNameClicked` ran');
    const itemId = getItemIndexFromElement(event.currentTarget);
    toggleEditingForListItem(itemId);
    renderShoppingList();
  });
}

function handleConfirmEditItemNameClicked(){
  $('.js-shopping-list').on('submit', '.js-item-name-edit-form', function(event) {
    event.preventDefault();
    console.log('`handleConfirmEditItemClicked` ran');

    const updatedItemName = $('.js-item-name-edit-entry').val();
    const itemId= getItemIndexFromElement(event.currentTarget);
    const item = getStoreItemById(itemId);

    toggleEditingForListItem(itemId);
    setItemName(item, updatedItemName);
    renderShoppingList();
  });
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.shopping-item-delete', function(e){
    const itemId = getItemIndexFromElement(this);
    deleteStoreItemById(itemId);
    renderShoppingList();
  });
}





// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleFilterItems();
  handleHideCheckedClicked();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleEditItemClicked();
  handleDeleteItemClicked();
  handleConfirmEditItemNameClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);