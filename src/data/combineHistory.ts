import { Position } from '../types'

export interface CombineEntry {
  cmjHeightCm: number
  laneAgilitySeconds: number
  sprint34Seconds: number
  shuttleSeconds: number
  year: 2024 | 2025
}

// Realistic NBA G-League / pre-draft combine data spread around position benchmarks
// ~40-45 players per position across 2 combine years
const PG: CombineEntry[] = [
  { cmjHeightCm: 89.2, laneAgilitySeconds: 10.42, sprint34Seconds: 2.97, shuttleSeconds: 2.78, year: 2025 },
  { cmjHeightCm: 87.6, laneAgilitySeconds: 10.55, sprint34Seconds: 3.01, shuttleSeconds: 2.81, year: 2025 },
  { cmjHeightCm: 85.4, laneAgilitySeconds: 10.61, sprint34Seconds: 3.05, shuttleSeconds: 2.84, year: 2025 },
  { cmjHeightCm: 84.1, laneAgilitySeconds: 10.68, sprint34Seconds: 3.08, shuttleSeconds: 2.87, year: 2025 },
  { cmjHeightCm: 82.9, laneAgilitySeconds: 10.72, sprint34Seconds: 3.10, shuttleSeconds: 2.89, year: 2025 },
  { cmjHeightCm: 81.5, laneAgilitySeconds: 10.78, sprint34Seconds: 3.12, shuttleSeconds: 2.91, year: 2025 },
  { cmjHeightCm: 80.8, laneAgilitySeconds: 10.82, sprint34Seconds: 3.14, shuttleSeconds: 2.93, year: 2025 },
  { cmjHeightCm: 79.6, laneAgilitySeconds: 10.88, sprint34Seconds: 3.16, shuttleSeconds: 2.95, year: 2025 },
  { cmjHeightCm: 78.9, laneAgilitySeconds: 10.92, sprint34Seconds: 3.17, shuttleSeconds: 2.96, year: 2025 },
  { cmjHeightCm: 78.2, laneAgilitySeconds: 10.96, sprint34Seconds: 3.18, shuttleSeconds: 2.97, year: 2025 },
  { cmjHeightCm: 77.5, laneAgilitySeconds: 11.01, sprint34Seconds: 3.19, shuttleSeconds: 2.98, year: 2025 },
  { cmjHeightCm: 76.8, laneAgilitySeconds: 11.05, sprint34Seconds: 3.20, shuttleSeconds: 2.99, year: 2025 },
  { cmjHeightCm: 76.2, laneAgilitySeconds: 11.08, sprint34Seconds: 3.21, shuttleSeconds: 3.00, year: 2025 },
  { cmjHeightCm: 75.6, laneAgilitySeconds: 11.12, sprint34Seconds: 3.22, shuttleSeconds: 3.01, year: 2025 },
  { cmjHeightCm: 74.9, laneAgilitySeconds: 11.18, sprint34Seconds: 3.23, shuttleSeconds: 3.02, year: 2025 },
  { cmjHeightCm: 74.2, laneAgilitySeconds: 11.22, sprint34Seconds: 3.24, shuttleSeconds: 3.03, year: 2025 },
  { cmjHeightCm: 73.5, laneAgilitySeconds: 11.28, sprint34Seconds: 3.26, shuttleSeconds: 3.05, year: 2025 },
  { cmjHeightCm: 72.8, laneAgilitySeconds: 11.34, sprint34Seconds: 3.27, shuttleSeconds: 3.06, year: 2025 },
  { cmjHeightCm: 72.1, laneAgilitySeconds: 11.40, sprint34Seconds: 3.29, shuttleSeconds: 3.08, year: 2025 },
  { cmjHeightCm: 71.4, laneAgilitySeconds: 11.46, sprint34Seconds: 3.31, shuttleSeconds: 3.10, year: 2025 },
  { cmjHeightCm: 88.4, laneAgilitySeconds: 10.48, sprint34Seconds: 2.99, shuttleSeconds: 2.80, year: 2024 },
  { cmjHeightCm: 86.2, laneAgilitySeconds: 10.58, sprint34Seconds: 3.03, shuttleSeconds: 2.83, year: 2024 },
  { cmjHeightCm: 83.7, laneAgilitySeconds: 10.65, sprint34Seconds: 3.07, shuttleSeconds: 2.86, year: 2024 },
  { cmjHeightCm: 81.9, laneAgilitySeconds: 10.75, sprint34Seconds: 3.11, shuttleSeconds: 2.90, year: 2024 },
  { cmjHeightCm: 80.1, laneAgilitySeconds: 10.85, sprint34Seconds: 3.15, shuttleSeconds: 2.94, year: 2024 },
  { cmjHeightCm: 78.5, laneAgilitySeconds: 10.94, sprint34Seconds: 3.18, shuttleSeconds: 2.97, year: 2024 },
  { cmjHeightCm: 77.1, laneAgilitySeconds: 11.03, sprint34Seconds: 3.20, shuttleSeconds: 2.99, year: 2024 },
  { cmjHeightCm: 75.8, laneAgilitySeconds: 11.14, sprint34Seconds: 3.23, shuttleSeconds: 3.02, year: 2024 },
  { cmjHeightCm: 74.4, laneAgilitySeconds: 11.25, sprint34Seconds: 3.26, shuttleSeconds: 3.05, year: 2024 },
  { cmjHeightCm: 73.1, laneAgilitySeconds: 11.35, sprint34Seconds: 3.28, shuttleSeconds: 3.07, year: 2024 },
  { cmjHeightCm: 71.8, laneAgilitySeconds: 11.45, sprint34Seconds: 3.30, shuttleSeconds: 3.09, year: 2024 },
  { cmjHeightCm: 70.5, laneAgilitySeconds: 11.55, sprint34Seconds: 3.33, shuttleSeconds: 3.12, year: 2024 },
  { cmjHeightCm: 69.2, laneAgilitySeconds: 11.68, sprint34Seconds: 3.36, shuttleSeconds: 3.15, year: 2024 },
  { cmjHeightCm: 68.0, laneAgilitySeconds: 11.82, sprint34Seconds: 3.40, shuttleSeconds: 3.18, year: 2024 },
  { cmjHeightCm: 66.5, laneAgilitySeconds: 11.98, sprint34Seconds: 3.44, shuttleSeconds: 3.22, year: 2024 },
  { cmjHeightCm: 65.0, laneAgilitySeconds: 12.15, sprint34Seconds: 3.48, shuttleSeconds: 3.26, year: 2024 },
]

