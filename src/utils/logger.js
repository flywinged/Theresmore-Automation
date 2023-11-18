const logger = ({ msgLevel, msg }) => {
  const logText = `[TA][${new Date().toLocaleTimeString()}] ${msg}`
  const levelsToLog = ['debug', 'log', 'error']

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
      if (msgLevel == "log") {
        color = 'text-green-600'
      // } else if (msgLevel == "warn") {
      //   color = 'text-yellow-600'
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

export default logger
