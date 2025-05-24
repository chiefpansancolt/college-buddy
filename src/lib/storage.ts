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
  UpdateCollegeData,
  UpdateSemesterData,
  UpdateClassData,
  UpdateAssignmentData,
  AppSettings,
} from "@/types/app/app";
import * as browserStorage from "./localStorage";

export const STORAGE_KEY = "college-tracker-data";

export const getAppData = async (): Promise<AppData> => {
  return browserStorage.getAppData();
};

export const saveAppData = async (data: AppData): Promise<void> => {
  browserStorage.saveAppData(data);
};

export const getColleges = async (): Promise<College[]> => {
  return browserStorage.getColleges();
};

export const getCollegeById = async (id: string): Promise<College | null> => {
  return browserStorage.getCollegeById(id);
};

export const saveCollege = async (college: College): Promise<void> => {
  browserStorage.saveCollege(college);
};

export const createCollege = async (
  data: CreateCollegeData,
): Promise<College> => {
  const college = browserStorage.createEmptyCollege(data);
  await saveCollege(college);
  return college;
};

export const updateCollege = async (
  id: string,
  updates: UpdateCollegeData,
): Promise<boolean> => {
  const college = await getCollegeById(id);
  if (!college) return false;

  const updatedCollege = {
    ...college,
    ...updates,
    updatedAt: new Date(),
  };

  await saveCollege(updatedCollege);
  return true;
};

export const deleteCollege = async (id: string): Promise<void> => {
  browserStorage.deleteCollege(id);
};

export const getSemesterById = async (
  collegeId: string,
  semesterId: string,
): Promise<Semester | null> => {
  return browserStorage.getSemesterById(collegeId, semesterId);
};

export const saveSemester = async (
  collegeId: string,
  semester: Semester,
): Promise<void> => {
  browserStorage.saveSemester(collegeId, semester);
};

export const createSemester = async (
  collegeId: string,
  data: CreateSemesterData,
): Promise<Semester> => {
  const semester = browserStorage.createEmptySemester(data);
  await saveSemester(collegeId, semester);
  return semester;
};

export const updateSemester = async (
  collegeId: string,
  semesterId: string,
  updates: UpdateSemesterData,
): Promise<boolean> => {
  const semester = await getSemesterById(collegeId, semesterId);
  if (!semester) return false;

  const updatedSemester = {
    ...semester,
    ...updates,
    updatedAt: new Date(),
  };

  await saveSemester(collegeId, updatedSemester);
  return true;
};

export const deleteSemester = async (
  collegeId: string,
  semesterId: string,
): Promise<void> => {
  browserStorage.deleteSemester(collegeId, semesterId);
};

export const getClassById = async (
  collegeId: string,
  semesterId: string,
  classId: string,
): Promise<Class | null> => {
  return browserStorage.getClassById(collegeId, semesterId, classId);
};

export const saveClass = async (
  collegeId: string,
  semesterId: string,
  classData: Class,
): Promise<void> => {
  browserStorage.saveClass(collegeId, semesterId, classData);
};

export const createClass = async (
  collegeId: string,
  semesterId: string,
  data: CreateClassData,
): Promise<Class> => {
  const classData = browserStorage.createEmptyClass(data);
  await saveClass(collegeId, semesterId, classData);
  return classData;
};

export const updateClass = async (
  collegeId: string,
  semesterId: string,
  classId: string,
  updates: UpdateClassData,
): Promise<boolean> => {
  const classData = await getClassById(collegeId, semesterId, classId);
  if (!classData) return false;

  const updatedClass = {
    ...classData,
    ...updates,
    updatedAt: new Date(),
  };

  await saveClass(collegeId, semesterId, updatedClass);
  return true;
};

export const deleteClass = async (
  collegeId: string,
  semesterId: string,
  classId: string,
): Promise<void> => {
  browserStorage.deleteClass(collegeId, semesterId, classId);
};

export const getAssignmentById = async (
  collegeId: string,
  semesterId: string,
  classId: string,
  assignmentId: string,
): Promise<Assignment | null> => {
  return browserStorage.getAssignmentById(
    collegeId,
    semesterId,
    classId,
    assignmentId,
  );
};

export const saveAssignment = async (
  collegeId: string,
  semesterId: string,
  classId: string,
  assignment: Assignment,
): Promise<void> => {
  browserStorage.saveAssignment(collegeId, semesterId, classId, assignment);
};

