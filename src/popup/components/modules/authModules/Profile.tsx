import { useAuth } from '@/popup/context/AuthContext/useAuth';

const Profile = () => {

    const { userData } = useAuth();

    return (
        <div className="flex flex-row gap-2">
            {userData?.picture && <img src={userData.picture} alt="" className="rounded-full w-16 h-16"/>}
            <div className="flex flex-col">
                <h2 className='font-bold'> {userData?.name} </h2>
                <h4> {userData?.email} </h4>
            </div>                
        </div>
    )
}

export default Profile;