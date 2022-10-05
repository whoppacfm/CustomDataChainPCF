//React
import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom/client';
import {Dialog, DialogType, DialogFooter} from 'office-ui-fabric-react/lib/Dialog'

//-------------------------
//Testing/System/DataSource
//-------------------------
var DATA_SOURCE = "CRM"
let href = window!.top!.location.href;
if(href.indexOf("127.") > -1 || href.indexOf("localhost") > -1) {
    DATA_SOURCE="TEST";
}
var CRM_TEST_MODE = 0;

//-------------------------
//Data Definitions
//-------------------------
class CCustomDataElement {
    id:number;
    label:string;
    type:string;
    value:string;
    constructor(id?:number, label?:string, type?:string, value?:string) {
        if(id) {
            this.id = id;
        }
        if(label) {
            this.label = label;
        }
        if(type) {
            this.type = type;
        }
        if(value) {
            this.value = value;
        }
    };
}

function CustomDataChain(props:any) {

    //-------------------------
    //State
    //-------------------------
    const [customDataElements, setCustomDataElements] = React.useState({ 
        elements: new Array<CCustomDataElement>()
    });

    const [showDialogVisible, setShowDialogVisible] = React.useState({ 
        visible: false
    });
    
    //-------------------------
    //Init
    //-------------------------

    //Get current record data
    let currentFntityId = (props.context.mode as any).contextInfo.entityId;
    let currentEntityTypeName = (props.context.mode as any).contextInfo.entityTypeName;
    let currentEntityRecordName = (props.context.mode as any).contextInfo.entityRecordName;

    //Get current control field values

    //Lookup Field Example
    //let lookupfield_currentValue = props.context.parameters.BoundLookupField.raw[0];
    //let lookupfield_currentId = lookupfield_currentValue.id;
    //let lookupfield_currentEntityType = lookupfield_currentValue.entityType;
    //let lookupfield_currentRecordName = lookupfield_currentValue.name;

    //Datetime Example
    //let dateval = context.parameters.date_input_property.raw?.toDateString();

    //Get PCF Config
    /*
    let config_fields:Array<string> = [];
    let config_lists:string = "";

    if(props.context.parameters.Fields.raw!=null) {
        config_fields = props.context.parameters?.Fields?.raw.split(",");
    }

    if(props.context.parameters?.Lists?.raw!=null) {
        config_lists = props.context.parameters?.Lists?.raw;
    }
    */
    
    //Init data / load data
    useEffect(() => {
        if(DATA_SOURCE=="TEST") {
            //Init test data
        }
        else {
            //Load data from crm
            if(props.initialValue!=null && props.initialValue.length>0) {
                customDataElements.elements = JSON.parse(props.initialValue);
            }
        }
    }, []);

    //Get data from store
    /*
    let showStoredata:any;
    if(storeData1!=null && storeData1.customdata!=null && storeData1.customdata.length>0) {
        showStoredata = (storeData1.customdata as Array<CCustomData>).map((item:CCustomData) => {
            return (
                <>
                    <div>{item.customdata1}</div><div>{item.customdata2}</div>
                    <br/><br/>
                </>
            );
        });
    }
    */

    function closeDialog() {
        setShowDialogVisible({visible:false});
    }

    function showDialog() {
        setShowDialogVisible({visible:true});
    }

    let dialogContentStyle:any = { "display":"none", "border": "1px solid #bbbbbb", "marginTop":"20px", "marginBottom":"-20px", "padding":"20px", "text-align":"left" };
    if(showDialogVisible.visible) {
        dialogContentStyle = { "display":"block", "border": "1px solid #bbbbbb", "marginTop":"20px", "marginBottom":"-20px", "padding":"20px", "text-align":"left" };
    }

    let inputBoxStyle:any = {"width":"100px", "float":"left", "margin-left":"20px"};
    let selectBoxStyle:any = {"width":"100px", "float":"left", "margin-left":"20px"};
    let buttonStyle:any = {"width":"100px", "height":"32px", "margin-left":"20px"};
    let contentDiv:any={"text-align":"left", "padding":"20px"};

    const inputLabelRef = useRef(null);
    const selectLabelRef = useRef(null);
    
    function createClick() {
        let labelControl = inputLabelRef.current;
        let selectTypeControl = selectLabelRef.current;

        let labelValue = (labelControl as any)?.value;
        let selectTypeValue = (selectTypeControl as any)?.value;
        
        let id = 1;
        if(customDataElements.elements.length>0) {
            id = Math.max(...customDataElements.elements.map(o => o.id))+1;
        }
        
        let newElement = new CCustomDataElement(id, labelValue, selectTypeValue);
        customDataElements.elements.push(newElement);
        setCustomDataElements({elements:customDataElements.elements});
        
        props.theobj.newvalue = JSON.stringify(customDataElements.elements);
        props.onChange();
        
        (inputLabelRef.current as any).value = "";
        closeDialog();
    }

    return (
        <>
            <div style={contentDiv}>
                <button onClick={showDialog}>Create new data element</button>
                {/* 
                    <ShowNewDataElementDialog context={props.context} closeShowDialog={closeDialog} showDialogVisible={showDialogVisible.visible}></ShowNewDataElementDialog>
                */}
                <div style={dialogContentStyle}>
                    <input ref={inputLabelRef} placeholder="Label" style={inputBoxStyle} id="thelabel" type="text" />
                    <select ref={selectLabelRef} style={selectBoxStyle} id="thedatatype">
                        <option value="text">Text</option>
                        <option value="date">Date</option>
                    </select>
                    <button style={buttonStyle} onClick={createClick}>Create</button>
                </div>
                <br/>
                <br/>
                {/*Custom Data Elements*/}
                {customDataElements.elements.map((element:CCustomDataElement) => (
                    <>
                        <p>{element.label}</p>
                        {element.type == "text" && 
                            <input type="text"></input>
                        }
                        {element.type=="date" &&
                            <input type="date"></input>
                        }
                    </>
                ))}
                <br/>
                <br/>
            </div>
        </>
    );
}

