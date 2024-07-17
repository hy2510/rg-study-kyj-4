import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext, AppContextProps } from '@contexts/AppContext'

import MobileDetect from 'mobile-detect'

// utils & hooks
import PlayBar from '@components/speak/PlayBar'
import Content from '@components/speak/Content'
import Header from '@components/speak/Header'
import {
  IRecordResultData,
  ISpeakUserAnswer,
  SpeakPageProps,
} from '@interfaces/ISpeak'
import useSpeakingAudioPC from '@hooks/speak/useSpeakingAudio'
import useRecorder from '@hooks/speak/useRecorder'

import { PlayBarState } from '@pages/containers/SpeakContainer'
import { saveSpeakResult } from '@services/speakApi'
import ResultRecord from '@components/speak/ResultRecord'

const md = new MobileDetect(navigator.userAgent)
const isMobile = md.phone()

type SpeakMobileProps = {
  playBarState: PlayBarState
  tryCount: number
  speakData: SpeakPageProps[]
  quizIndex: number
  changeQuizIndex: (index: number) => void
  changePlayBarState: (state: PlayBarState) => void
  increaseTryCount: () => void
  resetTryCount: () => void
}

export default function SpeakMobile({
  playBarState,
  tryCount,
  speakData,
  quizIndex,
  changeQuizIndex,
  changePlayBarState,
  increaseTryCount,
  resetTryCount,
}: SpeakMobileProps) {
  const { studyInfo, handler } = useContext(AppContext) as AppContextProps

  const isWorking = useRef(false)

  // audio
  const { playState, pageSeq, playAudio, stopAudio, changePageSeq } =
    useSpeakingAudioPC({
      speakData: speakData,
      quizIndex: quizIndex,
      changeQuizIndex: changeQuizIndex,
      changePlayBarState: changePlayBarState,
    })

  // recorder
  const { userAudio, startRecording } = useRecorder()

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [sentenceScore, setSentenceScore] = useState<IRecordResultData>()
  const [isResultRecord, setRecordResult] = useState(false)

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
    if (sentenceScore) {
      if (sentenceScore.total_score >= 70) {
        // 점수가 통과하는 점수거나
        saveResult(sentenceScore.total_score)
      } else {
        if (tryCount + 1 >= 3) {
          // 기회를 모두 소진했을 경우
          saveResult(sentenceScore.total_score)
        } else {
          setRecordResult(true)
        }
      }
    }
  }, [sentenceScore])

  useEffect(() => {
    if (playBarState === '') {
      isWorking.current = false
    }
  }, [playBarState])

  /**
   * use effect - result record
   */
  useEffect(() => {
    if (sentenceScore) {
      if (!isResultRecord) {
        // 녹음 결과창을 닫으면
        const lastQuiz = speakData.filter(
          (data, i) => data.Sentence !== null && i > quizIndex,
        )

        const isLastQuiz = lastQuiz.length > 0 ? false : true

        if (sentenceScore.total_score >= 70) {
          // 통과
          if (isLastQuiz) {
            handler.changeView('story')
          } else {
            changeQuizIndex(quizIndex + 1)
          }
        } else {
          // 실패
          if (tryCount + 1 >= 3) {
            // 기회가 초과된 경우 다음 문제로
            if (isLastQuiz) {
              handler.changeView('story')
            } else {
              changeQuizIndex(quizIndex + 1)
            }
          } else {
            // 기회가 남아있는 경우
            increaseTryCount()
          }
        }
      }
    }
  }, [isResultRecord])

  /**
   * use effect - quiz index
   * quiz index가 변경되면 다음 문제로 넘어간 것으로 판단
   */
  useEffect(() => {
    changePageSeq(speakData[quizIndex].Page, speakData[quizIndex].Sequence)

    setSentenceScore(undefined)
    resetTryCount()

    isWorking.current = false
  }, [quizIndex])

  useEffect(() => {
    if (tryCount >= 3) {
      changeQuizIndex(quizIndex + 1)
    } else {
      changePlayBarState('')
    }
  }, [tryCount])

  /**
   * 문장 클릭한 경우
   * @param pageNumber 페이지 번호
   * @param sequence  재생 중인 문장
   */
  const clickSentence = () => {
    if (!isWorking.current) playSentence()
  }

  /**
   * 문장 재생하는 함수
   */
  const playSentence = () => {
    if (!isWorking.current) {
      isWorking.current = true

      changePlayBarState('playing-sentence')
      playAudio(pageSeq.playPage, pageSeq.sequnce)
    }
  }

  /**
   * 녹음 후 문장 점수 바꾸기 위한 함수
   * @param data
   */
  const changeSentenceScore = (data: any) => {
    setSentenceScore(data)
  }

  /**
   * 녹음
   */
  const startRecord = () => {
    if (!isWorking.current) {
      isWorking.current = true
      stopAudio()

      startRecording(
        speakData[quizIndex].Sentence,
        speakData[quizIndex].SoundPath,
        changePlayBarState,
        changeSentenceScore,
      )
    }
  }

  /**
   * 스피킹 결과 저장
   * @param score
   */
  const saveResult = async (score: number) => {
    const lastQuiz = speakData.filter(
      (data, i) => data.Sentence !== null && i > quizIndex,
    )

    const isLastQuiz = lastQuiz.length > 0 ? false : true

    const userAnswer: ISpeakUserAnswer = {
      studyId: studyInfo.studyId,
      studentHistoryId: studyInfo.studentHistoryId,
      challengeNumber: speakData[0].ChallengeNumber,
      page: speakData[quizIndex].Page,
      sequence: speakData[quizIndex].Sequence,
      quizNo: speakData[quizIndex].QuizNo,
      sentence: speakData[quizIndex].Sentence,
      scoreOverall: score,
      wordsJson: JSON.stringify(sentenceScore),
      isLastQuiz: isLastQuiz,
    }

    const result = await saveSpeakResult(userAnswer)

    if (result.result === 0) {
      setRecordResult(true)
    }
  }

  const changeRecordResult = (state: boolean) => {
    setRecordResult(state)
  }

  const progressWidth =
    (speakData[quizIndex].Page / speakData[speakData.length - 1].Page) * 100

  return (
    <div
      style={{
        width: windowWidth,
        height: windowHeight,
      }}
    >
      {/* header */}
      <Header />

      {/* contents */}
      <Content
        pageNumber={pageSeq.playPage}
        pageSeq={pageSeq}
        speakData={speakData}
        clickSentence={clickSentence}
      />

      {/* play bar */}
      <PlayBar
        progressWidth={progressWidth}
        playBarState={playBarState}
        playState={playState}
        playSentence={playSentence}
        startRecord={startRecord}
      />

      {/* result - record */}
      {isResultRecord ? (
        <>
          {sentenceScore && (
            <ResultRecord
              sentenceScore={sentenceScore}
              tryCount={tryCount}
              nativeAudio={speakData[quizIndex].SoundPath}
              userAudio={userAudio}
              changeRecordResult={changeRecordResult}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  )
}
