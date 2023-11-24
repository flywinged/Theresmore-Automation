export const logger = ({ msgLevel, msg }) => {
    const logText = `[TA][${new Date().toLocaleTimeString()}] ${msg}`
    const levelsToLog = ['debug', 'info', 'log', 'warn', 'error']
    
    console.log(msgLevel, msg)
    
    if (levelsToLog.includes(msgLevel)) {
        const logHolder = document.querySelector('#root > div > div > div > div.w-full.order-2.flex-grow.overflow-x-hidden.overflow-y-auto.pr-4')
        
        if (logHolder) {
            const taLogs = [...logHolder.querySelectorAll('.ta-log')]
            if (taLogs.length > 10) {
                for (let i = 10; i < taLogs.length; i++) {
                    taLogs[i].remove()
                }
            }
            
            let color = 'text-white-600'
            if (msgLevel == "info") {
                color = 'text-violet-500'
            } else if (msgLevel == "log") {
                color = 'text-green-600'
            } else if (msgLevel == "warn") {
                color = 'text-orange-500'
            } else if (msgLevel == "error") {
                color = 'text-red-600'
            }
            
            const p = document.createElement('p')
            p.classList.add('text-xs', 'mb-2', color, 'ta-log')
            p.innerText = logText
            logHolder.insertAdjacentElement('afterbegin', p)
        }
    }
    
    console[msgLevel](logText)
}

export const debug = msg => {
    logger({msgLevel: "debug", msg})
}

export const info = msg => {
    logger({msgLevel: "info", msg})
}

export const log = msg => {
    logger({msgLevel: "log", msg})
}

export const warn = msg => {
    logger({msgLevel: "warn", msg})
}

export const error = msg => {
    logger({msgLevel: "error", msg})
}