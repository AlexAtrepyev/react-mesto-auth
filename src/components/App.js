import React from 'react';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  
  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getCardList()])
      .then(([user, initialCards]) => {
        setCurrentUser(user);
        setCards(initialCards);
      })
      .catch(err => console.log(err));
  }, []);
  
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };
  
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };
  
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };
  
  function handleCardClick(card) {
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  }
  
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setSelectedCard(null);
  }
  
  function handleUpdateAvatar({ avatar }) {
    api.setUserAvatar({ avatar })
      .then(user => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }
  
  function handleUpdateUser(userData) {
    api.setUserInfo(userData)
      .then(user => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }
  
  function handleAddPlaceSubmit({ title, link }) {
    api.addCard({ title, link })
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }
  
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then(newCard => setCards(state => state.map(c => c._id === card._id ? newCard : c)))
      .catch(err => console.log(err));
  }
  
  function handleCardDelete(card) {
    api.removeCard(card._id)
      .then(res => {
        setCards(cards.filter(function(item) {
          return item._id !== card._id;
        }));
      })
      .catch(err => console.log(err));
  }
  
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <Main
        onEditAvatar={handleEditAvatarClick}
        onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick}
        cards={cards}
        onCardClick={handleCardClick}
        onCardLike={handleCardLike}
        onCardDelete={handleCardDelete}
      />
      <Footer />
      
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />
      <ImagePopup
        card={selectedCard}
        isOpen={isImagePopupOpen}
        onClose={closeAllPopups}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
