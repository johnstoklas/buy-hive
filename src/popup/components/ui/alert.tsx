import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAlert } from "../../context/AlertContext/useAlert";
import { faCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const Alert = () => {
    const { alertVisible, alertType, alertMessage } = useAlert();

    if (!alertVisible) return null;

    return (
        <div className={`fixed top-14 left-0 right-0 mx-4 mt-2 p-2 flex z-100 rounded-lg items-center gap-2 ${alertType === "success" ? "bg-[var(--success-color)]" : alertType === "error" ? "bg-[var(--delete-color)]" : ""}`}>
            {alertType === "success" ?
               ( <FontAwesomeIcon icon={faCheck} />) :
               ( <FontAwesomeIcon icon={faCircleExclamation} /> )
            }
            <p> {alertMessage} </p>
        </div> 
    )
}

export default Alert;