import { ResponseCode } from '../../enums/response-code.enum'
import { IMobbscanDocument } from '../../models/mobbscan-document.model'
import { MobbscanService } from '../../services/mobbscan.service'

export class ImageDetectorComponent {
  private capturedFile: File | null = null
  private isStreaming: boolean = false
  private previewHeight: number = 0
  private previewWidth: number = 320

  public get capturerCanvas(): HTMLCanvasElement | null {
    return document.querySelector('#mobbscan-capture-canvas')
  }

  public get capturerStartButton(): HTMLElement | null {
    return document.querySelector('#mobbscan-capture-start-button')
  }

  public get capturerTakePhotoButton(): HTMLElement | null {
    return document.querySelector('#mobbscan-capture-take-photo-button')
  }

  public get capturerVideo(): HTMLVideoElement | null {
    return document.querySelector('#mobbscan-capture-video')
  }

  public get form(): HTMLFormElement | null {
    return document.querySelector('#mobbscan-upload-form')
  }

  public get imageDocument(): HTMLElement | null {
    return document.querySelector('#mobbscan-upload-image')
  }

  public get imageFile(): HTMLElement | null {
    return document.querySelector('#image')
  }

  public get uploadOk(): HTMLElement | null {
    return document.querySelector('#mobbscan-upload-ok')
  }

  public get uploadPreview(): HTMLElement | null {
    return document.querySelector('#mobbscan-upload-preview')
  }

  public get uploadError(): HTMLElement | null {
    return document.querySelector('#mobbscan-upload-error')
  }

  constructor(
    private mobbscanService: MobbscanService = new MobbscanService()
  ) {
    this.onStart()
  }

  private onStart(): void {
    this.addEventsListeners()
  }

  private onSubmit(): void {
    if (this.form) {
      const mobbscanDocument: FormData = new FormData(this.form)
      if (this.capturedFile) {
        mobbscanDocument.set('image', this.capturedFile)
      } else {
        this.uploadPreview?.setAttribute('hidden', '')
      }
      this.detectDocument(mobbscanDocument)
    }
  }

  private onStartCapture(): void {
    this.uploadError?.setAttribute('hidden', '')
    this.uploadOk?.setAttribute('hidden', '')
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.uploadPreview?.removeAttribute('hidden')
        if (this.capturerVideo) {
          this.capturerVideo.srcObject = stream
          this.capturerVideo?.play()
        }
      })
      .catch((error) => {
        console.log('An error occurred: ' + error)
      })
  }

  private onTakePhoto(): void {
    this.imageFile?.removeAttribute('required')
    this.uploadError?.removeAttribute('required')
    this.uploadOk?.removeAttribute('required')
    if (this.capturerCanvas) {
      const context = this.capturerCanvas.getContext('2d')
      if (this.previewWidth && this.previewHeight) {
        this.capturerCanvas.width = this.previewWidth
        this.capturerCanvas.height = this.previewHeight
        if (this.capturerVideo) {
          context?.drawImage(
            this.capturerVideo,
            0,
            0,
            this.previewWidth,
            this.previewHeight
          )
        }
        this.capturerCanvas.toBlob((blob: Blob | null) => {
          if (blob) {
            this.capturedFile = new File([blob], 'image.png')
          }
        })
      }
    }
  }

  private addEventsListeners(): void {
    this.form?.addEventListener('submit', (event) => {
      event.preventDefault()
      this.onSubmit()
    })
    this.capturerStartButton?.addEventListener('click', (event) => {
      event.preventDefault()
      this.onStartCapture()
    })
    this.capturerTakePhotoButton?.addEventListener('click', (event) => {
      event.preventDefault()
      this.onTakePhoto()
    })
    this.capturerVideo?.addEventListener('canplay', (event) => {
      if (!this.isStreaming) {
        if (this.capturerVideo) {
          this.previewHeight =
            this.capturerVideo.videoHeight /
            (this.capturerVideo.videoWidth / this.previewWidth)
          this.capturerVideo.setAttribute('width', this.previewWidth.toString())
          this.capturerVideo.setAttribute(
            'height',
            this.previewHeight.toString()
          )
        }
        if (this.capturerCanvas) {
          this.capturerCanvas.setAttribute(
            'width',
            this.previewWidth.toString()
          )
          this.capturerCanvas.setAttribute(
            'height',
            this.previewHeight.toString()
          )
        }
        this.isStreaming = true
      }
    })
  }

  private detectDocument(mobbscanDocument: FormData) {
    this.uploadError?.setAttribute('hidden', '')
    this.uploadOk?.setAttribute('hidden', '')
    this.mobbscanService
      .detectDocument(mobbscanDocument)
      .then((response: IMobbscanDocument) => {
        switch (response.code) {
          case ResponseCode.ERROR:
            this.uploadError?.removeAttribute('hidden')
            break
          case ResponseCode.OK:
            this.uploadOk?.removeAttribute('hidden')
            if (response.imageDocument) {
              this.imageDocument?.setAttribute(
                'src',
                `data:image/jpeg;base64,${response.imageDocument}`
              )
            }
            break
        }
      })
  }
}
