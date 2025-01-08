import { useRef } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/Button";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

function Signup() {
    const BACKEND_URL="http://localhost:3000";
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const genderRef = useRef(null);

    const navigate = useNavigate();
    
    async function signup() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const gender = genderRef.current?.value;

        try {
            await axios.post(BACKEND_URL + "/user/signup", {
                username,
                password,
                gender
            });
            alert("You have signed up!");
            navigate("/login");
        } catch (error) {
            console.error("Signup failed", error);
        }
    }

    return (
        <div className="bg-gray-100 flex h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="bg-white shadow-md rounded-md p-6">
                    <img className="mx-auto h-12 w-auto" src="https://www.svgrepo.com/show/499664/user-happy.svg" alt="" />
                    <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign up for an account
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
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
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <div className="mt-1">
                                <Input reference={genderRef} placeholder="gender" />
                            </div>
                        </div>

                        <div>
                            <Button onClick={signup} size="md" variant="primary" title="Signup" fullWidth={true} />
                        </div>
                        <Link to="/login" className="text-center text-sm text-blue-500 hover:text-blue-700">Already have an account? Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
