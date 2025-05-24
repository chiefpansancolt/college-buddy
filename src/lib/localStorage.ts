import {
  AppData,
  College,
  Semester,
  Class,
  Assignment,
  CreateCollegeData,
  CreateSemesterData,
  CreateClassData,
  CreateAssignmentData,
  AppSettings,
} from "@/types/app/app";

export const STORAGE_KEY = "college-tracker-data";

const serializeData = (data: any): string => {
  return JSON.stringify(data, (key, value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  });
};

const deserializeData = (data: string): any => {
  return JSON.parse(data, (key, value) => {
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    ) {
      return new Date(value);
    }
    return value;
  });
};

export const getAppData = (): AppData => {
  if (typeof window === "undefined") {
    return {
      colleges: [],
      settings: getDefaultSettings(),
      lastUpdated: new Date(),
    };
  }

  const storedData = localStorage.getItem(STORAGE_KEY);

  if (!storedData) {
    const defaultData: AppData = {
      colleges: [],
      settings: getDefaultSettings(),
      lastUpdated: new Date(),
    };
    localStorage.setItem(STORAGE_KEY, serializeData(defaultData));
    return defaultData;
  }

  try {
    return deserializeData(storedData);
  } catch (error) {
    console.error("Error parsing app data from localStorage:", error);
    return {
      colleges: [],
      settings: getDefaultSettings(),
      lastUpdated: new Date(),
    };
  }
};

export const saveAppData = (data: AppData): void => {
  if (typeof window === "undefined") {
    return;
  }

  const updatedData = {
    ...data,
    lastUpdated: new Date(),
  };

  localStorage.setItem(STORAGE_KEY, serializeData(updatedData));
};

const getDefaultSettings = (): AppSettings => ({
  theme: "system",
  defaultView: "list",
  notifications: {
    assignmentReminders: true,
    reminderDaysBefore: 2,
    emailNotifications: false,
    pushNotifications: true,
  },
  academic: {
    gradeScale: {
      aPlus: 97,
      a: 93,
      aMinus: 90,
      bPlus: 87,
      b: 83,
      bMinus: 80,
      cPlus: 77,
      c: 73,
      cMinus: 70,
      dPlus: 67,
      d: 63,
      f: 0,
    },
    defaultCredits: 3,
    semesterStartMonth: 8,
  },
});

export const getColleges = (): College[] => {
  const appData = getAppData();
  return appData.colleges;
};

export const getCollegeById = (id: string): College | null => {
  const colleges = getColleges();
  return colleges.find((college) => college.id === id) || null;
};