const SG: CombineEntry[] = [
  { cmjHeightCm: 94.0, laneAgilitySeconds: 10.28, sprint34Seconds: 2.96, shuttleSeconds: 2.72, year: 2025 },
  { cmjHeightCm: 91.5, laneAgilitySeconds: 10.38, sprint34Seconds: 2.99, shuttleSeconds: 2.75, year: 2025 },
  { cmjHeightCm: 89.8, laneAgilitySeconds: 10.45, sprint34Seconds: 3.02, shuttleSeconds: 2.78, year: 2025 },
  { cmjHeightCm: 88.2, laneAgilitySeconds: 10.52, sprint34Seconds: 3.05, shuttleSeconds: 2.81, year: 2025 },
  { cmjHeightCm: 86.9, laneAgilitySeconds: 10.60, sprint34Seconds: 3.07, shuttleSeconds: 2.83, year: 2025 },
  { cmjHeightCm: 85.6, laneAgilitySeconds: 10.66, sprint34Seconds: 3.09, shuttleSeconds: 2.85, year: 2025 },
  { cmjHeightCm: 84.4, laneAgilitySeconds: 10.72, sprint34Seconds: 3.11, shuttleSeconds: 2.87, year: 2025 },
  { cmjHeightCm: 83.1, laneAgilitySeconds: 10.78, sprint34Seconds: 3.13, shuttleSeconds: 2.89, year: 2025 },
  { cmjHeightCm: 81.8, laneAgilitySeconds: 10.85, sprint34Seconds: 3.15, shuttleSeconds: 2.91, year: 2025 },
  { cmjHeightCm: 80.5, laneAgilitySeconds: 10.92, sprint34Seconds: 3.17, shuttleSeconds: 2.92, year: 2025 },
  { cmjHeightCm: 79.2, laneAgilitySeconds: 10.98, sprint34Seconds: 3.18, shuttleSeconds: 2.94, year: 2025 },
  { cmjHeightCm: 78.0, laneAgilitySeconds: 11.05, sprint34Seconds: 3.20, shuttleSeconds: 2.95, year: 2025 },
  { cmjHeightCm: 76.8, laneAgilitySeconds: 11.12, sprint34Seconds: 3.21, shuttleSeconds: 2.97, year: 2025 },
  { cmjHeightCm: 75.6, laneAgilitySeconds: 11.20, sprint34Seconds: 3.23, shuttleSeconds: 2.98, year: 2025 },
  { cmjHeightCm: 74.4, laneAgilitySeconds: 11.28, sprint34Seconds: 3.25, shuttleSeconds: 3.00, year: 2025 },
  { cmjHeightCm: 73.2, laneAgilitySeconds: 11.36, sprint34Seconds: 3.27, shuttleSeconds: 3.02, year: 2025 },
  { cmjHeightCm: 72.0, laneAgilitySeconds: 11.44, sprint34Seconds: 3.29, shuttleSeconds: 3.04, year: 2025 },
  { cmjHeightCm: 70.8, laneAgilitySeconds: 11.54, sprint34Seconds: 3.32, shuttleSeconds: 3.07, year: 2025 },
  { cmjHeightCm: 69.5, laneAgilitySeconds: 11.65, sprint34Seconds: 3.35, shuttleSeconds: 3.10, year: 2025 },
  { cmjHeightCm: 68.0, laneAgilitySeconds: 11.78, sprint34Seconds: 3.39, shuttleSeconds: 3.14, year: 2025 },
  { cmjHeightCm: 92.8, laneAgilitySeconds: 10.32, sprint34Seconds: 2.97, shuttleSeconds: 2.73, year: 2024 },
  { cmjHeightCm: 90.5, laneAgilitySeconds: 10.42, sprint34Seconds: 3.01, shuttleSeconds: 2.76, year: 2024 },
  { cmjHeightCm: 88.6, laneAgilitySeconds: 10.50, sprint34Seconds: 3.04, shuttleSeconds: 2.79, year: 2024 },
  { cmjHeightCm: 87.0, laneAgilitySeconds: 10.58, sprint34Seconds: 3.06, shuttleSeconds: 2.82, year: 2024 },
  { cmjHeightCm: 85.3, laneAgilitySeconds: 10.65, sprint34Seconds: 3.08, shuttleSeconds: 2.84, year: 2024 },
  { cmjHeightCm: 83.8, laneAgilitySeconds: 10.74, sprint34Seconds: 3.11, shuttleSeconds: 2.87, year: 2024 },
  { cmjHeightCm: 82.2, laneAgilitySeconds: 10.82, sprint34Seconds: 3.14, shuttleSeconds: 2.90, year: 2024 },
  { cmjHeightCm: 80.8, laneAgilitySeconds: 10.90, sprint34Seconds: 3.16, shuttleSeconds: 2.92, year: 2024 },
  { cmjHeightCm: 79.4, laneAgilitySeconds: 10.98, sprint34Seconds: 3.18, shuttleSeconds: 2.94, year: 2024 },
  { cmjHeightCm: 78.0, laneAgilitySeconds: 11.07, sprint34Seconds: 3.21, shuttleSeconds: 2.96, year: 2024 },
  { cmjHeightCm: 76.6, laneAgilitySeconds: 11.16, sprint34Seconds: 3.23, shuttleSeconds: 2.99, year: 2024 },
  { cmjHeightCm: 75.2, laneAgilitySeconds: 11.26, sprint34Seconds: 3.26, shuttleSeconds: 3.01, year: 2024 },
  { cmjHeightCm: 73.8, laneAgilitySeconds: 11.38, sprint34Seconds: 3.29, shuttleSeconds: 3.04, year: 2024 },
  { cmjHeightCm: 72.4, laneAgilitySeconds: 11.50, sprint34Seconds: 3.32, shuttleSeconds: 3.07, year: 2024 },
  { cmjHeightCm: 70.9, laneAgilitySeconds: 11.64, sprint34Seconds: 3.36, shuttleSeconds: 3.11, year: 2024 },
  { cmjHeightCm: 69.3, laneAgilitySeconds: 11.80, sprint34Seconds: 3.40, shuttleSeconds: 3.15, year: 2024 },
  { cmjHeightCm: 67.6, laneAgilitySeconds: 11.98, sprint34Seconds: 3.45, shuttleSeconds: 3.20, year: 2024 },
  { cmjHeightCm: 65.8, laneAgilitySeconds: 12.18, sprint34Seconds: 3.50, shuttleSeconds: 3.25, year: 2024 },
  { cmjHeightCm: 63.9, laneAgilitySeconds: 12.40, sprint34Seconds: 3.56, shuttleSeconds: 3.31, year: 2024 },
  { cmjHeightCm: 62.0, laneAgilitySeconds: 12.62, sprint34Seconds: 3.62, shuttleSeconds: 3.37, year: 2024 },
]

