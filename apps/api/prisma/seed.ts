import { PrismaClient, Role, AppStatus, AppVersionStatus, LicenseKind } from '@prisma/client';

const prisma = new PrismaClient();

const apps = [
  {
    name: 'Kişisel Koruyucu Donanım Tespiti',
    slug: 'ppe-detection',
    category: 'Güvenlik',
    synopsis: 'Bilgisayarlı görü ile PPE tespiti yaparak iş sağlığı güvenliği ihlallerini anlık raporlar.',
    pricingModel: 'subscription',
    priceCents: 3900,
    supportedBoards: ['jetson', 'rpi4'],
  },
  {
    name: 'Otomatik Plaka Tanıma',
    slug: 'automatic-license-plate',
    category: 'Akıllı Şehir',
    synopsis: 'Yüksek doğruluk oranlı ALPR modeli ile plaka tanıma ve ihlal tespiti.',
    pricingModel: 'license',
    priceCents: 5900,
    supportedBoards: ['jetson'],
  },
  {
    name: 'Çukur Tespiti',
    slug: 'pothole-detection',
    category: 'Akıllı Şehir',
    synopsis: 'Yol yüzey analizi ile çukur ve deformasyonları belirleyerek bakım ekiplerine bildirim gönderir.',
    pricingModel: 'subscription',
    priceCents: 4900,
    supportedBoards: ['jetson', 'x86'],
  },
  {
    name: 'Doluluk Analizi',
    slug: 'occupancy-analytics',
    category: 'Perakende',
    synopsis: 'Mağaza içi müşteri yoğunluğunu ve ısı haritalarını çıkararak saha operasyonlarını optimize eder.',
    pricingModel: 'subscription',
    priceCents: 4500,
    supportedBoards: ['jetson', 'rpi4'],
  },
  {
    name: 'Araç Sayma',
    slug: 'vehicle-counting',
    category: 'Akıllı Şehir',
    synopsis: 'Şehir içi akış takibi için araç sayımı ve hız profilleri üretir.',
    pricingModel: 'subscription',
    priceCents: 4200,
    supportedBoards: ['jetson'],
  },
  {
    name: 'İnsan Sayma',
    slug: 'people-counting',
    category: 'Perakende',
    synopsis: 'Mağaza giriş-çıkış sayısı ve yoğunluk metriklerini gerçek zamanlı hesaplar.',
    pricingModel: 'subscription',
    priceCents: 4100,
    supportedBoards: ['jetson', 'rpi4'],
  },
  {
    name: 'Düşme Algılama',
    slug: 'fall-detection',
    category: 'Sağlık',
    synopsis: 'Yaşlı bakım tesislerinde düşmeleri algılayıp anında alarm üretir.',
    pricingModel: 'subscription',
    priceCents: 3600,
    supportedBoards: ['jetson', 'rpi4'],
  },
  {
    name: 'Saldırı Algılama',
    slug: 'intrusion-detection',
    category: 'Güvenlik',
    synopsis: 'Kritik alanlara yetkisiz girişleri algılayarak güvenlik ekiplerine bildirir.',
    pricingModel: 'license',
    priceCents: 5200,
    supportedBoards: ['jetson'],
  },
  {
    name: 'Barkod/OCR Paketi',
    slug: 'barcode-ocr-suite',
    category: 'Perakende',
    synopsis: 'Endüstriyel barkod ve OCR iş akışlarını hızlandıran optimize modeller içerir.',
    pricingModel: 'license',
    priceCents: 3300,
    supportedBoards: ['x86', 'jetson'],
  },
  {
    name: 'Hayvan İzleme',
    slug: 'livestock-tracker',
    category: 'Tarım',
    synopsis: 'Sürü yönetimi için hayvan hareketlerini izler ve anormallikleri bildirir.',
    pricingModel: 'subscription',
    priceCents: 3700,
    supportedBoards: ['jetson'],
  },
  {
    name: 'Mahsul Takibi',
    slug: 'crop-monitoring',
    category: 'Tarım',
    synopsis: 'Tarla kameralarından gelen görüntüler ile büyüme ve stres analizleri üretir.',
    pricingModel: 'subscription',
    priceCents: 4600,
    supportedBoards: ['jetson', 'edge-tpu'],
  },
  {
    name: 'Depo Güvenliği',
    slug: 'warehouse-security',
    category: 'Güvenlik',
    synopsis: 'Depo alanlarında izinsiz giriş ve forklift güvenliği için görsel analitik sunar.',
    pricingModel: 'subscription',
    priceCents: 4800,
    supportedBoards: ['jetson'],
  },
  {
    name: 'Enerji Sayaç Okuma',
    slug: 'meter-reading',
    category: 'Akıllı Şehir',
    synopsis: 'Analog/dijital sayaçları otomatik okur ve hataları raporlar.',
    pricingModel: 'subscription',
    priceCents: 3500,
    supportedBoards: ['jetson', 'x86'],
  },
  {
    name: 'Trafik İhlal Analizi',
    slug: 'traffic-violation',
    category: 'Akıllı Şehir',
    synopsis: 'Kırmızı ışık, emniyet şeridi ihlali gibi durumları tespit eder.',
    pricingModel: 'license',
    priceCents: 6200,
    supportedBoards: ['jetson'],
  },
  {
    name: 'Kalabalık Yönetimi',
    slug: 'crowd-management',
    category: 'Akıllı Şehir',
    synopsis: 'Kalabalık bölgelerde yoğunluk ve yönelimleri analiz eder.',
    pricingModel: 'subscription',
    priceCents: 4300,
    supportedBoards: ['jetson'],
  },
  {
    name: 'PPE Uyumluluk Skoru',
    slug: 'ppe-compliance-score',
    category: 'Güvenlik',
    synopsis: 'Görüntülerden PPE uyumluluk skorları ve raporları üretir.',
    pricingModel: 'subscription',
    priceCents: 4900,
    supportedBoards: ['jetson', 'rpi4'],
  },
  {
    name: 'Yüz Tanıma Kontrollü Giriş',
    slug: 'face-access-control',
    category: 'Güvenlik',
    synopsis: 'Kurumsal girişlerde yüz tanıma ile yetkilendirme yapar.',
    pricingModel: 'license',
    priceCents: 6800,
    supportedBoards: ['jetson'],
  },
  {
    name: 'Akıllı Raf Analitiği',
    slug: 'smart-shelf',
    category: 'Perakende',
    synopsis: 'Raf boşluklarını tespit ederek stok ekiplerini yönlendirir.',
    pricingModel: 'subscription',
    priceCents: 3600,
    supportedBoards: ['jetson', 'rpi4'],
  },
  {
    name: 'Ürün Kusur Tespiti',
    slug: 'defect-detection',
    category: 'Üretim',
    synopsis: 'Üretim hattında kusurlu ürünleri tespit eder.',
    pricingModel: 'subscription',
    priceCents: 5400,
    supportedBoards: ['jetson', 'x86'],
  },
  {
    name: 'Gıda Tazelik Analizi',
    slug: 'food-freshness',
    category: 'Perakende',
    synopsis: 'Gıda ürünlerinin bozulma riskini erken tespit eder.',
    pricingModel: 'subscription',
    priceCents: 4200,
    supportedBoards: ['jetson'],
  }
];

