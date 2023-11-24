import { error } from "../../utils/logger"
import { achievements, ancestors, buildings, jobs, research, resources } from "../data"


export const updateStateFromGenerates = (data, countDiff) => {

    if (!data.generates) {
        return
    }

    data.generates.forEach(gen => {

        // Population based changes
        if (gen.type === "job") {
            jobs[gen.id].cap += countDiff * gen.value
            if (gen.id === "unemployed") {
                jobs[gen.id].count += countDiff * gen.value
            }

        // Modifiers
        } else if (gen.type === "modifier") {

            // Job resources gains
            if (gen.modifierType === "job_bonus") {
                let jobGenerates = jobs[gen.jobId].generates
                let jobResource = jobGenerates.find(jobGen => jobGen.type == "resource" && jobGen.id == gen.resourceId)
                if (jobResource && countDiff && gen.value) {
                    jobResource.bonus[data.id] = countDiff * gen.value
                } else {
                    console.log({gen, jobGenerates})
                    error("could not update generates")
                }
            
            // global resource bonus
            } else if (gen.modifierType === "resource" && resources[gen.id] && countDiff && gen.value) {
                resources[gen.id].bonus[data.id] = countDiff * gen.value

            // unrecognized modifier
            } else {
                console.log({gen, countDiff})
                error("could not update generates")
            }

            return
        } else if (gen.type === "resource") {
    
            // We skip these for now, as they are calculated separately

        } else if (gen.type === "cap") {

            // TODO

        } else{

            console.log({data, gen, countDiff})
            error("invalid generate type")

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
                let resourceBonus = addBonuses(resources[gen.id].bonus)
                let dataBonus = 1
                if (gen.bonus) {
                    dataBonus = multiplyBonuses(gen.bonus)
                }
                let production = objectData.count * gen.value * resourceBonus * dataBonus

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

export const getJobGeneration = () => {

    let generation = {}

    // Loop through every object in the data file
    for (const [id, objectData] of Object.entries(jobs)) {
        if (!objectData.generates) {
            continue
        }

        generation[id] = {}

        objectData.generates.forEach(gen => {
            if (gen.type === "resource") {
                
                // Determine the bonus production of this resource
                let resourceBonus = addBonuses(resources[gen.id].bonus)
                let jobBonus = multiplyBonuses(gen.bonus)
                let production = gen.value * resourceBonus * jobBonus

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

    let dataArrays = [buildings, research, achievements, ancestors]
    dataArrays.forEach(data => {
        let subGeneration = getGeneration(data)
        for (const [id, value] of Object.entries(subGeneration)) {
            generation[id] += value
        }
    })

    return generation

}

export const multiplyBonuses = bonus => {
    let totalBonus = 1
    for (const [_, value] of Object.entries(bonus)) {
        totalBonus *= (1 + value)
    }
    return totalBonus
}

export const addBonuses = bonus => {
    let totalBonus = 1
    for (const [_, value] of Object.entries(bonus)) {
        totalBonus += value
    }
    return totalBonus
}