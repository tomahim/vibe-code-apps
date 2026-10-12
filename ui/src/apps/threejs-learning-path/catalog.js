const files = import.meta.glob('./lessons/*.json', { eager: true, import: 'default' });
export const chapters = Object.values(files).sort((a, b) => a.order - b.order);
export const lessons = chapters.flatMap((chapter) => chapter.lessons.map((lesson) => ({ ...lesson, chapterId: chapter.id, chapterTitle: chapter.title, chapterOrder: chapter.order })));
export const totalMinutes = lessons.reduce((total, lesson) => total + lesson.minutes, 0);
