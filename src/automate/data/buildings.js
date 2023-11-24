import { generateJob, generateJobBonus, generateResource, generateResourceBonus, generateResourceCap } from "./generates";
import { requireResearch, requireResource } from "./requires";

const createBuilding = (requires, generates) => {
    return {
        div: null,
        count: 0,
        requires,
        generates
    }
}

const livingQuarters = {

    "common_house": createBuilding([
        requireResource("wood", 15, 1.3),
        requireResource("stone", 10, 1.3)
    ], [
        generateResource("food", -1),
        generateResource("gold", 0.2),
        generateResource("research", 0.3),
        generateJob("unemployed", 1),
    ]),

    "city_hall": createBuilding([
        requireResource("gold", 1200, 1.3),
        requireResource("wood", 1000, 1.3),
        requireResource("stone", 750, 1.3),
        requireResource("copper", 400, 1.3),
        requireResource("iron", 400, 1.3),
        requireResource("tools", 150, 1.3),
        requireResearch("municipal_administration")
    ], [
        generateResource("food", -1.5),
        generateResourceCap("research", 250),
        generateJob("unemployed", 2)
    ]),

}

const productionAndCrafting = {

    farm : createBuilding([
        requireResource("gold", 10, 1.4),
        requireResource("wood", 24, 1.4),
        requireResearch("agriculture")
    ], [
        generateJob("farmer", 1),
        generateJobBonus("farmer", "food", 0.01),
        generateResourceCap("food", 240)
    ]),

    lumberjack_camp : createBuilding([
        requireResource("gold", 25, 1.4),
        requireResource("wood", 18, 1.4),
        requireResource("stone", 5, 1.4),
        requireResearch("wood_cutting")
    ], [
        generateJob("lumberjack", 1),
        generateJobBonus("lumberjack", "wood", 0.01),
        generateResourceCap("wood", 100)
    ]),

    quarry : createBuilding([
        requireResource("gold", 32, 1.4),
        requireResource("wood", 24, 1.4),
        requireResource("stone", 8, 1.4),
        requireResearch("stone_masonry")
    ], [
        generateJob("quarryman", 1),
        generateJobBonus("quarryman", "stone", 0.01),
        generateResourceCap("stone", 100)
    ]),
       
    mine : createBuilding([
        requireResource("gold", 160, 1.4),
        requireResource("wood", 140, 1.4),
        requireResource("stone", 80, 1.4),
        requireResearch("mining")
    ], [
        generateJob("miner", 1),
        generateJobBonus("miner", "copper", 0.01),
        generateJobBonus("miner", "iron", 0.01),
        generateResourceCap("copper", 100),
        generateResourceCap("iron", 100)
    ]),

}

const commercialArea = {

    artisan_workshop : createBuilding([
        requireResource("gold", 150, 1.4),
        requireResource("wood", 120, 1.4),
        requireResource("stone", 80, 1.4),
        requireResearch("pottery")
    ], [
        generateJob("artisan", 1),
        generateJobBonus("farmer", "food", 0.02),
        generateJobBonus("lumberjack", "wood", 0.02),
        generateJobBonus("quarryman", "stone", 0.02),
        generateJobBonus("artisan", "gold", 0.02),
        generateJobBonus("artisan", "tools", 0.02),
        generateResourceCap("gold", 250),
        generateResourceCap("tools", 100)
    ]),

}

const knowledgeArea = {

    school : createBuilding([
        requireResource("gold", 350, 1.3),
        requireResource("wood", 300, 1.3),
        requireResource("stone", 250, 1.3),
        requireResource("tools", 100, 1.3),
        requireResearch("writing")
    ], [
        generateResource("research", 0.4),
        generateResourceBonus("research", 0.01),
        generateResourceCap("research", 1000)
    ]),

}

const storage = {

    store : createBuilding([
        requireResource("wood", 500, 1.4),
        requireResource("stone", 300, 1.4),
        requireResource("tools", 150, 1.4),
        requireResearch("storage")
    ], [
        generateResourceCap("wood", 500),
        generateResourceCap("stone", 500),
        generateResourceCap("copper", 250),
        generateResourceCap("iron", 250)
    ])

}

export default {

    ...livingQuarters,
    ...productionAndCrafting,
    ...commercialArea,
    ...knowledgeArea,
    ...storage
    
}