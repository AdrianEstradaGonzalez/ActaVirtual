import React, { useRef, useState } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type SignatureCanvasProps = {
  onEnd?: () => void;
  onOK?: (signature: string) => void;
  penColor?: string;
  minWidth?: number;
  maxWidth?: number;
  backgroundColor?: string;
  disabled?: boolean;
};

type Point = {
  x: number;
  y: number;
};

export const SignatureCanvas = React.forwardRef<any, SignatureCanvasProps>(
  ({ onEnd, onOK, penColor = '#000', backgroundColor = 'transparent', disabled = false }, ref) => {
    const [paths, setPaths] = useState<string[]>([]);
    const [currentPath, setCurrentPath] = useState<Point[]>([]);
    const currentPathRef = useRef<Point[]>([]);
    const isDrawing = useRef(false);
    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabledRef.current,
        onMoveShouldSetPanResponder: () => !disabledRef.current,
        onPanResponderGrant: (evt) => {
          if (disabledRef.current) return;
          isDrawing.current = true;
          const { locationX, locationY } = evt.nativeEvent;
          const start = [{ x: locationX, y: locationY }];
          currentPathRef.current = start;
          setCurrentPath(start);
        },
        onPanResponderMove: (evt) => {
          if (!isDrawing.current) return;
          const { locationX, locationY } = evt.nativeEvent;
          const next = [...currentPathRef.current, { x: locationX, y: locationY }];
          currentPathRef.current = next;
          setCurrentPath(next);
        },
        onPanResponderRelease: () => {
          isDrawing.current = false;
          const cp = currentPathRef.current;
          if (cp && cp.length > 0) {
            const pathData = pointsToSvgPath(cp);
            setPaths((prev) => [...prev, pathData]);
            currentPathRef.current = [];
            setCurrentPath([]);
          }
        },
      })
    ).current;

    const pointsToSvgPath = (points: Point[]): string => {
      if (points.length === 0) return '';
      let path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`;
      }
      return path;
    };

    const clearSignature = () => {
      setPaths([]);
      setCurrentPath([]);
      currentPathRef.current = [];
    };

    const readSignature = () => {
      // Simular un SVG simple como signature
      const allPaths = [...paths];
      if (currentPathRef.current && currentPathRef.current.length > 0) {
        const last = pointsToSvgPath(currentPathRef.current);
        allPaths.push(last);
      }

      const svgData = `<svg width="300" height="150">${allPaths.map(
        (path, i) => `<path key="${i}" d="${path}" stroke="${penColor}" fill="none" stroke-width="2"/>`
      ).join('')}</svg>`;
      onOK?.(svgData);
    };

    // Exponer métodos mediante ref
    React.useImperativeHandle(ref, () => ({
      clearSignature,
      readSignature,
    }));

    const currentPathData = pointsToSvgPath(currentPath);

    return (
      <View style={[styles.container, { backgroundColor }]} {...panResponder.panHandlers}>
        <Svg height="150" width="100%" style={styles.svg}>
          {paths.map((path, index) => (
            <Path
              key={index}
              d={path}
              stroke={penColor}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentPathData && (
            <Path
              d={currentPathData}
              stroke={penColor}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: '100%',
  },
  svg: {
    flex: 1,
  },
});

export default SignatureCanvas;
