import { navigation, logger } from '../../utils'
import { updateDeficet } from '../state/deficet'
import { getResourceState } from '../state/resource'

// Used to track if balancing has occured already for a given buy task
var canBalance = true

export default ({
    id,
    count, // Defaults to 1 more than one exists now
    page,
    subpage, // Optional
    referenceData, // json data relevant to this purchase

    before, // Function to call before beginning this automation
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

            // Switch to the correct tab (if not already there)
            if (subpage) {
                await navigation.switchSubPage(page, subpage)
            } else {
                await navigation.switchPage(page)
            }
        
            // Check to see if the requested button even exists. If not, log a warning and continue
            let data = referenceData[id]
            if (!data) {
                logger({msgLevel: "error", msg: "unable to find reference data for"})
                ret.complete = true
                return ret
            }
        
            // Check to see if we have enough of the button. If so, immediately return
            if (data.count >= count) {
                ret.complete = true
                return ret
            }
        
            // If the data does exist, we want to see if we can buy it
            let resourcesRequirements = {}
            if (data.requires) {
                data.requires.forEach(req => {
                    if (req.type == "resource") {
                        resourcesRequirements[req.id] = req.value * Math.pow(req.multiplier, data.count)
                    }
                })
            }
        
            // If we have all the requirements for the building, then building it!
            let deficet = updateDeficet(resourcesRequirements)

            console.log({deficet, resourcesRequirements})
        
            // Click the button if we can. Otherwise, we want to rebalance resources accordingly
            if (deficet === null) {
                if (data.div) {
                    await data.div.click()
                    if (onClick) {
                        onClick()
                    }
                    ret.delay = delayBuy
                    if (data.count >= count) {
                        ret.complete = true
                    }
                    canBalance = true
                } else {
                    console.log({data})
                    logger({msgLevel: "error", msg: "unable to find div for " + id})
                    ret.complete = true
                    ret.delay = 0
                }
            } else {
                ret.delay = 250 // To not overload on waiting
            }

            return ret
        
        },
        before,
        log: {msgLevel: "log", msg: 'buying ' + count + ' "' + id + '"'}
    }
}