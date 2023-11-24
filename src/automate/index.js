import { log } from "../utils/logger"
import { distributePopulation } from "./pageAutomation/population"
import queues from "./queues"
import { getAchievementState } from "./state/achievements"

export default async function(queueName) {

    // Check to see if any achievements have been unlocked
    getAchievementState(false)

    // Determine if there is a more optimal way to distribute our population
    await distributePopulation()

    let queue = queues[queueName]

    if (queue.completed) {
        return 1000
    }

    let step = queue.queueFunctions[queue.index]

    if (!step) {
        log("completed " + queueName + "!")
        queue.completed = true
        return 1000
    }

    if (queue.lastIndex !== queue.index) {
        log(step.log)
        queue.lastIndex = queue.index
    }

    if (step.before && await step.before()) {
        console.log("step", queue.index, "already complete. skipping")
        queue.index = queue.index + 1
        return 0
    }

    let response = await step.function()
    if (response.complete) {
        console.log("completing step", queue.index)
        queue.index = queue.index + 1
    }

    return response.delay

}