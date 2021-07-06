
const headerCityButton = document.querySelector('.header__city-button');

//сохранение города при обновлении страницы
headerCityButton.textContent = localStorage.getItem('lamoda-location') || 'Ваш город?'

//Функция задачи города
headerCityButton.addEventListener('click', () => {
    const city = prompt('Укажите ваш город');
    headerCityButton.textContent = city;     //Измненеие города на сайте
    localStorage.setItem('lamoda-location', city)
});


//Блокировка скролла
const disableScroll = () =>{
    const widthScroll = window.innerWidth - document.body.offsetWidth; //Определение ширины скролла
    
    document.body.dbScrollY = window.scrollY;
    
    document.body.style.cssText = `
        position: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow:hidden;
        padding-right: ${widthScroll}px;
    `;
};

//Разблокировка
const enableScroll = () =>{
    document.body.style.cssText ='';
    window.scroll({
        top: document.body.dbScrollY
    })
};



//Модальное окно

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');


//Открытие
const cartModalOpen = () =>{
    cartOverlay.classList.add('cart-overlay-open');
    disableScroll();
}

//Закрытие
const cartModalClose = () =>{
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
}

subheaderCart.addEventListener('click', cartModalOpen);

cartOverlay.addEventListener('click', event =>{
    const target = event.target;

    //Закрытие при нажатии мимо
    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')){
        cartModalClose();
    }
});
function ESCclose(evt) {
    if (evt.keyCode == 27) 
        cartModalClose();
  }
