import { useEffect, useState } from 'react'

import SpeakCSS from '@stylesheets/speak.module.scss'

import { IRecordResultData } from '@interfaces/ISpeak'

type ResultRecordProps = {
  sentenceScore: IRecordResultData
  tryCount: number
  nativeAudio: string
  userAudio: string
  changeRecordResult: (state: boolean) => void
}

export default function ResultRecord({
  sentenceScore,
  tryCount,
  nativeAudio,
  userAudio,
  changeRecordResult,
}: ResultRecordProps) {
  let audio: HTMLAudioElement = new Audio()

  useEffect(() => {
    const canPlayTroughHandler = () => {
      audio.play()
    }

    audio.addEventListener('canplaythrough', canPlayTroughHandler)

    return () => {
      audio.removeEventListener('canplaythrough', canPlayTroughHandler)
    }
  }, [])

  const playAudio = (src: string) => {
    audio.src = src
  }

  const closeResultRecord = () => {
    audio.pause()
    audio.src = ''
    audio.currentTime = 0

    changeRecordResult(false)
  }

  return (
    <div className={SpeakCSS.screenBlock}>
      <div className={SpeakCSS.popUp}>
        <div className={SpeakCSS.row1}>
          <div
            className={`${SpeakCSS.btn} ${SpeakCSS.gray}`}
            onClick={() => playAudio(nativeAudio)}
          >
            <span>원어민 발음</span>
            <span className={SpeakCSS.iconSpeaker}></span>
          </div>

          <div
            className={`${SpeakCSS.btn} ${SpeakCSS.blue}`}
            onClick={() => playAudio(userAudio)}
          >
            <span>내 발음</span>
            <span className={SpeakCSS.iconSpeaker}></span>
          </div>
        </div>

        <div className={SpeakCSS.row2}>
          <div className={SpeakCSS.sentence}>
            {sentenceScore.phoneme_result.words.map((word) => {
              return <div className={SpeakCSS.word}>{word.word}</div>
            })}
          </div>

          <div className={SpeakCSS.phonemes}>
            {sentenceScore.phoneme_result.words.map((word) => {
              return (
                <>
                  {word.phonemes.map((phoneme) => {
                    return (
                      <div className={SpeakCSS.phoneme}>{phoneme.phoneme}</div>
                    )
                  })}
                </>
              )
            })}
          </div>
        </div>

        <div
          className={`${SpeakCSS.row3} ${
            sentenceScore.total_score >= 70
              ? SpeakCSS.goodJob
              : SpeakCSS.tryAgain
          }`}
          onClick={() => closeResultRecord()}
        >
          {sentenceScore.total_score >= 70 ? (
            <div className={SpeakCSS.txt}>Good Job!</div>
          ) : (
            <div className={SpeakCSS.txt}>Try Again ({tryCount + 1} / 3)</div>
          )}
          <div className={SpeakCSS.iconArrow}></div>
        </div>
      </div>
    </div>
  )
}
