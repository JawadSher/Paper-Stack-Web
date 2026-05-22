import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Province } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding boards...");

// await prisma.board.createMany({
//   data: [
//     // =========================================================================
//     // 1. FEDERAL BOARDS (1-2) - Color: #3B82F6
//     // =========================================================================
//     {
//       displayOrder: 1,
//       name: "Federal Board of Intermediate and Secondary Education, Islamabad",
//       shortName: "FBISE",
//       province: Province.Federal,
//       description: "Responsible for organizing, regulating, developing, and controlling Intermediate and Secondary education (SSC and HSSC) for federal areas, Cantonments, and overseas Pakistani institutions.",
//       websiteUrl: "https://www.fbise.edu.pk",
//       color: "#3B82F6",
//     },
//     {
//       displayOrder: 2,
//       name: "National Vocational and Technical Training Commission, Islamabad",
//       shortName: "NAVTEC",
//       province: Province.Federal,
//       description: "The apex federal body responsible for regulating, facilitating, and providing policy direction for vocational and technical education across Pakistan.",
//       websiteUrl: "https://navttc.gov.pk",
//       color: "#3B82F6",
//     },

//     // =========================================================================
//     // 2. PUNJAB BOARDS (3-12) - Color: #F97316
//     // =========================================================================
//     {
//       displayOrder: 3,
//       name: "Board of Intermediate and Secondary Education, Lahore",
//       shortName: "BISE Lahore",
//       province: Province.Punjab,
//       description: "Responsible for organizing and regulating SSC and HSSC examinations within the Lahore division jurisdiction.",
//       websiteUrl: "https://www.biselahore.com",
//       color: "#F97316",
//     },
//     {
//       displayOrder: 4,
//       name: "Board of Intermediate and Secondary Education, Rawalpindi",
//       shortName: "BISE Rawalpindi",
//       province: Province.Punjab,
//       description: "Conducts intermediate and secondary examinations for Rawalpindi, Attock, Chakwal, and Jhelum districts.",
//       websiteUrl: "https://biserawalpindi.edu.pk",
//       color: "#F97316",
//     },
//     {
//       displayOrder: 5,
//       name: "Board of Intermediate and Secondary Education, Faisalabad",
//       shortName: "BISE Faisalabad",
//       province: Province.Punjab,
//       description: "Manages matriculation and intermediate level education and testing services for Faisalabad division.",
//       websiteUrl: "https://bisefsd.edu.pk",
//       color: "#F97316",
//     },
//     {
//       displayOrder: 6,
//       name: "Board of Intermediate and Secondary Education, Multan",
//       shortName: "BISE Multan",
//       province: Province.Punjab,
//       description: "Presides over secondary and higher secondary educational standards and exams in the Multan division.",
//       websiteUrl: "https://www.bisemultan.edu.pk",
//       color: "#F97316",
//     },
//     {
//       displayOrder: 7,
//       name: "Board of Intermediate and Secondary Education, Gujranwala",
//       shortName: "BISE Gujranwala",
//       province: Province.Punjab,
//       description: "Governs school and college level terminal examinations across Gujranwala division districts.",
//       websiteUrl: "https://bisegrw.edu.pk",
//       color: "#F97316",
//     },
//     {
//       displayOrder: 8,
//       name: "Board of Intermediate and Secondary Education, Sargodha",
//       shortName: "BISE Sargodha",
//       province: Province.Punjab,
//       description: "Responsible for the administration and execution of SSC and HSSC examinations in Sargodha division.",
//       websiteUrl: "https://bisesargodha.edu.pk",
//       color: "#F97316",
//     },
//     {
//       displayOrder: 9,
//       name: "Board of Intermediate and Secondary Education, Bahawalpur",
//       shortName: "BISE Bahawalpur",
//       province: Province.Punjab,
//       description: "Looks after intermediate and secondary educational examination routines for the Bahawalpur region.",
//       websiteUrl: "https://bisebwp.edu.pk",
//       color: "#F97316",
//     },
//     {
//       displayOrder: 10,
//       name: "Board of Intermediate and Secondary Education, DG Khan",
//       shortName: "BISE DG Khan",
//       province: Province.Punjab,
//       description: "Conducts annual and supplementary school-leaving and intermediate exams for Dera Ghazi Khan division.",
//       websiteUrl: "https://bisedgkhan.edu.pk",
//       color: "#F97316",
//     },
//     {
//       displayOrder: 11,
//       name: "Board of Intermediate and Secondary Education, Sahiwal",
//       shortName: "BISE Sahiwal",
//       province: Province.Punjab,
//       description: "Organizes and manages secondary and higher secondary exams for Sahiwal, Okara, and Pakpattan districts.",
//       websiteUrl: "https://bisesahiwal.edu.pk",
//       color: "#F97316",
//     },
//     {
//       displayOrder: 12,
//       name: "Punjab Board of Technical Education, Lahore",
//       shortName: "PBTE",
//       province: Province.Punjab,
//       description: "A corporate body responsible for regulating, supervising, and controlling technical, vocational, and commercial education in Punjab.",
//       websiteUrl: "https://www.pbte.edu.pk",
//       color: "#F97316",
//     },

