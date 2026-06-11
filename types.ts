export type CoverTemplate = 'report' | 'lab-sheet';

export interface Member {
  studentId: string;
  name: string;
  className: string;
  department: string;
  major: string;
}

export interface CoverData {
  template: CoverTemplate;
  title: string;
  courseName: string;
  major: string;
  className: string;
  labHours: string;
  instructor: string;
  grade: string;
  course: string;
  members: Member[];
  dateYear: string;
  dateMonth: string;
  dateDay: string;
  headerImage: string | null;
  logoImage: string | null;
}

export interface SmartLineConfig {
  titleMinWidth: string;
  fieldMinWidth: string;
}

export const createEmptyMember = (): Member => ({
  studentId: '',
  name: '',
  className: '',
  department: '',
  major: '',
});

export const getCoverLabel = (data: CoverData): string => {
  const names = data.members.map(m => m.name.trim()).filter(Boolean);
  return names.length > 0 ? names.join('_') : 'LabReport';
};
