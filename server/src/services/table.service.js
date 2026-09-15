
//TODO сделать сервис для столов, представлять в виде квери параметра, добавить в кэш.
//! ключ - номер стола, значение - объект { tableId: "uuid..." }

const tablesCache = new Map()

//* id terminal
let mainTerminalGroupId = null 

async function loadTablesCache (logger) {
    const token = await getIikoToken(logger)
    const cleanOrgId = (process.env.IIKO_ORGANIZATION_GUSTO_ID || '').trim()

    logger.info('Начинаем загрузку структуры залов и столов из iikoCloud')

    try {
        const terminalResponse = await fetch('https://api-ru.iiko.services/api/1/terminal_groups', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                organizationIds: [cleanOrgId]
            })
        })
        const terminalData = await terminalResponse.json()
        if(!terminalData.terminalGroups || terminalData.terminalGroups.length === 0){
            throw new Error('Терминалы не найдены в iiko')
        }
        
        mainTerminalGroupId = terminalData.terminalGroups[0].items[0].id

        const tableResponse = await fetch('https://api-ru.iiko.services/api/1/reserve/available_restaurant_sections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                terminalGroupIds: [mainTerminalGroupId]
            }),
        })
        const tablesData = await tableResponse.json()

        tablesCache.clear()
        let loadedCount = 0

        tablesData.restaurantSections.forEach((section) => {
            section.tables.forEach((table) => {
                tablesCache.set(String(table.number), {
                    tableId: table.id,
                    terminalGroupId: mainTerminalGroupId,
                    tableName: table.name || `Стол ${table.number}`,
                    sectionName: section.name
                })
                loadedCount++
            })
        })
        logger.info(`Успешно загружено ${loadedCount} столов в кэш`)
    } catch (error){
        logger.error(`Ошибка при загрузке столов ${error.message}`)
    }
}
