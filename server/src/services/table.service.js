
//TODO сделать сервис для столов, представлять в виде квери параметра, добавить в кэш.
//! ключ - номер стола, значение - объект { tableId: "uuid..." }

const tableCache = new Map()

//* 
let mainTerminalGroupId = null 