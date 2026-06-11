import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { CoverData, Member } from '../types';

const FONT = 'SimSun';
const FONT_EN = 'Times New Roman';
const SIZE_14 = 28;
const SIZE_18 = 36;
const SIZE_32 = 64;
const SIZE_11 = 22;

const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
};

const TABLE_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
  right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
};

const UNDERLINE_CELL = {
  ...NO_BORDERS,
  bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
};

const PAGE_PROPS = {
  page: {
    size: { width: 11906, height: 16838 },
    margin: { top: 2040, right: 2040, bottom: 2040, left: 2040 },
  },
};

const textRun = (text: string, size = SIZE_14, bold = true) =>
  new TextRun({ text, font: FONT, size, bold });

const paragraph = (children: TextRun[], alignment = AlignmentType.LEFT) =>
  new Paragraph({ alignment, children });

const loadImageBuffer = async (src: string | null, fallback: string): Promise<ArrayBuffer> => {
  const url = src || new URL(fallback, window.location.origin).href;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load image: ${url}`);
  return response.arrayBuffer();
};

const imageParagraph = (buffer: ArrayBuffer, width: number, height: number, spacing?: { before?: number; after?: number }) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing,
    children: [new ImageRun({ data: buffer, transformation: { width, height }, type: 'png' })],
  });

const underlineField = (label: string, value: string, labelWidth = 18): Table =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: labelWidth, type: WidthType.PERCENTAGE },
            borders: NO_BORDERS,
            children: [paragraph([textRun(label)])],
          }),
          new TableCell({
            borders: UNDERLINE_CELL,
            children: [paragraph([textRun(value || ' ')], AlignmentType.CENTER)],
          }),
        ],
      }),
    ],
  });

const tableCell = (text: string, bold = true, width?: number) =>
  new TableCell({
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    borders: TABLE_BORDERS,
    children: [paragraph([textRun(text || ' ', SIZE_11, bold)], AlignmentType.CENTER)],
  });

const labSheetMemberTable = (members: Member[]) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          tableCell('姓名', true, 14),
          tableCell('学号', true, 26),
          tableCell('班级', true, 24),
          tableCell('专业', true, 36),
        ],
      }),
      ...members.map(
        (m) =>
          new TableRow({
            children: [
              tableCell(m.name, true, 14),
              tableCell(m.studentId, true, 26),
              tableCell(m.className, true, 24),
              tableCell(m.major, true, 36),
            ],
          })
      ),
    ],
  });

const reportMemberTable = (members: Member[]) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          tableCell('学号', true, 24),
          tableCell('姓名', true, 14),
          tableCell('班级', true, 22),
          tableCell('学院', true, 40),
        ],
      }),
      ...members.map(
        (m) =>
          new TableRow({
            children: [
              tableCell(m.studentId, true, 24),
              tableCell(m.name, true, 14),
              tableCell(m.className, true, 22),
              tableCell(m.department, true, 40),
            ],
          })
      ),
    ],
  });

const dateParagraph = (data: CoverData) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 600 },
    children: [
      new TextRun({
        text: `${data.dateYear || '____'} 年 ${data.dateMonth || '__'} 月 ${data.dateDay || '__'} 日`,
        font: FONT,
        size: SIZE_14,
        bold: true,
      }),
    ],
  });

const buildLabSheetDoc = async (data: CoverData) => {
  const titleBuffer = await loadImageBuffer(data.headerImage, '/assets/bupt-title.png');
  const logoBuffer = await loadImageBuffer(data.logoImage, '/assets/bupt-logo.png');

  const children = [
    imageParagraph(titleBuffer, 420, 60, { after: 200 }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: '实验报告',
          font: 'SimHei',
          size: SIZE_32,
          bold: true,
        }),
      ],
    }),
    imageParagraph(logoBuffer, 132, 132, { after: 400 }),
    underlineField('实验课程名称', data.courseName, 28),
    new Paragraph({ spacing: { before: 300 }, children: [] }),
    underlineField('实验学时：', data.labHours),
    new Paragraph({ spacing: { before: 120 }, children: [] }),
    underlineField('指导教师：', data.instructor),
    new Paragraph({ spacing: { before: 120 }, children: [] }),
    underlineField('成　　绩：', data.grade),
    new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }),
    labSheetMemberTable(data.members),
    dateParagraph(data),
  ];

  return new Document({ sections: [{ properties: PAGE_PROPS, children }] });
};

const buildReportDoc = async (data: CoverData) => {
  const titleBuffer = await loadImageBuffer(data.headerImage, '/assets/bupt-title.png');
  const logoBuffer = await loadImageBuffer(data.logoImage, '/assets/bupt-logo.png');
  const isGroup = data.members.length > 1;
  const member = data.members[0];

  const children: (Paragraph | Table)[] = [
    imageParagraph(titleBuffer, 496, 70, { after: 300 }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: '实验报告',
          font: 'SimHei',
          size: SIZE_32,
          bold: true,
        }),
      ],
    }),
    imageParagraph(logoBuffer, 132, 132, { after: isGroup ? 400 : 700 }),
    underlineField('题目：', data.title, 12),
  ];

  if (isGroup) {
    children.push(
      new Paragraph({ spacing: { before: 300, after: 100 }, children: [textRun('成　　员：')] }),
      reportMemberTable(data.members)
    );
  } else if (member) {
    children.push(
      new Paragraph({ spacing: { before: 300 }, children: [] }),
      underlineField('班　　级：', member.className),
      new Paragraph({ spacing: { before: 120 }, children: [] }),
      underlineField('学　　号：', member.studentId),
      new Paragraph({ spacing: { before: 120 }, children: [] }),
      underlineField('姓　　名：', member.name),
      new Paragraph({ spacing: { before: 120 }, children: [] }),
      underlineField('学　　院：', member.department)
    );
  }

  children.push(dateParagraph(data));

  return new Document({ sections: [{ properties: PAGE_PROPS, children }] });
};

export const generateCoverDocx = async (data: CoverData): Promise<Blob> => {
  const doc = data.template === 'lab-sheet' ? await buildLabSheetDoc(data) : await buildReportDoc(data);
  return Packer.toBlob(doc);
};

export const downloadWord = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