//     // =========================================================================
//     // 3. SINDH BOARDS (13-20) - Color: #EF4444
//     // =========================================================================
//     {
//       displayOrder: 13,
//       name: "Board of Intermediate Education, Karachi",
//       shortName: "BIEK",
//       province: Province.Sindh,
//       description: "Responsible for organizing, regulating, developing, and controlling Higher Secondary School Certificate (HSSC) intermediate education in the Karachi region.",
//       websiteUrl: "https://www.biek.edu.pk",
//       color: "#EF4444",
//     },
//     {
//       displayOrder: 14,
//       name: "Board of Secondary Education, Karachi",
//       shortName: "BSEK",
//       province: Province.Sindh,
//       description: "Responsible for managing Secondary School Certificate (SSC) matriculation education, curriculum alignment, and testing for Karachi division.",
//       websiteUrl: "https://www.bsek.edu.pk",
//       color: "#EF4444",
//     },
//     {
//       displayOrder: 15,
//       name: "Board of Intermediate and Secondary Education, Hyderabad",
//       shortName: "BISE Hyderabad",
//       province: Province.Sindh,
//       description: "Manages intermediate and secondary education examinations for Hyderabad division and its surrounding districts.",
//       websiteUrl: "https://biseh.edu.pk",
//       color: "#EF4444",
//     },
//     {
//       displayOrder: 16,
//       name: "Board of Intermediate and Secondary Education, Sukkur",
//       shortName: "BISE Sukkur",
//       province: Province.Sindh,
//       description: "Conducts matric and intermediate level examinations for Sukkur division, Ghotki, and Khairpur districts.",
//       websiteUrl: "https://www.bisesuksindh.edu.pk",
//       color: "#EF4444",
//     },
//     {
//       displayOrder: 17,
//       name: "Board of Intermediate and Secondary Education, Larkana",
//       shortName: "BISE Larkana",
//       province: Province.Sindh,
//       description: "Responsible for organizing SSC and HSSC exams for the Larkana division and its jurisdiction areas.",
//       websiteUrl: "https://www.biselk.edu.pk",
//       color: "#EF4444",
//     },
//     {
//       displayOrder: 18,
//       name: "Board of Intermediate and Secondary Education, Mirpurkhas",
//       shortName: "BISE Mirpurkhas",
//       province: Province.Sindh,
//       description: "Handles intermediate and secondary examinations for students across the Mirpurkhas division.",
//       websiteUrl: "https://www.bisemirpurkhas.edu.pk",
//       color: "#EF4444",
//     },
//     {
//       displayOrder: 19,
//       name: "Board of Intermediate and Secondary Education, Shaheed Benazirabad",
//       shortName: "BISE Shaheed Benazirabad",
//       province: Province.Sindh,
//       description: "Conducts SSC and HSSC exams for the districts under Nawabshah (Shaheed Benazirabad) division.",
//       websiteUrl: "https://bisesba.edu.pk",
//       color: "#EF4444",
//     },
//     {
//       displayOrder: 20,
//       name: "Sindh Board of Technical Education, Karachi",
//       shortName: "SBTE",
//       province: Province.Sindh,
//       description: "Responsible for organizing, regulating, and controlling technical, vocational, industrial, and commercial education across the province of Sindh.",
//       websiteUrl: "https://sbte.edu.pk",
//       color: "#EF4444",
//     },

