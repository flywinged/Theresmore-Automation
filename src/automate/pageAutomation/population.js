import { navigation, sleep } from "../../utils"
import constants from "../../utils/constants"
import { buildings, jobs, research, resources } from "../data"
import getBuyableButtons from "../helpers/getBuyableButtons"
import { getDeficet } from "../state/deficet"
import { calculateBaseGeneration, getJobGeneration } from "../state/generates"
import { getJobState } from "../state/jobs"

const FULL_WIDTH = 20
const FULL_BASE = 1.5

// Allocate population to fulfill the missing deficet in the most reasonable amount of time
export const distributePopulation = async () => {
    let deficet = getDeficet()

    /*
        If there is no population is available, then we can just return
        as there is nothing to do.
    */
    if (jobs.unemployed.cap === 0) {
        return
    }

    // Calculate the passive generation of the system, without including population
    let generation = calculateBaseGeneration()

    // Determine the impact of each job, including bonuses
    let jobImpact = getJobGeneration()

    /*
        Calculate the fastest way to fulfill the deficet,
        ensuring that food production is always stable.
    */
    let jobCount = {}
    for (let i = 0; i < jobs.unemployed.cap; i++) {
        let selectedJob = findBestJob(generation, deficet, jobImpact, jobCount)

        // No valid job found
        if (selectedJob === null) {
            break
        }

        console.log({jobCount, deficet, jobImpact, generation, selectedJob})

        if (selectedJob in jobCount) {
            jobCount[selectedJob] += 1
        } else {
            jobCount[selectedJob] = 1
        }

        // Adjust the generation baed on the selected job
        for (const [id, value] of Object.entries(jobImpact[selectedJob])) {
            generation[id] += value
        }

    }

    // Determine if there are any differences between this configuration
    // and the existing configuration. If there are, we will reallocate.
    for (const [jobId, count] of Object.entries(jobCount)) {
        if (jobs[jobId].count !== count) {
            await clickButtons(jobCount)
            return
        }
    }
    
}

const clickButtons = async jobCount => {

    // Switch to the population page and make sure all the buttons are updated
    await getJobState()

    // Clear the current jobs
    if (jobs.unemployed.div !== null) {
        await jobs.unemployed.div.click()
        jobs.unemployed.count = 0
    }

    // Get a list of all the buttons again now that the add button is there now
    await getJobState()

    // Joop through all the job counts and apply the correct workers
    for (const [id, count] of Object.entries(jobCount)) {
        for (let i = 0; i < count; i++) {
            await jobs[id].addDiv.click()
        }
        jobs[id].count = count
    }

    await sleep(1000)

}

const findBestJob = (generation, deficet, jobImpact, jobCount) => {

    // Used to define the job to choose
    let selectedJob = null
    let selectedScore = null

    // Get the baeline score
    let baseline = scoreSetup(generation, deficet)

    // Prioritize negative values, starting with food
    for (const [jobId, jobGeneration] of Object.entries(jobImpact)) {

        // Can't select this job if no available slots left
        if (jobCount[jobId] === undefined) {
            jobCount[jobId] = 0
        }
        if (jobCount[jobId] >= jobs[jobId].cap) {
            continue
        }

        // Create a copy of the generation object
        let selectedJobGeneration = { ...generation }
        for (const [resourceId, resourceValue] of Object.entries(jobGeneration)) {
            selectedJobGeneration[resourceId] += resourceValue
        }

        // Score the selection of this job
        let score = scoreSetup(selectedJobGeneration, deficet) - baseline

        // Track this as the best option if we can
        if (selectedJob === null || score > selectedScore) {
            selectedJob = jobId
            selectedScore = score
        }

    }

    return selectedJob

}

const scoreSetup = (generation, deficet) => {

    // Objects to track the amount of time it will take
    // to reach full, empty, and fulfilling the deficet
    let fullScores = {}
    let emptyScores = {}
    let deficetScores = {}

    for (const [id, genRate] of Object.entries(generation)) {

        // Set full/empty times to null to begin with
        fullScores[id] = null
        emptyScores[id] = null

        // Determine the full or empty scores
        if (genRate !== 0) {
            let fillPercent = resources[id].count / resources[id].cap
            if (genRate < 0) {
                emptyScores[id] = genRate * fillPercent
            } else {
                let score = - Math.log(1 / ((genRate / FULL_WIDTH) + 1)) / Math.log(FULL_BASE)
                fullScores[id] = score * (1 - fillPercent)
            }
        }

        // Determine the time to remove the deficet
        if (deficet && (id in deficet) && deficet[id] < 0) {
            let d = -deficet[id]
            deficetScores[id] = -Math.log(d / (genRate + 1)) + Math.log(d)
        }

    }

    let score = 0
    for (const [_, value] of Object.entries(fullScores)) {
        score += value
    }
    for (const [_, value] of Object.entries(emptyScores)) {
        score += value
    }
    for (const [_, value] of Object.entries(deficetScores)) {
        score += value
    }

    return score

} 