export const requireResearch = (id) => {
    return {
        type: "research",
        id: id,
        count: 1
    }
}

export const requireBuilding = (id, value) => {
    return {
        type: "building",
        id: id,
        value: value,
    }
}

export const requireResource = (id, value, multiplier) => {
    return {
        type: "resource",
        id: id,
        value: value,
        multiplier: multiplier
    }
}
