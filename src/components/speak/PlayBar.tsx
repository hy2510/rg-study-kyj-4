import SpeakCSS from '@stylesheets/speak.module.scss'

import { PlayState } from '@interfaces/ISpeak'

import {
  LottieAudioPlayAni,
  LottieRecordAni,
  LottieUserSayAni,
} from '@components/common/LottieAnims'

import PlayBarDefault from './menu-play-bar/PlayBarDefault'
import PlayBarRecording from './menu-play-bar/PlayBarRecording'
import PlayBarPlaySentence from './menu-play-bar/PlayBarPlaySentence'

type PlayBarState =
  | ''
  | 'playing-sentence'
  | 'recording'
  | 'playing-user-audio'
  | 'correct'
  | 'incorrect'

type PlayBarProps = {
  progressWidth: number
  playBarState: PlayBarState
  playState: PlayState
  playSentence: () => void
  startRecord: () => void
}

export default function PlayBar({
  progressWidth,
  playBarState,
  playSentence,
  startRecord,
}: PlayBarProps) {
  return (
    <div>
      <div className={SpeakCSS.playBar}>
        <div className={SpeakCSS.progress}>
          <div
            className={SpeakCSS.progressBar}
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>

        {/* play bar 내부에 아이콘이 들어갈 곳 */}
        <div className={SpeakCSS.wrapperAnims}>
          {/* <LottieRecordAni />
        <LottieAudioPlayAni />
        <LottieUserSayAni /> */}

          {playBarState === '' && (
            <PlayBarDefault
              playSentence={playSentence}
              startRecord={startRecord}
            />
          )}

          {playBarState === 'playing-sentence' && <PlayBarPlaySentence />}

          {playBarState === 'recording' && <PlayBarRecording />}
        </div>
      </div>
    </div>
  )
}
