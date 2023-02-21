import { factions, locations, units } from '../data'
import { CONSTANTS, navigation, logger, sleep, state, resources, selectors, translate, armyCalculator } from '../utils'

const fights = factions
  .concat(locations)
  .filter((fight) => !fight.id.includes('orc_war_party_'))
  .map((fight) => {
    return {
      key: fight.id,
      id: translate(fight.id),
      army: fight.army,
      level: fight.level,
    }
  })
  .filter((fight) => typeof fight.level !== 'undefined')

const factionFights = factions.map((faction) => faction.id)

const userEnabled = () => {
  return (
    (state.options.pages[CONSTANTS.PAGES.ARMY].enabled || false) &&
    (state.options.pages[CONSTANTS.PAGES.ARMY].subpages[CONSTANTS.SUBPAGES.ATTACK].enabled || false)
  )
}

const executeAction = async () => {
  if (!navigation.checkPage(CONSTANTS.PAGES.ARMY, CONSTANTS.SUBPAGES.ATTACK)) return
  if (state.scriptPaused) return

  const container = document.querySelector('div.tab-container.sub-container')

  if (container) {
    const boxes = [...container.querySelectorAll('div.grid > div.flex')]
    const controlBox = boxes.shift()
    let enemyList = []
    let targetSelected = false
    let army = []
    let userUnits = []
    let target

    const enemySelectorButton = controlBox.querySelector('button.btn')
    const sendToAttackButton = [...controlBox.querySelectorAll('button.btn')].find((button) => button.innerText.includes('Send to attack'))

    if (enemySelectorButton && !enemySelectorButton.disabled && !state.stopAttacks) {
      enemySelectorButton.click()
      await sleep(25)
      const modal = [...document.querySelectorAll('h3.modal-title')].find((h3) => h3.innerText.includes('enemies'))

      if (modal) {
        enemyList = [...modal.parentElement.querySelectorAll('h5')]
          .map((h5) => {
            const enemyDetails = fights.find((fight) => fight.id === h5.innerText.trim())

            return {
              button: h5,
              ...enemyDetails,
            }
          })
          .filter((fight) => state.options.pages[CONSTANTS.PAGES.ARMY].subpages[CONSTANTS.SUBPAGES.ATTACK].options[fight.key])

        enemyList.sort((a, b) => {
          let aLevel = a.level || 0
          let bLevel = b.level || 0

          if (factionFights.includes(a.key)) {
            aLevel -= 100
          }

          if (factionFights.includes(b.key)) {
            bLevel -= 100
          }

          return aLevel - bLevel
        })

        if (enemyList.length) {
          target = enemyList.shift()
          targetSelected = true
          target.button.click()
          await sleep(1000)
        } else {
          targetSelected = false
          const closeButton = modal.parentElement.parentElement.parentElement.querySelector('div.absolute > button')
          if (closeButton) {
            closeButton.click()
            await sleep(25)
          }
        }
      }
    }

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i]
      const name = box.querySelector('h5.font-bold').innerText.trim()
      let removeUnitButton = box.querySelector('div.inline-flex button.btn-red')
      const addUnitButton = box.querySelector('div.inline-flex button.btn-green')

      while (removeUnitButton) {
        removeUnitButton.click()
        await sleep(25)
        removeUnitButton = box.querySelector('div.inline-flex button.btn-red')
      }

      if (state.stopAttacks || !targetSelected || !target) {
        continue
      }

      const unitDetails = armyCalculator.applyUnitMods(units.find((unit) => translate(unit.id, 'uni_') === name))

      userUnits.push({
        ...unitDetails,
        key: unitDetails.id,
        id: name,
        box,
        removeUnitButton,
        addUnitButton,
      })
    }

    if (targetSelected && target && !state.stopAttacks) {
      army = armyCalculator.getEnemyArmy(target.key)

      if (army.length && userUnits.length && sendToAttackButton) {
        const enemyStats = armyCalculator.calculateEnemyStats(army)

        const userStats = {
          attack: [0, 0, 0, 0, 0],
          defense: [0, 0, 0, 0, 0],
        }

        const sortMethod = (type = 'defense') => {
          return (a, b) => {
            const aHasAdvantage = a.category !== 4 ? enemyStats.defense[a.category + 1] : enemyStats.defense[1]
            const bHasAdvantage = b.category !== 4 ? enemyStats.defense[b.category + 1] : enemyStats.defense[1]

            const aGivesAdvantage = a.category !== 1 ? enemyStats.attack[a.category - 1] : enemyStats.attack[4]
            const bGivesAdvantage = b.category !== 1 ? enemyStats.attack[b.category - 1] : enemyStats.attack[4]

            if (aGivesAdvantage === bGivesAdvantage) {
              if (aHasAdvantage === bHasAdvantage) {
                if (type === 'defense') {
                  return b.defense - a.defense
                } else {
                  return b.attack - a.attack
                }
              } else {
                return bHasAdvantage - aHasAdvantage
              }
            } else {
              return aGivesAdvantage - bGivesAdvantage
            }
          }
        }

        const defUnits = [...userUnits].sort(sortMethod('defense'))
        const attUnits = [...userUnits].sort(sortMethod('attack'))

        let gotDef = false
        let gotAtt = false
        for (let i = 0; i < defUnits.length; i++) {
          if (gotDef) break

          const unit = defUnits[i]

          while (!gotDef) {
            const damages = armyCalculator.calculateDamages(enemyStats, userStats)
            if (damages.enemy.enemyDefense < damages.user.userAttack) gotAtt = true
            if (damages.enemy.enemyAttack < damages.user.userDefense) gotDef = true
            if (gotDef) break

            unit.removeUnitButton = unit.box.querySelector('div.inline-flex button.btn-red')
            unit.addUnitButton = unit.box.querySelector('div.inline-flex button.btn-green')

            if (unit.addUnitButton) {
              unit.addUnitButton.click()
              await sleep(50)

              if (sendToAttackButton.classList.toString().includes('btn-off')) {
                unit.removeUnitButton.click()
                await sleep(50)
                break
              }

              userStats.attack[unit.category] += unit.attack
              userStats.defense[unit.category] += unit.defense
            } else {
              break
            }
          }
        }

        if (!gotAtt) {
          for (let i = 0; i < attUnits.length; i++) {
            if (gotAtt) break

            const unit = attUnits[i]

            while (!gotAtt) {
              const damages = armyCalculator.calculateDamages(enemyStats, userStats)
              if (damages.enemy.enemyDefense < damages.user.userAttack) gotAtt = true
              if (damages.enemy.enemyAttack < damages.user.userDefense) gotDef = true
              if (gotAtt) break

              unit.removeUnitButton = unit.box.querySelector('div.inline-flex button.btn-red')
              unit.addUnitButton = unit.box.querySelector('div.inline-flex button.btn-green')

              if (unit.addUnitButton) {
                unit.addUnitButton.click()
                await sleep(50)

                if (sendToAttackButton.classList.toString().includes('btn-off')) {
                  unit.removeUnitButton.click()
                  await sleep(50)
                  break
                }

                userStats.attack[unit.category] += unit.attack
                userStats.defense[unit.category] += unit.defense
              } else {
                break
              }
            }
          }
        }

        if (state.scriptPaused) return

        if (gotAtt && gotDef && targetSelected) {
          logger({ msgLevel: 'log', msg: `Launching attack against ${target.id}` })
          sendToAttackButton.click()
          await sleep(50)
        } else {
          for (let i = 0; i < userUnits.length; i++) {
            let removeUnitButton = userUnits[i].box.querySelector('div.inline-flex button.btn-red')
            while (removeUnitButton) {
              removeUnitButton.click()
              await sleep(25)
              removeUnitButton = userUnits[i].box.querySelector('div.inline-flex button.btn-red')
            }
          }
        }
      }
    }
  }
}

export default {
  page: CONSTANTS.PAGES.ARMY,
  subpage: CONSTANTS.SUBPAGES.ATTACK,
  enabled: () =>
    userEnabled() &&
    navigation.hasPage(CONSTANTS.PAGES.ARMY) &&
    new Date().getTime() - (state.lastVisited[`${CONSTANTS.PAGES.ARMY}${CONSTANTS.SUBPAGES.ATTACK}`] || 0) > 35 * 1000,
  action: async () => {
    await navigation.switchSubPage(CONSTANTS.SUBPAGES.ATTACK, CONSTANTS.PAGES.ARMY)

    if (navigation.checkPage(CONSTANTS.PAGES.ARMY, CONSTANTS.SUBPAGES.ATTACK)) await executeAction()
  },
}
