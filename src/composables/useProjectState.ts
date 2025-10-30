import { ref } from "vue";
import type { GanttProject } from "@/types";

/**
 * Manage project expand/collapse state
 */
export function useProjectState(projects: GanttProject[]) {
  const projectStates = ref<Map<string, boolean>>(new Map());

  /**
   * Initialize project states - all expanded by default
   */
  const initializeProjectStates = () => {
    projects.forEach((project) => {
      if (!projectStates.value.has(project.id)) {
        projectStates.value.set(project.id, true);
      }
    });
  };

  /**
   * Toggle project expanded/collapsed state
   */
  const toggleProject = (projectId: string) => {
    const currentState = projectStates.value.get(projectId) ?? true;
    projectStates.value.set(projectId, !currentState);
  };

  /**
   * Check if project is expanded
   */
  const isProjectExpanded = (projectId: string): boolean => {
    return projectStates.value.get(projectId) ?? true;
  };

  return {
    projectStates,
    initializeProjectStates,
    toggleProject,
    isProjectExpanded,
  };
}