//     // =========================================================================
//     // 4. KHYBER PAKHTUNKHWA (KPK) BOARDS (21-29) - Color: #6366F1
//     // =========================================================================
//     {
//       displayOrder: 21,
//       name: "Board of Intermediate and Secondary Education, Peshawar",
//       shortName: "BISE Peshawar",
//       province: Province.KPK,
//       description: "The oldest and largest educational board in KPK, managing SSC and HSSC exams for Peshawar, Charsadda, Chitral, Mohmand, and Khyber districts.",
//       websiteUrl: "https://www.bisep.edu.pk",
//       color: "#6366F1",
//     },
//     {
//       displayOrder: 22,
//       name: "Board of Intermediate and Secondary Education, Mardan",
//       shortName: "BISE Mardan",
//       province: Province.KPK,
//       description: "Oversees secondary and higher secondary educational metrics and testing operations for Mardan, Swabi, and Nowshera districts.",
//       websiteUrl: "https://web.bisemdn.edu.pk",
//       color: "#6366F1",
//     },
//     {
//       displayOrder: 23,
//       name: "Board of Intermediate and Secondary Education, Abbottabad",
//       shortName: "BISE Abbottabad",
//       province: Province.KPK,
//       description: "Responsible for handling intermediate and secondary examinations across the Hazara division, including Abbottabad, Haripur, and Mansehra.",
//       websiteUrl: "https://www.biseatd.edu.pk",
//       color: "#6366F1",
//     },
//     {
//       displayOrder: 24,
//       name: "Board of Intermediate and Secondary Education, Swat",
//       shortName: "BISE Swat",
//       province: Province.KPK,
//       description: "Conducts matriculation and intermediate terminal examinations for students throughout Swat, Shangla, and Buner districts.",
//       websiteUrl: "https://bisess.edu.pk",
//       color: "#6366F1",
//     },
//     {
//       displayOrder: 25,
//       name: "Board of Intermediate and Secondary Education, Malakand",
//       shortName: "BISE Malakand",
//       province: Province.KPK,
//       description: "Governs school and college level annual testing architectures for Malakand, Bajaur, Upper Dir, and Lower Dir districts.",
//       websiteUrl: "https://www.bisemalakand.edu.pk",
//       color: "#6366F1",
//     },
//     {
//       displayOrder: 26,
//       name: "Board of Intermediate and Secondary Education, Kohat",
//       shortName: "BISE Kohat",
//       province: Province.KPK,
//       description: "Organizes and regulates intermediate and secondary educational assessments for the districts under the Kohat division.",
//       websiteUrl: "https://bisekt.edu.pk",
//       color: "#6366F1",
//     },
//     {
//       displayOrder: 27,
//       name: "Board of Intermediate and Secondary Education, Bannu",
//       shortName: "BISE Bannu",
//       province: Province.KPK,
//       description: "Presides over metric and intermediate board evaluation routines for public and private institutes within the Bannu division.",
//       websiteUrl: "https://www.biseb.edu.pk",
//       color: "#6366F1",
//     },
//     {
//       displayOrder: 28,
//       name: "Board of Intermediate and Secondary Education, Dera Ismail Khan",
//       shortName: "BISE DI Khan",
//       province: Province.KPK,
//       description: "Manages academic registration, enrollment, and annual examinations for Dera Ismail Khan, Tank, and Waziristan areas.",
//       websiteUrl: "https://www.bisedk.edu.pk",
//       color: "#6366F1",
//     },
//     {
//       displayOrder: 29,
//       name: "Khyber Pakhtunkhwa Board of Technical and Commerce Education, Peshawar",
//       shortName: "KPBTE",
//       province: Province.KPK,
//       description: "An autonomous body corporate regulating, supervising, and managing technical, vocational, commercial, and trade programs across Khyber Pakhtunkhwa.",
//       websiteUrl: "https://www.kpbte.edu.pk",
//       color: "#6366F1",
//     },