function ShowNewDataElementDialog(props:any) {
    
    const inputLabelRef = useRef(null);
    const selectLabelRef = useRef(null);

    function closeDialog() {
        props.closeShowDialog();
    }
    
    function createClick() {

        let labelControl = inputLabelRef.current;
        let selectTypeControl = selectLabelRef.current;

        let labelValue = (labelControl as any)?.value;
        let selectTypeValue = (selectTypeControl as any)?.value;

        //set store customDataElements.elements CCustomDataElement
        //props.theobj.newvalue = newval;
        //props.onchange();
        
        debugger;
    }

    let dialogContentStyle:any = { "border": "1px solid #bbbbbb", "marginTop":"20px", "marginBottom":"-20px", "padding":"20px" };
    let inputBoxStyle:any = {"width":"100px", "float":"left", "margin-left":"20px"};
    let selectBoxStyle:any = {"width":"100px", "float":"left", "margin-left":"20px"};
    let buttonStyle:any = {"width":"100px", "height":"32px", "margin-left":"20px"};
    let displayname = "Create new data element";

    return (
      <>
        <Dialog
          isOpen={props.showDialogVisible}
          hidden={!props.showDialogVisible}
          onDismiss={ () => closeDialog() } 
          type={DialogType.close} 
          title={displayname} 
          subText='' 
          isBlocking={false} 
          minWidth={600} 
          maxWidth={900} 
          closeButtonAriaLabel='Close'  
          dialogContentProps={{ 
            showCloseButton: true, 
          }} 
        >
          <div style={dialogContentStyle}>
            <input ref={inputLabelRef} placeholder="Label" style={inputBoxStyle} id="thelabel" type="text" />
            <select ref={selectLabelRef} style={selectBoxStyle} id="thedatatype">
                <option value="text">Text</option>
                <option value="date">Date</option>
            </select>
            <button style={buttonStyle} onClick={createClick}>Create</button>
          </div>
          <DialogFooter> 
          </DialogFooter> 
        </Dialog>       
        </>
    )
  }

export function Render(context:any, container:any, theobj:object, onchangefunction:any, initialValue:any) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <div><CustomDataChain context={context} theobj={theobj} onChange={onchangefunction} initialValue={initialValue} /></div>
        , container
      );
}

