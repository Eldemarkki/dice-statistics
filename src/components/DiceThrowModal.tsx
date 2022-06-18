import { Col, Divider, Grid, Group, Text } from '@mantine/core'
import { useInterval } from '@mantine/hooks';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Dice from '../data/Dice'

interface DiceThrowModalProps {
  dices: Dice[]
  diceModifier: number
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

export const DiceThrowModal = ({ dices, diceModifier }: DiceThrowModalProps) => {
  const revealDelay = 600;
  const [startSeed, setStartSeed] = useState(0);
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const [throws, setThrows] = useState<{
    number: number,
    id: string
  }[]>([]);

  useEffect(() => {
    setStartSeed(Math.random());
    setInterval(() => {
      setRevealed(true)
    }, revealDelay)
  }, [])

  useEffect(() => {
    setThrows(dices.map(dice => {
      const number = Math.floor(Math.random() * dice.sideCount + 1);
      return {
        number,
        id: dice.id,
      }
    }));
  }, [dices, startSeed])

  const normalSum = throws.reduce((p, t) => p + t.number, 0)

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
          <Group position="apart" mb={5}>
            <Text size="lg">{t("sum")}:</Text>
            {diceModifier ?
              <Text size="lg">{normalSum + diceModifier} = {normalSum} {diceModifier ? (diceModifier > 0 ? `+ (${diceModifier})` : `- (${-diceModifier})`) : ""}</Text> :
              <Text size="lg">{normalSum}</Text>
            }
          </Group>
          <Group position="apart">
            <Text size="lg">{t("average")}:</Text>
            <Text size="lg">{(normalSum / throws.length).toFixed(2)}</Text>
          </Group>
        </div>
      }
    </div>
  )
}
