import React from 'react';
import { G, Rect, Text,Path } from 'react-native-svg';

import moment from 'moment';

const Tooltip = ({
  // eslint-disable-next-line react/prop-types
  x,
  y,
  data2,
  width,
  height,
  offsetX,
  offsetY,
  tooltipX,
  tooltipY,
  index,
  color
}) => {
  let xAxis = 4;



  console.log("tooltipX: "+tooltipX+" tooltipY: "+tooltipY)
  var path =null
  if(offsetX == 0 && offsetY == 0){
     path = "M"+0+","+6+"L"+6+","+0
  }else if(offsetX == -1 && offsetY == 0){
    path = "M"+(width-6)+","+0+"L"+width+","+6
  }else if(offsetX == 0 && offsetY == -1){
    path = "M"+0+","+(height-6)+"L"+6+","+height
  }else{ //-1 and -1
    path = "M"+(width-6)+","+height+"L"+width+","+(height-6)
  }
  return (
    (tooltipX != undefined) ? <G x={x + offsetX*width} y={y+offsetY*height}>
      <G>
        <Rect x={0} y={0} height={height} width={width} stroke={color} fill={'white'}  />
        <Path d={path} stroke={color} strokeWidth={2}/>
        <Text x={6} y={14} fontSize='12' stroke={color}>
          {data2[index]+" , "+tooltipY}
        </Text>
      </G>
    </G>:null
  );
};


export default Tooltip;
