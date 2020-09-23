export default class UserInfo {
  constructor({selectorName, selectorDescription}, selectorAvatar) {
    this._elementName = document.querySelector(`.${selectorName}`);
    this._elementDescription = document.querySelector(`.${selectorDescription}`);
    this._elementAvatar =  document.querySelector(`.${selectorAvatar}`);
  }

  getUserInfo() {
    return {
      name: this._elementName.textContent,
      description: this._elementDescription.textContent
    }
  }

  setUserInfo({name, description}) {
    this._elementName.textContent = name;
    this._elementDescription.textContent = description;
  }

  setAvatar(avatar){
    this._elementAvatar.setAttribute('src', avatar);
  }
}
