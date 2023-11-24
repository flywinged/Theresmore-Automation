import { logger, navigation } from "../../utils"
import constants from "../../utils/constants"
import { buildings } from "../data"
import getBuyableButtons from "../helpers/getBuyableButtons"
import { getAchievementState } from "./achievements"
import { updateStateFromGenerates } from "./generates"

// Get the current state of all building
export const getBuildingState = async (initialize) => {

    for (const [id, buildingData] of Object.entries(buildings)) {
        buildingData.id = "building|" + id
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

            foundBuilding.count = buildingData.count
            foundBuilding.div = buildingData.div

            if (initialize) {
                updateStateFromGenerates(foundBuilding, foundBuilding.count)
            }

        }
    }

    console.log({initialize, buildings})
    return buildings

}

// For handling state updates after a building is purchased
export const makeBuilding = (buildingId) => {
    let building = buildings[buildingId]
    if (!building) {
        error('unable to "makeBuilding(' + buildingId + ")")
    }

    // Increment the building counter in state
    building.count += 1

    // Update any values that need to be updated based on the modifiers
    updateStateFromGenerates(building, 1)

    // Check achievements
    getAchievementState(false)

}