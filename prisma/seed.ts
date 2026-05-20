import { PrismaClient, Province } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding boards...')

  await Promise.all([
    prisma.board.upsert({
      where: { shortName: 'FBISE' },
      update: {},
      create: {
        name: 'Federal Board of Intermediate and Secondary Education',
        shortName: 'FBISE',
        province: Province.Federal,
        description:
          'Federal Board of Intermediate and Secondary Education, Islamabad',
        color: '#7C6FF7',
        displayOrder: 1,
      },
    }),
    prisma.board.upsert({
      where: { shortName: 'BISE Lahore' },
      update: {},
      create: {
        name: 'Board of Intermediate and Secondary Education, Lahore',
        shortName: 'BISE Lahore',
        province: Province.Punjab,
        description: 'Largest board in Punjab, headquartered in Lahore',
        color: '#CF6679',
        displayOrder: 2,
      },
    }),
    prisma.board.upsert({
      where: { shortName: 'BISE Gujranwala' },
      update: {},
      create: {
        name: 'Board of Intermediate and Secondary Education, Gujranwala',
        shortName: 'BISE Gujranwala',
        province: Province.Punjab,
        color: '#CF6679',
        displayOrder: 3,
      },
    }),
    prisma.board.upsert({
      where: { shortName: 'BISE Peshawar' },
      update: {},
      create: {
        name: 'Board of Intermediate and Secondary Education, Peshawar',
        shortName: 'BISE Peshawar',
        province: Province.KPK,
        description: 'Board of Intermediate and Secondary Education, Peshawar',
        color: '#2DB896',
        displayOrder: 12,
      },
    }),
    prisma.board.upsert({
      where: { shortName: 'BISE Mardan' },
      update: {},
      create: {
        name: 'Board of Intermediate and Secondary Education, Mardan',
        shortName: 'BISE Mardan',
        province: Province.KPK,
        color: '#2DB896',
        displayOrder: 13,
      },
    }),
    prisma.board.upsert({
      where: { shortName: 'BISE Karachi' },
      update: {},
      create: {
        name: 'Board of Intermediate and Secondary Education, Karachi',
        shortName: 'BISE Karachi',
        province: Province.Sindh,
        color: '#EF9F27',
        displayOrder: 18,
      },
    }),
  ])

  console.log('Seeding subjects...')

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

  console.log('Seeding feature flags...')

  const flags = [
    {
      flagName: 'common_questions',
      isEnabled: true,
      description: 'Show common questions feature',
    },
    {
      flagName: 'pdf_downloads',
      isEnabled: true,
      description: 'Allow PDF downloads',
    },
    {
      flagName: 'web_pdf_viewer',
      isEnabled: true,
      description: 'Embedded PDF viewer on web',
    },
    { flagName: 'search', isEnabled: true, description: 'Global search' },
    {
      flagName: 'push_notifications',
      isEnabled: false,
      description: 'Push notifications for new papers',
    },
    {
      flagName: 'maintenance_mode',
      isEnabled: false,
      description: 'Put app in maintenance mode',
    },
  ]

  await Promise.all(
    flags.map((flag) =>
      prisma.featureFlag.upsert({
        where: { flagName: flag.flagName },
        update: {},
        create: flag,
      })
    )
  )

  console.log('Seeding app settings...')

  const settings = [
    {
      key: 'app_name',
      value: 'PaperStack',
      description: 'Application name',
    },
    {
      key: 'app_tagline',
      value: 'Every past paper. One place.',
      description: 'Hero tagline',
    },
    {
      key: 'contact_email',
      value: 'hello@paperstack.app',
      description: 'Contact email',
    },
    {
      key: 'play_store_url',
      value: 'https://play.google.com/store/apps/details?id=com.paperstack.app',
      description: 'Google Play URL',
    },
    {
      key: 'app_store_url',
      value: 'https://apps.apple.com/app/paperstack',
      description: 'App Store URL',
    },
    {
      key: 'maintenance_message',
      value: 'We are updating PaperStack. Back shortly.',
      description: 'Maintenance banner',
    },
    { key: 'twitter_url', value: '', description: 'Twitter/X URL' },
    { key: 'instagram_url', value: '', description: 'Instagram URL' },
  ]

  await Promise.all(
    settings.map((setting) =>
      prisma.appSetting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting,
      })
    )
  )

  console.log('Seed complete.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
