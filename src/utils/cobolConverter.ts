// ================= GLOBAL STATE =================
const varTypes: Record<string, string> = {};
let hasStopRun = false;

// ================= MAIN CONVERTER =================
export function convertCobolToJava(
  cobolCode: string,
  fileName: string
): string {
  hasStopRun = false;

  const rawName = fileName.replace(/\.(cob|cbl|cobol|txt)$/i, '');
  const className =
    capitalize(rawName.replace(/[^a-zA-Z0-9]/g, '')) || 'Main';

  const lines = cobolCode.split('\n');
  const variables = extractVariables(cobolCode);

  let javaCode = `// Converted from ${fileName}
// Auto-generated Java code from COBOL source

import java.util.Scanner;

public class ${className} {

    private Scanner scanner = new Scanner(System.in);

`;

  variables.forEach(v => (javaCode += `    ${v}\n`));

  javaCode += `
    public static void main(String[] args) {
        new ${className}().run();
    }

    public void run() {
${convertProcedure(lines)}${hasStopRun ? '' : '\n        scanner.close();'}
    }
}
`;

  return javaCode.trim();
}

// ================= VARIABLES =================
function extractVariables(code: string): string[] {
  const vars: string[] = [];
  const lines = code.split('\n');
  let inData = false;

  for (const line of lines) {
    const t = line.trim();

    if (/DATA DIVISION/i.test(t)) inData = true;
    if (/PROCEDURE DIVISION/i.test(t)) inData = false;

    if (inData) {
      const m = t.match(/^\d+\s+([\w-]+)\s+PIC\s+([\w9VX]+)/i);
      if (m) {
        const name = toJavaVar(m[1]);
        const type = cobolPicToJavaType(m[2]);
        varTypes[name] = type;
        vars.push(`private ${type} ${name} = ${defaultValue(type)};`);
      }
    }
  }
  return vars;
}

function cobolPicToJavaType(pic: string): string {
  if (/^9+$/.test(pic)) return 'int';
  if (/9+V9+/.test(pic)) return 'double';
  return 'String';
}

function defaultValue(type: string): string {
  if (type === 'int') return '0';
  if (type === 'double') return '0.0';
  return '""';
}

// ================= PROCEDURE =================
function convertProcedure(lines: string[]): string {
  let out = '';
  let active = false;

  for (let line of lines) {
    let t = line.trim();

    if (/PROCEDURE DIVISION/i.test(t)) {
      active = true;
      continue;
    }

    if (!active || !t || t.startsWith('*')) continue;

    t = stripCobolDot(t);
    out += `        ${convertStatement(t)}\n`;
  }

  return out || '        // No logic found\n';
}

// ================= STATEMENTS =================
function convertStatement(s: string): string {
  if (/^STOP RUN/i.test(s)) {
    hasStopRun = true;
    return 'return;';
  }

  if (/^DISPLAY/i.test(s)) return convertDisplay(s);
  if (/^MOVE/i.test(s)) return convertMove(s);
  if (/^ACCEPT/i.test(s)) return convertAccept(s);
  if (/^ADD/i.test(s)) return convertAdd(s);
  if (/^SUBTRACT/i.test(s)) return convertSubtract(s);
  if (/^MULTIPLY/i.test(s)) return convertMultiply(s);
  if (/^DIVIDE/i.test(s)) return convertDivide(s);

  return `// ${s}`;
}

function convertDisplay(s: string): string {
  const v = stripCobolDot(s.replace(/^DISPLAY/i, '').trim());
  return `System.out.println(${formatValue(v)});`;
}

function convertMove(s: string): string {
  const m = s.match(/MOVE\s+(\S+)\s+TO\s+(\S+)/i);
  if (!m) return `// ${s}`;
  return `${toJavaVar(m[2])} = ${formatValue(m[1])};`;
}

function convertAccept(s: string): string {
  const m = s.match(/ACCEPT\s+([\w-]+)/i);
  if (!m) return `// ${s}`;

  const name = toJavaVar(m[1]);
  const type = varTypes[name];

  if (type === 'int')
    return `${name} = scanner.nextInt(); scanner.nextLine();`;

  if (type === 'double')
    return `${name} = scanner.nextDouble(); scanner.nextLine();`;

  return `${name} = scanner.nextLine();`;
}

// ================= ARITHMETIC (FIXED) =================
function convertAdd(s: string): string {
  const m = s.match(/ADD\s+(\S+)\s+TO\s+(\S+)\s+GIVING\s+(\S+)/i);
  if (m) return `${toJavaVar(m[3])} = ${toJavaVar(m[1])} + ${toJavaVar(m[2])};`;

  const m2 = s.match(/ADD\s+(\S+)\s+TO\s+(\S+)/i);
  if (m2) return `${toJavaVar(m2[2])} += ${toJavaVar(m2[1])};`;

  return `// ${s}`;
}

function convertSubtract(s: string): string {
  const m = s.match(/SUBTRACT\s+(\S+)\s+FROM\s+(\S+)\s+GIVING\s+(\S+)/i);
  if (m) return `${toJavaVar(m[3])} = ${toJavaVar(m[2])} - ${toJavaVar(m[1])};`;

  const m2 = s.match(/SUBTRACT\s+(\S+)\s+FROM\s+(\S+)/i);
  if (m2) return `${toJavaVar(m2[2])} -= ${toJavaVar(m2[1])};`;

  return `// ${s}`;
}

function convertMultiply(s: string): string {
  const m = s.match(/MULTIPLY\s+(\S+)\s+BY\s+(\S+)\s+GIVING\s+(\S+)/i);
  if (!m) return `// ${s}`;
  return `${toJavaVar(m[3])} = ${toJavaVar(m[1])} * ${toJavaVar(m[2])};`;
}

function convertDivide(s: string): string {
  const m = s.match(/DIVIDE\s+(\S+)\s+BY\s+(\S+)\s+GIVING\s+(\S+)/i);
  if (!m) return `// ${s}`;
  return `${toJavaVar(m[3])} = (${toJavaVar(m[2])} != 0) ? (${toJavaVar(m[1])} / ${toJavaVar(m[2])}) : 0;`;
}

// ================= HELPERS =================
function stripCobolDot(v: string): string {
  return v.replace(/\.$/, '').trim();
}

function toJavaVar(name: string): string {
  return stripCobolDot(name)
    .toLowerCase()
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function formatValue(v: string): string {
  v = stripCobolDot(v);
  if (/^\d+$/.test(v)) return v;
  if (/^".*"$/.test(v)) return v;
  return toJavaVar(v);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
