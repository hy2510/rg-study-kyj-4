import { useContext } from 'react'
import { AppContext, AppContextProps } from '@contexts/AppContext'

import vocabularyCSS from '@stylesheets/vocabulary-test.module.scss'
import vocabularyCSSMobile from '@stylesheets/mobile/vocabulary-test.module.scss'

import useDeviceDetection from '@hooks/common/useDeviceDetection'

import { IVocabulary4Example } from '@interfaces/IVocabulary'

type ExampleProps = {
  index: number
  correctText: string
  exampleData: IVocabulary4Example
  checkAnswer: (
    target: EventTarget & HTMLDivElement,
    selectedText: string,
  ) => Promise<void>
  onExampleAnimationEndHandler: (target: EventTarget & HTMLDivElement) => void
}

const isMobile = useDeviceDetection()

const style = isMobile ? vocabularyCSSMobile : vocabularyCSS

export default function Example({
  index,
  correctText,
  exampleData,
  checkAnswer,
  onExampleAnimationEndHandler,
}: ExampleProps) {
  const { bookInfo, studyInfo } = useContext(AppContext) as AppContextProps

  return (
    <div
      className={`${style.textCard} 
      ${
        studyInfo.mode === 'Review' &&
        Number(bookInfo.Average) >= 70 &&
        exampleData.Text === correctText
          ? style.correct
          : ''
      }`}
      onClick={(e) => checkAnswer(e.currentTarget, exampleData.Text)}
      onAnimationEnd={(e) => onExampleAnimationEndHandler(e.currentTarget)}
    >
      <div className={style.cardNumber}>{Number(index + 1)}</div>
      <div className={style.awnserText}>{exampleData.Text}</div>
    </div>
  )
}