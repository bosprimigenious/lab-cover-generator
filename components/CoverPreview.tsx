import React, { forwardRef } from 'react';
import { CoverData, SmartLineConfig } from '../types';
import { SmartUnderline } from './SmartUnderline';

interface CoverPreviewProps {
  data: CoverData;
  config: SmartLineConfig;
}

const SERIF = '"Times New Roman", "SimSun", "Noto Serif SC", serif';

const MemberTable: React.FC<{ members: CoverData['members'] }> = ({ members }) => (
  <div className="w-full pl-[8%]">
    <div className="text-[14pt] font-bold mb-2 font-serif" style={{ fontFamily: SERIF }}>
      成　　员：
    </div>
    <table
      className="w-full text-center text-[11pt] font-serif font-bold border-collapse"
      style={{ fontFamily: SERIF }}
    >
      <thead>
        <tr className="border-b-[1.5px] border-black">
          <th className="pb-1.5 px-1 font-bold w-[24%]">学号</th>
          <th className="pb-1.5 px-1 font-bold w-[14%]">姓名</th>
          <th className="pb-1.5 px-1 font-bold w-[22%]">班级</th>
          <th className="pb-1.5 px-1 font-bold">学院</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member, index) => (
          <tr key={index} className="border-b border-black/40">
            <td className="py-1.5 px-1 align-middle">{member.studentId || '\u00A0'}</td>
            <td className="py-1.5 px-1 align-middle">{member.name || '\u00A0'}</td>
            <td className="py-1.5 px-1 align-middle">{member.className || '\u00A0'}</td>
            <td className="py-1.5 px-1 align-middle leading-snug">{member.department || '\u00A0'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SingleMemberFields: React.FC<{
  member: CoverData['members'][0];
  config: SmartLineConfig;
}> = ({ member, config }) => (
  <div className="flex flex-col space-y-4 items-start pl-[15%] w-full">
    <SmartUnderline label="班　　级：" value={member.className} minWidth={config.fieldMinWidth} labelWidth="80px" fontSize="text-[14pt]" align="left" />
    <SmartUnderline label="学　　号：" value={member.studentId} minWidth={config.fieldMinWidth} labelWidth="80px" fontSize="text-[14pt]" align="left" />
    <SmartUnderline label="姓　　名：" value={member.name} minWidth={config.fieldMinWidth} labelWidth="80px" fontSize="text-[14pt]" align="left" />
    <SmartUnderline label="学　　院：" value={member.department} minWidth={config.fieldMinWidth} labelWidth="80px" fontSize="text-[14pt]" align="left" />
  </div>
);

const LabSheetMemberTable: React.FC<{ members: CoverData['members'] }> = ({ members }) => (
  <div className="w-full max-w-[480px]">
    <table
      className="w-full text-center text-[10pt] font-serif font-bold border-collapse"
      style={{ fontFamily: SERIF }}
    >
      <thead>
        <tr className="border-b-[1.5px] border-black">
          <th className="pb-1.5 px-1 font-bold w-[14%]">姓　名</th>
          <th className="pb-1.5 px-1 font-bold w-[26%]">学　号</th>
          <th className="pb-1.5 px-1 font-bold w-[24%]">班　级</th>
          <th className="pb-1.5 px-1 font-bold">专　业</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member, index) => (
          <tr key={index} className="border-b border-black/40">
            <td className="py-1 px-1 align-middle">{member.name || '\u00A0'}</td>
            <td className="py-1 px-1 align-middle">{member.studentId || '\u00A0'}</td>
            <td className="py-1 px-1 align-middle">{member.className || '\u00A0'}</td>
            <td className="py-1 px-1 align-middle leading-snug">{member.major || '\u00A0'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const LabSheetFields: React.FC<{
  data: CoverData;
  config: SmartLineConfig;
}> = ({ data, config }) => {
  const footerFields: { label: string; value: string }[] = [
    { label: '实验学时：', value: data.labHours },
    { label: '指导教师：', value: data.instructor },
    { label: '成　　绩：', value: data.grade },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col space-y-[18px] items-start w-full max-w-[480px]">
        <SmartUnderline
          label="实验课程名称"
          value={data.courseName}
          minWidth={config.titleMinWidth}
          fontSize="text-[14pt]"
          labelWidth="auto"
          align="left"
        />

        {footerFields.map(({ label, value }) => (
          <SmartUnderline
            key={label}
            label={label}
            value={value}
            minWidth={config.fieldMinWidth}
            labelWidth="100px"
            fontSize="text-[14pt]"
            align="left"
          />
        ))}

        <div className="w-full pt-1 pb-1">
          <LabSheetMemberTable members={data.members} />
        </div>
      </div>
    </div>
  );
};

const ReportHeader: React.FC<{ isGroup: boolean; logoImage: string | null }> = ({ isGroup, logoImage }) => (
  <>
    <div className={isGroup ? 'mb-6' : 'mb-8'}>
      <h2
        className="text-[32pt] font-bold text-center"
        style={{ fontFamily: '"SimHei", "Heiti SC", "Noto Sans SC", "Microsoft YaHei", sans-serif' }}
      >
        实验报告
      </h2>
    </div>
    <div className={isGroup ? 'mb-8' : 'mb-16'}>
      <img src={logoImage || '/assets/bupt-logo.png'} alt="Logo" className="w-[3.48cm] object-contain" />
    </div>
  </>
);

export const CoverPreview = forwardRef<HTMLDivElement, CoverPreviewProps>(({ data, config }, ref) => {
  const isLabSheet = data.template === 'lab-sheet';
  const isGroup = !isLabSheet && data.members.length > 1;

  return (
    <div className="flex justify-center my-8 print:my-0">
      <div
        ref={ref}
        className="bg-white text-black shadow-2xl print:shadow-none flex flex-col items-center relative box-border"
        style={{
          fontFamily: SERIF,
          width: '210mm',
          height: '297mm',
          padding: isLabSheet ? '40mm 36mm 36mm' : '36mm',
        }}
      >
        <div className="flex justify-center">
          <img
            src={data.headerImage || '/assets/bupt-title.png'}
            alt="北京邮电大学"
            className={`object-contain ${isLabSheet ? 'w-[11cm] mb-6' : 'w-[13.1cm]'}`}
          />
        </div>

        <ReportHeader isGroup={isLabSheet || isGroup} logoImage={data.logoImage} />

        <div className={`w-full flex flex-col items-center flex-1 ${isLabSheet ? 'justify-start' : 'space-y-5'}`}>
          {isLabSheet ? (
            <LabSheetFields data={data} config={config} />
          ) : (
            <>
              <div className={`w-full flex justify-center ${isGroup ? 'mb-4' : 'mb-8'}`}>
                <SmartUnderline
                  label="题目："
                  value={data.title}
                  minWidth={config.titleMinWidth}
                  fontSize="text-[18pt]"
                  labelWidth="auto"
                />
              </div>
              {isGroup ? (
                <MemberTable members={data.members} />
              ) : (
                data.members[0] && <SingleMemberFields member={data.members[0]} config={config} />
              )}
            </>
          )}
        </div>

        <div
          className={`text-[14pt] font-bold flex gap-2 ${isLabSheet ? 'mt-16' : 'mt-auto mb-30'}`}
          style={{ letterSpacing: isLabSheet ? '0.05em' : undefined }}
        >
          <span>{data.dateYear || '____'}</span>
          <span>年</span>
          <span>{data.dateMonth || '__'}</span>
          <span>月</span>
          <span>{data.dateDay || '__'}</span>
          <span>日</span>
        </div>
      </div>
    </div>
  );
});

CoverPreview.displayName = 'CoverPreview';
