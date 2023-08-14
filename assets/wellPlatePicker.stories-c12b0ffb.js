import{M as P,j as l,a as b}from"./WellPlate-35ccab5e.js";import{r as y}from"./index-19024494.js";const C={title:"Example/MultiWellPicker",component:P,args:{rows:8,columns:12,value:[8],disabled:[2]}};function s(e){return l(g,{...e})}function i(){return l(g,{rows:8,columns:12,wellSize:50,renderText:({index:e,label:r})=>b("div",{style:{fontSize:12},children:[l("div",{children:r}),l("div",{children:e})]}),value:[14],disabled:[5,20],rangeSelectionMode:"zone",style:({index:e,wellPlate:r,disabled:t,booked:n,selected:a})=>{const f=r.getPosition(e,"row_column"),o={};return t&&(f.row===1?o.backgroundColor="grey":o.backgroundColor="lightgray"),a&&(o.backgroundColor="pink"),n&&!t&&(o.borderColor="red"),o}})}function g(e){const{value:r,...t}=e,[n,a]=y.useState(r);return l(P,{value:n,onChange:a,...t})}var c,d,u;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`function WellPicker(props: IWellPickerProps) {
  return <StateFullWellPicker {...props} />;
}`,...(u=(d=s.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var p,k,m;i.parameters={...i.parameters,docs:{...(p=i.parameters)==null?void 0:p.docs,source:{originalSource:`function CustomWellPicker() {
  return <StateFullWellPicker rows={8} columns={12} wellSize={50} renderText={({
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
}`,...(m=(k=i.parameters)==null?void 0:k.docs)==null?void 0:m.source}}};const w=["WellPicker","CustomWellPicker"];export{i as CustomWellPicker,s as WellPicker,w as __namedExportsOrder,C as default};
//# sourceMappingURL=wellPlatePicker.stories-c12b0ffb.js.map
