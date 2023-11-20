import { logger, navigation } from "../../utils"
import constants from "../../utils/constants"
import { buildings } from "../data"
import getBuyableButtons from "../helpers/getBuyableButtons"
import { updateStateFromGenerates } from "./generates"

// Get the current state of all building
export const getBuildingState = async (initialize) => {

    for (const [_, buildingData] of Object.entries(buildings)) {
        buildingData.count = 0
        buildingData.div = null

        if (initialize && buildingData.generates) {
            buildingData.generates.forEach(gen => {
                if (gen.type == "resource") {
                    gen.multiplier = 1
                }
            })
        }
    }

    // Switch to the completed page to determine what has already been buildinged
    await navigation.switchSubPage(constants.SUBPAGES.CITY, constants.PAGES.BUILD)

    let buttons = getBuyableButtons(buildings)
    for (const [buildingId, buildingData] of Object.entries(buttons)) {
        let foundBuilding = buildings[buildingId]
        if (foundBuilding) {

            if (initialize) {
                updateStateFromGenerates(foundBuilding.generates, buildingData.count)
            }

            foundBuilding.count = buildingData.count
            foundBuilding.div = buildingData.div

        }
    }

    console.log({buildings})
    return buildings

}

// For handling state updates after a building is purchased
export const makeBuilding = (buildingId) => {
    let building = buildings[buildingId]
    if (!building) {
        logger({msgLevel: "error", msg: 'unable to "makeBuilding(' + buildingId + ")"})
    }

    // Increment the building counter in state
    console.log(buildingId, building)
    building.count += 1

    // Update any values that need to be updated based on the modifiers
    updateStateFromGenerates(building.generates, 1)

}