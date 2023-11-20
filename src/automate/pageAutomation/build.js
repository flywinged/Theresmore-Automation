import constants from '../../utils/constants'
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
        before: async() => {
            await getBuildingState(false)
        },
        onClick: async () => {
            makeBuilding(buildingId)
        },
        delayBuy: 2500
    })
}