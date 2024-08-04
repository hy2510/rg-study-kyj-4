import { LottieRecordAni } from '@components/common/LottieAnims'
import SpeakCSS from '@stylesheets/speak.module.scss'

export default function PlayBarRecording() {
  return (
    <>
      <div
        className={`${SpeakCSS.runVoiceRecord} animate__animated animate__slideInUp`}
      >
        <LottieRecordAni />
        {/* (삭제: REC 텍스트가 안보이게 하기) */}
        {/* <div className={SpeakCSS.txtLabel}>REC</div> */}
      </div>
    </>
  )
}