const SF: CombineEntry[] = [
  { cmjHeightCm: 92.0, laneAgilitySeconds: 10.55, sprint34Seconds: 3.02, shuttleSeconds: 2.80, year: 2025 },
  { cmjHeightCm: 89.5, laneAgilitySeconds: 10.65, sprint34Seconds: 3.06, shuttleSeconds: 2.83, year: 2025 },
  { cmjHeightCm: 87.2, laneAgilitySeconds: 10.75, sprint34Seconds: 3.09, shuttleSeconds: 2.86, year: 2025 },
  { cmjHeightCm: 85.0, laneAgilitySeconds: 10.85, sprint34Seconds: 3.12, shuttleSeconds: 2.89, year: 2025 },
  { cmjHeightCm: 83.1, laneAgilitySeconds: 10.95, sprint34Seconds: 3.15, shuttleSeconds: 2.91, year: 2025 },
  { cmjHeightCm: 81.4, laneAgilitySeconds: 11.05, sprint34Seconds: 3.18, shuttleSeconds: 2.93, year: 2025 },
  { cmjHeightCm: 79.8, laneAgilitySeconds: 11.15, sprint34Seconds: 3.21, shuttleSeconds: 2.96, year: 2025 },
  { cmjHeightCm: 78.2, laneAgilitySeconds: 11.25, sprint34Seconds: 3.24, shuttleSeconds: 2.98, year: 2025 },
  { cmjHeightCm: 76.6, laneAgilitySeconds: 11.35, sprint34Seconds: 3.27, shuttleSeconds: 3.01, year: 2025 },
  { cmjHeightCm: 75.0, laneAgilitySeconds: 11.45, sprint34Seconds: 3.30, shuttleSeconds: 3.03, year: 2025 },
  { cmjHeightCm: 73.5, laneAgilitySeconds: 11.55, sprint34Seconds: 3.33, shuttleSeconds: 3.06, year: 2025 },
  { cmjHeightCm: 72.0, laneAgilitySeconds: 11.65, sprint34Seconds: 3.36, shuttleSeconds: 3.09, year: 2025 },
  { cmjHeightCm: 70.5, laneAgilitySeconds: 11.78, sprint34Seconds: 3.40, shuttleSeconds: 3.13, year: 2025 },
  { cmjHeightCm: 69.0, laneAgilitySeconds: 11.92, sprint34Seconds: 3.44, shuttleSeconds: 3.17, year: 2025 },
  { cmjHeightCm: 67.4, laneAgilitySeconds: 12.08, sprint34Seconds: 3.49, shuttleSeconds: 3.22, year: 2025 },
  { cmjHeightCm: 91.0, laneAgilitySeconds: 10.60, sprint34Seconds: 3.04, shuttleSeconds: 2.82, year: 2024 },
  { cmjHeightCm: 88.5, laneAgilitySeconds: 10.70, sprint34Seconds: 3.07, shuttleSeconds: 2.85, year: 2024 },
  { cmjHeightCm: 86.2, laneAgilitySeconds: 10.80, sprint34Seconds: 3.10, shuttleSeconds: 2.88, year: 2024 },
  { cmjHeightCm: 84.0, laneAgilitySeconds: 10.92, sprint34Seconds: 3.14, shuttleSeconds: 2.91, year: 2024 },
  { cmjHeightCm: 82.1, laneAgilitySeconds: 11.02, sprint34Seconds: 3.17, shuttleSeconds: 2.93, year: 2024 },
  { cmjHeightCm: 80.3, laneAgilitySeconds: 11.12, sprint34Seconds: 3.20, shuttleSeconds: 2.96, year: 2024 },
  { cmjHeightCm: 78.6, laneAgilitySeconds: 11.22, sprint34Seconds: 3.23, shuttleSeconds: 2.99, year: 2024 },
  { cmjHeightCm: 76.9, laneAgilitySeconds: 11.32, sprint34Seconds: 3.26, shuttleSeconds: 3.02, year: 2024 },
  { cmjHeightCm: 75.2, laneAgilitySeconds: 11.44, sprint34Seconds: 3.29, shuttleSeconds: 3.05, year: 2024 },
  { cmjHeightCm: 73.6, laneAgilitySeconds: 11.56, sprint34Seconds: 3.33, shuttleSeconds: 3.08, year: 2024 },
  { cmjHeightCm: 72.0, laneAgilitySeconds: 11.70, sprint34Seconds: 3.37, shuttleSeconds: 3.12, year: 2024 },
  { cmjHeightCm: 70.3, laneAgilitySeconds: 11.85, sprint34Seconds: 3.42, shuttleSeconds: 3.16, year: 2024 },
  { cmjHeightCm: 68.6, laneAgilitySeconds: 12.02, sprint34Seconds: 3.47, shuttleSeconds: 3.21, year: 2024 },
  { cmjHeightCm: 66.8, laneAgilitySeconds: 12.22, sprint34Seconds: 3.53, shuttleSeconds: 3.27, year: 2024 },
  { cmjHeightCm: 64.9, laneAgilitySeconds: 12.44, sprint34Seconds: 3.59, shuttleSeconds: 3.33, year: 2024 },
]

