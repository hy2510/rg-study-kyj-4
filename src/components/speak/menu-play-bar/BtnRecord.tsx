import SpeakCSS from '@stylesheets/speak.module.scss'

type BtnRecordProps = {
  startRecord: () => void
}

export default function BtnRecord({ startRecord }: BtnRecordProps) {
  return (
    <button className={SpeakCSS.btnSpeakPlay} onClick={() => startRecord()}>
      <div className={`${SpeakCSS.icon} ${SpeakCSS.record}`}></div>
      <div className={SpeakCSS.txtWord}>Record</div>
    </button>
  )
}
