/**
 * Script: Add Course Titles to Course MDX Frontmatter
 *
 * This script reads course titles from locale JSON files (courses.json)
 * and adds them as frontmatter to the corresponding course MDX files.
 *
 * Usage:
 *   pnpm add-course-titles
 *
 * The script will:
 * 1. Read all locale JSON files from messages/{locale}/courses.json
 * 2. For each course, find the corresponding MDX file at {course-slug}/{locale}.mdx
 * 3. Add YAML frontmatter with the course title if it doesn't exist
 * 4. Skip files that already have frontmatter
 *
 * Supported locales: de, en, fr, id, uk, vi, zh-CN, zh-HK
 */

import * as fs from 'fs';
import * as path from 'path';

// Supported locales
const LOCALES = ['de', 'en', 'fr', 'id', 'uk', 'vi', 'zh-CN', 'zh-HK'];

// Paths
const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const COURSES_CONTENT_DIR = path.join(process.cwd(), 'src/app/content/courses');

interface CourseMessages {
  courses: {
    [courseSlug: string]: {
      title: string;
      lessons: {
        [lessonSlug: string]: string;
      };
    };
  };
}

function createOrUpdateMdxFile(filePath: string, title: string, courseSlug: string) {
  // Ensure the directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    // Create new file with frontmatter only
    const content = `---
title: "${title}"
---
`;
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Created: ${filePath}`);
    return 'created';
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if frontmatter already exists
  if (content.trimStart().startsWith('---')) {
    console.log(`⏭️  Frontmatter already exists in: ${filePath}`);
    return 'skipped';
  }

  // Create frontmatter
  const frontmatter = `---
title: "${title}"
---

`;

  // Add frontmatter to the beginning of the file
  const newContent = frontmatter + content;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✅ Added frontmatter to: ${filePath}`);
  return 'updated';
}

function processLocale(locale: string) {
  console.log(`\n📍 Processing locale: ${locale}`);

  const messagesFilePath = path.join(MESSAGES_DIR, locale, 'courses.json');

  if (!fs.existsSync(messagesFilePath)) {
    console.log(`⚠️  Messages file not found: ${messagesFilePath}`);
    return;
  }

  const messages: CourseMessages = JSON.parse(
    fs.readFileSync(messagesFilePath, 'utf-8')
  );

  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const [courseSlug, courseData] of Object.entries(messages.courses)) {
    const mdxFilePath = path.join(
      COURSES_CONTENT_DIR,
      courseSlug,
      `${locale}.mdx`
    );

    const result = createOrUpdateMdxFile(mdxFilePath, courseData.title, courseSlug);

    if (result === 'created') {
      createdCount++;
    } else if (result === 'updated') {
      updatedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`📊 Locale ${locale} summary: ${createdCount} created, ${updatedCount} updated, ${skippedCount} skipped`);
}

function main() {
  console.log('🚀 Starting to add course titles to frontmatter...\n');

  for (const locale of LOCALES) {
    processLocale(locale);
  }

  console.log('\n✨ Done!');
}

main();
