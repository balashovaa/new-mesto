export default class Card {
  constructor(item) {
    const name = item.name;
    const link = item.link;
    const owner = item.owner;
    const elementTemplate = document.querySelector(Card._selectorTemplateElement);
    const newElement = elementTemplate.cloneNode(true);
    const elementPhoto = newElement.querySelector('.element__photo');


    newElement.classList.remove('element_template');
    elementPhoto.setAttribute('src', link);
    elementPhoto.setAttribute('alt', name);
    newElement.querySelector('.element__title').textContent = name;
    this._setEventListeners(elementPhoto, name, link);
    this._addLikeToElement(newElement, item);

    if (owner._id === Card._userId) {
      this._addDeleteToElement(newElement, item);
    }

    this._element = newElement;
  }

  static setPopupConfirmDelete(popupConfirmDelete) {
    Card._popupConfirmDelete = popupConfirmDelete;
  }

  static onConfirmDelete(formData, onSuccess, onError) {
    Card._api.removeCard(Card._itemToDelete._id, onRemoveCardSuccess, onError);

    function onRemoveCardSuccess() {
      Card._cardToDelete.remove();
      onSuccess();
    }
  }

  static setApi(api) {
    Card._api = api;
  }

  static setSelectorTemplateElement(selectorTemplateElement) {
    Card._selectorTemplateElement = selectorTemplateElement;
  }

  static setHandleCardClick(handleCardClick) {
    Card._handleCardClick = handleCardClick;
  }

  static setUserId(id) {
    Card._userId = id;
  }

  getElement() {
    return this._element;
  }

  _setEventListeners(elementPhoto, name, link){
    elementPhoto.addEventListener('click', () => {
      Card._handleCardClick(name, link);
    });
  }

  _addLikeToElement(newElement, item) {
    const like = newElement.querySelector('.element__like');
    const likesNumberOfNewElement = newElement.querySelector('.element__likes-number');


    fill(item.likes);
    like.addEventListener('click', handleLikeClick);


    function fill(likes) {
      let isILiked = false;


      for (let like of likes) {
        if (Card._userId === like._id) {
          isILiked = true;
          break;
        }
      }

      if (isILiked) {
        like.classList.add('element__like_status_added');
      } else {
        like.classList.remove('element__like_status_added');
      }

      likesNumberOfNewElement.textContent = likes.length;
    }

    function handleLikeClick() {
      if (like.classList.contains('element__like_status_request-send') === false) {
        like.classList.add('element__like_status_request-send');

        if (like.classList.contains('element__like_status_added')) {
          removingLike();
        } else {
          likeSetting();
        }
      }
    }

    function likeSetting() {
      Card._api.likeSetting(item._id, onLikeSettingSuccess, onLikeSettingError, onLikeAlways);

      function onLikeSettingSuccess(item) {
        fill(item.likes);
      }

      function onLikeSettingError(errorMessage) {
        alert(errorMessage);
      }
    }

    function removingLike() {
      Card._api.removingLike(item._id, onRemovingLikeSuccess, onRemovingLikeError, onLikeAlways)

      function onRemovingLikeSuccess(item) {
        fill(item.likes);
      }

      function onRemovingLikeError(errorMessage) {
        alert(errorMessage);
      }
    }

    function onLikeAlways() {
      like.classList.remove('element__like_status_request-send');
    }
  }

  _addDeleteToElement(newElement, item) {
    const deleteButton = newElement.querySelector('.element__delete-button');


    function handleDeleteButtonClick() {
      Card._itemToDelete = item;
      Card._cardToDelete = newElement;
      Card._popupConfirmDelete.open();
    }

    deleteButton.addEventListener('click', handleDeleteButtonClick);
    deleteButton.classList.add('element__delete-button_deletable');
  }
}
