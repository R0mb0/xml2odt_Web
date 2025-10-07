# xml2odt-ods-web

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/R0mb0/xml2odt-ods-web)
[![Open Source Love svg3](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/R0mb0/xml2odt-ods-web)
[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/license/mit)
[![Donate](https://img.shields.io/badge/PayPal-Donate%20to%20Author-blue.svg)](http://paypal.me/R0mb0)

A modern, client-side web tool for converting XML files to valid ODT (text document) and ODS (spreadsheet) files. Upload one or more XML files and instantly generate ready-to-use OpenDocument files (ODT/ODS) with syntax-highlighted preview, validation, and batch conversion — all directly in your browser, with no server upload required.

<div align="center">

## [👉 Click here to test the page! 👈](https://r0mb0.github.io/xml2odt-ods-web/index.html)

<!-- Optional: Add screenshots here -->
<!--
[![example 1](https://github.com/R0mb0/xml2odt-ods-web/blob/main/ReadMe_Imgs/example1.png)](https://r0mb0.github.io/xml2odt-ods-web/index.html)
[![example 2](https://github.com/R0mb0/xml2odt-ods-web/blob/main/ReadMe_Imgs/example2.png)](https://r0mb0.github.io/xml2odt-ods-web/index.html)
-->

</div>

---

## 🚀 Features

- **Batch upload XML files:** Convert one or many XML files, generating ODT (text) or ODS (spreadsheet) format as needed.
- **Automatic format detection:** The tool recognizes whether each XML is ODT or ODS and produces the correct output.
- **Advanced XML validation:** Checks well-formedness, root tags, required namespaces, and minimal OpenDocument structure for both ODT and ODS.
- **Syntax-highlighted preview:** See a large, scrollable preview of your XML with color-coded syntax (Prism.js).
- **Instant conversion and download:** Download each converted file individually, or batch download all as a ZIP archive.
- **Automatic companion file generation:** Generates `styles.xml`, `meta.xml`, and `settings.xml` automatically for each document.
- **Modern Material Design UI:** Responsive and attractive interface, with light/dark themes.
- **Privacy-first:** All processing is done locally in your browser. No data ever leaves your device.
- **Delete and reset:** Remove individual files or reset the app with one click.
- **Accessible and internationalized:** All UI and code in English, with accessibility in mind.

---

## 💡 How To Use

1. **Open the application** in your browser (`index.html` or via GitHub Pages).
2. Click **Upload your XML** to select one or more XML files (`content.xml` for ODT/ODS).
3. Review validation status, and scrollable syntax-highlighted preview for each file.
4. Click **Convert** to generate and download an `.odt` or `.ods` file for each XML.
5. For multiple files, use **Convert All** to download a ZIP archive containing all OpenDocument files.
6. Use **Delete** to remove individual files, or **Delete** in the footer to reset all.
7. Switch between light/dark themes using the toggle in the top right.

---

## 🛠️ How It Works

- **Frontend only:** No backend or server interaction.
- **JSZip** packs the ODF structure (mimetype, content.xml, styles.xml, meta.xml, settings.xml) into a valid `.odt` or `.ods` file.
- **Prism.js** provides syntax highlighting for XML previews.
- **Material Design Lite** supplies Material Design styles for UI components.
- **All companion files** (`styles.xml`, `meta.xml`, `settings.xml`) are generated with base templates to ensure document validity.

---

## ✨ Limitations

- Only supports conversion of XML files structured as valid ODT `content.xml` or ODS spreadsheet XML.
- No visual/WYSIWYG ODT/ODS editing—preview is text-only.
- Advanced features (custom templates, multi-language, visual editing, support for other ODF formats) are planned for future versions.

---

## 🔒 Privacy & Security

- **No files are sent to any server.**
- All processing and conversion happens in your browser.
- **No data is stored** beyond your browser session.

---

## 📦 Libraries & Licenses

- **JSZip** by Stuart Knightley et al. ([MIT License](https://github.com/Stuk/jszip/blob/main/LICENSE.markdown))
- **Prism.js** ([MIT License](https://github.com/PrismJS/prism/blob/main/LICENSE))
- **Material Design Lite** ([Apache License 2.0](https://github.com/google/material-design-lite/blob/master/LICENSE))
- **All custom code in this project:** [MIT License](LICENSE)

---

## 🙏 Credits & Inspiration

- [ODF File Format Spec](https://docs.oasis-open.org/office/v1.2/OpenDocument-v1.2-part1.html)
- [JSZip Documentation](https://stuk.github.io/jszip/)
- [Prism.js](https://prismjs.com/)
- [Material Design Lite](https://getmdl.io/)
