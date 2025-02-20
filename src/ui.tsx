import {
  Button,
  Container,
  Text,
  Muted,
  render,
  TextboxNumeric,
  VerticalSpace,
  Tabs,
  TabsOption,
  Code,
  Columns,
  useWindowResize,
  IconButton,
  IconCode16,
  Link,
  Banner
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

// type TabValue = 'preview' | 'code'
type Platform =  'tux' | 'ios' | 'android' | 'web'

const platformDisplayNames = {
  tux: 'TUXMotionCurve (iOS & Android)',
  ios: 'iOS',
  android: 'Android',
  web: 'Framer Motion (Web)',
} as const;

const TabOptions: Array<TabsOption> = [{
  children: <div></div>,
  value: 'preview'
}, {
  children: <div></div>,
  value: 'code'
},];

// const TABS = [
//   { value: 'preview', children: 'Preview' },
//   { value: 'code', children: 'Code' }
// ]

function Plugin() {
  const [duration, setDuration] = useState<number | null>(DEFAULT_DURATION)
  const [bounce, setBounce] = useState<number | null>(DEFAULT_BOUNCE)
  // 计算默认的 stiffness 和 damping
  const defaultSpring = getSpringParams(DEFAULT_DURATION, DEFAULT_BOUNCE)
  const [stiffness, setStiffness] = useState<number | null>(defaultSpring.stiffness)
  const [damping, setDamping] = useState<number | null>(defaultSpring.damping)
  const [animationKey, setAnimationKey] = useState(0)
  const [selectedTab, setSelectedTab] = useState<string>('preview')
  const [copiedStates, setCopiedStates] = useState({
    ios: false,
    android: false,
    web: false,
    tux: false
  })



  useWindowResize(function (windowSize: { width: number; height: number }) {
    emit<ResizeWindowHandler>('RESIZE_WINDOW', windowSize)
  })

  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value)
  }, [])

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

  const generateCode = useCallback((platform: Platform) => {
    if (stiffness === null || damping === null || duration === null) return ''

    const response = (duration || 0) / 1000
    const dampingRatio = damping / (2 * Math.sqrt(stiffness)) // Calculate dampingRatio

    switch (platform) {
      case 'tux':
        return `TUXMotion.Spring(
      stiffness:${stiffness.toFixed(2)},
      damping:${damping.toFixed(2)}
  )`
      case 'ios':
        return `UISpringTimingParameters(
  mass: 1,
  stiffness: ${stiffness.toFixed(2)},
  damping: ${damping.toFixed(2)},
  initialVelocity: CGVector(dx: 0, dy: 0)
)`
      case 'android':
        return `val spring = SpringForce().apply {
  stiffness = ${stiffness.toFixed(2)}f
  dampingRatio = ${dampingRatio.toFixed(2)}f
}`
      case 'web':
        return `
        transition={{ type: 'spring', stiffness: ${stiffness.toFixed(2)}, damping: ${damping.toFixed(2)} }}
        `
      default:
        return ''
    }
  }, [stiffness, damping, duration])

  // Add copy function
  const handleCopyCode = useCallback((platform: Platform) => {
    const code = generateCode(platform)
    navigator.clipboard.writeText(code)
    setCopiedStates(prev => ({ ...prev, [platform]: true }))
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [platform]: false }))
    }, 2000)
  }, [generateCode])

  return (
    <div>
      <Tabs
        options={TabOptions}
        value={selectedTab}
        onValueChange={handleTabChange}
      />

      {selectedTab === 'preview' ? (
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
              backgroundColor: 'var(--figma-color-bg-inverse)',
              borderRadius: '6px',
              margin: '16px'
            }}
          />
        </Container>
        <VerticalSpace space="medium" />
        <Text>Duration (ms)</Text>
        <VerticalSpace space="extraSmall" />
        <TextboxNumeric
          minimum={0}
          incrementBig={100}
          onNumericValueInput={setDuration}
          value={duration?.toString() ?? ''}
          variant="border"
        />
        <VerticalSpace space="medium" />
        <Text>Bounce</Text>
        <VerticalSpace space="extraSmall" />
        <TextboxNumeric
          minimum={0}
          maximum={1}
          incrementSmall={0.1}
          onNumericValueInput={setBounce}
          value={bounce?.toString() ?? ''}
          variant="border"
        />
        <VerticalSpace space="medium" />
        <Columns space="small">
          <Button style={{backgroundColor: 'var(--figma-color-bg-inverse)', color: 'var(--figma-color-text-oninverse)'}}fullWidth onClick={handleConvertButtonClick}>
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
      ) : (
        // Code view
        <div>
          <Banner icon={<IconCode16 />}><Link href="https://bytedance.sg.larkoffice.com/docx/L2JddNjOYowaPIxfl0fllZi1ghZ" target="_blank">TuxMotionCurve component</Link> is ready for dev!</Banner>
        <Container space="medium">
          <VerticalSpace space="medium" />
          {(['tux','web'] as Platform[]).map(platform => (
  <div key={platform}>
    <Text><Muted>{platformDisplayNames[platform]}</Muted></Text>
    {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
    </div> */}
    <VerticalSpace space="small" />
    <Code>{generateCode(platform)}</Code>
    {copiedStates[platform] && <Text><Muted>Copied!</Muted></Text>}
    <VerticalSpace space="medium" />
  </div>
))}

        </Container>
        </div>
      )}
    </div>

  )
}

export default render(Plugin)