const PF: CombineEntry[] = [
  { cmjHeightCm: 88.5, laneAgilitySeconds: 10.85, sprint34Seconds: 3.08, shuttleSeconds: 2.86, year: 2025 },
  { cmjHeightCm: 86.2, laneAgilitySeconds: 10.95, sprint34Seconds: 3.11, shuttleSeconds: 2.89, year: 2025 },
  { cmjHeightCm: 83.8, laneAgilitySeconds: 11.05, sprint34Seconds: 3.14, shuttleSeconds: 2.92, year: 2025 },
  { cmjHeightCm: 81.5, laneAgilitySeconds: 11.15, sprint34Seconds: 3.17, shuttleSeconds: 2.95, year: 2025 },
  { cmjHeightCm: 79.4, laneAgilitySeconds: 11.25, sprint34Seconds: 3.20, shuttleSeconds: 2.98, year: 2025 },
  { cmjHeightCm: 77.5, laneAgilitySeconds: 11.35, sprint34Seconds: 3.23, shuttleSeconds: 3.01, year: 2025 },
  { cmjHeightCm: 75.8, laneAgilitySeconds: 11.45, sprint34Seconds: 3.26, shuttleSeconds: 3.04, year: 2025 },
  { cmjHeightCm: 74.2, laneAgilitySeconds: 11.56, sprint34Seconds: 3.29, shuttleSeconds: 3.07, year: 2025 },
  { cmjHeightCm: 72.6, laneAgilitySeconds: 11.68, sprint34Seconds: 3.33, shuttleSeconds: 3.10, year: 2025 },
  { cmjHeightCm: 71.0, laneAgilitySeconds: 11.82, sprint34Seconds: 3.37, shuttleSeconds: 3.14, year: 2025 },
  { cmjHeightCm: 69.4, laneAgilitySeconds: 11.98, sprint34Seconds: 3.42, shuttleSeconds: 3.18, year: 2025 },
  { cmjHeightCm: 67.8, laneAgilitySeconds: 12.15, sprint34Seconds: 3.47, shuttleSeconds: 3.23, year: 2025 },
  { cmjHeightCm: 87.4, laneAgilitySeconds: 10.90, sprint34Seconds: 3.09, shuttleSeconds: 2.87, year: 2024 },
  { cmjHeightCm: 85.0, laneAgilitySeconds: 11.00, sprint34Seconds: 3.12, shuttleSeconds: 2.90, year: 2024 },
  { cmjHeightCm: 82.7, laneAgilitySeconds: 11.10, sprint34Seconds: 3.15, shuttleSeconds: 2.93, year: 2024 },
  { cmjHeightCm: 80.4, laneAgilitySeconds: 11.20, sprint34Seconds: 3.18, shuttleSeconds: 2.96, year: 2024 },
  { cmjHeightCm: 78.3, laneAgilitySeconds: 11.30, sprint34Seconds: 3.21, shuttleSeconds: 2.99, year: 2024 },
  { cmjHeightCm: 76.4, laneAgilitySeconds: 11.40, sprint34Seconds: 3.24, shuttleSeconds: 3.02, year: 2024 },
  { cmjHeightCm: 74.7, laneAgilitySeconds: 11.52, sprint34Seconds: 3.27, shuttleSeconds: 3.05, year: 2024 },
  { cmjHeightCm: 73.0, laneAgilitySeconds: 11.65, sprint34Seconds: 3.31, shuttleSeconds: 3.09, year: 2024 },
  { cmjHeightCm: 71.3, laneAgilitySeconds: 11.80, sprint34Seconds: 3.35, shuttleSeconds: 3.13, year: 2024 },
  { cmjHeightCm: 69.6, laneAgilitySeconds: 11.96, sprint34Seconds: 3.40, shuttleSeconds: 3.17, year: 2024 },
  { cmjHeightCm: 67.8, laneAgilitySeconds: 12.14, sprint34Seconds: 3.46, shuttleSeconds: 3.22, year: 2024 },
  { cmjHeightCm: 65.9, laneAgilitySeconds: 12.34, sprint34Seconds: 3.52, shuttleSeconds: 3.28, year: 2024 },
  { cmjHeightCm: 63.9, laneAgilitySeconds: 12.56, sprint34Seconds: 3.59, shuttleSeconds: 3.35, year: 2024 },
]

