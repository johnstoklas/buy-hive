import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

const UserNotification = ({
    notificationVisible,
    notifStatus,
    notifMessage,
}) => {

    useEffect(() => {
        console.log("notif message: ", notifMessage);
    }, [])

    return (
        <section id="user-notif-container" className={notifStatus ? "user-notif-success-background" : "user-notif-error-background"}>
            <div id="user-notif-icon-container">
                <FontAwesomeIcon icon={faExclamation} />
            </div>
            {notifMessage}
        </section> 

    )
}

export default UserNotification;