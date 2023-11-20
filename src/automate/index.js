import { logger } from "../utils"
import { distributePopulation } from "./pageAutomation/population"
import queues from "./queues"

export default async function(queueName) {

    // Determine if there is a more optimal way to distribute our population
    await distributePopulation()

    let queue = queues[queueName]

    if (queue.completed) {
        return 1000
    }

    let step = queue.queueFunctions[queue.index]

    if (!step) {
        logger({msgLevel: "log", msg: "completed " + queueName + "!"})
        queue.completed = true
        return 1000
    }

    if (queue.lastIndex !== queue.index) {
        logger(step.log)
        queue.lastIndex = queue.index
    }

    if (step.before) {
        await step.before()
    }

    let response = await step.function()
    if (response.complete) {
        console.log("completing step", queue.index)
        queue.index = queue.index + 1
    }

    return response.delay

}