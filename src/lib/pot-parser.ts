export interface POTEntry {
  msgid: string;
  msgstr?: string;
  msgctxt?: string;
  msgid_plural?: string;
  comments?: string[];
  references?: string[];
  flags?: string[];
  extractedComments?: string[];
}

export interface POTFile {
  header: string;
  entries: POTEntry[];
  language?: string;
}

/**
 * Parse a POT/PO file content into structured data
 */
export function parsePOTFile(content: string): POTFile {
  const lines = content.split('\n');
  const entries: POTEntry[] = [];
  let currentEntry: Partial<POTEntry> | null = null;
  let header = '';
  let inHeader = true;
  let currentKey: string | null = null;
  let currentValue: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      if (currentEntry && currentKey && currentValue.length > 0) {
        // Save current value (already unescaped)
        const value = currentValue.join('\n');
        if (currentKey === 'msgid') {
          currentEntry.msgid = value;
        } else if (currentKey === 'msgstr') {
          currentEntry.msgstr = value;
        } else if (currentKey === 'msgctxt') {
          currentEntry.msgctxt = value;
        } else if (currentKey === 'msgid_plural') {
          currentEntry.msgid_plural = value;
        }
        currentKey = null;
        currentValue = [];
      }
      continue;
    }

    // Comments
    if (trimmed.startsWith('#')) {
      if (inHeader && trimmed.startsWith('# ')) {
        header += trimmed.substring(2) + '\n';
        continue;
      }

      if (!currentEntry) {
        currentEntry = {};
      }

      if (trimmed.startsWith('#:')) {
        // References
        if (!currentEntry.references) currentEntry.references = [];
        currentEntry.references.push(trimmed.substring(2).trim());
      } else if (trimmed.startsWith('#,')) {
        // Flags
        if (!currentEntry.flags) currentEntry.flags = [];
        currentEntry.flags.push(trimmed.substring(2).trim());
      } else if (trimmed.startsWith('#.')) {
        // Extracted comments
        if (!currentEntry.extractedComments) currentEntry.extractedComments = [];
        currentEntry.extractedComments.push(trimmed.substring(2).trim());
      } else if (trimmed.startsWith('# ')) {
        // Translator comments
        if (!currentEntry.comments) currentEntry.comments = [];
        currentEntry.comments.push(trimmed.substring(2).trim());
      }
      continue;
    }

    // End of header
    if (inHeader && trimmed.startsWith('msgid')) {
      inHeader = false;
    }

    // msgid, msgstr, msgctxt, msgid_plural
    const msgMatch = trimmed.match(/^(msgid|msgstr|msgctxt|msgid_plural)(\s+"(.*)"|$)/);
    if (msgMatch) {
      if (currentEntry && currentKey) {
        // Save previous value
        const value = currentValue.join('\n');
        if (currentKey === 'msgid') {
          currentEntry.msgid = value;
        } else if (currentKey === 'msgstr') {
          currentEntry.msgstr = value;
        } else if (currentKey === 'msgctxt') {
          currentEntry.msgctxt = value;
        } else if (currentKey === 'msgid_plural') {
          currentEntry.msgid_plural = value;
        }
      }

      // If we're starting a new msgid, save the previous entry
      if (msgMatch[1] === 'msgid' && currentEntry && currentEntry.msgid) {
        entries.push(currentEntry as POTEntry);
        currentEntry = {};
      }

      // Save previous value if exists
      if (currentEntry && currentKey && currentValue.length > 0) {
        const value = currentValue.join('\n');
        if (currentKey === 'msgid') {
          currentEntry.msgid = value;
        } else if (currentKey === 'msgstr') {
          currentEntry.msgstr = value;
        } else if (currentKey === 'msgctxt') {
          currentEntry.msgctxt = value;
        } else if (currentKey === 'msgid_plural') {
          currentEntry.msgid_plural = value;
        }
      }

      currentKey = msgMatch[1];
      currentValue = [];
      
      if (msgMatch[3]) {
        currentValue.push(unescapeString(msgMatch[3]));
      }

      if (!currentEntry) {
        currentEntry = {};
      }
      continue;
    }

    // Continuation line (string in quotes)
    const stringMatch = trimmed.match(/^"(.*)"$/);
    if (stringMatch && currentKey) {
      currentValue.push(unescapeString(stringMatch[1]));
      continue;
    }
  }

  // Save last entry
  if (currentEntry) {
    if (currentKey && currentValue.length > 0) {
      const value = currentValue.join('\n');
      if (currentKey === 'msgid') {
        currentEntry.msgid = value;
      } else if (currentKey === 'msgstr') {
        currentEntry.msgstr = value;
      } else if (currentKey === 'msgctxt') {
        currentEntry.msgctxt = value;
      } else if (currentKey === 'msgid_plural') {
        currentEntry.msgid_plural = value;
      }
    }
    if (currentEntry.msgid) {
      entries.push(currentEntry as POTEntry);
    }
  }

  return {
    header: header.trim(),
    entries: entries.filter(e => e.msgid && e.msgid !== '""'), // Filter out header entry
  };
}

/**
 * Generate PO file content from POT file and translations
 */
export function generatePOFile(
  potFile: POTFile,
  translations: Record<string, string>,
  language: string = 'en'
): string {
  let output = '';

  // Write header
  output += `# Translation file for ${language}\n`;
  output += `# This file is distributed under the same license as the original.\n`;
  output += `\n`;
  output += `msgid ""\n`;
  output += `msgstr ""\n`;
  output += `"Language: ${language}\\n"\n`;
  output += `"Content-Type: text/plain; charset=UTF-8\\n"\n`;
  output += `\n`;

  // Write entries
  for (const entry of potFile.entries) {
    // Write comments
    if (entry.comments) {
      for (const comment of entry.comments) {
        output += `# ${comment}\n`;
      }
    }
    if (entry.extractedComments) {
      for (const comment of entry.extractedComments) {
        output += `#. ${comment}\n`;
      }
    }
    if (entry.references) {
      for (const ref of entry.references) {
        output += `#: ${ref}\n`;
      }
    }
    if (entry.flags) {
      for (const flag of entry.flags) {
        output += `#, ${flag}\n`;
      }
    }

    // Write context if present
    if (entry.msgctxt) {
      output += `msgctxt ${formatString(entry.msgctxt)}\n`;
    }

    // Write msgid
    output += `msgid ${formatString(entry.msgid)}\n`;

    // Write msgid_plural if present
    if (entry.msgid_plural) {
      output += `msgid_plural ${formatString(entry.msgid_plural)}\n`;
    }

    // Write msgstr with translation
    const key = entry.msgctxt ? `${entry.msgctxt}\u0004${entry.msgid}` : entry.msgid;
    const translation = translations[key] || entry.msgid;
    
    if (entry.msgid_plural) {
      output += `msgstr[0] ${formatString(translation)}\n`;
      output += `msgstr[1] ${formatString(translation)}\n`;
    } else {
      output += `msgstr ${formatString(translation)}\n`;
    }

    output += `\n`;
  }

  return output;
}

/**
 * Unescape a string from POT/PO format
 */
function unescapeString(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

/**
 * Format a string for POT/PO file format
 */
function formatString(str: string): string {
  if (!str) return '""';
  
  // Escape special characters
  const escaped = str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
  
  // Split long strings into multiple lines if needed
  if (escaped.length > 70) {
    const lines: string[] = [];
    for (let i = 0; i < escaped.length; i += 70) {
      lines.push(`"${escaped.substring(i, i + 70)}"`);
    }
    return lines.join('\n');
  }
  
  return `"${escaped}"`;
}
