import {
  Button,
  Container,
  Text,
  Muted,
  render,
  TextboxNumeric,
  VerticalSpace,
  Columns,
  useWindowResize
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback, useState } from 'preact/hooks'
import { motion } from 'framer-motion'

import { ResizeWindowHandler } from './types'

interface SpringParams {
  stiffness: number
  damping: number
}

function getSpringParams(duration: number, bounce: number): SpringParams {
  const convertDuration = duration * 0.001
  const stiffness = Math.pow((2 * Math.PI) / convertDuration, 2)
  const damping =
    bounce >= 0 ? ((1 - bounce) * 4 * Math.PI) / convertDuration : (4 * Math.PI) / (convertDuration * (1 + bounce))
  return { stiffness, damping }
}

// Add these constants at the top of the file after imports
const DEFAULT_DURATION = 300
const DEFAULT_BOUNCE = 0.1

function Plugin() {
  const [duration, setDuration] = useState<number | null>(DEFAULT_DURATION)
  const [bounce, setBounce] = useState<number | null>(DEFAULT_BOUNCE)
  // 计算默认的 stiffness 和 damping
  const defaultSpring = getSpringParams(DEFAULT_DURATION, DEFAULT_BOUNCE)
  const [stiffness, setStiffness] = useState<number | null>(defaultSpring.stiffness)
  const [damping, setDamping] = useState<number | null>(defaultSpring.damping)
  const [animationKey, setAnimationKey] = useState(0)

  useWindowResize(function (windowSize: { width: number; height: number }) {
    emit<ResizeWindowHandler>('RESIZE_WINDOW', windowSize)
  })

  // Add handleSetDefaultClick function
  const handleSetDefaultClick = useCallback(() => {
    setDuration(DEFAULT_DURATION)
    setBounce(DEFAULT_BOUNCE)
    const { stiffness, damping } = getSpringParams(DEFAULT_DURATION, DEFAULT_BOUNCE)
    setStiffness(stiffness)
    setDamping(damping)
    setAnimationKey(prevKey => prevKey + 1)
  }, [])

  const handleConvertButtonClick = useCallback(() => {
    if (duration !== null && bounce !== null) {
      const { stiffness, damping } = getSpringParams(duration, bounce)
      setStiffness(stiffness)
      setDamping(damping)
      setAnimationKey(prevKey => prevKey + 1); // 更新状态变量以触发动画重新播放
    }
  }, [duration, bounce])

  const handleCopyClick = useCallback(() => {
    if (stiffness !== null && damping !== null) {
      const text = `stiffness: ${stiffness.toFixed(2)}, damping: ${damping.toFixed(2)}`
      navigator.clipboard.writeText(text)
    }
  }, [stiffness, damping])

  return (
    <Container space="medium" style={{ width: '100%', height: '100%' }}>
      <VerticalSpace space="medium" />
      <Container space="small" style={{ height: '80px', backgroundColor: 'var(--figma-color-bg-secondary)', borderRadius: '6px' }}>
      <VerticalSpace space="extraSmall" />
        <motion.div
          key={animationKey} // 使用状态变量作为 key 来触发重新渲染
          animate={{ x: 100 }}
          transition={{ type: 'spring', stiffness: stiffness ?? 100, damping: damping ?? 10 }}
          style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: 'var(--figma-color-bg-brand)',
            borderRadius: '6px',
            margin: '16px'
          }}
        />
      </Container>
      <VerticalSpace space="medium" />
      <Text>Duration (ms)</Text>
      <VerticalSpace space="extraSmall" />
      <TextboxNumeric
        onNumericValueInput={setDuration}
        value={duration?.toString() ?? ''}
        variant="border"
      />
      <VerticalSpace space="medium" />
      <Text>Bounce</Text>
      <VerticalSpace space="extraSmall" />
      <TextboxNumeric
        onNumericValueInput={setBounce}
        value={bounce?.toString() ?? ''}
        variant="border"
      />
      <VerticalSpace space="medium" />
      <Columns space="small">
        <Button fullWidth onClick={handleConvertButtonClick}>
          Convert
        </Button>
        <Button fullWidth onClick={handleSetDefaultClick} secondary>
          Use Default
        </Button>
      </Columns>
      <VerticalSpace space="medium" />
      <Text><Muted>Spring Parameters</Muted></Text>
        <VerticalSpace space="small" />
        <Text>Stiffness: {stiffness?.toFixed(2)}, Damping: {damping?.toFixed(2)}</Text>
      
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)