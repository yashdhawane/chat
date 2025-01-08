import { useRef } from "react";

import axios from "axios";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
    const BACKEND_URL="http://localhost:3000";
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();

    async function signin() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        try {
            const response = await axios.post(BACKEND_URL + "/user/login", {
                username,
                password
            });

            const jwt = response.data.token;
            console.log("jwt token in frontend", jwt);
            localStorage.setItem("token", jwt);
            axios.interceptors.request.use(
                config => {
                  const token = localStorage.getItem('token');
                  if (token) {
                    config.headers.Authorization = `${token}`;
                  }
                  return config;
                },
                error => {
                  return Promise.reject(error);
                }
              );
            navigate("/chat");
        } catch (error) {
            console.error("Signin failed", error);
        }
    }

    return (
        <div className="bg-gray-100 flex h-screen items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-md rounded-md p-8">
                    <img className="mx-auto h-12 w-auto" src="https://www.svgrepo.com/show/499664/user-happy.svg" alt="" />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>

                    <div className="space-y-6 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1">
                                <Input reference={usernameRef} placeholder="Username" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1">
                                <Input reference={passwordRef} placeholder="Password" />
                            </div>
                        </div>

                        <div>
                            <Button onClick={signin} size="md" variant="primary" title="Signin" fullWidth={true} />
                        </div>
                        <Link to="/signup" className="text-center text-sm text-blue-500 hover:text-blue-700">Create new account</Link>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
