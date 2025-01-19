import { isValidENSName } from "thirdweb/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [ens, setEns] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidENSName(ens)) {
            setError("Invalid ENS");
            return;
        }
        setError("");
        // Store ENS in session storage
        sessionStorage.setItem("ens", ens);
        navigate("/");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    return (
        <div className="text-white min-h-screen w-full flex items-center justify-center">
            <div className="w-full max-w-md p-6">
                <div className="flex flex-col items-center space-y-6">
                    {/* Logo Image */}
                    <div className="w-32 h-32">
                        <img
                            src="/unicorn.svg"
                            alt="Unicorn Ethereum Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-center">
                        Your personal ETHDenver assistant
                    </h1>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full space-y-2">
                        <div className="flex gap-2">
                            <input
                                id="ens"
                                type="text"
                                value={ens}
                                onChange={(e) => setEns(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="yourname.ethdenver.com"
                                className="w-full px-4 py-2 text-gray-700 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Enter
                            </button>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm text-center">
                                {error}
                            </p>
                        )}
                    </form>

                    {/* Create Account Link */}
                    <a
                        href="https://app.ethdenver.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                        Create ETHDenver account
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;