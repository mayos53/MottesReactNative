import React from 'react';
import { G, Rect, Text } from 'react-native-svg';

import moment from 'moment';

const Tooltip = ({
  // eslint-disable-next-line react/prop-types
  x,
  y,
  data2,
  tooltipX,
  tooltipY,
  index,
  color
}) => {
  let xAxis = 4;



  console.log("tooltipX: "+tooltipX+" tooltipY: "+tooltipY)
  return (
    (tooltipX != undefined) ? <G x={x} y={y}>
      <G>
        <Rect x={0} y={0} height={22} width={110} stroke={color} fill={'white'}  />
        <Text x={2} y={14} fontSize='12' stroke={color}>
          {data2[index]+" , "+tooltipY}
        </Text>
      </G>
    </G>:null
  );
};


export default Tooltip;