export const saveCollege = (college: College): void => {
  if (typeof window === "undefined") {
    return;
  }

  const appData = getAppData();
  const existingIndex = appData.colleges.findIndex((c) => c.id === college.id);

  if (existingIndex >= 0) {
    appData.colleges[existingIndex] = {
      ...college,
      updatedAt: new Date(),
    };
  } else {
    appData.colleges.push({
      ...college,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  saveAppData(appData);
};

export const deleteCollege = (id: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  const appData = getAppData();
  appData.colleges = appData.colleges.filter((c) => c.id !== id);
  saveAppData(appData);
};

export const createEmptyCollege = (data: CreateCollegeData): College => {
  return {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    semesters: [],
    totalCredits: 0,
  };
};

export const getSemesterById = (
  collegeId: string,
  semesterId: string,
): Semester | null => {
  const college = getCollegeById(collegeId);
  if (!college) return null;

  return (
    college.semesters.find((semester) => semester.id === semesterId) || null
  );
};

export const saveSemester = (collegeId: string, semester: Semester): void => {
  if (typeof window === "undefined") {
    return;
  }

  const appData = getAppData();
  const collegeIndex = appData.colleges.findIndex((c) => c.id === collegeId);

  if (collegeIndex === -1) return;

  const college = appData.colleges[collegeIndex];
  const existingIndex = college.semesters.findIndex(
    (s) => s.id === semester.id,
  );

  if (existingIndex >= 0) {
    college.semesters[existingIndex] = {
      ...semester,
      updatedAt: new Date(),
    };
  } else {
    college.semesters.push({
      ...semester,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  college.totalCredits = college.semesters.reduce(
    (total, sem) => total + sem.totalCredits,
    0,
  );
  college.updatedAt = new Date();

  saveAppData(appData);
};

export const deleteSemester = (collegeId: string, semesterId: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  const appData = getAppData();
  const collegeIndex = appData.colleges.findIndex((c) => c.id === collegeId);

  if (collegeIndex === -1) return;

  const college = appData.colleges[collegeIndex];
  college.semesters = college.semesters.filter((s) => s.id !== semesterId);
  college.totalCredits = college.semesters.reduce(
    (total, sem) => total + sem.totalCredits,
    0,
  );
  college.updatedAt = new Date();

  saveAppData(appData);
};

export const createEmptySemester = (data: CreateSemesterData): Semester => {
  return {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    classes: [],
    totalCredits: 0,
  };
};

export const getClassById = (
  collegeId: string,
  semesterId: string,
  classId: string,
): Class | null => {
  const semester = getSemesterById(collegeId, semesterId);
  if (!semester) return null;

  return semester.classes.find((cls) => cls.id === classId) || null;
};

export const saveClass = (
  collegeId: string,
  semesterId: string,
  classData: Class,
): void => {
  if (typeof window === "undefined") {
    return;
  }

  const appData = getAppData();
  const collegeIndex = appData.colleges.findIndex((c) => c.id === collegeId);

  if (collegeIndex === -1) return;

  const college = appData.colleges[collegeIndex];
  const semesterIndex = college.semesters.findIndex((s) => s.id === semesterId);

  if (semesterIndex === -1) return;

  const semester = college.semesters[semesterIndex];
  const existingIndex = semester.classes.findIndex(
    (c) => c.id === classData.id,
  );

  if (existingIndex >= 0) {
    semester.classes[existingIndex] = {
      ...classData,
      updatedAt: new Date(),
    };
  } else {
    semester.classes.push({
      ...classData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  semester.totalCredits = semester.classes.reduce(
    (total, cls) => total + cls.credits,
    0,
  );
  semester.updatedAt = new Date();

  college.totalCredits = college.semesters.reduce(
    (total, sem) => total + sem.totalCredits,
    0,
  );
  college.updatedAt = new Date();

  saveAppData(appData);
};

export const deleteClass = (
  collegeId: string,
  semesterId: string,
  classId: string,
): void => {
  if (typeof window === "undefined") {
    return;
  }

  const appData = getAppData();
  const collegeIndex = appData.colleges.findIndex((c) => c.id === collegeId);

  if (collegeIndex === -1) return;

  const college = appData.colleges[collegeIndex];
  const semesterIndex = college.semesters.findIndex((s) => s.id === semesterId);

  if (semesterIndex === -1) return;

  const semester = college.semesters[semesterIndex];
  semester.classes = semester.classes.filter((c) => c.id !== classId);
  semester.totalCredits = semester.classes.reduce(
    (total, cls) => total + cls.credits,
    0,
  );
  semester.updatedAt = new Date();

  college.totalCredits = college.semesters.reduce(
    (total, sem) => total + sem.totalCredits,
    0,
  );
  college.updatedAt = new Date();

  saveAppData(appData);
};

export const createEmptyClass = (data: CreateClassData): Class => {
  return {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    assignments: [],
  };
};

export const getAssignmentById = (
  collegeId: string,
  semesterId: string,
  classId: string,
  assignmentId: string,
): Assignment | null => {
  const classData = getClassById(collegeId, semesterId, classId);
  if (!classData) return null;

  return (
    classData.assignments.find(
      (assignment) => assignment.id === assignmentId,
    ) || null
  );
};

export const saveAssignment = (
  collegeId: string,
  semesterId: string,
  classId: string,
  assignment: Assignment,
): void => {
  if (typeof window === "undefined") {
    return;
  }

  const appData = getAppData();
  const collegeIndex = appData.colleges.findIndex((c) => c.id === collegeId);

  if (collegeIndex === -1) return;

  const college = appData.colleges[collegeIndex];
  const semesterIndex = college.semesters.findIndex((s) => s.id === semesterId);

  if (semesterIndex === -1) return;

  const semester = college.semesters[semesterIndex];
  const classIndex = semester.classes.findIndex((c) => c.id === classId);

  if (classIndex === -1) return;

  const classData = semester.classes[classIndex];
  const existingIndex = classData.assignments.findIndex(
    (a) => a.id === assignment.id,
  );

  if (existingIndex >= 0) {
    classData.assignments[existingIndex] = {
      ...assignment,
      updatedAt: new Date(),
    };
  } else {
    classData.assignments.push({
      ...assignment,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  classData.updatedAt = new Date();
  semester.updatedAt = new Date();
  college.updatedAt = new Date();

  saveAppData(appData);
};

export const deleteAssignment = (
  collegeId: string,
  semesterId: string,
  classId: string,
  assignmentId: string,
): void => {
  if (typeof window === "undefined") {
    return;
  }

  const appData = getAppData();
  const collegeIndex = appData.colleges.findIndex((c) => c.id === collegeId);

  if (collegeIndex === -1) return;

  const college = appData.colleges[collegeIndex];
  const semesterIndex = college.semesters.findIndex((s) => s.id === semesterId);

  if (semesterIndex === -1) return;

  const semester = college.semesters[semesterIndex];
  const classIndex = semester.classes.findIndex((c) => c.id === classId);

  if (classIndex === -1) return;

  const classData = semester.classes[classIndex];
  classData.assignments = classData.assignments.filter(
    (a) => a.id !== assignmentId,
  );

  classData.updatedAt = new Date();
  semester.updatedAt = new Date();
  college.updatedAt = new Date();

  saveAppData(appData);
};

export const createEmptyAssignment = (
  data: CreateAssignmentData,
): Assignment => {
  return {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const getSettings = (): AppSettings => {
  const appData = getAppData();
  return appData.settings;
};

export const saveSettings = (settings: Partial<AppSettings>): void => {
  if (typeof window === "undefined") {
    return;
  }

  const appData = getAppData();
  appData.settings = {
    ...appData.settings,
    ...settings,
  };

  saveAppData(appData);
};

export const getAllAssignments = (): Assignment[] => {
  const colleges = getColleges();
  const assignments: Assignment[] = [];

  colleges.forEach((college) => {
    college.semesters.forEach((semester) => {
      semester.classes.forEach((cls) => {
        assignments.push(...cls.assignments);
      });
    });
  });

  return assignments;
};

export const getAssignmentsByStatus = (status: string): Assignment[] => {
  return getAllAssignments().filter(
    (assignment) => assignment.status === status,
  );
};

export const getUpcomingAssignments = (days: number = 7): Assignment[] => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  return getAllAssignments().filter((assignment) => {
    const dueDate = new Date(assignment.dueDate);
    return dueDate >= now && dueDate <= futureDate;
  });
};
