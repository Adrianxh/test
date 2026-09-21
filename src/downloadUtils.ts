import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { projectFiles } from './projectFiles';

export async function downloadProjectZip() {
  const zip = new JSZip();
  
  // Add all project files
  Object.entries(projectFiles).forEach(([path, content]) => {
    zip.file(path, content);
  });

  // Generate ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  
  // Download
  saveAs(blob, 'peptide-intelligence-atlas.zip');
}

export async function downloadDataExport(data: any) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, `peptide-atlas-export-${new Date().toISOString().split('T')[0]}.json`);
}
