import constants from '../../utils/constants'
import { error } from '../../utils/logger'
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

            // Check to see if the requested data even exists. If not, log a warning and continue
            let data = research[researchId]
            if (!data) {
                error("unable to find reference data for")
                return true
            }
        
            // Check to see if we have enough of the button. If so, immediately return
            if (data.count >= 1) {
                return true
            }

            await getResearchState(false)

            return false
        },
        onClick: async () => {
            completeResearch(researchId)
        }
    })
}