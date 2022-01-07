export interface TranslationResource {
  translation: {
    languageName: string,
    addDice: string,
    add: string,
    diceAmountWarningTitle: string,
    diceAmountWarningText: string,
    sameDiceAmountWarningText: string,
    dices: string,
    removeAll: string,
    delete: string,
    sum: string,
    noStatistics: string,
    throwingDiceTitle: string,
    average: string,
    throw: string,
    smallChanceDisclaimer: string
  }
}

export const englishData: TranslationResource = {
  translation: {
    languageName: "English",
    addDice: "Add dice",
    add: "Add",
    diceAmountWarningTitle: "That's a lot of dice",
    diceAmountWarningText: "Adding more dice may slow the website down",
    sameDiceAmountWarningText: "Adding a dice with some other amount of sides may be slow",
    dices: "Dices",
    removeAll: "Remove all",
    delete: "Delete",
    sum: "Sum",
    noStatistics: "No statistics yet, add some dices on the left panel",
    throwingDiceTitle: "Throwing dice...",
    average: "Average",
    throw: "Throw",
    smallChanceDisclaimer: "Very small chance, but not 0%"
  }
}

export const finnishData: TranslationResource = {
  translation: {
    languageName: "Suomi",
    addDice: "Lisää noppia",
    add: "Lisää",
    diceAmountWarningTitle: "Onpas paljon noppia",
    diceAmountWarningText: "Uusien noppien lisääminen saattaa hidastaa verkkosivua",
    sameDiceAmountWarningText: "Uuden nopan, jolla on eri määrä sivuja lisääminen voi olla hidasta",
    dices: "Nopat",
    removeAll: "Poista kaikki",
    delete: "Poista",
    sum: "Summa",
    noStatistics: "Ei tilastoja vielä, lisää noppia vasemmalla olevasta paneelista",
    throwingDiceTitle: "Heitetään noppia...",
    average: "Keskiarvo",
    throw: "Heitä",
    smallChanceDisclaimer: "Hyvin pieni mahdollisuus, mutta ei 0%"
  }
}