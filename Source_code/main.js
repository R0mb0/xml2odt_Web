import { generateOdtZip } from './odtZip.js';

// --- Theme toggle logic ---
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.checked = theme === 'dark';
  themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
}
function toggleTheme() {
  const next = themeToggle.checked ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next);
}
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    applyTheme(saved);
  } else {
    applyTheme(getSystemTheme());
  }
  themeToggle.addEventListener('change', toggleTheme);
}
initTheme();

// --- Snackbar feedback ---
const snackbar = document.getElementById('snackbar');
function showSnackbar(msg, color = '#323232') {
  snackbar.textContent = msg;
  snackbar.style.backgroundColor = color;
  snackbar.className = "show";
  setTimeout(() => {
    snackbar.className = snackbar.className.replace("show", "");
  }, 2300);
}

// --- Modal dialog ---
const modalOverlay = document.getElementById('modal-overlay');
const modalMessage = document.getElementById('modal-message');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');
function showModal(message, onConfirm) {
  modalMessage.textContent = message;
  modalOverlay.classList.remove('hidden');
  function handlerConfirm() {
    modalOverlay.classList.add('hidden');
    modalConfirm.removeEventListener('click', handlerConfirm);
    modalCancel.removeEventListener('click', handlerCancel);
    onConfirm(true);
  }
  function handlerCancel() {
    modalOverlay.classList.add('hidden');
    modalConfirm.removeEventListener('click', handlerConfirm);
    modalCancel.removeEventListener('click', handlerCancel);
    onConfirm(false);
  }
  modalConfirm.addEventListener('click', handlerConfirm);
  modalCancel.addEventListener('click', handlerCancel);
}

// --- XML validation ---
const ODT_ROOT_TAG = "office:document-content";
const REQUIRED_NAMESPACES = [
  "xmlns:office", "xmlns:text", "xmlns:style", "xmlns:table", "xmlns:draw"
];
const REQUIRED_CHILD_TAGS = ["office:body", "office:text"];
const REQUIRED_ROOT_ATTRIBUTES = ["office:version"];

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

// --- Main logic ---
const xmlInput = document.getElementById('xml-input');
const uploadContainer = document.getElementById('upload-container');
const previewTable = document.getElementById('preview-table');
const fileCount = document.getElementById('file-count');
const convertActions = document.getElementById('convert-actions');
const conversionProgress = document.getElementById('conversion-progress');

let uploadedFiles = [];
let pendingDeleteIdx = null;
let pendingReset = false;

xmlInput.addEventListener('change', handleFiles);

function handleFiles(e) {
  const files = Array.from(e.target.files);
  fileCount.textContent = files.length > 0
    ? `${files.length} file(s) selected`
    : '';
  uploadedFiles = [];
  convertActions.innerHTML = '';
  previewTable.innerHTML = '';
  files.forEach((file) => {
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
      renderTable();
      renderConvertActions();
    };
    reader.readAsText(file);
  });
  if (files.length > 0) {
    // Hide upload section after files loaded
    uploadContainer.classList.add('hidden');
  }
  if (files.length === 0) renderTable();
}

