import ValidateEvent from "./ValidateEvent.js";

export default class FormValidator {
  constructor(config, formElement) {
    this._config = config;
    this._formElement = formElement;
    this._inputList = Array.from(this._formElement.querySelectorAll(this._config.inputSelector));
    this._buttonElement = this._formElement.querySelector(this._config.submitButtonSelector);
  }

  enableValidation() {
    this._formElement.addEventListener('submit', (event) => {
      event.preventDefault();
    });

    this._formElement.addEventListener(ValidateEvent.name, () => {
      this._toggleButton();
    });

    this._setEventListeners();
  }

  _setEventListeners() {

    this._toggleButton();

    this._inputList.forEach((formInput) => {
      formInput.addEventListener('input', () => {
        this._checkValid(formInput);

        this._toggleButton();
      });
    });
  }

  _toggleButton() {
    if (this._isInvalidInput()) {
      this._buttonElement.classList.add(this._config.inactiveButtonClass);
      this._buttonElement.setAttribute('disabled', 'disabled');
    } else {
      this._buttonElement.classList.remove(this._config.inactiveButtonClass);
      this._buttonElement.removeAttribute('disabled', 'disabled');
    }
  }

  _checkValid(formInput) {
    if (formInput.validity.valid) {
      this._hideInputError(formInput);
    } else {
      this._showInputError(formInput, formInput.validationMessage);
    }
  }

  _showInputError(formInput, errorMessage) {
    const formError = this._formElement.querySelector(`#${formInput.id}-error`);

    formInput.classList.add(this._config.inputErrorClass);
    formError.textContent = errorMessage;
    formError.classList.add(this._config.errorClass);
  }

  _hideInputError(formInput) {
    const formError = this._formElement.querySelector(`#${formInput.id}-error`);

    formInput.classList.remove(this._config.inputErrorClass);
    formError.textContent = '';
    formError.classList.remove(this._config.errorClass);
  }

  _isInvalidInput() {
    return this._inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  }
}
