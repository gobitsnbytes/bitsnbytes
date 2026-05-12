import { Client } from "@notionhq/client"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ForkLevel = "Seed Fork" | "Active Fork" | "High Impact Fork" | "Elite Fork"
export type ForkStatus = "Active" | "Inactive" | "Pending"
export type EventStatus = "Draft" | "Planning" | "Announced" | "Ongoing" | "Completed" | "Cancelled"
export type EventType = "Workshop" | "Hackathon" | "Meetup" | "Talk" | "Other"
export type MemberRole = "Lead" | "Co-Lead" | "Tech" | "Design" | "Outreach" | "Member"
export type MemberStatus = "Active" | "Inactive" | "On Leave"
export type ReportType = "Weekly" | "Monthly" | "Event" | "Annual"
export type ReportStatus = "Draft" | "Submitted" | "Reviewed"
export type UserRole = "Admin" | "Lead" | "Member"

export interface Fork {
  id: string
  name: string
  city: string
  status: ForkStatus
  discordId?: string
  leads?: string[]
  points: number
  healthScore: number
  level: ForkLevel
  createdAt?: Date
  lastPulse?: Date
  weeklyPulse?: string
  eventsCount: number
  teamSize: number
}

export interface Event {
  id: string
  name: string
  forkId: string
  forkName?: string
  status: EventStatus
  type: EventType
  date?: Date
  description?: string
  attendees?: number
  sponsors?: string
  points: number
  discordMessageId?: string
  createdBy?: string
}

export interface TeamMember {
  id: string
  name: string
  forkId: string
  forkName?: string
  role: MemberRole
  discordId?: string
  email?: string
  status: MemberStatus
  joinedDate?: Date
  onboardingComplete: boolean
}

export interface Report {
  id: string
  title: string
  forkId: string
  forkName?: string
  type: ReportType
  status: ReportStatus
  date?: Date
  content?: string
  attachments?: string[]
  points: number
  submittedBy?: string
  isLate: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  forkId?: string
  discordId?: string
  createdAt?: Date
}

// ─────────────────────────────────────────────────────────────────────────────
// Error Classes
// ─────────────────────────────────────────────────────────────────────────────

export class NotionConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "NotionConfigError"
  }
}

