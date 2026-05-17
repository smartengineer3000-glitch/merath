import { View, Text } from "react-native";
import React from 'react';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

type Props = {
  data: { label: string; value: number; color: string }[];
  size?: number;
};

export const PieChart = ({ data, size = 200 }: Props) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativeAngle = 0;

  return (
    <View style={{ alignItems: 'center', marginVertical: 16 }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((item, index) => {
          const percentage = item.value / total;
          const angle = percentage * 360;
          const startAngle = cumulativeAngle;
          cumulativeAngle += angle;
          // Simplification: just draw colored circles or a basic arc
          // For a real pie chart, use a library like react-native-svg-charts
          return (
            <Circle
              key={index}
              cx={size/2}
              cy={size/2}
              r={size/2}
              fill={item.color}
              stroke="#fff"
              strokeWidth={2}
              opacity={0.7}
              // In a real scenario, use path arcs
            />
          );
        })}
      </Svg>
      {/* Legend */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
        {data.map((item, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
            <View style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 6 }} />
            <Text style={{ marginLeft: 4, fontSize: 12 }}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
