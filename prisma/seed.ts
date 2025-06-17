import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  // 1. Admin user
  const passwordHash = await bcrypt.hash('password', 10);
  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: passwordHash,
    },
  });

  // 2. Category
  const categoryName = 'Home';
  const categorySlug = slugify(categoryName, { lower: true });
  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: {},
    create: {
      name: categoryName,
      slug: categorySlug,
    },
  });

  // 3. Post
  const postTitle = 'Selamat Datang di Portfolio';
  const postSlug = slugify(postTitle, { lower: true });
  await prisma.post.upsert({
    where: { slug: postSlug },
    update: {},
    create: {
      title: postTitle,
      slug: postSlug,
      content: 'Ini adalah konten pertama dari CMS portfolio Next.js',
      category: category.name,
    },
  });

  // 4. Experience
  await prisma.experience.create({
    data: {
      company: 'PT Koding Hebat',
      position: 'Fullstack Developer',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2023-12-31'),
      content: 'Mengembangkan aplikasi menggunakan React dan Laravel.',
    },
  });

  // 5. Project
  await prisma.project.create({
    data: {
      title: 'CMS Portfolio',
      slug: slugify('CMS Portfolio', { lower: true }),
      content: 'Sistem CMS untuk mengelola portfolio menggunakan Next.js dan Prisma.',
      Thumbnail: 'https://via.placeholder.com/400x300',
    },
  });

  console.log('✅ Seeder berhasil dijalankan.');
}

main()
  .catch((e) => {
    console.error('❌ Error saat menjalankan seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
