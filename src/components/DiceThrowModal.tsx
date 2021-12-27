import { Col, Divider, Grid, Group, Text } from '@mantine/core'
import { useInterval } from '@mantine/hooks';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Dice from '../data/Dice'
var seedrandom = require("seedrandom");

interface DiceThrowModalProps {
  dices: Dice[]
}

interface DiceThrowProps {
  number: number;
  revealed: boolean;
}

const DiceThrow = ({ number, revealed }: DiceThrowProps) => {
  const randomGarbageRate = 50;
  const [, setGarbageIndex] = useState(0);
  const { start, stop } = useInterval(() => {
    setGarbageIndex(s => s + 1)
  }, randomGarbageRate)

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // For some reason, `start` and `stop` can NOT be dependencies here, or otherwise it won't work

  if (!revealed) return <Text style={{ textAlign: "center" }} size='xl' weight="lighter">{Math.floor(Math.random() * 1000) + 1}</Text>
  return <Text style={{ textAlign: "center" }} size='xl' weight="bold">{number}</Text>
}

export const DiceThrowModal = ({ dices }: DiceThrowModalProps) => {
  const revealDelay = 600;
  const [startSeed, setStartSeed] = useState(0);
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);

  setInterval(() => {
    setRevealed(true)
  }, revealDelay)

  useEffect(() => {
    setStartSeed(Math.random());
  }, [])

  const throws = dices.map(dice => {
    const random01 = seedrandom(String(startSeed) + dice.id)()
    const number = Math.floor(random01 * dice.sideCount) + 1;
    return {
      number,
      id: dice.id,
    }
  })

  return (
    <div>
      <Grid mb={20} grow>
        {throws.map(t => {
          return <Col span={1} key={t.id}><DiceThrow number={t.number} revealed={revealed} /></Col>
        })}
      </Grid>
      {revealed &&
        <div>
          <Divider mb={20} />
          <Group position="apart" style={{ maxWidth: 140 }} mb={5}>
            <Text size="lg">{t("sum")}:</Text>
            <Text size="lg">{throws.reduce((p, t) => p + t.number, 0)}</Text>
          </Group>
          <Group position="apart" style={{ maxWidth: 140 }}>
            <Text size="lg">{t("average")}:</Text>
            <Text size="lg">{(throws.reduce((p, t) => p + t.number, 0) / throws.length).toFixed(2)}</Text>
          </Group>
        </div>
      }
    </div>
  )
}