export class NotionDatabaseError extends Error {
  constructor(database: string, originalError?: unknown) {
    super(`Failed to access ${database} database: ${originalError instanceof Error ? originalError.message : "Unknown error"}`)
    this.name = "NotionDatabaseError"
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Notion Client
// ─────────────────────────────────────────────────────────────────────────────

let notionClient: Client | null = null

function getNotionClient(): Client {
  const apiKey = process.env.NOTION_API_KEY
  
  if (!apiKey) {
    throw new NotionConfigError(
      "Notion API key not configured. Please set NOTION_API_KEY in your environment variables."
    )
  }
  
  if (!notionClient) {
    notionClient = new Client({ auth: apiKey })
  }
  
  return notionClient
}

// Database IDs
export const DATABASE_IDS = {
  forks: () => {
    const id = process.env.NOTION_FORKS_DB_ID
    if (!id) throw new NotionConfigError("NOTION_FORKS_DB_ID not configured.")
    return id
  },
  events: () => {
    const id = process.env.NOTION_EVENTS_DB_ID
    if (!id) throw new NotionConfigError("NOTION_EVENTS_DB_ID not configured.")
    return id
  },
  members: () => {
    const id = process.env.NOTION_MEMBERS_DB_ID
    if (!id) throw new NotionConfigError("NOTION_MEMBERS_DB_ID not configured.")
    return id
  },
  reports: () => {
    const id = process.env.NOTION_REPORTS_DB_ID
    if (!id) throw new NotionConfigError("NOTION_REPORTS_DB_ID not configured.")
    return id
  },
  users: () => {
    const id = process.env.NOTION_USERS_DB_ID
    if (!id) throw new NotionConfigError("NOTION_USERS_DB_ID not configured.")
    return id
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

function extractRichText(property: any): string {
  if (!property?.rich_text) return ""
  return property.rich_text.map((rt: any) => rt.plain_text).join("")
}

function extractTitle(property: any): string {
  if (!property?.title) return ""
  return property.title.map((rt: any) => rt.plain_text).join("")
}

function extractSelect(property: any): string | undefined {
  return property?.select?.name
}

function extractNumber(property: any): number {
  return property?.number ?? 0
}

function extractDate(property: any): Date | undefined {
  if (!property?.date?.start) return undefined
  return new Date(property.date.start)
}

function extractRelation(property: any): string[] {
  if (!property?.relation) return []
  return property.relation.map((r: any) => r.id)
}

function extractCheckbox(property: any): boolean {
  return property?.checkbox ?? false
}

function extractEmail(property: any): string | undefined {
  return property?.email
}

function extractPerson(property: any): string[] {
  if (!property?.people) return []
  return property.people.map((p: any) => p.name)
}

// ─────────────────────────────────────────────────────────────────────────────
// Fork Operations
// ─────────────────────────────────────────────────────────────────────────────

export async function getForks(options?: {
  status?: ForkStatus
  limit?: number
}): Promise<Fork[]> {
  try {
    const notion = getNotionClient()
    const dbId = DATABASE_IDS.forks()
    
    const filter: any[] = []
    if (options?.status) {
      filter.push({
        property: "Status",
        select: { equals: options.status },
      })
    }
    
    const queryParams: any = {
      database_id: dbId,
      sorts: [{ property: "Points", direction: "descending" }],
    }
    
    if (filter.length > 0) {
      queryParams.filter = filter.length === 1 ? filter[0] : { and: filter }
    }
    
    if (options?.limit) {
      queryParams.page_size = options.limit
    }
    
    const response = await notion.databases.query(queryParams)
    
    return response.results.map((page: any) => ({
      id: page.id,
      name: extractTitle(page.properties.Name) || extractTitle(page.properties.name) || "Unnamed Fork",
      city: extractRichText(page.properties.City) || extractRichText(page.properties.city) || "",
      status: (extractSelect(page.properties.Status) || extractSelect(page.properties.status) || "Pending") as ForkStatus,
      discordId: extractRichText(page.properties["Discord ID"]) || extractRichText(page.properties.discordId),
      leads: extractPerson(page.properties.Lead) || extractPerson(page.properties.lead),
      points: extractNumber(page.properties.Points) || extractNumber(page.properties.points),
      healthScore: extractNumber(page.properties["Health Score"]) || extractNumber(page.properties.healthScore) || 0,
      level: (extractSelect(page.properties.Level) || extractSelect(page.properties.level) || "Seed Fork") as ForkLevel,
      createdAt: extractDate(page.properties.Created) || extractDate(page.properties.created),
      lastPulse: extractDate(page.properties["Last Pulse"]) || extractDate(page.properties.lastPulse),
      weeklyPulse: extractRichText(page.properties["Weekly Pulse"]) || extractRichText(page.properties.weeklyPulse),
      eventsCount: extractNumber(page.properties["Events Count"]) || extractNumber(page.properties.eventsCount) || 0,
      teamSize: extractNumber(page.properties["Team Size"]) || extractNumber(page.properties.teamSize) || 0,
    }))
  } catch (error) {
    if (error instanceof NotionConfigError) throw error
    throw new NotionDatabaseError("Forks", error)
  }
}

export async function getFork(forkId: string): Promise<Fork | null> {
  try {
    const notion = getNotionClient()
    const response = await notion.pages.retrieve({ page_id: forkId })
    
    const page = response as any
    return {
      id: page.id,
      name: extractTitle(page.properties.Name) || extractTitle(page.properties.name) || "Unnamed Fork",
      city: extractRichText(page.properties.City) || extractRichText(page.properties.city) || "",
      status: (extractSelect(page.properties.Status) || extractSelect(page.properties.status) || "Pending") as ForkStatus,
      discordId: extractRichText(page.properties["Discord ID"]) || extractRichText(page.properties.discordId),
      leads: extractPerson(page.properties.Lead) || extractPerson(page.properties.lead),
      points: extractNumber(page.properties.Points) || extractNumber(page.properties.points),
      healthScore: extractNumber(page.properties["Health Score"]) || extractNumber(page.properties.healthScore) || 0,
      level: (extractSelect(page.properties.Level) || extractSelect(page.properties.level) || "Seed Fork") as ForkLevel,
      createdAt: extractDate(page.properties.Created) || extractDate(page.properties.created),
      lastPulse: extractDate(page.properties["Last Pulse"]) || extractDate(page.properties.lastPulse),
      weeklyPulse: extractRichText(page.properties["Weekly Pulse"]) || extractRichText(page.properties.weeklyPulse),
      eventsCount: extractNumber(page.properties["Events Count"]) || extractNumber(page.properties.eventsCount) || 0,
      teamSize: extractNumber(page.properties["Team Size"]) || extractNumber(page.properties.teamSize) || 0,
    }
  } catch (error) {
    if (error instanceof NotionConfigError) throw error
    return null
  }
}

export async function updateForkPoints(forkId: string, points: number): Promise<void> {
  try {
    const notion = getNotionClient()
    await notion.pages.update({
      page_id: forkId,
      properties: {
        Points: { number: points },
      },
    } as any)
  } catch (error) {
    if (error instanceof NotionConfigError) throw error
    throw new NotionDatabaseError("Forks", error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Operations
// ─────────────────────────────────────────────────────────────────────────────

export async function getEvents(options?: {
  forkId?: string
  status?: EventStatus
  limit?: number
}): Promise<Event[]> {
  try {
    const notion = getNotionClient()
    const dbId = DATABASE_IDS.events()
    
    const filter: any[] = []
    if (options?.forkId) {
      filter.push({
        property: "Fork",
        relation: { contains: options.forkId },
      })
    }
    if (options?.status) {
      filter.push({
        property: "Status",
        select: { equals: options.status },
      })
    }
    
    const queryParams: any = {
      database_id: dbId,
      sorts: [{ property: "Date", direction: "descending" }],
    }
    
    if (filter.length > 0) {
      queryParams.filter = filter.length === 1 ? filter[0] : { and: filter }
    }
    
    if (options?.limit) {
      queryParams.page_size = options.limit
    }
    
    const response = await notion.databases.query(queryParams)
    
    return response.results.map((page: any) => ({
      id: page.id,
      name: extractTitle(page.properties.Name) || extractTitle(page.properties.name) || "Unnamed Event",
      forkId: extractRelation(page.properties.Fork)[0] || extractRelation(page.properties.fork)[0] || "",
      status: (extractSelect(page.properties.Status) || extractSelect(page.properties.status) || "Draft") as EventStatus,
      type: (extractSelect(page.properties.Type) || extractSelect(page.properties.type) || "Other") as EventType,
      date: extractDate(page.properties.Date) || extractDate(page.properties.date),
      description: extractRichText(page.properties.Description) || extractRichText(page.properties.description),
      attendees: extractNumber(page.properties.Attendees) || extractNumber(page.properties.attendees),
      sponsors: extractRichText(page.properties.Sponsors) || extractRichText(page.properties.sponsors),
      points: extractNumber(page.properties.Points) || extractNumber(page.properties.points) || 0,
      discordMessageId: extractRichText(page.properties["Discord Message ID"]) || extractRichText(page.properties.discordMessageId),
    }))
  } catch (error) {
    if (error instanceof NotionConfigError) throw error
    throw new NotionDatabaseError("Events", error)
  }
}

export async function createEvent(event: {
  name: string
  forkId: string
  type: EventType
  date?: Date
  description?: string
}): Promise<Event> {
  try {
    const notion = getNotionClient()
    const dbId = DATABASE_IDS.events()
    
    const response = await notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        Name: { title: [{ text: { content: event.name } }] },
        Fork: { relation: [{ id: event.forkId }] },
        Status: { select: { name: "Planning" } },
        Type: { select: { name: event.type } },
        ...(event.date && { Date: { date: { start: event.date.toISOString() } } }),
        ...(event.description && { Description: { rich_text: [{ text: { content: event.description } }] } }),
      },
    } as any)
    
    const page = response as any
    return {
      id: page.id,
      name: event.name,
      forkId: event.forkId,
      status: "Planning",
      type: event.type,
      date: event.date,
      description: event.description,
      points: 0,
    }
  } catch (error) {
    if (error instanceof NotionConfigError) throw error
    throw new NotionDatabaseError("Events", error)
  }
}

export async function updateEventStatus(eventId: string, status: EventStatus): Promise<void> {
  try {
    const notion = getNotionClient()
    await notion.pages.update({
      page_id: eventId,
      properties: {
        Status: { select: { name: status } },
      },
    } as any)
  } catch (error) {
    if (error instanceof NotionConfigError) throw error
    throw new NotionDatabaseError("Events", error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Team Member Operations
// ─────────────────────────────────────────────────────────────────────────────

export async function getTeamMembers(options?: {
  forkId?: string
  status?: MemberStatus
  limit?: number
}): Promise<TeamMember[]> {
  try {
    const notion = getNotionClient()
    const dbId = DATABASE_IDS.members()
    
    const filter: any[] = []
    if (options?.forkId) {
      filter.push({
        property: "Fork",
        relation: { contains: options.forkId },
      })
    }
    if (options?.status) {
      filter.push({
        property: "Status",
        select: { equals: options.status },
      })
    }
    
    const queryParams: any = {
      database_id: dbId,
      sorts: [{ property: "Name", direction: "ascending" }],
    }
    
    if (filter.length > 0) {
      queryParams.filter = filter.length === 1 ? filter[0] : { and: filter }
    }
    
    if (options?.limit) {
      queryParams.page_size = options.limit
    }
    
    const response = await notion.databases.query(queryParams)
    
    return response.results.map((page: any) => ({
      id: page.id,
      name: extractTitle(page.properties.Name) || extractTitle(page.properties.name) || "Unnamed",
      forkId: extractRelation(page.properties.Fork)[0] || extractRelation(page.properties.fork)[0] || "",
      role: (extractSelect(page.properties.Role) || extractSelect(page.properties.role) || "Member") as MemberRole,
      discordId: extractRichText(page.properties["Discord ID"]) || extractRichText(page.properties.discordId),
      email: extractEmail(page.properties.Email) || extractEmail(page.properties.email),
      status: (extractSelect(page.properties.Status) || extractSelect(page.properties.status) || "Active") as MemberStatus,
      joinedDate: extractDate(page.properties["Joined Date"]) || extractDate(page.properties.joinedDate),
      onboardingComplete: extractCheckbox(page.properties["Onboarding Complete"]) || extractCheckbox(page.properties.onboardingComplete),
    }))
  } catch (error) {
    if (error instanceof NotionConfigError) throw error
    throw new NotionDatabaseError("Team Members", error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Report Operations
// ─────────────────────────────────────────────────────────────────────────────

export async function getReports(options?: {
  forkId?: string
  type?: ReportType
  status?: ReportStatus
  limit?: number
}): Promise<Report[]> {
  try {
    const notion = getNotionClient()
    const dbId = DATABASE_IDS.reports()
    
    const filter: any[] = []
    if (options?.forkId) {
      filter.push({
        property: "Fork",
        relation: { contains: options.forkId },
      })
    }
    if (options?.type) {
      filter.push({
        property: "Type",
        select: { equals: options.type },
      })
    }
    if (options?.status) {
      filter.push({
        property: "Status",
        select: { equals: options.status },
      })
    }
    
    const queryParams: any = {
      database_id: dbId,
      sorts: [{ property: "Date", direction: "descending" }],
    }
    
    if (filter.length > 0) {
      queryParams.filter = filter.length === 1 ? filter[0] : { and: filter }
    }
    
    if (options?.limit) {
      queryParams.page_size = options.limit
    }
    
    const response = await notion.databases.query(queryParams)
    
    return response.results.map((page: any) => ({
      id: page.id,
      title: extractTitle(page.properties.Title) || extractTitle(page.properties.title) || "Untitled Report",
      forkId: extractRelation(page.properties.Fork)[0] || extractRelation(page.properties.fork)[0] || "",
      type: (extractSelect(page.properties.Type) || extractSelect(page.properties.type) || "Weekly") as ReportType,
      status: (extractSelect(page.properties.Status) || extractSelect(page.properties.status) || "Draft") as ReportStatus,
      date: extractDate(page.properties.Date) || extractDate(page.properties.date),
      content: extractRichText(page.properties.Content) || extractRichText(page.properties.content),
      points: extractNumber(page.properties.Points) || extractNumber(page.properties.points) || 0,
      isLate: extractCheckbox(page.properties.Late) || extractCheckbox(page.properties.late),
    }))
  } catch (error) {
    if (error instanceof NotionConfigError) throw error
    throw new NotionDatabaseError("Reports", error)
  }
}

export async function createReport(report: {
  title: string
  forkId: string
  type: ReportType
  content: string
  isLate?: boolean
}): Promise<Report> {
  try {
    const notion = getNotionClient()
    const dbId = DATABASE_IDS.reports()
    
    const response = await notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        Title: { title: [{ text: { content: report.title } }] },
        Fork: { relation: [{ id: report.forkId }] },
        Type: { select: { name: report.type } },
        Status: { select: { name: "Submitted" } },
        Content: { rich_text: [{ text: { content: report.content } }] },
        Date: { date: { start: new Date().toISOString() } },
        Late: { checkbox: report.isLate ?? false },
      },
    } as any)
    
    const page = response as any
    return {
      id: page.id,
      title: report.title,
      forkId: report.forkId,
      type: report.type,
      status: "Submitted",
      date: new Date(),
      content: report.content,
      points: 0,
      isLate: report.isLate ?? false,
    }
  } catch (error) {
    if (error instanceof NotionConfigError) throw error
    throw new NotionDatabaseError("Reports", error)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// User Operations (Notion-based)
// ─────────────────────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const notion = getNotionClient()
    const dbId = DATABASE_IDS.users()
    
    const response = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: "Email",
        email: { equals: email },
      },
    })
    
    if (response.results.length === 0) return null
    
    const page = response.results[0] as any
    return {
      id: page.id,
      name: extractTitle(page.properties.Name) || extractTitle(page.properties.name) || "Unknown",
      email: extractEmail(page.properties.Email) || extractEmail(page.properties.email) || email,
      role: (extractSelect(page.properties.Role) || extractSelect(page.properties.role) || "Member") as UserRole,
      forkId: extractRelation(page.properties.Fork)[0] || extractRelation(page.properties.fork)[0],
      discordId: extractRichText(page.properties["Discord ID"]) || extractRichText(page.properties.discordId),
      createdAt: extractDate(page.properties.Created) || extractDate(page.properties.created),
    }
  } catch (error) {
    if (error instanceof NotionConfigError) throw error
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Configuration Check
// ─────────────────────────────────────────────────────────────────────────────

export function isNotionConfigured(): boolean {
  return !!(
    process.env.NOTION_API_KEY &&
    process.env.NOTION_FORKS_DB_ID &&
    process.env.NOTION_EVENTS_DB_ID &&
    process.env.NOTION_MEMBERS_DB_ID &&
    process.env.NOTION_REPORTS_DB_ID
  )
}

export function getNotionConfigStatus(): { configured: boolean; missing: string[] } {
  const missing: string[] = []
  
  if (!process.env.NOTION_API_KEY) missing.push("NOTION_API_KEY")
  if (!process.env.NOTION_FORKS_DB_ID) missing.push("NOTION_FORKS_DB_ID")
  if (!process.env.NOTION_EVENTS_DB_ID) missing.push("NOTION_EVENTS_DB_ID")
  if (!process.env.NOTION_MEMBERS_DB_ID) missing.push("NOTION_MEMBERS_DB_ID")
  if (!process.env.NOTION_REPORTS_DB_ID) missing.push("NOTION_REPORTS_DB_ID")
  
  return {
    configured: missing.length === 0,
    missing,
  }
}