async function main() {
  await prisma.telemetrySample.deleteMany();
  await prisma.deployment.deleteMany();
  await prisma.couponRedemption.deleteMany();
  await prisma.license.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.appReview.deleteMany();
  await prisma.appVersion.deleteMany();
  await prisma.app.deleteMany();
  await prisma.deviceClaim.deleteMany();
  await prisma.device.deleteMany();
  await prisma.userOrganization.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pricingTier.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.releaseNote.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      role: Role.ADMIN,
    },
  });

  const developer = await prisma.user.create({
    data: {
      email: 'dev@example.com',
      name: 'Geliştirici',
      role: Role.DEVELOPER,
    },
  });

  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@example.com',
      name: 'Alıcı',
      role: Role.BUYER,
    },
  });

  const org = await prisma.organization.create({
    data: {
      name: 'Demo Kurum',
      users: {
        create: [
          { userId: admin.id },
          { userId: developer.id },
          { userId: buyer.id },
        ],
      },
    },
  });

  await prisma.device.create({
    data: {
      name: 'Simülasyon Cihazı',
      hw: 'jetson-nx',
      orgId: org.id,
      tags: ['lab', 'sim'],
      lastSeen: new Date(),
    },
  });

  for (const [index, app] of apps.entries()) {
    const created = await prisma.app.create({
      data: {
        ...app,
        synopsis: app.synopsis.length > 180 ? app.synopsis : `${app.synopsis} Daha fazla bilgi için mağaza detay sayfasını ziyaret edin.`,
        ownerId: developer.id,
        status: index < 5 ? AppStatus.published : AppStatus.draft,
        versions: {
          create: {
            semver: '1.0.0',
            status: index < 5 ? AppVersionStatus.approved : AppVersionStatus.draft,
            artifactUrl: `http://minio:9000/artifacts/${app.slug}/1.0.0/payload.tar.zst`,
            sha256: 'd34db33fd34db33fd34db33fd34db33fd34db33fd34db33fd34db33fd34db33f',
            manifest: {
              requirements: {
                board: app.supportedBoards,
                minAgent: '0.1.0',
              },
            },
          },
        },
        reviews: index === 0 ? {
          create: {
            reviewerId: buyer.id,
            status: AppStatus.published,
            notes: 'Gerçek saha kullanımında başarılı sonuçlar verdi.',
          },
        } : undefined,
      },
      include: { versions: true },
    });

    if (index < 5) {
      await prisma.app.update({
        where: { id: created.id },
        data: { currentVersionId: created.versions[0].id },
      });
    }
  }

  await prisma.pricingTier.createMany({
    data: [
      {
        name: 'Bireysel Başlangıç',
        kind: 'buyer',
        monthlyCents: 0,
        annualCents: 0,
        features: ['Mağaza erişimi', '1 cihaz bağlantısı'],
      },
      {
        name: 'Kurumsal',
        kind: 'buyer',
        monthlyCents: 19900,
        annualCents: 199000,
        features: ['10 cihaz', 'Öncelikli destek', 'Gelişmiş raporlama'],
      },
      {
        name: 'Developer Indie',
        kind: 'developer',
        monthlyCents: 0,
        annualCents: 0,
        features: ['1 uygulama', 'Temel analytics'],
      },
      {
        name: 'Developer Studio',
        kind: 'developer',
        monthlyCents: 12900,
        annualCents: 129000,
        features: ['Sınırsız uygulama', 'Gelir paylaşımı raporları'],
      },
    ],
  });

  await prisma.coupon.createMany({
    data: [
      {
        code: 'LAUNCH25',
        type: 'percent',
        amount: 25,
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
      {
        code: 'PPE10',
        type: 'fixed',
        amount: 1000,
        appliesToAppId: (await prisma.app.findFirst({ where: { slug: 'ppe-detection' } }))?.id,
      },
    ],
  });

  await prisma.releaseNote.create({
    data: {
      version: '2024.04',
      title: 'MVP Yayını',
      bodyMd: 'İlk sürüm ile mağaza, cihaz yönetimi ve OTA akışlarını duyurduk.',
    },
  });

  const ppeApp = await prisma.app.findFirstOrThrow({ where: { slug: 'ppe-detection' } });

  const seededLicense = await prisma.license.create({
    data: {
      appId: ppeApp.id,
      buyerId: buyer.id,
      kind: LicenseKind.subscription,
      payload: { sub: buyer.id, appId: 'ppe-detection', exp: null },
      token: 'seed-license-token',
    },
  });

  await prisma.purchase.create({
    data: {
      appId: ppeApp.id,
      buyerId: buyer.id,
      amountCents: 3900,
      provider: 'dummy',
      status: 'succeeded',
      licenseId: seededLicense.id,
    },
  });

  await prisma.notification.create({
    data: {
      userId: buyer.id,
      kind: 'changelog',
      refId: '2024.04',
    },
  });

  console.info('Seed completed');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
