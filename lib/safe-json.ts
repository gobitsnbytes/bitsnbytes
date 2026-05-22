/**
 * Clean a potentially relaxed or malformed JSON string.
 * - Strips markdown blocks if present.
 * - Extracts only the outer-most JSON object or array.
 * - Converted single-quoted keys and values to double quotes (handling escaped quotes).
 * - Converts unquoted keys to double-quoted keys.
 * - Replaces literal newlines within string values with escaped \n.
 * - Removes trailing commas inside objects and arrays.
 */
export function cleanJsonString(str: string): string {
  let cleaned = str.trim();

  // 1. Strip markdown code block indicators
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z0-9_-]*\n/, "").replace(/```$/, "").trim();
  }

  // 2. Extract only the JSON body (outer-most curly braces or brackets)
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  let start = -1;
  let end = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace;
    end = cleaned.lastIndexOf("}");
  } else if (firstBracket !== -1) {
    start = firstBracket;
    end = cleaned.lastIndexOf("]");
  }

  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }

  // 3. Convert single-quoted keys to double-quoted keys: 'key': -> "key":
  cleaned = cleaned.replace(/([{,]\s*)'([^'\\]*(?:\\.[^'\\]*)*)'(\s*:)/g, '$1"$2"$3');

  // 4. Convert unquoted keys to double-quoted keys: key: -> "key":
  cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3');

  // 5. Convert single-quoted values to double-quoted values: "key": 'val' -> "key": "val"
  cleaned = cleaned.replace(/(:\s*)'([^'\\]*(?:\\.[^'\\]*)*)'(\s*[,}])/g, '$1"$2"$3');

  // 6. Escape literal newlines within double-quoted strings
  // We match double-quoted strings and replace internal newlines with escaped \n
  cleaned = cleaned.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, content) => {
    return `"${content.replace(/\r?\n/g, "\\n")}"`;
  });

  // 7. Remove trailing commas: ,} -> } or ,] -> ]
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  return cleaned;
}

/**
 * Fallback parser for Team Member Card in case JSON parsing completely fails.
 */
export function fallbackParseMemberCard(str: string): any | null {
  try {
    const nameMatch = str.match(/(?:"name"|'name'|\bname\b)\s*:\s*(?:"([^"]+)"|'([^']+)')/i);
    const name = nameMatch ? (nameMatch[1] || nameMatch[2]) : "";

    const roleMatch = str.match(/(?:"role"|'role'|\brole\b)\s*:\s*(?:"([^"]+)"|'([^']+)')/i);
    const role = roleMatch ? (roleMatch[1] || roleMatch[2]) : "";

    if (!name || !role) return null;

    const photoMatch = str.match(/(?:"photo"|'photo'|\bphoto\b)\s*:\s*(?:"([^"]+)"|'([^']+)')/i);
    const photo = photoMatch ? (photoMatch[1] || photoMatch[2]) : undefined;

    const githubMatch = str.match(/(?:"github"|'github'|\bgithub\b)\s*:\s*(?:"([^"]+)"|'([^']+)')/i);
    const github = githubMatch ? (githubMatch[1] || githubMatch[2]) : undefined;

    const linkedinMatch = str.match(/(?:"linkedin"|'linkedin'|\blinkedin\b)\s*:\s*(?:"([^"]+)"|'([^']+)')/i);
    const linkedin = linkedinMatch ? (linkedinMatch[1] || linkedinMatch[2]) : undefined;

    const websiteMatch = str.match(/(?:"website"|'website'|\bwebsite\b)\s*:\s*(?:"([^"]+)"|'([^']+)')/i);
    const website = websiteMatch ? (websiteMatch[1] || websiteMatch[2]) : undefined;

    const socials = (github || linkedin || website) ? { github, linkedin, website } : undefined;

    return { name, role, photo, socials };
  } catch {
    return null;
  }
}

/**
 * Fallback parser for Countdown Payload in case JSON parsing completely fails.
 */
export function fallbackParseCountdown(str: string): any | null {
  try {
    const eventMatch = str.match(/(?:"event"|'event'|\bevent\b)\s*:\s*(?:"([^"]+)"|'([^']+)')/i);
    const event = eventMatch ? (eventMatch[1] || eventMatch[2]) : "";

    const dateMatch = str.match(/(?:"date"|'date'|\bdate\b)\s*:\s*(?:"([^"]+)"|'([^']+)')/i);
    const date = dateMatch ? (dateMatch[1] || dateMatch[2]) : "";

    if (!event || !date) return null;
    return { event, date };
  } catch {
    return null;
  }
}

/**
 * Fallback parser for Project Ideas in case JSON parsing completely fails.
 */
export function fallbackParseProjectCard(str: string): any[] | null {
  try {
    // Look for all object-like patterns inside the string
    const objRegex = /\{[^{}]+\}/g;
    const matches = str.match(objRegex);
    if (!matches || matches.length === 0) return null;

    const ideas: any[] = [];
    for (const objStr of matches) {
      const titleMatch = objStr.match(/(?:"title"|'title'|\btitle\b)\s*:\s*(?:"([^"]+)"|'([^']+)')/i);
      const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : "";

      const descMatch = objStr.match(/(?:"description"|'description'|\bdescription\b)\s*:\s*(?:"([^"]+)"|'([^']+)')/i);
      const description = descMatch ? (descMatch[1] || descMatch[2]) : "";

      if (title && description) {
        const diffMatch = objStr.match(/(?:"difficulty"|'difficulty'|\bdifficulty\b)\s*:\s*(?:"([^"]+)"|'([^']+)')/i);
        const difficulty = diffMatch ? (diffMatch[1] || diffMatch[2]) : "Intermediate";

        // Try to match tags (e.g. array-like structure or comma list)
        const tagsMatch = objStr.match(/(?:"tags"|'tags'|\btags\b)\s*:\s*\[([^\]]+)\]/i);
        let tags: string[] = [];
        if (tagsMatch) {
          tags = tagsMatch[1]
            .split(",")
            .map((t) => t.replace(/['"\s]/g, ""))
            .filter(Boolean);
        }

        ideas.push({ title, description, difficulty, tags });
      }
    }

    return ideas.length > 0 ? ideas : null;
  } catch {
    return null;
  }
}

/**
 * Robust JSON parser wrapper that cleans relaxed JSON and falls back to regex extractors if it still fails.
 */
export function safeJsonParse<T>(str: string, type: "member_card" | "countdown" | "project_card" | "generic", fallback: T): T {
  if (!str) return fallback;

  // Step 1: Clean and format JSON string
  const cleanedStr = cleanJsonString(str);

  // Step 2: Attempt standard JSON parse
  try {
    return JSON.parse(cleanedStr) as T;
  } catch (parseError) {
    console.warn(`safeJsonParse standard parsing failed, attempting fallback for type "${type}". Error:`, parseError);

    // Step 3: Run specific fallback extractors
    try {
      if (type === "member_card") {
        const result = fallbackParseMemberCard(str);
        if (result) return result as unknown as T;
      } else if (type === "countdown") {
        const result = fallbackParseCountdown(str);
        if (result) return result as unknown as T;
      } else if (type === "project_card") {
        const result = fallbackParseProjectCard(str);
        if (result) return result as unknown as T;
      }
    } catch (fallbackError) {
      console.error(`safeJsonParse fallback parsing also failed for type "${type}":`, fallbackError);
    }

    // Step 4: Return default fallback
    return fallback;
  }
}
