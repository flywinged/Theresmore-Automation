import cityBuilding from "./pageAutomation/cityBuilding";
import population from "./pageAutomation/population";
import research from "./pageAutomation/research";

var standard = {
    index: 0,
    lastIndex: null,
    completed: null,
    queueFunctions : [
        research("housing"),
        cityBuilding("common_house", 2),
        research("agriculture"),
        cityBuilding("farm", 2),

        // population(),

    ]
}

export default {
    standard
} 