
const headerCityButton = document.querySelector('.header__city-button');
let hash = location.hash.substring(1);

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


function ESCclose(evt) {
    if (evt.keyCode == 27) 
        cartModalClose();
  }


//Запрос базы данных
const getData = async () => {
    const data = await fetch('db.json'); // путь к данным //await - блокирует выполнение далее до возврата данных асинхронной функцией?

    if (data.ok) {
        return data.json()
    }
    else{
        throw new Error(`Данные не были получены, ошибка ${data.status} ${data.statusText}`)
    }
};
const getGoods = (callback, value) =>{   
    getData()
        .then(data => {    
            if (value){
                callback(data.filter(item => item.category === value))
            }
            else{
                callback(data);
            }
        })
        .catch(err =>{
            console.error(err);
        });
};

subheaderCart.addEventListener('click', cartModalOpen);

cartOverlay.addEventListener('click', event =>{
    const target = event.target;

    //Закрытие при нажатии мимо
    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')){
        cartModalClose();
    }
});

//Изменение названия категории
let navigationLinks = document.querySelectorAll('.navigation__link');
let goodsTitle = document.querySelector('.goods__title');

goodsTitle.textContent = localStorage.getItem('category');

navigationLinks.forEach((item) => {
    item.addEventListener('click', () => {
        goodsTitle.textContent = item.textContent;
        localStorage.setItem('category', goodsTitle.textContent);
    });
});
//Вывод товаров на страницу
try {

    const goodList = document.querySelector('.goods__list');

    if (!goodList ){
        throw 'This is not a goods page!'
    }

    //Формирует карточки товаров
    const createCard = ({id,preview,cost,brand,name,sizes}) => {
        const li = document.createElement('li');
        li.classList.add('goods__item');
        li.innerHTML = `
            <article class="good">
                <a class="good__link-img" href="card-good.html#${id}">
                    <img class="good__img" src="goods-image/${preview}" alt="">
                </a>
                <div class="good__description">
                    <p class="good__price">${cost} &#8381;</p>
                    <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                    ${sizes ? 
                        `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` 
                        :
                          ''}
                    <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                </div>
            </article>
        `;
        return li;
    };

    //Рендерит карточки, получает данные с сервера
    const renderGoodsList = data => {
        goodList.textContent = ''; //Очищение
        data.forEach(item => {
            const card = createCard(item);
            goodList.append(card);
        })
    };

    window.addEventListener('hashchange', () =>{
        hash = location.hash.substring(1);
        getGoods(renderGoodsList, hash)
    })

    getGoods(renderGoodsList, hash)
} catch(err){
    console.warn(err)
}
