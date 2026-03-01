import type { AlgorithmVisualization } from '../types';
import { ClosestPairOfPointsVisualization } from './closestPairOfPoints';
import { ConvexHullVisualization } from './convexHull';
import { ConvexHullJarvisVisualization } from './convexHullJarvis';
import { DelaunayTriangulationVisualization } from './delaunayTriangulation';
import { LineIntersectionVisualization } from './lineIntersection';
import { PointInPolygonVisualization } from './pointInPolygon';
import { VoronoiDiagramVisualization } from './voronoiDiagram';

export const geometryVisualizations: Record<string, () => AlgorithmVisualization> = {
  'closest-pair-of-points': () => new ClosestPairOfPointsVisualization(),
  'convex-hull': () => new ConvexHullVisualization(),
  'convex-hull-jarvis': () => new ConvexHullJarvisVisualization(),
  'delaunay-triangulation': () => new DelaunayTriangulationVisualization(),
  'line-intersection': () => new LineIntersectionVisualization(),
  'point-in-polygon': () => new PointInPolygonVisualization(),
  'voronoi-diagram': () => new VoronoiDiagramVisualization(),
};
