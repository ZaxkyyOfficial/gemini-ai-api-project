import { execSync } from 'child_process';

try {
  const output = execSync('node server.js', { stdio: 'pipe' });
  console.log('Success:', output.toString());
} catch (error) {
  console.error('Error stdout:', error.stdout.toString());
  console.error('Error stderr:', error.stderr.toString());
}
