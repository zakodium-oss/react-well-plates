import{W as l,j as r,a as b}from"./WellPlate-35ccab5e.js";import"./index-19024494.js";const h={title:"Example/WellPlate",component:l,args:{rows:8,columns:12}};function n(e){return r(l,{...e})}function o(){return r(l,{rows:8,columns:12,wellSize:30,wellStyle:()=>({fontSize:"x-small"})})}function t(){return r(l,{rows:8,columns:12,wellSize:60})}function s(){return r(l,{rows:8,columns:12,wellSize:50,headerText:({position:e})=>{if(e.column>5)return e.column;if(e.column>3)return null;if(e.column>2)return"";if(e.row>6)return e.row;if(e.row===4)return null;if(e.row===3)return""},renderText:({index:e})=>e===0?null:e===1?"":e===2?null:b("div",{style:{fontSize:12},children:[r("div",{children:"test"}),r("div",{children:e})]}),wellStyle:({label:e,wellPlate:a})=>{const u=Math.round(a.getPosition(e,"index")/(a.rows*a.columns)*120+135);return{backgroundColor:`rgb(${u}, ${u}, ${u})`,borderColor:"green",borderWidth:2}}})}var i,c,m;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`function Control(props: IWellPlateProps) {
  return <WellPlate {...props} />;
}`,...(m=(c=n.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var d,f,w;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`function SmallWellPlate() {
  return <WellPlate rows={8} columns={12} wellSize={30} wellStyle={() => ({
    fontSize: 'x-small'
  })} />;
}`,...(w=(f=o.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};var p,P,S;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`function LargeWellPlate() {
  return <WellPlate rows={8} columns={12} wellSize={60} />;
}`,...(S=(P=t.parameters)==null?void 0:P.docs)==null?void 0:S.source}}};var W,g,x;s.parameters={...s.parameters,docs:{...(W=s.parameters)==null?void 0:W.docs,source:{originalSource:`function CustomWellPlate() {
  return <WellPlate rows={8} columns={12} wellSize={50} headerText={({
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
      return null;
    } else if (index === 1) {
      return '';
    } else if (index === 2) {
      return null;
    } else {
      return <div style={{
        fontSize: 12
      }}>
              <div>test</div>
              <div>{index}</div>
            </div>;
    }
  }} wellStyle={({
    label,
    wellPlate
  }) => {
    const factor = Math.round(wellPlate.getPosition(label, 'index') / (wellPlate.rows * wellPlate.columns) * 120 + (255 - 120));
    return {
      backgroundColor: \`rgb(\${factor}, \${factor}, \${factor})\`,
      borderColor: 'green',
      borderWidth: 2
    };
  }} />;
}`,...(x=(g=s.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};const v=["Control","SmallWellPlate","LargeWellPlate","CustomWellPlate"];export{n as Control,s as CustomWellPlate,t as LargeWellPlate,o as SmallWellPlate,v as __namedExportsOrder,h as default};
//# sourceMappingURL=wellPlate.stories-8c3f279a.js.map
