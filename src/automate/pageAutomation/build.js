import constants from '../../utils/constants'
import { error } from '../../utils/logger'
import { buildings } from '../data'
import { getBuildingState, makeBuilding } from '../state/building'
import buy from './buy'

export const automateCityBuild = (buildingId, count) => {
    return buy({
        id: buildingId,
        count: count,
        page: constants.PAGES.BUILD,
        subpage: constants.SUBPAGES.CITY,
        referenceData: buildings,
        before: async () => {

            // Check to see if the requested data even exists. If not, log a warning and continue
            let data = buildings[buildingId]
            if (!data) {
                error("unable to find reference data for")
                return true
            }
        
            // Check to see if we have enough of the button. If so, immediately return
            if (data.count >= count) {
                return true
            }

            await getBuildingState(false)

            return false
        },
        onClick: async () => {
            makeBuilding(buildingId)
        },
        delayBuy: 2500
    })
}