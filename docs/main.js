// Basic UI logic for XML upload & preview
const xmlInput = document.getElementById('xml-input');
const previewTable = document.getElementById('preview-table');
const fileCount = document.getElementById('file-count');

xmlInput.addEventListener('change', handleFiles);

function handleFiles(e) {
  const files = Array.from(e.target.files);
  fileCount.textContent = files.length > 0
    ? `${files.length} file(s) selected`
    : '';
  previewTable.innerHTML = '';
  files.forEach((file, idx) => {
    const reader = new FileReader();
    reader.onload = function(evt) {
      const xmlText = evt.target.result;
      const preview = document.createElement('pre');
      preview.className = 'preview-xml language-xml';
      preview.innerHTML = Prism.highlight(xmlText, Prism.languages.xml, 'xml');
      previewTable.appendChild(preview);
      // TODO: add validation, actions, etc.
    };
    reader.readAsText(file);
  });
}