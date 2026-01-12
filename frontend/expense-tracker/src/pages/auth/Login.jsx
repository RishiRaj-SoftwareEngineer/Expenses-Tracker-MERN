import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

function Login() {
const[email,setEmail]=React.useState("");
const[password,setPassword]=React.useState("");
const [error,setError]=React.useState("");
const context = React.useContext(UserContext);
const updateUser = context?.updateUser || (() => {});

const navigate = useNavigate();

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();

        if(!validateEmail(email)){
          setError("Please enter a valid email address.");
          return;
        }

        if(!password){
          setError("Please enter your password.");
          return;
        }
        setError("");





        //Login API Call
        try {
            console.log('Attempting login with:', { email, password });
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            });

            console.log('Login response:', response.data);
            const { token, user } = response.data;

            if (token) {
                // Store token in localStorage
                localStorage.setItem('token', token);
                updateUser(user);
                navigate('/home');
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error response:', error.response?.data);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }

    // Close handler
    };


    

  return (
    <AuthLayout>
       <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
       <h3 className="text-3xl md:text-xl font-semibold  text-black">Welcome Back</h3>
       <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Please enter your details to login.
       </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({target}) => setEmail(target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="text"
          />

           <Input
          value={password}
          onChange={({target}) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
       </div>
    </AuthLayout>
  );
}

export default Login;
