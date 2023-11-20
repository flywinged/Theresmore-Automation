import { automateCityBuild } from "./pageAutomation/build";
import { automateResearch } from "./pageAutomation/research";

var standard = {
    index: 0,
    lastIndex: null,
    completed: null,
    queueFunctions : [
        automateResearch("housing"),
        automateCityBuild("common_house", 3),
        automateResearch("agriculture"),
        automateCityBuild("farm", 3),
        automateResearch("wood_cutting"),
        automateResearch("stone_masonry"),
        automateCityBuild("common_house", 5),
        automateCityBuild("lumberjack_camp", 1),
        automateCityBuild("quarry", 1),
        automateCityBuild("common_house", 7),
    ]
}

export default {
    standard
} 