export interface TranslationResource {
  translation: {
    languageName: string,
    addDice: string,
    add: string,
    diceAmountWarningTitle: string,
    diceAmountWarningText: string,
    dices: string,
    removeAll: string,
    delete: string,
    correctnessDisclaimer: string,
    sum: string
  }
}

export const englishData: TranslationResource = {
  translation: {
    languageName: "English",
    addDice: "Add dice",
    add: "Add",
    diceAmountWarningTitle: "That's a lot of dice",
    diceAmountWarningText: "Adding more dice may slow the website down",
    dices: "Dices",
    removeAll: "Remove all",
    delete: "Delete",
    correctnessDisclaimer: "I take no responsibility for the correctness of this website",
    sum: "Sum"
  }
}

export const finnishData: TranslationResource = {
  translation: {
    languageName: "Suomi",
    addDice: "Lisää noppia",
    add: "Lisää",
    diceAmountWarningTitle: "Onpas paljon noppia",
    diceAmountWarningText: "Uusien noppien lisääminen saattaa hidastaa verkkosivua",
    dices: "Nopat",
    removeAll: "Poista kaikki",
    delete: "Poista",
    correctnessDisclaimer: "En ota vastuuta tämän verkkosivun oikeellisuudesta",
    sum: "Summa"
  }
}