//     // =========================================================================
//     // 5. BALOCHISTAN BOARDS (30-33) - Color: #10B981
//     // =========================================================================
//     {
//       displayOrder: 30,
//       name: "Balochistan Board of Intermediate and Secondary Education, Quetta",
//       shortName: "BBISE Quetta",
//       province: Province.Balochistan,
//       description: "Responsible for organizing, regulating, and holding SSC and HSSC exams for Quetta, Zhob, Sibi, Loralai, and Nasirabad divisions.",
//       websiteUrl: "https://bbise.edu.pk",
//       color: "#10B981",
//     },
//     {
//       displayOrder: 31,
//       name: "Board of Intermediate and Secondary Education, Khuzdar",
//       shortName: "BISE Khuzdar",
//       province: Province.Balochistan,
//       description: "Handles intermediate and secondary school examination operations for the Kalat division jurisdiction.",
//       websiteUrl: "https://www.bisekhuzdar.edu.pk",
//       color: "#10B981",
//     },
//     {
//       displayOrder: 32,
//       name: "Board of Intermediate and Secondary Education, Turbat",
//       shortName: "BISE Turbat",
//       province: Province.Balochistan,
//       description: "Presides over metric and intermediate board evaluations for the Makran and Rakhshan divisions.",
//       websiteUrl: "https://www.biseturbat.edu.pk",
//       color: "#10B981",
//     },
//     {
//       displayOrder: 33,
//       name: "Balochistan Board of Technical Education, Quetta",
//       shortName: "BBTE",
//       province: Province.Balochistan,
//       description: "The regulatory body responsible for administering, examining, and certifying diploma and vocational programs across Balochistan.",
//       websiteUrl: "https://www.bbte.edu.pk",
//       color: "#10B981",
//     },

//     // =========================================================================
//     // 6. AZAD JAMMU & KASHMIR (AJK) BOARDS (34) - Color: #B65E3C
//     // =========================================================================
//     {
//       displayOrder: 34,
//       name: "Board of Intermediate and Secondary Education, Azad Jammu & Kashmir, Mirpur",
//       shortName: "AJK BISE Mirpur",
//       province: Province.AJK,
//       description: "Prescribes course paths, oversees registrations, and administers secondary and intermediate school qualifications across Azad Kashmir.",
//       websiteUrl: "https://ajkbise.net",
//       color: "#B65E3C",
//     },

