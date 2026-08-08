import { execFileSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const htmlPath = join(process.cwd(), 'prospectus.html');
const pdfPath = join(process.cwd(), 'prospectus.pdf');
const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browserPath = existsSync(edgePath) ? edgePath : chromePath;

console.log(`Using browser: ${browserPath}`);
console.log(`Input HTML: ${fileUrl}`);
console.log(`Output PDF: ${pdfPath}`);

const args = [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf=${pdfPath}`,
  fileUrl
];

try {
  execFileSync(browserPath, args, { stdio: 'inherit' });
  if (existsSync(pdfPath)) {
    const stat = statSync(pdfPath);
    console.log(`SUCCESS: Created ${pdfPath} (${(stat.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error('ERROR: PDF file was not created');
  }
} catch (err) {
  console.error('Execution error:', err);
}
