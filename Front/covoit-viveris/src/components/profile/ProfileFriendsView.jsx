import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";

export function ProfileFriendsView(friend){
    
    const { user } = useUser();
    const [commonCarshares, setCommonCarshares] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/common-carshares/" + friend.friendUser.uid + "-" + user.uid)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setCommonCarshares(data);
            });
    }, [friend, user]);

    return (
        <React.Fragment>
            {friend && user && commonCarshares &&
                <div className="friend-small">
                    <img src={`../../src/images/background_profile/background_${friend.friendUser.picture_background}.png` } width="100%"/>
                    <div className="center-div-picture" style={{ marginTop: "-55px" }}>
                        <img src="../../src/images/profil_picture.png" alt="Photo profil" width="100px"/>
                        <p className={`color-company`} style={{ marginTop: "-38px" }}><strong style={{ fontSize:"10px" }}>{/*{friend.friendUser.level}*/}</strong></p> 
                    </div>
                    <div className="row center-div-picture" style={{ marginTop: "-10px" }}>
                        <p className="center"><strong style={{ fontSize: "14px" }}>{friend.friendUser.pseudo}</strong></p>
                        <p className="center" style={{ fontSize:  "10px" }}>{commonCarshares.length} covoiturages en commun </p>
                    </div>
                </div>
            }

        </React.Fragment>
    );
}
