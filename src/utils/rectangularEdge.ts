/**
 * Creates a rectangular step edge path with waypoints
 * Uses straight lines and right angles for clean routing
 */

interface Point {
  x: number
  y: number
}

interface RectangularEdgeOptions {
  offset?: number
}

/**
 * Generates a rectangular path between two points using straight lines
 * Creates waypoints for better routing around other elements
 */
export function createRectangularPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  options: RectangularEdgeOptions = {}
): string {
  const { offset = 20 } = options

  const horizontalDistance = endX - startX
  const verticalDistance = Math.abs(endY - startY)

  // Calculate waypoints for a smooth horizontal-then-vertical path
  const waypoints: Point[] = []
  
  // Start point
  waypoints.push({ x: startX, y: startY })

  // If we have enough horizontal space, use simple routing
  if (horizontalDistance > offset * 2) {
    const midX = startX + horizontalDistance / 2
    waypoints.push({ x: midX, y: startY })
    waypoints.push({ x: midX, y: endY })
  } else {
    // More complex routing for close or overlapping elements
    // Go right first, then around
    const rightOffset = Math.max(offset, 20)
    waypoints.push({ x: startX + rightOffset, y: startY })
    
    // Add vertical transition point
    const transitionY = startY + (endY > startY ? 1 : -1) * Math.min(verticalDistance / 2, 30)
    waypoints.push({ x: startX + rightOffset, y: transitionY })
    
    // Go to end X position
    waypoints.push({ x: endX - rightOffset, y: transitionY })
    waypoints.push({ x: endX - rightOffset, y: endY })
  }

  // End point
  waypoints.push({ x: endX, y: endY })

  // Generate rectangular path with straight lines
  return generateRectangularPath(waypoints)
}

/**
 * Generates a rectangular SVG path from waypoints using straight lines
 */
function generateRectangularPath(points: Point[]): string {
  if (points.length < 2) return ''

  const path: string[] = []
  
  // Start at first point
  path.push(`M ${points[0].x} ${points[0].y}`)

  // Draw straight lines to each waypoint
  for (let i = 1; i < points.length; i++) {
    path.push(`L ${points[i].x} ${points[i].y}`)
  }

  return path.join(' ')
}
