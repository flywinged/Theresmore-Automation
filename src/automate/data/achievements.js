import { generateResourceBonus } from "./generates";
import { requireBuilding } from "./requires";

const createAchievement = (requires, generates) => {
    return {
        count: 0,
        requires,
        generates
    }
}

const livingQuarters = {

    // Common House
    "5_common_house" : createAchievement([
        requireBuilding("common_house", 5)
    ], [
        generateResourceBonus("research", 0.01)
    ]),
    "15_common_house" : createAchievement([
        requireBuilding("common_house", 15)
    ], [
        generateResourceBonus("research", 0.02)
    ]),

}

const productionAndCrafting = {

    // Farm
    "5_farm" : createAchievement([
        requireBuilding("farm", 5)
    ], [
        generateResourceBonus("food", 0.01)
    ]),
    "15_farm" : createAchievement([
        requireBuilding("farm", 15)
    ], [
        generateResourceBonus("food", 0.02)
    ]),

    // Lumberjack Camp
    "5_lumberjack_camp" : createAchievement([
        requireBuilding("lumberjack_camp", 5)
    ], [
        generateResourceBonus("wood", 0.01)
    ]),
    "15_lumberjack_camp" : createAchievement([
        requireBuilding("lumberjack_camp", 15)
    ], [
        generateResourceBonus("wood", 0.02)
    ]),

    // Quarry
    "5_quarry" : createAchievement([
        requireBuilding("quarry", 5)
    ], [
        generateResourceBonus("stone", 0.01)
    ]),
    "15_quarry" : createAchievement([
        requireBuilding("quarry", 15)
    ], [
        generateResourceBonus("stone", 0.02)
    ]),

}

const commercialArea = {

    // Artisan Workshop
    "5_artisan_workshop" : createAchievement([
        requireBuilding("artisan_workshop", 5)
    ], [
        generateResourceBonus("gold", 0.01),
        generateResourceBonus("tools", 0.01)
    ]),
    "15_artisan_workshop" : createAchievement([
        requireBuilding("artisan_workshop", 15)
    ], [
        generateResourceBonus("gold", 0.02),
        generateResourceBonus("tools", 0.02)
    ])

}

export default {

    // Buildings
    ...livingQuarters,
    ...productionAndCrafting,
    ...commercialArea

}