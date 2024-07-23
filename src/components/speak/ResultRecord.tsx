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

  const [togglePhonemes, setTogglePhonemes] = useState(false)

  return (
    <div className={SpeakCSS.screenBlock}>
      <div className={SpeakCSS.popUp}>
        <div className={SpeakCSS.row1}>
          <div
            className={`${SpeakCSS.btn} ${SpeakCSS.gray}`}
            onClick={() => playAudio(nativeAudio)}
          >
            <span>Native</span>
            <span className={SpeakCSS.iconSpeaker}></span>
          </div>

          <div
            className={`${SpeakCSS.btn} ${SpeakCSS.gray}`}
            onClick={() => playAudio(userAudio)}
          >
            <span>My</span>
            <span className={SpeakCSS.iconSpeaker}></span>
          </div>
        </div>

        <div className={SpeakCSS.row2}>
          <div className={SpeakCSS.sentence}>
            {sentenceScore.phoneme_result.words.map((word) => {
              return (
                <div className={`${SpeakCSS.word} ${SpeakCSS.red}`}>
                  {word.word}
                </div>
              )
            })}
          </div>

          <div
            className={SpeakCSS.phonemes}
            style={{ display: togglePhonemes ? 'flex' : 'none' }}
          >
            {sentenceScore.phoneme_result.words.map((word) => {
              return (
                <div className={SpeakCSS.wordContainer}>
                  <div className={SpeakCSS.row1}>{word.word}</div>
                  <div className={SpeakCSS.row2}>
                    {word.phonemes.map((phoneme) => {
                      return (
                        <div className={SpeakCSS.phonemeResult}>
                          <div
                            className={`${SpeakCSS.phoneme} 
                            ${phoneme.score < 30 && SpeakCSS.red}
                            ${
                              phoneme.score >= 30 &&
                              phoneme.score < 70 &&
                              SpeakCSS.orange
                            }  
                            ${phoneme.score >= 70 && SpeakCSS.green}  
                            `}
                          >
                            {phoneme.phoneme}
                          </div>
                          <div className={SpeakCSS.phonemeScore}>
                            {Math.floor(phoneme.score)}%
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div
            className={SpeakCSS.btnToggle}
            onClick={() => {
              togglePhonemes
                ? setTogglePhonemes(false)
                : setTogglePhonemes(true)
            }}
          >
            {togglePhonemes ? 'close' : 'detail'}
            <span
              className={`${SpeakCSS.icoChev} ${
                togglePhonemes && SpeakCSS.rotate
              }`}
            ></span>
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
