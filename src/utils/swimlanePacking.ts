/**
 * Pack tasks into rows within a swim lane, ensuring tasks don't overlap
 * @param tasks - Array of tasks to pack
 * @param barPadding - Padding between task bars
 * @returns Object mapping task IDs to row numbers
 */
export function packTasksIntoRows(
  tasks: Array<{ id: string; x: number; width: number }>,
  barPadding: number
): Map<string, number> {
  const taskToRow = new Map<string, number>();
  
  // Sort tasks by start position (x coordinate)
  const sortedTasks = [...tasks].sort((a, b) => a.x - b.x);
  
  // Track the end position of each row
  const rowEndPositions: number[] = [];
  
  sortedTasks.forEach((task) => {
    const taskStart = task.x;
    const taskEnd = task.x + task.width;
    
    // Find the first row where this task fits (no overlap)
    let assignedRow = -1;
    for (let row = 0; row < rowEndPositions.length; row++) {
      if (taskStart >= rowEndPositions[row]) {
        assignedRow = row;
        rowEndPositions[row] = taskEnd + barPadding; // Update row end position with padding
        break;
      }
    }
    
    // If no row found, create a new row
    if (assignedRow === -1) {
      assignedRow = rowEndPositions.length;
      rowEndPositions.push(taskEnd + barPadding);
    }
    
    taskToRow.set(task.id, assignedRow);
  });
  
  return taskToRow;
}

/**
 * Check if two tasks overlap in time
 * @param task1 - First task
 * @param task2 - Second task
 * @returns True if tasks overlap
 */
export function tasksOverlap(
  task1: { x: number; width: number },
  task2: { x: number; width: number }
): boolean {
  const task1End = task1.x + task1.width;
  const task2End = task2.x + task2.width;
  
  return task1.x < task2End && task2.x < task1End;
}
