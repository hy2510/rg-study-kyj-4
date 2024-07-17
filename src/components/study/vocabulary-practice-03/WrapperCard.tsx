import vocabularyCSS from '@stylesheets/vocabulary-practice.module.scss'
import vocabularyCSSMobile from '@stylesheets/mobile/vocabulary-practice.module.scss'

import useDeviceDetection from '@hooks/common/useDeviceDetection'

import { IVocabulary3Practice } from '@interfaces/IVocabulary'
import { PlayState } from '@hooks/study/useStudyAudio'

import { IcoArrowRightSkip, IcoReturn } from '@components/common/Icons'
import Gap from '@components/study/common-study/Gap'
import BtnPlayWord from './BtnPlayWord'
import Mean from './Mean'
import Input from './Input'

type WrapperCardProps = {
  isSideOpen: boolean
  playState: PlayState
  quizData: IVocabulary3Practice
  quizNo: number
  tryCount: number
  inputVal: string
  playWord: () => void
  changeInputVal: (value: string) => void
  checkAnswer: (skipType?: string) => Promise<void>
}

const isMobile = useDeviceDetection()

const style = isMobile ? vocabularyCSSMobile : vocabularyCSS

export default function WrapperCard({
  isSideOpen,
  playState,
  quizData,
  quizNo,
  tryCount,
  inputVal,
  playWord,
  changeInputVal,
  checkAnswer,
}: WrapperCardProps) {
  return (
    <div className={style.wordCard}>
      <div className={style.wordTyping}>
        {/* 재생 버튼 */}
        <BtnPlayWord playState={playState} playWord={playWord} />

        {/* 입력창 */}
        <Input
          isSideOpen={isSideOpen}
          isEnabledTyping={quizData.IsEnabledTyping}
          quizData={quizData}
          quizNo={quizNo}
          tryCount={tryCount}
          inputVal={inputVal}
          changeInputVal={changeInputVal}
          checkAnswer={checkAnswer}
        />

        {/* 우측 버튼 */}
        <div className={style.enterButton} onClick={() => checkAnswer()}>
          <div className={style.enterIcon}>
            {quizData.IsSkipAvailable ? (
              <IcoArrowRightSkip width={20} height={20} />
            ) : (
              <IcoReturn width={20} height={20} />
            )}
          </div>
        </div>
      </div>

      <Gap height={isMobile ? 50 : 20} />

      <Mean
        meanData={quizData.Quiz[quizNo - 1]}
        mainMeanLang={quizData.MainMeanLanguage}
      />
    </div>
  )
}
