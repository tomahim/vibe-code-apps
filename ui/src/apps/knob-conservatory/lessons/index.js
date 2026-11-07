const files = import.meta.glob("./*.json", { eager: true, import: "default" });

export const chapters = Object.values(files).sort((a, b) => a.order - b.order);

export const lessons = chapters.flatMap((chapter) =>
  chapter.lessons.map((lesson, index) => ({
    ...lesson,
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    chapterOrder: chapter.order,
    indexInChapter: index,
  })),
);

// Controls unlocked once a lesson is complete: everything the passed lessons
// taught, plus the current lesson's new control so it can be explored.
export function unlockedControls(passedIds, currentLesson) {
  const unlocked = new Set();
  for (const lesson of lessons) {
    if (passedIds.has(lesson.id)) lesson.unlocks.forEach((id) => unlocked.add(id));
  }
  if (currentLesson) currentLesson.unlocks.forEach((id) => unlocked.add(id));
  return unlocked;
}

export function nextLesson(passedIds) {
  return lessons.find((lesson) => !passedIds.has(lesson.id)) ?? null;
}

export const totalMinutes = lessons.reduce((total, lesson) => total + lesson.minutes, 0);
