export default class Api {
  constructor(token, url) {
    this._token = token;
    this._url = url;
  }

  getInitialCards(onSuccess, onError) {
    this._requestWithoutBodyWithoutAlways('cards', 'GET', onSuccess, onError);
  }

  loadingUserInformation(onSuccess, onError) {
    this._requestWithoutBodyWithoutAlways('users/me', 'GET', onSuccess, onError);
  }

  profileEditing(user, onSuccess, onError) {
    this._requestWithBody('users/me', {
      name: user.name,
      about: user.about
    }, 'PATCH', onSuccess, onError);
  }

  addingNewCard(card, onSuccess, onError) {
    this._requestWithBody('cards', {
      name: card.name,
      link: card.link
    }, 'POST', onSuccess, onError);
  }

  removeCard(cardId, onSuccess, onError) {
    this._requestWithoutBodyWithoutAlways(`cards/${cardId}`, 'DELETE', onSuccess, onError);
  }

  likeSetting(cardId, onSuccess, onError, onAlways) {
    this._requestWithoutBody(`cards/likes/${cardId}`, 'PUT', onSuccess, onError, onAlways);
  }

  removingLike(cardId, onSuccess, onError, onAlways) {
    this._requestWithoutBody(`cards/likes/${cardId}`, 'DELETE', onSuccess, onError, onAlways);
  }

  updatingUserAvatar(avatar, onSuccess, onError) {
    this._requestWithBody('users/me/avatar', {
      avatar: avatar
    }, 'PATCH', onSuccess, onError);
  }

  _requestWithoutBodyWithoutAlways(partOfPath, method, onSuccess, onError) {
    this._requestWithoutBody(partOfPath, method, onSuccess, onError, () => {
    });
  }

  _requestWithoutBody(partOfPath, method, onSuccess, onError, onAlways) {
    this._request(partOfPath, null, method, onSuccess, onError, onAlways);
  }

  _requestWithBody(partOfPath, body, method, onSuccess, onError) {
    this._request(partOfPath, body, method, onSuccess, onError, () => {
    });
  }

  _request(partOfPath, body, method, onSuccess, onError, onAlways) {
    let init = {
      method: method,
      headers: {
        authorization: this._token
      }
    };


    if (body !== null) {
      init.body = JSON.stringify(body);
      init.headers['Content-Type'] = 'application/json';
    }

    fetch(`${this._url}/${partOfPath}`, init)
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        // если ошибка, отклоняем промис
        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .then((data) => {
        onSuccess(data);
      })
      .catch((err) => {
        onError(err);
      })
      .finally(onAlways);
  }
}


