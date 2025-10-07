import { generateOdtZip } from './odtZip.js';

// Advanced XML validation for ODT content.xml
const xmlInput = document.getElementById('xml-input');
const previewTable = document.getElementById('preview-table');
const fileCount = document.getElementById('file-count');
const convertActions = document.getElementById('convert-actions');
const conversionProgress = document.getElementById('conversion-progress');

// Validation rules for ODT content.xml
const ODT_ROOT_TAG = "office:document-content";
const REQUIRED_NAMESPACES = [
  "xmlns:office", "xmlns:text", "xmlns:style", "xmlns:table", "xmlns:draw"
];
const REQUIRED_CHILD_TAGS = ["office:body", "office:text"];
const REQUIRED_ROOT_ATTRIBUTES = ["office:version"];

// Helper: Validate XML string with detailed error reporting
function validateXML(xmlText) {
  const result = {
    wellFormed: true,
    rootTag: false,
    odtNamespaces: false,
    requiredAttrs: false,
    requiredChildren: false,
    errors: [],
    warnings: [],
    suggestions: []
  };

  let xml = null;
  try {
    xml = new window.DOMParser().parseFromString(xmlText, "application/xml");
    if (xml.getElementsByTagName("parsererror").length) {
      result.wellFormed = false;
      result.errors.push("XML is not well-formed. Please check for missing brackets, quotes, or invalid characters.");
      return result;
    }
  } catch (err) {
    result.wellFormed = false;
    result.errors.push("XML parsing error: " + err.message);
    return result;
  }

  // Check root tag name
  const root = xml.documentElement;
  if (!root || root.tagName !== ODT_ROOT_TAG) {
    result.errors.push(`Root tag must be <${ODT_ROOT_TAG}> but found <${root ? root.tagName : "none"}>.`);
  } else {
    result.rootTag = true;
  }

  // Check required namespaces
  if (root) {
    const missingNs = REQUIRED_NAMESPACES.filter(ns => !root.hasAttribute(ns));
    if (missingNs.length) {
      result.errors.push("Missing required ODT namespaces: " + missingNs.join(", "));
      result.suggestions.push("Add these namespaces to your root tag, e.g. " + missingNs.map(ns => `${ns}="..."`).join(" "));
    } else {
      result.odtNamespaces = true;
    }
  }

  // Check required root attributes
  if (root) {
    const missingAttrs = REQUIRED_ROOT_ATTRIBUTES.filter(attr => !root.hasAttribute(attr));
    if (missingAttrs.length) {
      result.errors.push("Missing required attribute(s) on root: " + missingAttrs.join(", "));
      result.suggestions.push("Add attribute(s) to root, e.g. " + missingAttrs.map(attr => `${attr}="..."`).join(" "));
    } else {
      result.requiredAttrs = true;
    }
  }

  // Check required child tags
  if (root) {
    const missingChildren = REQUIRED_CHILD_TAGS.filter(
      tag => root.getElementsByTagName(tag).length === 0
    );
    if (missingChildren.length) {
      result.errors.push("Missing required child tag(s): " + missingChildren.join(", "));
      result.suggestions.push("Insert these tags inside your root, e.g. " + missingChildren.map(tag => `<${tag}>...</${tag}>`).join(" "));
    } else {
      result.requiredChildren = true;
    }
  }

  // If all checks passed
  if (
    result.wellFormed &&
    result.rootTag &&
    result.odtNamespaces &&
    result.requiredAttrs &&
    result.requiredChildren
  ) {
    result.suggestions.push("Valid ODT content.xml. Ready for conversion.");
  }

  return result;
}

// Helper: Download blob as file
function downloadBlob(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(link.href), 10000);
}

xmlInput.addEventListener('change', handleFiles);

let uploadedFiles = []; // [{ name, xmlText, validation, converted }]

