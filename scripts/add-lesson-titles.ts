/**
 * Script: Add Lesson Titles to MDX Frontmatter
 *
 * This script reads lesson titles from locale JSON files (courses.json)
 * and adds them as frontmatter to the corresponding MDX lesson files.
 *
 * Usage:
 *   pnpm add-lesson-titles
 *
 * The script will:
 * 1. Read all locale JSON files from messages/{locale}/courses.json
 * 2. For each course and lesson, find the corresponding MDX file
 * 3. Add YAML frontmatter with the lesson title if it doesn't exist
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

function addFrontmatterToMdx(filePath: string, title: string) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if frontmatter already exists
  if (content.trimStart().startsWith('---')) {
    console.log(`⏭️  Frontmatter already exists in: ${filePath}`);
    return;
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

  let processedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;

  for (const [courseSlug, courseData] of Object.entries(messages.courses)) {
    for (const [lessonSlug, lessonTitle] of Object.entries(courseData.lessons)) {
      const mdxFilePath = path.join(
        COURSES_CONTENT_DIR,
        courseSlug,
        lessonSlug,
        `${locale}.mdx`
      );

      if (!fs.existsSync(mdxFilePath)) {
        notFoundCount++;
        continue;
      }

      const content = fs.readFileSync(mdxFilePath, 'utf-8');

      if (content.trimStart().startsWith('---')) {
        skippedCount++;
        continue;
      }

      addFrontmatterToMdx(mdxFilePath, lessonTitle);
      processedCount++;
    }
  }

  console.log(`📊 Locale ${locale} summary: ${processedCount} added, ${skippedCount} skipped, ${notFoundCount} not found`);
}

function main() {
  console.log('🚀 Starting to add lesson titles to frontmatter...\n');

  for (const locale of LOCALES) {
    processLocale(locale);
  }

  console.log('\n✨ Done!');
}

main();
