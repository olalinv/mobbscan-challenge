export class ApiSettings {
  // API
  private static API_URL: string = 'https://demo.mobbeel.com'
  private static MOBBSCAN_API_URL: string = `${ApiSettings.API_URL}/mobbscan`
  private static MOBBSCAN_LICENSE_ID: string = 'mobbscan-challenge'

  // Getters
  public static get apiUrl() {
    return this.API_URL
  }

  public static get mobbscanApiUrl() {
    return this.MOBBSCAN_API_URL
  }

  public static get mobbscanLicenseId() {
    return this.MOBBSCAN_LICENSE_ID
  }
}
