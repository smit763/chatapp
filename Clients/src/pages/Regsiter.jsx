import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";
import { useForm } from "react-hook-form";
import { googleAuth, registerUser, validUser } from "../apis/auth";
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs";
import { toast } from "react-toastify";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const pageRoute = useNavigate();

  const handleOnSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await registerUser(data);
      if (response?.data?.token) {
        localStorage.setItem("userToken", response.data.token);
        toast.success("Successfully Registered!");
        pageRoute("/chats");
      } else {
        toast.error("Registration Failed!");
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);

    const checkValidUser = async () => {
      const response = await validUser();
      if (response?.user) {
        window.location.href = "/chats";
      }
    };
    checkValidUser();
  }, []);

  return (
    <div className="bg-[#121418] w-[100vw] h-[100vh] flex justify-center items-center">
      <div className="w-[90%] sm:w-[400px] pl-0 ml-0 h-[400px] sm:pl-0 sm:ml-9 mt-10 relative">
        <div className="absolute -top-7 left-0">
          <h3 className=" text-[25px] font-bold tracking-wider text-[#fff]">
            Register
          </h3>
          <p className="text-[#fff] text-[12px] tracking-wider font-medium">
            Have an Account?{" "}
            <Link className="text-[rgba(0,195,154,1)] underline" to="/login">
              Sign in
            </Link>
          </p>
        </div>
        <form
          className="flex flex-col gap-y-3 mt-[12%]"
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <div className="flex gap-x-2 w-[100%]">
            <input
              className="bg-[#222222] h-[50px] pl-3 text-[#ffff] w-[49%] sm:w-[47%]"
              type="text"
              placeholder="First Name"
              {...register("firstname", { required: "First Name is required" })}
            />
            <input
              className="bg-[#222222] h-[50px] pl-3 text-[#ffff] w-[49%] sm:w-[47%]"
              type="text"
              placeholder="Last Name"
              {...register("lastname", { required: "Last Name is required" })}
            />
          </div>
          {errors.firstname && (
            <p className="text-red-500 text-sm">{errors.firstname.message}</p>
          )}
          {errors.lastname && (
            <p className="text-red-500 text-sm">{errors.lastname.message}</p>
          )}

          <div>
            <input
              className="bg-[#222222] h-[50px] pl-3 text-[#ffff] w-[100%] sm:w-[96.3%]"
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="relative flex flex-col gap-y-3">
            <input
              className="bg-[#222222] h-[50px] pl-3 text-[#ffff] w-[100%] sm:w-[96.3%]"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            <button type="button">
              {!showPass ? (
                <BsEmojiLaughing
                  onClick={() => setShowPass(!showPass)}
                  className="text-[#fff] absolute top-3 right-4 sm:right-6 w-[30px] h-[25px]"
                />
              ) : (
                <BsEmojiExpressionless
                  onClick={() => setShowPass(!showPass)}
                  className="text-[#fff] absolute top-3 right-4 sm:right-6 w-[30px] h-[25px]"
                />
              )}
            </button>
          </div>

          <button
            style={{
              background:
                "linear-gradient(90deg, rgba(0,195,154,1) 0%, rgba(224,205,115,1) 100%)",
            }}
            className="w-[100%] sm:w-[96.3%] h-[50px] font-bold text-[#121418] tracking-wide text-[17px] relative"
            type="submit"
          >
            <div
              style={{ display: isLoading ? "block" : "none" }}
              className="absolute -top-[53px] left-[29.5%] sm:-top-[53px] sm:left-[87px]"
            >
              <lottie-player
                src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json"
                background="transparent"
                speed="1"
                style={{ width: "200px", height: "160px" }}
                loop
                autoplay
              ></lottie-player>
            </div>
            <p
              style={{ display: isLoading ? "none" : "block" }}
              className="test-[#fff]"
            >
              Register
            </p>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
