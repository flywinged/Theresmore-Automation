import { navigation, sleep } from "../../utils"
import constants from "../../utils/constants"
import { error } from "../../utils/logger"
import { ancestors } from "../data"
import { updateStateFromGenerates } from "./generates"
import { checkRequires } from "./requires"

// Get the current state of all building
export const getAncestorState = async () => {

    await navigation.switchPage(constants.PAGES.BUILD)

    // Check the achievements list
    const ancestorButton = document.querySelector('span.text-ancestor')
    await ancestorButton.click()
    await sleep(1000)

    const textDiv = document.querySelector('div.text-ancestor')
    for (const [id, ancestorData] of Object.entries(ancestors)) {
        ancestorData.id = "ancestor|" + id
        ancestorData.count = 0
        if (textDiv.textContent.includes(ancestorData.text)) {
            ancestorData.count = 1
            updateStateFromGenerates(ancestorData, 1)
        }
    }

    await ancestorButton.click()

    console.log({ancestors})
    return ancestors

}
