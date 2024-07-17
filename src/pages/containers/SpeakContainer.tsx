import { useContext, useEffect, useState } from 'react'
import { AppContext, AppContextProps } from '@contexts/AppContext'

import '@stylesheets/fonts/font.scss'
import SpeakCSS from '@stylesheets/speak.module.scss'

import MobileDetect from 'mobile-detect'

import { useFetchSpeak } from '@hooks/study/useFetch'
import { getSpeakData } from '@services/speakApi'

import SpeakPC from '@pages/speak/SpeakPC'
import SpeakMobile from '@pages/speak/SpeakMobile'

const md = new MobileDetect(navigator.userAgent)
const isMobile = md.phone()

export type PlayBarState =
  | ''
  | 'playing-sentence'
  | 'recording'
  | 'playing-user-audio'
  | 'correct'
  | 'incorrect'

export default function SpeakContainer() {
  const { handler, studyInfo, bookInfo } = useContext(
    AppContext,
  ) as AppContextProps

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  const [isStepIntro, setStepIntro] = useState(true)

  // 퀴즈 데이터 / 저장된 데이터
  const [speakData, recordedData] = useFetchSpeak(getSpeakData, {
    mode: studyInfo.mode,
    studentHistoryId: studyInfo.studentHistoryId,
    studyId: studyInfo.studyId,
  })
  const [tryCount, setTryCount] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [playBarState, setPlayBarState] = useState<PlayBarState>('')
  const [userAudio, setUserAudio] = useState('')

  // 창 크기가 변경되거나 가로/세로가 변경되는 등의 행위가 일어나면
  useEffect(() => {
    const resizeHandler = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }

    resizeHandler()

    // resize시 넓이 / 높이 조절
    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [isMobile, windowHeight])

  useEffect(() => {
    if (speakData) {
      // 현재 퀴즈 번호
      let nextIndex = 0

      if (recordedData.length > 0) {
        // 기록이 있는 경우
        const laseRecordedData = recordedData[recordedData.length - 1]

        const lastIndex = speakData.findIndex(
          (data) =>
            data.Page === laseRecordedData.Page &&
            data.Sequence === laseRecordedData.Sequence &&
            data.DataPath !== '',
        )

        nextIndex = lastIndex + 1
      }

      while (true) {
        if (
          speakData[nextIndex].Contents !== '' &&
          speakData[nextIndex].DataPath !== ''
        ) {
          break
        }

        nextIndex++
      }

      setQuizIndex(nextIndex)
    }
  }, [speakData])

  /**
   * 스피킹 데이터 index값 변경
   * @param index
   */
  const changeQuizIndex = (index: number) => {
    setQuizIndex(index)
  }

  /**
   * 하단 play bar 상태 변경
   * @param state
   */
  const changePlayBarState = (state: PlayBarState) => {
    setPlayBarState(state)
  }

  /**
   * 시도 횟수 증가
   */
  const increaseTryCount = () => {
    setTryCount(tryCount + 1)
  }

  /**
   * 시도 횟수 초기화
   */
  const resetTryCount = () => {
    setTryCount(0)
  }

  const closeStepIntro = () => {
    setStepIntro(false)
  }

  if (!speakData) return <>Loading...</>

  // 디폴트 화면
  return (
    // <iframe
    //   src={`./static/speak/index.html?studyId=${studyInfo.studyId}&studentHistoryId=${studyInfo.studentHistoryId}&token=${studyInfo.token}&isMobile=${isMobile}&bookLevel=${bookInfo.BookLevel}&isDev=${studyInfo.isDev}`}
    //   style={{ border: 'none', width: windowWidth, height: windowHeight }}
    //   sandbox="allow-scripts allow-same-origin allow-popups allow-modals"
    // ></iframe>
    <>
      {isStepIntro ? (
        <div className={SpeakCSS.screenBlock}>
          <div
            className={SpeakCSS.startButton}
            onClick={() => closeStepIntro()}
          >
            Let's Speak!
          </div>
        </div>
      ) : (
        <>
          {isMobile ? (
            <SpeakMobile
              playBarState={playBarState}
              tryCount={tryCount}
              speakData={speakData}
              quizIndex={quizIndex}
              changeQuizIndex={changeQuizIndex}
              changePlayBarState={changePlayBarState}
              increaseTryCount={increaseTryCount}
              resetTryCount={resetTryCount}
            />
          ) : (
            <SpeakPC
              playBarState={playBarState}
              tryCount={tryCount}
              speakData={speakData}
              quizIndex={quizIndex}
              changeQuizIndex={changeQuizIndex}
              changePlayBarState={changePlayBarState}
              increaseTryCount={increaseTryCount}
              resetTryCount={resetTryCount}
            />
          )}
        </>
      )}
    </>
  )
}