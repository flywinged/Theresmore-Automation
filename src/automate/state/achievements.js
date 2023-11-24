import { navigation, sleep } from "../../utils"
import constants from "../../utils/constants"
import { error } from "../../utils/logger"
import { achievements } from "../data"
import { updateStateFromGenerates } from "./generates"
import { checkRequires } from "./requires"

// Get the current state of all building
export const getAchievementState = async (initialize) => {

    if (initialize) {

       await navigation.switchPage(constants.PAGES.BUILD)

        // Reset all the values
        for (const [id, achievementData] of Object.entries(achievements)) {
            achievementData.id = "achievement|" + id
            achievementData.count = 0
        }

        // Check the achievements list
        const achievementsButton = document.querySelector('#root > header > div > div > button.py-1\\.5.px-3.text-amber-500')
        await achievementsButton.click()
        await sleep(1000)

        const container = document.querySelector('div.modal-container.lg\\:my-8.lg\\:max-w-4xl.lg\\:pt-6.opacity-100.translate-y-0')
        const list = container.querySelectorAll('h5.text-xl.font-bold')
        list.forEach(element => {
            let achievementId = element.textContent.toLowerCase().replaceAll(" ", "_")
            let achievementData = achievements[achievementId]
            if (achievementData) {
                achievementData.count = 1
                updateStateFromGenerates(achievementData, 1)
            } else {
                error("found unknown achievement " + achievementId)
            }
        })

        const closeButton = document.querySelector('div.modal-container.lg\\:my-8.lg\\:max-w-4xl.lg\\:pt-6.opacity-100.translate-y-0 > div.absolute.top-0.right-0.z-20.pt-4.pr-4 > button')
        await closeButton.click()
        await sleep(500)
    } 
    
    // Check to see if any new achievements are unlocked
    for (const [_, achievementData] of Object.entries(achievements)) {
        if (achievementData.count === 0 && checkRequires(achievementData.requires)) {
            achievementData.count = 1
            updateStateFromGenerates(achievementData, 1)
        }
    }

    console.log({initialize, achievements})
    return achievements

}
