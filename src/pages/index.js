import './index.css';
import Api from "../components/Api.js";
import Card from '../components/Card.js';
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from '../components/PopupWithForm.js';
import PopupWithImage from '../components/PopupWithImage.js';
import Section from "../components/Section.js";
import UserInfo from "../components/UserInfo.js";


// Блок декларирования переменных
const api = new Api('f9d0b5b2-0cc9-4d30-9246-1c45800f0e24', 'https://mesto.nomoreparties.co/v1/cohort-14');
const popupConfirmDelete = new PopupWithForm('popup__confirm-delete', Card.onConfirmDelete, 'Удаление...');
const userInfo = new UserInfo({selectorName: 'profile__name', selectorDescription: 'profile__description'}, 'profile__photo');
const formItemName = document.querySelector('.form__item_name');
const formItemDescription = document.querySelector('.form__item_description');
const profileButtonEdit = document.querySelector('.profile__button-edit');
const popupAvatar = new PopupWithForm('popup__avatar', onUpdateAvatar, 'Сохранение...');
const popupEditAvatarButton = document.querySelector('.profile__avatar-edit');
const popupProfile = new PopupWithForm('popup__profile', onProfileSubmit, 'Сохранение...');
const popupWithImage = new PopupWithImage('popup__photo-card');
const config = {
  inputSelector: '.form__item',
  submitButtonSelector: '.form__button-save',
  inactiveButtonClass: 'form__button-save_disabled',
  inputErrorClass: 'form__item_type_error',
  errorClass: 'form__item-error'
}
const saveProfileFormValidator = new FormValidator(config, document.querySelector('.form__save-profile'));
const savePhotoFormValidator = new FormValidator(config, document.querySelector('.form__save_photo'));
const saveAvatarPhotoFormValidator = new FormValidator(config, document.querySelector('.form__save-avatar'));


// Блок логики
popupConfirmDelete.setEventListeners();
Card.setPopupConfirmDelete(popupConfirmDelete);
Card.setApi(api);
Card.setSelectorTemplateElement('.element_template');
Card.setHandleCardClick(handleOpenImagePopupClick);
api.loadingUserInformation(onLoadingUserInformationSuccess, onLoadingUserInformationError);
popupAvatar.setEventListeners();
popupProfile.setEventListeners();
popupWithImage.setEventListeners();
profileButtonEdit.addEventListener('click', onClickProfileButtonEdit);
popupEditAvatarButton.addEventListener('click', onClickPopupEditAvatarButton);
savePhotoFormValidator.enableValidation();
saveProfileFormValidator.enableValidation();
saveAvatarPhotoFormValidator.enableValidation();


// Блок обработчиков событий
function onClickPopupEditAvatarButton() {
  popupAvatar.open();
}

function onClickProfileButtonEdit() {
  const data = userInfo.getUserInfo();

  formItemName.value = data.name;
  formItemName.dispatchEvent(new InputEvent('input'));
  formItemDescription.value = data.description;
  formItemDescription.dispatchEvent(new InputEvent('input'));
  popupProfile.open();
}

function onLoadingUserInformationSuccess(user) {
  userInfo.setUserInfo({name: user.name, description: user.about});
  userInfo.setAvatar(user.avatar);
  Card.setUserId(user._id);
  api.getInitialCards(onInitialCardsSuccess, onInitialCardsError);
}

function onProfileSubmit(formData, onSuccess, onError) {
  api.profileEditing({
    name: formData.get('name'),
    about: formData.get('description')
  }, onProfileSubmitSuccess, onError);

  function onProfileSubmitSuccess() {
    userInfo.setUserInfo({name: formData.get('name'), description: formData.get('description')});
    onSuccess();
  }
}

function onUpdateAvatar(formData, onSuccess, onError) {
  api.updatingUserAvatar(formData.get('avatar-link'), onUpdatingUserAvatarSuccess, onError);

  function onUpdatingUserAvatarSuccess() {
    userInfo.setAvatar(formData.get('avatar-link'));
    onSuccess();
  }
}

function onLoadingUserInformationError(errorMessage) {
  alert(errorMessage);
}

function handleOpenImagePopupClick(name, link) {
  popupWithImage.open(name, link);
}

function renderer(item) {
  const myCard = new Card(item);


  return myCard.getElement();
}

function onInitialCardsSuccess(listOfCard) {
  const section = new Section({items: listOfCard, renderer: renderer}, '.element__cards');
  section.renderItems();

  function onPhotoSubmit(formData, onSuccess, onError) {
    api.addingNewCard({
      name: formData.get('place'),
      link: formData.get('place-link')
    }, onAddingNewCardSuccess, onError);

    function onAddingNewCardSuccess(item) {
      const myCard = new Card(item);


      section.addItem(myCard.getElement());
      onSuccess();
    }
  }

  const popupPhoto = new PopupWithForm('popup__photo', onPhotoSubmit, 'Сохранение...');
  const profileAddPhoto = document.querySelector('.profile__add-photo');
  popupPhoto.setEventListeners();// непонятно зачем делать это здесь. Лучше сделать приватным методом и вызывать в конструкторе Popup
  profileAddPhoto.addEventListener('click', () => {
    popupPhoto.open();
  });
}

function onInitialCardsError(errorMessage) {
  alert(errorMessage);
}
