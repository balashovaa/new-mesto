import Popup from './Popup.js';

export default class PopupWithImage extends Popup {
  constructor(selector) {
    super(selector);

    this._popupImage = this._popupElement.querySelector('.popup__image');
    this._popupImageDescription = this._popupElement.querySelector('.popup__image-description');
  }

  open(name, link) {
    this._popupImage.setAttribute('src', link);
    this._popupImage.setAttribute('alt', name);
    this._popupImageDescription.textContent = name;


    super.open();
  }
}
