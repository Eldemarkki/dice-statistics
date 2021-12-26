import { Alert, Button, Group, List, NumberInput, SegmentedControl, Space, Title } from "@mantine/core";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Dice, { createDie } from "../data/Dice";
import i18n, { languageResources } from "../localization/i18n";
import { ColorSchemeContext } from "./contexts/ColorSchemeContext";
import { DiceConfiguration } from "./DiceConfiguration";

interface DiceControlPanelProps {
  dices: Dice[],
  setDices: (newDices: Dice[]) => void
}

const DiceControlPanelContainer = styled.div`
  max-width: 330px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`

const DiceListHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const DiceListItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DiceList = styled(List)`
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
`;

const AddDiceContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 15px;
  gap: 15px;
`

const DicePresetsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 15px;
  gap: 10px;
`

const DiceLabel = styled.span`
  display: inline-block;
  min-width: 50px;
`

export const DiceControlPanel = ({ dices, setDices }: DiceControlPanelProps) => {
  const [sideCount, setSideCount] = useState(6);
  const { t } = useTranslation();
  const { theme, setTheme } = useContext(ColorSchemeContext);

  const themeIcon = theme === "dark" ? <SunIcon /> : <MoonIcon />;

  const addDice = (sides: number) => {
    setDices([...dices, createDie(sides)]);
  }

  const deleteDice = (id: string) => {
    setDices(dices.filter(d => d.id !== id));
  }

  const dicePresets = [4, 6, 8, 10, 12, 20]
  const sideProduct = dices.reduce((p, d) => p * d.sideCount, 1);
  const areAllSame = dices.every(d => d.sideCount === dices[0].sideCount);

  const languageData: {
    value: string,
    label: string
  }[] = Object.keys(languageResources).map(key => ({
    value: key,
    label: i18n.t("languageName", { lng: key })
  }))

  const setLanguage = (value: string) => {
    i18n.changeLanguage(value);
  }

  const warningDiceAmount = 20 * 20 * 20 * 20 * 10;

  return <DiceControlPanelContainer>
    <div>
      <Title order={2}>{t("addDice")}</Title>
      <AddDiceContainer>
        <NumberInput value={sideCount} onChange={val => setSideCount(val || 6)} min={1} />
        <Button onClick={() => addDice(sideCount)}>{t("add")}</Button>
      </AddDiceContainer>
      <DicePresetsContainer>
        {dicePresets.map(preset => <Button onClick={() => addDice(preset)} color="green" compact key={preset}>d{preset}</Button>)}
      </DicePresetsContainer>
      {sideProduct >= warningDiceAmount && !areAllSame && <Alert icon="⚠️" title={t("diceAmountWarningTitle")} color="red">{t("diceAmountWarningText")}</Alert>}
      {sideProduct >= warningDiceAmount && areAllSame && <Alert icon="⚠️" title={t("diceAmountWarningTitle")} color="yellow">{t("sameDiceAmountWarningText")}</Alert>}
      <Space />
      {dices.length !== 0 && <div>
        <DiceListHeader>
          <Title order={2}>{t("dices")}</Title>
          <Button onClick={() => setDices([])} size="xs" variant="outline" color="red">{t("removeAll")}</Button>
        </DiceListHeader>
        <DiceConfiguration dices={dices.map(d => d.sideCount)} />
      </div>
      }
    </div>
    <DiceList spacing={5}>
      {dices.map(d => {
        return <List.Item key={d.id}>
          <DiceListItem>
            <DiceLabel>d{d.sideCount}</DiceLabel>
            <Button color="red" size="xs" variant="outline" onClick={() => deleteDice(d.id)}>{t("delete")}</Button>
          </DiceListItem>
        </List.Item>
      })}
    </DiceList>
    <Group position="apart">
      <SegmentedControl data={languageData} value={i18n.language} onChange={setLanguage} />
      <Button color={theme === "dark" ? "light" : "dark"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{themeIcon}</Button>
    </Group>
  </DiceControlPanelContainer>
}