function renderTable() {
  previewTable.innerHTML = '';
  if (uploadedFiles.length === 0) {
    previewTable.innerHTML = `<div style="margin:2em 0;">No XML files uploaded yet.</div>`;
    convertActions.innerHTML = '';
    uploadContainer.classList.remove('hidden');
    return;
  }
  // Create table
  const table = document.createElement('table');
  table.className = 'file-table';
  // Table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Preview', 'Filename', 'Actions'].forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  uploadedFiles.forEach((fileObj, idx) => {
    const tr = document.createElement('tr');

    // Preview column
    const tdPreview = document.createElement('td');
    tdPreview.style.verticalAlign = 'top';
    const preview = document.createElement('pre');
    preview.className = 'preview-xml language-xml';
    preview.innerHTML = Prism.highlight(fileObj.xmlText, Prism.languages.xml, 'xml');
    tdPreview.appendChild(preview);
    tr.appendChild(tdPreview);

    // Filename column
    const tdName = document.createElement('td');
    tdName.textContent = fileObj.name;
    tdName.style.fontWeight = "bold";
    tdName.style.verticalAlign = 'middle';
    tr.appendChild(tdName);

    // Actions column
    const tdActions = document.createElement('td');
    tdActions.className = "action-btns";
    tdActions.style.verticalAlign = 'middle';

    // Validity message card
    if (
      fileObj.validation.errors.length === 0 &&
      fileObj.validation.suggestions.length > 0
    ) {
      const msgCard = document.createElement('div');
      msgCard.className = 'validity-msg';
      msgCard.innerHTML = `<span style="font-size:1.22em;">✅</span> ${fileObj.validation.suggestions[0]}`;
      tdActions.appendChild(msgCard);
    }

    // Validation feedback (errors/warnings)
    fileObj.validation.errors.forEach(msg => {
      const msgEl = document.createElement('span');
      msgEl.textContent = "❌ " + msg;
      msgEl.style.color = "#d32f2f";
      msgEl.style.fontWeight = "bold";
      msgEl.style.fontSize = "1em";
      msgEl.style.marginBottom = "0.7em";
      tdActions.appendChild(msgEl);
    });
    fileObj.validation.warnings.forEach(msg => {
      const msgEl = document.createElement('span');
      msgEl.textContent = "⚠️ " + msg;
      msgEl.style.color = "#ffa000";
      msgEl.style.fontSize = "1em";
      msgEl.style.marginBottom = "0.7em";
      tdActions.appendChild(msgEl);
    });

    // Convert/Delete buttons per file
    if (!fileObj.converted) {
      const convertBtn = document.createElement('button');
      convertBtn.textContent = "CONVERT";
      convertBtn.className = "mdl-button mdl-js-button mdl-button--raised mdl-button--colored";
      convertBtn.style.backgroundColor = "#388e3c";
      convertBtn.style.color = "#fff";
      convertBtn.style.marginBottom = "0.7em";
      convertBtn.onclick = () => convertSingle(idx);
      convertBtn.disabled = fileObj.validation.errors.length > 0;
      tdActions.appendChild(convertBtn);
    } else {
      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = "DOWNLOAD AGAIN";
      downloadBtn.className = "mdl-button mdl-js-button mdl-button--raised";
      downloadBtn.style.backgroundColor = "#1976d2";
      downloadBtn.style.color = "#fff";
      downloadBtn.style.marginBottom = "0.7em";
      downloadBtn.onclick = () => downloadBlob(fileObj.odtBlob, getOdtName(fileObj.name));
      tdActions.appendChild(downloadBtn);

      const resetBtn = document.createElement('button');
      resetBtn.textContent = "CONVERT NEW FILES";
      resetBtn.className = "mdl-button mdl-js-button mdl-button--raised";
      resetBtn.style.backgroundColor = "#ff9800";
      resetBtn.style.color = "#fff";
      resetBtn.style.marginBottom = "0.7em";
      resetBtn.onclick = resetAll;
      tdActions.appendChild(resetBtn);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "DELETE";
    deleteBtn.className = "mdl-button mdl-js-button mdl-button--raised";
    deleteBtn.style.backgroundColor = "#d32f2f";
    deleteBtn.style.color = "#fff";
    deleteBtn.style.marginBottom = "0.7em";
    deleteBtn.onclick = () => requestDelete(idx);
    tdActions.appendChild(deleteBtn);

    tr.appendChild(tdActions);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  previewTable.appendChild(table);
}

function renderConvertActions() {
  convertActions.innerHTML = '';
  if (uploadedFiles.length > 1 && uploadedFiles.some(f => !f.converted)) {
    const footerDiv = document.createElement('div');
    footerDiv.style.textAlign = "center";
    footerDiv.style.margin = "2.5em 0";

    const convertAllBtn = document.createElement('button');
    convertAllBtn.textContent = "CONVERT ALL";
    convertAllBtn.className = "mdl-button mdl-js-button mdl-button--raised mdl-button--colored";
    convertAllBtn.style.backgroundColor = "#388e3c";
    convertAllBtn.style.color = "#fff";
    convertAllBtn.style.marginRight = "1.5em";
    convertAllBtn.onclick = convertAll;
    convertAllBtn.disabled = uploadedFiles.some(f => f.validation.errors.length > 0);
    footerDiv.appendChild(convertAllBtn);

    const resetBtn = document.createElement('button');
    resetBtn.textContent = "DELETE";
    resetBtn.className = "mdl-button mdl-js-button mdl-button--raised";
    resetBtn.style.backgroundColor = "#d32f2f";
    resetBtn.style.color = "#fff";
    resetBtn.onclick = requestReset;
    footerDiv.appendChild(resetBtn);

    convertActions.appendChild(footerDiv);
  }
}

function getOdtName(xmlName) {
  return xmlName.replace(/\.xml$/i, ".odt");
}

// --- ADD THIS FUNCTION ---
function downloadBlob(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(link.href), 10000);
}

