import { ISpectralDiagnostic } from '@stoplight/spectral-core';
import { DiagnosticSeverity, Dictionary } from '@stoplight/types';

const SEVERITY_NAMES: Dictionary<string, DiagnosticSeverity> = {
  [DiagnosticSeverity.Error]: 'error',
  [DiagnosticSeverity.Warning]: 'warning',
  [DiagnosticSeverity.Information]: 'information',
  [DiagnosticSeverity.Hint]: 'hint',
};

function getSeverityName(severity: DiagnosticSeverity): string {
  return SEVERITY_NAMES[severity];
}

function formatPath(path: ISpectralDiagnostic['path']): string {
  return path
    .map(segment => (typeof segment === 'number' ? `[${segment}]` : segment))
    .join('.');
}

export function format(result: ISpectralDiagnostic): string {
  let format: string = getSeverityName(result.severity);
  format += ': ' + formatPath(result.path) + ': ' + result.message;

  return format;
}
