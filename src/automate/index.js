import { logger } from "../utils"
import queues from "./queues"

export default async function(queueName) {

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

    let response = await step.function()
    if (response.complete) {
        queue.index = queue.index + 1
    }
    return response.delay

}