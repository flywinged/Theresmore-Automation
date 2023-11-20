import { logger, navigation, numberParser, selectors } from "../../utils"
import constants from "../../utils/constants"
import { jobs } from "../data"


export const getJobState = async () => {

    // Assume all things are not researched
    for (const [jobId, jobData] of Object.entries(jobs)) {
        jobData.count = 0
        jobData.cap = 0
        if (jobId !== "unemployed") {
            jobData.addDiv = null
            jobData.removeDiv = null
        } else {
            jobData.div = null
        }
    }

    // Make sure we are on the jobs page first
    await navigation.switchPage(constants.PAGES.POPULATION)

    // Grab the main container the has all the required data and list all the currently available jobs
    const container = document.querySelector('#maintabs-container > div > div[role=tabpanel]')
    const availableJobs = [...container.querySelectorAll('h5')]

    // For each visible job, grab information about the current job state
    availableJobs.forEach(job => {
        let id = job.textContent.replace(" ", "_").toLowerCase()
        const jobData = jobs[id]
        if (!jobData) {
            console.log(id)
            logger({msgLevel: "error", msg: "unable to find job data"})
        }

        let jobContainer = job.parentElement.parentElement
        jobData.count = +job.parentElement.parentElement.querySelector('input').value.split('/').shift().trim()
        jobData.cap = +job.parentElement.parentElement.querySelector('input').value.split('/').pop().trim()
        jobData.addDiv = jobContainer.querySelector('button.btn-green')
        jobData.removeDiv = jobContainer.querySelector('button.btn-red')

    })

    // Assign the unassing all button to unemployed if able
    const unassignAllButton = document.querySelector('div.flex.justify-center.mx-auto.pt-3.font-bold.text-lg > button')
    if (unassignAllButton) {
        jobs.unemployed.div = unassignAllButton
    }

    const unemployedData = document.querySelector('div.flex.justify-center.mx-auto.pt-3.font-bold.text-lg > span')
    if (unemployedData) {
        let splitData = unemployedData.textContent.split(" / ")
        jobs.unemployed.count = numberParser.parse(splitData[0])
        jobs.unemployed.cap = numberParser.parse(splitData[1])
    }
  
    console.log({jobs})
    return jobs
  }