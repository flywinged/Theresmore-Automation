

export const generateResource = (id, value) => {
    return {
        type: "resource",
        id: id,
        value: value,
        bonus: {}
    }
}

export const generateResourceBonus = (id, value) => {
    return {
        type: "modifier",
        modifierType: "resource",
        id: id,
        value: value
    }
}

export const generateResourceCap = (id, value) => {
    return {
        type: "cap",
        id: id,
        value: value
    }
}

export const generateJob = (id, value) => {
    return {
        type: "job",
        id: id,
        value: value
    }
}

export const generateJobBonus = (jobId, resourceId, value) => {
    return {
        type: "modifier",
        modifierType: "job_bonus",
        jobId: jobId,
        resourceId: resourceId,
        value: value
    }
}