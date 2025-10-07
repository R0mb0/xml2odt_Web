import { MIMETYPES, STYLES_XML, META_XML, SETTINGS_XML } from './odtTemplates.js';

// Assumes JSZip is already loaded globally (via <script src="vendor/jszip.min.js"></script> in index.html)

export function generateOdtZip(contentXml, docType) {
  // docType: 'odt' or 'ods'
  const zip = new window.JSZip();

  // Add mimetype: first, uncompressed!
  zip.file("mimetype", MIMETYPES[docType], { compression: "STORE" });

  // Add required files (compressed)
  zip.file("content.xml", contentXml, { compression: "DEFLATE" });
  zip.file("styles.xml", STYLES_XML[docType], { compression: "DEFLATE" });
  zip.file("meta.xml", META_XML, { compression: "DEFLATE" });
  zip.file("settings.xml", SETTINGS_XML, { compression: "DEFLATE" });

  // Generate ZIP
  return zip.generateAsync({
    type: "blob",
    mimeType: MIMETYPES[docType],
    compression: "DEFLATE",
  });
}