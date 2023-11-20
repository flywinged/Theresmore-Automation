import constants from '../../utils/constants'
import { research } from '../data'
import { completeResearch, getResearchState } from '../state/research'
import buy from './buy'

export const automateResearch = (researchId) => {
    return buy({
        id: researchId,
        count: 1,
        page: constants.PAGES.RESEARCH,
        subpage: constants.SUBPAGES.RESEARCH,
        referenceData: research,
        before: async () => {
            await getResearchState(false)
        },
        onClick: async () => {
            completeResearch(researchId)
        }
    })
}