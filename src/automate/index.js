import { logger } from "../utils"
import queues from "./queues"

export default async function(queueName) {

    let queue = queues[queueName]

    if (queue.completed) {
        return 1000
    }

    let step = queue.queueFunctions[queue.index]

    if (!step) {
        logger({msgLevel: "info", msg: "completed " + queueName + "!"})
        queue.completed = true
        return 1000
    }

    if (queue.lastIndex !== queue.index) {
        logger(step.log)
        queue.lastIndex = queue.index
    }

    if (await step.function() === true) {
        queue.index = queue.index + 1
        return 5000 // Time it takes for an action to process
    }

    return 50

}