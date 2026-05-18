import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

type PieData = { label: string; value: number; color: string };

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => ({
  x: cx + r * Math.cos((angle - 90) * Math.PI / 180),
  y: cy + r * Math.sin((angle - 90) * Math.PI / 180),
});

const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${cx} ${cy}`;
};

export const PieChart = ({ data, size = 200 }: { data: PieData[]; size?: number }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;
  let cumulativeAngle = 0;

  return (
    <View style={{ alignItems: 'center', marginVertical: 16 }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((item, index) => {
          const sliceAngle = (item.value / total) * 360;
          const path = describeArc(size/2, size/2, size/2 - 5, cumulativeAngle, cumulativeAngle + sliceAngle);
          cumulativeAngle += sliceAngle;
          return <Path key={index} d={path} fill={item.color} stroke="#fff" strokeWidth={2} />;
        })}
      </Svg>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
        {data.map((item, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 4 }}>
            <View style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 6, marginRight: 4 }} />
            <Text style={{ fontSize: 12 }}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