export const createAssignment = async (
  collegeId: string,
  semesterId: string,
  classId: string,
  data: CreateAssignmentData,
): Promise<Assignment> => {
  const assignment = browserStorage.createEmptyAssignment(data);
  await saveAssignment(collegeId, semesterId, classId, assignment);
  return assignment;
};

export const updateAssignment = async (
  collegeId: string,
  semesterId: string,
  classId: string,
  assignmentId: string,
  updates: UpdateAssignmentData,
): Promise<boolean> => {
  const assignment = await getAssignmentById(
    collegeId,
    semesterId,
    classId,
    assignmentId,
  );
  if (!assignment) return false;

  const updatedAssignment = {
    ...assignment,
    ...updates,
    updatedAt: new Date(),
  };

  await saveAssignment(collegeId, semesterId, classId, updatedAssignment);
  return true;
};

export const deleteAssignment = async (
  collegeId: string,
  semesterId: string,
  classId: string,
  assignmentId: string,
): Promise<void> => {
  browserStorage.deleteAssignment(collegeId, semesterId, classId, assignmentId);
};

export const getSettings = async (): Promise<AppSettings> => {
  return browserStorage.getSettings();
};

export const saveSettings = async (
  settings: Partial<AppSettings>,
): Promise<void> => {
  browserStorage.saveSettings(settings);
};

export const getAllAssignments = async (): Promise<Assignment[]> => {
  return browserStorage.getAllAssignments();
};

export const getAssignmentsByStatus = async (
  status: string,
): Promise<Assignment[]> => {
  return browserStorage.getAssignmentsByStatus(status);
};

export const getUpcomingAssignments = async (
  days: number = 7,
): Promise<Assignment[]> => {
  return browserStorage.getUpcomingAssignments(days);
};

export const getOverdueAssignments = async (): Promise<Assignment[]> => {
  const now = new Date();
  const allAssignments = await getAllAssignments();

  return allAssignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate);
    return (
      dueDate < now &&
      assignment.status !== "completed" &&
      assignment.status !== "submitted"
    );
  });
};

export const getCurrentSemester = async (
  collegeId: string,
): Promise<Semester | null> => {
  const college = await getCollegeById(collegeId);
  if (!college) return null;

  return (
    college.semesters.find((semester) => semester.status === "current") || null
  );
};

export const getActiveClasses = async (
  collegeId: string,
  semesterId: string,
): Promise<Class[]> => {
  const semester = await getSemesterById(collegeId, semesterId);
  if (!semester) return [];

  return semester.classes.filter((cls) => cls.status === "active");
};

export const bulkUpdateAssignments = async (
  updates: Array<{
    collegeId: string;
    semesterId: string;
    classId: string;
    assignmentId: string;
    data: UpdateAssignmentData;
  }>,
): Promise<boolean[]> => {
  const results = await Promise.all(
    updates.map((update) =>
      updateAssignment(
        update.collegeId,
        update.semesterId,
        update.classId,
        update.assignmentId,
        update.data,
      ),
    ),
  );

  return results;
};

export const validateDataIntegrity = async (): Promise<{
  isValid: boolean;
  errors: string[];
}> => {
  const errors: string[] = [];
  const colleges = await getColleges();

  colleges.forEach((college) => {
    if (!college.id || !college.name) {
      errors.push(`Invalid college: ${college.id || "Unknown"}`);
    }

    college.semesters.forEach((semester) => {
      if (!semester.id || !semester.name || semester.collegeId !== college.id) {
        errors.push(
          `Invalid semester: ${semester.id || "Unknown"} in college ${college.name}`,
        );
      }

      semester.classes.forEach((cls) => {
        if (!cls.id || !cls.name || cls.semesterId !== semester.id) {
          errors.push(
            `Invalid class: ${cls.id || "Unknown"} in semester ${semester.name}`,
          );
        }

        cls.assignments.forEach((assignment) => {
          if (
            !assignment.id ||
            !assignment.title ||
            assignment.classId !== cls.id
          ) {
            errors.push(
              `Invalid assignment: ${assignment.id || "Unknown"} in class ${cls.name}`,
            );
          }
        });
      });
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const exportData = async (): Promise<string> => {
  const appData = await getAppData();
  return JSON.stringify(appData, null, 2);
};

export const importData = async (jsonData: string): Promise<boolean> => {
  try {
    const data: AppData = JSON.parse(jsonData);

    if (!data.colleges || !Array.isArray(data.colleges)) {
      throw new Error("Invalid data structure");
    }

    await saveAppData(data);
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};
