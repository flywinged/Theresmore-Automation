import { tech } from '../../data'
import { navigation, selectors, logger } from '../../utils'
import constants from '../../utils/constants'
import { balanceResources, getCurrentResources } from '../pageAutomation/resources'

const researchNameToID = {
    "monument": "monument_past",
    "agriculture": "agricolture",
}

var canBalance = true

const getAllResearchButtons = () => {
    
    // Grab the buttons and their data before trying to do anything else
    const buttonsDivs = selectors.getAllButtons(false)

    let buttons = {}

    buttonsDivs.forEach(button => {
        let buttonText = button.textContent
        let id = buttonText.replace(" ", "_").toLowerCase()

        if (researchNameToID[id]) {
            id = researchNameToID[id]
        }

        let techData = tech.find((technology) => technology.id === id)
        if (!techData) {
            console.log(buttonText)
            logger({msgLevel: "warn", msg: "tech id:" + id})
            logger({msgLevel: "debug", msg: "button text:" + buttonText})
        }

        buttons[buttonText] = {
            button,
            tech: techData
        }
    })

    return buttons
}

const completeResearch = async researchName => {

    // Switch to the navigations tab and grab all the buttons
    await navigation.switchSubPage(constants.SUBPAGES.RESEARCH, constants.PAGES.RESEARCH)
    const buttons = getAllResearchButtons()

    // Check to see if the requested button even exists. If not, log a warning and continue
    let research = buttons[researchName]
    if (!research) {
        console.log(buttons)
        console.log(researchName)
        logger({msgLevel: "warn", msg: "unable to find research " + researchName + ". skipping"})
        return true
    }

    // If the button does exist, we want to see if we can purchase it
    let resources = getCurrentResources()
    let resourcesRequirements = {}

    if (research.tech.req) {
        research.tech.req.forEach(req => {
            if (req.type == "resource") {
                resourcesRequirements[req.id] = req.value 
            }
        })
    }

    // If we have all the requirements for the research, then research it!
    let resourceDeficit = {}
    let canResearch = true
    for (const [resourceID, value] of Object.entries(resourcesRequirements)) {
        let deficit = resources[resourceID].current - value
        resourceDeficit[resourceID] = deficit
        if (deficit < 0) {
            canResearch = false
        }
    }

    if (canResearch) {
        research.button.click()
        return true
    } else if (canBalance) {
        balanceResources(resourceDeficit)
        canBalance = true
        return false
    }

}

export default (researchName) => {
    return {
        function: () => completeResearch(researchName),
        log: {msgLevel: "log", msg: "attempting to research: " + researchName}
    }
}