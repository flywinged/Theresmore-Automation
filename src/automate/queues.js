import cityBuilding from "./tasks/cityBuilding";
import research from "./tasks/research";

var standard = {
    index: 0,
    lastIndex: null,
    completed: null,
    queueFunctions : [
        research("Housing"),
        cityBuilding("Common House"),
        cityBuilding("Common House"),
        cityBuilding("Common House"),
        research("Monument"),
        cityBuilding("Monument"),
        research("Agriculture"),
        cityBuilding("Farm"),
        cityBuilding("Farm"),

        // TODO Allocate resources

    ]
}

export default {
    standard
} 