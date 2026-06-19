export interface PersonaData {
  verdict: string
  rating: number
}

export interface VerdictResult {
  score: number
  summary: string
  personas: {
    skeptic: PersonaData
    user: PersonaData
    engineer: PersonaData
    investor: PersonaData
  }
  greenFlags: string[]
  redFlags: string[]
  mvpScope: string
  validateFirst: string
}
