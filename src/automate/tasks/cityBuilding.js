import { buildings } from '../../data'
import { navigation, selectors, logger } from '../../utils'
import constants from '../../utils/constants'
import { balanceResources, getCurrentResources } from '../pageAutomation/resources'

const buildingNameToID = {

}

var canBalance = true

const getAllBuildButtons = () => {
    
    // Grab the buttons and their data before trying to do anything else
    const buttonsDivs = selectors.getAllButtons(false)

    let buttons = {}

    buttonsDivs.forEach(button => {
        let buttonText = button.textContent.replace(/[0-9]/g, '')
        let id = buttonText.replace(" ", "_").toLowerCase()

        if (buildingNameToID[id]) {
            id = buildingNameToID[id]
        }

        let buildData = buildings.find((building) => building.id === id)
        if (!buildData) {
            console.log(buttonText)
            logger({msgLevel: "warn", msg: "tech id:" + id})
            logger({msgLevel: "debug", msg: "button text:" + buttonText})
        }

        buttons[buttonText] = {
            button,
            build: buildData
        }
    })

    return buttons
}

const completeBuilding = async buildingName => {

    // Switch to the navigations tab and grab all the buttons
    await navigation.switchSubPage(constants.SUBPAGES.CITY, constants.PAGES.BUILD)
    const buttons = getAllBuildButtons()

    // Check to see if the requested button even exists. If not, log a warning and continue
    let building = buttons[buildingName]
    if (!building) {
        console.log(buttons)
        console.log(buildingName)
        logger({msgLevel: "warn", msg: "unable to find building " + buildingName + ". skipping"})
        return true
    }

    // If the button does exist, we want to see if we can purchase it
    let resources = getCurrentResources()
    let resourcesRequirements = {}

    if (building.build.req) {
        building.build.req.forEach(req => {
            if (req.type == "resource") {
                resourcesRequirements[req.id] = req.value 
            }
        })
    }

    // If we have all the requirements for the building, then building it!
    let resourceDeficit = {}
    let canBuild = true
    for (const [resourceID, value] of Object.entries(resourcesRequirements)) {
        let deficit = resources[resourceID].current - value
        resourceDeficit[resourceID] = deficit
        if (deficit < 0) {
            canBuild = false
        }
    }

    if (canBuild) {
        building.button.click()
        return true
    } else if (canBalance) {
        balanceResources(resourceDeficit)
        canBalance = true
        return false
    }

}

export default (buildingName) => {
    return {
        function: () => completeBuilding(buildingName),
        log: {msgLevel: "log", msg: "attempting to build: " + buildingName}
    }
}