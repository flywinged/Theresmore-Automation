import { navigation } from "../../utils"
import constants from "../../utils/constants"


export default () => {
    return {
        function: async () => {

            navigation.switchPage(constants.PAGES.POPULATION)

            // Create the return value
            let ret = {
                complete: false,
                delay: 2000
            }

            return ret
        
        },
        log: {msgLevel: "log", msg: 'placeholder'}
    }
}