[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/R0mb0/xml2odt-web)
[![Open Source Love svg3](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/R0mb0/xml2odt-web)
[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/license/mit)
[![Donate](https://img.shields.io/badge/PayPal-Donate%20to%20Author-blue.svg)](http://paypal.me/R0mb0)

A modern, client-side web tool for converting one or more ODT `content.xml` files into valid `.odt` documents. Upload, validate, preview, and instantly convert XML files to ODT—all in your browser, with full privacy and no server upload. Built with Material Design, supporting both light and dark themes.

<div align="center">

## [👉 Click here to test the page! 👈](https://r0mb0.github.io/xml2odt_Web/)

<!-- Add screenshots here if available -->
<!--
[![example 1](https://github.com/R0mb0/xml2odt-web/blob/main/ReadMe_Imgs/example1.png)](https://r0mb0.github.io/xml2odt-web/index.html)
[![example 2](https://github.com/R0mb0/xml2odt-web/blob/main/ReadMe_Imgs/example2.png)](https://r0mb0.github.io/xml2odt-web/index.html)
-->

</div>

---

## 🚀 Features

- **Batch upload XML files:** Upload one or more ODT `content.xml` files. Each is converted to a valid `.odt`.
- **Advanced XML validation:** Checks well-formedness, root tags, required namespaces, and minimal ODT structure.
- **Syntax-highlighted preview:** Large, scrollable, color-coded preview for each XML file using Prism.js.
- **Automatic companion file generation:** `styles.xml`, `meta.xml`, and `settings.xml` are created automatically.
- **Instant conversion and download:** Converts and downloads ODT files individually or all at once as a ZIP archive.
- **Material Design UI:** Responsive, modern interface with clear action buttons and feedback.
- **Light/Dark theme:** Adapts to your system theme; manual toggle available.
- **Privacy-first:** All processing is done locally in your browser. No data leaves your device.
- **Delete and reset:** Remove individual files or reset the app with one click.
- **Accessible and in English:** All UI and code in English, keyboard and screen reader accessible.

---

## 💡 How To Use

1. **Open the application** in your browser (`index.html` or via GitHub Pages).
2. Click **"Upload your XML"** to select one or more `content.xml` files.
3. Review the **validation status** and scrollable **preview** for each file.
4. Click **"Convert"** to generate and download the `.odt` file for each XML.
5. For multiple files, use **"Convert All"** to download a ZIP archive containing all `.odt` files.
6. Use **"Delete"** to remove individual files, or **"Delete"** in the footer to reset all.
7. Switch between light/dark themes using the toggle in the top right.

---

## 🛠️ How It Works

- **Frontend only:** No backend, no server interaction.
- **JSZip** packs the ODT structure (mimetype, content.xml, styles.xml, meta.xml, settings.xml) into a valid `.odt` file.
- **Prism.js** provides syntax highlighting for XML previews.
- **Material Design Lite** supplies basic Material Design styles for UI components.
- **All companion files** (`styles.xml`, `meta.xml`, `settings.xml`) are generated with base templates to ensure ODT validity.

---

## ✨ Limitations

- Only supports conversion of XML files structured as valid ODT `content.xml`.
- No visual/WYSIWYG ODT editing—preview is text-only.
- Advanced features (custom templates, multi-language, visual editing) are planned for future versions.

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

- [ODT File Format Spec](https://docs.oasis-open.org/office/v1.2/OpenDocument-v1.2-part1.html)
- [JSZip Documentation](https://stuk.github.io/jszip/)
- [Prism.js](https://prismjs.com/)
- [Material Design Lite](https://getmdl.io/)
