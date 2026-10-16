import { TestBed } from '@angular/core/testing';
import { CodeBlock } from './code-block';

describe('CodeBlock', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CodeBlock] }).compileComponents();
  });

  it('should keep the source code intact, indentation included', async () => {
    const source = 'public class Test {\n    private int valeur = 3;\n}';
    const fixture = TestBed.createComponent(CodeBlock);
    fixture.componentRef.setInput('code', source);
    fixture.componentRef.setInput('language', 'java');
    await fixture.whenStable();

    const rendered = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.code__text'),
    ).map((line) => line.textContent);

    expect(rendered).toEqual(source.split('\n'));
  });

  it('should tag keywords and strings', async () => {
    const fixture = TestBed.createComponent(CodeBlock);
    fixture.componentRef.setInput('code', "const nom = 'Allan';");
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.tk--keyword')?.textContent).toBe('const');
    expect(compiled.querySelector('.tk--string')?.textContent).toBe("'Allan'");
  });
});
