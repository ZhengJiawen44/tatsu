   
   //this here exists for the sole reason:
    //when updating a todo on the server, dtstart/due is expected as either a date, null, or undefined. 
    //null meaning the todo explicitly has no date, undefined meaning date is not changed
    //however
    //the frontend calendar component's date range data type is date|undefined. if user explicitly 
    //sets no date, dtstart would be sent as undefined thereby skipping the crucial update.
export function toValidDateRangeUpdateObject({dtstart, due, dtstartChanged, dueChanged}:{
    dtstart:Date|undefined|null,
    due: Date|undefined|null,
    dtstartChanged:boolean,
    dueChanged:boolean
}){
  let resultDtstart = undefined;
  let resultDue = undefined;

  if(dtstartChanged){
    //dtstart can be null if it was returned from the database
    if(dtstart===undefined || dtstart===null){
      resultDtstart = null;
    }else{
      resultDtstart = dtstart
    }
  }
  if(dueChanged){
    //due can be null if it was returned from the database
    if(due===undefined || dtstart===null){
      resultDue = null;
    }else{
      resultDue = due
    }
  }
  return [resultDtstart, resultDue];
}