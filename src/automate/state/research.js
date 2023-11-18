import { navigation } from "../../utils"
import constants from "../../utils/constants"
import { research } from "../data"
import getButtons from "../helpers/getButtons"
import { updateStateFromGenerates } from "./generates"

// Get the current state of all research
export const initializeResearchState = async () => {

    // Assume all things are not researched
    for (const [researchId, researchData] of Object.entries(research)) {
        researchData.researched = false
    }

    // Switch to the completed page to determine what has already been researched
    await navigation.switchSubPage(constants.SUBPAGES.RESEARCH_COMPLETED, constants.PAGES.RESEARCH)

    let buttons = getButtons(research)
    for (const [researchId, researchData] of Object.entries(buttons)) {
        let foundResearch = research[researchId]
        if (foundResearch) {
            foundResearch.researched = true
        }
    }

    console.log("initial research state", research)
    return research

}

export const completeResearch = async (researchId) => {
    let tech = research[researchId]
    if (!tech) {
        logger({msgLevel: "error", msg: 'unable to "completeResearch(' + researchId + ")"})
    }

    // Increment the research counter in state
    tech.count += 1

    // Update any values that need to be updated based on the modifiers
    if (!tech.generates) {
        return
    }

    updateStateFromGenerates(tech.generates, 1)
}