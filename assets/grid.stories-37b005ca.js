import{W as a,j as n,a as C,M as S}from"./WellPlate-d2031630.js";import{r as v}from"./index-f80c8c95.js";const G={title:"Example/GridWellPlate",component:a,argTypes:{rows:{defaultValue:8,control:"number"},columns:{defaultValue:12,control:"number"}}};function t(){return n(a,{rows:8,columns:12,displayAsGrid:!0,headerStyle:({position:e})=>{if(e.column%2===0&&e.row===-1)return{backgroundColor:"rgb(202, 128, 245)"};if(e.row%2===0&&e.column===-1)return{backgroundColor:"rgb(204, 211, 243)"}},wellStyle:({position:e})=>e.column%2===0&&e.row%2===0?{backgroundColor:"rgb(202, 169, 204)"}:e.column%2===0&&e.row%2!==0?{backgroundColor:"rgb(202, 128, 245)"}:e.column%2!==0&&e.row%2===0?{backgroundColor:"rgb(204, 211, 243)"}:{backgroundColor:"white"}})}function i(){return n(a,{displayAsGrid:!0,rows:8,columns:12,wellSize:50,headerText:({position:e})=>{if(e.column>5)return e.column;if(e.column>3)return null;if(e.column>2)return"";if(e.row>6)return e.row;if(e.row===4)return null;if(e.row===3)return""},renderText:({index:e})=>{if(e!==0)return e===1?null:e===2?"":C("div",{style:{fontSize:12},children:[n("div",{children:"test"}),n("div",{children:e})]})},wellStyle:({wellPlate:e,index:o})=>{const r=Math.round(o/(e.rows*e.columns)*120+135);return{backgroundColor:`rgb(${r}, ${r}, ${r})`}}})}function s(){return n(x,{displayAsGrid:!0,rows:8,columns:12,wellSize:50,renderText:({index:e,label:o})=>C("div",{style:{fontSize:12},children:[n("div",{children:o}),n("div",{children:e})]}),value:[14],disabled:[5,20],rangeSelectionMode:"zone",style:({index:e,wellPlate:o,disabled:r,booked:u,selected:d})=>{const P=o.getPosition(e,"row_column"),l={};return r&&(P.row===1?l.backgroundColor="grey":l.backgroundColor="lightgray"),d&&(l.backgroundColor="pink"),u&&!r&&(l.borderColor="red"),l}})}function x(e){const{value:o,...r}=e,[u,d]=v.useState(o);return n(S,{value:u,onChange:d,...r})}var c,f,m;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`function GridWellPlate() {
  return <WellPlate rows={8} columns={12} displayAsGrid headerStyle={({
    position
  }) => {
    if (position.column % 2 === 0 && position.row === -1) {
      return {
        backgroundColor: 'rgb(202, 128, 245)'
      };
    }
    if (position.row % 2 === 0 && position.column === -1) {
      return {
        backgroundColor: 'rgb(204, 211, 243)'
      };
    }
  }} wellStyle={({
    position
  }) => {
    if (position.column % 2 === 0 && position.row % 2 === 0) {
      return {
        backgroundColor: 'rgb(202, 169, 204)'
      };
    } else if (position.column % 2 === 0 && position.row % 2 !== 0) {
      return {
        backgroundColor: 'rgb(202, 128, 245)'
      };
    } else if (position.column % 2 !== 0 && position.row % 2 === 0) {
      return {
        backgroundColor: 'rgb(204, 211, 243)'
      };
    } else {
      return {
        backgroundColor: 'white'
      };
    }
  }} />;
}`,...(m=(f=t.parameters)==null?void 0:f.docs)==null?void 0:m.source}}};var g,w,b;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`function CustomGridWellPlate() {
  return <WellPlate displayAsGrid rows={8} columns={12} wellSize={50} headerText={({
    position
  }) => {
    if (position.column > 5) {
      return position.column;
    } else if (position.column > 3) {
      return null;
    } else if (position.column > 2) {
      return '';
    } else if (position.row > 6) {
      return position.row;
    } else if (position.row === 4) {
      return null;
    } else if (position.row === 3) {
      return '';
    }
  }} renderText={({
    index
  }) => {
    if (index === 0) {
      return undefined;
    } else if (index === 1) {
      return null;
    } else if (index === 2) {
      return '';
    } else {
      return <div style={{
        fontSize: 12
      }}>
              <div>test</div>
              <div>{index}</div>
            </div>;
    }
  }} wellStyle={({
    wellPlate,
    index
  }) => {
    const factor = Math.round(index / (wellPlate.rows * wellPlate.columns) * 120 + (255 - 120));
    return {
      backgroundColor: \`rgb(\${factor}, \${factor}, \${factor})\`
    };
  }} />;
}`,...(b=(w=i.parameters)==null?void 0:w.docs)==null?void 0:b.source}}};var p,k,y;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`function CustomWellPicker() {
  return <StateFullWellPicker displayAsGrid rows={8} columns={12} wellSize={50} renderText={({
    index,
    label
  }) => {
    return <div style={{
      fontSize: 12
    }}>
            <div>{label}</div>
            <div>{index}</div>
          </div>;
  }} value={[14]} disabled={[5, 20]} rangeSelectionMode="zone" style={({
    index,
    wellPlate,
    disabled,
    booked,
    selected
  }) => {
    const position = wellPlate.getPosition(index, 'row_column');
    const styles: CSSProperties = {};
    if (disabled) {
      if (position.row === 1) {
        styles.backgroundColor = 'grey';
      } else {
        styles.backgroundColor = 'lightgray';
      }
    }
    if (selected) {
      styles.backgroundColor = 'pink';
    }
    if (booked && !disabled) {
      styles.borderColor = 'red';
    }
    return styles;
  }} />;
}`,...(y=(k=s.parameters)==null?void 0:k.docs)==null?void 0:y.source}}};const z=["GridWellPlate","CustomGridWellPlate","CustomWellPicker"];export{i as CustomGridWellPlate,s as CustomWellPicker,t as GridWellPlate,z as __namedExportsOrder,G as default};
//# sourceMappingURL=grid.stories-37b005ca.js.map
