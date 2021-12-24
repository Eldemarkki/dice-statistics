import { Alert, Button, List, NumberInput, SegmentedControl, Space, Title } from "@mantine/core";
import { useColorScheme, useLocalStorageValue } from "@mantine/hooks";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Dice, { createDie } from "../data/Dice";
import i18n, { languageResources } from "../localization/i18n";

interface DiceControlPanelProps {
  dices: Dice[],
  setDices: (newDices: Dice[]) => void,
  colorScheme: "dark" | "light",
  toggleColorScheme: () => void
}

const DiceControlPanelContainer = styled.div`
  max-width: 320px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const DiceListHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`

const DiceListItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DiceList = styled(List)`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const AddDiceContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 15px;
`

const DicePresetsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  gap: 10px;
`

const DiceLabel = styled.span`
  display: inline-block;
  min-width: 50px;
`

const SettingsPanel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const DiceControlPanel = ({ dices, setDices, colorScheme, toggleColorScheme }: DiceControlPanelProps) => {
  const [sideCount, setSideCount] = useState(6);
  const { t } = useTranslation();

  const themeIcon = colorScheme === "dark" ? <MoonIcon /> : <SunIcon />;

  const addDice = (sides: number) => {
    setDices([...dices, createDie(sides)]);
  }

  const deleteDice = (id: string) => {
    setDices(dices.filter(d => d.id !== id));
  }

  const dicePresets = [4, 6, 8, 10, 12, 20]
  const sideProduct = dices.reduce((p, d) => p * d.sideCount, 1);
  const languageData: any = Object.keys(languageResources).map(key => ({
    value: key,
    label: i18n.t("languageName", { lng: key })
  }))

  const setLanguage = (value: string) => {
    i18n.changeLanguage(value);
  }

  return <DiceControlPanelContainer>
    <div>
      <Title order={2}>{t("addDice")}</Title>
      <AddDiceContainer>
        <NumberInput value={sideCount} onChange={val => setSideCount(val || 6)} min={1} />
        <Button onClick={() => addDice(sideCount)}>{t("add")}</Button>
      </AddDiceContainer>
      <DicePresetsContainer>
        {dicePresets.map(preset => <Button onClick={() => addDice(preset)} color="green" size="xs" key={preset}>d{preset}</Button>)}
      </DicePresetsContainer>
      {sideProduct >= 20 * 20 * 20 * 20 && <Alert icon="⚠️" title={t("diceAmountWarningTitle")} color="red">{t("diceAmountWarningText")}</Alert>}
      <Space />
      {dices.length !== 0 && <DiceListHeader>
        <Title order={2}>{t("dices")}</Title>
        <Button onClick={() => setDices([])} size="xs">{t("removeAll")}</Button>
      </DiceListHeader>}
      <DiceList spacing={5}>
        {dices.map(d => {
          return <List.Item key={d.id}>
            <DiceListItem>
              <DiceLabel>d{d.sideCount}</DiceLabel>
              <Button color="red" size="xs" onClick={() => deleteDice(d.id)}>{t("delete")}</Button>
            </DiceListItem>
          </List.Item>
        })}
      </DiceList>
    </div>
    <div>
      <SettingsPanel>
        <SegmentedControl data={languageData} value={i18n.language} onChange={setLanguage} />
        <Button color={colorScheme} onClick={toggleColorScheme}>{themeIcon}</Button>
      </SettingsPanel>
      <Alert color="gray">{t("correctnessDisclaimer")}</Alert>
    </div>
  </DiceControlPanelContainer>
}