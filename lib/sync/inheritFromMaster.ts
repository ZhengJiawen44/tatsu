import ICAL from "ical.js"

/**
 * function that populates the meta property fields of a recurring vevent component, inherits from master for certain properties
 * @param childVeventComponent the component that inherits propertied from the master component
 * @param masterVeventComponent the master component to inherit from 
 */
export default function populateMetaProperties(childVeventComponent: ICAL.Component, masterVeventComponent:ICAL.Component){
    const allMasterProperties = masterVeventComponent.getAllProperties()
    allMasterProperties.forEach((masterProperty)=>{
        const masterPropertyName = masterProperty.name;
        const dateNow = new Date()
        switch(masterPropertyName){

            case "dtstart":
                break;
            case "dtend":
                break;
            case "summary":
                break;

            case "created":
                childVeventComponent.addPropertyWithValue("created", ICAL.Time.fromJSDate(dateNow, true))
                break;
            case "dtstamp":
                childVeventComponent.addPropertyWithValue("dtstamp", ICAL.Time.fromJSDate(dateNow, true))
                break;
            case "last-modified":
                childVeventComponent.addPropertyWithValue("last-modified", ICAL.Time.fromJSDate(dateNow, true))
                break;
            case "UID":
                childVeventComponent.addPropertyWithValue("last-modified", ICAL.Time.fromJSDate(dateNow, true))

            default:
                childVeventComponent.addPropertyWithValue(masterPropertyName, masterVeventComponent.getFirstPropertyValue(masterPropertyName))
                break;
        }
    })
}