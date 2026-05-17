import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const Skeleton = ({ width = 100, height = 20 }: { width?: number; height?: number }) => {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const bg = shimmer.interpolate({ inputRange: [0, 1], outputRange: ['#E0E0E0', '#F0F0F0'] });
  return <Animated.View style={{ width, height, backgroundColor: bg, borderRadius: 4, marginBottom: 8 }} />;
};

export const ResultsSkeleton = () => (
  <View style={{ padding: 24 }}>
    <Skeleton width={200} height={40} />
    <Skeleton width={150} height={30} />
    <Skeleton width={300} height={20} />
    <Skeleton width={300} height={20} />
    <Skeleton width={300} height={20} />
  </View>
);
