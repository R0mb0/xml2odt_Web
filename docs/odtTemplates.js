export const MIMETYPE = "application/vnd.oasis.opendocument.text";

export const STYLES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles
 xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
 xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
 xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
 xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
 xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"
 office:version="1.2">
 <office:styles/>
 <office:automatic-styles/>
 <office:master-styles>
   <style:master-page style:name="Standard" style:page-layout-name="Mpm1"/>
 </office:master-styles>
</office:document-styles>
`;

export const META_XML = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta
 xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
 xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0"
 office:version="1.2">
 <office:meta>
   <meta:generator>xml2odt-web</meta:generator>
   <meta:creation-date>${new Date().toISOString()}</meta:creation-date>
 </office:meta>
</office:document-meta>
`;

export const SETTINGS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-settings
 xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
 xmlns:config="urn:oasis:names:tc:opendocument:xmlns:config:1.0"
 office:version="1.2">
 <office:settings>
   <config:config-item-set config:name="ooo:view-settings"/>
   <config:config-item-set config:name="ooo:configuration-settings"/>
 </office:settings>
</office:document-settings>
`;