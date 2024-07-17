import { useEffect, useMemo, useState } from 'react'
import {
  SpeakPageProps,
  PageSequenceProps,
  PlayState,
} from '@interfaces/ISpeak'
import { PlayBarState } from '@pages/containers/SpeakContainer'

type StoryAudioPCProps = {
  speakData: SpeakPageProps[]
  quizIndex: number
  changeQuizIndex: (index: number) => void
  changePlayBarState: (state: PlayBarState) => void
}

export default function useSpeakingAudioPC({
  speakData,
  quizIndex,
  changeQuizIndex,
  changePlayBarState,
}: StoryAudioPCProps) {
  // 오디오
  const player = useMemo(() => new Audio(), [])
  player.autoplay = true

  // 오디오 상태
  const [playState, setPlayState] = useState<PlayState>('')
  const [pageSeq, setPageSeq] = useState<PageSequenceProps>({
    playPage: speakData[quizIndex].Page,
    sequnce: speakData[quizIndex].Sequence,
  })

  // 페이지가 바뀌면
  useEffect(() => {
    if (speakData) {
      const isNext = speakData[quizIndex].Sequence === 999

      if (isNext) {
        changeQuizIndex(quizIndex + 1)
      } else {
        setPageSeq({
          playPage: speakData[quizIndex].Page,
          sequnce: speakData[quizIndex].Sequence,
        })
      }
    }
  }, [quizIndex])

  // 이벤트 핸들러 부여
  useEffect(() => {
    // 오디오가 재생 가능할 때
    const handlerCanPlayThrough = () => {
      setPlayState('play')
      changePlayBarState('playing-sentence')
    }

    player.addEventListener('canplaythrough', handlerCanPlayThrough)
    // 오디오가 재생 가능할 때 end

    // 오디오가 일시 중지
    const handlerPause = () => {}

    player.addEventListener('pause', handlerPause)
    // 오디오가 일시 중지 end

    // 오디오가 재생 완료
    const handlerEnded = () => {
      setPlayState('')
      changePlayBarState('')
    }

    player.addEventListener('ended', handlerEnded)
    // 오디오가 재생 완료 end

    playAudio(pageSeq.playPage, pageSeq.sequnce)

    return () => {
      player.removeEventListener('canplaythrough', handlerCanPlayThrough)
      player.removeEventListener('pause', handlerPause)
      player.removeEventListener('ended', handlerEnded)

      stopAudio()
    }
  }, [pageSeq])

  /**
   * 오디오 재생
   * @param pageNumber: 페이지 번호
   * @param seq: 문장 번호
   */
  const playAudio = (pageNumber: number, seq: number) => {
    if (playState === '') {
      const sentenceData = speakData.find(
        (data) => data.Page === pageNumber && data.Sequence === pageSeq.sequnce,
      )

      if (sentenceData) {
        player.src = sentenceData.SoundPath
      } else {
        player.src = ''
        player.currentTime = 0
      }
    }
  }

  /**
   * 오디오 중지
   */
  const stopAudio = () => {
    player.pause()
    player.src = ''
    player.currentTime = 0

    setPlayState('')
  }

  const changePageSeq = (page: number, seq: number) => {
    setPageSeq({
      playPage: page,
      sequnce: seq,
    })
  }

  return {
    playState,
    pageSeq,
    playAudio,
    stopAudio,
    changePageSeq,
  }
}
