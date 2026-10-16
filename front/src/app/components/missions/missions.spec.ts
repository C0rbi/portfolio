import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Missions } from './missions';
import { BLOC1 } from '../../data/competences';
import { MISSIONS } from '../../data/missions';
import { PROJECTS } from '../../data/projects';

describe('Missions', () => {
  let fixture: ComponentFixture<Missions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Missions],
    }).compileComponents();

    fixture = TestBed.createComponent(Missions);
    await fixture.whenStable();
  });

  it('should list every mission and every realisation in the table', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('.mission').length).toBe(MISSIONS.length);
    expect(host.querySelectorAll('tbody tr').length).toBe(PROJECTS.length + MISSIONS.length);
  });

  it('should cover every competency of bloc 1 at least once (épreuve E5)', () => {
    const covered = new Set([
      ...PROJECTS.flatMap((project) => project.competences),
      ...MISSIONS.flatMap((mission) => mission.competences),
    ]);
    expect(BLOC1.every((competence) => covered.has(competence.code))).toBe(true);
  });
});
