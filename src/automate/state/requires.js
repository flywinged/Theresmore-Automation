import { buildings, research, resources } from "../data";


export const checkRequires = requires => {

    let valid = true
    requires.forEach(req => {

        // Skip if already determine to be invalid
        if (!valid) {
            return
        }

        // Different require types
        if (req.type === "building") {
            if (buildings[req.id].count < req.value) {
                valid = false
            }
        } else if (req.type === "resource") {
            if (resources[req.id].count < req.value) {
                valid = false
            }
        } else if (req.type === "research") {
            if (research[req.id].count < req.value) {
                valid = false
            }
        
        // If here, req didn't pass any, so we fail
        } else {
            console.log("unidentified requires type:", req)
            valid = false
        }
    });

    return valid
}