function handleFiles(e) {
  const files = Array.from(e.target.files);
  fileCount.textContent = files.length > 0
    ? `${files.length} file(s) selected`
    : '';
  previewTable.innerHTML = '';
  convertActions.innerHTML = '';
  uploadedFiles = [];

  files.forEach((file, idx) => {
    const reader = new FileReader();
    reader.onload = function(evt) {
      const xmlText = evt.target.result;
      const validation = validateXML(xmlText);

      uploadedFiles.push({
        name: file.name,
        xmlText,
        validation,
        converted: false,
        odtBlob: null
      });

      renderPreviews();
      renderConvertActions();
    };
    reader.readAsText(file);
  });
}

function renderPreviews() {
  previewTable.innerHTML = '';
  uploadedFiles.forEach((fileObj, idx) => {
    const previewWrap = document.createElement('div');
    previewWrap.style.marginBottom = "2em";
    previewWrap.className = "file-row";

    // Filename
    const fileTitle = document.createElement('div');
    fileTitle.textContent = fileObj.name;
    fileTitle.style.fontWeight = "bold";
    fileTitle.style.marginBottom = "0.5em";
    previewWrap.appendChild(fileTitle);

    // Syntax highlighted preview
    const preview = document.createElement('pre');
    preview.className = 'preview-xml language-xml';
    preview.innerHTML = Prism.highlight(fileObj.xmlText, Prism.languages.xml, 'xml');
    previewWrap.appendChild(preview);

    // Validation result
    const valDiv = document.createElement('div');
    valDiv.style.marginTop = "0.5em";
    valDiv.style.textAlign = "left";
    fileObj.validation.errors.forEach(msg => {
      const msgEl = document.createElement('span');
      msgEl.textContent = "❌ " + msg;
      msgEl.style.display = "block";
      msgEl.style.color = "#d32f2f";
      msgEl.style.fontWeight = "bold";
      valDiv.appendChild(msgEl);
    });
    fileObj.validation.warnings.forEach(msg => {
      const msgEl = document.createElement('span');
      msgEl.textContent = "⚠️ " + msg;
      msgEl.style.display = "block";
      msgEl.style.color = "#ffa000";
      valDiv.appendChild(msgEl);
    });
    fileObj.validation.suggestions.forEach(msg => {
      const msgEl = document.createElement('span');
      msgEl.textContent = "✅ " + msg;
      msgEl.style.display = "block";
      msgEl.style.color = "#388e3c";
      valDiv.appendChild(msgEl);
    });
    previewWrap.appendChild(valDiv);

    // Convert/Delete buttons per file
    const actionDiv = document.createElement('div');
    actionDiv.style.marginTop = "1em";
    actionDiv.style.textAlign = "right";

    if (!fileObj.converted) {
      const convertBtn = document.createElement('button');
      convertBtn.textContent = "Convert now";
      convertBtn.className = "mdl-button mdl-js-button mdl-button--raised mdl-button--colored";
      convertBtn.style.backgroundColor = "#388e3c";
      convertBtn.style.color = "#fff";
      convertBtn.onclick = () => convertSingle(idx);
      convertBtn.disabled = fileObj.validation.errors.length > 0;
      actionDiv.appendChild(convertBtn);
    } else {
      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = "Download again";
      downloadBtn.className = "mdl-button mdl-js-button mdl-button--raised";
      downloadBtn.style.backgroundColor = "#1976d2";
      downloadBtn.style.color = "#fff";
      downloadBtn.onclick = () => downloadBlob(fileObj.odtBlob, getOdtName(fileObj.name));
      actionDiv.appendChild(downloadBtn);

      const resetBtn = document.createElement('button');
      resetBtn.textContent = "Convert new files";
      resetBtn.className = "mdl-button mdl-js-button mdl-button--raised";
      resetBtn.style.backgroundColor = "#ff9800";
      resetBtn.style.color = "#fff";
      resetBtn.style.marginLeft = "1em";
      resetBtn.onclick = resetAll;
      actionDiv.appendChild(resetBtn);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "mdl-button mdl-js-button mdl-button--raised";
    deleteBtn.style.backgroundColor = "#d32f2f";
    deleteBtn.style.color = "#fff";
    deleteBtn.style.marginLeft = "1em";
    deleteBtn.onclick = () => deleteFile(idx);
    actionDiv.appendChild(deleteBtn);

    previewWrap.appendChild(actionDiv);

    previewTable.appendChild(previewWrap);
  });
}

function renderConvertActions() {
  convertActions.innerHTML = '';
  if (uploadedFiles.length > 1 && uploadedFiles.some(f => !f.converted)) {
    // Multi-file footer
    const footerDiv = document.createElement('div');
    footerDiv.style.textAlign = "center";
    footerDiv.style.margin = "2em 0";

    const convertAllBtn = document.createElement('button');
    convertAllBtn.textContent = "Convert all";
    convertAllBtn.className = "mdl-button mdl-js-button mdl-button--raised mdl-button--colored";
    convertAllBtn.style.backgroundColor = "#388e3c";
    convertAllBtn.style.color = "#fff";
    convertAllBtn.style.marginRight = "1em";
    convertAllBtn.onclick = convertAll;
    // Disable if any file invalid
    convertAllBtn.disabled = uploadedFiles.some(f => f.validation.errors.length > 0);
    footerDiv.appendChild(convertAllBtn);

    const resetBtn = document.createElement('button');
    resetBtn.textContent = "Delete";
    resetBtn.className = "mdl-button mdl-js-button mdl-button--raised";
    resetBtn.style.backgroundColor = "#d32f2f";
    resetBtn.style.color = "#fff";
    resetBtn.onclick = resetAll;
    footerDiv.appendChild(resetBtn);

    convertActions.appendChild(footerDiv);
  }
}

function getOdtName(xmlName) {
  return xmlName.replace(/\.xml$/i, ".odt");
}

function convertSingle(idx) {
  showProgress("Converting file...");
  const fileObj = uploadedFiles[idx];
  generateOdtZip(fileObj.xmlText).then(blob => {
    fileObj.odtBlob = blob;
    fileObj.converted = true;
    hideProgress();
    downloadBlob(blob, getOdtName(fileObj.name));
    renderPreviews();
    renderConvertActions();
  });
}

function convertAll() {
  showProgress("Converting all files...");
  const promises = uploadedFiles.map((fileObj, idx) => generateOdtZip(fileObj.xmlText));
  Promise.all(promises).then(blobs => {
    // Prepare ZIP with all ODT files
    const masterZip = new JSZip();
    blobs.forEach((blob, idx) => {
      masterZip.file(getOdtName(uploadedFiles[idx].name), blob);
      uploadedFiles[idx].odtBlob = blob;
      uploadedFiles[idx].converted = true;
    });
    masterZip.generateAsync({ type: "blob" }).then(zipBlob => {
      hideProgress();
      downloadBlob(zipBlob, "converted_odt_files.zip");
      renderPreviews();
      renderConvertActions();
    });
  });
}

function deleteFile(idx) {
  uploadedFiles.splice(idx, 1);
  if (uploadedFiles.length === 0) resetAll();
  else {
    renderPreviews();
    renderConvertActions();
  }
}

function resetAll() {
  uploadedFiles = [];
  previewTable.innerHTML = '';
  convertActions.innerHTML = '';
  fileCount.textContent = '';
  xmlInput.value = '';
}

// Progress bar (simple overlay)
function showProgress(msg) {
  conversionProgress.innerHTML = `<div style="background:#fff;border-radius:8px;padding:2em;box-shadow:0 2px 12px #0002;max-width:320px;margin:2em auto;">
    <div>${msg}</div>
    <div class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="margin-top:1em;"></div>
  </div>`;
  conversionProgress.classList.remove('hidden');
}
function hideProgress() {
  conversionProgress.innerHTML = '';
  conversionProgress.classList.add('hidden');
}