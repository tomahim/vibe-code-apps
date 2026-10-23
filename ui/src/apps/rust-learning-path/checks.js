export const exercisesFor = (lesson) => lesson.diagnostic ? [lesson.diagnostic, lesson] : [lesson];
export function prepareRun(exercise, code) {
  return { code: exercise.check.type === 'tests' ? `${code}\n\n${exercise.check.tests}` : code, mode: exercise.check.type === 'tests' ? 'test' : 'run' };
}
// This is learning feedback, not an adversarial grading system. Concept checks
// deliberately ignore comments and strings so printing "let mut" cannot pass.
export function sourceTokens(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').replace(/"(?:\\.|[^"\\])*"/g, '""').replace(/\s+/g, ' ').trim();
}
export function checkRun(check, result, code) {
  if (check.type === 'compile_error') {
    return !result.success && new RegExp(`error\\[${check.expected}\\]`).test(result.stderr);
  }
  if (!result.success) return false;
  if (check.requires?.some((token) => !sourceTokens(code).includes(token))) return false;
  if (check.type === 'stdout') return result.stdout.trim() === check.expected.trim();
  if (check.type === 'tests') return /test result: ok\. [1-9]\d* passed; 0 failed;/.test(result.stdout);
  return false;
}
export function diagnosticLocation(line, sourceLines) {
  const match = line.match(/(?:src\/main\.rs|main\.rs):(\d+):(\d+)/);
  if (!match || Number(match[1]) > sourceLines) return null;
  return { line: Number(match[1]), column: Number(match[2]) };
}
