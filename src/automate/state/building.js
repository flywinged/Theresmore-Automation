import { logger, navigation } from "../../utils"
import constants from "../../utils/constants"
import { buildings, jobs } from "../data"
import getButtons from "../helpers/getButtons"
import { updateStateFromGenerates } from "./generates"

// Get the current state of all building
export const initializeBuildingState = async () => {

    for (const [buildingId, buildingData] of Object.entries(buildings)) {
        buildingData.count = 0
        if (buildingData.generates) {
            buildingData.generates.forEach(gen => {
                if (gen.type == "resource") {
                    gen.multiplier = 1
                }
            })
        }
    }

    // Switch to the completed page to determine what has already been buildinged
    await navigation.switchSubPage(constants.SUBPAGES.CITY, constants.PAGES.BUILD)

    let buttons = getButtons(buildings)
    for (const [buildingId, buildingData] of Object.entries(buttons)) {
        let foundBuilding = buildings[buildingId]
        if (foundBuilding) {
            foundBuilding.count = buildingData.count
        }
    }

    console.log("initial building state", buildings)
    return buildings

}

// For handling state updates after a building is purchased
export const makeBuilding = (buildingId) => {
    let building = buildings[buildingId]
    if (!building) {
        logger({msgLevel: "error", msg: 'unable to "makeBuilding(' + buildingId + ")"})
    }

    // Increment the building counter in state
    building.count += 1

    // Update any values that need to be updated based on the modifiers
    if (!building.generates) {
        return
    }

    updateStateFromGenerates(building.generates, 1)

}