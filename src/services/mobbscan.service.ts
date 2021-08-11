import { IMobbscanDocument } from '../models/mobbscan-document.model'
import { ApiSettings } from '../settings/api.settings'

export class MobbscanService {
  public async detectDocument(mobbscanDocument: FormData): Promise<IMobbscanDocument> {
    mobbscanDocument.append('licenseId', ApiSettings.mobbscanLicenseId)
    mobbscanDocument.append('returnDocument', true as any)
    const response = await fetch(
      `${ApiSettings.mobbscanApiUrl}/detectDocument.json`,
      {
        method: 'POST',
        body: mobbscanDocument
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }
}