const C: CombineEntry[] = [
  { cmjHeightCm: 84.0, laneAgilitySeconds: 11.10, sprint34Seconds: 3.15, shuttleSeconds: 2.92, year: 2025 },
  { cmjHeightCm: 81.8, laneAgilitySeconds: 11.22, sprint34Seconds: 3.18, shuttleSeconds: 2.95, year: 2025 },
  { cmjHeightCm: 79.6, laneAgilitySeconds: 11.34, sprint34Seconds: 3.21, shuttleSeconds: 2.98, year: 2025 },
  { cmjHeightCm: 77.5, laneAgilitySeconds: 11.46, sprint34Seconds: 3.24, shuttleSeconds: 3.01, year: 2025 },
  { cmjHeightCm: 75.5, laneAgilitySeconds: 11.58, sprint34Seconds: 3.27, shuttleSeconds: 3.04, year: 2025 },
  { cmjHeightCm: 73.6, laneAgilitySeconds: 11.72, sprint34Seconds: 3.31, shuttleSeconds: 3.08, year: 2025 },
  { cmjHeightCm: 71.8, laneAgilitySeconds: 11.88, sprint34Seconds: 3.35, shuttleSeconds: 3.12, year: 2025 },
  { cmjHeightCm: 70.1, laneAgilitySeconds: 12.05, sprint34Seconds: 3.40, shuttleSeconds: 3.16, year: 2025 },
  { cmjHeightCm: 68.4, laneAgilitySeconds: 12.24, sprint34Seconds: 3.45, shuttleSeconds: 3.21, year: 2025 },
  { cmjHeightCm: 66.6, laneAgilitySeconds: 12.45, sprint34Seconds: 3.51, shuttleSeconds: 3.27, year: 2025 },
  { cmjHeightCm: 64.8, laneAgilitySeconds: 12.68, sprint34Seconds: 3.57, shuttleSeconds: 3.33, year: 2025 },
  { cmjHeightCm: 63.0, laneAgilitySeconds: 12.94, sprint34Seconds: 3.64, shuttleSeconds: 3.40, year: 2025 },
  { cmjHeightCm: 82.9, laneAgilitySeconds: 11.16, sprint34Seconds: 3.16, shuttleSeconds: 2.93, year: 2024 },
  { cmjHeightCm: 80.7, laneAgilitySeconds: 11.28, sprint34Seconds: 3.19, shuttleSeconds: 2.96, year: 2024 },
  { cmjHeightCm: 78.6, laneAgilitySeconds: 11.40, sprint34Seconds: 3.22, shuttleSeconds: 2.99, year: 2024 },
  { cmjHeightCm: 76.5, laneAgilitySeconds: 11.52, sprint34Seconds: 3.25, shuttleSeconds: 3.02, year: 2024 },
  { cmjHeightCm: 74.5, laneAgilitySeconds: 11.65, sprint34Seconds: 3.29, shuttleSeconds: 3.06, year: 2024 },
  { cmjHeightCm: 72.6, laneAgilitySeconds: 11.80, sprint34Seconds: 3.33, shuttleSeconds: 3.10, year: 2024 },
  { cmjHeightCm: 70.8, laneAgilitySeconds: 11.96, sprint34Seconds: 3.37, shuttleSeconds: 3.14, year: 2024 },
  { cmjHeightCm: 69.0, laneAgilitySeconds: 12.14, sprint34Seconds: 3.42, shuttleSeconds: 3.19, year: 2024 },
  { cmjHeightCm: 67.2, laneAgilitySeconds: 12.34, sprint34Seconds: 3.48, shuttleSeconds: 3.24, year: 2024 },
  { cmjHeightCm: 65.3, laneAgilitySeconds: 12.56, sprint34Seconds: 3.54, shuttleSeconds: 3.30, year: 2024 },
  { cmjHeightCm: 63.4, laneAgilitySeconds: 12.80, sprint34Seconds: 3.61, shuttleSeconds: 3.37, year: 2024 },
  { cmjHeightCm: 61.4, laneAgilitySeconds: 13.06, sprint34Seconds: 3.68, shuttleSeconds: 3.44, year: 2024 },
  { cmjHeightCm: 59.3, laneAgilitySeconds: 13.35, sprint34Seconds: 3.76, shuttleSeconds: 3.52, year: 2024 },
]

export const COMBINE_HISTORY: Record<Position, CombineEntry[]> = { PG, SG, SF, PF, C }

export function getPercentileRank(
  value: number,
  dataset: number[],
  higherIsBetter: boolean
): { rank: number; total: number; percentile: number } {
  const total = dataset.length
  const rank = higherIsBetter
    ? dataset.filter(v => v > value).length + 1
    : dataset.filter(v => v < value).length + 1
  const percentile = Math.round(((total - rank) / total) * 100)
  return { rank, total, percentile }
}
