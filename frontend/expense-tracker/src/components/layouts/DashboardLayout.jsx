import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({activeMenu, children}) => {
    const {user, updateUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                try {
                    const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                    updateUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    // If there's an error, redirect to login
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    <div className="">
        <Navbar activeMenu={activeMenu} />

        <div className="flex">
            <div className="max-[1080px]:hidden">
                <SideMenu activeMenu={activeMenu} />
            </div>

            <div className="grow mx-5">{children}</div>
        </div>
    </div>
  );
}

export default DashboardLayout;
