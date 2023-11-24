import { sleep, logger, localStorage, state, runMigrations, CONSTANTS } from './utils'
import tasks from './tasks'
import automate from './automate'
import { getBuildingState } from './automate/state/building'
import { getResearchState } from './automate/state/research'
import { getJobState } from './automate/state/jobs'
import { getAchievementState } from './automate/state/achievements'
import { getResourceState, resetResourceBonus } from './automate/state/resource'
import { getAncestorState } from './automate/state/ancestor'
import { jobs, resources } from './automate/data'
import { getJobGeneration } from './automate/state/generates'

let mainLoopRunning = false
let hideFullPageOverlayInterval

const switchScriptState = () => {
    state.scriptPaused = !state.scriptPaused
    localStorage.set('scriptPaused', state.scriptPaused)
    tasks.managePanel.updatePanel()
    
    if (!state.scriptPaused) {
        start()
    } else {
        logger({ msgLevel: 'log', msg: 'Pausing automation' })
    }
}

const mainLoop = async () => {
    if (mainLoopRunning) {
        setTimeout(mainLoop, 1000)
        return
    }
    
    mainLoopRunning = true
    
    while (!state.scriptPaused) {
        let waitFor = await automate("queueEarlyGameStandard")
        await sleep(waitFor)
    }
    
    mainLoopRunning = false
}

const init = async () => {
    tasks.manageStyles.appendStyles()
    tasks.managePanel.createPanel(switchScriptState)
    tasks.manageOptions.createPanel(start)
    tasks.managePanel.updatePanel()
    
    setInterval(tasks.calculateTTF, 100)
    setInterval(tasks.calculateTippyTTF, 100)
    setInterval(tasks.addArmyButtons, 100)
    setInterval(tasks.updateStats, 100)
    
    start()
}

const start = async () => {
    runMigrations()
    document.querySelector('html').classList.add('dark')
    tasks.managePanel.updatePanel()
    
    if (!state.scriptPaused) {
        logger({ msgLevel: 'log', msg: 'Starting automation' })

        // Initialize the current state of affairs
        resetResourceBonus()
        await getBuildingState(true)
        await getResearchState(true)
        await getJobState()
        await getAchievementState(true)
        await getAncestorState()
        
        if (!hideFullPageOverlayInterval) {
            clearInterval(hideFullPageOverlayInterval)
            hideFullPageOverlayInterval = setInterval(tasks.cosmetics.hideFullPageOverlay, 500)
        }
        
        await sleep(2000)
        
        mainLoop()
        
        await sleep(1000)
        tasks.autoClicker() // Enable this if you want autoclicker
    } else {
        if (!hideFullPageOverlayInterval) {
            clearInterval(hideFullPageOverlayInterval)
        }
    }
}

init()
