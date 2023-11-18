import constants from '../../utils/constants'
import { research } from '../data'
import { completeResearch } from '../state/research'
import buy from './buy'

export default (researchId) => {
    return buy({
        id: researchId,
        count: 1,
        page: constants.PAGES.RESEARCH,
        subpage: constants.SUBPAGES.RESEARCH,
        referenceData: research,
        onClick: () => {
            completeResearch(researchId)
        }
    })
}