"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { InputBox, PasswordBox, Buttons } from "@/components/RenderFroms";
import { Formik } from "formik";
import * as Yup from "yup";
import { MdOutlineMail } from "react-icons/md";
import { signIn } from "next-auth/react";
const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

const Page: React.FC = (props: any) => {
  const [loading, setLoading] = useState(false)

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(5, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const onPressHandle = async (values: any) => {
    setLoading(true)
    signIn("credentials", { ...values, callbackUrl: `${origin}/admin` })
  };

  return (
    <Formik
      initialValues={{ email: "a1@demo.com", password: "Demo@123" }}
      validationSchema={validationSchema}
      onSubmit={(values) => onPressHandle(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <div className="bg-white">
          <div className="flex items-center justify-center h-screen">
            <div className="w-1/4 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="w-full p-4">
                <Link className="mb-5.5 flex justify-center items-center" href="/">
                  <Image
                    className="hidden dark:block"
                    src={"/images/Logo.svg"}
                    alt="Logo"
                    width={176}
                    height={32}
                  />
                  <Image
                    className="dark:hidden"
                    src={"/images/Logo.svg"}
                    alt="Logo"
                    width={176}
                    height={32}
                  />
                </Link>
                <div className="mb-4">
                  <InputBox
                    error={errors.email}
                    label="Email"
                    placeholder="Enter your email"
                    icon={<MdOutlineMail />}
                    name="email"
                  />
                </div>
                <div className="mb-4">
                  <PasswordBox
                    error={errors.password}
                    label="Password"
                    placeholder="Enter your Password"
                    name="password"
                  />
                </div>
                <div className="mb-4">
                  <Buttons value={"Sign In"} loading={loading} onClick={handleSubmit} />
                </div>
                <div className="mt-6 text-center">
                  <p>
                    <Link href="/auth/forget-password" className="text-primary">
                      Forget Password
                    </Link>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default Page;