// --- Conversion logic with error feedback ---
function convertSingle(idx) {
  showProgress("Converting file...");
  const fileObj = uploadedFiles[idx];
  generateOdtZip(fileObj.xmlText).then(blob => {
    fileObj.odtBlob = blob;
    fileObj.converted = true;
    hideProgress();
    showSnackbar("Conversion successful! Downloading file.", "#388e3c");
    downloadBlob(blob, getOdtName(fileObj.name));
    renderTable();
    renderConvertActions();
  }).catch(err => {
    hideProgress();
    showSnackbar("Conversion error: " + err.message, "#d32f2f");
  });
}

function convertAll() {
  showProgress("Converting all files...");
  const promises = uploadedFiles.map((fileObj) => generateOdtZip(fileObj.xmlText));
  Promise.all(promises).then(blobs => {
    const masterZip = new window.JSZip();
    blobs.forEach((blob, idx) => {
      masterZip.file(getOdtName(uploadedFiles[idx].name), blob);
      uploadedFiles[idx].odtBlob = blob;
      uploadedFiles[idx].converted = true;
    });
    masterZip.generateAsync({ type: "blob" }).then(zipBlob => {
      hideProgress();
      showSnackbar("All files converted! Downloading ZIP.", "#388e3c");
      downloadBlob(zipBlob, "converted_odt_files.zip");
      renderTable();
      renderConvertActions();
    }).catch(err => {
      hideProgress();
      showSnackbar("Error creating ZIP: " + err.message, "#d32f2f");
    });
  }).catch(err => {
    hideProgress();
    showSnackbar("Conversion error: " + err.message, "#d32f2f");
  });
}

// --- Delete/reset with confirmation ---
function requestDelete(idx) {
  pendingDeleteIdx = idx;
  showModal("Are you sure you want to delete this file?", function(confirmed) {
    if (confirmed) {
      uploadedFiles.splice(pendingDeleteIdx, 1);
      showSnackbar("File deleted.", "#d32f2f");
      if (uploadedFiles.length === 0) resetAll();
      else {
        renderTable();
        renderConvertActions();
      }
    }
    pendingDeleteIdx = null;
  });
}

function requestReset() {
  pendingReset = true;
  showModal("Are you sure you want to reset and delete all files?", function(confirmed) {
    if (confirmed) {
      resetAll();
      showSnackbar("All files deleted.", "#d32f2f");
    }
    pendingReset = false;
  });
}

function resetAll() {
  uploadedFiles = [];
  previewTable.innerHTML = '';
  convertActions.innerHTML = '';
  fileCount.textContent = '';
  xmlInput.value = '';
  uploadContainer.classList.remove('hidden');
}

// Progress bar overlay
function showProgress(msg) {
  conversionProgress.innerHTML = `<div>
    <div>${msg}</div>
    <div class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="margin-top:1em;"></div>
  </div>`;
  conversionProgress.classList.remove('hidden');
}
function hideProgress() {
  conversionProgress.innerHTML = '';
  conversionProgress.classList.add('hidden');
}