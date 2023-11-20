import { selectors, logger, numberParser } from '../../utils'

// Get all the buttons currently on the screen
export default (
    referenceData,
) => {
    
    // Grab the buttons and their data before trying to do anything else
    const buttonsDivs = selectors.getAllButtons(false)

    // Construct the buttons object
    let buttons = {}
    buttonsDivs.forEach(div => {

        // Extract the id. This is normally what lines up with the id in the data object
        let buttonText = div.textContent.replace(/[0-9]/g, '')
        let count = numberParser.parse(div.textContent.replace(buttonText, ''))
        if (!count) {
            count = 0
        }

        let id = buttonText.replace(" ", "_").toLowerCase()

        // Extract information about this particular button from the data.
        // Warn if unable to find it
        let buttonData = referenceData[id]
        if (!buttonData) {
            logger({msgLevel: "error", msg: "could not find data for button " + buttonText})
            return
        }

        buttons[id] = {
            div,
            count
        }
    })
    
    return buttons
}