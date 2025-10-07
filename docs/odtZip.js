import { MIMETYPE, STYLES_XML, META_XML, SETTINGS_XML } from './odtTemplates.js';

// Assumes JSZip is already loaded globally (via <script src="vendor/jszip.min.js"></script> in index.html)

export function generateOdtZip(contentXml) {
  // Use global JSZip (window.JSZip)
  const zip = new window.JSZip();

  // Add mimetype: first, uncompressed!
  zip.file("mimetype", MIMETYPE, { compression: "STORE" });

  // Add required files (compressed)
  zip.file("content.xml", contentXml, { compression: "DEFLATE" });
  zip.file("styles.xml", STYLES_XML, { compression: "DEFLATE" });
  zip.file("meta.xml", META_XML, { compression: "DEFLATE" });
  zip.file("settings.xml", SETTINGS_XML, { compression: "DEFLATE" });

  // Generate ZIP
  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.oasis.opendocument.text",
    compression: "DEFLATE",
    // JSZip preserves file order as added above
  });
}