import { generateJobBonus, generateResource, generateResourceCap } from "./generates"
import { requireBuilding, requireResearch, requireResource } from "./requires"

const createResearch = (requires, generates) => {
    return {
        div: null,
        count: 0,
        requires,
        generates,
    }
}

const buildingImprovements = {

    // Farm
    crop_rotation: createResearch([
        requireResource("research", 100),
        requireBuilding("farm", 5)
    ], [
        generateResource("fame", 5),
        generateJobBonus("farmer", "food", 0.02)
    ]),
    
    // Lumberjack Camp
    woodcarvers: createResearch([
        requireResource("research", 150),
        requireResource("tools", 20),
        requireBuilding("lumberjack_camp", 5)
    ], [
        generateResource("fame", 10),
        generateJobBonus("lumberjack", "wood", 0.02)
    ]),
    
    // Quarry
    stone_extraction_tools: createResearch([
        requireResource("research", 175),
        requireResource("tools", 25),
        requireBuilding("quarry", 5)
    ], [
        generateResource("fame", 10),
        generateJobBonus("quarryman", "stone", 0.02)
    ]),

    // Artisan Workshop
    local_products : createResearch([
        requireResource("research", 350),
        requireBuilding("artisan_workshop", 5)
    ], [
        generateResource("fame", 20),
        generateJobBonus("artisan", "tools", 0.02)
    ]),

}


//////////////////////////
// STANDARD PROGRESSION //
//////////////////////////

// 
const firstAge = {
    housing : createResearch([], []),

    agriculture: createResearch([
        requireResource("research", 10),
        requireResearch("housing")
    ], []),
    
    stone_masonry : createResearch([
        requireResource("research", 20),
        requireResearch("housing")
    ], []),
    
    wood_cutting : createResearch([
        requireResource("research", 20),
        requireResearch("housing")
    ], []),

    pottery : createResearch([
        requireResource("research", 150),
        requireResearch("stone_masonry")
    ], []),

    writing : createResearch([
        requireResource("research", 500),
        requireResearch("pottery")
    ], []),

    mining : createResearch([
        requireResource("research", 250),
        requireBuilding("quarry", 3)
    ], []),
    
    storage : createResearch([
        requireResource("research", 300),
        requireResearch("agriculture")
    ], []),

    archery : createResearch([
        requireResource("research", 200),
        requireResource("wood", 150),
        requireResearch("agriculture")
    ], [
        generateResourceCap("army", 2)
    ]),

    bronze_working : createResearch([
        requireResource("research", 600),
        requireResource("copper", 300),
        requireResearch("mining")
    ], [
        generateResourceCap("army", 3)
    ]),
    
    breeding : createResearch([
        requireResource("research", 800),
        requireBuilding("farm", 5),
        requireResearch("storage")
    ], []),

    mythology : createResearch([
        requireResource("research", 750),
        requireBuilding("common_house", 8),
        requireResearch("writing")
    ], []),

    mathematics : createResearch([
        requireResource("research", 2500),
        requireResearch("writing")
    ], []),

    religion : createResearch([
        requireResource("research", 3500),
        requireResource("gold", 1500),
        requireResearch("writing")
    ], []),

    municipal_administration : createResearch([
        requireResource("research", 2500),
        requireBuilding("common_house", 15),
    ], [
        generateResource("fame", 30)
    ]),
   
}

const standardProgression = {
    ...firstAge,
}

export default {
    
    ...standardProgression,
    ...buildingImprovements,
    
    
}