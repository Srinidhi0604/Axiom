import catalog from "@/data/college-course-catalog.json";

export type CollegeTopic = {
  slug: string;
  title: string;
  status?: string;
  xp?: number;
};

export type CollegeModule = {
  slug: string;
  title: string;
  summary?: string;
  realWorldUse?: string;
  topics?: CollegeTopic[];
};

export type CollegeCourse = {
  code: string;
  title: string;
  modules?: CollegeModule[];
};

export type CollegeSemester = {
  batch?: number;
  pdf?: string;
  courses?: CollegeCourse[];
};

export type CollegeDepartment = {
  id: string;
  semesters: Record<string, CollegeSemester>;
};

type CatalogShape = {
  departments: Record<string, { semesters: Record<string, CollegeSemester> }>;
};

const typedCatalog = catalog as CatalogShape;

export const collegeDepartments: CollegeDepartment[] = Object.entries(typedCatalog.departments).map(
  ([id, department]) => ({
    id,
    semesters: department.semesters,
  }),
);

export function getCollegeStats() {
  const courses = collegeDepartments.flatMap((department) =>
    Object.values(department.semesters).flatMap((semester) => semester.courses ?? []),
  );
  const modules = courses.flatMap((course) => course.modules ?? []);
  return {
    departments: collegeDepartments.length,
    semesters: collegeDepartments.reduce((count, department) => count + Object.keys(department.semesters).length, 0),
    courses: courses.length,
    modules: modules.length,
  };
}

export function getCollegeCourses(limit = 18) {
  const rows: Array<CollegeCourse & { department: string; semester: string; moduleCount: number; pdf?: string }> = [];

  for (const department of collegeDepartments) {
    for (const [semester, details] of Object.entries(department.semesters)) {
      for (const course of details.courses ?? []) {
        rows.push({
          ...course,
          department: department.id,
          semester,
          moduleCount: course.modules?.length ?? 0,
          pdf: details.pdf,
        });
      }
    }
  }

  return rows.slice(0, limit);
}

export function getAllCollegeCourses() {
  return getCollegeCourses(5000);
}

export function getCollegeCourse(slug: string) {
  return getAllCollegeCourses().find((course) => slugifyCourse(course.code, course.title) === slug);
}

export function getCollegeSemesters() {
  return Array.from(
    new Set(collegeDepartments.flatMap((department) => Object.keys(department.semesters).map(Number))),
  ).sort((a, b) => a - b);
}

export function slugifyDepartment(id: string) {
  return id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getCollegeDepartment(slug: string) {
  return collegeDepartments.find((department) => slugifyDepartment(department.id) === slug || department.id === slug);
}

export function getCoursesForSemester(semester: string | number) {
  const sem = String(semester);
  return collegeDepartments.flatMap((department) =>
    (department.semesters[sem]?.courses ?? []).map((course) => ({
      ...course,
      department: department.id,
      semester: sem,
      moduleCount: course.modules?.length ?? 0,
      pdf: department.semesters[sem]?.pdf,
    })),
  );
}

export function getCoursesForDepartment(departmentSlug: string) {
  const department = getCollegeDepartment(departmentSlug);
  if (!department) return [];

  return Object.entries(department.semesters).flatMap(([semester, details]) =>
    (details.courses ?? []).map((course) => ({
      ...course,
      department: department.id,
      semester,
      moduleCount: course.modules?.length ?? 0,
      pdf: details.pdf,
    })),
  );
}

export function getCoursesForSemesterAndDepartment(semester: string | number, departmentSlug: string) {
  const sem = String(semester);
  const department = getCollegeDepartment(departmentSlug);
  if (!department) return [];
  return (department.semesters[sem]?.courses ?? []).map((course) => ({
    ...course,
    department: department.id,
    semester: sem,
    moduleCount: course.modules?.length ?? 0,
    pdf: department.semesters[sem]?.pdf,
  }));
}

export function getCollegeModule(courseSlug: string, moduleSlug: string) {
  const course = getCollegeCourse(courseSlug);
  const module = course?.modules?.find((item) => item.slug === moduleSlug);
  return course && module ? { course, module } : null;
}

export function getCollegeTopic(courseSlug: string, moduleSlug: string, topicSlug: string) {
  const result = getCollegeModule(courseSlug, moduleSlug);
  const topic = result?.module.topics?.find((item) => item.slug === topicSlug);
  return result && topic ? { ...result, topic } : null;
}

export function slugifyCourse(code: string, title: string) {
  return `${code}-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}
