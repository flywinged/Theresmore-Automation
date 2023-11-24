import { generateResource } from "./generates"

const createJob = (requires, generates) => {
    return {
        count: 0,
        cap: 0,
        addDiv: null,
        removeDiv: null,
        requires,
        generates
    }
}

export default {
    unemployed : { cap: 0, count: 0, div: null },

    farmer : createJob([], [ generateResource("food", 1.6) ]),
    lumberjack: createJob([], [ generateResource("wood", 0.7) ]),
    quarryman: createJob([], [ generateResource("stone", 0.6) ]),
    
    miner: createJob([], [ generateResource("copper", 0.5), generateResource("iron", 0.3) ]),
    artisan: createJob([], [ generateResource("gold", 0.5), generateResource("tools", 0.3) ]),

}
