# GustoLounge
[Gusto Lounge] (https://gustolounge.ru/menu)

## Необходимые условия
Для разработки вам понадобится Node.js и React.js, установленный в вашей IDE.

### Node
[Node](http://nodejs.org/) Необходимо скачать и установить на ваш ПК. После этого, Вам будет доступен npm. После инсталяции приложения вы можете запустить следующие команды.

    $ node --version
    v20.2.0

    $ npm --version
    1.3.21

### React
[React](http://react.dev/) В терминале вашей IDE, вызовите команду инсталляции пакета CRA.

    $npm i create-react-app

## Установка
  Клонирование репозитория.

    $ git clone oGooner1886/menu-hookah
  
  Переход в директорию menu-hookah
  
    $ cd menu-hookah

  Установка необходимых пакетов
  
    $ npm install

## Запуск проекта

    $ npm start 
    //or
    $ npm run start

## Обновление проекта
Использование некоторых пакетов может измениться, поэтому вам следует периодически `npm prune` и `npm install`.
    
    $ git pull
    $ npm prune
    $ npm install

Чтобы запустить эти 3 команды, вы можете просто вызвать

    $ npm run pull

## О проекте
Данный коммерческий проект реализован для кальянной Gusto Lounge. Со временем функционал будет обновляться.
На момент написания документации реализовано меню с использованием [![React][React.js]][React-url], вывод товаров, изменения количества, добавления в корзину.
Реализован вывод дополнительных опций товаров в модальном окне.
В ближайшее время планируется реализация возможности бронирования столиков, а также синхронизация товаров с БД, для передачи в кассовый аппарат. А также разработка CMS на Strapi.

### Разработан с помощью
 [![React][React.js]][React-url]
 <p align="right">(<a href="#readme-top">back to top</a>)</p>



[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
