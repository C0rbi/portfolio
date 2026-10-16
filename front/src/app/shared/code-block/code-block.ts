import { Component, computed, input } from '@angular/core';
import type { CodeLanguage } from '../../data/projects';

type TokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'number'
  | 'type'
  | 'annotation'
  | 'call';

interface Token {
  readonly text: string;
  readonly kind: TokenKind;
}

interface CodeLine {
  readonly number: number;
  readonly tokens: readonly Token[];
}

/** Mots-clés reconnus, communs à Java et TypeScript. */
const KEYWORDS = new Set([
  'abstract', 'async', 'await', 'boolean', 'break', 'case', 'catch', 'char', 'class', 'const',
  'continue', 'default', 'do', 'double', 'else', 'enum', 'export', 'extends', 'final', 'finally',
  'float', 'for', 'from', 'function', 'get', 'if', 'implements', 'import', 'in', 'instanceof',
  'int', 'interface', 'let', 'long', 'new', 'null', 'number', 'of', 'package', 'private',
  'protected', 'public', 'readonly', 'return', 'set', 'static', 'string', 'super', 'switch',
  'this', 'throw', 'throws', 'true', 'false', 'try', 'type', 'typeof', 'undefined', 'var', 'void',
  'while',
]);

/** Mots-clés propres à Dart, ajoutés seulement pour les extraits Dart. */
const DART_KEYWORDS = new Set([
  ...KEYWORDS,
  'as', 'dynamic', 'factory', 'is', 'late', 'mixin', 'on', 'required', 'rethrow', 'with',
]);

/**
 * Découpe une ligne de code en morceaux colorables.
 * Volontairement simple : commentaires, chaînes, annotations, mots-clés,
 * nombres, noms de types et appels de méthode. Pas de dépendance externe.
 */
const PATTERN =
  /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(@[A-Za-z_]\w*)|([A-Za-z_$][\w$]*)|(\d[\d_.]*)/g;

function tokenizeLine(line: string, keywords: ReadonlySet<string>): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;

  PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = PATTERN.exec(line)) !== null) {
    if (match.index > cursor) {
      tokens.push({ text: line.slice(cursor, match.index), kind: 'plain' });
    }

    const [text, comment, str, annotation, word, digits] = match;
    let kind: TokenKind = 'plain';

    if (comment) {
      kind = 'comment';
    } else if (str) {
      kind = 'string';
    } else if (annotation) {
      kind = 'annotation';
    } else if (digits) {
      kind = 'number';
    } else if (word) {
      const next = line[match.index + text.length];
      if (keywords.has(word)) {
        kind = 'keyword';
      } else if (next === '(') {
        kind = 'call';
      } else if (/^[A-Z]/.test(word)) {
        kind = 'type';
      }
    }

    tokens.push({ text, kind });
    cursor = match.index + text.length;
  }

  if (cursor < line.length) {
    tokens.push({ text: line.slice(cursor), kind: 'plain' });
  }

  // Une ligne vide garde tout de même sa hauteur
  return tokens.length > 0 ? tokens : [{ text: ' ', kind: 'plain' }];
}

@Component({
  selector: 'app-code-block',
  imports: [],
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
})
export class CodeBlock {
  readonly code = input.required<string>();
  readonly file = input('');
  readonly language = input<CodeLanguage>('typescript');
  readonly caption = input('');

  protected readonly lines = computed<readonly CodeLine[]>(() => {
    const keywords = this.language() === 'dart' ? DART_KEYWORDS : KEYWORDS;
    return this.code()
      .split('\n')
      .map((line, index) => ({ number: index + 1, tokens: tokenizeLine(line, keywords) }));
  });

  protected readonly label = computed(() => {
    const names: Record<CodeLanguage, string> = {
      java: 'Java',
      typescript: 'TypeScript',
      sql: 'SQL',
      dart: 'Dart',
    };
    return names[this.language()];
  });

  /** Nom de la région défilable, annoncé quand le clavier y entre. */
  protected readonly regionLabel = computed(() => `Extrait de code : ${this.file()}`);
}
