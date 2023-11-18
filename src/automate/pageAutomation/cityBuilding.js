import constants from '../../utils/constants'
import { buildings } from '../data'
import { makeBuilding } from '../state/building'
import buy from './buy'

export default (buildingId, count) => {
    return buy({
        id: buildingId,
        count: count,
        page: constants.PAGES.BUILD,
        subpage: constants.SUBPAGES.CITY,
        referenceData: buildings,
        onClick: () => {
            makeBuilding(buildingId)
        },
        delayBuy: 2500
    })
}