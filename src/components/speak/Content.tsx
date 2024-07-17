import { useContext } from 'react'
import { AppContext } from '@contexts/AppContext'

import MobileDetect from 'mobile-detect'

import SpeakCSS from '@stylesheets/speak.module.scss'

import { PageSequenceProps, SpeakPageProps } from '@interfaces/ISpeak'

import SpeakPage from './SpeakPage'

type ContentProps = {
  pageNumber: number
  pageSeq: PageSequenceProps
  speakData: SpeakPageProps[]
  clickSentence: (pageNumber: number, sequnece: number) => void
}

const md = new MobileDetect(navigator.userAgent)
const isMobile = md.phone()

export default function Content({
  pageNumber,
  pageSeq,
  speakData,
  clickSentence,
}: ContentProps) {
  const bookLevel =
    useContext(AppContext)?.bookInfo?.BookLevel?.substring(0, 1) || 'K'

  let style

  if (isMobile) {
    const windowWidth = window.innerWidth
    const eBookSizeW = bookLevel === 'k' ? 480 : 525
    const eBookViewerScale = windowWidth / eBookSizeW
    const mobilePositionTopSubtractValue =
      ((windowWidth / eBookSizeW) * 750) / 2

    style = {
      transform: `scale(${eBookViewerScale})`,
      top: `calc(50% - ${mobilePositionTopSubtractValue + 4}px)`,
    }
  } else {
    const windowHeight = window.innerHeight
    const eBookViewerScale = (windowHeight - 92) / 750 || 1

    style = {
      transform: `scale(${eBookViewerScale})`,
    }
  }

  return (
    <div className={SpeakCSS.speakBody}>
      <div style={style} className={SpeakCSS.ebookViewer}>
        {isMobile ? (
          <SpeakPage
            pageNumber={pageNumber}
            pageSeq={pageSeq}
            speakData={speakData}
            clickSentence={clickSentence}
          />
        ) : (
          <>
            <SpeakPage
              pageNumber={pageNumber % 2 === 0 ? pageNumber - 1 : pageNumber}
              pageSeq={pageSeq}
              speakData={speakData}
              clickSentence={clickSentence}
            />
            <SpeakPage
              pageNumber={pageNumber % 2 === 0 ? pageNumber : pageNumber + 1}
              pageSeq={pageSeq}
              speakData={speakData}
              clickSentence={clickSentence}
            />
          </>
        )}
      </div>
    </div>
  )
}