import { formatTime, numberParser, reactUtil } from "../../utils"


export default () => {
    
    // Final resources objects to populate with current data
    let resources = {}

    // Loop through all the divs that contain resource information
    const resourcesDivs = [...document.querySelectorAll('#root div > div > div > table > tbody > tr > td:nth-child(1) > span')]
    resourcesDivs.map((resourceDiv) => {

        // Grab the name of the resource and intialize its data
        let rawKey = reactUtil.getNearestKey(resourceDiv, 6)
        const resourceName = rawKey.split("_")[1]
        let resource = { name: resourceName, current: 0, max: 0, speed: 0, ttf: null, ttz: null }

        // Grab all the resources values based on the resourceDiv
        const values = resourceDiv.parentNode.parentNode.childNodes[1].textContent.split('/').map((x) => numberParser.parse(x.replace(/[^0-9KM\-,\.]/g, '').trim()))
        
        // Simple Values
        resource.current = values[0]
        resource.max = values[1]

        // Current rate for the resource
        resource.speed = numberParser.parse(resourceDiv.parentNode.parentNode.childNodes[2].textContent.replace(/[^0-9KM\-,\.]/g, '').trim()) || 0
        
        // Calculate full and empty times if applicable for each resource
        // ttf = time till full
        // ttz = time till zero
        resource.ttf = null
        if (resource.speed > 0 && resource.max !== resource.current) {
            formatTime(Math.ceil((resource.max - resource.current) / resource.speed))
        }
        resource.ttz = null
        if (resource.speed < 0 && resource.current) {
            formatTime(Math.ceil(resource.current / (resource.speed * -1)))
        }

        // Save the resource before moving onto the next one
        resources[resourceName] = resource
    })
    
    return resources
    
}