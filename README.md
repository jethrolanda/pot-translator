# POT File Translator

A Next.js web application for translating POT (Portable Object Template) files and generating PO (Portable Object) files for WordPress plugin internationalization.

## Features

- 📤 **Upload POT/PO Files**: Drag and drop or select POT/PO files to load
- ✏️ **Translation Editor**: Edit translations for each string entry with a clean, intuitive interface
- 🔍 **Search Functionality**: Quickly find specific entries by searching through original text or translations
- 📊 **Progress Tracking**: Visual progress bar showing translation completion status
- 🌍 **Multi-Language Support**: Support for 10+ common languages (Spanish, French, German, Italian, Portuguese, Russian, Japanese, Chinese, Arabic, Hindi)
- 💾 **Export PO Files**: Generate properly formatted PO files ready for WordPress use
- 🎨 **Modern UI**: Clean, responsive design with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd pot-translator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload a POT File**: 
   - Click the upload area or drag and drop your `.pot` or `.po` file
   - The file will be parsed and all entries will be displayed

2. **Select Language**: 
   - Choose your target language from the dropdown menu

3. **Translate Entries**:
   - Review each entry with its original text
   - Enter translations in the text area below each entry
   - Use the search bar to quickly find specific entries

4. **Export PO File**:
   - Click "Export PO File" to download the translated `.po` file
   - The file will be named `[original-filename]-[language-code].po`

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main application page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── POTUploader.tsx       # File upload component
│   │   └── TranslationEditor.tsx # Translation editing interface
│   └── lib/
│       └── pot-parser.ts         # POT/PO file parser and generator
```

## How It Works

### POT File Parsing

The application parses POT/PO files by:
- Extracting header information
- Parsing each translation entry (msgid, msgstr, msgctxt, etc.)
- Preserving comments, references, and flags
- Handling multi-line strings and escaped characters

### PO File Generation

When exporting, the application:
- Generates a properly formatted PO file header
- Includes all original metadata (comments, references, flags)
- Replaces msgid values with translations
- Maintains proper escaping and formatting

## Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with dark mode support
- **React 19** - UI library

## WordPress Integration

After exporting your PO file:

1. Place the `.po` file in your WordPress plugin's `languages` directory
2. Use the same naming convention: `plugin-name-[language-code].po`
3. WordPress will automatically load the translations when the plugin is active

Example:
```
your-plugin/
  languages/
    your-plugin-es.po
    your-plugin-fr.po
```

## Future Enhancements

- [ ] Auto-translation using translation APIs (Google Translate, DeepL, etc.)
- [ ] Batch translation for multiple languages
- [ ] Translation memory and suggestions
- [ ] Import existing PO files to continue translations
- [ ] Export to MO (Machine Object) format
- [ ] Collaborative translation features
- [ ] Translation statistics and analytics

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
