import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Province } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding boards...");

await Promise.all([
  // ==========================================
  // BALOCHISTAN BOARDS
  // ==========================================
  prisma.board.upsert({
    where: { shortName: "BBISE Quetta" },
    update: {},
    create: {
      name: "Balochistan Board of Intermediate and Secondary Education, Quetta",
      shortName: "BBISE Quetta",
      province: Province.Balochistan,
      description:
        "Responsible for organizing, regulating, and holding SSC and HSSC exams for Quetta, Zhob, Sibi, Loralai, and Nasirabad divisions.",
      websiteUrl: "https://bbise.edu.pk",
      color: "#10B981",
    },
  }),

  prisma.board.upsert({
    where: { shortName: "BISE Khuzdar" },
    update: {},
    create: {
      name: "Board of Intermediate and Secondary Education, Khuzdar",
      shortName: "BISE Khuzdar",
      province: Province.Balochistan,
      description:
        "Handles intermediate and secondary school examination operations for the Kalat division jurisdiction.",
      websiteUrl: "https://www.bisekhuzdar.edu.pk", // Fallback structure common to regional domains
      color: "#10B981",
    },
  }),

  prisma.board.upsert({
    where: { shortName: "BISE Turbat" },
    update: {},
    create: {
      name: "Board of Intermediate and Secondary Education, Turbat",
      shortName: "BISE Turbat",
      province: Province.Balochistan,
      description:
        "Presides over metric and intermediate board evaluations for the Makran and Rakhshan divisions.",
      websiteUrl: "https://www.biseturbat.edu.pk",
      color: "#10B981",
    },
  }),

  prisma.board.upsert({
    where: { shortName: "BBTE" },
    update: {},
    create: {
      name: "Balochistan Board of Technical Education, Quetta",
      shortName: "BBTE",
      province: Province.Balochistan,
      description:
        "The regulatory body responsible for administering, examining, and certifying diploma and vocational programs across Balochistan.",
      websiteUrl: "https://www.bbte.edu.pk",
      color: "#10B981",
    },
  }),

  // ==========================================
  // AZAD JAMMU & KASHMIR (AJK) BOARDS
  // ==========================================
  prisma.board.upsert({
    where: { shortName: "AJK BISE Mirpur" },
    update: {},
    create: {
      name: "Board of Intermediate and Secondary Education, Azad Jammu & Kashmir, Mirpur",
      shortName: "AJK BISE Mirpur",
      province: Province.AJK,
      description:
        "Prescribes course paths, oversees registrations, and administers secondary and intermediate school qualifications across Azad Kashmir.",
      websiteUrl: "https://ajkbise.net",
      color: "#10B981",
    },
  }),

  // ==========================================
  // GILGIT-BALTISTAN (GB) BOARDS
  // ==========================================
  prisma.board.upsert({
    where: { shortName: "KIUEB" },
    update: {},
    create: {
      name: "Karakoram International University Examination Board, Gilgit",
      shortName: "KIUEB",
      province: Province.Gilgit_Baltistan,
      description:
        "The specialized native examining framework running secondary (SSC) and intermediate (HSSC) assessments for Gilgit-Baltistan.",
      websiteUrl: "https://examinations.kiu.edu.pk",
      color: "#10B981",
    },
  }),
]);

  // console.log('Seeding subjects...')

  // const subjectData = [
  //   { name: 'Physics', icon: 'atom', isCompulsory: false, displayOrder: 1 },
  //   {
  //     name: 'Chemistry',
  //     icon: 'flask-conical',
  //     isCompulsory: false,
  //     displayOrder: 2,
  //   },
  //   { name: 'Biology', icon: 'leaf', isCompulsory: false, displayOrder: 3 },
  //   {
  //     name: 'Mathematics',
  //     icon: 'calculator',
  //     isCompulsory: false,
  //     displayOrder: 4,
  //   },
  //   {
  //     name: 'Computer Science',
  //     icon: 'monitor',
  //     isCompulsory: false,
  //     displayOrder: 5,
  //   },
  //   { name: 'English', icon: 'languages', isCompulsory: true, displayOrder: 6 },
  //   { name: 'Urdu', icon: 'book-open', isCompulsory: true, displayOrder: 7 },
  //   { name: 'Islamiat', icon: 'landmark', isCompulsory: true, displayOrder: 8 },
  //   {
  //     name: 'Pakistan Studies',
  //     icon: 'globe',
  //     isCompulsory: true,
  //     displayOrder: 9,
  //   },
  //   {
  //     name: 'General Science',
  //     icon: 'microscope',
  //     isCompulsory: false,
  //     displayOrder: 10,
  //   },
  //   {
  //     name: 'Economics',
  //     icon: 'trending-up',
  //     isCompulsory: false,
  //     displayOrder: 11,
  //   },
  //   {
  //     name: 'Statistics',
  //     icon: 'bar-chart-2',
  //     isCompulsory: false,
  //     displayOrder: 12,
  //   },
  //   { name: 'Psychology', icon: 'brain', isCompulsory: false, displayOrder: 13 },
  //   { name: 'Sociology', icon: 'users', isCompulsory: false, displayOrder: 14 },
  // ]

  // await Promise.all(
  //   subjectData.map((subject) =>
  //     prisma.subject.upsert({
  //       where: { name: subject.name },
  //       update: {},
  //       create: subject,
  //     })
  //   )
  // )

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
