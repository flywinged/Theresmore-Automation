import { navigation, logger } from '../../utils'
import getResourceState from '../state/getResourceState'
import getButtons from '../helpers/getButtons'

// Used to track if balancing has occured already for a given buy task
var canBalance = true

export default ({
    id,
    count, // Defaults to 1 more than one exists now
    page,
    subpage, // Optional
    referenceData, // json data loaded in
    replacementMap, // Map of corrections to make
    onClick, // Function to call when the button is clicked

    delayBuy, // Default is 5000
}) => {
    return {
        function: async () => {

            if (!delayBuy) {
                delayBuy = 5000
            }

            // Create the return value
            let ret = {
                complete: false,
                delay: 0
            }

            // Switch to the navigations tab and grab all the buttons
            if (subpage) {
                await navigation.switchSubPage(page, subpage)
            } else {
                await navigation.switchPage(page)
            }
            
            // Grab all the buttons on the relevant page
            const buttons = getButtons(referenceData, replacementMap)
        
            // Check to see if the requested button even exists. If not, log a warning and continue
            let button = buttons[id]
            if (!button) {
                console.log({id, buttons})
                logger({msgLevel: "error", msg: "unable to find button " + id + "."})
                ret.complete = true
                return ret
            }
        
            // Check to see if we have enough of the button. If so, immediately return
            if (button.count >= count) {
                ret.complete = true
                return ret
            }
        
            // If the button does exist, we want to see if we can purchase it
            let resources = getResourceState()
            let resourcesRequirements = {}
        
            if (button.data.requires) {
                button.data.requires.forEach(req => {
                    if (req.type == "resource") {
                        resourcesRequirements[req.id] = req.value * Math.pow(req.multiplier, button.count)
                    }
                })
            }
        
            // If we have all the requirements for the building, then building it!
            let resourceDeficit = {}
            let canClick = true
            for (const [resourceId, value] of Object.entries(resourcesRequirements)) {
                let deficit = resources[resourceId].current - value
                resourceDeficit[resourceId] = deficit
                if (deficit < 0) {
                    canClick = false
                }
            }
        
        
            // Click the button if we can. Otherwise, we want to rebalance resources accordingly
            if (canClick) {
                console.log({resourcesRequirements, resources, resourceDeficit})
                button.div.click()
                if (onClick) {
                    onClick()
                }
                ret.delay = delayBuy
                if (button.count + 1 >= count) {
                    ret.complete = true
                }
                canBalance = true
            } else if (canBalance) {
                console.log("BALANCING")
                // balanceResources(resourceDeficit)
                canBalance = false
                ret.delay = 1000
            }

            return ret
        
        },
        log: {msgLevel: "log", msg: 'buying ' + count + ' "' + id + '"'}
    }
}