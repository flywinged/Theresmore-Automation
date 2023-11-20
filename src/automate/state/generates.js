import { logger } from "../../utils"
import { buildings, jobs, research, resources } from "../data"


export const updateStateFromGenerates = (generatesArray, count) => {

    if (!generatesArray) {
        return
    }

    generatesArray.forEach(gen => {

        // Population based changes
        if (gen.type === "job") {
            jobs[gen.id].cap += count * gen.value
            if (gen.id === "unemployed") {
                jobs[gen.id].count += count * gen.value
            }
        }

        // Modifiers
        if (gen.type === "modifier") {

            // Job resources gains
            if (gen.modifierType === "job_resource") {
                let jobGenerates = jobs[gen.jobId].generates
                let jobResource = jobGenerates.find(jobGen => jobGen.type == "resource" && jobGen.id == gen.resourceId)
                if (jobResource) {
                    jobResource.bonus += count * gen.value
                } else {
                    console.log({gen, jobGenerates})
                    logger({msgLevel: "error", msg: "could not update generates"})
                }
            
            // global resource bonus
            } else if (gen.modifierType === "resource") {
                resources[gen.id].bonus += count * gen.value

            // unrecognized modifier
            } else {
                console.log({gen})
                logger({msgLevel: "error", msg: "could not update generates"})
            }

            return
        }

    })

}

export const getGeneration = data => {

    let generation = {}

    // Loop through every object in the data file
    for (const [id, objectData] of Object.entries(data)) {
        if (!objectData.generates) {
            continue
        }

        objectData.generates.forEach(gen => {
            if (gen.type === "resource") {
                
                // Determine the bonus production of this resource
                let bonus = resources[gen.id].bonus
                let production = objectData.count * gen.value * (1 + bonus)

                // Accumulate the data production
                if (gen.id in generation) {
                    generation[gen.id] += production
                } else {
                    generation[gen.id] = production
                }
            }
        })

    }

    // Loop through all the benefits
    return generation

}

export const getJobGeneration = data => {

    let generation = {}

    // Loop through every object in the data file
    for (const [id, objectData] of Object.entries(data)) {
        if (!objectData.generates) {
            continue
        }

        generation[id] = {}

        objectData.generates.forEach(gen => {
            if (gen.type === "resource") {
                
                // Determine the bonus production of this resource
                let resourceBonus = resources[gen.id].bonus
                let jobBonus = gen.bonus
                let production = gen.value * (1 + resourceBonus + jobBonus)

                // Accumulate the data production
                generation[id][gen.id] = production
            }
        })

    }

    // Loop through all the benefits
    return generation

}

// Helper function for adding the current state to a generation object
export const calculateBaseGeneration = () => {

    let generation = {}
    for (const [id, data] of Object.entries(resources)) {
        generation[id] = 0
    }

    let dataArrays = [buildings, research]
    dataArrays.forEach(data => {
        let subGeneration = getGeneration(data)
        for (const [id, value] of Object.entries(subGeneration)) {
            generation[id] += value
        }
    })

    return generation

}