import { resources } from "../data"
import { getResourceState } from "./resource"

var deficet = {}

export const updateDeficet = (requirements) => {

    getResourceState()

    deficet = {}
    let noDeficet = true
    for (const [resourceId, value] of Object.entries(requirements)) {
        let resourceDiff = resources[resourceId].count - value
        deficet[resourceId] = resourceDiff
        if (resourceDiff < 0 || isNaN(resourceDiff)) {
            noDeficet = false
            if (isNaN(resourceDiff)) {
                console.log({requirements, resources, deficet})
                logger({msgLevel: "error", msg: "NaN deficit"})
            }
        }
    }

    if (noDeficet) {
        return null
    }

    return { ...deficet }
}

export const getDeficet = () => {

    let noDeficet = true
    for (const [_, value] of Object.entries(deficet)) {
        if (value < 0) {
            noDeficet = false
        }
    }

    if (noDeficet) {
        return null
    }

    return { ...deficet }
}