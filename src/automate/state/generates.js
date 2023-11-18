import { logger } from "../../utils"
import { jobs, resources } from "../data"


export const updateStateFromGenerates = (generatesArray, count) => {

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