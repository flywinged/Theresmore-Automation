import { generateResourceBonus } from "./generates";

const createAncestor = (text, requires, generates) => {
    return {
        text,
        count: 0,
        requires,
        generates
    }
}

export default {

    farming : createAncestor(
        "Your ancestors have mastered the best farming techniques and food will never be a problem for your people",
        [],
        [generateResourceBonus("food", 0.1)]
    ),

    gathering : createAncestor(
        "Your ancestors knew the best places to cut good wood and dig the finest stone",
        [],
        ["stone", "wood"].map(resource => generateResourceBonus(resource, 0.1))
    ),

    mining : createAncestor(
        "Your ancestors knew how to refine metals and they used tools of rare workmanship",
        [],
        ["iron", "copper", "tools"].map(resource => generateResourceBonus(resource, 0.1))
    )
}