//     // =========================================================================
//     // 7. GILGIT-BALTISTAN (GB) BOARDS (35) - Color: #D97757
//     // =========================================================================
//     {
//       displayOrder: 35,
//       name: "Karakoram International University Examination Board, Gilgit",
//       shortName: "KIUEB",
//       province: Province.Gilgit_Baltistan,
//       description: "The specialized native examining framework running secondary (SSC) and intermediate (HSSC) assessments for Gilgit-Baltistan.",
//       websiteUrl: "https://examinations.kiu.edu.pk",
//       color: "#D97757",
//     },
//   ],
//   skipDuplicates: true,
// });

  // console.log('Seeding subjects...')

  const subjectData = [
    { name: 'Physics', icon: 'atom', isCompulsory: false, displayOrder: 1 },
    {
      name: 'Chemistry',
      icon: 'flask-conical',
      isCompulsory: false,
      displayOrder: 2,
    },
    { name: 'Biology', icon: 'leaf', isCompulsory: false, displayOrder: 3 },
    {
      name: 'Mathematics',
      icon: 'calculator',
      isCompulsory: false,
      displayOrder: 4,
    },
    {
      name: 'Computer Science',
      icon: 'monitor',
      isCompulsory: false,
      displayOrder: 5,
    },
    { name: 'English', icon: 'languages', isCompulsory: true, displayOrder: 6 },
    { name: 'Urdu', icon: 'book-open', isCompulsory: true, displayOrder: 7 },
    { name: 'Islamiat', icon: 'landmark', isCompulsory: true, displayOrder: 8 },
    {
      name: 'Pakistan Studies',
      icon: 'globe',
      isCompulsory: true,
      displayOrder: 9,
    },
    {
      name: 'General Science',
      icon: 'microscope',
      isCompulsory: false,
      displayOrder: 10,
    },
    {
      name: 'Economics',
      icon: 'trending-up',
      isCompulsory: false,
      displayOrder: 11,
    },
    {
      name: 'Statistics',
      icon: 'bar-chart-2',
      isCompulsory: false,
      displayOrder: 12,
    },
    { name: 'Psychology', icon: 'brain', isCompulsory: false, displayOrder: 13 },
    { name: 'Sociology', icon: 'users', isCompulsory: false, displayOrder: 14 },
  ]

  await Promise.all(
    subjectData.map((subject) =>
      prisma.subject.upsert({
        where: { name: subject.name },
        update: {},
        create: subject,
      })
    )
  )

  // console.log('Seeding feature flags...')

  // const flags = [
  //   {
  //     flagName: 'common_questions',
  //     isEnabled: true,
  //     description: 'Show common questions feature',
  //   },
  //   {
  //     flagName: 'pdf_downloads',
  //     isEnabled: true,
  //     description: 'Allow PDF downloads',
  //   },
  //   {
  //     flagName: 'web_pdf_viewer',
  //     isEnabled: true,
  //     description: 'Embedded PDF viewer on web',
  //   },
  //   { flagName: 'search', isEnabled: true, description: 'Global search' },
  //   {
  //     flagName: 'push_notifications',
  //     isEnabled: false,
  //     description: 'Push notifications for new papers',
  //   },
  //   {
  //     flagName: 'maintenance_mode',
  //     isEnabled: false,
  //     description: 'Put app in maintenance mode',
  //   },
  // ]

  // await Promise.all(
  //   flags.map((flag) =>
  //     prisma.featureFlag.upsert({
  //       where: { flagName: flag.flagName },
  //       update: {},
  //       create: flag,
  //     })
  //   )
  // )

  // console.log('Seeding app settings...')

  // const settings = [
  //   {
  //     key: 'app_name',
  //     value: 'PaperStack',
  //     description: 'Application name',
  //   },
  //   {
  //     key: 'app_tagline',
  //     value: 'Every past paper. One place.',
  //     description: 'Hero tagline',
  //   },
  //   {
  //     key: 'contact_email',
  //     value: 'hello@paperstack.app',
  //     description: 'Contact email',
  //   },
  //   {
  //     key: 'play_store_url',
  //     value: 'https://play.google.com/store/apps/details?id=com.paperstack.app',
  //     description: 'Google Play URL',
  //   },
  //   {
  //     key: 'app_store_url',
  //     value: 'https://apps.apple.com/app/paperstack',
  //     description: 'App Store URL',
  //   },
  //   {
  //     key: 'maintenance_message',
  //     value: 'We are updating PaperStack. Back shortly.',
  //     description: 'Maintenance banner',
  //   },
  //   { key: 'twitter_url', value: '', description: 'Twitter/X URL' },
  //   { key: 'instagram_url', value: '', description: 'Instagram URL' },
  // ]

  // await Promise.all(
  //   settings.map((setting) =>
  //     prisma.appSetting.upsert({
  //       where: { key: setting.key },
  //       update: {},
  //       create: setting,
  //     })
  //   )
  // )

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
