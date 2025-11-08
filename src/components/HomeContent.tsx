import React from 'react'
import SmartPlanner from './SmartPlanner'
import SpiritualMentor from './SpiritualMentor'
// import Journal from './Journal' // 🔧 comment out if missing
// import ChakraLogging from './ChakraLogging'

interface HomeContentProps {
  currentView: string
  onViewChange: (view: string) => void
}

const HomeContent: React.FC<HomeContentProps> = ({
  currentView,
  onViewChange
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SpiritualMentor />
        <SmartPlanner />
      </div>
      {/* <Journal /> */}
    </div>
  )
}

export default HomeContent
