import { logger, numberParser, reactUtil } from "../../utils"
import { resources } from "../data"

export const resetResourceBonus = () => {
    for (const [resourceId, resourceData] of Object.entries(resources)) {
        resourceData.div = null
        resourceData.count = 0
        resourceData.bonus = 1.0
    }
}

export const getResourceState = () => {

    // Loop through all the divs that contain resource information
    const resourcesDivs = [...document.querySelectorAll('#root div > div > div > table > tbody > tr > td:nth-child(1) > span')]
    resourcesDivs.map((resourceDiv) => {

        // Grab the name of the resource and intialize its data
        let rawKey = reactUtil.getNearestKey(resourceDiv, 6)
        const resourceId = rawKey.split("_")[1]
        let resource = resources[resourceId]
        if (!resource) {
            logger({msgLevel: "error", msg: "unable to find resource data for " + resourceId})
        }

        // Grab all the resources values based on the resourceDiv
        const values = resourceDiv.parentNode.parentNode.childNodes[1].textContent.split('/').map((x) => numberParser.parse(x.replace(/[^0-9KM\-,\.]/g, '').trim()))
        
        // Simple Values
        resource.count = values[0]
        resource.cap = values[1]

        // Current rate for the resource
        resource.rate = numberParser.parse(resourceDiv.parentNode.parentNode.childNodes[2].textContent.replace(/[^0-9KM\-,\.]/g, '').trim()) || 0
        
        // Calculate full and empty times if applicable for each resource
        resource.timeToFull = null
        if (resource.speed > 0 && resource.max !== resource.current) {
            resource.timeToFull = Math.ceil((resource.max - resource.current) / resource.speed)
        }
        resource.timeToEmpty = null
        if (resource.speed < 0 && resource.current) {
            resource.timeToEmpty = Math.ceil(resource.current / (resource.speed * -1))
        }
    })
    
    return resources
    
}

export const getResourceBonusState = () => {

}