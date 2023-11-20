import { navigation } from "../../utils"
import constants from "../../utils/constants"
import { research } from "../data"
import getBuyableButtons from "../helpers/getBuyableButtons"
import { updateStateFromGenerates } from "./generates"

// Get the current state of all research
export const getResearchState = async (initialize) => {

    if (initialize) {

        // Assume all things are not researched at the start
        for (const [researchId, researchData] of Object.entries(research)) {
            researchData.div = null
            researchData.count = 0
        }

        await getResearchState(false)
        await navigation.switchSubPage(constants.SUBPAGES.RESEARCH_COMPLETED, constants.PAGES.RESEARCH)
    } else {
        // Switch to the completed page to determine what has already been researched
        await navigation.switchSubPage(constants.SUBPAGES.RESEARCH, constants.PAGES.RESEARCH)
    }

    let buttons = getBuyableButtons(research)
    for (const [researchId, researchData] of Object.entries(buttons)) {
        let foundResearch = research[researchId]
        if (foundResearch) {
            foundResearch.count = true && initialize ? 1 : 0
            foundResearch.div = researchData.div
        }
    }

    console.log({initialize, research})
    return research

}

export const completeResearch = async (researchId) => {
    let data = research[researchId]
    if (!data) {
        logger({msgLevel: "error", msg: 'unable to "completeResearch(' + researchId + ")"})
    }

    // Increment the research counter in state and remove the div
    data.count += 1
    data.div = null

    // Update any values that need to be updated based on the modifiers
    updateStateFromGenerates(data.generates, 1)
}