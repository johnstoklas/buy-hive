import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

const UserNotification = ({
    notificationVisible,
    notifStatus,
    notifMessage,
    addFileState
}) => {

    const [isAnimating, setIsAnimating] = useState(false);
    
    useEffect(() => {
        console.log("notif message: ", notifMessage);
    }, [])

    useEffect(() => {
        if (notificationVisible) setIsAnimating(true);
    }, [notificationVisible]);
    

    return (notificationVisible || isAnimating) ? (
        <section id="user-notif-container" className=
        {`${notifStatus ? "user-notif-success-background" : "user-notif-error-background"} 
        ${addFileState ? "user-notif-shift-up" : ""}
        ${notificationVisible ? "visible" : "not-visible"}`}
        onAnimationEnd={() => {
            if (!notificationVisible) setIsAnimating(false);
        }}>
        <div id="user-notif-icon-container" className={notifStatus ? "user-notif-success-border" : "user-notif-error-border"}>
                <FontAwesomeIcon icon={faExclamation} />
            </div>
            {notifMessage}
        </section> 

    ) : (null)
}

export default UserNotification;