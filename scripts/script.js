
const headerCityButton = document.querySelector('.header__city-button');
const cartListGoods = document.querySelector('.cart__list-goods');
const cartTotalCost = document.querySelector('.cart__total-cost');
let hash = location.hash.substring(1);

//сохранение города при обновлении страницы
headerCityButton.textContent = localStorage.getItem('lamoda-location') || 'Ваш город?'

//Функция задачи города
headerCityButton.addEventListener('click', () => {
    const city = prompt('Укажите ваш город');
    headerCityButton.textContent = city;     //Измненеие города на сайте
    localStorage.setItem('lamoda-location', city)
});

const getLocalStorage =() => JSON?.parse(localStorage.getItem('cart-lamoda')) || [];

const setLocalStorage = data => localStorage.setItem('cart-lamoda', JSON.stringify(data));//Запись данных

// Товары в корзине
const renderCart = () =>{
    cartListGoods.textContent = '';

    const cartItems = getLocalStorage();

    let totalPrice = 0;

    cartItems.forEach((item,i) =>{
        const tr =document.createElement('tr');
        tr.innerHTML = `
            <td>${i+1}</td>
            <td>${item.brand} ${item.name}</td>
            ${item.color ? `<td>${item.color}</td>` : '<td>-</td>'}
            ${item.size ? `<td>${item.size}</td>` : '<td>-</td>'}
            <td>${item.cost} &#8381;</td>
            <td><button class="btn-delete" data-id="${item.id}">&times;</button></td>
        `;

        totalPrice += item.cost; //Формирование цены
        cartListGoods.append(tr);
    });
    cartTotalCost.textContent = totalPrice + ' ₽';
}

//Удаление из корзины
const deleteItemCard = id =>{
    const cardItem = getLocalStorage();
    const newCartItems = cardItem.filter(item => item.id !==id);
    setLocalStorage(newCartItems);
}
cartListGoods.addEventListener('click', (e) =>{
    if (e.target.matches('.btn-delete')){
        deleteItemCard(e.target.dataset.id);
        renderCart();
    }
})


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
    renderCart()
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
const getGoods = (callback, prop, value) =>{   
    getData()
        .then(data => {    
            if (value){
                callback(data.filter(item => item[prop] === value))
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



//Вывод товаров на страницу
try {

    const goodList = document.querySelector('.goods__list');

    if (!goodList ){
        throw 'This is not a goods page!'
    }

    //Изменение заголовка категории
    const goodsTitle = document.querySelector('.goods__title')

    const changeTitle = () =>{
        goodsTitle.textContent = document.querySelector(`[href*= "#${hash}" ]`).textContent;
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
        getGoods(renderGoodsList, 'category' , hash);     
        changeTitle();
    })

    getGoods(renderGoodsList,'category' , hash)
} catch(err){
    console.warn(err)
}

//Страница товара
try{

    if(!document.querySelector('.card-good')) {
        throw 'This is not a card-good page';
    }
const cardGoodImage =  document.querySelector('.card-good__image');
const cardGoodBrand =  document.querySelector('.card-good__brand');
const cardGoodTitle =  document.querySelector('.card-good__title');
const cardGoodPrice =  document.querySelector('.card-good__price');
const cardGoodColor =  document.querySelector('.card-good__color');
const cardGoodSelectWrapper= document.querySelectorAll('.card-good__select__wrapper')
const cardGoodColorList =  document.querySelector('.card-good__color-list');
const cardGoodSizes =  document.querySelector('.card-good__sizes');
const cardGoodSizesList =  document.querySelector('.card-good__sizes-list');
const cardGoodBuy =  document.querySelector('.card-good__buy');

const generateList = data => data.reduce((html, item, i) => html +
     `<li class = "card-good__select-item" data-id="${i}">${item}</li>`, 
    '');

const renderCardGood = ([{ id ,brand, name, cost, color, sizes, photo}]) =>{

    const data = {brand, name, cost, id};

    cardGoodImage.src = `goods-image/${photo}`;
    cardGoodImage.alt = `${brand} ${name}`;
    cardGoodBrand.textContent = brand;
    cardGoodTitle.textContent = name;
    cardGoodPrice.textContent = `${cost} ₽`;
    if (color){
        cardGoodColor.textContent = color[0];
        cardGoodColor.dataset.id = 0;
        cardGoodColorList.innerHTML = generateList(color);

    } else{
        cardGoodColor.style.display = 'none';
    }
    if(sizes){
        cardGoodSizes.textContent = sizes[0];
        cardGoodSizes.dataset.id = 0;
        cardGoodSizesList.innerHTML = generateList(sizes);
    } else{
        cardGoodSizes.style.display = 'none';
    }

    if (getLocalStorage().some(item => item.id === id)){
        cardGoodBuy.classList.add('delete');
        cardGoodBuy.textContent = 'Удалить из корзины'
    }

    cardGoodBuy.addEventListener('click', () =>{
        if(cardGoodBuy.classList.contains('delete')){
            deleteItemCard(id);
            cardGoodBuy.classList.remove('delete');
            cardGoodBuy.textContent = 'Добавить в корзину';
        }

        if(color) data.color = cardGoodColor.textContent;
        if(sizes) data.size = cardGoodSizes.textContent;

        cardGoodBuy.classList.add('delete');
        cardGoodBuy.textContent = 'Удалить из корзины';

        const cardData = getLocalStorage();
        cardData.push(data);
        setLocalStorage(cardData);
    });
};

cardGoodSelectWrapper.forEach(item =>{
    item.addEventListener('click', e => {
        const target = e.target;

        if (target.closest('.card-good__select')){
            target.classList.toggle('card-good__select__open')
        }

        if(target.closest('.card-good__select-item')){
            const cardGoodSelect = item.querySelector('.card-good__select');
            cardGoodSelect.textContent = target.textContent;
            cardGoodSelect.dataset.id = target.dataset.id;
            cardGoodSelect.classList.remove('card-good__select__open');
        }
    });
});

getGoods(renderCardGood, 'id', hash)

} catch(err){
    console.warn(err);
}
